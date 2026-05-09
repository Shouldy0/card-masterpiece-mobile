import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { useGame, TERRITORIES } from "@/game/store";
import { cardsById, TerritoryId } from "@/game/cards";
import { GameCard, CardBack, CardFromId } from "@/components/GameCard";
import { FocusGems, Hexagon, MobileFrame } from "@/components/Common";
import { sounds } from "@/utils/audio";
import { Hourglass, Settings, Eye, Ghost, Zap, Trophy, Play, CheckCircle2, RefreshCw, Calendar, Users, Loader2, PlayCircle, Skull, ShieldCheck, Sparkles } from "lucide-react";
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
             <button onClick={() => navigate({ to: "/settings" })} className="size-10 rounded-lg bg-card/40 ring-1 ring-gold/20 flex items-center justify-center backdrop-blur-md hover:bg-card/60 transition-colors relative">
               <Settings className="h-5 w-5 text-gold/60" />
               <SyncIndicator />
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
          <div className="mx-6 mb-3 rounded-xl bg-card/30 ring-1 ring-gold/15 backdrop-blur-sm px-3 py-2">
            <p className="text-[8px] uppercase tracking-[0.25em] text-gold/60 mb-1">Cronaca</p>
            <div className="space-y-1">
              {recentLog.map((entry, idx) => (
                <p key={`${entry}-${idx}`} className="text-[9px] text-foreground/80 leading-tight">
                  {entry}
                </p>
              ))}
            </div>
          </div>
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
                    zIndex: selected === id ? 100 : i,
                    scale: selected === id ? 1.2 : 1
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20 
                  }}
                  whileHover={{ 
                    y: -110, 
                    rotate: 0, 
                    scale: 1.4,
                    zIndex: 150,
                    transition: { duration: 0.25, ease: "easeOut" }
                  }}
                  onClick={() => handleSelect(id)}
                  className={cn(
                    "relative cursor-pointer -mx-4 transition-shadow",
                    selected === id && "z-[100]"
                  )}
                >
                  <CardFromId 
                    id={id} 
                    size="sm" 
                    selected={selected === id}
                    noInspect={true}
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
      onClick={onDrop}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "flex-1 relative flex flex-col rounded-[2.5rem] overflow-hidden border transition-all duration-700",
        canPlay ? "border-gold/60 ring-4 ring-gold/10 cursor-pointer scale-[1.02] z-20 shadow-[0_0_50px_rgba(255,215,0,0.2)]" : "border-white/5 bg-card/5 backdrop-blur-2xl",
        isWinning && cards.length > 0 ? "border-gold/40 shadow-[inset_0_0_60px_rgba(255,215,0,0.1)]" : ""
      )}
    >
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

      {/* Battlefield Grid - High-End Slots */}
      <div className="flex-1 flex flex-col px-2 py-2 gap-4 relative z-30">
        <div className="grid grid-cols-2 gap-2 place-items-center auto-rows-min h-[42%]">
          {cards.filter(c => c.side === "ai").map((c) => (
            <motion.div key={c.uid} layoutId={c.uid} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <CardFromId id={c.cardId} size="xs" noInspect />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 place-items-center auto-rows-min h-[42%] mt-auto">
          {cards.filter(c => c.side === "player").map((c) => (
            <motion.div key={c.uid} layoutId={c.uid} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <CardFromId id={c.cardId} size="xs" noInspect glow={isWinning} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Concept Scores - Enhanced Glassmorphism */}
      <div className="p-4 bg-gradient-to-t from-black via-black/80 to-transparent relative z-40">
        <div className="flex justify-around items-end gap-1">
          <div className="flex flex-col items-center group">
            <motion.span 
              key={playerPower}
              initial={{ scale: 0.8 }} animate={{ scale: 1 }}
              className={cn("font-display text-2xl drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]", isWinning ? "text-gold font-black scale-110" : "text-white/30")}
            >
              {playerPower}
            </motion.span>
            <span className="text-[6px] uppercase tracking-[0.2em] text-white/20 mt-1">IL TUO POTERE</span>
          </div>
          
          <div className="h-6 w-px bg-white/5 mx-1" />

          <div className="flex flex-col items-center">
            <motion.span 
              key={aiPower}
              initial={{ scale: 0.8 }} animate={{ scale: 1 }}
              className={cn("font-display text-xl", aiPower > playerPower ? "text-rose font-black scale-105" : "text-white/20")}
            >
              {aiPower}
            </motion.span>
            <span className="text-[6px] uppercase tracking-[0.2em] text-white/10 mt-1">AVVERSARIO</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SyncIndicator() {
  const status = useGame(s => s.syncStatus);
  if (status === "idle") return null;

  return (
    <div className="absolute -top-1 -right-1 flex items-center justify-center">
      {status === "syncing" && <RefreshCw className="h-3 w-3 text-gold animate-spin" />}
      {status === "saved" && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
      {status === "error" && <Skull className="h-3 w-3 text-rose" />}
    </div>
  );
}
