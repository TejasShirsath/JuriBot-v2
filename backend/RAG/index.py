from pathlib import Path
import os
import shutil
from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient

# Document loaders for different file types
from langchain_community.document_loaders import (
    PyPDFLoader,
    Docx2txtLoader,
    UnstructuredExcelLoader,
    CSVLoader,
    JSONLoader,
    TextLoader
)

load_dotenv("../.env")

# Folder paths
BASE_DIR = Path(__file__).parent
TRAINING_DATA_FOLDER = BASE_DIR / "training_data"
USED_DATA_FOLDER = BASE_DIR / "used_data"

# Ensure folders exist
TRAINING_DATA_FOLDER.mkdir(exist_ok=True)
USED_DATA_FOLDER.mkdir(exist_ok=True)

# Supported file extensions
SUPPORTED_EXTENSIONS = [".pdf", ".docx", ".doc", ".xlsx", ".xls", ".csv", ".json", ".txt"]


def detect_encoding(file_path: Path) -> str:
    """Detect file encoding, fallback to utf-8."""
    try:
        import chardet
        with open(file_path, 'rb') as f:
            result = chardet.detect(f.read(10000))
            return result['encoding'] or 'utf-8'
    except ImportError:
        # Try common encodings
        for encoding in ['utf-8', 'utf-8-sig', 'latin-1', 'cp1252']:
            try:
                with open(file_path, 'r', encoding=encoding) as f:
                    f.read(1000)
                return encoding
            except (UnicodeDecodeError, UnicodeError):
                continue
        return 'utf-8'


def get_document_loader(file_path: Path):
    """Get the appropriate loader based on file extension."""
    ext = file_path.suffix.lower()
    if ext not in SUPPORTED_EXTENSIONS:
        print(f"  - Unsupported file type: {ext}")
        return None

    path_str = str(file_path)

    if ext == ".pdf":
        return PyPDFLoader(file_path=path_str)
    elif ext in [".docx", ".doc"]:
        return Docx2txtLoader(file_path=path_str)
    elif ext in [".xlsx", ".xls"]:
        return UnstructuredExcelLoader(file_path=path_str)
    elif ext == ".csv":
        encoding = detect_encoding(file_path)
        print(f"  - Detected encoding: {encoding}")
        return CSVLoader(file_path=path_str, encoding=encoding)
    elif ext == ".json":
        return JSONLoader(file_path=path_str, jq_schema=".", text_content=False)
    elif ext == ".txt":
        encoding = detect_encoding(file_path)
        return TextLoader(file_path=path_str, encoding=encoding)

    return None


def load_documents_from_folder(folder_path: Path) -> tuple[list, list[Path]]:
    """Load all supported documents from a folder.

    Returns:
        tuple: (list of documents, list of successfully loaded file paths)
    """
    all_docs = []
    processed_files = []

    # Get all files in directory (non-recursive)
    files = [f for f in folder_path.iterdir() if f.is_file()]

    if not files:
        print("No files found in training_data folder.")
        return [], []

    print(f"Found {len(files)} file(s) in training_data folder.")

    for file_path in files:
        print(f"\nProcessing: {file_path.name}")

        try:
            loader = get_document_loader(file_path)
            if loader is None:
                continue

            docs = loader.load()

            # Add source metadata to track which file the document came from
            for doc in docs:
                doc.metadata["source_file"] = file_path.name

            all_docs.extend(docs)
            processed_files.append(file_path)
            print(f"  - Loaded {len(docs)} document(s) from {file_path.name}")

        except Exception as e:
            print(f"  - Error loading {file_path.name}: {str(e)}")
            continue

    return all_docs, processed_files


def move_to_used_folder(file_paths: list[Path]):
    """Move successfully processed files to the used_data folder."""
    for file_path in file_paths:
        destination = USED_DATA_FOLDER / file_path.name

        # Handle duplicate file names by adding a counter
        counter = 1
        original_name = destination.stem
        while destination.exists():
            destination = USED_DATA_FOLDER / f"{original_name}_{counter}{file_path.suffix}"
            counter += 1

        shutil.move(str(file_path), str(destination))
        print(f"  - Moved {file_path.name} to used_data folder")


def create_embeddings_and_store(docs: list):
    """Create vector embeddings and store in Qdrant database."""

    # Split documents into smaller chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    chunks = text_splitter.split_documents(documents=docs)
    print(f"\n3. Created {len(chunks)} chunks from documents.")

    # Initialize embedding model
    embedding_model = OpenAIEmbeddings(
        model=os.getenv("EMBEDDING_MODEL"),
        api_key=os.getenv("LLM_API_KEY"),
        base_url=os.getenv("LLM_API_BASE")
    )

    # Note: if you're changing the embedding model,
    # make sure to change model from chat.py too and delete old
    # collection from vector database, otherwise you will get
    # error of "embedding dimension mismatch"

    # Connect to Qdrant and add documents
    qdrant_url = "http://localhost:6333"
    collection_name = "juri_bot"

    # Check if collection exists, if so add to it, otherwise create new
    client = QdrantClient(url=qdrant_url)
    collections = [c.name for c in client.get_collections().collections]

    if collection_name in collections:
        print(f"4. Adding to existing collection: {collection_name}")
        vector_store = QdrantVectorStore.from_existing_collection(
            embedding=embedding_model,
            url=qdrant_url,
            collection_name=collection_name
        )
        vector_store.add_documents(chunks)
    else:
        print(f"4. Creating new collection: {collection_name}")
        vector_store = QdrantVectorStore.from_documents(
            documents=chunks,
            embedding=embedding_model,
            url=qdrant_url,
            collection_name=collection_name
        )

    print("5. Indexing of documents completed!")
    return vector_store


def main():
    print("=" * 50)
    print("RAG Document Indexing Pipeline")
    print("=" * 50)

    # Step 1: Load all documents from training_data folder
    print("\n1. Loading documents from training_data folder...")
    docs, processed_files = load_documents_from_folder(TRAINING_DATA_FOLDER)

    if not docs:
        print("\nNo documents to process. Add files to training_data folder.")
        return

    print(f"\n2. Total documents loaded: {len(docs)}")

    # Step 2: Create embeddings and store in vector database
    create_embeddings_and_store(docs)

    # Step 3: Move processed files to used_data folder
    print("\n6. Moving processed files to used_data folder...")
    move_to_used_folder(processed_files)

    print("\n" + "=" * 50)
    print("Pipeline completed successfully!")
    print("=" * 50)


if __name__ == "__main__":
    main()
