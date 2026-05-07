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
        "relative shrink-0 rounded-[12px] overflow-hidden text-left transition-all duration-300",
        sizes[size],
        faded && "grayscale opacity-50",
        selected && "ring-2 ring-gold shadow-[0_0_30px_rgba(255,215,0,0.6)]",
        glow && "shadow-[0_0_20px_rgba(168,85,247,0.5)]",
        "bg-abyss shadow-2xl"
      )}
    >
      {/* Background Art */}
      <div className="absolute inset-0">
        <img
          src={card.art}
          alt={card.name}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        {/* Dark Vignette for UI Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
      </div>

      {/* Ornate Gold Frame (CSS version) */}
      <div className="pointer-events-none absolute inset-0 rounded-[12px] border-[1px] border-gold/40" />
      <div className="pointer-events-none absolute inset-[1px] rounded-[11px] border-[0.5px] border-white/10" />

      {/* Cost Gem (Top Left - Purple Gem with Metallic Rim) */}
      <div className={cn(
        "absolute left-1.5 top-1.5 flex items-center justify-center rounded-full bg-gradient-to-br from-[#A855F7] to-[#6D28D9] shadow-[0_0_10px_rgba(168,85,247,0.8)] border-[1.5px] border-white/30",
        isSmall ? "size-4 text-[7px]" : "size-8 text-[14px]"
      )}>
        <span className="font-display font-bold text-white drop-shadow-md">{card.cost}</span>
        {/* Shine highlight */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-white/40 pointer-events-none" />
      </div>

      {/* Faction Icon (Top Right) */}
      <div className={cn(
        "absolute right-1.5 top-1.5 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border-[1px] border-gold/30",
        isSmall ? "size-4" : "size-7"
      )}>
        <div className={cn("rounded-full bg-gold/80", isSmall ? "size-1.5" : "size-3")} />
      </div>

      {/* Bottom Translucent Panel */}
      <div className={cn(
        "absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col items-center justify-end pb-3 pt-6 px-2 text-center",
        isSmall ? "h-[30%]" : "h-[40%]"
      )}>
        <h3 className={cn(
          "font-display uppercase tracking-[0.05em] text-white drop-shadow-lg leading-tight",
          isSmall ? "text-[6px]" : "text-[10px]"
        )}>
          {card.name}
        </h3>
        {!isSmall && (
          <p className="mt-1 text-[6px] text-white/60 font-light leading-tight max-w-[80%]">
            {card.flavor?.substring(0, 40)}...
          </p>
        )}
      </div>

      {/* Power Badge (Bottom Center - Hexagonal Metallic Badge) */}
      <div className={cn(
        "absolute left-1/2 -translate-x-1/2 bg-[#D4AF37] flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.6)] border-[1px] border-white/40",
        isSmall ? "bottom-0.5 w-6 h-4 rounded-sm" : "bottom-1 w-10 h-7 rounded-md"
      )} style={{ clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)' }}>
        <span className={cn(
          "font-display text-black font-extrabold",
          isSmall ? "text-[8px]" : "text-[14px]"
        )}>
          {card.power}
        </span>
        {/* Metallic Bevel Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-black/20 pointer-events-none" />
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
