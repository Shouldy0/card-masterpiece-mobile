import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CardFromId } from "@/components/GameCard";
import { PlayedCard } from "@/game/store";
import { cardsById, TERRITORIES } from "@/game/cards";

interface Props {
  id: string;
  name: string;
  icon: string;
  color: string;
  cards: PlayedCard[];
  canPlay: boolean;
  isImpacted: boolean;
  isCorrupted: boolean;
  onDrop: () => void;
}

function FloatingNumber({ value }: { value: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.5 }}
      animate={{ opacity: 1, y: -40, scale: 1.5 }}
      exit={{ opacity: 0, scale: 2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn(
        "absolute z-[100] font-display text-lg font-black pointer-events-none drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]",
        value > 0 ? "text-green-400" : "text-rose"
      )}
    >
      {value > 0 ? `+${value}` : value}
    </motion.div>
  );
}

export function Slot({ id, name, icon, color, cards, canPlay, isImpacted, isCorrupted, onDrop }: Props) {
  const [prevPower, setPrevPower] = useState({ player: 0, ai: 0 });
  const [diff, setDiff] = useState<{ player: number | null; ai: number | null }>({ player: null, ai: null });

  const playerCards = cards.filter((c) => c.side === "player");
  const aiCards = cards.filter((c) => c.side === "ai");
  const playerPower = playerCards.reduce((s, c) => s + c.power, 0);
  const aiPower = aiCards.reduce((s, c) => s + c.power, 0);

  useEffect(() => {
    if (playerPower !== prevPower.player) {
      setDiff((d) => ({ ...d, player: playerPower - prevPower.player }));
      setPrevPower((p) => ({ ...p, player: playerPower }));
      const t = setTimeout(() => setDiff((d) => ({ ...d, player: null })), 1000);
      return () => clearTimeout(t);
    }
  }, [playerPower]);

  useEffect(() => {
    if (aiPower !== prevPower.ai) {
      setDiff((d) => ({ ...d, ai: aiPower - prevPower.ai }));
      setPrevPower((p) => ({ ...p, ai: aiPower }));
      const t = setTimeout(() => setDiff((d) => ({ ...d, ai: null })), 1000);
      return () => clearTimeout(t);
    }
  }, [aiPower]);

  const isWinning = playerPower > aiPower;
  const isTied = playerPower === aiPower && playerPower > 0;
  const isEmpty = cards.length === 0;

  const tRule = TERRITORIES.find((t) => t.id === id)?.rule ?? "";

  // Detect active auras for the lane border glow
  const hasPlayerBuff = playerCards.some((c) => {
    const def = cardsById[c.cardId];
    return def?.effect.kind === "buff_self" && (def.effect as any).target === "local";
  });
  const hasEnemyDebuff = aiCards.some((c) => {
    const def = cardsById[c.cardId];
    return (def?.effect.kind === "weaken_enemy" && (def.effect as any).target === "local") ||
           def?.traits?.includes("oppressive");
  });

  return (
    <motion.button
      onClick={onDrop}
      whileTap={canPlay ? { scale: 0.96 } : undefined}
      animate={isImpacted ? { scale: [1, 1.04, 1] } : {}}
      className={cn(
        "flex-1 relative flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden min-h-0",
        "lane-base",
        `lane-${id}`,
        // Base border
        canPlay
          ? "border-white/25 cursor-pointer ring-2 ring-white/15"
          : "border-white/8",
        // Win/lose tint
        isWinning && !canPlay && "border-gold/40",
        !isWinning && aiPower > playerPower && !canPlay && "border-rose/30",
        isTied && "border-white/20",
        // Aura glow
        hasPlayerBuff && "shadow-[inset_0_0_20px_rgba(74,222,128,0.08)]",
        hasEnemyDebuff && "shadow-[inset_0_0_20px_rgba(248,113,113,0.08)]",
        isCorrupted && "lane-corrupted border-red-700/50",
      )}
    >
      {/* Background layers */}
      <div className="lane-ambient-bg" />
      <div className="lane-breathing" />
      <div className="lane-particles" />
      <div className={cn("lane-symbol", `lane-symbol-${id}`)} />

      {/* Card-type reactive layers */}
      {cards.some(c => ["maschera","oblio"].includes(cardsById[c.cardId]?.type ?? "")) && <div className="lane-effect-trauma" />}
      {cards.some(c => ["sogno","eco"].includes(cardsById[c.cardId]?.type ?? "")) && <div className="lane-effect-dream" />}
      {cards.some(c => ["ricordo","archetipo"].includes(cardsById[c.cardId]?.type ?? "")) && <div className="lane-effect-memory" />}

      {/* ── HEADER ── */}
      <div className="relative z-10 px-2 pt-2 pb-1 flex flex-col items-center gap-0.5">
        <div className="flex items-center gap-1">
          <span className="text-base leading-none">{icon}</span>
          <span className={cn("font-display text-[8px] uppercase tracking-widest font-bold", color)}>
            {name}
          </span>
        </div>
        {tRule && (
          <p className="text-[5px] text-white/25 text-center leading-tight px-1 font-mono">{tRule}</p>
        )}
        {isCorrupted && (
          <span className="text-[5.5px] text-red-400 font-bold uppercase tracking-widest bg-red-900/30 px-1.5 py-0.5 rounded-sm border border-red-600/30">
            ☠ CORROTTA
          </span>
        )}
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-between px-2 pb-2 gap-1.5 min-h-0">

        {/* AI SIDE */}
        <div className="flex flex-col items-center gap-1 flex-1 justify-center min-h-0 relative">
          <AnimatePresence>
            {diff.ai !== null && diff.ai !== 0 && <FloatingNumber key={`ai-${cards.length}-${diff.ai}`} value={diff.ai} />}
          </AnimatePresence>
          {aiCards.length > 0 ? (
            <div className="relative">
              <CardFromId
                id={aiCards[aiCards.length - 1].cardId}
                size="xs"
                powerOverride={aiPower}
              />
              {aiCards.length > 1 && (
                <div className="absolute -top-1 -right-1 size-4 rounded-full bg-rose/90 border border-rose/50 text-white font-display text-[7px] flex items-center justify-center shadow-lg">
                  {aiCards.length}
                </div>
              )}
            </div>
          ) : (
            <div className="size-16 rounded-lg border border-dashed border-white/8 flex items-center justify-center">
              <span className="text-white/15 text-[7px] font-display uppercase">vuoto</span>
            </div>
          )}
        </div>

        {/* ── POWER BAR ── */}
        <div className="relative flex flex-col items-center gap-0.5">
          {/* VS line */}
          <div className="flex items-center w-full gap-1.5">
            <div className={cn("flex-1 h-0.5 rounded-full transition-all", aiPower > playerPower ? "bg-rose/50" : "bg-white/10")} />
            <div className="flex items-center gap-1 px-1 py-0.5 bg-black/50 rounded-full border border-white/8">
              <span className={cn("font-display text-[10px] font-extrabold tabular-nums", aiPower > 0 && aiPower > playerPower ? "text-rose" : "text-white/30")}>
                {aiPower}
              </span>
              <span className="text-white/20 text-[7px]">:</span>
              <span className={cn("font-display text-[10px] font-extrabold tabular-nums", isWinning ? "text-gold" : isTied ? "text-white/50" : "text-white/30")}>
                {playerPower}
              </span>
            </div>
            <div className={cn("flex-1 h-0.5 rounded-full transition-all", isWinning ? "bg-gold/50" : "bg-white/10")} />
          </div>
          {/* Status label */}
          {!isEmpty && (
            <span className={cn(
              "font-display text-[6px] uppercase tracking-widest font-bold",
              isWinning ? "text-gold/60" : isTied ? "text-white/30" : aiPower > 0 ? "text-rose/60" : "text-white/20"
            )}>
              {isWinning ? "✦ dominio" : isTied ? "~ pareggio" : aiPower > 0 ? "✗ perdita" : "–"}
            </span>
          )}
        </div>

        {/* PLAYER SIDE */}
        <div className="flex flex-col items-center gap-1 flex-1 justify-center min-h-0 relative">
          <AnimatePresence>
            {diff.player !== null && diff.player !== 0 && <FloatingNumber key={`pl-${cards.length}-${diff.player}`} value={diff.player} />}
          </AnimatePresence>
          {playerCards.length > 0 ? (
            <div className="relative">
              <CardFromId
                id={playerCards[playerCards.length - 1].cardId}
                size="xs"
                glow={isWinning}
                powerOverride={playerPower}
              />
              {playerCards.length > 1 && (
                <div className="absolute -top-1 -right-1 size-4 rounded-full bg-gold/90 border border-gold/50 text-black font-display text-[7px] flex items-center justify-center shadow-lg">
                  {playerCards.length}
                </div>
              )}
            </div>
          ) : (
            canPlay ? (
              <motion.div
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="size-16 rounded-lg border border-dashed border-white/25 flex items-center justify-center"
              >
                <span className="text-white/50 text-[7px] font-display uppercase tracking-wider">gioca</span>
              </motion.div>
            ) : (
              <div className="size-16 rounded-lg border border-dashed border-white/8 flex items-center justify-center">
                <span className="text-white/15 text-[7px] font-display uppercase">vuoto</span>
              </div>
            )
          )}
        </div>
      </div>
    </motion.button>
  );
}
