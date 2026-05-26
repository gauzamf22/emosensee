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

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);

  const push = useCallback<Ctx["push"]>(
    (n) => {
      if (!enabled) return;
      setItems((prev) => [
        { ...n, id: Date.now() + Math.random(), time: Date.now(), read: false },
        ...prev,
      ].slice(0, 30));
    },
    [enabled]
  );

  const markAllRead = useCallback(
    () => setItems((prev) => prev.map((n) => ({ ...n, read: true }))),
    []
  );
  const clear = useCallback(() => setItems([]), []);

  const unread = items.filter((i) => !i.read).length;

  return (
    <NotificationContext.Provider
      value={{ enabled, setEnabled, items, unread, push, markAllRead, clear }}
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
