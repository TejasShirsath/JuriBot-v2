import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Globe,
  Bot,
  User,
  RefreshCw,
  Paperclip,
  X,
  FileText,
  Square,
  Plus,
  Scale,
  TrendingUp,
} from "lucide-react";
import clsx from "clsx";
import { ToolResultRenderer } from "./ToolResultRenderer";

export interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
  document?: UploadedDocument;
  toolResult?: any;
}

export interface UploadedDocument {
  id: string;
  name: string;
  size: number;
}

interface HomeChatInterfaceProps {
  messages: Message[];
  uploadedDocument: UploadedDocument | null;
  isProcessing: boolean;
  isTyping: boolean;
  isSpeaking: boolean;
  selectedTool: string | null;
  onFileUpload: (file: File) => void;
  onSendMessage: (text: string) => void;
  onRemoveDocument: () => void;
  onStopSpeaking: () => void;
  onToolSelect: (tool: string | null) => void;
  className?: string;
}

const LANGUAGES = [
  { text: "English", lang: "English" },
  { text: "मराठी", lang: "Marathi" },
  { text: "മലയാളം", lang: "Malayalam" },
  { text: "ਪੰਜਾਬੀ", lang: "Punjabi" },
  { text: "বাংলা", lang: "Bengali" },
  { text: "हिन्दी", lang: "Hindi" },
  { text: "தமிழ்", lang: "Tamil" },
  { text: "తెలుగు", lang: "Telugu" },
  { text: "ಕನ್ನಡ", lang: "Kannada" },
  { text: "اردو", lang: "Urdu" },
  { text: "संस्कृतम्", lang: "Sanskrit" },
  { text: "ગુજરાતી", lang: "Gujarati" },
];

