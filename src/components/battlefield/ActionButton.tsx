import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  sublabel?: string;
}

export function ActionButton({ label, onClick, disabled, sublabel }: Props) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.96 } : undefined}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl px-6 py-3 min-w-[90px]",
        "transition-all duration-500 shadow-2xl",
        disabled
          ? "bg-abyss/50 border border-white/5 cursor-not-allowed opacity-40 grayscale"
          : "ritual-button cursor-pointer",
      )}
    >
      {!disabled && (
        <>
          <div className="ritual-button-glow" />
          <div className="ritual-button-distortion" />
        </>
      )}

      <span
        className={cn(
          "font-display text-[11px] font-bold tracking-[0.2em] uppercase z-10",
          disabled ? "text-white/20" : "ritual-button-text",
        )}
      >
        {label}
      </span>
      {sublabel && !disabled && (
        <span className="font-display text-[6px] tracking-[0.3em] text-gold-dim/70 mt-1 z-10 uppercase font-semibold">
          {sublabel}
        </span>
      )}
    </motion.button>
  );
}
