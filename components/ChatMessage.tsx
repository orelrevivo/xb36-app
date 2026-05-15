"use client";

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import type { Message } from "@/types/types";
import { Code, Code2, Maximize2 } from "lucide-react";

interface ChatMessageProps {
  msg: Message;
  mounted: boolean;
  onViewCode: (code: string, lang: string) => void;
  isPanelOpen: boolean;
}

export function ChatMessage({ msg, mounted, onViewCode, isPanelOpen }: ChatMessageProps) {
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)(?:```|$)/g;
  const hasCode = /```/.test(msg.content);

  const handleOpenCode = () => {
    const match = codeBlockRegex.exec(msg.content);
    if (match) {
      onViewCode(match[2], match[1] || "typescript");
    } else {
      const fallbackMatch = /```(\w*)\n([\s\S]*?)(?:```|$)/.exec(msg.content);
      if (fallbackMatch) {
        onViewCode(fallbackMatch[2], fallbackMatch[1] || "typescript");
      }
    }
  };

  return (
    <div className={`flex gap-4 max-w-2xl mx-auto w-full animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
      <div className="flex flex-col gap-2 w-full">
        <div className={`w-full rounded-[8px] p-4 text-[13px] prose prose-sm ${msg.role === "user"
          ? "bg-[#f4f3ee] text-black"
          : "bg-none border border-black/5 text-black"
          }`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                const language = match ? match[1] : 'text';

                if (!inline) {
                  return (
                    <div className="rounded-[8px] overflow-hidden my-4 group relative bg-[#f4f3ee] p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Code size={18} className="text-black/80" />
                        <span className="text-[12px] text-black/80">{language} source code</span>
                      </div>
                      <button
                        onClick={() => onViewCode(String(children), language)}
                        className="flex items-center gap-2 text-[11px] text-black/80 hover:text-black bg-black/10 px-3 py-1.5 rounded-md"
                      >
                        <Maximize2 size={12} />
                        Open in side panel
                      </button>
                    </div>
                  );
                }

                return (
                  <code className="bg-black/5 px-1.5 py-0.5 rounded text-blue-600 font-mono text-xs" {...props}>
                    {children}
                  </code>
                );
              },
              p: ({ children }) => <div className="mb-2 last:mb-0 leading-relaxed">{children}</div>,
            }}
          >
            {msg.content || "..."}
          </ReactMarkdown>
        </div>

        <div className={`flex items-center w-full px-1 ${msg.role === 'user' ? 'justify-end' : 'justify-between'}`}>
          <span className="text-[11px] text-black/80">
            {mounted && new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>

          {msg.role === 'assistant' && hasCode && !isPanelOpen && (
            <button
              onClick={handleOpenCode}
              className="text-[11px] text-black/80 hover:text-black flex items-center gap-1"
            >
              <Code2 size={12} />
              Open Code Artifact
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
