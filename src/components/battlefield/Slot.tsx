import { motion, AnimatePresence } from "framer-motion";
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

// Compute active aura effects from cards in the lane
function getLaneAuras(cards: PlayedCard[]) {
  const auras: { label: string; type: "buff" | "debuff" | "special"; side: "player" | "ai" }[] = [];

  cards.forEach((c) => {
    const def = cardsById[c.cardId];
    if (!def) return;

    if (def.effect.kind === "buff_self" && (def.effect as any).target === "local") {
      auras.push({
        label: `+${def.effect.amount} POTERE`,
        type: "buff",
        side: c.side,
      });
    }
    if (def.effect.kind === "weaken_enemy" && (def.effect as any).target === "local") {
      auras.push({
        label: `-${def.effect.amount} INDEBOLITO`,
        type: "debuff",
        side: c.side,
      });
    }
    if (def.traits?.includes("oppressive")) {
      auras.push({ label: "-1 OPPRESSIONE", type: "debuff", side: c.side });
    }
    if (def.traits?.includes("growth")) {
      auras.push({ label: "+1/TURNO", type: "buff", side: c.side });
    }
    if (def.traits?.includes("protector")) {
      auras.push({ label: "🛡 PROTETTO", type: "special", side: c.side });
    }
    if (def.traits?.includes("loner")) {
      const allyCount = cards.filter((x) => x.side === c.side).length;
      if (allyCount <= 1) auras.push({ label: "+3 SOLITARIO", type: "buff", side: c.side });
    }
  });

  return auras;
}

