import { useState, useCallback } from "react";
import { motion } from "motion/react";
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
    finishReading,
    startTalking,
    finishTalking,
    resetDocument,
  } = useAnimationState();

  const { speak, stop } = useTextToSpeech({ pitch: 1.2, rate: 0.95 });

  const [messages, setMessages] = useState<Message[]>([]);
  const [uploadedDoc, setUploadedDoc] = useState<UploadedDocument | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

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
    finishReading();
  }, [finishReading]);

  const handleSendMessage = useCallback(
    async (text: string) => {
      // Stop any ongoing speech
      stop();

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);
      startTalking();

      try {
        const history: ChatMessage[] = messages.map((m) => ({
          role: m.role,
          content: m.text,
        }));

        const response = await sendChatMessage(text, uploadedDoc?.id, history);

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: response.answer,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Speak the response
        speak(response.answer);
      } catch (error) {
        console.error("Chat failed:", error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: "I apologize, but I encountered an error. Please try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        speak("I apologize, but I encountered an error. Please try again.");
      } finally {
        setIsTyping(false);
        finishTalking();
      }
    },
    [messages, uploadedDoc, startTalking, finishTalking, speak, stop]
  );

  const handleRemoveDocument = useCallback(() => {
    setUploadedDoc(null);
    resetDocument();
  }, [resetDocument]);

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
            onFileUpload={handleFileUpload}
            onSendMessage={handleSendMessage}
            onRemoveDocument={handleRemoveDocument}
            className="flex-1"
          />
        </div>
      </div>
    </PageLayout>
  );
}

export default HomePage;
