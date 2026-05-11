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
      whileTap={{ scale: 0.95 }}
      className={cn(
        "flex flex-col items-center justify-center rounded-xl px-4 py-2.5 min-w-[72px]",
        "border transition-all duration-200",
        disabled
          ? "border-white/5 text-white/20 cursor-not-allowed"
          : "border-gold/40 text-gold cursor-pointer"
      )}
    >
      <span className={cn(
        "font-display text-[11px] font-bold tracking-[0.15em]",
        disabled ? "text-white/20" : "text-gold"
      )}>
        {label}
      </span>
      {sublabel && !disabled && (
        <span className="font-display text-[6px] tracking-[0.2em] text-white/30 mt-0.5">
          {sublabel}
        </span>
      )}
    </motion.button>
  );
}
