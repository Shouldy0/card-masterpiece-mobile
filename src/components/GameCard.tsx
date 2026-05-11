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

const factionStyles: Record<CardType, { bar: string; power: string }> = {
  archetipo: { bar: "bg-purple-500", power: "text-purple-300" },
  ricordo: { bar: "bg-yellow-500", power: "text-yellow-300" },
  maschera: { bar: "bg-red-500", power: "text-red-300" },
  oblio: { bar: "bg-blue-500", power: "text-blue-300" },
  sogno: { bar: "bg-cyan-400", power: "text-cyan-300" },
  eco: { bar: "bg-emerald-500", power: "text-emerald-300" },
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
      whileTap={onClick ? { scale: 0.95 } : undefined}
      className={cn(
        "relative shrink-0 overflow-hidden text-left bg-black shadow-md",
        CARD_SIZES[size],
        RARITY_BORDERS[card.rarity],
        "rounded-lg border border-white/10",
        faded && "opacity-45 grayscale",
        selected && "ring-2 ring-gold/70 z-50",
        glow && "shadow-[0_0_12px_rgba(168,85,247,0.2)]",
      )}
    >
      {/* Art */}
      <div className="absolute inset-0 bg-[#0a0a0c]">
        {!imgError ? (
          <img
            src={card.art}
            alt={card.name}
            onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-mystic/30 to-abyss" />
        )}
        <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
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

      {/* Name */}
      <div className="absolute bottom-1.5 inset-x-1.5 z-20">
        <h3
          className={cn(
            "font-display uppercase text-white font-bold truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]",
            isXs
              ? "text-[8px] tracking-wide"
              : isSm
                ? "text-[10px] tracking-wider"
                : "text-[11px] tracking-wider",
          )}
        >
          {card.name}
        </h3>
      </div>

      {/* Power */}
      <div className="absolute bottom-1.5 right-1.5 z-20 flex items-center justify-center bg-black/70 rounded size-6">
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
