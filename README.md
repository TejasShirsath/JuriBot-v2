# ⚖️ JuriBot

<div align="center">
  <img src="frontend/public/logo.svg" alt="JuriBot Logo" width="160" height="160">
</div>

**JuriBot** is an AI-powered legal assistant that helps users understand Indian law, analyze legal documents, estimate case costs, and predict verdict outcomes using RAG (Retrieval-Augmented Generation) technology.

---

## ✨ Features

- 🤖 **AI Legal Chat** - Ask questions about Indian law and get accurate answers powered by LLM
- 📄 **Document Analysis** - Upload legal documents (PDF, DOCX, TXT, etc.) and ask questions about them
- 💰 **Cost Estimator** - Get detailed cost breakdowns for legal cases based on type, jurisdiction, and complexity
- 📊 **Verdict Analytics** - Analyze verdict patterns and predict case outcomes using AI-powered search
- 🔐 **Firebase Authentication** - Secure user authentication with Firebase
- 📚 **Knowledge Base** - RAG-powered retrieval from Indian legal codes and precedents using Qdrant

---

## 🏗️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS 4** for styling
- **Firebase** for authentication
- **Framer Motion** for animations
- **Recharts** for data visualization
- **React Router** for navigation

### Backend
- **Flask** (Python) REST API
- **LangChain** for LLM orchestration
- **OpenAI-compatible LLM** for chat and embeddings
- **FAISS** for user document vector storage
- **Qdrant** for knowledge base vector storage
- **spaCy** for NLP processing

---

## 📁 Project Structure

```
JuriBot-v2/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components (Landing, Auth, Home)
│   │   ├── context/          # React context providers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API and Firebase services
│   │   └── lib/              # Utility functions
│   ├── public/               # Static assets
│   └── package.json
│
├── backend/                  # Flask backend application
│   ├── app.py                # Main Flask application
│   ├── routes/
│   │   ├── chat.py           # Chat endpoint with RAG
│   │   └── upload.py         # Document upload endpoint
│   ├── tools/
│   │   ├── llm_tools.py      # LLM tool definitions
│   │   ├── cost_estimator.py # Legal cost estimation
│   │   └── verdict_analytics.py # Verdict prediction
│   ├── RAG/
│   │   ├── index.py          # Document indexing pipeline
│   │   ├── training_data/    # Documents to be indexed
│   │   └── used_data/        # Processed documents
│   ├── indexes/              # FAISS indexes for user uploads
│   └── requirements.txt
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+)
- **Python** (v3.10+)
- **Qdrant** (local or cloud instance)
- **Firebase** project (for authentication)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   
   Create a `.env` file in the `backend/` directory:
   ```env
   LLM_API_KEY=your_openai_api_key
   LLM_API_BASE=https://api.openai.com/v1
   LLM_MODEL=gpt-4
   EMBEDDING_MODEL=text-embedding-3-small
   QDRANT_DB_URL=http://localhost:6333
   QDRANT_COLLECTION=juri_bot
   ```

5. **Start Qdrant (if running locally):**
   ```bash
   docker run -p 6333:6333 qdrant/qdrant
   ```

6. **Index knowledge base (optional):**
   ```bash
   cd RAG
   # Add your legal documents to training_data/
   python index.py
   ```

7. **Run the backend:**
   ```bash
   python app.py
   ```
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

---

## 🔧 API Endpoints

### Chat
```http
POST /api/chat
Content-Type: application/json

{
  "question": "What is Section 302 of IPC?",
  "document_id": "optional_document_id",
  "history": [],
  "selected_tool": null
}
```

### Upload Document
```http
POST /api/upload
Content-Type: multipart/form-data

file: <document_file>
```

### Available Tools
- `cost_estimator` - Estimate legal costs
- `verdict_analytics` - Predict case outcomes

---

## 🛠️ Tools

### Cost Estimator
Estimates legal costs based on:
- Case type (civil, criminal, family, corporate, etc.)
- Jurisdiction (district court, high court, supreme court)
- Location (metro, tier1, tier2, rural)
- Complexity level
- Duration in months
- Lawyer experience level

### Verdict Analytics
Analyzes verdict patterns using:
- Case category
- Court jurisdiction
- Key facts summary
- AI-powered web search for precedents

---

## 📦 Deployment

### Backend (Vercel/Railway)
The backend includes a `vercel.json` configuration for serverless deployment.

### Frontend (Vercel)
The frontend includes a `vercel.json` for static deployment with proper routing.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## ⚠️ Disclaimer

JuriBot is an AI assistant and should not be considered a substitute for professional legal advice. Always consult a qualified lawyer for legal matters.
