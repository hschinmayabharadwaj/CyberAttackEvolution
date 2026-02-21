"use client";

import { useTambo, useTamboThreadInput, ComponentRenderer } from "@tambo-ai/react";
import type { TamboComponentContent } from "@tambo-ai/react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Send,
  Bot,
  User,
  Sparkles,
  ChevronDown,
  Loader2,
  Shield,
  RotateCcw,
} from "lucide-react";

export default function CyberChat() {
  const { messages, thread, startNewThread, currentThreadId } = useTambo();
  const { value, setValue, submit, isPending } = useTamboThreadInput();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const suggestions = [
    "Show me the threat evolution dashboard",
    "What are the top predicted attack trends?",
    "Show attack timeline for ransomware and AI-powered threats",
    "Which industries are most at risk?",
    "Show me the MITRE ATT&CK tactic distribution",
    "Tell me about LLM-powered spear phishing attacks",
    "Show the global threat landscape",
    "How have cyber threats evolved over time?",
    "Show severity distribution of current threats",
    "What is the prediction for supply chain attacks?",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (value.trim() && !isPending) {
      setShowSuggestions(false);
      submit();
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setValue(suggestion);
    setShowSuggestions(false);
    setTimeout(() => submit(), 100);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700">
        {messages.length === 0 && showSuggestions && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 mb-6 shadow-[0_0_40px_rgba(6,182,212,0.2)]">
                <Shield className="h-10 w-10 text-cyan-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-3">
                Cyber Threat Intelligence AI
              </h2>
              <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                Ask about attack patterns, threat predictions, evolution timelines, 
                sector risks, and more. Powered by time-series analysis and predictive modeling.
              </p>
            </div>

            {/* Suggestions Grid */}
            <div className="w-full max-w-2xl">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3 text-center">
                Try asking...
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestions.slice(0, 8).map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestion(suggestion)}
                    className="group text-left px-4 py-3 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/60 hover:border-cyan-500/30 transition-all duration-200 text-sm text-slate-300 hover:text-cyan-200"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-slate-600 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                      <span className="line-clamp-1">{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 max-w-4xl",
              message.role === "user" ? "ml-auto flex-row-reverse" : ""
            )}
          >
            {/* Avatar */}
            <div
              className={cn(
                "flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center",
                message.role === "user"
                  ? "bg-purple-500/20 border border-purple-500/30"
                  : "bg-cyan-500/20 border border-cyan-500/30"
              )}
            >
              {message.role === "user" ? (
                <User className="h-4 w-4 text-purple-400" />
              ) : (
                <Bot className="h-4 w-4 text-cyan-400" />
              )}
            </div>

            {/* Content */}
            <div
              className={cn(
                "flex-1 max-w-[85%]",
                message.role === "user" ? "text-right" : ""
              )}
            >
              {/* Message content blocks */}
              {Array.isArray(message.content) ? (
                message.content.map((part, i) => {
                  if (part.type === "text" && "text" in part && part.text) {
                    return (
                      <div
                        key={i}
                        className={cn(
                          "inline-block rounded-2xl px-4 py-3 text-sm leading-relaxed",
                          message.role === "user"
                            ? "bg-purple-500/15 border border-purple-500/20 text-purple-100"
                            : "bg-slate-800/60 border border-slate-700/50 text-slate-200"
                        )}
                      >
                        {part.text}
                      </div>
                    );
                  }
                  if (part.type === "component") {
                    return (
                      <div key={(part as TamboComponentContent).id || i} className="mt-3 w-full">
                        <ComponentRenderer
                          content={part as TamboComponentContent}
                          threadId={currentThreadId}
                          messageId={message.id}
                          fallback={<div className="text-slate-400 text-sm">Loading component...</div>}
                        />
                      </div>
                    );
                  }
                  return null;
                })
              ) : message.content ? (
                <div
                  className={cn(
                    "inline-block rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    message.role === "user"
                      ? "bg-purple-500/15 border border-purple-500/20 text-purple-100"
                      : "bg-slate-800/60 border border-slate-700/50 text-slate-200"
                  )}
                >
                  {String(message.content)}
                </div>
              ) : null}
            </div>
          </div>
        ))}

        {isPending && (
          <div className="flex gap-3 max-w-4xl">
            <div className="h-8 w-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Bot className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800/60 border border-slate-700/50">
              <Loader2 className="h-4 w-4 text-cyan-400 animate-spin" />
              <span className="text-sm text-slate-400">Analyzing threat intelligence...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-xl px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => startNewThread()}
              className="flex-shrink-0 h-10 w-10 rounded-xl border border-slate-700/50 bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
              title="New conversation"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Ask about cyber threats, predictions, attack patterns..."
                className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-700/50 bg-slate-800/50 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                disabled={isPending}
              />
              <button
                type="submit"
                disabled={isPending || !value.trim()}
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg flex items-center justify-center transition-all",
                  value.trim() && !isPending
                    ? "bg-cyan-500 text-white hover:bg-cyan-400 shadow-lg shadow-cyan-500/25"
                    : "bg-slate-700/50 text-slate-500"
                )}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-slate-600 text-center mt-2">
            AI-powered threat intelligence • Predictions are based on time-series models and historical data
          </p>
        </form>
      </div>
    </div>
  );
}
