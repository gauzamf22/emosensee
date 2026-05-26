import { Settings as SettingsIcon, History, ChevronRight, LogOut } from "lucide-react";
import { useNotifications } from "./notifications";

type Action = "settings" | "activities";

function Row({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl px-4 py-4 flex items-center justify-between border border-[#EFEFF3] hover:bg-[#F8F9FC] transition-colors"
    >
      <div className={`flex items-center gap-3 ${danger ? "text-[#EC2735]" : "text-[#1e1e1e]"}`}>
        {icon}
        <span className="font-['Nunito'] text-sm">{label}</span>
      </div>
      <ChevronRight className={`size-4 ${danger ? "text-[#EC2735]" : "text-[#808080]"}`} />
    </button>
  );
}

export default function Profile({ onOpen }: { onOpen?: (a: Action) => void }) {
  const { push } = useNotifications();
  const go = (a: Action, label: string) => {
    push({ source: "profile", title: `${label} opened` });
    onOpen?.(a);
  };
  return (
    <div className="flex flex-col gap-8 -mt-2">
      <div className="flex flex-col items-center gap-4 pt-4">
        <div className="size-24 sm:size-28 rounded-full bg-gradient-to-br from-[#A7C7E7] to-[#7A9E7E] grid place-items-center text-white font-['Poppins'] font-bold text-2xl shadow-md">
          LH
        </div>
        <div className="text-center">
          <h2 className="font-['Nunito'] font-bold text-[#4d4d4d] text-base">Layla Holmes</h2>
          <p className="font-['Nunito'] font-medium text-[#808080] text-xs mt-1">
            laylaholmes@gmail.com
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 max-w-xl w-full mx-auto">
        <Row
          icon={<SettingsIcon className="size-[18px]" />}
          label="Setting"
          onClick={() => go("settings", "Settings")}
        />
        <Row
          icon={<History className="size-[18px]" />}
          label="Recent Activities"
          onClick={() => go("activities", "Recent Activities")}
        />
      </div>

      <div className="max-w-xl w-full mx-auto mt-auto">
        <Row icon={<LogOut className="size-[18px]" />} label="Log out" danger />
      </div>
    </div>
  );
}
