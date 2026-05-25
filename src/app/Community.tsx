const COMMUNITIES = [
  { name: "Into The Light Indonesia", desc: "Suicide prevention & mental health awareness", platform: "Instagram" },
  { name: "Bicarakan.id", desc: "Safe space for emotional & mental health discu...", platform: "Instagram" },
  { name: "Menjadi Manusia", desc: "Self-growth and emotional well-being platform", platform: "Instagram" },
  { name: "Koneksi Support Group", desc: "Peer support and emotional sharing space", platform: "WhatsApp Group" },
  { name: "Student Wellness Circle", desc: "Student-focused emotional support community", platform: "Discord Community" },
  { name: "Riliv Community", desc: "Mental wellness and self-care community", platform: "Instagram" },
  { name: "Tabula Community", desc: "Community for self-reflection and emotional gr...", platform: "Instagram" },
  { name: "Youth Mental Health Hub", desc: "Youth support and mental wellness community", platform: "Discord Community" },
];

export default function Community() {
  return (
    <div className="flex flex-col gap-5">
      <p className="font-['Inter'] font-medium text-sm text-[#9b9b9b] -mt-2">
        Connect with supportive & mental wellness communities
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {COMMUNITIES.map((c) => (
          <button
            key={c.name}
            className="flex items-start gap-4 bg-white rounded-2xl border border-[#EFEFF3] shadow-[0_8px_24px_-12px_rgba(17,24,39,0.06)] p-4 sm:p-5 text-left hover:border-[#3B5BDB]/30 transition-colors"
          >
            <div className="size-14 sm:size-16 rounded-xl bg-[#F1F1F4] shrink-0" />
            <div className="min-w-0 flex-1 flex flex-col gap-1">
              <h4 className="font-['Poppins'] font-semibold text-[#1f1f1f] text-[15px] truncate">
                {c.name}
              </h4>
              <p className="font-['Nunito'] text-sm text-[#9b9b9b] line-clamp-2">
                {c.desc}
              </p>
              <span className="font-['Nunito'] text-xs text-[#9b9b9b] mt-0.5">
                {c.platform}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
