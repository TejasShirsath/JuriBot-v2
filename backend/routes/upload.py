from flask import request, jsonify
import uuid
import os
import json
import re
import tempfile

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_core.messages import HumanMessage

INDEX_FOLDER = "indexes"

# Maximum characters to send to the LLM for analysis (to avoid token limits)
MAX_TEXT_FOR_ANALYSIS = 12000

ANALYSIS_PROMPT = """You are a legal document analyst. Analyze the following document text and return a JSON object with EXACTLY this structure. Do NOT include any text outside the JSON.

{{
  "summary": {{
    "summary": "<a concise summary of the document in 3-5 sentences>",
    "key_provisions_simplified": ["<provision 1>", "<provision 2>"],
    "critical_risk_flags": ["<risk 1>", "<risk 2>"]
  }},
  "key_metrics": {{
    "clauses": <number of clauses found, 0 if none>,
    "entities_detected": ["<Entity Name> (<Type: Org/Person/Loc/Date>)"],
    "document_complexity_score": "<score from 1-10 with a one-line justification>"
  }},
  "clause_breakdown": {{
    "clauses": [
      {{
        "clause_title": "<title>",
        "clause_summary": "<one-line summary>"
      }}
    ]
  }}
}}

Rules:
- "summary" and "entities_detected" and "document_complexity_score" are MANDATORY.
- "key_provisions_simplified" and "critical_risk_flags" are optional — include them only if applicable, otherwise omit those keys.
- If no clauses are found, set "clauses" to 0 in key_metrics and return an empty array in clause_breakdown.
- For entities_detected, tag each entity with its type: Org, Person, Loc, or Date.
- Return ONLY valid JSON, no markdown fences, no explanation.

Document text:
\"\"\"
{document_text}
\"\"\"
"""


def _parse_llm_json(raw_text: str) -> dict:
    """Best-effort extraction of a JSON object from LLM output."""
    # Strip markdown code fences if present
    cleaned = re.sub(r"```(?:json)?", "", raw_text).strip().rstrip("`")
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        # Try to find the first { ... } block
        match = re.search(r"\{[\s\S]*\}", cleaned)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                pass
    # Return a safe fallback so the upload still succeeds
    return {
        "summary": {"summary": "Analysis could not be parsed."},
        "key_metrics": {
            "clauses": 0,
            "entities_detected": [],
            "document_complexity_score": "N/A",
        },
        "clause_breakdown": {"clauses": []},
    }


def _analyze_document(full_text: str, word_count: int, llm) -> dict:
    """Send document text to the LLM and return structured analysis."""
    truncated_text = full_text[:MAX_TEXT_FOR_ANALYSIS]

    prompt = ANALYSIS_PROMPT.replace("{document_text}", truncated_text)
    response = llm.invoke([HumanMessage(content=prompt)])
    analysis = _parse_llm_json(response.content)

    # Inject word_count (always computed locally for accuracy)
    if "key_metrics" not in analysis:
        analysis["key_metrics"] = {}
    analysis["key_metrics"]["word_count"] = word_count

    return analysis


def upload_route(embeddings, llm):
    """
    Handle PDF upload, processing, indexing, and LLM-powered analysis.

    Args:
        embeddings: The embeddings model to use for vector indexing
        llm: The LLM instance used for document analysis

    Returns:
        JSON response with document_id and analysis results
    """
    file = request.files["file"]

    document_id = str(uuid.uuid4())
    index_path = f"{INDEX_FOLDER}/{document_id}"

    # Create a temporary file that will be automatically deleted
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        temp_path = temp_file.name
        file.save(temp_path)

    try:
        # Load and process the PDF
        loader = PyPDFLoader(temp_path)
        docs = loader.load()

        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        chunks = splitter.split_documents(docs)

        # Create and save the FAISS index
        db = FAISS.from_documents(chunks, embeddings)
        db.save_local(index_path)

        # ---- Document analysis ----
        full_text = "\n".join(doc.page_content for doc in docs)
        word_count = len(full_text.split())
        analysis = _analyze_document(full_text, word_count, llm)

    finally:
        # Always delete the temporary file, even if an error occurs
        if os.path.exists(temp_path):
            os.remove(temp_path)

    return jsonify({
        "document_id": document_id,
        **analysis,
    })
