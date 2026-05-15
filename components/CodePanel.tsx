"use client";

import { X, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodePanelProps {
  code: string;
  language: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CodePanel({ code, language, isOpen, onClose }: CodePanelProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-[50%] h-full border-l border-white/10 flex flex-col z-20">
      <div className="h-14 rounded-t-lg border-b border-white/10 flex items-center justify-between px-6 bg-[#f4f3ee]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-xs font-mono text-gray-400 ml-2 uppercase tracking-widest">{language || 'code'}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 text-black/80 hover:text-black hover:bg-white/5 rounded-md transition-all flex items-center gap-2 text-xs"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={onClose}
            className="p-2 text-black/80 hover:text-black hover:bg-white/5 rounded-md transition-all"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar bg-[#f4f3ee] rounded-b-lg">
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language}
          PreTag="div"
          showLineNumbers={true}
          customStyle={{
            margin: 0,
            padding: '2rem',
            fontSize: '0.9rem',
            lineHeight: '1.7',
            background: 'transparent',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
