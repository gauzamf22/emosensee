# Fix Home Blank Page Loop

## Problem
After successful auth, user reaches home page but may encounter blank page loop if Home component crashes.

## Root Cause
HomePage component (App.tsx:599-614) has NO error boundary, unlike Onboarding which has one (App.tsx:488-498). If Home.tsx crashes during render or hook execution, entire app shows blank page.

## Solution

### 1. Add Error Boundary for HomePage in App.tsx

**Location**: App.tsx:598-614

**Change**: Wrap HomePage in error boundary similar to Onboarding

**Before**:
```tsx
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
```

**After**:
```tsx
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
```

### 2. Add Debug Logs to Home.tsx

**Locations**:
- After line 32 (component mount)
- In each useEffect (lines 64, 94, 105, 114)
- Before return statement (render phase)

**Changes**:

**A. Component mount log (after line 32)**:
```tsx
const panelRef = useRef<HTMLDivElement>(null);

console.log('[Home] Component mounted', {
  hasSession: !!session,
  userId: session?.user?.id,
  username: session?.user?.username,
});
```

**B. Mood fetch useEffect (line 64)**:
```tsx
useEffect(() => {
  console.log('[Home] useEffect: fetchTodayMood started', { userId: session?.user?.id });
  
  const fetchTodayMood = async () => {
    if (!session?.user?.id) {
      console.log('[Home] fetchTodayMood: No user ID, skipping');
      setLoadingMood(false);
      return;
    }

    try {
      const dateLogged = new Date().toISOString().split('T')[0];
      console.log('[Home] fetchTodayMood: Fetching for date', dateLogged);
      
      const response = await apiClient.get('/api/moods', {
        params: { startDate: dateLogged, endDate: dateLogged, limit: 1 }
      });

      if (response.data && response.data.length > 0) {
        const moodData = response.data[0];
        console.log('[Home] fetchTodayMood: Success', { mood: moodData.mood });
        setTodayMood(moodData.mood);
        setSelected(moodData.mood);
      } else {
        console.log('[Home] fetchTodayMood: No mood data found');
      }
    } catch (error) {
      console.error('[Home] fetchTodayMood: Error', error);
    } finally {
      setLoadingMood(false);
      console.log('[Home] fetchTodayMood: Complete');
    }
  };

  fetchTodayMood();
}, [session?.user?.id]);
```

**C. Insight fetch useEffect (line 94)**:
```tsx
useEffect(() => {
  console.log('[Home] useEffect: fetchInsight started');
  
  const fetchInsight = async () => {
    setInsightLoading(true);
    try {
      const data = await getDailyInsight();
      console.log('[Home] fetchInsight: Success', { hasData: !!data });
      setInsight(data);
    } catch (error) {
      console.error('[Home] fetchInsight: Error', error);
      setInsight(null);
    } finally {
      setInsightLoading(false);
      console.log('[Home] fetchInsight: Complete');
    }
  };

  fetchInsight();
}, []);
```

**D. Click outside useEffect (line 105)** - add log:
```tsx
useEffect(() => {
  if (!openPanel) return;
  console.log('[Home] useEffect: Click outside listener attached');
  const handler = (e: MouseEvent) => {
    if (!panelRef.current?.contains(e.target as Node)) setOpenPanel(false);
  };
  window.addEventListener("mousedown", handler);
  return () => {
    console.log('[Home] useEffect: Click outside listener removed');
    window.removeEventListener("mousedown", handler);
  };
}, [openPanel]);
```

**E. Mark read useEffect (line 114)** - add log:
```tsx
useEffect(() => {
  if (openPanel && unread > 0) {
    console.log('[Home] useEffect: Marking notifications read', { unread });
    markAllRead();
  }
}, [openPanel, unread, markAllRead]);
```

**F. Before return (around line 118)** - add render log:
```tsx
console.log('[Home] Rendering', {
  loadingMood,
  todayMood,
  selected,
  insightLoading,
  hasInsight: !!insight,
  openPanel,
  unread,
});

return (
  <div className="flex flex-col gap-6 pb-20">
```

### 3. Add Error Handling for Hooks

**Location**: Home.tsx:24-32

**Change**: Wrap potentially throwing hooks in try/catch

**Before**:
```tsx
const { t } = useTranslation();
const [selected, setSelected] = useState<string | null>(null);
const [todayMood, setTodayMood] = useState<string | null>(null);
const [loadingMood, setLoadingMood] = useState(true);
const [insight, setInsight] = useState<DailyInsight | null>(null);
const [insightLoading, setInsightLoading] = useState(true);
const { enabled, items, unread, push, markAllRead, clear } = useNotifications();
const [openPanel, setOpenPanel] = useState(false);
const panelRef = useRef<HTMLDivElement>(null);
```

**After**:
```tsx
let t;
try {
  const translation = useTranslation();
  t = translation.t;
} catch (error) {
  console.error('[Home] useTranslation error:', error);
  // Fallback to empty translations
  t = {} as any;
}

const [selected, setSelected] = useState<string | null>(null);
const [todayMood, setTodayMood] = useState<string | null>(null);
const [loadingMood, setLoadingMood] = useState(true);
const [insight, setInsight] = useState<DailyInsight | null>(null);
const [insightLoading, setInsightLoading] = useState(true);

let notificationsHook;
try {
  notificationsHook = useNotifications();
} catch (error) {
  console.error('[Home] useNotifications error:', error);
  // Fallback to disabled notifications
  notificationsHook = {
    enabled: false,
    items: [],
    unread: 0,
    push: () => {},
    markAllRead: () => {},
    clear: () => {},
  };
}
const { enabled, items, unread, push, markAllRead, clear } = notificationsHook;

const [openPanel, setOpenPanel] = useState(false);
const panelRef = useRef<HTMLDivElement>(null);
```

## Testing Steps

1. Clear localStorage: `localStorage.clear()`
2. Reload app
3. Complete auth flow
4. Check console for `[Home]` logs
5. Verify home page renders without blank page
6. If error occurs, error boundary should show fallback UI

## Expected Console Output

```
[Home] Component mounted { hasSession: true, userId: '...', username: '...' }
[Home] useEffect: fetchTodayMood started { userId: '...' }
[Home] useEffect: fetchInsight started
[Home] Rendering { loadingMood: true, todayMood: null, ... }
[Home] fetchTodayMood: Fetching for date 2026-05-28
[Home] fetchInsight: Success { hasData: true }
[Home] fetchInsight: Complete
[Home] fetchTodayMood: Success { mood: 'happy' }
[Home] fetchTodayMood: Complete
[Home] Rendering { loadingMood: false, todayMood: 'happy', ... }
```

## Files to Edit

1. `/home/ubuntu/emosensee/src/app/App.tsx` - Add error boundary around HomePage (line 598)
2. `/home/ubuntu/emosensee/src/app/Home.tsx` - Add debug logs + error handling for hooks (lines 24-32, 64-116, before return)

## Rollback Plan

If issues occur:
1. Remove error boundary from App.tsx
2. Remove debug logs from Home.tsx
3. Revert hook error handling in Home.tsx
