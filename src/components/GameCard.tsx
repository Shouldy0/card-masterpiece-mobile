import React from "react";
import { CardDef, cardsById, CardType } from "@/game/cards";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Brain, BookOpen, Sparkles, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { CARD_SIZES, RARITY_BORDERS } from "@/game/constants";

const typeIcon = {
  archetipo: Sparkles,
  ricordo: BookOpen,
  maschera: Brain,
  oblio: Eye,
  sogno: Sparkles,
  eco: Leaf,
};

interface Props {
  card: CardDef;
  size?: keyof typeof CARD_SIZES;
  glow?: boolean;
  faded?: boolean;
  selected?: boolean;
  noInspect?: boolean;
  onClick?: () => void;
}

export const GameCard = React.memo(function GameCard({ card, size = "md", glow, faded, selected, noInspect, onClick }: Props) {
  const [imgError, setImgError] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [showInspection, setShowInspection] = React.useState(false);

  if (!card) return null;
  const isXs = size === "xs";
  const isSm = size === "sm";
  const isXl = size === "xl";

  const getFactionAccent = (type: CardType) => {
    switch (type) {
      case "archetipo": return { primary: "#A855F7", glow: "rgba(168, 85, 247, 0.4)", label: "VIOLET" };
      case "ricordo": return { primary: "#EAB308", glow: "rgba(234, 179, 8, 0.4)", label: "PALE GOLD" };
      case "maschera": return { primary: "#EF4444", glow: "rgba(239, 68, 68, 0.4)", label: "CRIMSON" };
      case "oblio": return { primary: "#3B82F6", glow: "rgba(59, 130, 246, 0.4)", label: "COLD BLUE" };
      case "sogno": return { primary: "#06B6D4", glow: "rgba(6, 182, 212, 0.4)", label: "CYAN" };
      case "eco": return { primary: "#10B981", glow: "rgba(16, 185, 129, 0.4)", label: "EMERALD" };
      default: return { primary: "#8B5CF6", glow: "rgba(139, 92, 246, 0.4)", label: "COSMIC" };
    }
  };

  const accent = getFactionAccent(card.type);

  const handleClick = () => {
    if (size !== "xl" && !noInspect) setShowInspection(true);
    onClick?.();
  };

  return (
    <>
    <motion.button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={onClick ? { y: -8, scale: 1.05, rotate: selected ? 0 : 2 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      className={cn(
        "relative shrink-0 rounded-[12px] overflow-hidden text-left transition-all duration-500 group bg-black shadow-2xl",
        CARD_SIZES[size],
        RARITY_BORDERS[card.rarity],
        faded && "grayscale opacity-40 hover:grayscale-0 hover:opacity-100",
        selected && "ring-4 ring-gold shadow-[0_0_50px_rgba(255,215,0,0.6)] z-50",
        glow && "shadow-[0_0_30px_rgba(168,85,247,0.5)] animate-pulse"
      )}
    >
      {/* 1. CENTRAL ILLUSTRATION with 3D PARALLAX */}
      <div className="absolute inset-0 overflow-hidden bg-[#0a0a0c]">
        {!imgError ? (
          <motion.img
            src={card.art}
            alt={card.name}
            onError={() => setImgError(true)}
            animate={{
              scale: isHovered ? 1.15 : 1.08,
              x: isHovered ? [0, 5, -5, 0] : 0,
              y: isHovered ? [0, -3, 3, 0] : 0,
            }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black overflow-hidden">
            <div className="absolute inset-0 opacity-40" 
                 style={{ background: `radial-gradient(circle at 50% 40%, ${accent.primary}44, transparent 70%)` }} />
            <motion.div animate={{ scale: [0.8, 1.1, 0.8], rotate: [0, 180, 360] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="relative size-32 opacity-30" style={{ color: accent.primary }}>
              <Sparkles className="absolute inset-0 size-full blur-xl opacity-50" />
            </motion.div>
          </div>
        )}
        
        {/* Holographic Sweep Effect */}
        <motion.div 
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 z-20 pointer-events-none" 
        />

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/95 pointer-events-none" />
        
        {/* Rarity Glow (Pulse) */}
        {card.rarity === "leggendaria" && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1),transparent_70%)] animate-pulse pointer-events-none" />
        )}
      </div>

      {/* 2. PREMIUM FRAME */}
      <div className={cn(
        "pointer-events-none absolute inset-0 rounded-[12px] border-[1.5px]",
        card.rarity === "leggendaria" ? "border-gold/40" : card.rarity === "epica" ? "border-mystic/40" : "border-white/10"
      )} />
      
      {/* Corner Filigrees */}
      {!isXs && (
        <>
          <div className="absolute top-1.5 left-1.5 size-4 border-t-[1.5px] border-l-[1.5px] border-gold/40 rounded-tl-[4px]" />
          <div className="absolute top-1.5 right-1.5 size-4 border-t-[1.5px] border-r-[1.5px] border-gold/40 rounded-tr-[4px]" />
          <div className="absolute bottom-1.5 left-1.5 size-4 border-b-[1.5px] border-l-[1.5px] border-gold/40 rounded-bl-[4px]" />
          <div className="absolute bottom-1.5 right-1.5 size-4 border-b-[1.5px] border-r-[1.5px] border-gold/40 rounded-br-[4px]" />
        </>
      )}

      {/* 3. DYNAMIC UI */}
      
      {/* Cost Gem with Inner Glow */}
      <div className={cn(
        "absolute left-1 top-1 z-30 flex items-center justify-center rounded-full border border-white/20 shadow-xl",
        isXs ? "size-3.5 text-[6px]" : isSm ? "size-5 text-[8px]" : "size-9 text-[16px]"
      )} style={{ background: `radial-gradient(circle at 30% 30%, ${accent.primary}, #000)` }}>
        <span className="font-display font-black text-white drop-shadow-md">{card.cost}</span>
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-white/40 pointer-events-none" />
      </div>

      {/* Faction Badge */}
      <div className={cn(
        "absolute right-2 top-2 z-30 flex items-center justify-center rounded-full bg-black/70 backdrop-blur-md border border-white/10",
        isXs ? "size-3.5" : isSm ? "size-5" : "size-8"
      )}>
        <div className="rounded-full" style={{ width: '40%', height: '40%', backgroundColor: accent.primary, boxShadow: `0 0 12px ${accent.primary}` }} />
      </div>

      {/* Bottom Text Area - Moved UP to avoid overlapping with Power badge */}
      <div className={cn(
        "absolute bottom-4 inset-x-0 z-30 flex flex-col items-center justify-end px-2 text-center",
        isXs ? "pb-1 pt-4" : isSm ? "pb-2 pt-6" : "pb-8 pt-16 px-4",
        "bg-gradient-to-t from-black/80 via-black/40 to-transparent"
      )}>
        <h3 className={cn(
          "font-display uppercase tracking-[0.2em] text-white drop-shadow-lg",
          isXs ? "text-[6px]" : isSm ? "text-[8px]" : "text-[12px] font-black"
        )}>
          {card.name}
        </h3>
        
        {/* Card Text (Effect Description) */}
        {!isXs && !isSm && (
          <p className={cn(
            "text-[9px] text-foreground/80 leading-tight mt-1 mb-2 line-clamp-3 px-1",
            isXl && "text-[11px] px-4"
          )}>
            {card.text}
          </p>
        )}

        {/* Rarity Text for XL */}
        {isXl && (
          <span className={cn(
            "text-[8px] font-bold uppercase tracking-[0.4em] mb-1",
            card.rarity === "leggendaria" ? "text-gold" : "text-white/60"
          )}>
            {card.rarity}
          </span>
        )}
      </div>

      {/* Power Value (Floating Hexagon) - Moved to Bottom Right to avoid overlapping text */}
      <div className={cn(
        "absolute z-40 flex items-center justify-center shadow-2xl transition-all duration-300",
        isXs ? "bottom-0 right-0 w-7 h-4" : isSm ? "bottom-0 right-0 w-9 h-5" : "bottom-3 right-3 w-16 h-9",
        isHovered && "scale-110 -translate-y-1"
      )} 
      style={{ 
        clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)',
        background: `linear-gradient(135deg, #FFD700, #B8860B, #D4AF37)`
      }}>
        <span className={cn(
          "font-display text-black font-black drop-shadow-md",
          isXs ? "text-[9px]" : isSm ? "text-[11px]" : "text-[22px]"
        )}>
          {card.power}
        </span>
      </div>
    </motion.button>

    {/* INSPECTION VIEW OVERLAY */}
    <AnimatePresence>
      {showInspection && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl p-6"
          onClick={() => setShowInspection(false)}
        >
          <motion.div 
            initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }}
            className="flex flex-col items-center max-w-sm w-full"
            onClick={e => e.stopPropagation()}
          >
            {/* Full XL Card View */}
            <div className="relative">
              <GameCard card={card} size="xl" />
            </div>
            
            <div className="mt-8 text-center">
              <button 
                onClick={() => setShowInspection(false)}
                className="px-10 py-3 rounded-full border border-gold/20 hover:bg-gold/10 transition-all text-[10px] uppercase tracking-widest text-gold font-bold"
              >
                CHIUDI MEMORIA
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
});

export const CardBack = React.memo(function CardBack({ size = "md" }: { size?: keyof typeof CARD_SIZES }) {
  return (
    <div className={cn(
      "relative shrink-0 rounded-[12px] overflow-hidden bg-black shadow-2xl group", 
      CARD_SIZES[size]
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
});

export function CardFromId({ id, ...rest }: { id: string } & Omit<Props, "card">) {
  const c = cardsById[id];
  if (!c) return null;
  return <GameCard card={c} {...rest} />;
}
