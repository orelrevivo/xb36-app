"use client";

import { useState, useRef, useEffect } from "react";
import { ChatList } from "@/components/ChatList";
import { ChatInput } from "@/components/ChatInput";
import { CodePanel } from "@/components/CodePanel";
import type { Message } from "@/types/types";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I am your local Xb36 AI. All my core logic files are right here in your project folder. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeCode, setActiveCode] = useState("");
  const [panelLanguage, setPanelLanguage] = useState("typescript");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Extract code blocks from text
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant' && isLoading) {
      const codeBlockRegex = /```(\w*)\n([\s\S]*?)(?:```|$)/g;
      let match;
      let lastCode = "";
      let lastLang = "typescript";
      
      while ((match = codeBlockRegex.exec(lastMessage.content)) !== null) {
        lastLang = match[1] || "typescript";
        lastCode = match[2];
      }
      
      if (lastCode) {
        setActiveCode(lastCode);
        setPanelLanguage(lastLang);
        setIsPanelOpen(true);
      }
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history: messages }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.body) throw new Error("No response body");

      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;

        setMessages(prev => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          if (newMessages[lastIndex].role === "assistant") {
            newMessages[lastIndex].content = assistantContent;
          }
          return newMessages;
        });
      }

    } catch (error: any) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: error.name === 'AbortError'
          ? "Error: The model is taking too long to respond. Try a shorter prompt."
          : "Error: Could not connect to the model backend."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const openCodeInPanel = (code: string, lang: string) => {
    setActiveCode(code);
    setPanelLanguage(lang);
    setIsPanelOpen(true);
  };

  return (
    <main className="flex h-screen overflow-hidden bg-white text-gray-100 p-4">
      <div className={`flex flex-1 flex-row transition-all duration-300 ease-in-out`}>
        <div className={`flex flex-col relative transition-all duration-300 ${isPanelOpen ? 'w-[50%]' : 'w-full'}`}>
          <ChatList
            messages={messages}
            isLoading={isLoading}
            mounted={mounted}
            scrollRef={scrollRef}
            onViewCode={openCodeInPanel}
            isPanelOpen={isPanelOpen}
          />
          <ChatInput
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            isLoading={isLoading}
          />
        </div>

        <CodePanel
          code={activeCode}
          language={panelLanguage}
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
        />
      </div>
    </main>
  );
}
