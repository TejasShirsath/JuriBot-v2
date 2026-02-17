from flask import request, jsonify

from langchain_community.vectorstores import FAISS

INDEX_FOLDER = "indexes"


def chat_route(embeddings, llm):
    """
    Handle chat queries against indexed documents.
    
    Args:
        embeddings: The embeddings model to use for retrieval
        llm: The language model to generate responses
        
    Returns:
        JSON response with answer
    """
    data = request.json

    document_id = data["document_id"]
    question = data["question"]
    history = data.get("history", [])  # list of {"role": "user"|"assistant", "content": "..."}

    index_path = f"{INDEX_FOLDER}/{document_id}"

    db = FAISS.load_local(index_path, embeddings, allow_dangerous_deserialization=True)

    retriever = db.as_retriever(k=3)
    docs = retriever.invoke(question)

    context = "\n\n".join([d.page_content for d in docs])

    # Build conversation history string
    history_text = ""
    if history:
        history_text = "\n\nConversation History:\n"
        for msg in history:
            role_label = "User" if msg["role"] == "user" else "Assistant"
            history_text += f"{role_label}: {msg['content']}\n"

    prompt = f"""
    You are Juribot, a legal assistant.

    Document Context:
    {context}
    {history_text}
    Current Question:
    {question}

    Answer clearly and concisely, taking the conversation history into account if relevant:
    """

    response = llm.invoke(prompt)

    return jsonify({
        "answer": response.content
    })
