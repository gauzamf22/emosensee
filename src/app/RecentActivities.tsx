import { CalendarHeart, MessageCircle, BookOpen, Users, MapPin } from "lucide-react";

const STATS = [
  { label: "Mood check-ins", value: "24", hint: "this month" },
  { label: "Journal entries", value: "12", hint: "this month" },
  { label: "AI chats", value: "8", hint: "this month" },
  { label: "Streak", value: "6", hint: "days" },
];

const ACTIVITIES = [
  { icon: CalendarHeart, color: "#3B5BDB", bg: "#EEF2FF", label: "Logged mood: Happy", time: "Today, 09:12" },
  { icon: BookOpen, color: "#5C8A2A", bg: "#ECF6DA", label: "New journal: Day 6 - Bitter Sweet College", time: "Today, 08:40" },
  { icon: MessageCircle, color: "#B45309", bg: "#FEF3C7", label: "AI Chat session (15 min)", time: "Yesterday, 21:05" },
  { icon: Users, color: "#7C3AED", bg: "#EDE9FE", label: "Visited Community: Riliv", time: "Yesterday, 18:22" },
  { icon: MapPin, color: "#DB2777", bg: "#FCE7F3", label: "Searched Nearby Service", time: "May 21, 14:30" },
  { icon: CalendarHeart, color: "#3B5BDB", bg: "#EEF2FF", label: "Logged mood: Anxious", time: "May 21, 09:00" },
];

export default function RecentActivities() {
  return (
    <div className="flex flex-col gap-6 -mt-2">
      <p className="font-['Inter'] font-medium text-sm text-[#9b9b9b]">
        Your recent activity overview.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-[#EFEFF3] shadow-[0_8px_24px_-12px_rgba(17,24,39,0.06)] p-4 sm:p-5 flex flex-col gap-1"
          >
            <span className="font-['Poppins'] font-bold text-2xl text-[#1f1f1f]">
              {s.value}
            </span>
            <span className="font-['Nunito'] text-sm text-[#1f1f1f]">{s.label}</span>
            <span className="font-['Nunito'] text-xs text-[#9b9b9b]">{s.hint}</span>
          </div>
        ))}
      </div>

      <section className="bg-white rounded-2xl border border-[#EFEFF3] shadow-[0_8px_24px_-12px_rgba(17,24,39,0.06)] p-2 sm:p-3">
        <h3 className="font-['Poppins'] font-semibold text-[#1f1f1f] text-base px-3 pt-3 pb-2">
          Activity timeline
        </h3>
        <ul className="divide-y divide-[#EFEFF3]">
          {ACTIVITIES.map(({ icon: Icon, color, bg, label, time }, i) => (
            <li key={i} className="flex items-center gap-3 p-3">
              <div
                className="size-10 rounded-xl grid place-items-center shrink-0"
                style={{ backgroundColor: bg, color }}
              >
                <Icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-['Nunito'] text-sm text-[#1f1f1f] truncate">{label}</p>
                <p className="font-['Nunito'] text-xs text-[#9b9b9b]">{time}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