const TOOLS = [
  {
    id: "cost_estimator",
    name: "Cost Estimator",
    description: "Estimate legal costs for your case",
    icon: Scale,
  },
  {
    id: "verdict_analytics",
    name: "Verdict Analytics",
    description: "Analyze case outcomes and precedents",
    icon: TrendingUp,
  },
];

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const HomeChatInterface: React.FC<HomeChatInterfaceProps> = ({
  messages,
  uploadedDocument,
  isProcessing,
  isTyping,
  isSpeaking,
  selectedTool,
  onFileUpload,
  onSendMessage,
  onRemoveDocument,
  onStopSpeaking,
  onToolSelect,
  className,
}) => {
  const [inputText, setInputText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showToolMenu, setShowToolMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toolMenuRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      scrollContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Close tool menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        toolMenuRef.current &&
        !toolMenuRef.current.contains(event.target as Node)
      ) {
        setShowToolMenu(false);
      }
    };

    if (showToolMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showToolMenu]);

  const handleSendMessage = useCallback(() => {
    if (!inputText.trim() || isTyping) return;
    onSendMessage(inputText.trim());
    setInputText("");
  }, [inputText, isTyping, onSendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = useCallback(
    (file: File) => {
      if (
        file.type === "application/pdf" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "text/plain"
      ) {
        onFileUpload(file);
      }
    },
    [onFileUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div
      className={clsx(
        "flex flex-col bg-white overflow-hidden h-full relative",
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-coffee/10 border-2 border-dashed border-coffee flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-12 h-12 text-coffee mx-auto mb-2" />
            <p className="text-coffee font-medium">Drop your document here</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-coffee/10 flex items-center justify-center text-coffee">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="font-serif font-bold text-charcoal">
              JuriBot Assistant
            </h3>
            <p className="text-xs text-charcoal/60 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Legal AI Assistant
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="flex items-center gap-2 text-xs font-bold tracking-wider text-charcoal/60 hover:text-coffee transition-colors px-3 py-1.5 rounded-lg hover:bg-stone-100"
          >
            <Globe size={14} />
            {selectedLanguage.toUpperCase()}
          </button>

          {showLanguageMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-stone-100 py-1 z-50 overflow-hidden max-h-64 overflow-y-auto custom-scrollbar">
              {LANGUAGES.map((language) => (
                <button
                  key={language.lang}
                  onClick={() => {
                    setSelectedLanguage(language.lang);
                    setShowLanguageMenu(false);
                  }}
                  className={clsx(
                    "w-full text-left px-4 py-2 text-xs hover:bg-stone-50 transition-colors flex items-center justify-between",
                    selectedLanguage === language.lang
                      ? "text-coffee font-bold bg-coffee/5"
                      : "text-charcoal/80"
                  )}
                >
                  <span>{language.lang}</span>
                  <span className="opacity-50 font-serif">{language.text}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-transparent"
      >
        {messages.length === 0 && !uploadedDocument && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-full bg-coffee/10 flex items-center justify-center text-coffee mb-4">
              <Bot size={32} />
            </div>
            <h3 className="font-serif text-xl font-bold text-charcoal mb-2">
              How can I help you today?
            </h3>
            <p className="text-sm text-charcoal/60 max-w-md">
              Ask me any legal question or upload a document for analysis. I'm
              here to assist with Indian law queries.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={clsx(
              "flex items-start gap-4 max-w-[85%]",
              msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div
              className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                msg.role === "assistant"
                  ? "bg-coffee/10 text-coffee"
                  : "bg-charcoal text-ivory"
              )}
            >
              {msg.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div
              className={clsx(
                "p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === "assistant"
                  ? "bg-stone-50 text-charcoal rounded-tl-none"
                  : "bg-charcoal text-white rounded-tr-none shadow-md"
              )}
            >
              {msg.document && (
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/20">
                  <FileText size={14} className="text-coffee shrink-0" />
                  <span className="truncate max-w-50 font-medium">
                    {msg.document.name}
                  </span>
                  <span className="text-xs opacity-60">
                    ({formatFileSize(msg.document.size)})
                  </span>
                </div>
              )}
              {msg.text}
              {msg.toolResult && (
                <ToolResultRenderer result={msg.toolResult} />
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3 mr-auto">
            <div className="w-8 h-8 rounded-full bg-coffee/10 flex items-center justify-center text-coffee">
              <RefreshCw size={14} className="animate-spin" />
            </div>
            <div className="bg-stone-50 px-4 py-3 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <span
                  className="w-1.5 h-1.5 bg-coffee/40 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></span>
                <span
                  className="w-1.5 h-1.5 bg-coffee/40 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></span>
                <span
                  className="w-1.5 h-1.5 bg-coffee/40 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Document chip */}
      {uploadedDocument && (
        <div className="px-4 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-coffee/10 rounded-lg">
            <FileText size={14} className="text-coffee" />
            <span className="text-xs text-charcoal font-medium truncate max-w-50">
              {uploadedDocument.name}
            </span>
            <span className="text-xs text-charcoal/50">
              ({formatFileSize(uploadedDocument.size)})
            </span>
            <button
              onClick={onRemoveDocument}
              className="p-0.5 hover:bg-coffee/20 rounded transition-colors"
            >
              <X size={12} className="text-coffee" />
            </button>
          </div>
        </div>
      )}

      {/* Tool selection chip */}
      {selectedTool && (
        <div className="px-4 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-coffee/10 rounded-lg">
            {TOOLS.find((t) => t.id === selectedTool)?.icon && (
              React.createElement(
                TOOLS.find((t) => t.id === selectedTool)!.icon,
                { size: 14, className: "text-coffee" }
              )
            )}
            <span className="text-xs text-charcoal font-medium">
              {TOOLS.find((t) => t.id === selectedTool)?.name}
            </span>
            <button
              onClick={() => onToolSelect(null)}
              className="p-0.5 hover:bg-coffee/20 rounded transition-colors"
            >
              <X size={12} className="text-coffee" />
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white border-t border-stone-100 shrink-0">
        <div className="relative flex items-center bg-stone-50 rounded-xl border border-stone-200 focus-within:border-gold/50 focus-within:ring-2 focus-within:ring-gold/10 transition-all">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.docx,.txt"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
              e.target.value = "";
            }}
          />

          {/* Plus button for tools */}
          <div className="relative" ref={toolMenuRef}>
            <button
              onClick={() => setShowToolMenu(!showToolMenu)}
              disabled={isProcessing || isTyping}
              className="p-2 ml-2 text-charcoal/50 hover:text-coffee hover:bg-coffee/10 rounded-lg transition-colors disabled:opacity-50"
              title="Select tool"
            >
              <Plus size={18} />
            </button>

            {/* Tool menu dropdown */}
            {showToolMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-72 bg-white rounded-xl shadow-lg border border-stone-200 py-2 z-50 overflow-hidden">
                {TOOLS.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      console.log("[UI] Tool selected:", tool.id);
                      onToolSelect(tool.id);
                      setShowToolMenu(false);
                    }}
                    className={clsx(
                      "w-full text-left px-4 py-3 hover:bg-stone-50 transition-colors flex items-start gap-3",
                      selectedTool === tool.id && "bg-coffee/5"
                    )}
                  >
                    <div className="w-8 h-8 rounded-lg bg-coffee/10 flex items-center justify-center shrink-0">
                      <tool.icon size={16} className="text-coffee" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-charcoal">
                        {tool.name}
                      </p>
                      <p className="text-xs text-charcoal/60 mt-0.5">
                        {tool.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="p-2 ml-2 text-charcoal/50 hover:text-coffee hover:bg-coffee/10 rounded-lg transition-colors disabled:opacity-50"
            title="Upload document"
          >
            {isProcessing ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <Paperclip size={18} />
            )}
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a legal question..."
            disabled={isTyping}
            className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/40 disabled:opacity-50"
          />
          {(isSpeaking || isTyping) ? (
            <button
              onClick={onStopSpeaking}
              className="p-2 mr-2 bg-charcoal text-white hover:bg-charcoal/80 rounded-lg transition-colors"
              title="Stop"
            >
              <Square size={16} fill="currentColor" />
            </button>
          ) : (
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="p-2 mr-2 text-coffee hover:bg-coffee/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          )}
        </div>
        <p className="text-[10px] text-center text-charcoal/30 mt-2">
          AI can make mistakes. Please verify important legal information.
        </p>
      </div>
    </div>
  );
};
