import { useState, useEffect, useRef } from "react";
import { Send, Mic, X, Check } from "lucide-react";
import { motion } from "motion/react";
import { useNotifications } from "./notifications";

type Msg = { id: number; from: "user" | "bot"; text: string };

const REPLIES = [
  "I hear you. Want to tell me more about what's on your mind?",
  "Thanks for sharing. How long have you been feeling this way?",
  "That sounds challenging. Remember, it's okay to take a pause.",
];

export default function AiChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);
  const { push } = useNotifications();

  useEffect(() => {
    if (!recording) return;
    setSeconds(0);
    timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [recording]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const stopRecording = (sendIt: boolean) => {
    setRecording(false);
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (sendIt && seconds > 0) {
      const id = Date.now();
      const reply = REPLIES[messages.length % REPLIES.length];
      setMessages((m) => [
        ...m,
        { id, from: "user", text: `🎙️ Voice note · ${formatTime(seconds)}` },
        { id: id + 1, from: "bot", text: reply },
      ]);
      push({ source: "ai", title: "Voice note sent", body: `Duration ${formatTime(seconds)}` });
    }
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const id = Date.now();
    const reply = REPLIES[messages.length % REPLIES.length];
    setMessages((m) => [
      ...m,
      { id, from: "user", text },
      { id: id + 1, from: "bot", text: reply },
    ]);
    setDraft("");
    push({ source: "ai", title: "Mosens replied", body: reply });
  };

  return (
    <div className="flex flex-col flex-1 min-h-[60vh] -mt-2">
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto pb-4">
        {messages.length === 0 ? (
          <div className="flex-1 grid place-items-center text-center px-4">
            <div>
              <p className="font-['Poppins'] text-[#0063F3] text-base sm:text-lg">Hi Layla,</p>
              <p className="font-['Poppins'] text-[#1f1f1f] text-base sm:text-lg mt-1">
                How are you feeling today?
              </p>
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[80%] sm:max-w-[60%] rounded-2xl px-4 py-3 font-['Nunito'] text-sm leading-6 ${
                m.from === "user"
                  ? "self-end bg-[#0063F3] text-white rounded-br-sm"
                  : "self-start bg-white border border-[#EFEFF3] text-[#1f1f1f] rounded-bl-sm"
              }`}
            >
              {m.text}
            </div>
          ))
        )}
      </div>

      {recording ? (
        <div className="sticky bottom-20 md:bottom-4 bg-white rounded-full border border-[#C7D2FE] shadow-[0_8px_24px_-12px_rgba(17,24,39,0.06)] flex items-center gap-3 pl-3 pr-2 py-2">
          <button
            type="button"
            onClick={() => stopRecording(false)}
            className="size-10 rounded-full bg-[#FADCD9] text-[#EC2735] grid place-items-center hover:bg-[#f7c8c4] transition-colors"
            aria-label="Cancel recording"
          >
            <X className="size-4" />
          </button>
          <div className="flex-1 flex items-center gap-3 min-w-0">
            <span className="relative flex items-center justify-center">
              <span className="absolute inline-flex size-3 rounded-full bg-[#EC2735]/40 animate-ping" />
              <span className="relative inline-flex size-2.5 rounded-full bg-[#EC2735]" />
            </span>
            <div className="flex-1 flex items-center gap-[3px] h-8 overflow-hidden">
              {Array.from({ length: 28 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="w-[3px] rounded-full bg-[#0063F3]"
                  animate={{ height: ["20%", "90%", "35%", "70%", "20%"] }}
                  transition={{
                    duration: 1.1 + (i % 5) * 0.15,
                    repeat: Infinity,
                    delay: (i % 7) * 0.08,
                    ease: "easeInOut",
                  }}
                  style={{ height: "30%" }}
                />
              ))}
            </div>
            <span className="font-['Nunito'] font-semibold text-[#1f1f1f] text-sm tabular-nums">
              {formatTime(seconds)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => stopRecording(true)}
            className="size-10 rounded-full bg-[#0063F3] text-white grid place-items-center hover:bg-[#0052cc] transition-colors"
            aria-label="Send voice note"
          >
            <Check className="size-4" />
          </button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="sticky bottom-20 md:bottom-4 bg-white rounded-full border border-[#EFEFF3] shadow-[0_8px_24px_-12px_rgba(17,24,39,0.06)] flex items-center gap-2 pl-5 pr-2 py-2"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none font-['Nunito'] text-sm text-[#1f1f1f] placeholder:text-[#c1c1c1] py-2"
          />
          <button
            type="button"
            onClick={() => setRecording(true)}
            className="size-10 rounded-full bg-[#EEF2FF] text-[#3B5BDB] grid place-items-center hover:bg-[#dde4ff] transition-colors"
            aria-label="Record voice"
          >
            <Mic className="size-4" />
          </button>
          <button
            type="submit"
            disabled={!draft.trim()}
            className="size-10 rounded-full bg-[#0063F3] text-white grid place-items-center disabled:opacity-40 hover:bg-[#0052cc] transition-colors"
          >
            <Send className="size-4" />
          </button>
        </form>
      )}
    </div>
  );
}
