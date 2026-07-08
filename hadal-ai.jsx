import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";

const GREETING =
  "Soo dhawoow 👋 Waxaan ahay hadal AI, waxaa i sameeyay Eng. Maxamed Cabdi Cali, oo ku magac dheer Anwar. Waan ku faraxsanahay maanta inaan ku caawiyo — maxaan kaa caawiyaa?";

export default function HadalAI() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const apiMessages = newMessages
        .filter((m) => !(m.role === "assistant" && m.content === GREETING))
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system:
            "Waad tahay 'Hadal AI', kaaliye AI ah oo waxaa sameeyay Eng. Maxamed Cabdi Cali (Anwar). Had iyo jeer kaliya ugu jawaab Af-Soomaali, si sax ah, gaaban oo fahmi karo, xitaa haddii su'aasha luqad kale lagu qoro. Noqo mid raxiim ah, caawimaad leh, oo degdeg ah.",
          messages: apiMessages,
        }),
      });

      const data = await response.json();
      const textBlock = data?.content?.find((c) => c.type === "text");
      const reply = textBlock ? textBlock.text : "Waan ka xumahay, khalad ayaa dhacay. Fadlan isku day mar kale.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Waan ka xumahay, xiriirka ayaa go'ay. Fadlan isku day mar kale." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#0E1420] text-[#EDE6D6]">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 py-4 border-b border-[#C98A3E]/30 bg-[#141B29]">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C98A3E] to-[#7A4E2C] flex items-center justify-center shrink-0">
          <Sparkles size={18} className="text-[#0E1420]" />
        </div>
        <div className="min-w-0">
          <h1 className="text-[15px] font-semibold tracking-wide text-[#F4E9D4] truncate">Hadal AI</h1>
          <p className="text-[11px] text-[#C98A3E]/80 truncate">Sameeyay Eng. Maxamed Cabdi Cali · Anwar</p>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              dir="auto"
              className={`max-w-[82%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-[#C98A3E] text-[#0E1420] rounded-br-sm"
                  : "bg-[#1B2333] text-[#EDE6D6] rounded-bl-sm border border-[#2A3346]"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#1B2333] border border-[#2A3346] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C98A3E] animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#C98A3E] animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#C98A3E] animate-bounce" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-[#2A3346] bg-[#141B29] px-4 py-3">
        <div className="flex items-end gap-2 bg-[#1B2333] border border-[#2A3346] rounded-2xl px-3 py-2 focus-within:border-[#C98A3E]/60 transition-colors">
          <textarea
            dir="auto"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Qor fariintaada halkan..."
            className="flex-1 bg-transparent resize-none outline-none text-[14px] text-[#EDE6D6] placeholder-[#6B7280] py-1.5 max-h-32"
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="shrink-0 w-9 h-9 rounded-full bg-[#C98A3E] disabled:bg-[#3A4256] disabled:opacity-60 flex items-center justify-center transition-colors"
          >
            <Send size={16} className="text-[#0E1420]" />
          </button>
        </div>
      </div>
    </div>
  );
}
