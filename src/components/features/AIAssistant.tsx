import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles, ChevronRight } from "lucide-react";
import { AIMessage } from "@/types";
import { generateAIResponse, EXAMPLE_QUERIES } from "@/lib/aiAssistant";
import { generateId } from "@/lib/utils";
import ProductCard from "./ProductCard";
import { cn } from "@/lib/utils";

// ============================
// AI Message Bubble
// ============================

function MessageBubble({ message }: { message: AIMessage }) {
  const isUser = message.role === "user";

  // Parse markdown-like formatting
  const formatContent = (text: string) => {
    return text
      .split("\n")
      .map((line, i) => {
        // Bold text
        const formatted = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
        // Bullet points
        if (line.startsWith("- ") || line.startsWith("• ")) {
          return (
            <li key={i} className="ml-4 list-disc" dangerouslySetInnerHTML={{ __html: formatted.slice(2) }} />
          );
        }
        if (line === "") return <br key={i} />;
        return <p key={i} dangerouslySetInnerHTML={{ __html: formatted }} className={line.startsWith("🌡️") || line.startsWith("⚡") || line.startsWith("💰") || line.startsWith("🏷️") ? "flex gap-2" : ""} />;
      });
  };

  return (
    <div className={cn("flex gap-2.5", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-7 h-7 gradient-brand rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot className="w-3.5 h-3.5 text-white" />
        </div>
      )}
      <div className={cn("max-w-[85%]", isUser ? "items-end" : "items-start", "flex flex-col gap-2")}>
        <div
          className={cn(
            "px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed",
            isUser
              ? "gradient-brand text-white rounded-tr-sm"
              : "bg-secondary text-foreground rounded-tl-sm"
          )}
        >
          <div className="space-y-1">{formatContent(message.content)}</div>
        </div>

        {/* Recommended Products */}
        {!isUser && message.products && message.products.length > 0 && (
          <div className="w-full space-y-2 mt-1">
            <p className="text-xs font-medium text-muted-foreground px-1">
              Recommended for you:
            </p>
            <div className="space-y-2">
              {message.products.map((product) => (
                <ProductCard key={product.id} product={product} compact />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================
// Typing Indicator
// ============================

function TypingIndicator() {
  return (
    <div className="flex gap-2.5 items-center">
      <div className="w-7 h-7 gradient-brand rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="bg-secondary px-4 py-3 rounded-2xl rounded-tl-sm">
        <div className="flex gap-1.5 items-center">
          <div className="typing-dot w-1.5 h-1.5 bg-muted-foreground rounded-full" />
          <div className="typing-dot w-1.5 h-1.5 bg-muted-foreground rounded-full" />
          <div className="typing-dot w-1.5 h-1.5 bg-muted-foreground rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ============================
// Main AI Assistant Component
// ============================

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: generateId(),
      role: "assistant",
      content: "Hi! I'm CoolAir's AI assistant. Tell me about your room size, location, and budget — I'll find the perfect AC for you! 🌬️",
      timestamp: new Date(),
      products: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: AIMessage = {
      id: generateId(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI processing delay (300-1200ms)
    const delay = 500 + Math.random() * 700;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const { response, products } = generateAIResponse(text, messages);

    const aiMessage: AIMessage = {
      id: generateId(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
      products,
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, aiMessage]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 gradient-brand rounded-full shadow-xl shadow-primary/30 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95",
          isOpen && "scale-0 opacity-0 pointer-events-none"
        )}
      >
        <Sparkles className="w-6 h-6 text-white" />
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent rounded-full border-2 border-background animate-pulse" />
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 w-[360px] sm:w-[400px] max-h-[600px] bg-card rounded-2xl shadow-2xl border border-border flex flex-col transition-all duration-300 origin-bottom-right",
          isOpen
            ? "scale-100 opacity-100"
            : "scale-0 opacity-0 pointer-events-none"
        )}
        style={{ maxHeight: "min(600px, calc(100vh - 100px))" }}
      >
        {/* Header */}
        <div className="gradient-brand px-4 py-3.5 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">CoolAir AI</p>
              <p className="text-white/70 text-xs">Smart AC Recommendations</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Queries */}
        {messages.length <= 1 && (
          <div className="px-4 pb-3">
            <p className="text-xs text-muted-foreground mb-2 font-medium">Try asking:</p>
            <div className="flex flex-wrap gap-1.5">
              {EXAMPLE_QUERIES.slice(0, 3).map((query) => (
                <button
                  key={query}
                  onClick={() => sendMessage(query)}
                  className="text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3" />
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="p-3 border-t border-border flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., Best AC for 150 sq ft room..."
            className="flex-1 text-sm px-3 py-2.5 rounded-xl bg-muted border-0 focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95",
              input.trim() && !isTyping
                ? "gradient-brand text-white hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </>
  );
}
