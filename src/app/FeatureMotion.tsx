import { Sparkles } from "lucide-react";
import { useTranslation } from "../translations";

export default function FeatureMotion() {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <div className="size-20 rounded-2xl bg-gradient-to-br from-[#3B5BDB] to-[#5B7FFF] flex items-center justify-center shadow-lg">
        <Sparkles className="size-10 text-white" strokeWidth={2} />
      </div>
      
      <div className="text-center max-w-md">
        <h2 className="font-['Poppins'] font-semibold text-2xl text-[#1f1f1f] mb-3">
          {t.featureMotion.title}
        </h2>
        <p className="font-['Nunito'] text-[15px] text-[#9b9b9b] leading-relaxed">
          {t.featureMotion.description}
        </p>
      </div>

      <div className="flex gap-2 mt-2">
        <div className="size-2 rounded-full bg-[#3B5BDB] animate-pulse" />
        <div className="size-2 rounded-full bg-[#3B5BDB] animate-pulse [animation-delay:0.2s]" />
        <div className="size-2 rounded-full bg-[#3B5BDB] animate-pulse [animation-delay:0.4s]" />
      </div>
    </div>
  );
}
