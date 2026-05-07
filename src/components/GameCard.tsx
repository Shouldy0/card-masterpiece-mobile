import { CardDef, cardsById } from "@/game/cards";
import { motion } from "framer-motion";
import { Eye, Brain, BookOpen, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const typeIcon = {
  archetipo: Sparkles,
  ricordo: BookOpen,
  maschera: Brain,
};

const rarityRing = {
  comune: "ring-muted-foreground/30",
  rara: "ring-azure/60",
  epica: "ring-mystic/70",
  leggendaria: "ring-gold/80",
};

interface Props {
  card: CardDef;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  glow?: boolean;
  faded?: boolean;
  selected?: boolean;
  onClick?: () => void;
  showText?: boolean;
}

const sizes = {
  xs: "w-12 aspect-[3/4] text-[8px]",
  sm: "w-16 aspect-[3/4] text-[9px]",
  md: "w-20 aspect-[3/4] text-[10px]",
  lg: "w-28 aspect-[3/4] text-xs",
  xl: "w-48 aspect-[3/4] text-sm",
};

export function GameCard({ card, size = "md", glow, faded, selected, onClick, showText }: Props) {
  const Icon = typeIcon[card.type];
  const isXs = size === "xs";
  const isSm = size === "sm";
  const isSmall = isXs || isSm;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={onClick ? { y: -8, scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      className={cn(
        "relative shrink-0 rounded-xl ring-1 overflow-hidden text-left shadow-2xl transition-shadow",
        sizes[size],
        rarityRing[card.rarity],
        faded && "grayscale opacity-40",
        selected && "ring-2 ring-gold shadow-[0_0_40px_-4px_rgba(255,215,0,0.5)]",
        glow && "shadow-[0_0_30px_-4px_var(--mystic-glow)]",
        "bg-abyss/80",
      )}
    >
      {/* Background Art */}
      <div className="absolute inset-0">
        <img
          src={card.art}
          alt={card.name}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss via-transparent to-transparent opacity-60" />
      </div>

      {/* Glassy Overlay for Name */}
      {!isXs && (
        <div className={cn(
          "absolute inset-x-1.5 bg-abyss/60 backdrop-blur-md rounded-lg ring-1 ring-gold/20 flex items-center justify-center px-1",
          isSm ? "bottom-[12%] h-5" : "bottom-[15%] h-7"
        )}>
          <span className={cn(
            "font-display uppercase tracking-[0.1em] text-gold text-center leading-tight",
            isSm ? "text-[5px]" : "text-[7px]"
          )}>
            {card.name}
          </span>
        </div>
      )}

      {/* Gold Frame Detail */}
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gold/20" />

      {/* Cost Badge */}
      <div className={cn(
        "absolute left-1.5 top-1.5 flex items-center justify-center rounded-full bg-mystic/80 ring-1 ring-gold/50 font-display text-white shadow-lg",
        isSmall ? "size-3.5 text-[6px]" : "size-5 text-[9px]"
      )}>
        {card.cost}
      </div>

      {/* Type Badge */}
      <div className={cn(
        "absolute right-1.5 top-1.5 flex items-center justify-center rounded-full bg-abyss/60 ring-1 ring-gold/30",
        isSmall ? "size-3.5" : "size-5"
      )}>
        <Icon className={cn("text-gold/80", isSmall ? "h-2 w-2" : "h-2.5 w-2.5")} />
      </div>

      {/* Power Badge (Golden Shield) */}
      <div className={cn(
        "absolute left-1/2 -translate-x-1/2 flex flex-col items-center",
        isSmall ? "-bottom-1 w-5 h-6" : "-bottom-1.5 w-7 h-8"
      )}>
        <div className="absolute inset-0 bg-gold rounded-b-lg rounded-t-sm shadow-[0_2px_10px_rgba(0,0,0,0.5)]" />
        <span className={cn(
          "relative z-10 font-display text-abyss font-bold",
          isSmall ? "mt-1 text-[7px]" : "mt-1.5 text-[10px]"
        )}>
          {card.power}
        </span>
      </div>
    </motion.button>
  );
}

export function CardBack({ size = "md" }: { size?: keyof typeof sizes }) {
  return (
    <div className={cn("relative shrink-0 rounded-md overflow-hidden ring-1 ring-gold/40 bg-gradient-to-br from-[oklch(0.2_0.1_290)] to-[oklch(0.08_0.04_270)]", sizes[size])}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="size-10 rounded-full ring-2 ring-gold/60 bg-gradient-to-br from-mystic/40 to-transparent" />
          <Eye className="absolute inset-0 m-auto h-5 w-5 text-gold" />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 ring-1 ring-gold/30 rounded-md" />
    </div>
  );
}

export function CardFromId({ id, ...rest }: { id: string } & Omit<Props, "card">) {
  const c = cardsById[id];
  if (!c) return null;
  return <GameCard card={c} {...rest} />;
}
