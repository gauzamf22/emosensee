import svgPaths from "./svg-r34j6eqzlc";

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

export default function Frame() {
  return (
    <div className="content-stretch flex flex-col items-center relative size-full">
      <L />
      <p className="[word-break:break-word] font-['Poppins:Medium',sans-serif] leading-[34px] min-w-full not-italic relative shrink-0 text-[#0063f3] text-[24px] text-center w-[min-content]">EmoSense</p>
    </div>
  );
}