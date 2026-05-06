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
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={onClick ? { y: -6, scale: 1.04 } : undefined}
      whileTap={onClick ? { scale: 0.97 } : undefined}
      className={cn(
        "relative shrink-0 rounded-md ring-1 overflow-hidden text-left",
        sizes[size],
        rarityRing[card.rarity],
        faded && "opacity-40",
        selected && "ring-2 ring-gold shadow-[0_0_30px_-4px_var(--gold)]",
        glow && "shadow-[0_0_24px_-4px_var(--mystic-glow)]",
        "bg-gradient-to-b from-[oklch(0.18_0.06_290)] to-[oklch(0.08_0.04_270)]",
      )}
    >
      {/* art */}
      <div className="absolute inset-0">
        <img
          src={card.art}
          alt={card.name}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          onError={(e) => ((e.currentTarget.style.display = "none"))}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-mystic/10 via-transparent to-abyss/90" />
      </div>

      {/* gold border overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-gold/30" />

      {/* cost */}
      <div className="absolute left-1 top-1 flex items-center justify-center rounded-full bg-mystic/90 ring-1 ring-gold/70 size-5 font-display text-[11px] text-white shadow-[0_0_10px_-1px_var(--mystic-glow)]">
        {card.cost}
      </div>
      {/* type icon */}
      <div className="absolute right-1 top-1 flex items-center justify-center rounded-full bg-abyss/80 ring-1 ring-gold/60 size-5">
        <Icon className="h-3 w-3 text-gold" />
      </div>

      {/* name strip */}
      {(size === "lg" || size === "xl" || showText) && (
        <div className="absolute inset-x-1 bottom-6 rounded-sm bg-abyss/80 px-1 py-0.5 text-center font-display text-[10px] uppercase tracking-wider text-gold backdrop-blur-sm">
          {card.name}
        </div>
      )}

      {/* power */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-6 rotate-45 rounded-sm bg-gradient-to-br from-gold to-gold-dim ring-1 ring-abyss" />
      <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 z-10 font-display text-xs text-abyss leading-none">
        {card.power}
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
