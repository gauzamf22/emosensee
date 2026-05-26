import { useEffect } from "react";
import { motion } from "motion/react";
import Logo from "./Logo";

export default function Splash({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden grid place-items-center"
      style={{
        backgroundImage:
          "linear-gradient(180deg, #F5F5F5 0%, #9EA7FC 45%, #7280FF 75%, #A1AAFF 100%)",
      }}
    >
      <motion.div
        className="absolute -top-20 -left-20 size-72 rounded-full bg-white/30 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-24 -right-16 size-80 rounded-full bg-[#7280FF]/40 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, delay: 0.6 }}
      />

      <div className="relative z-10 flex flex-col items-center gap-5">
        <motion.div
          initial={{ scale: 0.4, opacity: 0, rotateY: -90 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ perspective: 800 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0], rotateZ: [0, 2, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative size-32 sm:size-40 rounded-[2rem] grid place-items-center"
            style={{
              background:
                "linear-gradient(145deg, #ffffff 0%, #DCE3FF 55%, #A1AAFF 100%)",
              boxShadow:
                "0 30px 60px -20px rgba(72, 96, 255, 0.55), inset 6px 6px 18px rgba(255,255,255,0.9), inset -8px -10px 22px rgba(72, 96, 255, 0.25)",
            }}
          >
            <div
              className="absolute inset-2 rounded-[1.6rem] pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 55%)",
              }}
            />
            <Logo className="relative size-16 sm:size-20" color="#0063F3" />
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="font-['Poppins'] font-medium text-2xl sm:text-3xl text-[#0F1B5E] tracking-wide"
        >
          EmoSense
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex items-center gap-1.5 mt-4"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="size-2 rounded-full bg-white"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
