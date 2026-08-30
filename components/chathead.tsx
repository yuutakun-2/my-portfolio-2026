"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { X, Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Gemini spark SVG (inline, theme-aware via currentColor)
const GeminiSvg = ({ className = "w-7 h-7" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 24A14.304 14.304 0 0 0 0 12 14.304 14.304 0 0 0 12 0a14.305 14.305 0 0 0 12 12 14.305 14.305 0 0 0-12 12" />
  </svg>
);

export function Chathead({ portfolio }: { portfolio: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "model"; parts: { text: string }[] }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage = { role: "user" as const, parts: [{ text: content }] };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          portfolioData: portfolio,
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      // Add a placeholder message for the model
      setMessages((prev) => [
        ...prev,
        { role: "model", parts: [{ text: "" }] },
      ]);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunkValue = decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            const last = updated[lastIndex];
            if (last.role === "model") {
              updated[lastIndex] = {
                ...last,
                parts: [{ text: last.parts[0].text + chunkValue }],
              };
            }
            return updated;
          });
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to extract text content
  const getMessageText = (m: any): string => {
    if (Array.isArray(m.parts) && m.parts[0]?.text) {
      return m.parts[0].text;
    }
    return "";
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        sendMessage(input);
      }
    }
  };

  const AIIcon = () => <span className="text-xl inline-block">👨‍💻</span>;

  const suggestedInquiries = [
    "What are your top skills?",
    "Where have you worked?",
    "Tell me about your projects.",
  ];

  const handleSuggestionClick = (q: string) => {
    sendMessage(q);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-80 sm:w-96 rounded-2xl overflow-hidden backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] flex flex-col h-[500px] max-h-[70vh]"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/20 dark:border-white/10 flex justify-between items-center bg-white/40 dark:bg-black/40">
              <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100 font-medium">
                <div className="w-5 h-5 flex items-center justify-center">
                  {isOpen ? (
                    <GeminiSvg className="w-5 h-5" />
                  ) : (
                    <motion.div
                      style={{ transformStyle: "preserve-3d" }}
                      animate={{ rotateY: [0, 360] }}
                      transition={{
                        repeat: Infinity,
                        duration: 3,
                        ease: "linear",
                      }}
                    >
                      <AIIcon />
                    </motion.div>
                  )}
                </div>
                <span>AI Assistant</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 space-y-4">
                  <div className="p-4 rounded-full bg-black/5 dark:bg-white/5">
                    <Sparkles className="w-8 h-8 opacity-50" />
                  </div>
                  <p className="text-sm">
                    Hi! Ask me anything about this portfolio.
                  </p>

                  <div className="flex flex-wrap gap-2 justify-center mt-2 px-2">
                    {suggestedInquiries.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSuggestionClick(q)}
                        className="text-xs text-left bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m, index) => (
                  <div
                    key={index}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-sm prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 ${
                        m.role === "user"
                          ? "bg-gray-900 text-white rounded-tr-sm dark:bg-white dark:text-black"
                          : "bg-white/70 dark:bg-black/70 border border-white/20 text-gray-800 dark:text-gray-200 rounded-tl-sm backdrop-blur-md shadow-sm"
                      }`}
                    >
                      {m.role === "user" ? (
                        getMessageText(m)
                      ) : (
                        <ReactMarkdown>{getMessageText(m)}</ReactMarkdown>
                      )}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-2xl rounded-tl-sm bg-white/70 dark:bg-black/70 border border-white/20 text-gray-800 dark:text-gray-200 backdrop-blur-md shadow-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                    <span
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 bg-white/40 dark:bg-black/40 border-t border-white/20 dark:border-white/10">
              <form
                id="chat-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!isLoading && input.trim()) {
                    sendMessage(input);
                  }
                }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question..."
                  className="w-full bg-white/50 dark:bg-black/50 border border-white/30 dark:border-white/10 rounded-full py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm placeholder:text-gray-500 backdrop-blur-sm"
                />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (Glassmorphism + Gemini Icon) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ perspective: 1000 }}
        className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-xl bg-white/40 dark:bg-black/40 border-2 border-white/50 dark:border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:bg-white/60 dark:hover:bg-black/60 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer text-gray-900 dark:text-white"
        aria-label="Toggle chat"
      >
        <motion.div
          animate={isOpen ? { rotateY: 0, scale: 0.8 } : { rotateY: [0, 360] }}
          transition={
            isOpen
              ? { duration: 0.2 }
              : { repeat: Infinity, duration: 4, ease: "linear" }
          }
          style={{ transformStyle: "preserve-3d" }}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <GeminiSvg className="w-7 h-7" />
          )}
        </motion.div>
      </button>
    </div>
  );
}
