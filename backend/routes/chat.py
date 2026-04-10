from flask import request, jsonify
from langchain_community.vectorstores import FAISS
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
import os
import json
from tools.llm_tools import TOOLS, execute_tool

INDEX_FOLDER = "indexes"
QDRANT_URL = os.getenv("QDRANT_DB_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
QDRANT_COLLECTION = os.getenv("QDRANT_COLLECTION")


def get_qdrant_retriever(embeddings, k=5):
    """Get retriever from Qdrant vector store if collection exists."""
    print("\n[QDRANT] Connecting to Qdrant...")
    try:
        client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
        collections = [c.name for c in client.get_collections().collections]
        print(f"[QDRANT] Available collections: {collections}")

        if QDRANT_COLLECTION not in collections:
            print(f"[QDRANT] ERROR: Collection '{QDRANT_COLLECTION}' not found!")
            return None

        print(f"[QDRANT] SUCCESS: Connected to '{QDRANT_COLLECTION}'")
        vector_store = QdrantVectorStore.from_existing_collection(
            embedding=embeddings,
            url=QDRANT_URL,
            collection_name=QDRANT_COLLECTION,
            api_key=QDRANT_API_KEY
        )
        return vector_store.as_retriever(search_kwargs={"k": k})
    except Exception as e:
        print(f"[QDRANT] CONNECTION ERROR: {e}")
        return None


def chat_route(embeddings, llm):
    """
    Handle chat queries against indexed documents.
    
    Args:
        embeddings: The embeddings model to use for retrieval
        llm: The language model to generate responses
        
    Returns:
        JSON response with answer
    """
    data = request.json or {}

    document_id = data.get("document_id")
    question = data["question"]
    history = data.get("history", [])
    selected_tool = data.get("selected_tool")  # "cost_estimator" or "verdict_analytics"

    print("\n" + "=" * 50)
    print("[CHAT] New request received")
    print(f"[CHAT] Question: {question}")
    print(f"[CHAT] Document ID: {document_id if document_id else 'None'}")
    print(f"[CHAT] Selected Tool: {selected_tool if selected_tool else 'None'}")

    context = ""
    knowledge_base_context = ""

    # If document_id is provided, retrieve from user's uploaded document (FAISS)
    if document_id:
        print(f"\n[FAISS] Loading user document...")
        index_path = f"{INDEX_FOLDER}/{document_id}"

        db = FAISS.load_local(index_path, embeddings, allow_dangerous_deserialization=True)

        retriever = db.as_retriever(k=3)
        docs = retriever.invoke(question)

        context = "\n\n".join([d.page_content for d in docs])
        print(f"[FAISS] Retrieved {len(docs)} chunks from user document")
    else:
        print("\n[FAISS] No user document - skipping")

    # Always retrieve from Qdrant knowledge base (legal codes, sections, etc.)
    print("\n[STEP] Retrieving from Knowledge Base (Indian Laws)...")
    qdrant_retriever = get_qdrant_retriever(embeddings, k=5)
    if qdrant_retriever:
        kb_docs = qdrant_retriever.invoke(question)
        if kb_docs:
            knowledge_base_context = "\n\n".join([d.page_content for d in kb_docs])
            print(f"[QDRANT] Retrieved {len(kb_docs)} chunks from knowledge base")
            print(f"[QDRANT] Context preview: {knowledge_base_context[:200]}...")
        else:
            print("[QDRANT] No relevant chunks found")
    else:
        print("[QDRANT] Retriever not available!")

    # Build conversation history string
    history_text = ""
    if history:
        history_text = "\n\nConversation History:\n"
        for msg in history:
            role_label = "User" if msg["role"] == "user" else "Assistant"
            history_text += f"{role_label}: {msg['content']}\n"

    # Tailor the instructions depending on available context
    document_section = ""
    knowledge_section = ""

    if context:
        # User uploaded a document - prioritize it
        print("\n[MODE] User Document + Knowledge Base")
        system_instructions = (
            "You are Juribot, a legal assistant. Use the user's uploaded document "
            "and legal knowledge base below to answer the question. Prioritize "
            "information from the user's document. If the context does not contain "
            "the answer, say you are unsure instead of making things up."
        )
        document_section = f"User's Document Context:\n{context}\n\n"
    elif knowledge_base_context:
        # No user document, but we have knowledge base
        print("\n[MODE] Knowledge Base Only")
        system_instructions = (
            "You are Juribot, a legal assistant. Use the legal knowledge base "
            "context below (which includes Indian Penal Code, BNS sections, and "
            "other legal references) to answer the question accurately. If the "
            "context does not contain the answer, say you are unsure instead of "
            "making things up."
        )
    else:
        # No context at all - general legal assistant
        print("\n[MODE] NO CONTEXT - Using general LLM knowledge")
        system_instructions = (
            "You are Juribot, a general legal assistant. Answer questions "
            "based on your legal knowledge. If you are unsure or the "
            "question requires specific professional advice, encourage the "
            "user to consult a qualified lawyer."
        )

    if knowledge_base_context:
        knowledge_section = f"Legal Knowledge Base:\n{knowledge_base_context}\n\n"

    # Handle tool selection - Direct execution approach
    if selected_tool:
        print(f"\n[TOOL] Tool selected: {selected_tool}")
        print("[TOOL] Asking LLM to extract parameters from question...")
        
        # Create a structured prompt to extract parameters
        if selected_tool == "cost_estimator":
            extraction_prompt = f"""Extract the following parameters from the user's question for cost estimation:

User Question: "{question}"

Required parameters:
- case_type: Type of case (civil, criminal, family, corporate, property, labor, tax, constitutional)
- jurisdiction: Court level (district_court, high_court, supreme_court, tribunal)
- location: Region (metro, tier1, tier2, rural)
- complexity: Complexity level (low, medium, high, very_high)
- duration_months: Expected duration in months (number)
- lawyer_level: Lawyer experience (junior, mid_level, senior, expert)

Respond ONLY with valid JSON in this exact format:
{{
  "case_type": "value",
  "jurisdiction": "value",
  "location": "value",
  "complexity": "value",
  "duration_months": number,
  "lawyer_level": "value"
}}

If any parameter cannot be determined, make a reasonable assumption based on the question."""

        elif selected_tool == "verdict_analytics":
            extraction_prompt = f"""Extract the following parameters from the user's question for verdict analytics:

User Question: "{question}"

Required parameters:
- category: Case category (civil, criminal, family, property, etc.)
- jurisdiction: Court level (district_court, high_court, supreme_court, etc.)
- key_facts_summary: Brief summary of key facts (can be empty if not provided)

Respond ONLY with valid JSON in this exact format:
{{
  "category": "value",
  "jurisdiction": "value",
  "key_facts_summary": "value or empty string"
}}"""

        else:
            return jsonify({
                "error": f"Invalid tool: {selected_tool}"
            }), 400
        
        # Call LLM to extract parameters
        try:
            print("[TOOL] Sending extraction prompt to LLM...")
            extraction_response = llm.invoke(extraction_prompt)
            extracted_text = extraction_response.content.strip()
            
            print(f"[TOOL] LLM response: {extracted_text}")
            
            # Parse JSON from response
            # Clean up markdown code blocks if present
            if "```json" in extracted_text:
                extracted_text = extracted_text.split("```json")[1].split("```")[0].strip()
            elif "```" in extracted_text:
                extracted_text = extracted_text.split("```")[1].split("```")[0].strip()
            
            tool_args = json.loads(extracted_text)
            print(f"[TOOL] Extracted parameters: {json.dumps(tool_args, indent=2)}")
            
            # Execute the tool
            print(f"[TOOL] Executing {selected_tool}...")
            tool_result = execute_tool(selected_tool, tool_args)
            
            print(f"[TOOL] Tool execution completed: {tool_result.get('status')}")
            
            if tool_result.get("status") == "error":
                error_msg = tool_result.get("message", "Unknown error")
                return jsonify({
                    "answer": f"I encountered an error while using the {selected_tool} tool: {error_msg}",
                    "tool_result": tool_result
                })
            
            # Generate a natural language response with the tool result
            explanation_prompt = f"""You are a legal assistant. A user asked: "{question}"

You used the {selected_tool} tool and got the following results:
{json.dumps(tool_result, indent=2)}

Provide a clear, helpful explanation of these results to the user. Be professional and concise. Highlight the key findings."""

            print("[TOOL] Generating explanation...")
            explanation_response = llm.invoke(explanation_prompt)
            
            print("[TOOL] Complete! Returning results...")
            return jsonify({
                "answer": explanation_response.content,
                "tool_result": tool_result
            })
                
        except json.JSONDecodeError as e:
            print(f"[TOOL] JSON parsing error: {e}")
            print(f"[TOOL] Raw response was: {extracted_text}")
            return jsonify({
                "answer": f"I had trouble understanding the parameters from your question. Please be more specific about the case details.",
                "tool_result": {
                    "status": "error",
                    "message": "Failed to parse parameters"
                }
            })
        except Exception as e:
            print(f"[TOOL] Error during tool execution: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({
                "answer": f"I encountered an error while using the {selected_tool} tool: {str(e)}",
                "tool_result": {
                    "status": "error",
                    "message": str(e)
                }
            })

    # Regular chat flow (no tool selected)
    prompt = f"""{system_instructions}

    {document_section}{knowledge_section}{history_text}
    Current Question:
    {question}

    Answer clearly and concisely, taking the conversation history into account if relevant:
    """

    print(f"\n[LLM] Sending prompt ({len(prompt)} chars) to LLM...")
    response = llm.invoke(prompt)
    print(f"[LLM] Response received ({len(response.content)} chars)")
    print("=" * 50 + "\n")

    return jsonify({
        "answer": response.content
    })
