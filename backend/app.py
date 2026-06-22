from flask import Flask, request, jsonify
print("Starting Flask app...")
from flask_cors import CORS
print("CORS enabled.")
import os
import time
from collections import defaultdict, deque
from threading import Lock
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

RATE_LIMIT_REQUESTS = 30
RATE_LIMIT_WINDOW_SECONDS = 60
request_log = defaultdict(deque)
request_log_lock = Lock()


def _get_client_id():
    # Prefer forwarded IP when behind a reverse proxy.
    forwarded_for = request.headers.get("X-Forwarded-For", "")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.remote_addr or "unknown"


@app.before_request
def rate_limit_per_user():
    if not request.path.startswith("/api/") or request.path == "/api/health":
        return None

    client_id = _get_client_id()
    now = time.time()
    window_start = now - RATE_LIMIT_WINDOW_SECONDS

    with request_log_lock:
        client_requests = request_log[client_id]

        while client_requests and client_requests[0] < window_start:
            client_requests.popleft()

        if len(client_requests) >= RATE_LIMIT_REQUESTS:
            return (
                jsonify(
                    {
                        "error": "Too many requests",
                        "message": "Rate limit exceeded: max 30 requests per minute per user.",
                    }
                ),
                429,
            )

        client_requests.append(now)

    return None


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
