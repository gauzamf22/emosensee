import { MapPin, Clock, SlidersHorizontal, HelpCircle, Crosshair, Search } from "lucide-react";

const PLACES = [
  { name: "Unit Konsultasi Psiko..", distance: "400 m from centre", hours: "Open 08.00 - 16.00", tag: "UKP" },
  { name: "Hospital Wellness", distance: "1.2 km from centre", hours: "Open 24 hours", tag: "H" },
  { name: "Mind Care Clinic", distance: "1.8 km from centre", hours: "Open 09.00 - 18.00", tag: "MC" },
  { name: "Sehat Jiwa Center", distance: "2.4 km from centre", hours: "Open 08.00 - 20.00", tag: "SJ" },
];

const LOCATION = "Sleman, Yogyakarta";

export default function Nearby() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(LOCATION)}&z=14&output=embed`;

  return (
    <div className="flex flex-col gap-4 -mt-2">
      <div className="relative rounded-2xl overflow-hidden border border-[#EFEFF3] shadow-[0_8px_24px_-12px_rgba(17,24,39,0.06)] bg-white">
        <div className="relative w-full h-[420px] sm:h-[520px] md:h-[600px]">
          <iframe
            title="Nearby map"
            src={mapSrc}
            className="absolute inset-0 size-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />

          <div className="absolute top-4 left-4 right-4 z-10">
            <div className="flex items-center gap-2 bg-white rounded-full shadow-md px-4 py-3 border border-[#EFEFF3]">
              <MapPin className="size-4 text-[#9b9b9b] shrink-0" />
              <span className="font-['Nunito'] text-sm text-[#1f1f1f] truncate flex-1">
                {LOCATION}
              </span>
              <Search className="size-4 text-[#9b9b9b] shrink-0" />
            </div>
          </div>

          <div className="absolute right-4 bottom-44 sm:bottom-48 z-10 flex flex-col gap-2">
            {[SlidersHorizontal, HelpCircle, Crosshair].map((Icon, i) => (
              <button
                key={i}
                className="size-10 rounded-xl bg-white shadow-md border border-[#EFEFF3] grid place-items-center text-[#1f1f1f] hover:bg-[#F6F7FB]"
              >
                <Icon className="size-4" />
              </button>
            ))}
          </div>

          <div className="absolute bottom-4 inset-x-0 z-10 px-4">
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1 -mx-1 px-1 scrollbar-thin">
              {PLACES.map((p) => (
                <article
                  key={p.name}
                  className="snap-start shrink-0 w-[260px] sm:w-[280px] bg-white rounded-2xl border border-[#EFEFF3] shadow-md p-3 flex gap-3"
                >
                  <div className="size-14 rounded-xl bg-[#EEF2FF] grid place-items-center shrink-0">
                    <span className="font-['Poppins'] font-bold text-[#3B5BDB] text-sm">
                      {p.tag}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col gap-1">
                    <h4 className="font-['Poppins'] font-semibold text-[#1f1f1f] text-sm truncate">
                      {p.name}
                    </h4>
                    <div className="flex items-center gap-1 font-['Nunito'] text-xs text-[#9b9b9b]">
                      <MapPin className="size-3" />
                      <span className="truncate">{p.distance}</span>
                    </div>
                    <div className="flex items-center gap-1 font-['Nunito'] text-xs text-[#9b9b9b]">
                      <Clock className="size-3" />
                      <span className="truncate">{p.hours}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
