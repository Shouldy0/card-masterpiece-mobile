import { motion } from "framer-motion";
import { Skull, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  hp: number;
  maxHp: number;
  lucidity: number;
  maxLucidity: number;
  trauma: number;
  turn: number;
  maxTurns: number;
  avatarSrc?: string;
  name?: string;
}

export function EnemyTopBar({
  hp,
  maxHp,
  lucidity,
  maxLucidity,
  trauma,
  turn,
  maxTurns,
  avatarSrc,
  name = "OMBRA",
}: Props) {
  const hpPercent = Math.max(0, hp / maxHp);

  return (
    <div className="flex items-center justify-between px-3 py-2">
      <div className="flex items-center gap-2.5">
        <div className="size-9 rounded-full border border-rose/30 bg-abyss overflow-hidden shrink-0">
          <img
            src={
              avatarSrc ??
              "https://api.dicebear.com/7.x/avataaars/svg?seed=Shadow&backgroundColor=030617&eyes=closed"
            }
            alt={name}
            className="size-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="font-display text-[9px] uppercase tracking-wider text-white/70">
              {name}
            </span>
            <span className="font-display text-[10px] font-bold text-rose">{hp}</span>
          </div>
          <div className="w-16 h-1 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              animate={{ width: `${hpPercent * 100}%` }}
              className="h-full rounded-full bg-rose"
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Trauma Enemy */}
        <div className="flex flex-col gap-0.5 w-12 mr-1">
          <div className="flex items-center justify-between">
            <span className="font-display text-[6px] uppercase tracking-wider text-rose/80">
              Trauma
            </span>
            <span className="font-display text-[7px] font-bold text-rose">{trauma}%</span>
          </div>
          <div className="w-full h-0.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose to-red-600 transition-all"
              style={{ width: `${Math.min(100, trauma)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-0.5 mr-1">
          {Array.from({ length: maxLucidity }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "size-1.5 rounded-xs transition-all duration-300",
                i < lucidity ? "bg-rose" : "bg-white/10",
              )}
            />
          ))}
        </div>

        <div className="font-display text-[8px] text-white/30 tracking-wider ml-1">
          {turn}/{maxTurns}
        </div>
      </div>
    </div>
  );
}