export function Slot({ id, name, icon, color, cards, canPlay, isImpacted, isCorrupted, onDrop }: Props) {
  const playerCards = cards.filter((c) => c.side === "player");
  const aiCards = cards.filter((c) => c.side === "ai");
  const playerPower = playerCards.reduce((s, c) => s + c.power, 0);
  const aiPower = aiCards.reduce((s, c) => s + c.power, 0);
  const isWinning = playerPower > aiPower;
  const isEmpty = cards.length === 0;

  const cardTypes = new Set(cards.map((c) => cardsById[c.cardId]?.type).filter(Boolean));
  const hasTrauma = cardTypes.has("maschera") || cardTypes.has("oblio");
  const hasDream = cardTypes.has("sogno") || cardTypes.has("eco");
  const hasMemory = cardTypes.has("ricordo") || cardTypes.has("archetipo");

  const laneAuras = getLaneAuras(cards);
  const playerAuras = laneAuras.filter((a) => a.side === "player");
  const aiAuras = laneAuras.filter((a) => a.side === "ai");

  return (
    <motion.button
      onClick={onDrop}
      whileTap={canPlay ? { scale: 0.97 } : undefined}
      whileHover={canPlay ? { scale: 1.02 } : undefined}
      animate={isImpacted ? { scale: [1, 1.05, 1], filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"] } : {}}
      className={cn(
        "flex-1 relative flex flex-col rounded-xl border transition-all duration-500 overflow-hidden min-h-0",
        "lane-base",
        `lane-${id}`,
        canPlay ? "lane-active border-white/20 cursor-pointer shadow-[0_0_30px_var(--lane-color)] ring-1 ring-white/10" : "border-white/5",
        isWinning && !canPlay && "border-gold/30 shadow-[inset_0_0_20px_rgba(255,215,0,0.05)]",
        !isWinning && aiPower > playerPower && !canPlay && "border-rose/30 shadow-[inset_0_0_20px_rgba(244,63,94,0.05)]",
        isCorrupted && "lane-corrupted"
      )}
    >
      {/* Ambient background layers */}
      <div className="lane-ambient-bg" />
      <div className="lane-breathing" />
      <div className="lane-particles" />

      {/* Subconscious Symbol */}
      <div className={cn("lane-symbol", `lane-symbol-${id}`)} />

      {/* Reactive Battlefield Effects */}
      {hasTrauma && <div className="lane-effect-trauma" />}
      {hasDream && <div className="lane-effect-dream" />}
      {hasMemory && <div className="lane-effect-memory" />}

      {/* Corruption badge */}
      <AnimatePresence>
        {isCorrupted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-1 right-1 z-20 bg-red-900/80 border border-red-500/50 rounded px-1 py-0.5"
          >
            <span className="font-display text-[6px] text-red-300 uppercase tracking-widest">CORROTTA</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Territory header */}
      <div className="relative z-10 flex flex-col items-center justify-center py-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{icon}</span>
          <h4 className={cn("font-display text-[8px] uppercase tracking-[0.15em] font-semibold opacity-70", color)}>
            {name}
          </h4>
        </div>
        {(() => {
          const tRule = TERRITORIES.find((t) => t.id === id)?.rule;
          return tRule ? (
            <p className="text-[5.5px] text-white/30 tracking-wider text-center px-2 leading-tight mt-0.5">
              {tRule}
            </p>
          ) : null;
        })()}
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-between pb-2 px-1.5 gap-1">

        {/* AI card section */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-0 w-full gap-1">
          {aiCards.length > 0 ? (
            <>
              {/* AI active aura badges */}
              <div className="flex flex-wrap justify-center gap-0.5">
                {aiAuras.map((a, i) => (
                  <span
                    key={i}
                    className={cn(
                      "font-display text-[5.5px] uppercase tracking-wider px-1 py-0.5 rounded-sm border",
                      a.type === "buff" ? "bg-green-900/70 border-green-500/40 text-green-300" :
                      a.type === "debuff" ? "bg-red-900/70 border-red-500/40 text-red-300" :
                      "bg-purple-900/70 border-purple-500/40 text-purple-300"
                    )}
                  >
                    {a.label}
                  </span>
                ))}
              </div>
              <div className="relative">
                <CardFromId
                  id={aiCards[aiCards.length - 1].cardId}
                  size="xs"
                  powerOverride={aiCards.reduce((s, c) => s + c.power, 0)}
                />
                {aiCards.length > 1 && (
                  <div className="absolute -top-0.5 -right-0.5 size-3.5 rounded-full bg-rose/80 text-white font-display text-[6px] flex items-center justify-center">
                    {aiCards.length}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-[7px] text-white/15 font-display uppercase tracking-widest">vuoto</div>
          )}
        </div>

        {/* Power divider - readable breakdown */}
        <div className="flex items-center gap-1.5 w-full px-1 my-0.5">
          <div className="h-px flex-1 bg-white/5" />
          {!isEmpty ? (
            <div className="flex items-center gap-1">
              <span className={cn("font-display text-[10px] font-bold", aiPower > 0 && aiPower >= playerPower ? "text-rose/90" : "text-white/20")}>
                {aiPower}
              </span>
              <span className="text-white/20 text-[8px]">vs</span>
              <span className={cn("font-display text-[10px] font-bold", isWinning ? "text-gold/90" : "text-white/20")}>
                {playerPower}
              </span>
            </div>
          ) : (
            <span className="text-white/10 text-[7px] font-display">—</span>
          )}
          <div className="h-px flex-1 bg-white/5" />
        </div>

        {/* Player card section */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-0 w-full gap-1">
          {playerCards.length > 0 ? (
            <>
              <div className="relative">
                <CardFromId
                  id={playerCards[playerCards.length - 1].cardId}
                  size="xs"
                  glow={isWinning}
                  powerOverride={playerCards.reduce((s, c) => s + c.power, 0)}
                />
                {playerCards.length > 1 && (
                  <div className="absolute -top-0.5 -right-0.5 size-3.5 rounded-full bg-gold/80 text-black font-display text-[6px] flex items-center justify-center">
                    {playerCards.length}
                  </div>
                )}
              </div>
              {/* Player active aura badges */}
              <div className="flex flex-wrap justify-center gap-0.5">
                {playerAuras.map((a, i) => (
                  <span
                    key={i}
                    className={cn(
                      "font-display text-[5.5px] uppercase tracking-wider px-1 py-0.5 rounded-sm border",
                      a.type === "buff" ? "bg-green-900/70 border-green-500/40 text-green-300" :
                      a.type === "debuff" ? "bg-red-900/70 border-red-500/40 text-red-300" :
                      "bg-purple-900/70 border-purple-500/40 text-purple-300"
                    )}
                  >
                    {a.label}
                  </span>
                ))}
              </div>
            </>
          ) : (
            canPlay ? (
              <div className="text-[7px] text-white/30 font-display uppercase tracking-widest animate-pulse">tocca per giocare</div>
            ) : (
              <div className="text-[7px] text-white/15 font-display uppercase tracking-widest">vuoto</div>
            )
          )}
        </div>
      </div>
    </motion.button>
  );
}
