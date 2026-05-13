"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hey! 👋 I'm Uni, your UnicornDS assistant. Ask me anything about features, pricing, or getting started!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
      if (!open) setUnread(u => u + 1);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, having trouble connecting. Email support@unicornds.io for help." }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => { setOpen(!open); setUnread(0); }}
        className="fixed bottom-6 right-3 sm:right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        style={{ background: "linear-gradient(135deg, #7C3AED, #9333EA)", boxShadow: "0 4px 20px rgba(124,58,237,0.4)" }}
        aria-label="Chat with Uni"
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )}
        {unread > 0 && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">{unread}</span>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-6 z-50 sm:w-[380px] rounded-2xl overflow-hidden shadow-2xl border border-[#3d3580]"
          style={{ height: "min(500px, calc(100vh - 140px))", background: "#0f0e1a" }}>

          {/* Header */}
          <div className="px-4 py-3 flex items-center gap-3" style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)" }}>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">🦄</div>
            <div>
              <div className="text-white text-sm font-bold">Uni — Chat Support</div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#10B981] rounded-full" />
                <span className="text-white/70 text-xs">We&apos;re online</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ height: "calc(100% - 120px)" }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-[#7C3AED]/20 flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-1">🦄</div>
                )}
                <div className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#7C3AED] text-white rounded-br-sm"
                    : "bg-[#1E1B4B] text-[#e0d8ff] rounded-bl-sm border border-[#3d3580]/50"
                }`}>
                  {msg.content.split("\n").map((line, j) => (
                    <p key={j} className={j > 0 ? "mt-1.5" : ""}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-[#7C3AED]/20 flex items-center justify-center text-xs mr-2">🦄</div>
                <div className="bg-[#1E1B4B] border border-[#3d3580]/50 rounded-2xl rounded-bl-sm px-3.5 py-2.5">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[#7C3AED] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-[#7C3AED] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-[#7C3AED] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          {/* Input */}
          <div className="border-t border-[#3d3580]/50 p-3 flex gap-2 bg-[#0f0e1a]">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Ask Uni anything..."
              className="flex-1 px-3 py-2.5 bg-[#1E1B4B] border border-[#3d3580] rounded-xl text-white text-[13px] placeholder-[#6b6899] focus:border-[#7C3AED] outline-none"
            />
            <button onClick={sendMessage} disabled={loading}
              className="px-4 py-2.5 rounded-xl text-[13px] font-bold text-white disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #7C3AED, #9333EA)" }}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
