import { ChevronRight } from "lucide-react";
import { useNotifications } from "./notifications";
import { useTranslation } from "../translations";
import { useLanguage } from "../contexts/LanguageContext";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function FieldRow({
  label,
  value,
  last,
  first,
  onClick,
}: {
  label: string;
  value?: string;
  last?: boolean;
  first?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full bg-white px-4 py-4 flex items-center justify-between ${
        !last ? "border-b border-[#EFEFF3]" : ""
      } ${first ? "rounded-t-xl" : ""} ${last ? "rounded-b-xl" : ""} hover:bg-[#F8F9FC]`}
    >
      <div className="flex flex-col gap-1 items-start text-left min-w-0">
        <span className="font-['Nunito'] text-sm text-[#1e1e1e]">{label}</span>
        {value && (
          <span className="font-['Nunito'] text-sm text-[#808080] truncate max-w-[260px]">
            {value}
          </span>
        )}
      </div>
      <ChevronRight className="size-4 text-[#808080] shrink-0" />
    </button>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-6 rounded-full transition-colors ${
        checked ? "bg-[#3B5BDB]" : "bg-[#CCCCCC]"
      }`}
    >
      <span
        className={`absolute top-1 size-4 bg-white rounded-full shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h3 className="font-['Nunito'] font-bold text-[#333] text-base">{children}</h3>
  );
}

function LanguageButton({ 
  label, 
  selected, 
  onClick 
}: { 
  label: string; 
  selected: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-4 py-3 font-['Nunito'] text-sm transition-colors ${
        selected 
          ? "bg-[#3B5BDB] text-white" 
          : "bg-white text-[#1e1e1e] hover:bg-[#F8F9FC]"
      }`}
    >
      {label}
    </button>
  );
}

export default function Settings({ 
  onNavigate,
}: { 
  onNavigate?: (page: "resetCredentials") => void;
}) {
  const { enabled, setEnabled } = useNotifications();
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  
  const [username, setUsername] = useState<string>("Not set");
  const [email, setEmail] = useState<string>("Not set");

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUsername(session.user.user_metadata?.username || "Not set");
        setEmail(session.user.email || "Not set");
      }
    };
    fetchSession();
  }, []);

  return (
    <div className="flex flex-col gap-7 -mt-2 max-w-xl w-full mx-auto">
      <section className="flex flex-col gap-3">
        <SectionTitle>{t.settings.personalInfo}</SectionTitle>
        <div className="rounded-xl border border-[#EFEFF3] overflow-hidden">
          <FieldRow 
            first 
            label={t.settings.username}
            value={username}
            onClick={() => onNavigate?.("resetCredentials")}
          />
          <FieldRow 
            label={t.settings.email}
            value={email}
          />
          <FieldRow 
            last 
            label={t.settings.password}
            value="••••••••"
            onClick={() => onNavigate?.("resetCredentials")}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle>{t.settings.language}</SectionTitle>
        <div className="rounded-xl border border-[#EFEFF3] overflow-hidden flex">
          <LanguageButton 
            label="English" 
            selected={language === 'en'}
            onClick={() => setLanguage('en')}
          />
          <LanguageButton 
            label="Bahasa Indonesia" 
            selected={language === 'id'}
            onClick={() => setLanguage('id')}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle>{t.settings.preference}</SectionTitle>
        <div className="rounded-xl border border-[#EFEFF3] overflow-hidden">
          <div className="w-full bg-white px-4 py-4 flex items-center justify-between border-b border-[#EFEFF3]">
            <span className="font-['Nunito'] text-sm text-[#1e1e1e]">{t.settings.notification}</span>
            <Toggle checked={enabled} onChange={setEnabled} />
          </div>
          <FieldRow last label={t.settings.privacy} />
        </div>
      </section>
    </div>
  );
}
