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
      whileHover={onClick ? { y: -5, scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      className={cn(
        "relative shrink-0 rounded-[20px] overflow-hidden text-left transition-all duration-300",
        sizes[size],
        faded && "grayscale opacity-50",
        selected && "ring-2 ring-gold shadow-[0_0_30px_rgba(255,215,0,0.4)]",
        glow && "shadow-[0_0_20px_rgba(168,85,247,0.4)]",
        "bg-abyss"
      )}
    >
      {/* Background Art - The images already contain the name and frame details */}
      <div className="absolute inset-0">
        <img
          src={card.art}
          alt={card.name}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Frame Polish Overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-white/10" />

      {/* Cost Badge (Purple Circle) */}
      <div className={cn(
        "absolute left-2 top-2 flex items-center justify-center rounded-full bg-[#7C3AED] shadow-lg border border-white/20 font-display text-white",
        isSmall ? "size-4 text-[7px]" : "size-7 text-[12px]"
      )}>
        {card.cost}
      </div>

      {/* Type Badge (Golden Icon) */}
      <div className={cn(
        "absolute right-2 top-2 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-gold/30",
        isSmall ? "size-4" : "size-7"
      )}>
        <Icon className={cn("text-gold", isSmall ? "h-2 w-2" : "h-4 w-4")} />
      </div>

      {/* Power Badge (Golden Rounded Rectangle) */}
      <div className={cn(
        "absolute left-1/2 -translate-x-1/2 bg-[#EAB308] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-white/20",
        isSmall ? "bottom-1 w-6 h-4 rounded-md" : "bottom-2 w-10 h-7 rounded-lg"
      )}>
        <span className={cn(
          "font-display text-black font-bold",
          isSmall ? "text-[8px]" : "text-[14px]"
        )}>
          {card.power}
        </span>
      </div>

      {/* Selection Glow */}
      {selected && (
        <div className="absolute inset-0 bg-gold/10 pointer-events-none animate-pulse" />
      )}
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
