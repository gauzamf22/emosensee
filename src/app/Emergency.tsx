const CONTACTS = [
  { name: "Ambulans", phone: "118 and 119" },
  { name: "Basarnas (SAR)", phone: "115" },
  { name: "Komisi Nasional (Komnas) HAM", phone: "021-3925230" },
  { name: "Komisi Nasional (Komnas) Perempuan", phone: "021-3903963" },
  { name: "Komisi Perlindungan Anak (KPAI)", phone: "021-31901556" },
];

export default function Emergency() {
  return (
    <div className="flex flex-col gap-4 -mt-2">
      <p className="font-['Inter'] font-medium text-sm text-[#9b9b9b]">
        Access urgent support resources.
      </p>

      <div className="bg-white rounded-2xl border border-[#EFEFF3] shadow-[0_8px_24px_-12px_rgba(17,24,39,0.06)] divide-y divide-[#EFEFF3]">
        {CONTACTS.map((c) => {
          const tel = c.phone.replace(/[^0-9]/g, "");
          return (
            <a
              key={c.name}
              href={`tel:${tel}`}
              className="flex items-center gap-4 p-4 sm:p-5 hover:bg-[#F8F9FC] transition-colors"
            >
              <div className="size-12 sm:size-14 rounded-xl bg-[#F1F1F4] shrink-0" />
              <div className="min-w-0 flex-1">
                <h4 className="font-['Poppins'] font-semibold text-[#1f1f1f] text-[15px] truncate">
                  {c.name}
                </h4>
                <p className="font-['Nunito'] text-sm text-[#9b9b9b] mt-0.5 truncate">
                  {c.phone}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
