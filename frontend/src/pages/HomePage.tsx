import { useState, useCallback, useRef } from "react";
import { PageLayout } from "../components/common/PageLayout";
import { LawyerAnimation } from "../components/home/LawyerAnimation";
import { HomeChatInterface } from "../components/home/HomeChatInterface";
import type { Message, UploadedDocument } from "../components/home/HomeChatInterface";
import { useAnimationState } from "../hooks/useAnimationState";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import { uploadDocument, sendChatMessage } from "../services/api";
import type { ChatMessage } from "../services/api";

function HomePage() {
  const {
    currentState,
    startReading,
    freezeReading,
    startTalking,
    finishTalking,
    resetDocument,
  } = useAnimationState();

  const [isSpeaking, setIsSpeaking] = useState(false);

  const { speak, stop } = useTextToSpeech({
    pitch: 1.2,
    rate: 0.95,
    onStart: () => setIsSpeaking(true),
    onEnd: () => {
      setIsSpeaking(false);
      finishTalking();
    },
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [uploadedDoc, setUploadedDoc] = useState<UploadedDocument | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleFileUpload = useCallback(
    async (file: File) => {
      startReading();
      setIsProcessing(true);

      try {
        const response = await uploadDocument(file);
        setUploadedDoc({
          id: response.document_id,
          name: file.name,
          size: file.size,
        });
      } catch (error) {
        console.error("Upload failed:", error);
        finishTalking();
      } finally {
        setIsProcessing(false);
      }
    },
    [startReading, finishTalking]
  );

  const handleReadingComplete = useCallback(() => {
    // Freeze the reading animation on last frame until next animation starts
    freezeReading();
  }, [freezeReading]);

  const handleSendMessage = useCallback(
    async (text: string) => {
      console.log("[HomePage] Sending message with tool:", selectedTool);
      // Stop any ongoing speech
      stop();

      // Cancel any previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Create new abort controller for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        text,
        timestamp: new Date(),
        document: uploadedDoc || undefined,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);
      // Clear uploaded document and selected tool after sending
      setUploadedDoc(null);
      setSelectedTool(null);
      // Don't start talking animation yet - stay idle or frozen until response

      try {
        const history: ChatMessage[] = messages.map((m) => ({
          role: m.role,
          content: m.text,
        }));

        const response = await sendChatMessage(
          text,
          uploadedDoc?.id,
          history,
          selectedTool,
          abortController.signal
        );

        // Check if request was aborted
        if (abortController.signal.aborted) {
          return;
        }

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: response.answer,
          timestamp: new Date(),
          toolResult: response.tool_result,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Start talking animation when response is ready
        startTalking();
        // Speak the response - animation will stop when speech ends via onEnd callback
        speak(response.answer);
      } catch (error) {
        // Don't show error if request was aborted by user
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        
        console.error("Chat failed:", error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: "I apologize, but I encountered an error. Please try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        startTalking();
        speak("I apologize, but I encountered an error. Please try again.");
      } finally {
        if (!abortController.signal.aborted) {
          setIsTyping(false);
        }
        abortControllerRef.current = null;
      }
    },
    [messages, uploadedDoc, selectedTool, startTalking, speak, stop]
  );

  const handleRemoveDocument = useCallback(() => {
    setUploadedDoc(null);
    resetDocument();
  }, [resetDocument]);

  const handleStopSpeaking = useCallback(() => {
    // Abort any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    stop();
    setIsSpeaking(false);
    setIsTyping(false);
    finishTalking();
  }, [stop, finishTalking]);

  const handleToolSelect = useCallback((tool: string | null) => {
    console.log("[HomePage] Tool selected:", tool);
    setSelectedTool(tool);
  }, []);

  return (
    <PageLayout sectionTitle="Chat" backButton={false} fixedHeight={true} className="p-5 max-w-none! w-full">
      <div className="flex-1 flex min-h-0 w-full">
        {/* Left Panel - Lawyer Animation */}
        <div className="hidden lg:flex shrink-0 h-full">
          <LawyerAnimation
            state={currentState}
            onReadingComplete={handleReadingComplete}
          />
        </div>

        {/* Right Panel - Chat Interface */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          <HomeChatInterface
            messages={messages}
            uploadedDocument={uploadedDoc}
            isProcessing={isProcessing}
            isTyping={isTyping}
            isSpeaking={isSpeaking}
            selectedTool={selectedTool}
            onFileUpload={handleFileUpload}
            onSendMessage={handleSendMessage}
            onRemoveDocument={handleRemoveDocument}
            onStopSpeaking={handleStopSpeaking}
            onToolSelect={handleToolSelect}
            className="flex-1"
          />
        </div>
      </div>
    </PageLayout>
  );
}

export default HomePage;
