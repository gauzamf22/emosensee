import { useState, useEffect } from "react";
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
import { supabase } from "../lib/supabase";

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

type DayMood = {
  d: string;
  n: number;
  mood: string | null;
  active?: boolean;
};

const MOOD_EMOJI: Record<string, string> = {
  happy: "😊",
  neutral: "😐",
  sad: "😔",
  anxious: "😥",
  angry: "😠",
};

const MOOD_LABEL: Record<string, string> = {
  happy: "Happy",
  neutral: "Neutral",
  sad: "Sad",
  anxious: "Anxious",
  angry: "Angry",
};

type MoodTrend = {
  label: string;
  value: number;
  color: string;
  emoji: string;
  textColor: string;
};

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

function DailyMood({ days }: { days: DayMood[] }) {
  const { push } = useNotifications();
  return (
    <Card>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-['Poppins'] font-semibold text-[#1f1f1f] text-base">Daily Mood</h3>
        <PeriodPill />
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((day) => (
          <button
            type="button"
            onClick={() =>
              push({
                source: "journey",
                title: `Viewed ${day.d}`,
                body: day.mood ? `Mood logged: ${MOOD_LABEL[day.mood]}` : "No mood logged yet.",
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

function MoodTrends({ trends }: { trends: MoodTrend[] }) {
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
          {trends.map((t) => (
            <div key={t.label} className="flex justify-center h-full items-center">
              <div
                className={`relative w-full max-w-[68px] rounded-[18px] ${t.color} flex items-center justify-center`}
                style={{ height: `${(t.value / 100) * maxH}px`, minHeight: "60px" }}
              >
                {t.value > 0 && (
                  <span 
                    className="absolute inset-0 flex items-center justify-center font-['Nunito'] font-bold text-xs"
                    style={{ color: t.textColor }}
                  >
                    {t.value}%
                  </span>
                )}
                <span className="text-2xl leading-none mt-auto mb-3">{t.emoji}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-3 sm:gap-5 mt-4">
          {trends.map((t) => (
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
  const [days, setDays] = useState<DayMood[]>([]);
  const [trends, setTrends] = useState<MoodTrend[]>([]);
  const [session, setSession] = useState<any>(null);

  // Fetch mood data from Supabase
  const fetchMoodData = async (userId: string) => {
    try {
      // Get last 7 days
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6);
      
      const startDate = sevenDaysAgo.toISOString().split('T')[0];
      const endDate = today.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('mood_entries')
        .select('mood, date_logged')
        .eq('user_id', userId)
        .gte('date_logged', startDate)
        .lte('date_logged', endDate)
        .order('date_logged', { ascending: true });

      if (error) throw error;

      // Build 7-day array
      const moodMap = new Map(data?.map(entry => [entry.date_logged, entry.mood]) || []);
      const daysArray: DayMood[] = [];
      const todayStr = today.toISOString().split('T')[0];

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
        
        daysArray.push({
          d: dayName,
          n: date.getDate(),
          mood: moodMap.get(dateStr) || null,
          active: dateStr === todayStr,
        });
      }

      setDays(daysArray);

      // Calculate mood statistics
      const moodCounts: Record<string, number> = {
        angry: 0,
        anxious: 0,
        sad: 0,
        neutral: 0,
        happy: 0,
      };

      data?.forEach(entry => {
        if (entry.mood && moodCounts.hasOwnProperty(entry.mood)) {
          moodCounts[entry.mood]++;
        }
      });

      const total = data?.length || 0;
      const maxMood = total > 0 
        ? Object.entries(moodCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0]
        : 'anxious';

      const trendsArray: MoodTrend[] = [
        { 
          label: "Angry", 
          value: total > 0 ? Math.round((moodCounts.angry / total) * 100) : 0, 
          color: "bg-[#FADCD9]", 
          emoji: "😠",
          textColor: "#B91C1C"
        },
        { 
          label: "Anxious", 
          value: total > 0 ? Math.round((moodCounts.anxious / total) * 100) : 0, 
          color: "bg-[#FBE9B7]", 
          emoji: "😥",
          textColor: "#92400E"
        },
        { 
          label: "Sad", 
          value: total > 0 ? Math.round((moodCounts.sad / total) * 100) : 0, 
          color: "bg-[#DCE4F5]", 
          emoji: "😢",
          textColor: "#1E40AF"
        },
        { 
          label: "Neutral", 
          value: total > 0 ? Math.round((moodCounts.neutral / total) * 100) : 0, 
          color: "bg-[#EDE6DD]", 
          emoji: "😐",
          textColor: "#78350F"
        },
        { 
          label: "Happy", 
          value: total > 0 ? Math.round((moodCounts.happy / total) * 100) : 0, 
          color: "bg-[#DCEBC6]", 
          emoji: "😊",
          textColor: "#15803D"
        },
      ];

      setTrends(trendsArray);
    } catch (error) {
      console.error('Error fetching mood data:', error);
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setAuthed(true);
        fetchMoodData(session.user.id);
      }
    });
  }, []);

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
              session={session}
              onQuickOpen={(k) => {
                setActive("support");
                setSub(k);
              }}
              onStartChat={() => {
                setActive("ai");
                setSub(null);
              }}
              onMoodSaved={() => {
                if (session?.user?.id) {
                  fetchMoodData(session.user.id);
                }
              }}
            />
          ) : active === "ai" ? (
            <AiChat />
          ) : (
            <>
              <DailyMood days={days} />
              <MoodTrends trends={trends} />
              <Insight />
            </>
          )}
        </motion.div>
      </main>

      <BottomNav active={active} onSelect={selectNav} />
    </div>
  );
}
