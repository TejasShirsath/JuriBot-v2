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
  tool_result?: any;
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
  history?: ChatMessage[],
  selectedTool?: string | null,
  signal?: AbortSignal
): Promise<ChatResponse> => {
  const payload = {
    question,
    document_id: documentId,
    history,
    selected_tool: selectedTool,
  };
  
  console.log("[API] Sending chat message with payload:", payload);
  
  const response = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    throw new Error("Chat failed");
  }

  const data = await response.json();
  console.log("[API] Received response:", data);
  
  return data;
};
