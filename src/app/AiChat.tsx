import { useState, useEffect, useRef } from "react";
import { Send, Mic, X, Check } from "lucide-react";
import { motion } from "motion/react";
import { useNotifications } from "./notifications";
import { sendChatMessage } from "../services/aiService";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

type Msg = { id: number; from: "user" | "bot"; text: string };

export default function AiChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'id-ID' | 'en-US'>('id-ID');
  const timerRef = useRef<number | null>(null);
  const { push } = useNotifications();

  const {
    transcript,
    isListening,
    isSupported: isSpeechSupported,
    error: speechError,
    start: startRecognition,
    stop: stopRecognition,
    reset: resetTranscript,
  } = useSpeechRecognition();

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

  const stopRecording = async (sendIt: boolean) => {
    setRecording(false);
    stopRecognition();
    
    if (timerRef.current) window.clearInterval(timerRef.current);

    if (sendIt && transcript.trim()) {
      const userMsgId = Date.now();
      const userMsg: Msg = { id: userMsgId, from: "user", text: transcript };

      setMessages((m) => [...m, userMsg]);
      setIsLoading(true);

      try {
        const reply = await sendChatMessage(transcript);
        const botMsg: Msg = { id: userMsgId + 1, from: "bot", text: reply };
        setMessages((m) => [...m, botMsg]);
        push({ 
          source: "ai", 
          title: "Voice message sent", 
          body: `Duration ${formatTime(seconds)}` 
        });
      } catch (error) {
        console.error('Voice chat error:', error);
        const errorMsg: Msg = {
          id: userMsgId + 1,
          from: "bot",
          text: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        };
        setMessages((m) => [...m, errorMsg]);
        push({ source: "ai", title: "Error", body: "Gagal mengirim pesan suara" });
      } finally {
        setIsLoading(false);
        resetTranscript();
      }
    } else if (sendIt && !transcript.trim()) {
      push({ 
        source: "ai", 
        title: "No speech detected", 
        body: "Tidak ada suara yang terdeteksi" 
      });
      resetTranscript();
    } else {
      resetTranscript();
    }
  };

  const send = async () => {
    const text = draft.trim();
    if (!text || isLoading) return;

    const userMsgId = Date.now();
    const userMsg: Msg = { id: userMsgId, from: "user", text };

    setMessages((m) => [...m, userMsg]);
    setDraft("");
    setIsLoading(true);

    try {
      const reply = await sendChatMessage(text);
      const botMsg: Msg = { id: userMsgId + 1, from: "bot", text: reply };
      setMessages((m) => [...m, botMsg]);
      push({ source: "ai", title: "Mosens replied", body: reply });
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: Msg = {
        id: userMsgId + 1,
        from: "bot",
        text: "Maaf, terjadi kesalahan. Silakan coba lagi.",
      };
      setMessages((m) => [...m, errorMsg]);
      push({ source: "ai", title: "Error", body: "Gagal mengirim pesan" });
    } finally {
      setIsLoading(false);
    }
  };

  const startRecordingWithLanguage = () => {
    if (!isSpeechSupported) {
      push({
        source: "ai",
        title: "Not supported",
        body: "Browser Anda tidak mendukung voice recording",
      });
      return;
    }
    
    setRecording(true);
    startRecognition(language);
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
        
        {isLoading && (
          <div className="self-start bg-white border border-[#EFEFF3] text-[#1f1f1f] rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80%] sm:max-w-[60%]">
            <div className="flex items-center gap-2">
              <span className="font-['Nunito'] text-sm text-[#6b7280]">
                Mosens sedang mengetik
              </span>
              <span className="flex gap-1">
                <span 
                  className="w-1.5 h-1.5 bg-[#0063F3] rounded-full animate-bounce" 
                  style={{ animationDelay: '0ms' }} 
                />
                <span 
                  className="w-1.5 h-1.5 bg-[#0063F3] rounded-full animate-bounce" 
                  style={{ animationDelay: '150ms' }} 
                />
                <span 
                  className="w-1.5 h-1.5 bg-[#0063F3] rounded-full animate-bounce" 
                  style={{ animationDelay: '300ms' }} 
                />
              </span>
            </div>
          </div>
        )}
      </div>

      {recording ? (
        <div className="sticky bottom-20 md:bottom-4 space-y-2">
          {/* Transcript display */}
          {transcript && (
            <div className="bg-white rounded-2xl border border-[#EFEFF3] shadow-sm px-4 py-3">
              <p className="font-['Nunito'] text-sm text-[#1f1f1f] leading-relaxed">
                {transcript}
              </p>
            </div>
          )}
          
          {/* Recording controls */}
          <div className="bg-white rounded-full border border-[#C7D2FE] shadow-[0_8px_24px_-12px_rgba(17,24,39,0.06)] flex items-center gap-3 pl-3 pr-2 py-2">
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
              disabled={!transcript.trim()}
              className="size-10 rounded-full bg-[#0063F3] text-white grid place-items-center hover:bg-[#0052cc] transition-colors disabled:opacity-40"
              aria-label="Send voice note"
            >
              <Check className="size-4" />
            </button>
          </div>
          
          {/* Error display */}
          {speechError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <p className="font-['Nunito'] text-sm text-red-600">{speechError}</p>
            </div>
          )}
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="sticky bottom-20 md:bottom-4 space-y-2"
        >
          {/* Language toggle */}
          <div className="flex justify-end">
            <div className="inline-flex bg-white rounded-full border border-[#EFEFF3] p-1 gap-1">
              <button
                type="button"
                onClick={() => setLanguage('id-ID')}
                className={`px-3 py-1.5 rounded-full font-['Nunito'] text-xs font-medium transition-colors ${
                  language === 'id-ID'
                    ? 'bg-[#0063F3] text-white'
                    : 'text-[#6b7280] hover:text-[#1f1f1f]'
                }`}
              >
                🇮🇩 ID
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en-US')}
                className={`px-3 py-1.5 rounded-full font-['Nunito'] text-xs font-medium transition-colors ${
                  language === 'en-US'
                    ? 'bg-[#0063F3] text-white'
                    : 'text-[#6b7280] hover:text-[#1f1f1f]'
                }`}
              >
                🇺🇸 EN
              </button>
            </div>
          </div>
          
          {/* Input bar */}
          <div className="bg-white rounded-full border border-[#EFEFF3] shadow-[0_8px_24px_-12px_rgba(17,24,39,0.06)] flex items-center gap-2 pl-5 pr-2 py-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={isLoading}
              placeholder="Type a message..."
              className="flex-1 bg-transparent outline-none font-['Nunito'] text-sm text-[#1f1f1f] placeholder:text-[#c1c1c1] py-2 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={startRecordingWithLanguage}
              disabled={isLoading || !isSpeechSupported}
              className={`size-10 rounded-full grid place-items-center transition-colors ${
                isSpeechSupported
                  ? 'bg-[#EEF2FF] text-[#3B5BDB] hover:bg-[#dde4ff]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              } disabled:opacity-40`}
              aria-label={isSpeechSupported ? "Record voice" : "Voice recording not supported"}
              title={isSpeechSupported ? "Record voice" : "Voice recording not supported on this browser"}
            >
              <Mic className="size-4" />
            </button>
            <button
              type="submit"
              disabled={!draft.trim() || isLoading}
              className="size-10 rounded-full bg-[#0063F3] text-white grid place-items-center disabled:opacity-40 hover:bg-[#0052cc] transition-colors"
            >
              <Send className="size-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
