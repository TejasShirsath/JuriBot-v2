import React, { useState, useRef, useEffect } from "react";
import { Send, Globe, Bot, User, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import clsx from "clsx";

export interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

export interface ChatInterfaceProps {
  context?: string;
  initialMessages?: Message[];
  suggestions?: string[];
  placeholder?: string;
  onSendMessage?: (text: string) => Promise<string>; // mock response fnc
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

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  context = "General Legal Assistant",
  initialMessages = [],
  suggestions = [],
  placeholder = "Ask a legal question...",
  onSendMessage,
  className,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      scrollContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Simulate AI delay
    setTimeout(async () => {
      let responseText =
        "This is a simulated response based on the context provided.";

      if (onSendMessage) {
        responseText = await onSendMessage(text);
      } else {
        // Fallback generic responses
        const genericResponses = [
          "Based on the provided documents, this clause appears to be standard.",
          "I recommend consulting with a specialized lawyer for this specific matter.",
          "The legal implications here depend on the jurisdiction.",
          "Could you clarify the specific section you're referring to?",
        ];
        responseText =
          genericResponses[Math.floor(Math.random() * genericResponses.length)];
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  return (
    <div
      className={clsx(
        "flex flex-col bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden h-full",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/50">
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
              {context}
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

          <AnimatePresence>
            {showLanguageMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-stone-100 py-1 z-50 overflow-hidden max-h-64 overflow-y-auto custom-scrollbar"
              >
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
                    <span className="opacity-50 font-serif">
                      {language.text}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-transparent"
      >
        {suggestions.length > 0 && messages.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(suggestion)}
                className="text-left p-4 rounded-xl border border-stone-100 hover:border-gold/30 hover:bg-gold/5 transition-all text-sm text-charcoal/70 hover:text-coffee group"
              >
                <span className="block font-serif mb-1 group-hover:underline decoration-gold/50 underline-offset-4">
                  "{suggestion}"
                </span>
              </button>
            ))}
          </div>
        )}

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
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
              {msg.role === "assistant" ? (
                <Bot size={16} />
              ) : (
                <User size={16} />
              )}
            </div>
            <div
              className={clsx(
                "p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === "assistant"
                  ? "bg-stone-50 text-charcoal rounded-tl-none"
                  : "bg-charcoal text-white rounded-tr-none shadow-md"
              )}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 mr-auto"
          >
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
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-stone-100">
        <div className="relative flex items-center bg-stone-50 rounded-xl border border-stone-200 focus-within:border-gold/50 focus-within:ring-2 focus-within:ring-gold/10 transition-all">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/40"
          />
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim()}
            className="p-2 mr-2 text-coffee hover:bg-coffee/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-center text-charcoal/30 mt-2">
          AI can make mistakes. Please verify important legal information.
        </p>
      </div>
    </div>
  );
};
