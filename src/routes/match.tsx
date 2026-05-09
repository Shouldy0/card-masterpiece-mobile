import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence, animate } from "framer-motion";
import React, { useEffect, useState, useMemo } from "react";
import { useGame, TERRITORIES } from "@/game/store";
import { cardsById, TerritoryId } from "@/game/cards";
import { GameCard, CardBack, CardFromId } from "@/components/GameCard";
import { FocusGems, Hexagon, MobileFrame } from "@/components/Common";
import { sounds } from "@/utils/audio";
import { Hourglass, Settings, Eye, Ghost, Zap, Trophy, Play, CheckCircle2, RefreshCw, Calendar, Users, Loader2, PlayCircle, Skull, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSound } from "@/hooks/useSound";

export const Route = createFileRoute("/match")({ component: Match });

function PowerCounter({ value, isWinning, isAIPower = false }: { value: number; isWinning: boolean; isAIPower?: boolean }) {
  const [displayValue, setDisplayValue] = useState(value);
  const [bursting, setBursting] = useState(0);

  useEffect(() => {
    if (value > displayValue) {
      setBursting(prev => prev + 1);
      setTimeout(() => setBursting(0), 800);
    }
    const controls = animate(displayValue, value, {
      duration: 0.8,
      onUpdate: (v) => setDisplayValue(Math.floor(v))
    });
    return controls.stop;
  }, [value, displayValue]);

  return (
    <div className="relative flex flex-col items-center">
       <AnimatePresence>
         {bursting > 0 && <div className="energy-burst" />}
       </AnimatePresence>
       
       <motion.div 
         key={displayValue}
         initial={{ scale: 0.8, opacity: 0.5 }}
         animate={{ scale: isWinning ? 1.2 : 1, opacity: 1 }}
         className={cn(
           "font-display transition-all drop-shadow-2xl relative z-10",
           isAIPower 
             ? (isWinning ? "text-rose font-black text-2xl drop-shadow-[0_0_15px_rgba(244,63,94,0.4)]" : "text-white/20 text-xl")
             : (isWinning ? "text-gold font-black text-4xl drop-shadow-[0_0_25px_rgba(255,215,0,0.6)] power-glow" : "text-white/20 text-2xl")
         )}
       >
         {displayValue}
       </motion.div>
    </div>
  );
}

const territoryMeta: Record<TerritoryId, { color: string; gradient: string; icon: string; bg: string }> = {
  memoria: { 
    color: "text-gold", 
    gradient: "from-gold/20 via-gold/5", 
    icon: "🌳",
    bg: "rgba(255, 215, 0, 0.03)"
  },
  trauma: { 
    color: "text-rose", 
    gradient: "from-rose/20 via-rose/5", 
    icon: "🖤",
    bg: "rgba(225, 29, 72, 0.03)"
  },
  sogno: { 
    color: "text-azure", 
    gradient: "from-azure/20 via-azure/5", 
    icon: "🌙",
    bg: "rgba(59, 130, 246, 0.03)"
  },
};

