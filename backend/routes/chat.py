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
    data = request.json or {}

    # document_id is optional: if provided, we use RAG over the uploaded document.
    # If omitted/null, we run a pure "Virtual Counsel" chat without document context.
    document_id = data.get("document_id")
    question = data["question"]
    history = data.get("history", [])  # list of {"role": "user"|"assistant", "content": "..."}

    context = ""
    if document_id:
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

    # Tailor the instructions slightly depending on whether we have document context.
    if context:
        system_instructions = (
            "You are Juribot, a legal assistant. Use the document context "
            "below to answer the user's question. If the document context "
            "does not contain the answer, say you are unsure instead of "
            "making things up."
        )
        document_section = f"Document Context:\n{context}\n\n"
    else:
        system_instructions = (
            "You are Juribot, a general legal assistant. Answer questions "
            "based on your legal knowledge. If you are unsure or the "
            "question requires specific professional advice, encourage the "
            "user to consult a qualified lawyer."
        )
        document_section = ""

    prompt = f"""{system_instructions}

    {document_section}{history_text}
    Current Question:
    {question}

    Answer clearly and concisely, taking the conversation history into account if relevant:
    """

    response = llm.invoke(prompt)

    return jsonify({
        "answer": response.content
    })
