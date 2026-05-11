import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CardFromId } from "@/components/GameCard";
import { PlayedCard } from "@/game/store";

interface Props {
  name: string;
  icon: string;
  color: string;
  cards: PlayedCard[];
  canPlay: boolean;
  isImpacted: boolean;
  onDrop: () => void;
}

export function Slot({ name, icon, color, cards, canPlay, isImpacted, onDrop }: Props) {
  const playerCards = cards.filter((c) => c.side === "player");
  const aiCards = cards.filter((c) => c.side === "ai");
  const playerPower = playerCards.reduce((s, c) => s + c.power, 0);
  const aiPower = aiCards.reduce((s, c) => s + c.power, 0);
  const isWinning = playerPower > aiPower;
  const isEmpty = cards.length === 0;

  return (
    <motion.button
      onClick={onDrop}
      whileTap={canPlay ? { scale: 0.97 } : undefined}
      animate={isImpacted ? { scale: [1, 1.03, 1] } : {}}
      className={cn(
        "flex-1 relative flex flex-col rounded-xl border transition-all duration-300 overflow-hidden min-h-0",
        canPlay
          ? "border-gold/40 cursor-pointer"
          : "border-white/5"
      )}
    >
      {/* Territory header */}
      <div className="flex items-center justify-center gap-1.5 py-2">
        <span className="text-sm">{icon}</span>
        <h4 className={cn("font-display text-[8px] uppercase tracking-[0.15em] font-semibold opacity-70", color)}>
          {name}
        </h4>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-between pb-2 px-2 gap-1">
        {/* Opponent card */}
        <div className="flex-1 flex items-center justify-center min-h-0 w-full">
          {aiCards.length > 0 ? (
            <div className="relative">
              <CardFromId id={aiCards[aiCards.length - 1].cardId} size="xs" />
              {aiCards.length > 1 && (
                <div className="absolute -top-0.5 -right-0.5 size-3.5 rounded-full bg-rose/80 text-white font-display text-[6px] flex items-center justify-center">
                  {aiCards.length}
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Power divider */}
        {!isEmpty && (
          <div className="flex items-center gap-2 w-full px-1">
            <div className="h-px flex-1 bg-white/5" />
            <span className={cn(
              "font-display text-[10px] font-semibold",
              aiPower > 0 && aiPower >= playerPower ? "text-rose/70" : "text-white/20"
            )}>
              {aiPower}
            </span>
            <span className={cn(
              "font-display text-[10px] font-semibold",
              isWinning ? "text-gold/80" : "text-white/20"
            )}>
              {playerPower}
            </span>
            <div className="h-px flex-1 bg-white/5" />
          </div>
        )}

        {/* Player card */}
        <div className="flex-1 flex items-center justify-center min-h-0 w-full">
          {playerCards.length > 0 ? (
            <div className="relative">
              <CardFromId id={playerCards[playerCards.length - 1].cardId} size="xs" glow={isWinning} />
              {playerCards.length > 1 && (
                <div className="absolute -top-0.5 -right-0.5 size-3.5 rounded-full bg-gold/80 text-black font-display text-[6px] flex items-center justify-center">
                  {playerCards.length}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </motion.button>
  );
}
