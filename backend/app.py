from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables from parent directory
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_openai import ChatOpenAI

# Import routes
from routes.upload import upload_route
from routes.chat import chat_route

app = Flask(__name__)
CORS(app)

INDEX_FOLDER = "indexes"

os.makedirs(INDEX_FOLDER, exist_ok=True)

# Embeddings (load once)
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Ollama LLM
llm = ChatOpenAI(
    model="openai/gpt-oss-20b:free",
    openai_api_key=os.getenv("OPENROUTER_API_KEY"),
    openai_api_base="https://openrouter.ai/api/v1",
    temperature=0
)

# ---------------- ROUTES ----------------

@app.route("/upload", methods=["POST"])
def upload():
    return upload_route(embeddings)


@app.route("/chat", methods=["POST"])
def chat():
    return chat_route(embeddings, llm)


if __name__ == "__main__":
    app.run(debug=True, port=8000)
