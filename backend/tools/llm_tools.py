"""
LLM Tools - Function calling definitions for Cost Estimator and Verdict Analytics
"""
import json
from typing import Dict, List, Any
from .cost_estimator import predict_cost
from .verdict_analytics import _build_search_prompt, _extract_json, _normalise_response, search_agent

# Tool definitions for OpenAI function calling
TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "cost_estimator",
            "description": "Estimate legal costs for a case based on type, jurisdiction, location, complexity, duration, and lawyer level. Returns breakdown of legal fees, court fees, filing/admin fees, and miscellaneous fees.",
            "parameters": {
                "type": "object",
                "properties": {
                    "case_type": {
                        "type": "string",
                        "description": "Type of legal case (e.g., civil, criminal, family, corporate)",
                        "enum": ["civil", "criminal", "family", "corporate", "property", "labor", "tax", "constitutional"]
                    },
                    "jurisdiction": {
                        "type": "string",
                        "description": "Court jurisdiction level",
                        "enum": ["district_court", "high_court", "supreme_court", "tribunal"]
                    },
                    "location": {
                        "type": "string",
                        "description": "City or region",
                        "enum": ["metro", "tier1", "tier2", "rural"]
                    },
                    "complexity": {
                        "type": "string",
                        "description": "Case complexity level",
                        "enum": ["low", "medium", "high", "very_high"]
                    },
                    "duration_months": {
                        "type": "integer",
                        "description": "Expected case duration in months",
                        "minimum": 1,
                        "maximum": 120
                    },
                    "lawyer_level": {
                        "type": "string",
                        "description": "Experience level of lawyer",
                        "enum": ["junior", "mid_level", "senior", "expert"]
                    }
                },
                "required": ["case_type", "jurisdiction", "location", "complexity", "duration_months", "lawyer_level"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "verdict_analytics",
            "description": "Analyze verdict patterns and predict outcomes for Indian court cases. Searches for similar cases and provides outcome probability distribution (win, settled, lost) and relevant precedents.",
            "parameters": {
                "type": "object",
                "properties": {
                    "category": {
                        "type": "string",
                        "description": "Category of the case (e.g., civil, criminal, family, property)"
                    },
                    "jurisdiction": {
                        "type": "string",
                        "description": "Jurisdiction or court level (e.g., district_court, high_court, supreme_court)"
                    },
                    "key_facts_summary": {
                        "type": "string",
                        "description": "Brief summary of key facts and issues in the case"
                    }
                },
                "required": ["category", "jurisdiction"]
            }
        }
    }
]


def execute_cost_estimator(arguments: Dict[str, Any]) -> Dict[str, Any]:
    """
    Execute cost estimator tool
    
    Args:
        arguments: Tool arguments from LLM
        
    Returns:
        Cost estimation results with breakdown
    """
    try:
        # Prepare input data with placeholders for target fields
        input_data = {
            "case_type": arguments["case_type"],
            "jurisdiction": arguments["jurisdiction"],
            "location": arguments["location"],
            "complexity": arguments["complexity"],
            "duration_months": int(arguments["duration_months"]),
            "lawyer_level": arguments["lawyer_level"],
            # Placeholders for target columns (needed for consistent encoding)
            "legal_fees": 0,
            "court_fees": 0,
            "filing_admin_fees": 0,
            "miscellaneous_fees": 0,
            "total_cost": 0,
        }
        
        predictions = predict_cost(input_data)
        
        return {
            "status": "success",
            "tool": "cost_estimator",
            "data": predictions,
            "visualization": "cost_breakdown"
        }
    except Exception as e:
        return {
            "status": "error",
            "tool": "cost_estimator",
            "message": str(e)
        }


def execute_verdict_analytics(arguments: Dict[str, Any]) -> Dict[str, Any]:
    """
    Execute verdict analytics tool
    
    Args:
        arguments: Tool arguments from LLM
        
    Returns:
        Verdict analytics with outcome probabilities and precedents
    """
    try:
        category = arguments.get("category", "").strip()
        jurisdiction = arguments.get("jurisdiction", "").strip()
        key_facts_summary = arguments.get("key_facts_summary", "").strip()
        
        if not category or not jurisdiction:
            return {
                "status": "error",
                "tool": "verdict_analytics",
                "message": "category and jurisdiction are required"
            }
        
        # Build search prompt
        prompt = _build_search_prompt(category, jurisdiction, key_facts_summary)
        
        # Run agent
        agent_output = search_agent.run(prompt, max_steps=10)
        agent_text = str(agent_output)
        
        # Extract and normalize JSON
        parsed = _extract_json(agent_text)
        if parsed is None:
            return {
                "status": "error",
                "tool": "verdict_analytics",
                "message": "Failed to parse structured data from search results",
                "raw_output": agent_text
            }
        
        response = _normalise_response(parsed, category, jurisdiction)
        response["tool"] = "verdict_analytics"
        response["visualization"] = "verdict_analytics"
        
        return response
        
    except Exception as e:
        return {
            "status": "error",
            "tool": "verdict_analytics",
            "message": str(e)
        }


# Tool execution mapping
TOOL_EXECUTORS = {
    "cost_estimator": execute_cost_estimator,
    "verdict_analytics": execute_verdict_analytics
}


def execute_tool(tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
    """
    Execute a tool by name
    
    Args:
        tool_name: Name of the tool to execute
        arguments: Tool arguments
        
    Returns:
        Tool execution results
    """
    executor = TOOL_EXECUTORS.get(tool_name)
    if not executor:
        return {
            "status": "error",
            "message": f"Unknown tool: {tool_name}"
        }
    
    return executor(arguments)
