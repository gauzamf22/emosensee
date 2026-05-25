import { useState } from "react";
import img1 from "@/imports/2/cd4f8974f29b6e6a09e29aa46c5960d5826cb09a.png";
import img2 from "@/imports/3/8084e2711203566f7c04035bc716e9423d91e33e.png";
import Logo from "./Logo";

const SLIDES = [
  {
    bg: img1,
    overlay: 0.35,
    text:
      "Track your feelings, reflect on your emotions, and better understand yourself through daily emotional check-ins.",
  },
  {
    bg: img2,
    overlay: 0.45,
    text:
      "Talk with AI reflection support, explore emotional insights, and access helpful resources whenever you need them.",
  },
];

function BrandMark() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="size-24 sm:size-28 rounded-3xl bg-white/15 backdrop-blur grid place-items-center ring-1 ring-white/30">
        <Logo className="size-16 sm:size-20" color="#ffffff" />
      </div>
      <span className="font-['Poppins'] font-medium text-2xl text-white">EmoSense</span>
    </div>
  );
}

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const slide = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <img src={slide.bg} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${slide.overlay})` }} />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-between px-6 py-12 sm:py-16 max-w-md mx-auto">
        <div className="flex-1 grid place-items-center w-full">
          <BrandMark />
        </div>

        <div className="w-full flex flex-col items-center gap-6">
          <p className="font-['Inter'] font-medium text-white text-center text-base leading-relaxed max-w-sm">
            {slide.text}
          </p>

          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-3 rounded-full transition-all ${
                  i === step ? "bg-white w-6" : "bg-white/40 w-3"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => (isLast ? onDone() : setStep(step + 1))}
            className="w-full max-w-sm h-11 rounded-[10px] bg-white text-[#0063F3] font-['Inter'] font-medium text-lg hover:bg-white/95 transition-colors"
          >
            {isLast ? "Get Started" : "Next"}
          </button>

          <button
            onClick={onDone}
            className="font-['Inter'] text-sm text-white/80 hover:text-white"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
