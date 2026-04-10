from flask import Flask, request, jsonify
print("Starting Flask app...")
from flask_cors import CORS
print("CORS enabled.")
import os
from dotenv import load_dotenv

# Load environment variables from current directory
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
print("Environment variables loaded.")

# from langchain_huggingface import HuggingFaceEmbeddings
from langchain_openai import OpenAIEmbeddings
from langchain_openai import ChatOpenAI
print("Langchain models initialized.")

# Import routes
from routes.upload import upload_route
from routes.chat import chat_route
print("Routes initialized.")


app = Flask(__name__)
CORS(app)
print("Flask app initialized.")


INDEX_FOLDER = "indexes"

os.makedirs(INDEX_FOLDER, exist_ok=True)
print(f"Index folder initialized: {INDEX_FOLDER}")

embeddings = OpenAIEmbeddings(
        model= os.getenv("EMBEDDING_MODEL"),
        api_key=os.getenv("LLM_API_KEY"),
        base_url=os.getenv("LLM_API_BASE")
    )

print("Embeddings initialized.")

llm = ChatOpenAI(
    model= os.getenv("LLM_MODEL"),
    openai_api_key=os.getenv("LLM_API_KEY"),
    openai_api_base= os.getenv("LLM_API_BASE"),
    temperature=0
)

print("LLM initialized.")

# ---------------- ROUTES ----------------

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

@app.route("/api/upload", methods=["POST"])
def upload():
    return upload_route(embeddings)

print("Routes set up.")

@app.route("/api/chat", methods=["POST"])
def chat():
    return chat_route(embeddings, llm)

print("Chat route set up.")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    print(f"Starting server on port {port}...")
    app.run(host="0.0.0.0", debug=debug, port=port)
