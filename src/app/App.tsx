import { useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Home,
  CalendarHeart,
  MessageCircle,
  LifeBuoy,
  User,
} from "lucide-react";
import Support from "./Support";
import Journaling from "./Journaling";
import Community from "./Community";
import Nearby from "./Nearby";
import Emergency from "./Emergency";
import Profile from "./Profile";
import Settings from "./Settings";
import RecentActivities from "./RecentActivities";
import HomePage from "./Home";
import AiChat from "./AiChat";
import Auth from "./Auth";
import Onboarding from "./Onboarding";
import Splash from "./Splash";
import Logo from "./Logo";
import { motion } from "motion/react";
import { NotificationProvider, useNotifications } from "./notifications";
import AnxietyChick from "./AnxietyChick";

type SubPage =
  | "journaling"
  | "community"
  | "nearby"
  | "emergency"
  | "settings"
  | "activities"
  | null;

type NavKey = "home" | "journey" | "ai" | "support" | "profile";

const NAV: { key: NavKey; label: string; icon: typeof Home }[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "journey", label: "Journey", icon: CalendarHeart },
  { key: "ai", label: "AI Chat", icon: MessageCircle },
  { key: "support", label: "Support", icon: LifeBuoy },
  { key: "profile", label: "Profile", icon: User },
];

const DAYS = [
  { d: "Sun", n: 3, mood: "happy" as const },
  { d: "Mon", n: 4, mood: "neutral" as const },
  { d: "Tue", n: 5, mood: "sad" as const },
  { d: "Wed", n: 6, mood: "happy" as const, active: true },
  { d: "Thu", n: 7, mood: null },
  { d: "Fri", n: 8, mood: null },
  { d: "Sat", n: 9, mood: null },
];

const MOOD_EMOJI: Record<string, string> = {
  happy: "😊",
  neutral: "😐",
  sad: "😔",
  anxious: "🐥",
  angry: "😠",
};

const TRENDS = [
  { label: "Angry", value: 32, color: "bg-[#FADCD9]", emoji: "😠" },
  { label: "Anxious", value: 82, color: "bg-[#FBE9B7]", emoji: "chick", showPct: true },
  { label: "Sad", value: 28, color: "bg-[#DCE4F5]", emoji: "😢" },
  { label: "Neutral", value: 22, color: "bg-[#EDE6DD]", emoji: "😐" },
  { label: "Happy", value: 70, color: "bg-[#DCEBC6]", emoji: "😊" },
];

