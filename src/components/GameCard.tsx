import React from "react";
import { CardDef, cardsById, CardType } from "@/game/cards";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CARD_SIZES, RARITY_BORDERS } from "@/game/constants";

interface Props {
  card: CardDef;
  size?: keyof typeof CARD_SIZES;
  glow?: boolean;
  faded?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

const factionStyles: Record<CardType, { bar: string; power: string; glow: string }> = {
  archetipo: { bar: "bg-purple-500", power: "text-purple-300", glow: "rgba(168,85,247,0.3)" },
  ricordo: { bar: "bg-yellow-500", power: "text-yellow-300", glow: "rgba(234,179,8,0.3)" },
  maschera: { bar: "bg-red-500", power: "text-red-300", glow: "rgba(239,68,68,0.3)" },
  oblio: { bar: "bg-blue-500", power: "text-blue-300", glow: "rgba(59,130,246,0.3)" },
  sogno: { bar: "bg-cyan-400", power: "text-cyan-300", glow: "rgba(34,211,238,0.3)" },
  eco: { bar: "bg-emerald-500", power: "text-emerald-300", glow: "rgba(16,185,129,0.3)" },
};

export const GameCard = React.memo(function GameCard({
  card,
  size = "md",
  glow,
  faded,
  selected,
  onClick,
}: Props) {
  const [imgError, setImgError] = React.useState(false);
  const f = factionStyles[card.type];
  const isXs = size === "xs";
  const isSm = size === "sm";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={onClick ? { scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      style={{ "--faction-glow": f.glow } as React.CSSProperties}
      className={cn(
        "relative shrink-0 overflow-hidden text-left bg-black shadow-md",
        "living-card",
        CARD_SIZES[size],
        RARITY_BORDERS[card.rarity],
        "rounded-lg border border-white/10",
        faded && "opacity-45 grayscale",
        selected && "ring-2 ring-gold/70 z-50",
        glow && "shadow-[0_0_12px_rgba(168,85,247,0.4)]",
      )}
    >
      <div className="living-card-reflection" />
      
      {/* Art */}
      <div className="absolute inset-0 bg-[#0a0a0c]">
        {!imgError ? (
          <img
            src={card.art}
            alt={card.name}
            onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full object-cover living-card-art"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-mystic/30 to-abyss living-card-art" />
        )}
        <div className="absolute bottom-0 inset-x-0 h-3/5 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      {/* Faction bar */}
      <div className={cn("absolute top-0 inset-x-0 h-[2px] z-20 rounded-t-lg", f.bar)} />

      {/* Cost */}
      <div className="absolute top-1.5 left-1.5 z-20 flex items-center justify-center rounded-full bg-black/70 size-6">
        <span
          className={cn(
            "font-display font-bold",
            isSm ? "text-[12px]" : isXs ? "text-[10px]" : "text-[12px]",
            faded ? "text-white/40" : "text-white",
          )}
        >
          {card.cost}
        </span>
      </div>

      {/* Bottom Info Area */}
      <div className="absolute bottom-0 inset-x-0 z-20 flex flex-col p-1.5 pt-4 pb-2 text-left">
        <h3
          className={cn(
            "font-display uppercase text-white font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]",
            isXs
              ? "text-[8px] tracking-wide truncate pr-5"
              : isSm
                ? "text-[9px] tracking-wider truncate pr-6"
                : "text-[11px] tracking-wider pr-8 leading-tight",
          )}
        >
          {card.name}
        </h3>
        {!isXs && !isSm && card.text && (
          <p className="text-[7.5px] leading-[9.5px] text-white/75 mt-0.5 pr-7 line-clamp-3">
            {card.text}
          </p>
        )}
      </div>

      {/* Power */}
      <div className="absolute bottom-1.5 right-1.5 z-30 flex items-center justify-center bg-black/80 rounded size-6 ring-1 ring-white/10 shadow-lg">
        <span
          className={cn(
            "font-display font-extrabold",
            isSm ? "text-[13px]" : "text-[12px]",
            f.power,
          )}
        >
          {card.power}
        </span>
      </div>
    </motion.button>
  );
});

export const CardBack = React.memo(function CardBack({
  size = "md",
}: {
  size?: keyof typeof CARD_SIZES;
}) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden bg-gradient-to-br from-mystic/30 to-abyss shadow-md rounded-lg border border-white/10",
        CARD_SIZES[size],
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-gold/50 text-lg">?</span>
      </div>
    </div>
  );
});

export function CardFromId({ id, ...rest }: { id: string } & Omit<Props, "card">) {
  const c = cardsById[id];
  if (!c) return null;
  return <GameCard card={c} {...rest} />;
}
