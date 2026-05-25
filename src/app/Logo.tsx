import svgPaths from "@/imports/Frame1597880997/svg-r34j6eqzlc";

export default function Logo({
  className = "size-9",
  color = "#0063F3",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" aria-label="EmoSense">
      <path d={svgPaths.p34f64600} fill={color} />
      <path d={svgPaths.p1d0edc00} fill={color} />
      <path d={svgPaths.p117eb580} fill={color} />
    </svg>
  );
}
