import { useState, useRef, useEffect } from "react";
import { Bell, ArrowRight, BellOff, Check, Trash2 } from "lucide-react";
import { useNotifications, formatRelative } from "./notifications";
import { supabase } from "@/lib/supabase";
import imgJournaling from "@/imports/Support/4cb91f48acd6e9f10f46f5b752c07482e23858b5.png";
import imgNearby from "@/imports/Support/ab093e6ffeb390cf38f1e75977bb7c3bdcfd4f6c.png";
import imgEmergency from "@/imports/Support/c17f0039912ca00b8476ed9dc75efc82ed8164c9.png";

type QuickKey = "journaling" | "nearby" | "emergency";

const QUICK: { key: QuickKey; label: string; img: string; overlay: number }[] = [
  { key: "journaling", label: "Journaling", img: imgJournaling, overlay: 0.4 },
  { key: "nearby", label: "Nearby Services", img: imgNearby, overlay: 0.35 },
  { key: "emergency", label: "Emergency Help", img: imgEmergency, overlay: 0.25 },
];

const MOODS = [
  { key: "angry", label: "Angry", emoji: "😠", color: "#FADCD9" },
  { key: "anxious", label: "Anxious", emoji: "😥", color: "#FBE9B7", active: true },
  { key: "sad", label: "Sad", emoji: "😢", color: "#DCE4F5" },
  { key: "neutral", label: "Neutral", emoji: "😐", color: "#EDE6DD" },
  { key: "happy", label: "Happy", emoji: "🙂", color: "#DCEBC6" },
];

function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

