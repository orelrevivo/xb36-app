"use client";

import { Loader2 } from "lucide-react";
import { ArrowNarrowUpIcon } from "./ArrowNarrowUpIcon";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  isLoading: boolean;
}

export function ChatInput({ input, setInput, handleSend, isLoading }: ChatInputProps) {
  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto relative group">
        <div className="relative bg-[#f4f3ee] border border-[#b1ada1] rounded-[8px] px-4 py-3 flex items-start">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask anything"
            className="flex-1 h-[120px] bg-transparent text-black/80 placeholder-black/80 text-[15px] border-none outline-none text-lg px-1 py-1 resize-none"
          />

          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="ml-2 w-9 h-9 bg-[#0099ff] text-white hover:bg-[#0099ff]/90 disabled:opacity-50 p-2 rounded-[8px] transition-all flex-shrink-0 flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <ArrowNarrowUpIcon size={18} color="white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
