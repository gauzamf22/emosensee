import { useState, useEffect, useRef } from "react";
import { Send, Mic, Square, X } from "lucide-react";
import { motion } from "motion/react";
import { useNotifications } from "./notifications";
import { sendChatMessage, getMemory } from "../services/aiService";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import ErrorBoundary from "../components/ErrorBoundary";
import { LiveAudioVisualizer } from "react-audio-visualize";
import Logo from "./Logo";
import { useTranslation } from "../translations";

type Msg = { id: number; from: "user" | "bot"; text: string };

export default function AiChat({ session }: { session?: any }) {
  const { t, language: appLanguage } = useTranslation();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMemory, setIsLoadingMemory] = useState(true);
  const [language, setLanguage] = useState<'id-ID' | 'en-US'>('en-US');
  const [transcribedText, setTranscribedText] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const { push } = useNotifications();

  // Generate dynamic greeting
  const username = session?.user?.user_metadata?.username;
  const greetingText = username 
    ? t.aiChat.greetingWithName.replace('{name}', username)
    : t.aiChat.greetingTimeOfDay;

  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!recording) return;
    setSeconds(0);
    timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [recording]);

  // Load conversation memory on mount
  useEffect(() => {
    const loadMemory = async () => {
      try {
        const memory = await getMemory();
        
        if (memory.conversation_history && memory.conversation_history.length > 0) {
          // Transform backend memory format to frontend Msg[]
          const loadedMessages: Msg[] = memory.conversation_history.flatMap((conv, idx) => [
            {
              id: idx * 2,
              from: "user" as const,
              text: conv.user_message
            },
            {
              id: idx * 2 + 1,
              from: "bot" as const,
              text: conv.counselor_reply
            }
          ]);
          
          setMessages(loadedMessages);
        }
      } catch (error) {
        console.error('Failed to load memory:', error);
        // Silent failure - user can start fresh conversation
      } finally {
        setIsLoadingMemory(false);
      }
    };

    loadMemory();
  }, []);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const stopRecording = () => {
    SpeechRecognition.stopListening();
    
    if (timerRef.current) window.clearInterval(timerRef.current);

    // Stop and cleanup audio stream
    if (mediaRecorder) {
      if (mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setMediaRecorder(null);
    }

    if (transcript.trim()) {
      // Save transcript for review, keep modal open
      setTranscribedText(transcript);
      setRecording(false);
      push({ 
        source: "ai", 
        title: t.aiChat.voiceRecorded, 
        body: t.aiChat.voiceRecordedBody.replace('{duration}', formatTime(seconds))
      });
    } else {
      // No speech detected, close modal
      setRecording(false);
      setTranscribedText("");
      push({ 
        source: "ai", 
        title: t.aiChat.noSpeechDetected, 
        body: t.aiChat.noSpeechDetectedBody
      });
    }
    
    resetTranscript();
  };

  const sendFromModal = async () => {
    const text = transcribedText.trim();
    if (!text || isLoading) return;

    const userMsgId = Date.now();
    const userMsg: Msg = { id: userMsgId, from: "user", text };

    setMessages((m) => [...m, userMsg]);
    setTranscribedText("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(text, language);
      const botMsg: Msg = { id: userMsgId + 1, from: "bot", text: response.reply };
      setMessages((m) => [...m, botMsg]);
      push({ source: "ai", title: t.aiChat.mosensReplied, body: response.reply });
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error instanceof Error ? error.message : t.aiChat.errorOccurred;
      const errorMsg: Msg = {
        id: userMsgId + 1,
        from: "bot",
        text: errorMessage,
      };
      setMessages((m) => [...m, errorMsg]);
      push({ source: "ai", title: t.aiChat.error, body: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    if (transcribedText.trim()) {
      setDraft(transcribedText);
    }
    setTranscribedText("");
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
      const response = await sendChatMessage(text, language);
      const botMsg: Msg = { id: userMsgId + 1, from: "bot", text: response.reply };
      setMessages((m) => [...m, botMsg]);
      push({ source: "ai", title: t.aiChat.mosensReplied, body: response.reply });
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error instanceof Error ? error.message : t.aiChat.errorOccurred;
      const errorMsg: Msg = {
        id: userMsgId + 1,
        from: "bot",
        text: errorMessage,
      };
      setMessages((m) => [...m, errorMsg]);
      push({ source: "ai", title: t.aiChat.error, body: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const startRecordingWithLanguage = async () => {
    if (!browserSupportsSpeechRecognition) {
      push({
        source: "ai",
        title: t.aiChat.notSupported,
        body: t.aiChat.notSupportedBody,
      });
      return;
    }
    
    try {
      // Capture audio stream for waveform visualization
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      setRecording(true);
      setTranscribedText("");
      resetTranscript();
      
      // Start speech recognition
      SpeechRecognition.startListening({ 
        language: language,
        continuous: true 
      });
    } catch (error) {
      console.error('Microphone access error:', error);
      push({
        source: "ai",
        title: t.aiChat.micAccessDenied,
        body: t.aiChat.micAccessDeniedBody,
      });
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-[60vh] -mt-2">
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto pb-4">
        {messages.length === 0 ? (
          <div className="flex-1 grid place-items-center text-center px-4">
            <div className="flex flex-col items-center gap-6">
              {/* Animated Logo */}
              <motion.div
                animate={{
                  y: [0, -12, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Logo className="size-[120px]" />
              </motion.div>

              {/* Greeting Text */}
              <div>
                <p className="font-['Poppins'] text-[#0063F3] text-base sm:text-lg">{greetingText}</p>
                <p className="font-['Poppins'] text-[#1f1f1f] text-base sm:text-lg mt-1">
                  {t.aiChat.howAreYouFeeling}
                </p>
              </div>
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
                {t.aiChat.mosensTyping}
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

      {recording || transcribedText ? (
        <ErrorBoundary
          fallback={
            <div className="sticky bottom-20 md:bottom-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">{t.aiChat.voiceRecordingError}</p>
              <p className="text-red-600 text-sm mt-1">{t.aiChat.voiceRecordingErrorBody}</p>
            </div>
          }
        >
          <div className="sticky bottom-20 md:bottom-4 space-y-2">
          {/* Transcript display */}
          {(transcript || transcribedText) && (
            <div className="bg-white rounded-2xl border border-[#EFEFF3] shadow-sm px-4 py-3">
              <p className="font-['Nunito'] text-sm text-[#1f1f1f] leading-relaxed">
                {recording ? transcript : transcribedText}
              </p>
            </div>
          )}
          
          {recording ? (
            /* Recording mode: waveform + stop button */
            <div className="bg-white rounded-full border border-[#C7D2FE] shadow-[0_8px_24px_-12px_rgba(17,24,39,0.06)] flex items-center gap-3 pl-3 pr-2 py-2">
              <button
                type="button"
                onClick={stopRecording}
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
                <div className="flex-1 flex items-center h-8 overflow-hidden">
                  {mediaRecorder && (
                    <LiveAudioVisualizer
                      mediaRecorder={mediaRecorder}
                      width={200}
                      height={32}
                      barWidth={3}
                      gap={3}
                      barColor="#0063F3"
                    />
                  )}
                </div>
                <span className="font-['Nunito'] font-semibold text-[#1f1f1f] text-sm tabular-nums">
                  {formatTime(seconds)}
                </span>
              </div>
              <button
                type="button"
                onClick={stopRecording}
                className="size-12 rounded-full bg-red-500 text-white grid place-items-center hover:bg-red-600 transition-colors"
                aria-label="Stop recording"
              >
                <Square className="size-5 fill-current" />
              </button>
            </div>
          ) : (
            /* Review mode: Send + Edit buttons */
            <div className="bg-white rounded-full border border-[#EFEFF3] shadow-[0_8px_24px_-12px_rgba(17,24,39,0.06)] flex items-center gap-2 px-3 py-2">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-4 py-2.5 rounded-full border border-[#EFEFF3] font-['Nunito'] text-sm font-medium text-[#1f1f1f] hover:bg-gray-50 transition-colors"
              >
                {t.aiChat.editInInput}
              </button>
              <button
                type="button"
                onClick={sendFromModal}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 rounded-full bg-[#0063F3] text-white font-['Nunito'] text-sm font-medium hover:bg-[#0052cc] transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              >
                <Send className="size-4" />
                {t.aiChat.sendToAI}
              </button>
            </div>
          )}
        </div>
        </ErrorBoundary>
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
              placeholder={t.aiChat.typeMessage}
              className="flex-1 bg-transparent outline-none font-['Nunito'] text-sm text-[#1f1f1f] placeholder:text-[#c1c1c1] py-2 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={startRecordingWithLanguage}
              disabled={isLoading || !browserSupportsSpeechRecognition}
              className={`size-10 rounded-full grid place-items-center transition-colors ${
                browserSupportsSpeechRecognition
                  ? 'bg-[#EEF2FF] text-[#3B5BDB] hover:bg-[#dde4ff]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              } disabled:opacity-40`}
              aria-label={browserSupportsSpeechRecognition ? t.aiChat.recordVoice : t.aiChat.voiceNotSupported}
              title={browserSupportsSpeechRecognition ? t.aiChat.recordVoice : t.aiChat.voiceNotSupportedTitle}
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
