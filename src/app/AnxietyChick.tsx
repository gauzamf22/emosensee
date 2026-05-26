import Chick from "@/imports/Group-1/Group-6-14089";

export default function AnxietyChick({ className = "size-8" }: { className?: string }) {
  return (
    <span className={`inline-block ${className}`}>
      <Chick />
    </span>
  );
}
