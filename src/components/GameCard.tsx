import { CardDef, cardsById, CardType } from "@/game/cards";
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
  const [imgError, setImgError] = React.useState(false);
  const isXs = size === "xs";
  const isSm = size === "sm";

  // MASTER ACCENT SYSTEM (User's Faction Color Map)
  const getFactionAccent = (type: CardType) => {
    switch (type) {
      case "archetipo": return { primary: "#A855F7", glow: "rgba(168, 85, 247, 0.4)", label: "VIOLET" }; // Mente
      case "ricordo": return { primary: "#EAB308", glow: "rgba(234, 179, 8, 0.4)", label: "PALE GOLD" };   // Memorie
      case "maschera": return { primary: "#EF4444", glow: "rgba(239, 68, 68, 0.4)", label: "CRIMSON" };    // Sangue
      case "oblio": return { primary: "#3B82F6", glow: "rgba(59, 130, 246, 0.4)", label: "COLD BLUE" };   // Oblio
      case "sogno": return { primary: "#06B6D4", glow: "rgba(6, 182, 212, 0.4)", label: "CYAN" };        // Sogno
      default: return { primary: "#8B5CF6", glow: "rgba(139, 92, 246, 0.4)", label: "COSMIC" };
    }
  };

  const accent = getFactionAccent(card.type);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={onClick ? { y: -5, scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      className={cn(
        "relative shrink-0 rounded-[12px] overflow-hidden text-left transition-all duration-500 group bg-black shadow-2xl",
        sizes[size],
        faded && "grayscale opacity-40 hover:grayscale-0 hover:opacity-100",
        selected && "ring-2 ring-gold/80 shadow-[0_0_40px_rgba(255,215,0,0.5)]",
        glow && "shadow-[0_0_20px_rgba(168,85,247,0.4)]"
      )}
    >
      {/* 1. CENTRAL ILLUSTRATION (Separated Layer) */}
      <div className="absolute inset-0 overflow-hidden bg-[#0a0a0c]">
        {!imgError ? (
          <img
            src={card.art}
            alt={card.name}
            onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 scale-[1.08]"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="absolute inset-0 opacity-40" 
                 style={{ background: `radial-gradient(circle at 50% 40%, ${accent.primary}44, transparent 70%)` }} />
            <Sparkles className="size-6 text-gold/20 animate-pulse" />
          </div>
        )}
        
        {/* STESSO MODELLO DI LUCE (Global Rule) */}
        {/* Cinematic Purple Nebula Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(139,92,246,0.2),transparent_80%)] pointer-events-none" />
        {/* High Contrast Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/95 pointer-events-none" />
        {/* Particle Texture Layer */}
        <div className="absolute inset-0 opacity-20 mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />
      </div>

      {/* 2. MASTER FRAME (Fixed Layout) */}
      {/* Outer Metallic Border */}
      <div className="pointer-events-none absolute inset-0 rounded-[12px] border-[1px] border-gold/15" />
      {/* Double Double Frame */}
      <div className="pointer-events-none absolute inset-[2px] rounded-[10.5px] border-[1.5px] border-double border-gold/30 shadow-[inset_0_0_15px_rgba(0,0,0,0.95)]" />
      
      {/* CORNER ORNAMENTS (AAA Detail) */}
      <div className="absolute top-1 left-1 size-3 border-t-[1.5px] border-l-[1.5px] border-gold/50 rounded-tl-sm pointer-events-none" />
      <div className="absolute top-1 right-1 size-3 border-t-[1.5px] border-r-[1.5px] border-gold/50 rounded-tr-sm pointer-events-none" />
      <div className="absolute bottom-1 left-1 size-3 border-b-[1.5px] border-l-[1.5px] border-gold/50 rounded-bl-sm pointer-events-none" />
      <div className="absolute bottom-1 right-1 size-3 border-b-[1.5px] border-r-[1.5px] border-gold/50 rounded-br-sm pointer-events-none" />

      {/* 3. DYNAMIC UI (Fixed Positions) */}
      
      {/* Top Left: COST GEM */}
      <div className={cn(
        "absolute left-1.5 top-1.5 z-10 flex items-center justify-center rounded-full border-[1.5px] border-gold/40 shadow-2xl transition-transform duration-500 group-hover:scale-110",
        isXs ? "size-3.5 text-[7px]" : isSm ? "size-5 text-[9px]" : "size-10 text-[18px]"
      )} style={{ background: `radial-gradient(circle at 30% 30%, ${accent.primary}, #000)` }}>
        <span className="font-display font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{card.cost}</span>
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none" />
      </div>

      {/* Top Right: FACTION ICON */}
      <div className={cn(
        "absolute right-2 top-2 z-10 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md border-[1.5px] border-gold/20",
        isXs ? "size-3.5" : isSm ? "size-5" : "size-8"
      )}>
        <div className={cn("rounded-full animate-pulse")} 
             style={{ 
               width: isXs ? '2px' : '8px', 
               height: isXs ? '2px' : '8px', 
               backgroundColor: accent.primary,
               boxShadow: `0 0 15px ${accent.glow}`
             }} />
      </div>

      {/* Bottom: MASTER TEXT BOX (Fixed Hierarchy) */}
      <div className={cn(
        "absolute bottom-0 inset-x-0 z-10 flex flex-col items-center justify-end px-2 text-center",
        isXs ? "pb-1 pt-6" : isSm ? "pb-2 pt-8" : "pb-5 pt-16 px-4",
        "bg-gradient-to-t from-black via-black/85 to-transparent"
      )}>
        {/* Name (Fixed Typography) */}
        <h3 className={cn(
          "font-display uppercase tracking-[0.2em] text-white drop-shadow-[0_4px_8px_rgba(0,0,0,1)] leading-none",
          isXs ? "text-[5.5px]" : isSm ? "text-[8px]" : "text-[14px] font-black"
        )}>
          {card.name}
        </h3>
        
        {/* Type Identifier (Fixed Detail) */}
        {(size === "lg" || size === "xl") && (
          <div className="mt-2 flex items-center gap-1.5 opacity-60">
            <div className="h-[1px] w-4 bg-gradient-to-r from-transparent to-white/40" />
            <span className="text-[7px] font-black uppercase tracking-[0.3em] text-white/90">
              {card.type}
            </span>
            <div className="h-[1px] w-4 bg-gradient-to-l from-transparent to-white/40" />
          </div>
        )}
      </div>

      {/* Bottom Center: VALUE HEXAGON (Fixed Model) */}
      <div className={cn(
        "absolute left-1/2 -translate-x-1/2 z-20 flex items-center justify-center shadow-[0_6px_20px_rgba(0,0,0,1)] border-[1.5px] border-white/20 transition-transform duration-500 group-hover:scale-110",
        isXs ? "bottom-0 w-6 h-3.5" : isSm ? "bottom-0 w-8 h-4.5" : "bottom-1.5 w-14 h-8"
      )} 
      style={{ 
        clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)',
        background: `linear-gradient(to bottom, #FFD700, #B8860B, #8B4513)`
      }}>
        <span className={cn(
          "font-display text-black font-black drop-shadow-sm",
          isXs ? "text-[8px]" : isSm ? "text-[10px]" : "text-[20px]"
        )}>
          {card.power}
        </span>
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
      </div>
    </motion.button>
  );
}

