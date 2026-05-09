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
      <div className="relative z-10 flex h-full flex-col p-4">
        {/* Concept Header: Top Row */}
        <div className="flex justify-between items-start mb-6">
           <div className="flex items-center gap-4">
             <HexAvatar side="ai" hp={match.hp.ai} name="OMBRA NASCOSTA" sub="Coscienza Errante" />
             <div className="flex flex-col gap-1.5 pt-2">
                <div className="flex gap-1">
                  {Array.from({ length: match.maxFocus }).map((_, i) => (
                    <FocusDiamond key={i} active={i < match.focus.ai} />
                  ))}
                </div>
                <span className="text-[8px] text-white/30 uppercase tracking-[0.2em] font-black">Focus Opponente</span>
             </div>
           </div>

           <div className="flex gap-4">
             <div className="flex items-center gap-1.5 rounded-full bg-card/40 px-4 py-2 ring-1 ring-white/10 backdrop-blur-md shadow-2xl">
               <Skull className="h-4 w-4 text-rose" />
               <span className="font-display text-sm text-gold">2</span>
             </div>
             <div className="flex items-center gap-1.5 rounded-full bg-card/40 px-4 py-2 ring-1 ring-white/10 backdrop-blur-md shadow-2xl">
               <ShieldCheck className="h-4 w-4 text-azure" />
               <span className="font-display text-sm text-gold">15</span>
             </div>
             <button onClick={() => navigate({ to: "/settings" })} className="size-10 rounded-full bg-card/40 ring-1 ring-white/10 flex items-center justify-center backdrop-blur-md hover:bg-card/60 transition-colors">
               <Settings className="h-5 w-5 text-gold/60" />
             </button>
           </div>
        </div>

        {/* Central Combat Area */}
        <div className="flex-1 flex gap-3 min-h-0">
          {/* Territories */}
          <div className="flex-1 flex gap-3">
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

          {/* Right Sidebar - Concept Style */}
          <div className="w-24 flex flex-col items-center justify-center gap-12">
             {/* Turn Info */}
             <div className="flex flex-col items-center text-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black">Turno</span>
                <span className="font-display text-2xl text-gold">{match.turn}/{match.maxTurns}</span>
                <div className="flex flex-col gap-2 mt-2">
                  <PhaseIndicator active={true} label="Fase Gioco" />
                  <PhaseIndicator active={false} label="Rivelazione" />
                  <PhaseIndicator active={false} label="Fine Turno" />
                </div>
             </div>

             {/* Concept End Turn Button */}
             <button 
               onClick={handleEndTurn}
               className="relative group size-20"
             >
                <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl animate-pulse group-hover:bg-gold/40" />
                <div className="absolute inset-0 rounded-full border-2 border-gold/40 ring-4 ring-gold/10" />
                <div className="relative size-full rounded-full bg-gradient-to-br from-mystic via-abyss to-mystic flex flex-col items-center justify-center border border-white/10">
                   <span className="font-display text-[9px] uppercase tracking-widest text-gold leading-none">FINE</span>
                   <span className="font-display text-[9px] uppercase tracking-widest text-gold leading-none mt-1">TURNO</span>
                </div>
             </button>

             {/* Time counter */}
             <div className="flex flex-col items-center gap-1 opacity-60">
                <Hourglass className="size-4 text-gold/40" />
                <span className="font-display text-sm text-gold">1:12</span>
             </div>
          </div>
        </div>

        {/* Footer: Hand & Player Info */}
        <div className="mt-6 flex items-end justify-between">
           <div className="flex items-center gap-6">
             <HexAvatar side="player" hp={match.hp.player} name="DREAMER" sub="Risvegliata" />
             <div className="flex flex-col gap-1.5 pb-2">
                <div className="flex gap-1">
                  {Array.from({ length: match.maxFocus }).map((_, i) => (
                    <FocusDiamond key={i} active={i < match.focus.player} />
                  ))}
                </div>
                <span className="text-[8px] text-white/30 uppercase tracking-[0.2em] font-black">Il tuo Focus</span>
             </div>
           </div>

           {/* Hand Area - Centered & Fanned */}
           <div className="flex-1 flex justify-center items-end px-12 -mb-2">
              <div className="flex justify-center -space-x-8">
                {match.hand.player.map((id, i) => {
                  const total = match.hand.player.length;
                  const rotation = (i - (total-1)/2) * 6;
                  return (
                    <motion.div
                      key={`${id}-${i}`}
                      whileHover={{ y: -100, scale: 1.5, rotate: 0, zIndex: 100 }}
                      onClick={() => handleSelect(id)}
                      className={cn("relative cursor-pointer transition-all", selected === id && "z-50 -translate-y-12 scale-125")}
                      style={{ rotate: `${rotation}deg` }}
                    >
                      <CardFromId id={id} size="sm" noInspect selected={selected === id} faded={cardsById[id]?.cost > match.focus.player} />
                    </motion.div>
                  );
                })}
              </div>
           </div>

           {/* Deck & Stats */}
           <div className="flex flex-col items-end gap-3">
              <div className="relative group cursor-help">
                 <div className="absolute -inset-1 bg-gold/20 blur opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                 <div className="relative bg-card/60 backdrop-blur-md rounded-xl p-3 ring-1 ring-white/10 flex items-center gap-3">
                    <CardBack size="xs" />
                    <span className="font-display text-2xl text-gold">{match.deck.player.length}</span>
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
