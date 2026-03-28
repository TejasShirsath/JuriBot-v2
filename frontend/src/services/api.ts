const API_BASE = "http://localhost:8000/api";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface UploadResponse {
  document_id: string;
}

export interface ChatResponse {
  answer: string;
}

export const uploadDocument = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  return response.json();
};

export const sendChatMessage = async (
  question: string,
  documentId?: string,
  history?: ChatMessage[]
): Promise<ChatResponse> => {
  const response = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      document_id: documentId,
      history,
    }),
  });

  if (!response.ok) {
    throw new Error("Chat failed");
  }

  return response.json();
};