export function CardBack({ size = "md" }: { size?: keyof typeof sizes }) {
  return (
    <div className={cn(
      "relative shrink-0 rounded-[12px] overflow-hidden bg-black shadow-2xl group", 
      sizes[size]
    )}>
      {/* Master Back Aesthetic (Uniform with Frame) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a0b2e,#000)]" />
      
      {/* Outer Metallic Border */}
      <div className="pointer-events-none absolute inset-0 rounded-[12px] border-[1px] border-gold/20" />
      
      {/* Intricate Filigree Grid */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] mix-blend-overlay" />
      
      {/* Central Mystical Eye */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div className="size-16 rounded-full ring-2 ring-gold/40 bg-gradient-to-br from-purple-900/60 to-black flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.3)]">
             <Eye className="h-8 w-8 text-gold drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
          </div>
          {/* Ornate rings around eye */}
          <div className="absolute inset-[-10px] rounded-full border-[1px] border-gold/20 border-dashed animate-spin-slow" />
          <div className="absolute inset-[-20px] rounded-full border-[1px] border-gold/10 animate-reverse-spin-slow" />
        </motion.div>
      </div>

      {/* Corners match the front */}
      <div className="absolute top-1 left-1 size-3 border-t-[1.5px] border-l-[1.5px] border-gold/50 rounded-tl-sm pointer-events-none" />
      <div className="absolute top-1 right-1 size-3 border-t-[1.5px] border-r-[1.5px] border-gold/50 rounded-tr-sm pointer-events-none" />
      <div className="absolute bottom-1 left-1 size-3 border-b-[1.5px] border-l-[1.5px] border-gold/50 rounded-bl-sm pointer-events-none" />
      <div className="absolute bottom-1 right-1 size-3 border-b-[1.5px] border-r-[1.5px] border-gold/50 rounded-br-sm pointer-events-none" />
    </div>
  );
}

export function CardFromId({ id, ...rest }: { id: string } & Omit<Props, "card">) {
  const c = cardsById[id];
  if (!c) return null;
  return <GameCard card={c} {...rest} />;
}