function Match() {
  const navigate = useNavigate();
  const match = useGame(s => s.match);
  const selected = useGame(s => s.selectedCard);
  const revealing = useGame(s => s.revealing);
  const playCard = useGame(s => s.playCard);
  const endTurn = useGame(s => s.endTurn);
  const selectCard = useGame(s => s.selectCard);
  const startMatch = useGame((s) => s.startMatch);
  const { play } = useSound();

  // Cinematic Impact State
  const [impacts, setImpacts] = React.useState<Record<string, number>>({});
  const [globalImpact, setGlobalImpact] = React.useState(0);

  const recentLog = useMemo(() => (match?.log ?? []).slice(-3).reverse(), [match?.log]);

  useEffect(() => {
    sounds.startSceneMusic("match");
  }, []);

  useEffect(() => {
    if (!match) startMatch();
  }, [match, startMatch]);

  useEffect(() => {
    if (match?.status === "ended") {
      play(match.result === "win" ? "victory" : "fail");
      const t = setTimeout(() => navigate({ to: "/end" }), 1200);
      return () => clearTimeout(t);
    }
  }, [match?.status, match?.result, navigate, play]);

  if (!match) return null;

  const handleSelect = (id: string) => {
    setSelected(selected === id ? null : id);
    play("lock");
  };

  const handleEndTurn = () => {
    play("ripple");
    endTurn();
    setTimeout(() => play("card_deal"), 250);
  };

  const handlePlay = (territory: TerritoryId) => {
    if (!selected) return;
    const card = cardsById[selected];
    if (!card || card.cost > match.focus.player) { selectCard(null); return; }
    setRevealing({ uid: selected, territory });
    play("card_flip");
    
    // Trigger Impact VFX
    setImpacts(prev => ({ ...prev, [territory]: (prev[territory] || 0) + 1 }));
    setGlobalImpact(prev => prev + 1);

    setTimeout(() => {
      playCard(selected, territory);
      setImpacts(prev => {
        const next = { ...prev };
        delete next[territory];
        return next;
      });
      setGlobalImpact(0);
      setRevealing(null);
      selectCard(null);
    }, 900);
  };

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-abyss text-foreground font-serif">
      {/* Ritual Background Layers */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="ritual-symbol" />
        <div className="haunted-grain" />
        <div className="vignette-haunted" />
        <div className="absolute inset-0 bg-mystic/20 mix-blend-color" />
      </div>

      {/* Background Nebula */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 -left-1/4 size-[800px] bg-mystic-glow/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 -right-1/4 size-[800px] bg-rose/10 blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Minimal Bloom/Fog Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden ritual-tension">
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-mystic/10 to-transparent blur-3xl opacity-30" />
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-gold/5 to-transparent blur-3xl opacity-20" />
      </div>

      {/* Main Layout */}
      <div className={cn(
        "relative z-10 flex h-full flex-col px-2 py-3 floating-board",
        globalImpact > 0 && "impact-shake impact-ripple"
      )}>
        {/* Minimal Header */}
        <div className="flex justify-between items-center mb-3">
           <div className="flex items-center gap-3">
             <HexAvatar side="ai" hp={match.hp.ai} name="OMBRA" sub="" />
             <div className="flex gap-1.5 ml-2">
               {Array.from({ length: match.maxFocus }).map((_, i) => (
                 <FocusDiamond key={i} active={i < match.focus.ai} />
               ))}
             </div>
           </div>

           <div className="flex gap-3">
             <div className="flex items-center gap-1.5 rounded-full bg-card/20 px-3 py-1.5 ring-1 ring-white/5 backdrop-blur-xl">
               <Skull className="size-3 text-rose" />
               <span className="font-display text-xs text-gold">2</span>
             </div>
             <div className="flex items-center gap-1.5 rounded-full bg-card/20 px-3 py-1.5 ring-1 ring-white/5 backdrop-blur-xl">
               <ShieldCheck className="size-3 text-azure" />
               <span className="font-display text-xs text-gold">15</span>
             </div>
           </div>
        </div>

        {/* Central Combat Area */}
        <div className="flex-1 flex gap-3 min-h-0">
          <div className="flex-1 flex gap-3">
            {TERRITORIES.map((t) => (
              <TerritoryColumn
                key={t.id}
                territory={t}
                cards={match.board[t.id]}
                onDrop={() => handlePlay(t.id)}
                canPlay={!!selected}
                isImpacted={!!impacts[t.id]}
              />
            ))}
          </div>

          {/* Minimal Sidebar - Compact */}
          <div className="w-12 flex flex-col items-center justify-center gap-6">
             <div className="flex flex-col items-center gap-1">
                <span className="font-display text-lg text-gold">{match.turn}/{match.maxTurns}</span>
                <div className="flex flex-col gap-1 mt-1">
                  <div className={cn("size-1 rounded-full", true ? "bg-gold shadow-[0_0_8px_var(--gold)]" : "bg-white/10")} />
                  <div className={cn("size-1 rounded-full", false ? "bg-gold" : "bg-white/10")} />
                </div>
             </div>

             <button 
               onClick={handleEndTurn}
               className="relative group size-12"
             >
                <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl group-hover:bg-gold/40 transition-all" />
                <div className="relative size-full rounded-full bg-gradient-to-br from-mystic/40 to-abyss border border-white/10 flex items-center justify-center">
                   <span className="font-display text-[7px] uppercase tracking-widest text-gold">GO</span>
                </div>
             </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-end justify-between">
           <div className="flex items-center gap-3">
             <HexAvatar side="player" hp={match.hp.player} name="YOU" sub="" />
             <div className="flex gap-1.5 ml-2">
               {Array.from({ length: match.maxFocus }).map((_, i) => (
                 <FocusDiamond key={i} active={i < match.focus.player} />
               ))}
             </div>
           </div>

           <div className="flex-1 flex justify-center items-end px-8 hand-container">
              <div className="flex justify-center -space-x-12">
                {match.hand.player.map((id, i) => {
                  const total = match.hand.player.length;
                  const index = i - (total - 1) / 2;
                  const rotation = index * 6; // Curved rotation
                  const yOffset = Math.abs(index) * 8; // Curved Y
                  
                  return (
                    <motion.div
                      key={`${id}-${i}`}
                      whileHover={{ 
                        y: -140, 
                        scale: 1.8, 
                        rotate: 0, 
                        zIndex: 100,
                        rotateY: index * -10, // 3D Tilt
                        transition: { type: "spring", stiffness: 300, damping: 20 }
                      }}
                      onClick={() => handleSelect(id)}
                      className={cn(
                        "relative cursor-pointer transition-all card-shadow-premium", 
                        selected === id && "z-50 -translate-y-20 scale-150"
                      )}
                      style={{ 
                        rotate: `${rotation}deg`,
                        y: yOffset
                      }}
                    >
                      <CardFromId id={id} size="sm" noInspect selected={selected === id} faded={cardsById[id]?.cost > match.focus.player} />
                      <div className="soft-reflection" />
                    </motion.div>
                  );
                })}
              </div>
           </div>

           <div className="flex flex-col items-end gap-2">
              <div className="relative bg-card/20 backdrop-blur-2xl rounded-full size-12 flex items-center justify-center ring-1 ring-white/5">
                 <span className="font-display text-lg text-gold">{match.deck.player.length}</span>
              </div>
           </div>
        </div>
      </div>

      {/* Reveal Animation Overlay */}
      <AnimatePresence>
        {revealing && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-abyss/80 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ rotateY: 0, scale: 0.5, y: 100 }}
              animate={{ rotateY: 180, scale: 1.2, y: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
              style={{ transformStyle: "preserve-3d" }}
              className={cn(
                "relative",
                cardsById[revealing.uid]?.type === "oblio" && "effect-trauma",
                cardsById[revealing.uid]?.type === "sogno" && "effect-dream",
                cardsById[revealing.uid]?.type === "ricordo" && "effect-memory",
                cardsById[revealing.uid]?.type === "archetipo" && "effect-obsession"
              )}
            >
              <div style={{ transform: "rotateY(180deg)" }}>
                <CardFromId id={revealing.uid} size="xl" glow />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HexAvatar({ side, hp, name, sub }: { side: "player" | "ai"; hp: number; name: string; sub: string }) {
  return (
    <div className="relative group">
       {/* Animated Border */}
       <div className={cn(
         "absolute -inset-1 rounded-lg rotate-45 border-2 blur-[2px] animate-pulse opacity-50",
         side === "player" ? "border-gold" : "border-rose"
       )} />
       
       <div className="relative size-14 bg-abyss ring-2 ring-white/10 rounded-lg rotate-45 overflow-hidden flex items-center justify-center shadow-2xl">
          <img 
            src={side === "player" ? "https://api.dicebear.com/7.x/avataaars/svg?seed=Dreamer&backgroundColor=030617&mouth=smile" : "https://api.dicebear.com/7.x/avataaars/svg?seed=Shadow&backgroundColor=030617&eyes=closed"} 
            alt="Avatar"
            className="size-full object-cover -rotate-45 scale-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
       </div>

       {/* HP Badge */}
       <div className="absolute -top-1 -right-1 z-20">
          <div className={cn(
            "size-7 rounded-lg rotate-45 border-2 flex items-center justify-center bg-abyss shadow-xl",
            side === "player" ? "border-gold text-gold" : "border-rose text-rose"
          )}>
             <span className="-rotate-45 font-display text-xs font-black">{hp}</span>
          </div>
       </div>

       {/* Labels */}
       <div className={cn(
         "absolute top-0 left-16 whitespace-nowrap pt-0.5",
         side === "ai" && "left-auto right-16 text-right"
       )}>
          <h3 className="font-display text-[9px] tracking-[0.2em] text-white uppercase">{name}</h3>
          <p className="text-[5px] text-white/40 uppercase tracking-[0.3em] font-sans mt-0.5">{sub}</p>
       </div>
    </div>
  );
}

function FocusDiamond({ active }: { active: boolean }) {
  return (
    <motion.div 
      initial={false}
      animate={{ 
        scale: active ? [1, 1.2, 1] : 1,
        opacity: active ? 1 : 0.2 
      }}
      className={cn(
        "size-2 rotate-45 border shadow-lg transition-colors",
        active ? "bg-mystic border-mystic shadow-mystic/40" : "bg-white/5 border-white/10"
      )}
    />
  );
}

function PhaseIndicator({ active, label }: { active: boolean; label: string }) {
  return (
    <div className={cn("flex items-center gap-2 transition-opacity", !active && "opacity-20")}>
       <div className={cn("size-1 rounded-full", active ? "bg-gold shadow-[0_0_8px_var(--gold)]" : "bg-white/40")} />
       <span className="text-[6px] uppercase tracking-[0.1em] text-white/60 font-black whitespace-nowrap">{label}</span>
    </div>
  );
}

function TerritoryColumn({ territory, cards, onDrop, canPlay, isImpacted }: { territory: typeof TERRITORIES[number]; cards: any[]; onDrop: () => void; canPlay: boolean; isImpacted?: boolean }) {
  const meta = territoryMeta[territory.id];
  const playerPower = cards.filter((c) => c.side === "player").reduce((s, c) => s + c.power, 0);
  const aiPower = cards.filter((c) => c.side === "ai").reduce((s, c) => s + c.power, 0);
  const isWinning = playerPower > aiPower;
  const isLosing = aiPower > playerPower;
  const isContested = playerPower === aiPower && cards.length > 0;
  const isNeutral = cards.length === 0;

  return (
    <motion.div 
      onClick={onDrop}
      whileTap={{ scale: 0.98 }}
      animate={isImpacted ? { scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] } : {}}
      className={cn(
        "flex-1 relative flex flex-col rounded-[2.5rem] overflow-hidden border transition-all duration-700 tarot-border rim-light",
        `aura-${territory.id}`,
        "breathing-light",
        territory.id === "trauma" && "trauma-cracks",
        territory.id === "sogno" && "dream-distortion",
        isNeutral && "state-neutral",
        isContested && "state-contested",
        isWinning && "state-dominated-player",
        isLosing && "state-dominated-ai",
        canPlay ? "border-gold/60 ring-4 ring-gold/10 cursor-pointer scale-[1.02] z-20 shadow-[0_0_50px_rgba(255,215,0,0.2)]" : "border-white/5 bg-card/5 backdrop-blur-2xl"
      )}
    >
      {/* Cinematic Lighting Layers */}
      <div className="volumetric-fog" />
      <div className="living-shadows" />

      {/* Impact VFX Layer */}
      <AnimatePresence>
        {isImpacted && (
          <>
            <div className="impact-shockwave" />
            <div className="impact-smoke" />
            <div className="impact-symbol left-1/4 top-1/3">👁️</div>
            <div className="impact-symbol right-1/4 bottom-1/3">✨</div>
          </>
        )}
      </AnimatePresence>
      {/* Environmental Transformation Layer */}
      <div className={cn(
        "absolute inset-0 z-0 transition-opacity duration-1000",
        isWinning ? "env-transform-gold opacity-100" : isLosing ? "env-transform-blood opacity-100" : "opacity-0"
      )} />
      {/* Background Layer with Parallax & Particles */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Immersive Gradient Overlay */}
        <div className={cn("absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-black/90")} />
        
        {/* Parallax Background Art */}
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1, x: isWinning ? [-2, 2, -2] : 0 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="size-full bg-cover bg-center grayscale-[0.2]"
          style={{ backgroundImage: `url(${territory.id === 'memoria' ? '/territory_memoria_1778320602674.png' : ''})` }}
        />

        {/* Dynamic Particles Layer */}
        <div className="absolute inset-0 z-20 pointer-events-none opacity-40">
           {Array.from({ length: 12 }).map((_, i) => (
             <motion.div
               key={i}
               className={cn("absolute size-1 rounded-full blur-[1px]", meta.color.replace("text-", "bg-"))}
               animate={{ 
                 y: [-20, 500],
                 x: [Math.random() * 200, Math.random() * 200],
                 opacity: [0, 0.8, 0],
                 scale: [0, 1, 0]
               }}
               transition={{ 
                 duration: 10 + Math.random() * 10,
                 repeat: Infinity,
                 delay: Math.random() * 10
               }}
               style={{ left: `${Math.random() * 100}%`, top: `-10%` }}
             />
           ))}
        </div>
      </div>

      {/* Header Info - Premium Typography */}
      <div className="p-5 text-center relative z-30">
        <motion.div 
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="flex flex-col items-center gap-1.5"
        >
           <span className="text-2xl filter drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">{meta.icon}</span>
           <h4 className={cn("font-display text-[11px] uppercase tracking-[0.4em] font-black drop-shadow-2xl", meta.color)}>{territory.name}</h4>
           <div className="w-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
           <p className="text-[7px] text-white/50 leading-relaxed font-sans max-w-[80px] mt-1">{territory.rule}</p>
        </motion.div>
      </div>

      {/* Battlefield Grid - High-End Stacked Layout */}
      <div className="flex-1 flex flex-col px-1 py-1 gap-2 relative z-30 justify-between">
        {/* Opponent Stack */}
        <div className="relative h-[40%] flex justify-center items-start pt-2">
          {cards.filter(c => c.side === "ai").map((c, i) => (
            <motion.div 
              key={c.uid} 
              layoutId={c.uid} 
              initial={{ scale: 0.5, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1, x: i * 8, y: i * 4 }}
              className="absolute first:relative"
              style={{ zIndex: i }}
            >
              <CardFromId id={c.cardId} size="xs" noInspect />
            </motion.div>
          ))}
        </div>

        {/* Player Stack */}
        <div className="relative h-[40%] flex justify-center items-end pb-2">
          {cards.filter(c => c.side === "player").map((c, i) => (
            <motion.div 
              key={c.uid} 
              layoutId={c.uid} 
              initial={{ scale: 0.5, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1, x: i * 8, y: -i * 4 }}
              className="absolute first:relative"
              style={{ zIndex: i }}
            >
              <CardFromId id={c.cardId} size="xs" noInspect glow={isWinning} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dramatic Power Numbers - Integrated for Density */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 z-50 pointer-events-none flex flex-col items-center gap-6">
          <PowerCounter value={aiPower} isWinning={aiPower > playerPower} isAIPower />
          <div className="h-px w-4 bg-white/10" />
          <PowerCounter value={playerPower} isWinning={isWinning} />
      </div>
    </motion.div>
  );
}
