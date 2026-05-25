import svgPaths from "./svg-37c0jc3ygt";
import img3 from "./8084e2711203566f7c04035bc716e9423d91e33e.png";

function Frame4() {
  return <div className="-translate-x-1/2 absolute h-[27px] left-[calc(50%-145px)] top-[110px] w-[47px]" />;
}

function Frame1() {
  return <div className="bg-white relative rounded-[7.321px] shrink-0 size-[11.714px]" />;
}

function Frame() {
  return <div className="bg-[#9b9b9b] h-[11.714px] relative rounded-[7.321px] shrink-0 w-[23.429px]" />;
}

function Frame5() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex gap-[5.857px] items-center left-[calc(50%+7.5px)] top-[701.14px]">
      <Frame1 />
      <Frame />
    </div>
  );
}

function Frame2() {
  return <div className="bg-white relative rounded-[7.321px] shrink-0 size-[11.714px]" />;
}

function Frame3() {
  return <div className="bg-[#9b9b9b] h-[11.714px] relative rounded-[7.321px] shrink-0 w-[23.429px]" />;
}

function Frame7() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex gap-[5.857px] items-center left-[calc(50%+7.5px)] top-[701px]">
      <Frame2 />
      <Frame3 />
    </div>
  );
}

function G() {
  return (
    <div className="col-1 h-[100.043px] ml-[50px] mt-[50px] relative row-1 w-[100.001px]" data-name="G1149">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 100.001 100.043">
        <g id="G1149">
          <path d={svgPaths.p34f64600} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.p1d0edc00} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.p117eb580} fill="var(--fill-0, white)" id="Vector_3" />
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

function Frame6() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex flex-col items-center left-1/2 top-1/2 w-[200px]">
      <L />
      <p className="[word-break:break-word] font-['Poppins:Medium',sans-serif] leading-[34px] min-w-full not-italic relative shrink-0 text-[24px] text-center text-white w-[min-content]">EmoSense</p>
    </div>
  );
}

export default function Component() {
  return (
    <div className="relative size-full" data-name="3">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute bg-[#f6f7fb] inset-0" />
        <img alt="" className="absolute max-w-none object-cover size-full" src={img3} />
        <div className="absolute bg-[rgba(0,0,0,0.4)] inset-0" />
      </div>
      <Frame4 />
      <div className="-translate-x-1/2 absolute bg-white content-stretch flex gap-[8px] h-[44px] items-center justify-center left-1/2 px-[16px] py-[10px] rounded-[10px] top-[766px] w-[354px]" data-name="Button">
        <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[23px] not-italic relative shrink-0 text-[#0063f3] text-[18px] whitespace-nowrap">Next</p>
      </div>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium h-[56px] leading-[1.2] left-[201px] not-italic text-[16px] text-center text-white top-[615px] w-[306px]">Talk with AI reflection support, explore emotional insights, and access helpful resources whenever you need them.</p>
      <Frame5 />
      <Frame7 />
      <Frame6 />
    </div>
  );
}