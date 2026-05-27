"use client";

import { useState } from "react";
import { MessageCircle, Users, Heart, Sun, Lightbulb, Shield, Sprout, ExternalLink } from "lucide-react";

const COMMUNITIES = [
  {
    name: "Bicarakan.id",
    description: "Professional online counseling platform that has helped 162,000+ Indonesians with mental health support",
    website: "https://bicarakan.id",
    logo: "https://bicarakan.id/wp-content/uploads/2023/01/logo-bicarakan.png",
    fallbackIcon: MessageCircle,
  },
  {
    name: "HIMPSI",
    description: "Indonesian Psychological Association - professional organization for psychologists and mental health practitioners",
    website: "https://himpsi.or.id",
    logo: "https://himpsi.or.id/wp-content/uploads/2020/01/logo-himpsi.png",
    fallbackIcon: Users,
  },
  {
    name: "Ibunda.id",
    description: "Online counseling and mental health support platform connecting users with professional psychologists",
    website: "https://ibunda.id",
    logo: "https://ibunda.id/assets/images/logo.png",
    fallbackIcon: Heart,
  },
  {
    name: "Into The Light Indonesia",
    description: "Suicide prevention and mental health awareness organization providing crisis support and education",
    website: "https://intothelightid.org",
    logo: "https://intothelightid.org/wp-content/uploads/2019/07/2019_0728_12052300.jpg",
    fallbackIcon: Sun,
  },
  {
    name: "Pijar Psikologi",
    description: "Psychology platform offering articles, consultations, and mental health resources for Indonesians",
    website: "https://pijarpsikologi.com",
    logo: null,
    fallbackIcon: Lightbulb,
  },
  {
    name: "Sejiwa",
    description: "Anti-bullying and youth mental health organization focused on creating safe environments",
    website: "https://sejiwa.org",
    logo: "https://sejiwa.org/wp-content/uploads/2023/03/cropped-LOGO-SEJIWA-COBA-01.png.webp",
    fallbackIcon: Shield,
  },
  {
    name: "Yayasan Pulih",
    description: "Trauma recovery and psychosocial support foundation helping survivors of violence and disasters",
    website: "https://pulih.or.id",
    logo: null,
    fallbackIcon: Sprout,
  },
];

function CommunityLogo({ community }: { community: typeof COMMUNITIES[0] }) {
  const [imageError, setImageError] = useState(false);
  const Icon = community.fallbackIcon;

  if (!community.logo || imageError) {
    return (
      <div className="size-14 sm:size-16 rounded-xl bg-gradient-to-br from-[#3B5BDB]/10 to-[#3B5BDB]/5 flex items-center justify-center shrink-0">
        <Icon className="size-7 sm:size-8 text-[#3B5BDB]" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div className="size-14 sm:size-16 rounded-xl bg-[#F1F1F4] shrink-0 overflow-hidden flex items-center justify-center">
      <img
        src={community.logo}
        alt={`${community.name} logo`}
        className="w-full h-full object-contain p-2"
        onError={() => setImageError(true)}
      />
    </div>
  );
}

export default function Community() {
  return (
    <div className="flex flex-col gap-5">
      <p className="font-['Inter'] font-medium text-sm text-[#9b9b9b] -mt-2">
        Connect with verified Indonesian mental health communities and organizations
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {COMMUNITIES.map((community) => (
          <button
            key={community.name}
            onClick={() => window.open(community.website, "_blank", "noopener,noreferrer")}
            className="group flex items-start gap-4 bg-white rounded-2xl border border-[#EFEFF3] shadow-[0_8px_24px_-12px_rgba(17,24,39,0.06)] p-4 sm:p-5 text-left hover:border-[#3B5BDB]/40 hover:shadow-[0_12px_32px_-12px_rgba(59,91,219,0.15)] transition-all duration-200 cursor-pointer"
          >
            <CommunityLogo community={community} />
            <div className="min-w-0 flex-1 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h4 className="font-['Poppins'] font-semibold text-[#1f1f1f] text-[15px] truncate">
                  {community.name}
                </h4>
                <ExternalLink className="size-3.5 text-[#9b9b9b] group-hover:text-[#3B5BDB] transition-colors shrink-0" />
              </div>
              <p className="font-['Nunito'] text-sm text-[#9b9b9b] line-clamp-2 leading-relaxed">
                {community.description}
              </p>
              <span className="font-['Nunito'] text-xs text-[#3B5BDB] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Visit website →
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
