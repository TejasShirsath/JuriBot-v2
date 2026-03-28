from flask import request, jsonify
import uuid
import os
import tempfile

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS

INDEX_FOLDER = "indexes"

def upload_route(embeddings):
    """
    Handle PDF upload, processing, and indexing.

    Args:
        embeddings: The embeddings model to use for vector indexing

    Returns:
        JSON response with document_id
    """
    file = request.files["file"]

    document_id = str(uuid.uuid4())
    index_path = f"{INDEX_FOLDER}/{document_id}"

    # Create a temporary file that will be automatically deleted
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        temp_path = temp_file.name
        file.save(temp_path)

    try:
        # Load and process the PDF
        loader = PyPDFLoader(temp_path)
        docs = loader.load()

        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        chunks = splitter.split_documents(docs)

        # Create and save the FAISS index
        db = FAISS.from_documents(chunks, embeddings)
        db.save_local(index_path)

    finally:
        # Always delete the temporary file, even if an error occurs
        if os.path.exists(temp_path):
            os.remove(temp_path)

    return jsonify({
        "document_id": document_id,
    })
