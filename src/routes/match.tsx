import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { useGame, TERRITORIES } from "@/game/store";
import { cardsById, TerritoryId } from "@/game/cards";
import { GameCard, CardBack, CardFromId } from "@/components/GameCard";
import { FocusGems, Hexagon, MobileFrame } from "@/components/Common";
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
                  onClick={() => endTurn()}
                  className="relative group overflow-hidden rounded-full p-px bg-gradient-to-r from-mystic via-gold to-mystic shadow-[0_0_30px_-5px_rgba(255,215,0,0.4)] transition-transform active:scale-95"
                >
                  <div className="px-8 py-6 rounded-full bg-abyss flex flex-col items-center justify-center ring-1 ring-gold/20 group-hover:bg-card/40 transition-colors">
                    <span className="font-display text-base uppercase tracking-[0.2em] text-gold group-hover:text-foreground">FINE</span>
                    <span className="font-display text-base uppercase tracking-[0.2em] text-gold group-hover:text-foreground -mt-1">TURNO</span>
                  </div>
                </button>

                <div className="flex flex-col items-center">
                  <Hourglass className="h-4 w-4 text-gold/40 mb-1" />
                  <span className="font-display text-sm text-gold">1:12</span>
                  <span className="text-[7px] uppercase text-muted-foreground">Tempo</span>
                </div>
             </div>
          </div>

          {/* Hand Cards */}
          <div className="flex justify-center -space-x-6 px-10">
            {match.hand.player.map((id, i) => (
              <motion.div
                key={`${id}-${i}`}
                initial={{ y: 50, opacity: 0, rotate: (i - 2) * 5 }}
                animate={{ y: 0, opacity: 1, rotate: (i - 2) * 5 }}
                whileHover={{ y: -40, rotate: 0, zIndex: 50, scale: 1.1 }}
                onClick={() => setSelected(selected === id ? null : id)}
                className={cn(
                  "relative cursor-pointer transition-all",
                  selected === id ? "-translate-y-12 z-50 scale-110" : ""
                )}
              >
                <CardFromId 
                  id={id} 
                  size="md" 
                  selected={selected === id}
                  faded={cardsById[id]?.cost > match.focus.player}
                />
                {selected === id && (
                  <motion.div layoutId="selection-glow" className="absolute -inset-4 rounded-2xl bg-mystic-glow/20 blur-xl -z-10" />
                )}
              </motion.div>
            ))}
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
    <div className={cn("flex items-center gap-4", side === "player" ? "flex-row" : "flex-row")}>
      <div className="relative group">
        {/* Outer Hexagon Glow */}
        <div className="absolute -inset-1 bg-gradient-to-br from-mystic via-gold to-mystic rounded-2xl blur-md opacity-40 group-hover:opacity-100 transition-opacity" />
        <div className="relative size-16 flex items-center justify-center bg-abyss ring-2 ring-gold/40 shadow-2xl rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-abyss via-transparent to-transparent opacity-60 z-10" />
          <Ghost className="h-8 w-8 text-gold/20" />
          {/* HP Badge */}
          <div className="absolute -bottom-1 -right-1 z-20">
             <div className="size-8 rotate-45 bg-rose ring-2 ring-gold/60 flex items-center justify-center shadow-lg">
                <span className="-rotate-45 font-display text-sm text-foreground">{hp}</span>
             </div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-display text-sm tracking-[0.2em] text-foreground leading-tight">{name}</h3>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">{sub}</p>
        <div className="flex gap-1.5">
           {Array.from({ length: maxFocus }).map((_, i) => (
             <div 
               key={i} 
               className={cn(
                 "size-2.5 rotate-45 transition-all duration-500",
                 i < focus 
                   ? "bg-mystic shadow-[0_0_10px_var(--mystic-glow)] ring-1 ring-gold/40" 
                   : "bg-abyss ring-1 ring-white/10"
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
  
  return (
    <div 
      className={cn(
        "flex-1 flex flex-col rounded-3xl relative overflow-hidden ring-1 transition-all",
        canPlay ? "ring-gold shadow-[inset_0_0_40px_rgba(255,215,0,0.15)] animate-pulse cursor-pointer" : "ring-white/10 bg-card/20 backdrop-blur-sm"
      )}
      onClick={onDrop}
    >
      {/* Background Graphic */}
      <div className="absolute inset-0 -z-10 opacity-40 pointer-events-none" style={{ backgroundColor: meta.bg }}>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl opacity-10">{meta.icon}</div>
      </div>
      
      {/* Header */}
      <div className={cn("p-4 border-b border-white/5 bg-gradient-to-b", meta.gradient)}>
         <h4 className={cn("font-display text-[10px] uppercase tracking-[0.3em] text-center", meta.color)}>{territory.name}</h4>
         <p className="text-[8px] text-muted-foreground text-center line-clamp-1 mt-1">{territory.rule}</p>
      </div>

      {/* Opponent Area */}
      <div className="flex-1 p-2 flex flex-col gap-2 items-center justify-start overflow-y-auto">
         {cards.filter(c => c.side === "ai").map(c => (
           <motion.div key={c.uid} initial={{ scale: 0, y: -20 }} animate={{ scale: 1, y: 0 }}>
             <CardFromId id={c.cardId} size="xs" />
           </motion.div>
         ))}
         {cards.filter(c => c.side === "ai").length === 0 && (
           <div className="size-16 rounded-xl border border-dashed border-white/10 flex items-center justify-center opacity-20">
             <Ghost className="h-6 w-6" />
           </div>
         )}
      </div>

      {/* Score Divider */}
      <div className="py-2 flex items-center justify-center gap-4 relative">
         <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
         <div className="relative z-10 flex flex-col items-center">
            <span className="text-[8px] uppercase text-muted-foreground tracking-widest">Tu</span>
            <div className={cn("font-display text-xl", playerPower > aiPower ? "text-gold glow-gold" : "text-foreground")}>{playerPower}</div>
         </div>
         <div className="relative z-10 flex flex-col items-center">
            <span className="text-[8px] uppercase text-muted-foreground tracking-widest">Avv.</span>
            <div className={cn("font-display text-xl", aiPower > playerPower ? "text-rose" : "text-muted-foreground")}>{aiPower}</div>
         </div>
      </div>

      {/* Player Area */}
      <div className="flex-1 p-2 flex flex-col-reverse gap-2 items-center justify-start overflow-y-auto">
         {cards.filter(c => c.side === "player").map(c => (
           <motion.div key={c.uid} initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }}>
             <CardFromId id={c.cardId} size="xs" glow={playerPower > aiPower} />
           </motion.div>
         ))}
         {cards.filter(c => c.side === "player").length === 0 && (
           <div className="size-16 rounded-xl border border-dashed border-white/10 flex items-center justify-center opacity-20">
             <Play className="h-6 w-6 rotate-90" />
           </div>
         )}
      </div>
    </div>
  );
}
