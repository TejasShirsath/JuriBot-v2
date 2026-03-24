from flask import request, jsonify
from langchain_community.vectorstores import FAISS
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
import os

INDEX_FOLDER = "indexes"
QDRANT_URL = os.getenv("QDRANT_DB_URL")
QDRANT_COLLECTION = os.getenv("QDRANT_COLLECTION")


def get_qdrant_retriever(embeddings, k=5):
    """Get retriever from Qdrant vector store if collection exists."""
    print("\n[QDRANT] Connecting to Qdrant...")
    try:
        client = QdrantClient(url=QDRANT_URL)
        collections = [c.name for c in client.get_collections().collections]
        print(f"[QDRANT] Available collections: {collections}")

        if QDRANT_COLLECTION not in collections:
            print(f"[QDRANT] ERROR: Collection '{QDRANT_COLLECTION}' not found!")
            return None

        print(f"[QDRANT] SUCCESS: Connected to '{QDRANT_COLLECTION}'")
        vector_store = QdrantVectorStore.from_existing_collection(
            embedding=embeddings,
            url=QDRANT_URL,
            collection_name=QDRANT_COLLECTION
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
    data = request.json or {}

    document_id = data.get("document_id")
    question = data["question"]
    history = data.get("history", [])

    print("\n" + "=" * 50)
    print("[CHAT] New request received")
    print(f"[CHAT] Question: {question}")
    print(f"[CHAT] Document ID: {document_id if document_id else 'None'}")

    context = ""
    knowledge_base_context = ""

    # If document_id is provided, retrieve from user's uploaded document (FAISS)
    if document_id:
        print(f"\n[FAISS] Loading user document...")
        index_path = f"{INDEX_FOLDER}/{document_id}"

        db = FAISS.load_local(index_path, embeddings, allow_dangerous_deserialization=True)
        db = FAISS.load_local(index_path, embeddings, allow_dangerous_deserialization=True)

        retriever = db.as_retriever(k=3)
        docs = retriever.invoke(question)
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
