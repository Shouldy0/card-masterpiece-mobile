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

export function GameCard({ card, size = "md", glow, faded, selected, onClick }: Props) {
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
        "relative shrink-0 rounded-[12px] overflow-hidden text-left transition-all duration-500 group",
        sizes[size],
        faded && "grayscale opacity-50",
        selected && "ring-2 ring-gold/60 shadow-[0_0_40px_rgba(255,215,0,0.4)]",
        glow && "shadow-[0_0_20px_rgba(168,85,247,0.3)]",
        "bg-black"
      )}
    >
      {/* 1. CENTRAL ILLUSTRATION (Naked Art) */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={card.art}
          alt={card.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 scale-[1.05]"
          loading="lazy"
        />
        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
      </div>

      {/* 2. SHARED ORNATE FRAME (Absolute Consistency) */}
      {/* Outer Glow */}
      <div className="pointer-events-none absolute inset-0 rounded-[12px] border-[1px] border-gold/10" />
      {/* The "Master" Metallic Frame */}
      <div className="pointer-events-none absolute inset-[1.5px] rounded-[10.5px] border-[1.5px] border-double border-gold/30 shadow-[inset_0_0_8px_rgba(0,0,0,0.8)]" />
      
      {/* 3. DYNAMIC UI (Identical Hierarchy) */}
      {/* Top Left: Cost Gem */}
      <div className={cn(
        "absolute left-1 top-1 z-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#4C1D95] border-[1px] border-gold/40 shadow-[0_0_10px_rgba(139,92,246,0.4)]",
        isXs ? "size-3.5 text-[6px]" : isSm ? "size-5 text-[8px]" : "size-9 text-[16px]"
      )}>
        <span className="font-display font-black text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">{card.cost}</span>
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-white/30 pointer-events-none" />
      </div>

      {/* Top Right: Faction Symbol Overlay */}
      <div className={cn(
        "absolute right-1 top-1 z-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border-[1px] border-gold/20",
        isXs ? "size-3.5" : isSm ? "size-5" : "size-8"
      )}>
        <div className={cn("rounded-full bg-gold/60 animate-pulse", isXs ? "size-0.5" : isSm ? "size-1" : "size-2")} />
      </div>

      {/* Bottom: Translucent Name Panel */}
      <div className={cn(
        "absolute bottom-0 inset-x-0 z-10 flex flex-col items-center justify-end px-2 text-center",
        isXs ? "pb-1 pt-4" : isSm ? "pb-2 pt-6" : "pb-4 pt-10 px-3",
        "bg-gradient-to-t from-black via-black/80 to-transparent"
      )}>
        <h3 className={cn(
          "font-display uppercase tracking-[0.1em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight",
          isXs ? "text-[5px]" : isSm ? "text-[7px]" : "text-[11px] font-bold"
        )}>
          {card.name}
        </h3>
        {size === "xl" && (
          <p className="mt-1 text-[7px] text-gold/60 font-medium uppercase tracking-widest leading-tight">
            {card.type} • REVERIE
          </p>
        )}
      </div>

      {/* Bottom Center: Power Hexagon */}
      <div className={cn(
        "absolute left-1/2 -translate-x-1/2 z-20 bg-gradient-to-b from-gold via-[#B8860B] to-[#8B4513] flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.8)] border-[1px] border-white/20",
        isXs ? "bottom-0 w-6 h-3.5" : isSm ? "bottom-0 w-8 h-4.5" : "bottom-1 w-12 h-7"
      )} style={{ clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)' }}>
        <span className={cn(
          "font-display text-black font-black drop-shadow-sm",
          isXs ? "text-[7px]" : isSm ? "text-[9px]" : "text-[16px]"
        )}>
          {card.power}
        </span>
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
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
