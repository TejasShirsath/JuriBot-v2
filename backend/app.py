from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables from current directory
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

# from langchain_huggingface import HuggingFaceEmbeddings
from langchain_openai import OpenAIEmbeddings
from langchain_openai import ChatOpenAI

# Import routes
from routes.upload import upload_route
from routes.chat import chat_route
from routes.cost_estimator import cost_estimator_route
from routes.verdict_analytics import verdict_analytics_route

app = Flask(__name__)
CORS(app)

INDEX_FOLDER = "indexes"

os.makedirs(INDEX_FOLDER, exist_ok=True)

# Embeddings (load once)
embeddings = OpenAIEmbeddings(
        model= os.getenv("EMBEDDING_MODEL"),
        api_key=os.getenv("LLM_API_KEY"),
        base_url=os.getenv("LLM_API_BASE")
    )

# LLM configuration (load once)
llm = ChatOpenAI(
    model= os.getenv("LLM_MODEL"),
    openai_api_key=os.getenv("LLM_API_KEY"),
    openai_api_base= os.getenv("LLM_API_BASE"),
    temperature=0
)

# ---------------- ROUTES ----------------

@app.route("/api/upload", methods=["POST"])
def upload():
    return upload_route(embeddings, llm)

@app.route("/api/chat", methods=["POST"])
def chat():
    return chat_route(embeddings, llm)

@app.route("/api/cost_estimator", methods=["POST"])
def cost_estimator():
    return cost_estimator_route()

@app.route("/api/verdict_analytics", methods=["POST"])
def verdict_analytics():
    return verdict_analytics_route()


if __name__ == "__main__":
    app.run(debug=True, port=8000)
