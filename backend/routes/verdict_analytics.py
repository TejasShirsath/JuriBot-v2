import json
import os
import re
from flask import request, jsonify
from smolagents import ToolCallingAgent, DuckDuckGoSearchTool, LiteLLMModel
from dotenv import load_dotenv

# Load environment variables from current directory
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

# ----- Smolagent setup (mirrors web_search_agent.py) -----
model = LiteLLMModel(
    model_id= os.getenv("LLM_MODEL"),
    api_key=os.getenv("LLM_API_KEY"),
    #api_base= os.getenv("LLM_API_BASE"),
    temperature=0
)

search_agent = ToolCallingAgent(
    model=model,
    tools=[DuckDuckGoSearchTool()],
)


def _build_search_prompt(category: str, jurisdiction: str, key_facts_summary: str) -> str:
    """Build the prompt sent to the search agent."""
    nice_category = category.replace("_", " ").title()
    nice_jurisdiction = jurisdiction.replace("_", " ").title()

    return f"""
You are a legal research assistant. Search the web for Indian court case data
matching the criteria below and return your findings as **valid JSON only** —
no markdown fences, no commentary outside the JSON.

CRITERIA
--------
• Case category : {nice_category}
• Jurisdiction   : {nice_jurisdiction}
• Key facts      : {key_facts_summary or "N/A"}

REQUIRED JSON SCHEMA
--------------------
{{
  "similar_cases_found": <integer estimate of total relevant cases>,
  "avg_case_duration_years": <float>,
  "outcome_probability_distribution": {{
    "win": <int 0-100>,
    "settled": <int 0-100>,
    "lost": <int 0-100>
  }},
  "top_precedents": [
    {{
      "case_id": "<string>",
      "case_name": "<string>",
      "court": "<string>",
      "year": <int>,
      "status": "allowed | dismissed | settled | pending",
      "summary": "<one-line summary>"
    }}
  ]
}}

INSTRUCTIONS
Return ONLY the JSON object above — no commentary, no markdown fences.
"""


def _extract_json(text: str) -> dict | None:
    """Try to pull a JSON object out of the agent's free-form text."""
    # Strip markdown code fences if present
    text = re.sub(r"```(?:json)?", "", text).strip()
    text = text.strip("`")

    # Find the first { ... } block
    start = text.find("{")
    if start == -1:
        return None
    depth, end = 0, start
    for i, ch in enumerate(text[start:], start):
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                end = i
                break
    try:
        return json.loads(text[start : end + 1])
    except json.JSONDecodeError:
        return None


def _safe_int(val, default=0):
    try:
        return int(val)
    except (TypeError, ValueError):
        return default


def _safe_float(val, default=0.0):
    try:
        return float(val)
    except (TypeError, ValueError):
        return default


def _normalise_response(raw: dict, category: str, jurisdiction: str) -> dict:
    """Ensure the agent output conforms to the promised response schema."""
    dist = raw.get("outcome_probability_distribution", {})
    win = _safe_int(dist.get("win"), 50)
    settled = _safe_int(dist.get("settled"), 30)
    lost = _safe_int(dist.get("lost"), 20)

    # Normalise so percentages add up to 100
    total = win + settled + lost
    if total and total != 100:
        win = round(win * 100 / total)
        settled = round(settled * 100 / total)
        lost = 100 - win - settled

    dominant = max({"win": win, "settled": settled, "lost": lost}.items(), key=lambda x: x[1])

    precedents = []
    for p in raw.get("top_precedents", []):
        precedents.append({
            "case_id": p.get("case_id", "N/A"),
            "case_name": p.get("case_name", "N/A"),
            "court": p.get("court", "N/A"),
            "year": _safe_int(p.get("year"), 0),
            "status": p.get("status", "unknown"),
            "summary": p.get("summary", ""),
        })

    return {
        "status": "success",
        "meta": {
            "category": category,
            "jurisdiction": jurisdiction,
        },
        "summary": {
            "similar_cases_found": _safe_int(raw.get("similar_cases_found"), 0),
            "avg_case_duration_years": _safe_float(raw.get("avg_case_duration_years"), 0.0),
            "dominant_outcome": {
                "label": dominant[0],
                "probability_percent": dominant[1],
            },
        },
        "outcome_probability_distribution": {
            "win": win,
            "settled": settled,
            "lost": lost,
        },
        "top_precedents": precedents,
    }


# ----- Flask route handler -----

def verdict_analytics_route():
    """POST /api/verdict_analytics
    Body: { category, jurisdiction, key_facts_summary }
    """
    data = request.get_json(force=True)

    category = data.get("category", "").strip()
    jurisdiction = data.get("jurisdiction", "").strip()
    key_facts_summary = data.get("key_facts_summary", "").strip()

    if not category or not jurisdiction:
        return jsonify({"status": "error", "message": "category and jurisdiction are required."}), 400

    prompt = _build_search_prompt(category, jurisdiction, key_facts_summary)

    try:
        agent_output = search_agent.run(prompt, max_steps=10)
        agent_text = str(agent_output)

        parsed = _extract_json(agent_text)
        if parsed is None:
            return jsonify({
                "status": "error",
                "message": "Failed to parse structured data from search results.",
                "raw_output": agent_text,
            }), 502

        response = _normalise_response(parsed, category, jurisdiction)
        return jsonify(response), 200

    except Exception as exc:
        return jsonify({"status": "error", "message": str(exc)}), 500