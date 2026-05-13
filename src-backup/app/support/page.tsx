"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function SupportPage() {
  const [tab, setTab] = useState<"chat" | "contact">("chat");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! 👋 I'm Uni, the UnicornDS assistant. I can help with features, pricing, troubleshooting, or getting started. What can I help you with?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);

  // Contact form
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactUserId, setContactUserId] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSent, setContactSent] = useState(false);

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
      const reply = data.reply || "Sorry, I couldn't process that. Please use the Contact Form tab or email support@unicornds.io for help.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, I'm having trouble connecting. Please use the Contact Form tab or email support@unicornds.io for help." }]);
    }
    setLoading(false);
  };

  const sendContactForm = () => {
    if (!contactEmail.trim() || !contactMessage.trim()) return;
    const subject = encodeURIComponent(`Support Request from ${contactName || contactEmail}`);
    const body = encodeURIComponent(
      `Name: ${contactName}\nEmail: ${contactEmail}\nUser ID: ${contactUserId || "N/A"}\n\nMessage:\n${contactMessage}`
    );
    window.open(`mailto:support@unicornds.io?subject=${subject}&body=${body}`, "_blank");
    setContactSent(true);
  };

  return (
    <div className="min-h-screen pt-20 pb-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-white mb-2">Support</h1>
          <p className="text-sm text-[#a5a0cc]">
            Chat with Uni or send us a message. Email: <a href="mailto:support@unicornds.io" className="text-[#A78BFA] hover:underline">support@unicornds.io</a>
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-[#1E1B4B]/50 rounded-xl p-1 border border-[#3d3580]">
          <button onClick={() => setTab("chat")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === "chat" ? "bg-[#7C3AED] text-white" : "text-[#a5a0cc] hover:text-white"}`}>
            Chat with Uni
          </button>
          <button onClick={() => setTab("contact")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === "contact" ? "bg-[#7C3AED] text-white" : "text-[#a5a0cc] hover:text-white"}`}>
            Contact Form
          </button>
        </div>

        {tab === "chat" ? (
          <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl overflow-hidden flex flex-col" style={{ height: "calc(100vh - 280px)" }}>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#7C3AED] text-white rounded-br-md"
                      : "bg-[#2d2766] text-[#e0d8ff] rounded-bl-md"
                  }`}>
                    {msg.content.split("\n").map((line, j) => (
                      <p key={j} className={j > 0 ? "mt-2" : ""}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#2d2766] text-[#a5a0cc] rounded-2xl rounded-bl-md px-4 py-3 text-sm">
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
            <div className="border-t border-[#3d3580] p-3 flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Ask about features, pricing, or troubleshooting..."
                className="flex-1 px-4 py-3 bg-[#0f0e1a] border border-[#3d3580] rounded-xl text-white text-sm placeholder-[#6b6899] focus:border-[#7C3AED] outline-none"
              />
              <button onClick={sendMessage} disabled={loading}
                className="btn-primary px-5 py-3 rounded-xl text-sm font-bold disabled:opacity-50">
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-6">
            {contactSent ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-white mb-2">Message ready to send</h3>
                <p className="text-sm text-[#a5a0cc] mb-4">Your email app should have opened with your message. If not, copy and send to:</p>
                <a href="mailto:support@unicornds.io" className="text-[#A78BFA] font-bold hover:underline">support@unicornds.io</a>
                <button onClick={() => setContactSent(false)} className="block mx-auto mt-6 text-sm text-[#a5a0cc] hover:text-white">Send another message</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#a5a0cc] mb-1">Name</label>
                  <input value={contactName} onChange={e => setContactName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-[#0f0e1a] border border-[#3d3580] rounded-xl text-white text-sm placeholder-[#6b6899] focus:border-[#7C3AED] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#a5a0cc] mb-1">Email <span className="text-red-400">*</span></label>
                  <input value={contactEmail} onChange={e => setContactEmail(e.target.value)}
                    type="email" placeholder="your@email.com" required
                    className="w-full px-4 py-3 bg-[#0f0e1a] border border-[#3d3580] rounded-xl text-white text-sm placeholder-[#6b6899] focus:border-[#7C3AED] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#a5a0cc] mb-1">User ID <span className="text-[#6b6899]">(optional)</span></label>
                  <input value={contactUserId} onChange={e => setContactUserId(e.target.value)}
                    placeholder="Your UnicornDS account email or UID"
                    className="w-full px-4 py-3 bg-[#0f0e1a] border border-[#3d3580] rounded-xl text-white text-sm placeholder-[#6b6899] focus:border-[#7C3AED] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#a5a0cc] mb-1">Message <span className="text-red-400">*</span></label>
                  <textarea value={contactMessage} onChange={e => setContactMessage(e.target.value)}
                    rows={5} placeholder="Describe your issue or question..."
                    className="w-full px-4 py-3 bg-[#0f0e1a] border border-[#3d3580] rounded-xl text-white text-sm placeholder-[#6b6899] focus:border-[#7C3AED] outline-none resize-none" />
                </div>
                <button onClick={sendContactForm}
                  disabled={!contactEmail.trim() || !contactMessage.trim()}
                  className="btn-primary w-full py-3 rounded-xl text-sm font-bold disabled:opacity-50">
                  Send Message
                </button>
                <p className="text-xs text-[#6b6899] text-center">We usually reply within 24 hours</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