function Sidebar({ active, onSelect }: { active: NavKey; onSelect: (k: NavKey) => void }) {
  return (
    <aside className="hidden md:flex md:flex-col md:w-20 lg:w-60 border-r border-[#EFEFF3] bg-white py-8 px-3 lg:px-5 shrink-0">
      <div className="flex items-center gap-2 px-2 mb-10">
        <Logo className="size-9 shrink-0" />
        <span className="hidden lg:inline font-['Poppins'] font-semibold text-[#0063F3]">
          EmoSense
        </span>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors font-['Nunito'] font-semibold text-sm ${
                isActive
                  ? "bg-[#EEF2FF] text-[#3B5BDB]"
                  : "text-[#9b9b9b] hover:bg-[#F6F7FB] hover:text-[#242424]"
              }`}
            >
              <Icon className="size-5 shrink-0" strokeWidth={isActive ? 2.4 : 2} />
              <span className="hidden lg:inline">{label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function BottomNav({ active, onSelect }: { active: NavKey; onSelect: (k: NavKey) => void }) {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-[#EFEFF3] pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-stretch justify-around px-2 pt-2 pb-2">
        {NAV.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`flex flex-col items-center gap-1 flex-1 py-1.5 transition-colors font-['Nunito'] ${
                isActive ? "text-[#3B5BDB]" : "text-[#9b9b9b]"
              }`}
            >
              <Icon className="size-5" strokeWidth={isActive ? 2.4 : 2} />
              <span className="text-[11px] font-semibold">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`bg-white rounded-2xl border border-[#EFEFF3] shadow-[0_8px_24px_-12px_rgba(17,24,39,0.06)] p-5 sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

function PeriodPill({ children = "Week" }: { children?: string }) {
  return (
    <button className="flex items-center gap-1 text-[#9b9b9b] font-['Nunito'] font-medium text-sm">
      {children}
      <ChevronDown className="size-4" />
    </button>
  );
}

function DailyMood() {
  const { push } = useNotifications();
  return (
    <Card>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-['Poppins'] font-semibold text-[#1f1f1f] text-base">Daily Mood</h3>
        <PeriodPill />
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {DAYS.map((day) => (
          <button
            type="button"
            onClick={() =>
              push({
                source: "journey",
                title: `Viewed ${day.d}`,
                body: day.mood ? `Mood logged: ${day.mood}` : "No mood logged yet.",
              })
            }
            key={day.d}
            className={`flex flex-col items-center justify-center gap-2 py-3 rounded-xl ${
              day.active ? "bg-[#EEF2FF]" : ""
            }`}
          >
            <span className="font-['Nunito'] text-xs text-[#9b9b9b]">{day.d}</span>
            <span className="font-['Nunito'] text-xs text-[#242424]">{day.n}</span>
            {day.mood ? (
              <span className="text-lg leading-none">{MOOD_EMOJI[day.mood]}</span>
            ) : (
              <div className="size-7 rounded-lg bg-[#F4F6FB]" />
            )}
          </button>
        ))}
      </div>
    </Card>
  );
}

function MoodTrends() {
  const maxH = 220;
  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-['Poppins'] font-semibold text-[#1f1f1f] text-base">Mood Trends</h3>
        <PeriodPill />
      </div>
      <div className="relative">
        <div
          className="absolute left-0 right-0 border-t border-dashed border-[#E5E7EB]"
          style={{ top: "50%" }}
        />
        <div
          className="relative grid grid-cols-5 gap-3 sm:gap-5 items-center"
          style={{ height: `${maxH}px` }}
        >
          {TRENDS.map((t) => (
            <div key={t.label} className="flex justify-center h-full items-center">
              <div
                className={`relative w-full max-w-[68px] rounded-[18px] ${t.color} flex flex-col items-center justify-between py-3`}
                style={{ height: `${(t.value / 100) * maxH}px`, minHeight: "60px" }}
              >
                {t.showPct && (
                  <span className="font-['Nunito'] font-bold text-xs text-[#5C8A2A]">
                    {t.value}%
                  </span>
                )}
                {t.emoji === "chick" ? (
                  <span className="mt-auto"><AnxietyChick className="size-8" /></span>
                ) : (
                  <span className="text-2xl leading-none mt-auto">{t.emoji}</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-3 sm:gap-5 mt-4">
          {TRENDS.map((t) => (
            <span
              key={t.label}
              className="text-center font-['Nunito'] text-sm text-[#9b9b9b]"
            >
              {t.label}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}

function Insight() {
  return (
    <Card>
      <h3 className="font-['Poppins'] font-semibold text-[#1f1f1f] text-base mb-4">
        Personalized Insight
      </h3>
      <p className="font-['Nunito'] text-[15px] leading-7 text-[#6B7280]">
        A brief overview of your recent emotional patterns. Your recent check-ins suggest
        moments of emotional fatigue during busy days. Taking short pauses and reflecting on
        your feelings may help you feel more balanced.
      </p>
    </Card>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <AppInner />
    </NotificationProvider>
  );
}

function AppInner() {
  const [splashDone, setSplashDone] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [active, setActive] = useState<NavKey>("home");
  const [sub, setSub] = useState<SubPage>(null);

  if (!splashDone) {
    return <Splash onDone={() => setSplashDone(true)} />;
  }

  if (!onboarded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <Onboarding onDone={() => setOnboarded(true)} />
      </motion.div>
    );
  }

  if (!authed) {
    return <Auth onAuthed={() => setAuthed(true)} />;
  }

  const selectNav = (k: NavKey) => {
    setActive(k);
    setSub(null);
  };

  const title =
    sub === "journaling"
      ? "Journal"
      : sub === "community"
      ? "Community"
      : sub === "nearby"
      ? "Nearby Service"
      : sub === "emergency"
      ? "Emergency Help"
      : sub === "settings"
      ? "Setting"
      : sub === "activities"
      ? "Recent Activities"
      : active === "profile"
      ? "Profile"
      : active === "home"
      ? "Home"
      : active === "ai"
      ? "AI Chat"
      : active === "support"
      ? "Support Hub"
      : active === "journey"
      ? "Journey"
      : NAV.find((n) => n.key === active)?.label;

  const showBack = sub !== null;

  return (
    <div className="min-h-screen w-full flex bg-[#F8F9FC] text-[#242424]">
      <Sidebar active={active} onSelect={selectNav} />

      <main className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 bg-[#F8F9FC]/85 backdrop-blur border-b border-[#EFEFF3]">
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex items-center gap-3">
            <button
              onClick={() => showBack && setSub(null)}
              className={`size-9 rounded-full grid place-items-center hover:bg-[#EFEFF3] text-[#242424] ${
                showBack ? "" : "opacity-60"
              }`}
            >
              <ArrowLeft className="size-5" />
            </button>
            <h1 className="flex-1 text-center md:text-left font-['Poppins'] font-semibold text-[#1f1f1f] text-base md:text-lg">
              {title}
            </h1>
            <div className="size-9 md:hidden" />
          </div>
        </header>

        <motion.div
          key={`${active}-${sub ?? "root"}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-6 pb-28 md:pb-10 flex flex-col gap-5 sm:gap-6"
        >
          {sub === "journaling" ? (
            <Journaling />
          ) : sub === "community" ? (
            <Community />
          ) : sub === "nearby" ? (
            <Nearby />
          ) : sub === "emergency" ? (
            <Emergency />
          ) : sub === "settings" ? (
            <Settings />
          ) : sub === "activities" ? (
            <RecentActivities />
          ) : active === "support" ? (
            <Support onOpen={(key) => setSub(key)} />
          ) : active === "profile" ? (
            <Profile onOpen={(a) => setSub(a)} />
          ) : active === "home" ? (
            <HomePage
              onQuickOpen={(k) => {
                setActive("support");
                setSub(k);
              }}
              onStartChat={() => {
                setActive("ai");
                setSub(null);
              }}
            />
          ) : active === "ai" ? (
            <AiChat />
          ) : (
            <>
              <DailyMood />
              <MoodTrends />
              <Insight />
            </>
          )}
        </motion.div>
      </main>

      <BottomNav active={active} onSelect={selectNav} />
    </div>
  );
}
