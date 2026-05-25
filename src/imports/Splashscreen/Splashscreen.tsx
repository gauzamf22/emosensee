import svgPaths from "./svg-p41gu7vifh";

function Frame() {
  return <div className="-translate-x-1/2 absolute h-[27px] left-[calc(50%-145px)] top-[110px] w-[47px]" />;
}

function StatusBarTime() {
  return (
    <div className="h-[21px] relative rounded-[24px] shrink-0 w-[54px]" data-name="_StatusBar-time">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['SF_Pro_Text:Semibold',sans-serif] h-[20px] leading-[21px] left-[27px] not-italic text-[16px] text-black text-center top-px tracking-[-0.32px] w-[54px]">9:41</p>
    </div>
  );
}

function SignalWifiBattery() {
  return (
    <div className="h-[13px] relative shrink-0 w-[78.401px]" data-name="Signal, Wifi, Battery">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 78.4012 13">
        <g id="Signal, Wifi, Battery">
          <g id="Icon / Mobile Signal">
            <path d={svgPaths.p22b5c650} fill="var(--fill-0, black)" />
            <path d={svgPaths.p286eb800} fill="var(--fill-0, black)" />
            <path d={svgPaths.p1e6a6600} fill="var(--fill-0, black)" />
            <path d={svgPaths.pded3680} fill="var(--fill-0, black)" />
          </g>
          <path d={svgPaths.p11bb800} fill="var(--fill-0, black)" id="Wifi" />
          <g id="_StatusBar-battery">
            <path d={svgPaths.pb6b7100} id="Outline" opacity="0.35" stroke="var(--stroke-0, black)" />
            <path d={svgPaths.p9c6aca0} fill="var(--fill-0, black)" id="Battery End" opacity="0.4" />
            <path d={svgPaths.p2cb42c00} fill="var(--fill-0, black)" id="Fill" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function G() {
  return (
    <div className="col-1 h-[100.043px] ml-[50px] mt-[50px] relative row-1 w-[100.001px]" data-name="G1149">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 100.001 100.043">
        <g id="G1149">
          <path d={svgPaths.p34f64600} fill="var(--fill-0, #0063F3)" id="Vector" />
          <path d={svgPaths.p1d0edc00} fill="var(--fill-0, #0063F3)" id="Vector_2" />
          <path d={svgPaths.p117eb580} fill="var(--fill-0, #0063F3)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function L() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] mb-[-34px] place-items-start relative shrink-0" data-name="L1149">
      <div className="bg-[rgba(255,255,255,0)] col-1 ml-0 mt-0 relative row-1 size-[200px]" data-name="Background">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <g id="BG" />
        </svg>
      </div>
      <G />
    </div>
  );
}

function Frame1() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex flex-col items-center left-1/2 top-1/2 w-[200px]">
      <L />
      <p className="[word-break:break-word] font-['Poppins:Medium',sans-serif] leading-[34px] min-w-full not-italic relative shrink-0 text-[#0063f3] text-[24px] text-center w-[min-content]">EmoSense</p>
    </div>
  );
}

export default function Splashscreen() {
  return (
    <div className="bg-[#f6f7fb] relative size-full" data-name="Splashscreen">
      <Frame />
      <div className="-translate-x-1/2 absolute bottom-0 h-[815px] left-1/2 w-[402px]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 402 815">
          <path d="M0 0H402V815H0V0Z" fill="url(#paint0_linear_6_2069)" id="Rectangle 6" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_6_2069" x1="221" x2="113.357" y1="2782.43" y2="392.93">
              <stop stopColor="#A1AAFF" />
              <stop offset="0.293269" stopColor="#7280FF" />
              <stop offset="0.5625" stopColor="#9EA7FC" />
              <stop offset="1" stopColor="#F5F5F5" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="-translate-x-1/2 absolute content-stretch flex h-[59px] items-center justify-between left-1/2 px-[20px] top-0 w-[402px]" data-name="StatusBar">
        <StatusBarTime />
        <SignalWifiBattery />
      </div>
      <Frame1 />
    </div>
  );
}