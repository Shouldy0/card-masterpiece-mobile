import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { useGame, TERRITORIES } from "@/game/store";
import { cardsById, TerritoryId } from "@/game/cards";
import { GameCard, CardBack, CardFromId } from "@/components/GameCard";
import { FocusGems, Hexagon, MobileFrame } from "@/components/Common";
import { sounds } from "@/utils/audio";
import { Hourglass, Settings, Eye, Ghost, Zap, Trophy, Play, CheckCircle2, RefreshCw, Calendar, Users, Loader2, PlayCircle, Skull, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSound } from "@/hooks/useSound";

export const Route = createFileRoute("/match")({ component: Match });

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
  const match = useGame((s) => s.match);
  const playCard = useGame((s) => s.playCard);
  const endTurn = useGame((s) => s.endTurn);
  const startMatch = useGame((s) => s.startMatch);
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [revealing, setRevealing] = useState<{ uid: string; territory: TerritoryId } | null>(null);
  const { play } = useSound();

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
    if (!card || card.cost > match.focus.player) { setSelected(null); return; }
    setRevealing({ uid: selected, territory });
    play("card_flip");
    setTimeout(() => {
      playCard(selected, territory);
      setRevealing(null);
      setSelected(null);
    }, 900);
  };

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-abyss text-foreground font-serif">
      {/* Background Nebula */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 -left-1/4 size-[800px] bg-mystic-glow/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 -right-1/4 size-[800px] bg-rose/10 blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Main Layout */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Header: Opponent Info */}
        <div className="px-6 pt-6 flex justify-between items-start">
           <PlayerAvatar side="ai" name="OMBRA NASCOSTA" sub="Coscienza Errante" hp={match.hp.ai} focus={match.focus.ai} maxFocus={match.maxFocus} />
           <div className="flex gap-4 items-center">
             <div className="flex gap-2">
               <div className="flex items-center gap-1.5 rounded-lg bg-card/40 px-3 py-1.5 ring-1 ring-gold/20 backdrop-blur-md">
                 <Skull className="h-4 w-4 text-rose" />
                 <span className="font-display text-sm text-gold">2</span>
               </div>
               <div className="flex items-center gap-1.5 rounded-lg bg-card/40 px-3 py-1.5 ring-1 ring-gold/20 backdrop-blur-md">
                 <ShieldCheck className="h-4 w-4 text-azure" />
                 <span className="font-display text-sm text-gold">15</span>
               </div>
             </div>
             <button onClick={() => navigate({ to: "/settings" })} className="size-10 rounded-lg bg-card/40 ring-1 ring-gold/20 flex items-center justify-center backdrop-blur-md hover:bg-card/60 transition-colors">
               <Settings className="h-5 w-5 text-gold/60" />
             </button>
           </div>
        </div>

        <div className="flex justify-center -space-x-4 mt-2">
          {Array.from({ length: match.hand.ai.length }).map((_, i) => (
             <motion.div key={i} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}>
               <CardBack size="sm" />
             </motion.div>
          ))}
        </div>

        {/* Battlefield: 3 Territories */}
        <div className="flex-1 flex gap-2 px-4 py-4 mt-2">
          {TERRITORIES.map((t) => (
            <TerritoryColumn
              key={t.id}
              territory={t}
              cards={match.board[t.id]}
              onDrop={() => handlePlay(t.id)}
              canPlay={!!selected}
            />
          ))}
        </div>

        {/* Footer Area */}
        <div className="relative pb-6 pt-2">
          <div className="px-6 flex justify-between items-end mb-4">
             <PlayerAvatar side="player" name="DREAMER" sub="Risvegliata" hp={match.hp.player} focus={match.focus.player} maxFocus={match.maxFocus} />
             
             {/* Phase Indicator & End Turn */}
             <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Turno {match.turn}/{match.maxTurns}</p>
                  <div className="flex flex-col gap-1 items-end">
                    <div className="flex items-center gap-2">
                      <div className="size-1.5 rounded-full bg-gold shadow-[0_0_8px_var(--gold)]" />
                      <span className="text-[10px] uppercase tracking-tighter text-foreground">Fase Gioco</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-40">
                      <div className="size-1.5 rounded-full bg-muted-foreground" />
                      <span className="text-[10px] uppercase tracking-tighter text-muted-foreground">Rivelazione</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleEndTurn}
                  className="relative group overflow-hidden rounded-full p-px bg-gradient-to-r from-mystic via-gold to-mystic shadow-[0_0_20px_-5px_rgba(255,215,0,0.4)] transition-transform active:scale-95"
                >
                  <div className="px-6 py-4 rounded-full bg-abyss flex flex-col items-center justify-center ring-1 ring-gold/20 group-hover:bg-card/40 transition-colors">
                    <span className="font-display text-[10px] uppercase tracking-[0.2em] text-gold group-hover:text-foreground leading-none">FINE</span>
                    <span className="font-display text-[10px] uppercase tracking-[0.2em] text-gold group-hover:text-foreground leading-none">TURNO</span>
                  </div>
                </button>

                <div className="flex flex-col items-center">
                  <Hourglass className="h-4 w-4 text-gold/40 mb-1" />
                  <span className="font-display text-sm text-gold">1:12</span>
                  <span className="text-[7px] uppercase text-muted-foreground">Tempo</span>
                </div>
             </div>
          </div>

          {/* Hand Cards with Curved Fan Layout */}
          <div className="flex justify-center h-32 px-4 relative mt-4">
            {match.hand.player.map((id, i) => {
              const totalCards = match.hand.player.length;
              const middleIndex = (totalCards - 1) / 2;
              const offset = i - middleIndex;
              const rotation = offset * 8;
              const translateY = Math.abs(offset) * 8;
              const translateX = offset * 2;

              return (
                <motion.div
                  key={`${id}-${i}`}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ 
                    y: selected === id ? -80 : translateY, 
                    x: selected === id ? 0 : translateX,
                    opacity: 1, 
                    rotate: selected === id ? 0 : rotation,
                    zIndex: selected === id ? 100 : i 
                  }}
                  whileHover={{ 
                    y: -100, 
                    rotate: 0, 
                    scale: 1.3,
                    zIndex: 100,
                    transition: { duration: 0.2 }
                  }}
                  onClick={() => handleSelect(id)}
                  className={cn(
                    "relative cursor-pointer -mx-4 transition-shadow",
                    selected === id && "z-[100]"
                  )}
                >
                  <CardFromId 
                    id={id} 
                    size="md" 
                    selected={selected === id}
                    faded={cardsById[id]?.cost > match.focus.player}
                  />
                  {selected === id && (
                    <motion.div layoutId="selection-glow" className="absolute -inset-8 rounded-3xl bg-gold/20 blur-2xl -z-10" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Deck pile */}
          <div className="absolute right-8 bottom-12 flex flex-col items-center gap-1 opacity-80">
             <div className="relative">
               <CardBack size="xs" />
               <div className="absolute inset-0 flex items-center justify-center bg-abyss/60 backdrop-blur-[2px] rounded-lg">
                 <span className="font-display text-lg text-gold">{match.deck.player.length}</span>
               </div>
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

function PlayerAvatar({ side, name, sub, hp, focus, maxFocus }: { side: "player" | "ai"; name: string; sub: string; hp: number; focus: number; maxFocus: number }) {
  return (
    <div className={cn("flex items-center gap-5", side === "ai" ? "flex-row-reverse text-right" : "flex-row")}>
      <div className="relative group">
        {/* Ornate Frame */}
        <div className="absolute -inset-2 bg-gradient-to-br from-gold/40 via-mystic/40 to-gold/40 rounded-full blur-sm opacity-50 animate-spin-slow" />
        <div className="relative size-14 flex items-center justify-center bg-black ring-2 ring-gold/60 shadow-[0_0_30px_rgba(255,215,0,0.2)] rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-mystic/40 via-transparent to-transparent z-10" />
          <img 
            src={side === "player" ? "https://api.dicebear.com/7.x/avataaars/svg?seed=Dreamer&backgroundColor=030617&mouth=smile" : "https://api.dicebear.com/7.x/avataaars/svg?seed=Shadow&backgroundColor=030617&eyes=closed"} 
            alt="Avatar"
            className="size-full object-cover scale-110"
          />
          {/* HP Badge */}
          <div className="absolute top-0 right-0 z-20">
             <div className="size-6 bg-rose ring-1 ring-white/20 flex items-center justify-center rounded-full shadow-lg">
                <span className="font-display text-[9px] text-white font-black">{hp}</span>
             </div>
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-xs tracking-[0.3em] text-gold uppercase">{name}</h3>
        <p className="text-[8px] text-white/40 uppercase tracking-[0.4em] font-sans">{sub}</p>
        <div className={cn("flex gap-1", side === "ai" ? "justify-end" : "justify-start")}>
           {Array.from({ length: maxFocus }).map((_, i) => (
             <motion.div 
               key={i} 
               initial={false}
               animate={{ 
                 scale: i < focus ? [1, 1.2, 1] : 1,
                 opacity: i < focus ? 1 : 0.2 
               }}
               className={cn(
                 "size-2 rotate-45 rounded-sm border border-white/20",
                 i < focus ? "bg-mystic shadow-[0_0_10px_#A855F7]" : "bg-white/5"
               )} 
             />
           ))}
        </div>
      </div>
    </div>
  );
}

function TerritoryColumn({ territory, cards, onDrop, canPlay }: { territory: typeof TERRITORIES[number]; cards: any[]; onDrop: () => void; canPlay: boolean }) {
  const meta = territoryMeta[territory.id];
  const playerPower = cards.filter((c) => c.side === "player").reduce((s, c) => s + c.power, 0);
  const aiPower = cards.filter((c) => c.side === "ai").reduce((s, c) => s + c.power, 0);
  const isWinning = playerPower > aiPower;
  
  return (
    <motion.div 
      whileHover={canPlay ? { scale: 1.02 } : {}}
      className={cn(
        "flex-1 flex flex-col rounded-3xl relative overflow-hidden border transition-all duration-500",
        canPlay ? "border-gold/60 shadow-[0_0_30px_rgba(255,215,0,0.2)] cursor-pointer" : "border-white/10 bg-card/10 backdrop-blur-md",
        isWinning && cards.length > 0 && "shadow-[inset_0_0_40px_rgba(255,215,0,0.05)]"
      )}
      onClick={onDrop}
    >
      {/* Dynamic Background Fog/Particles */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
         <div className="absolute inset-0 opacity-20" style={{ backgroundColor: meta.bg }} />
         <motion.div 
           animate={{ 
             opacity: [0.1, 0.3, 0.1],
             scale: [1, 1.2, 1],
             rotate: [0, 90, 0]
           }}
           transition={{ duration: 15, repeat: Infinity }}
           className={cn("absolute -top-1/2 -left-1/2 size-full blur-[80px]", meta.color.replace("text-", "bg-"))}
         />
      </div>

      {/* Territory Label */}
      <div className={cn("p-4 border-b border-white/5 bg-gradient-to-b relative overflow-hidden", meta.gradient)}>
         <h4 className={cn("font-display text-[11px] uppercase tracking-[0.4em] text-center font-black", meta.color)}>{territory.name}</h4>
         <p className="text-[8px] text-white/40 text-center line-clamp-1 mt-1 font-sans">{territory.rule}</p>
         
         {/* Animated Icon */}
         <motion.div 
           animate={{ y: [0, -4, 0], opacity: [0.2, 0.5, 0.2] }}
           transition={{ duration: 4, repeat: Infinity }}
           className="absolute top-2 right-2 text-lg"
         >
           {meta.icon}
         </motion.div>
      </div>

      {/* Opponent Area */}
      <div className="flex-1 p-2 flex flex-col gap-2 items-center justify-start overflow-y-auto pt-4">
         {cards.filter(c => c.side === "ai").map((c, i) => (
           <motion.div key={c.uid} initial={{ scale: 0, y: -40, rotate: -10 }} animate={{ scale: 1, y: 0, rotate: 0 }} transition={{ type: "spring", damping: 15 }}>
             <CardFromId id={c.cardId} size="xs" />
           </motion.div>
         ))}
      </div>

      {/* Master Score Display (CCC - Center Combat Component) */}
      <div className="py-4 flex items-center justify-center gap-6 relative">
         <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
         
         <div className="relative z-10 flex flex-col items-center group">
            <span className="text-[8px] uppercase text-white/40 tracking-[0.2em] font-black">PLAYER</span>
            <div className={cn(
              "font-display text-3xl transition-all duration-500",
              isWinning ? "text-gold scale-125 drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]" : "text-white/60"
            )}>
              {playerPower}
            </div>
            {isWinning && cards.length > 0 && (
              <motion.div layoutId={`win-crown-${territory.id}`} className="absolute -top-1 size-1 bg-gold rounded-full blur-[2px]" />
            )}
         </div>

         <div className="relative z-10 flex flex-col items-center">
            <span className="text-[8px] uppercase text-white/40 tracking-[0.2em] font-black">ENEMY</span>
            <div className={cn(
              "font-display text-2xl transition-all duration-500",
              aiPower > playerPower ? "text-rose scale-110" : "text-white/30"
            )}>
              {aiPower}
            </div>
         </div>
      </div>

      {/* Player Area */}
      <div className="flex-1 p-2 flex flex-col-reverse gap-2 items-center justify-start overflow-y-auto pb-4">
         {cards.filter(c => c.side === "player").map((c, i) => (
           <motion.div 
             key={c.uid} 
             initial={{ scale: 0, y: 40, rotate: 10 }} 
             animate={{ scale: 1, y: 0, rotate: 0 }} 
             transition={{ type: "spring", damping: 12 }}
             className="relative"
           >
             <CardFromId id={c.cardId} size="xs" glow={isWinning} />
             {isWinning && (
               <div className="absolute -inset-1 bg-gold/10 blur-sm rounded-lg -z-10 animate-pulse" />
             )}
           </motion.div>
         ))}
      </div>
      
      {/* Play Indicator Overlay */}
      {canPlay && (
        <div className="absolute inset-0 bg-gold/5 flex items-center justify-center pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="size-20 rounded-full border-2 border-gold/40 flex items-center justify-center"
          >
            <Zap className="text-gold size-8 fill-gold/20" />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