export default function Home({
  onQuickOpen,
  onStartChat,
  session,
  onMoodSaved,
}: {
  onQuickOpen?: (k: QuickKey) => void;
  onStartChat?: () => void;
  session?: any;
  onMoodSaved?: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [todayMood, setTodayMood] = useState<string | null>(null);
  const [loadingMood, setLoadingMood] = useState(true);
  const { enabled, items, unread, push, markAllRead, clear } = useNotifications();
  const [openPanel, setOpenPanel] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Generate dynamic greeting
  const username = session?.user?.user_metadata?.username;
  const greetingText = username 
    ? `Hi, ${username}!` 
    : `${getTimeBasedGreeting()}!`;
  const avatarInitial = username ? username[0].toUpperCase() : "U";

  // Fetch today's mood on mount
  useEffect(() => {
    const fetchTodayMood = async () => {
      if (!session?.user?.id) {
        setLoadingMood(false);
        return;
      }

      try {
        const dateLogged = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from('mood_entries')
          .select('mood')
          .eq('user_id', session.user.id)
          .eq('date_logged', dateLogged)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching today mood:', error);
        }

        if (data) {
          setTodayMood(data.mood);
          setSelected(data.mood);
        }
      } catch (error) {
        console.error('Error fetching today mood:', error);
      } finally {
        setLoadingMood(false);
      }
    };

    fetchTodayMood();
  }, [session?.user?.id]);

  useEffect(() => {
    if (!openPanel) return;
    const handler = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpenPanel(false);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [openPanel]);

  useEffect(() => {
    if (openPanel && unread > 0) markAllRead();
  }, [openPanel, unread, markAllRead]);

  const onMood = async (key: string, label: string) => {
    setSelected(key);
    
    if (!session?.user?.id) {
      push({ source: "home", title: "Error", body: "Please sign in to log your mood." });
      return;
    }

    try {
      const dateLogged = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('mood_entries')
        .upsert(
          {
            user_id: session.user.id,
            mood: key,
            date_logged: dateLogged,
          },
          {
            onConflict: 'user_id,date_logged',
          }
        );

      if (error) throw error;

      setTodayMood(key);
      
      push({ source: "home", title: "Mood checked in", body: `You logged feeling ${label.toLowerCase()}.` });
      
      onMoodSaved?.();
    } catch (error) {
      console.error('Error saving mood:', error);
      push({ source: "home", title: "Error", body: "Failed to save your mood. Please try again." });
    }
  };

  return (
    <div className="flex flex-col gap-6 -mt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-gradient-to-br from-[#A7C7E7] to-[#7A9E7E] grid place-items-center text-white font-['Poppins'] font-bold text-sm">
            {avatarInitial}
          </div>
          <span className="font-['Poppins'] font-semibold text-[#1f1f1f] text-base">
            {greetingText}
          </span>
        </div>
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setOpenPanel((v) => !v)}
            className="relative size-10 rounded-full bg-white border border-[#EFEFF3] grid place-items-center text-[#9b9b9b] hover:text-[#1f1f1f]"
          >
            {enabled ? <Bell className="size-4" /> : <BellOff className="size-4" />}
            {enabled && unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#EC2735] text-white text-[10px] font-['Nunito'] font-bold grid place-items-center ring-2 ring-white">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>
          {openPanel && (
            <div className="absolute right-0 mt-2 w-[320px] sm:w-[360px] bg-white rounded-2xl border border-[#EFEFF3] shadow-[0_20px_40px_-20px_rgba(17,24,39,0.25)] z-40 overflow-hidden">
              <div className="px-4 py-3 flex items-center justify-between border-b border-[#EFEFF3]">
                <span className="font-['Poppins'] font-semibold text-[#1f1f1f] text-sm">Notifications</span>
                <div className="flex items-center gap-1">
                  {items.length > 0 && (
                    <>
                      <button
                        onClick={markAllRead}
                        title="Mark all read"
                        className="size-7 rounded-full grid place-items-center hover:bg-[#F4F6FB] text-[#6B7280]"
                      >
                        <Check className="size-4" />
                      </button>
                      <button
                        onClick={clear}
                        title="Clear all"
                        className="size-7 rounded-full grid place-items-center hover:bg-[#F4F6FB] text-[#6B7280]"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="max-h-[360px] overflow-y-auto">
                {!enabled ? (
                  <p className="px-4 py-8 text-center font-['Nunito'] text-sm text-[#9b9b9b]">
                    Notifications are off. Turn them on in Settings.
                  </p>
                ) : items.length === 0 ? (
                  <p className="px-4 py-8 text-center font-['Nunito'] text-sm text-[#9b9b9b]">
                    You're all caught up.
                  </p>
                ) : (
                  items.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 border-b border-[#F4F6FB] last:border-b-0 flex gap-3 ${
                        n.read ? "" : "bg-[#F5F8FF]"
                      }`}
                    >
                      <span className="mt-1.5 size-2 rounded-full bg-[#3B5BDB] shrink-0" style={{ opacity: n.read ? 0 : 1 }} />
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-['Nunito'] font-semibold text-[13px] text-[#1f1f1f]">{n.title}</span>
                        {n.body && (
                          <span className="font-['Nunito'] text-[12px] text-[#6B7280] leading-snug">{n.body}</span>
                        )}
                        <span className="font-['Nunito'] text-[11px] text-[#9b9b9b] mt-0.5">{formatRelative(n.time)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-['Poppins'] font-bold text-[#1f1f1f] text-2xl sm:text-3xl leading-tight">
          How are you feeling today?
        </h2>
        <p className="font-['Nunito'] text-sm text-[#9b9b9b]">
          Your feelings are valid. Let take a moment to check-in
        </p>
      </div>

      <section className="bg-white rounded-2xl border border-[#EFEFF3] shadow-[0_8px_24px_-12px_rgba(17,24,39,0.06)] p-4 sm:p-5">
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {MOODS.map((m) => {
            const isActive = selected === m.key;
            return (
              <button
                key={m.key}
                onClick={() => onMood(m.key, m.label)}
                disabled={loadingMood}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all ${
                  isActive ? "ring-2 ring-offset-1" : "hover:bg-[#F8F9FC]"
                }`}
                style={{
                  backgroundColor: isActive ? m.color : "transparent",
                  ...(isActive ? ({ "--tw-ring-color": m.color } as React.CSSProperties) : {}),
                }}
              >
                <span className="text-2xl sm:text-3xl leading-none">{m.emoji}</span>
                <span
                  className={`font-['Nunito'] text-xs ${
                    isActive ? "text-[#1f1f1f] font-semibold" : "text-[#9b9b9b]"
                  }`}
                >
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="relative rounded-2xl p-[2px] overflow-hidden">
        <span
          className="absolute inset-[-50%] animate-[spin_5s_linear_infinite]"
          style={{
            backgroundImage:
              "conic-gradient(from 0deg, #ffffff 0deg, #3B5BDB 90deg, #ffffff 180deg, #7280FF 270deg, #ffffff 360deg)",
          }}
        />
        <section className="relative bg-white rounded-[14px] shadow-[0_8px_24px_-12px_rgba(17,24,39,0.06)] p-5">
          <h3 className="font-['Poppins'] font-semibold text-[#3B5BDB] text-sm mb-2">
            Personalized Insight
          </h3>
          <p className="font-['Nunito'] text-sm text-[#9b9b9b] leading-6 line-clamp-2">
            A brief overview of your recent emotional patterns. Your recent check-ins suggest
            moments of emotional...
          </p>
        </section>
      </div>

      <section
        className="rounded-2xl px-5 sm:px-6 py-6 sm:py-7 flex flex-col gap-4 text-white shadow-[0_10px_20px_-10px_rgba(0,99,243,0.35)]"
        style={{
          backgroundImage:
            "linear-gradient(-24.67deg, rgb(234, 244, 255) 23.93%, rgb(84, 127, 255) 128.87%)",
        }}
      >
        <div className="flex flex-col gap-3 max-w-md">
          <h3 className="font-['Poppins'] font-medium text-xl sm:text-2xl leading-tight">
            Mosens AI Chat
            <br />
            is here for you!
          </h3>
          <p className="font-['Inter'] text-xs sm:text-sm leading-relaxed text-white/95">
            Talk about anything that's on your mind. I'm here to listen & support you.
          </p>
        </div>
        <button
          onClick={() => onStartChat?.()}
          className="bg-[#0063F3] hover:bg-[#0052cc] transition-colors rounded-xl px-4 py-3 flex items-center justify-between font-['Poppins'] font-medium text-sm"
        >
          <span>Start Conversation</span>
          <ArrowRight className="size-4" />
        </button>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="font-['Poppins'] font-medium text-[#242424] text-base">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          {QUICK.map((q) => (
            <button
              key={q.key}
              onClick={() => onQuickOpen?.(q.key)}
              className="group relative h-24 sm:h-28 rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#3B5BDB]/40"
            >
              <img
                src={q.img}
                alt={q.label}
                className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${q.overlay})` }} />
              <span className="absolute inset-0 grid place-items-center text-white font-['Poppins'] font-medium text-xs sm:text-sm text-center px-2">
                {q.label}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
