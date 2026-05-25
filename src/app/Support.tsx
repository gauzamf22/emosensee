import { useNotifications } from "./notifications";
import imgJournaling from "@/imports/Support/4cb91f48acd6e9f10f46f5b752c07482e23858b5.png";
import imgCommunity from "@/imports/Support/ebc00b163e1907c9d0b6394d8161494349bdf93d.png";
import imgNearby from "@/imports/Support/ab093e6ffeb390cf38f1e75977bb7c3bdcfd4f6c.png";
import imgEmergency from "@/imports/Support/c17f0039912ca00b8476ed9dc75efc82ed8164c9.png";
import imgLearn from "@/imports/Support/46d936fad13f3c82aaa1937ce6513b886206af5e.png";
import imgGrow from "@/imports/Support/89272a5c3ba0aaae6a0bb2da41e8da1edad4bd6b.png";

type CardKey = "journaling" | "community" | "nearby" | "emergency" | null;

const CARDS: { title: string; desc: string; img: string; overlay: number; key: CardKey }[] = [
  { title: "Journaling", desc: "Express your thoughts and emotions safely", img: imgJournaling, overlay: 0.45, key: "journaling" },
  { title: "Community", desc: "Connect with supportive people", img: imgCommunity, overlay: 0.46, key: "community" },
  { title: "Nearby Service", desc: "Locate professional services near you", img: imgNearby, overlay: 0.45, key: "nearby" },
  { title: "Emergency Help", desc: "Access urgent support resources.", img: imgEmergency, overlay: 0.35, key: "emergency" },
  { title: "Learn", desc: "Understanding & education emotions", img: imgLearn, overlay: 0.45, key: null },
  { title: "Grow", desc: "Self-improvement & emotional habits", img: imgGrow, overlay: 0.5, key: null },
];

export default function Support({ onOpen }: { onOpen?: (key: "journaling" | "community" | "nearby" | "emergency") => void }) {
  const { push } = useNotifications();
  return (
    <div className="flex flex-col gap-2">
      <p className="font-['Inter'] font-medium text-sm text-[#9b9b9b] mb-2">
        Support for your emotional well-being!
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4">
        {CARDS.map((c) => (
          <button
            key={c.title}
            onClick={() => {
              if (!c.key) return;
              push({ source: "support", title: `Opened ${c.title}`, body: c.desc });
              onOpen?.(c.key);
            }}
            className="group relative aspect-[161/205] sm:aspect-[4/5] rounded-2xl overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-[#3B5BDB]/40"
          >
            <img
              src={c.img}
              alt={c.title}
              className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div
              className="absolute inset-0"
              style={{ background: `rgba(0,0,0,${c.overlay})` }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 gap-1.5">
              <span className="font-['Poppins'] font-medium text-white text-sm sm:text-base">
                {c.title}
              </span>
              <span className="font-['Poppins'] text-white/90 text-[12px] sm:text-[13px] leading-snug max-w-[18ch]">
                {c.desc}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
