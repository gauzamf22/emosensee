import { useState, useEffect, useCallback } from "react";
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
import ResetCredentials from "./ResetCredentials";
import HomePage from "./Home";
import AiChat from "./AiChat";
import Auth from "./Auth";
import Onboarding from "./Onboarding";
import Splash from "./Splash";
import Logo from "./Logo";
import { motion } from "motion/react";
import { NotificationProvider, useNotifications } from "./notifications";
import { authService } from "../services/auth";
import apiClient from "../services/api";
import * as insightService from "../services/insightService";
import { useTranslation } from "../translations";

type SubPage =
  | "journaling"
  | "community"
  | "nearby"
  | "emergency"
  | "settings"
  | "activities"
  | "resetCredentials"
  | null;

type NavKey = "home" | "journey" | "ai" | "support" | "profile";

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

type MoodTrend = {
  label: string;
  value: number;
  color: string;
  emoji: string;
  textColor: string;
};

function Sidebar({ active, onSelect }: { active: NavKey; onSelect: (k: NavKey) => void }) {
  const { t } = useTranslation();
  const NAV: { key: NavKey; icon: typeof Home }[] = [
    { key: "home", icon: Home },
    { key: "journey", icon: CalendarHeart },
    { key: "ai", icon: MessageCircle },
    { key: "support", icon: LifeBuoy },
    { key: "profile", icon: User },
  ];
  
  return (
    <aside className="hidden md:flex md:flex-col md:w-20 lg:w-60 border-r border-[#EFEFF3] bg-white py-8 px-3 lg:px-5 shrink-0">
      <div className="flex items-center gap-2 px-2 mb-10">
        <Logo className="size-9 shrink-0" />
        <span className="hidden lg:inline font-['Poppins'] font-semibold text-[#0063F3]">
          EmoSense
        </span>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV.map(({ key, icon: Icon }) => {
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
              <span className="hidden lg:inline">{t.nav[key]}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function BottomNav({ active, onSelect }: { active: NavKey; onSelect: (k: NavKey) => void }) {
  const { t } = useTranslation();
  const NAV: { key: NavKey; icon: typeof Home }[] = [
    { key: "home", icon: Home },
    { key: "journey", icon: CalendarHeart },
    { key: "ai", icon: MessageCircle },
    { key: "support", icon: LifeBuoy },
    { key: "profile", icon: User },
  ];
  
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-[#EFEFF3] pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-stretch justify-around px-2 pt-2 pb-2">
        {NAV.map(({ key, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-lg transition-colors min-w-0 ${
                isActive ? "text-[#3B5BDB]" : "text-[#9b9b9b]"
              }`}
            >
              <Icon className="size-5 shrink-0" strokeWidth={isActive ? 2.4 : 2} />
              <span className="text-[10px] font-['Nunito'] font-semibold truncate max-w-full">
                {t.nav[key]}
              </span>
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
  const { t } = useTranslation();
  
  return (
    <Card>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-['Poppins'] font-semibold text-[#1f1f1f] text-base">{t.home.dailyMood}</h3>
        <PeriodPill>{t.journaling.week}</PeriodPill>
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((day) => (
          <button
            type="button"
            onClick={() =>
              push({
                source: "journey",
                title: `Viewed ${day.d}`,
                body: day.mood ? `Mood logged: ${t.home.moods[day.mood as keyof typeof t.home.moods]}` : "No mood logged yet.",
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
  const { t } = useTranslation();
  const maxH = 220;
  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-['Poppins'] font-semibold text-[#1f1f1f] text-base">{t.home.moodTrends}</h3>
        <PeriodPill>{t.journaling.week}</PeriodPill>
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
          {trends.map((trend) => (
            <div key={trend.label} className="flex justify-center h-full items-center">
              <div
                className={`relative w-full max-w-[68px] rounded-[18px] ${trend.color} flex items-center justify-center`}
                style={{ height: `${(trend.value / 100) * maxH}px`, minHeight: "60px" }}
              >
                {trend.value > 0 && (
                  <span 
                    className="absolute inset-0 flex items-center justify-center font-['Nunito'] font-bold text-xs"
                    style={{ color: trend.textColor }}
                  >
                    {trend.value}%
                  </span>
                )}
                <span className="text-2xl leading-none mt-auto mb-3">{trend.emoji}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-3 sm:gap-5 mt-4">
          {trends.map((trend) => (
            <span
              key={trend.label}
              className="text-center font-['Nunito'] text-sm text-[#9b9b9b]"
            >
              {t.home.moods[trend.label as keyof typeof t.home.moods]}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}

function Insight() {
  const { t } = useTranslation();
  const [insight, setInsight] = useState<insightService.DailyInsight | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        setIsLoadingInsight(true);
        const data = await insightService.getDailyInsight();
        setInsight(data);
      } catch (error) {
        console.error("Failed to fetch insight:", error);
        setInsight(null);
      } finally {
        setIsLoadingInsight(false);
      }
    };

    fetchInsight();
  }, []);

  return (
    <Card>
      <h3 className="font-['Poppins'] font-semibold text-[#1f1f1f] text-base mb-4">
        {t.home.insight.personalizedInsight}
      </h3>
      {isLoadingInsight ? (
        <div className="space-y-2">
          <div className="h-4 bg-gradient-to-r from-[#F1F1F4] via-[#E5E5E8] to-[#F1F1F4] rounded animate-[shimmer_2s_ease-in-out_infinite] bg-[length:200%_100%]" />
          <div className="h-4 bg-gradient-to-r from-[#F1F1F4] via-[#E5E5E8] to-[#F1F1F4] rounded animate-[shimmer_2s_ease-in-out_infinite] bg-[length:200%_100%]" />
          <div className="h-4 w-3/4 bg-gradient-to-r from-[#F1F1F4] via-[#E5E5E8] to-[#F1F1F4] rounded animate-[shimmer_2s_ease-in-out_infinite] bg-[length:200%_100%]" />
        </div>
      ) : insight ? (
        <p className="font-['Nunito'] text-[15px] leading-7 text-[#6B7280]">
          {insight.insight_text}
        </p>
      ) : (
        <p className="font-['Nunito'] text-[15px] leading-7 text-[#9CA3AF] italic">
          {t.home.insight.placeholder}
        </p>
      )}
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
  const [splashDone, setSplashDone] = useState(() => {
    const value = localStorage.getItem('splash_done') === 'true';
    console.log('[App] Initial splashDone:', value);
    return value;
  });
  const [onboarded, setOnboarded] = useState(() => {
    const value = localStorage.getItem('onboarded') === 'true';
    console.log('[App] Initial onboarded:', value);
    return value;
  });
  const [authed, setAuthed] = useState(() => {
    const value = authService.isAuthenticated();
    console.log('[App] Initial authed:', value);
    return value;
  });
  const [active, setActive] = useState<NavKey>("home");
  const [sub, setSub] = useState<SubPage>(null);
  const [days, setDays] = useState<DayMood[]>([]);
  const [trends, setTrends] = useState<MoodTrend[]>([]);
  const [session, setSession] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Stable callbacks to prevent infinite re-renders
  const handleSplashDone = useCallback(() => {
    console.log('[App] handleSplashDone called');
    localStorage.setItem('splash_done', 'true');
    setSplashDone(true);
  }, []);

  const handleOnboardingDone = useCallback(() => {
    console.log('[App] handleOnboardingDone called');
    localStorage.setItem('onboarded', 'true');
    setOnboarded(true);
  }, []);

  const handleAuthed = useCallback(async () => {
    console.log('[App] handleAuthed called');
    
    // Get user from localStorage (already saved by authService.login/register)
    const user = await authService.getCurrentUser();
    
    if (user) {
      console.log('[App] Setting session for user:', user.username);
      setSession({ user });
      setAuthed(true);
      
      // Fetch mood data for the user
      fetchMoodData(user.id);
    } else {
      console.error('[App] handleAuthed called but no user found in localStorage');
    }
  }, []);

  // Fetch mood data from backend API
  const fetchMoodData = async (userId: string) => {
    try {
      // Get last 7 days
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6);
      
      const startDate = sevenDaysAgo.toISOString().split('T')[0];
      const endDate = today.toISOString().split('T')[0];

      const response = await apiClient.get('/api/moods', {
        params: {
          startDate: startDate,
          endDate: endDate,
        }
      });

      const data = response.data;

      // Build 7-day array
      const moodMap = new Map(data?.map((entry: any) => [entry.date_logged, entry.mood]) || []);
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
          label: "angry", 
          value: total > 0 ? Math.round((moodCounts.angry / total) * 100) : 0, 
          color: "bg-[#FADCD9]", 
          emoji: "😠",
          textColor: "#B91C1C"
        },
        { 
          label: "anxious", 
          value: total > 0 ? Math.round((moodCounts.anxious / total) * 100) : 0, 
          color: "bg-[#FBE9B7]", 
          emoji: "😥",
          textColor: "#92400E"
        },
        { 
          label: "sad", 
          value: total > 0 ? Math.round((moodCounts.sad / total) * 100) : 0, 
          color: "bg-[#DCE4F5]", 
          emoji: "😢",
          textColor: "#1E40AF"
        },
        { 
          label: "neutral", 
          value: total > 0 ? Math.round((moodCounts.neutral / total) * 100) : 0, 
          color: "bg-[#EDE6DD]", 
          emoji: "😐",
          textColor: "#78350F"
        },
        { 
          label: "happy", 
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

  // Check for existing session on mount - ONLY after splash and onboarding complete
  useEffect(() => {
    console.log('[App] Auth check effect triggered. splashDone:', splashDone, 'onboarded:', onboarded, 'authChecked:', authChecked);
    
    // Don't check auth until user has completed splash and onboarding
    if (!splashDone || !onboarded) {
      console.log('[App] Skipping auth check - splash or onboarding not complete');
      return;
    }
    
    // Only check once
    if (authChecked) {
      console.log('[App] Auth already checked, skipping');
      return;
    }
    
    const checkAuth = async () => {
      console.log('[App] Running auth check...');
      const user = await authService.getCurrentUser();
      if (user) {
        console.log('[App] Found existing user session:', user.username);
        setSession({ user });
        setAuthed(true);
        fetchMoodData(user.id);
      } else {
        console.log('[App] No existing user session found');
      }
      setAuthChecked(true);
    };
    checkAuth();
  }, [splashDone, onboarded, authChecked]);

  console.log('[App] Current state - splashDone:', splashDone, 'onboarded:', onboarded, 'authed:', authed);

  if (!splashDone) {
    console.log('[App] Rendering Splash');
    return <Splash onDone={handleSplashDone} />;
  }

  if (!onboarded) {
    console.log('[App] Rendering Onboarding');
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <Onboarding onDone={handleOnboardingDone} />
      </motion.div>
    );
  }

  if (!authed) {
    console.log('[App] Rendering Auth');
    return <Auth onAuthed={handleAuthed} />;
  }

  console.log('[App] Rendering Main App');

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
            <Settings onNavigate={(page) => setSub(page)} />
          ) : sub === "resetCredentials" ? (
            <ResetCredentials onBack={() => setSub("settings")} />
          ) : sub === "activities" ? (
            <RecentActivities />
          ) : active === "support" ? (
            <Support onOpen={(key) => setSub(key)} />
          ) : active === "profile" ? (
            <Profile 
              onOpen={(a) => {
                if (a === "home") {
                  setActive("home");
                  setSub(null);
                } else if (a === "journaling") {
                  setActive("journaling");
                  setSub(null);
                } else {
                  setSub(a);
                }
              }}
              session={session}
            />
          ) : active === "home" ? (
            <ErrorBoundary
              fallback={
                <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
                  <p className="text-red-600 font-medium mb-4">Home page error</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Reload
                  </button>
                </div>
              }
            >
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
            </ErrorBoundary>
          ) : active === "ai" ? (
            <AiChat session={session} />
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
