import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Notification = {
  id: number;
  source: "home" | "journey" | "ai" | "support" | "profile";
  title: string;
  body?: string;
  time: number;
  read: boolean;
};

type Ctx = {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  items: Notification[];
  unread: number;
  push: (n: Omit<Notification, "id" | "time" | "read">) => void;
  markAllRead: () => void;
  clear: () => void;
};

const NotificationContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "emosense_notifications";

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as { enabled: boolean; items: Notification[] };
  } catch { /* ignore */ }
  return null;
}

function persistState(enabled: boolean, items: Notification[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ enabled, items }));
  } catch { /* ignore */ }
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const saved = loadPersisted();
  const [enabled, setEnabled] = useState(saved?.enabled ?? true);
  const [items, setItems] = useState<Notification[]>(saved?.items ?? []);

  const setEnabledAndPersist = useCallback((v: boolean) => {
    setEnabled(v);
    persistState(v, items);
  }, [items]);

  const push = useCallback<Ctx["push"]>(
    (n) => {
      if (!enabled) return;
      setItems((prev) => {
        const next = [
          { ...n, id: Date.now() + Math.random(), time: Date.now(), read: false },
          ...prev,
        ].slice(0, 30);
        persistState(enabled, next);
        return next;
      });
    },
    [enabled]
  );

  const markAllRead = useCallback(
    () => setItems((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      persistState(enabled, next);
      return next;
    }),
    [enabled]
  );

  const clear = useCallback(() => {
    setItems([]);
    persistState(enabled, []);
  }, [enabled]);

  const unread = items.filter((i) => !i.read).length;

  return (
    <NotificationContext.Provider
      value={{ enabled, setEnabled: setEnabledAndPersist, items, unread, push, markAllRead, clear }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications outside provider");
  return ctx;
}

export function formatRelative(t: number) {
  const diff = Math.floor((Date.now() - t) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(t).toLocaleDateString();
}
