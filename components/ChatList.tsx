"use client";

import { Bot } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import type { Message } from "@/types/types";
import { RefObject } from "react";

interface ChatListProps {
  messages: Message[];
  isLoading: boolean;
  mounted: boolean;
  scrollRef: RefObject<HTMLDivElement | null>;
  onViewCode: (code: string, lang: string) => void;
  isPanelOpen: boolean;
}

export function ChatList({ messages, isLoading, mounted, scrollRef, onViewCode, isPanelOpen }: ChatListProps) {
  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto space-y-8 scroll-smooth"
    >
      {messages.map((msg, i) => (
        <ChatMessage
          key={i}
          msg={msg}
          mounted={mounted}
          onViewCode={onViewCode}
          isPanelOpen={isPanelOpen}
        />
      ))}

      {isLoading && (
        <div className="flex gap-4 max-w-2xl mx-auto w-full animate-pulse">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/20 flex items-center justify-center">
            <Bot size={20} className="text-blue-400" />
          </div>
          <div className="glass p-4 rounded-3xl rounded-tl-none border border-white/5 flex gap-1 items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"></span>
          </div>
        </div>
      )}
    </div>
  );
}
