import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Entry = {
  id: number;
  time: string;
  date: string;
  title: string;
  body: string;
};

const ENTRIES: Entry[] = [
  {
    id: 1,
    time: "05.00 pm",
    date: "14 Mei 2026",
    title: "Day 6 - Bitter Sweet College",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore e...",
  },
  {
    id: 2,
    time: "05.00 pm",
    date: "14 Mei 2026",
    title: "Day 6 - Bitter Sweet College",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore e...",
  },
  {
    id: 3,
    time: "05.00 pm",
    date: "14 Mei 2026",
    title: "Day 6 - Bitter Sweet College",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore e...",
  },
];

const MAX = 500;

export default function Journaling() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <p className="font-['Inter'] font-medium text-sm text-[#9b9b9b] -mt-2">
        Express your thoughts and emotions safely here!
      </p>

      <section className="bg-white rounded-2xl border border-[#EFEFF3] shadow-[0_8px_24px_-12px_rgba(17,24,39,0.06)] p-5 sm:p-6 flex flex-col gap-4">
        <div className="border-b border-[#EFEFF3] pb-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full bg-transparent outline-none font-['Poppins'] text-[15px] text-[#1f1f1f] placeholder:text-[#c1c1c1]"
          />
        </div>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value.slice(0, MAX))}
          placeholder="Descriptions..."
          rows={6}
          className="w-full bg-transparent outline-none resize-none font-['Nunito'] text-sm text-[#1f1f1f] placeholder:text-[#c1c1c1] min-h-[140px]"
        />
        <div className="flex justify-end">
          <span className="font-['Nunito'] text-xs text-[#9b9b9b]">
            {desc.length}/{MAX}
          </span>
        </div>
      </section>

      <div className="flex items-center justify-between">
        <h3 className="font-['Poppins'] font-semibold text-[#1f1f1f] text-base">Your Journal</h3>
        <button className="flex items-center gap-1 text-[#9b9b9b] font-['Nunito'] font-medium text-sm">
          Week
          <ChevronDown className="size-4" />
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:gap-4">
        {ENTRIES.map((e) => (
          <article
            key={e.id}
            className="bg-white rounded-2xl border border-[#EFEFF3] shadow-[0_8px_24px_-12px_rgba(17,24,39,0.06)] p-4 sm:p-5 flex gap-4"
          >
            <div className="size-10 rounded-full bg-[#F1F1F4] shrink-0 mt-1" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 font-['Nunito'] text-xs text-[#9b9b9b]">
                <span>{e.time}</span>
                <span className="size-1 rounded-full bg-[#c1c1c1]" />
                <span>{e.date}</span>
              </div>
              <h4 className="font-['Poppins'] font-semibold text-[#1f1f1f] text-[15px] mt-1">
                {e.title}
              </h4>
              <p className="font-['Nunito'] text-sm text-[#9b9b9b] leading-6 mt-1 line-clamp-2">
                {e.body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
