import { ChevronRight } from "lucide-react";
import { useNotifications } from "./notifications";

function FieldRow({
  label,
  value,
  last,
  first,
}: {
  label: string;
  value?: string;
  last?: boolean;
  first?: boolean;
}) {
  return (
    <button
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

export default function Settings() {
  const { enabled, setEnabled } = useNotifications();

  return (
    <div className="flex flex-col gap-7 -mt-2 max-w-xl w-full mx-auto">
      <section className="flex flex-col gap-3">
        <SectionTitle>Personal Information</SectionTitle>
        <div className="rounded-xl border border-[#EFEFF3] overflow-hidden">
          <FieldRow first label="Username" value="laylaholmes" />
          <FieldRow label="Email" value="laylaholmes@gmail.com" />
          <FieldRow last label="Password" />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle>Language</SectionTitle>
        <div className="rounded-xl border border-[#EFEFF3] overflow-hidden">
          <button className="w-full bg-white px-4 py-4 flex items-center justify-center hover:bg-[#F8F9FC]">
            <span className="font-['Nunito'] text-sm text-[#1e1e1e]">English</span>
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle>Preference</SectionTitle>
        <div className="rounded-xl border border-[#EFEFF3] overflow-hidden">
          <div className="w-full bg-white px-4 py-4 flex items-center justify-between border-b border-[#EFEFF3]">
            <span className="font-['Nunito'] text-sm text-[#1e1e1e]">Notification</span>
            <Toggle checked={enabled} onChange={setEnabled} />
          </div>
          <FieldRow last label="Privacy" />
        </div>
      </section>
    </div>
  );
}
