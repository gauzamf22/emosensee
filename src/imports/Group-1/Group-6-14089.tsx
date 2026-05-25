import svgPaths from "./svg-hrv8osyi4t";

function Group2() {
  return (
    <div className="absolute contents inset-[1.44%_5.74%_11.14%_6.12%]" data-name="Group">
      <div className="absolute inset-[50.56%_6.61%_36.2%_77.81%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.98322 4.27031">
          <path d={svgPaths.p1a436e00} fill="var(--fill-0, #FF9A61)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[50.57%_77.73%_36.2%_6.95%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.90435 4.27084">
          <path d={svgPaths.p9e27b00} fill="var(--fill-0, #FF9A61)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[1.44%_5.74%_11.14%_6.12%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.2034 28.203">
          <path d={svgPaths.p2eaedd80} fill="var(--fill-0, #FFD642)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Xmlid() {
  return (
    <div className="absolute contents inset-[1.44%_5.74%_11.14%_6.12%]" data-name="XMLID_30_">
      <Group2 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents inset-[0_4.02%_9.7%_4.94%]" data-name="Group">
      <div className="absolute inset-[0_4.02%_9.7%_4.94%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29.1333 29.1333">
          <path d={svgPaths.p3e5f6300} fill="var(--fill-0, #FFD642)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents inset-[36.49%_19.37%_57.02%_19.74%]" data-name="Group">
      <div className="absolute inset-[36.49%_73.46%_57.02%_19.74%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.17485 2.09458">
          <path d={svgPaths.p11d7b9e0} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[36.49%_19.37%_57.02%_73.84%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.17485 2.09458">
          <path d={svgPaths.p26ff0700} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[0_4.02%_9.7%_4.94%]" data-name="Group">
      <Xmlid />
      <Group3 />
      <div className="absolute inset-[46.39%_42.5%_45.26%_42.87%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.68073 2.69559">
          <path d={svgPaths.p36933900} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <Group4 />
    </div>
  );
}

export default function Group() {
  return (
    <div className="relative size-full" data-name="Group">
      <div className="absolute inset-[74.8%_0_0_0]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 8.12911">
          <path d={svgPaths.p19e00900} fill="url(#paint0_radial_1_24912)" id="Vector" />
          <defs>
            <radialGradient cx="0" cy="0" gradientTransform="translate(15.9999 4.06446) rotate(180) scale(16.0016 4.06405)" gradientUnits="userSpaceOnUse" id="paint0_radial_1_24912" r="1">
              <stop stopColor="#998374" />
              <stop offset="0.1636" stopColor="#B6A69C" />
              <stop offset="0.3273" stopColor="#C9BDB5" />
              <stop offset="0.5333" stopColor="#DFD8D4" />
              <stop offset="0.7879" stopColor="#F3F1EF" />
              <stop offset="1" stopColor="white" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <Group1 />
    </div>
  );
}