import React, { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useComboGame, GameResult, getXpToNextLevel, getDailyLeaderboard } from "@/game/combo-store";
import { getRank, calculateRisk, getPotentialText } from "@/game/combo-cards";
import { Card, CardType } from "@/game/engine/types";
import { MobileFrame } from "@/components/Common";
import { CanvasBackground } from "@/components/CanvasBackground";
import { sounds } from "@/utils/audio";
import { ads } from "@/utils/ads";
import { Eye, Sparkles, Zap, ArrowLeft, Star, Trophy, RotateCcw, Play, CheckCircle2, RefreshCw, Calendar, Users, Ghost, Loader2, PlayCircle, Info } from "lucide-react";

// --- Design System Tokens ---
const UI_THEME = {
  glass: "bg-abyss/40 backdrop-blur-md ring-1 ring-gold/20",
  premium_btn: "rounded-2xl font-display text-xs uppercase tracking-[0.25em] transition-all active:scale-95",
  gold_glow: "shadow-[0_0_20px_rgba(255,215,0,0.2)]",
  text_h1: "font-display text-4xl tracking-[0.2em] gold-text",
  text_h2: "font-display text-lg tracking-[0.15em] text-foreground",
  text_caption: "text-[9px] uppercase tracking-widest text-muted-foreground/60",
};

const getCatMeta = (variant: any) => ({
  character: { label: variant.theme.labels.character, color: "text-mystic-glow", gradient: "from-mystic/40 to-abyss", bgGlow: "oklch(0.55 0.22 295 / 40%)" },
  setting: { label: variant.theme.labels.setting, color: "text-azure", gradient: "from-azure/30 to-abyss", bgGlow: "oklch(0.7 0.18 240 / 40%)" },
  action: { label: variant.theme.labels.action, color: "text-amber-eclipse", gradient: "from-amber-eclipse/30 to-abyss", bgGlow: "oklch(0.78 0.16 60 / 40%)" },
  modifier: { label: variant.theme.labels.modifier, color: "text-gold", gradient: "from-gold/20 to-abyss", bgGlow: "rgba(255, 215, 0, 0.4)" },
});

function ComboGame() {
  const store = useComboGame();
  const { phase, drawnCards, currentResult, rerollsLeft, highScore, startGame, reroll, keepCombo, resetAll, activeEvent, activeVariant } = store;
  const navigate = useNavigate();
  const [isPreloading, setIsPreloading] = useState(true);
  const [isShowingAd, setIsShowingAd] = useState(false);
  const [showShuffle, setShowShuffle] = useState(false);

  const catMeta = useMemo(() => getCatMeta(activeVariant), [activeVariant]);

  useEffect(() => {
    if (phase === "drawing") {
      setShowShuffle(true);
      sounds.play("shuffle");
      setTimeout(() => {
        setShowShuffle(false);
        sounds.play("draw");
      }, 600);
    }
    if (phase === "result") {
      if (store.lastResult && store.lastResult.scored.score >= store.highScore) sounds.play("record");
      else if (store.lastResult && store.lastResult.scored.stars >= 4) sounds.play("victory");
      else sounds.play("success");
    }
  }, [phase]);

  const handleActionWithAd = async (action: () => void) => {
    // Show ad if: achievement unlocked OR daily completed OR generic game over
    const shouldShowAd = store.lastResult?.leveledUp || 
                        (store.lastResult?.scored.stars ?? 0) >= 4 || 
                        store.isDailyMode;
    
    if (shouldShowAd) {
      setIsShowingAd(true);
      await ads.showInterstitial();
      setIsShowingAd(false);
    }
    action();
  };

  const handleRestart = () => {
    handleActionWithAd(() => startGame(store.isDailyMode));
  };

  const handleExit = () => {
    handleActionWithAd(() => {
      resetAll();
      navigate({ to: "/home" });
    });
  };

  if (isPreloading) return <Preloader onComplete={() => setIsPreloading(false)} />;
  if (phase === "result") return <ResultScreen result={store.lastResult} highScore={highScore} onRestart={handleRestart} onExit={handleExit} />;

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-abyss flex items-center justify-center font-serif select-none">
      {/* LAYER 1: BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <CanvasBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-abyss/20 via-transparent to-abyss/80 pointer-events-none" />
      </div>

      <AnimatePresence>
        {isShowingAd && <AdBreakOverlay />}
      </AnimatePresence>
      
      <MobileFrame className="w-full max-w-md h-full px-4 pb-8 pt-4 shadow-none ring-0 bg-transparent flex flex-col relative z-10 overflow-hidden">
        {/* LAYER 3: UI OVERLAY (HEADER) */}
        <header className="relative z-20 flex items-center justify-between h-12">
          <div className="flex items-center gap-3">
            <motion.div whileTap={{ scale: 0.9 }} onClick={() => { resetAll(); navigate({ to: "/home" }); }} className="p-2 rounded-full bg-card/20 ring-1 ring-gold/30 text-gold active:bg-card/40 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </motion.div>
            <div className="flex flex-col">
              <span className={UI_THEME.text_caption}>Livello {store.level}</span>
              <div className="w-20 h-1 bg-card/40 rounded-full mt-1 overflow-hidden">
                <motion.div className="h-full bg-gold" initial={{ width: 0 }} animate={{ width: `${(store.xp / getXpToNextLevel(store.level)) * 100}%` }} />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {store.isDailyMode && (
              <div className="flex items-center gap-1 rounded-full bg-amber-eclipse/20 px-3 py-1 ring-1 ring-amber-eclipse/40">
                <Calendar className="h-3 w-3 text-amber-eclipse" />
                <span className="font-display text-[9px] text-amber-eclipse uppercase tracking-widest font-bold">Daily</span>
              </div>
            )}
            <div className="flex items-center gap-2 rounded-2xl bg-card/30 px-3 py-2 ring-1 ring-gold/20 backdrop-blur-sm">
              <Trophy className="h-4 w-4 text-gold" />
              <span className="font-display text-sm text-foreground font-bold">{store.isDailyMode ? store.dailyHighScore : store.highScore}</span>
            </div>
          </div>
        </header>

        {/* LAYER 2: CARD LAYER & MAIN CONTENT */}
        <main className="relative flex-1 flex flex-col justify-center gap-4 z-10 py-6">
          <AnimatePresence mode="wait">
            {phase === "idle" && <StartOverlay onPlay={() => startGame(false)} onDaily={() => startGame(true)} store={store} />}
            
            {showShuffle && <DeckShuffle key="shuffle" />}
            
            {phase === "drawing" && !showShuffle && (
              <motion.div key="drawing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3">
                {[0, 1, 2].map((i) => <DrawingSlot key={i} index={i} />)}
              </motion.div>
            )}

            {phase === "decision" && drawnCards && (
              <motion.div key="cards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 w-full">
                {/* Event Banner (Part of Card Layer) */}
                {activeEvent && (
                  <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`w-full max-w-xs rounded-2xl ${UI_THEME.glass} p-3 text-center border-t-2 border-gold/40`}>
                    <div className={`font-display text-[10px] font-bold tracking-[0.3em] ${activeEvent.color}`}>{activeEvent.label}</div>
                    <div className="text-[8px] text-muted-foreground uppercase tracking-widest mt-0.5">{activeEvent.description}</div>
                  </motion.div>
                )}

                <div className="space-y-3 w-full flex flex-col items-center">
                  {drawnCards.map((card, i) => <DrawnCard key={card.id} card={card} index={i} variant={activeVariant} />)}
                </div>

                {/* Feedback Area */}
                {currentResult && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xs mt-2 text-center space-y-4">
                    {/* Synergy Meter */}
                    <div className="space-y-1.5">
                       <div className="flex justify-between items-center px-1">
                          <span className={UI_THEME.text_caption}>Risonanza Onirica</span>
                          <span className="text-[10px] font-display text-gold font-bold">{currentResult.synergyLevel}%</span>
                       </div>
                       <div className="h-2 w-full bg-card/60 rounded-full overflow-hidden ring-1 ring-gold/10">
                          <motion.div className="h-full bg-gradient-to-r from-mystic via-gold to-mystic" initial={{ width: 0 }} animate={{ width: `${currentResult.synergyLevel}%` }} transition={{ type: "spring", bounce: 0.2 }} />
                       </div>
                    </div>

                    <div className="flex flex-col gap-1 items-center">
                       <h3 className={`${UI_THEME.text_h2} ${currentResult.stars >= 4 ? "gold-text" : "text-foreground"}`}>{currentResult.title}</h3>
                       <div className="flex gap-2">
                         {currentResult.penalties.map(p => <span key={p} className="text-[8px] font-bold text-rose uppercase tracking-widest px-2 py-0.5 bg-rose/10 rounded-full ring-1 ring-rose/30 animate-pulse">{p}</span>)}
                         {currentResult.bonuses.slice(0, 1).map(b => <span key={b} className="text-[8px] font-bold text-gold uppercase tracking-widest px-2 py-0.5 bg-gold/10 rounded-full ring-1 ring-gold/30">{b}</span>)}
                       </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* LAYER 3: UI OVERLAY (FOOTER ACTIONS) */}
        <footer className="relative z-20 flex flex-col items-center gap-3 h-32 justify-end">
          {phase === "decision" && (
            <>
              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
                onClick={() => { sounds.play("lock"); keepCombo(); }}
                className={`${UI_THEME.premium_btn} w-full max-w-xs py-5 bg-gradient-to-r from-gold via-amber-eclipse to-gold text-abyss font-bold shadow-2xl ring-2 ring-gold/50`}
              >
                CONFERMA VISIONE
              </motion.button>
              
              <button 
                disabled={rerollsLeft <= 0} 
                onClick={() => { sounds.play("reroll"); reroll(); }}
                className={`${UI_THEME.premium_btn} w-full max-w-xs py-3 border border-gold/30 text-gold/60 flex items-center justify-center gap-2 disabled:opacity-20`}
              >
                <RefreshCw className={`h-4 w-4 ${rerollsLeft > 0 ? "animate-spin-slow" : ""}`} />
                RERROLL ({rerollsLeft})
              </button>
            </>
          )}
        </footer>
      </MobileFrame>
    </div>
  );
}

function StartOverlay({ onPlay, onDaily, store }: { onPlay: () => void; onDaily: () => void; store: any }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center text-center px-4 w-full">
      <h1 className={UI_THEME.text_h1}>REVERIE</h1>
      <p className={`${UI_THEME.text_caption} mt-2 mb-8`}>Sintonizza la tua coscienza</p>
      
      <div className="w-full max-w-xs space-y-4">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onPlay} className={`${UI_THEME.premium_btn} w-full py-5 gold-frame bg-gradient-to-r from-mystic to-mystic-glow text-foreground text-lg shadow-2xl`}>
          ENTRA NEL SOGNO
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onDaily} className={`${UI_THEME.premium_btn} w-full py-3 border border-amber-eclipse/40 text-amber-eclipse text-[10px]`}>
          SFIDA QUOTIDIANA
        </motion.button>
      </div>

      {/* Mini Leaderboard */}
      <div className="mt-12 w-full max-w-[280px] p-4 rounded-3xl bg-card/20 ring-1 ring-gold/10 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3 border-b border-gold/5 pb-2">
          <Users className="h-3 w-3 text-gold/40" />
          <span className="text-[8px] uppercase tracking-widest text-gold/40">Sognatori Recenti</span>
        </div>
        <div className="space-y-2">
          {getDailyLeaderboard(new Date().getDate()).slice(0, 3).map((e, i) => (
            <div key={i} className="flex justify-between text-[10px] items-center">
              <span className="text-muted-foreground/60">#{i+1} {e.name}</span>
              <span className="font-display text-gold/60">{e.score}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function DrawnCard({ card, index, variant }: { card: Card; index: number; variant: any }) {
  const meta = getCatMeta(variant);
  const m = meta[card.type as keyof typeof meta] || meta.character;
  const rarityStyles: Record<string, string> = { 
    common: "ring-white/10", 
    rare: "ring-azure/30 shadow-[0_0_20px_rgba(100,200,255,0.1)]", 
    epic: "ring-mystic/40 shadow-[0_0_25px_rgba(200,100,255,0.15)]", 
    legendary: `ring-${variant.theme.primaryColor}/50 shadow-[0_0_40px_rgba(255,215,0,0.2)]` 
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -30, rotateX: 45 }} 
      animate={{ opacity: 1, x: 0, rotateX: 0 }} 
      transition={{ delay: index * 0.15, type: "spring", damping: 15 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full max-w-xs rounded-3xl bg-gradient-to-br ${m.gradient} p-4 ring-1 ${rarityStyles[card.rarity]} overflow-hidden shadow-xl flex items-center gap-4`}
    >
      <div className="size-12 flex items-center justify-center rounded-2xl bg-abyss/60 text-2xl shadow-inner border border-gold/10">
        {card.icon}
      </div>
      <div className="flex-1 text-left min-w-0">
        <div className="flex items-center justify-between">
          <span className={`text-[8px] font-bold uppercase tracking-widest ${m.color}`}>{m.label}</span>
          <span className="text-[8px] font-display text-gold/60 capitalize">{card.rarity}</span>
        </div>
        <h4 className="font-display text-base text-foreground truncate tracking-wide mt-0.5">{card.name}</h4>
      </div>
    </motion.div>
  );
}

function DrawingSlot({ index }: { index: number }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }} className="w-full max-w-xs h-20 rounded-2xl bg-card/20 border border-gold/10 flex items-center justify-center">
      <Loader2 className="h-6 w-6 text-gold/20 animate-spin" />
    </motion.div>
  );
}

function ResultScreen({ result, highScore, onRestart, onExit }: { result: GameResult | null; highScore: number; onRestart: () => void; onExit: () => void }) {
  if (!result) return null;
  const store = useComboGame();
  const { rank, color } = getRank(result.scored.score);
  const xpPct = (store.xp / getXpToNextLevel(store.level)) * 100;

  return (
    <div className="relative h-[100dvh] w-screen bg-abyss flex items-center justify-center p-6">
      <CanvasBackground />
      <MobileFrame className="w-full max-w-md h-full bg-transparent flex flex-col items-center justify-center text-center gap-8 relative z-10">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="size-48 relative flex items-center justify-center rounded-full bg-card/20 ring-4 ring-gold/20 shadow-2xl backdrop-blur-md">
          <span className={`font-display text-9xl font-bold ${color}`}>{rank}</span>
          <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0, 0.4, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -inset-8 rounded-full border-2 border-gold/20" />
        </motion.div>
        
        <div className="space-y-2">
          <p className={UI_THEME.text_caption}>Risultato Finale</p>
          <h1 className="font-display text-8xl gold-text">{result.scored.score}</h1>
        </div>

        <div className="w-full max-w-xs space-y-4">
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-gold/60">
            <span>Livello {store.level}</span>
            <span>+{result.xpEarned} XP</span>
          </div>
          <div className="h-2 w-full bg-card/40 rounded-full overflow-hidden ring-1 ring-gold/10">
            <motion.div className="h-full bg-gold" initial={{ width: 0 }} animate={{ width: `${xpPct}%` }} transition={{ duration: 1.5 }} />
          </div>
        </div>

        <div className="w-full max-w-xs grid grid-cols-2 gap-3">
          <div className="bg-card/20 p-4 rounded-3xl ring-1 ring-gold/10"><p className="text-2xl font-display text-gold">{result.scored.stars}</p><p className={UI_THEME.text_caption}>Stelle</p></div>
          <div className="bg-card/20 p-4 rounded-3xl ring-1 ring-gold/10"><p className="text-2xl font-display text-mystic-glow">{result.rerollsUsed}</p><p className={UI_THEME.text_caption}>Rerolls</p></div>
        </div>

        <div className="w-full max-w-xs flex flex-col gap-4">
          <button onClick={onRestart} className={`${UI_THEME.premium_btn} py-5 bg-gold text-abyss font-bold shadow-xl`}>RIPROVA</button>
          <button onClick={onExit} className={UI_THEME.text_caption}>Esci alla Home</button>
        </div>
      </MobileFrame>
    </div>
  );
}

function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isExiting, setIsExiting] = useState(false);

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    const x = "clientX" in e ? e.clientX : e.touches[0].clientX;
    const y = "clientY" in e ? e.clientY : e.touches[0].clientY;
    
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 1500);

    if (!hasInteracted) {
      setHasInteracted(true);
      sounds.startAmbient();
    } else {
      sounds.play("ripple");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          handlePreloadComplete();
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 2;
        if (next > prev && next < 100) sounds.play("whoosh");
        return Math.min(100, next);
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handlePreloadComplete = () => {
    sounds.play("chime");
    setTimeout(() => {
      setIsExiting(true);
      sounds.play("dream_enter");
      setTimeout(onComplete, 1500);
    }, 500);
  };

  const messages = [
    "Sincronizzazione dei ricordi...",
    "Allineamento frammenti...",
    "Accesso a Reverie...",
    "Ogni carta custodisce un ricordo...",
    "Nessuna combinazione è casuale...",
    "Alcune storie scelgono te...",
    "Sintonizzazione coscienza..."
  ];

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(msgInterval);
  }, []);

  // Ambient pulse effect
  useEffect(() => {
    if (!hasInteracted) return;
    const pulseInterval = setInterval(() => sounds.play("pulse"), 2000);
    return () => clearInterval(pulseInterval);
  }, [hasInteracted]);

  const handleStartAudio = () => {
    setHasInteracted(true);
    sounds.startAmbient();
  };

  useEffect(() => {
    return () => sounds.stopAmbient();
  }, []);

  return (
    <motion.div 
      animate={isExiting ? { scale: 1.1, opacity: 0 } : { scale: 1, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="absolute inset-0 z-[100] bg-abyss flex flex-col items-center justify-center p-8 text-center cursor-pointer select-none overflow-hidden"
      onMouseDown={handleInteraction}
      onTouchStart={handleInteraction}
    >
      {/* Visual Ripples */}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0.5, scale: 0, x: r.x, y: r.y }}
            animate={{ opacity: 0, scale: 4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="fixed pointer-events-none size-20 -ml-10 -mt-10 rounded-full border border-gold/30"
            style={{ left: 0, top: 0 }}
          />
        ))}
      </AnimatePresence>
      {/* Background Color Shift */}
      <motion.div 
        animate={{ 
          background: [
            "radial-gradient(circle at center, oklch(0.2 0.05 280), oklch(0.1 0.03 280))",
            "radial-gradient(circle at center, oklch(0.15 0.04 250), oklch(0.08 0.02 250))",
            "radial-gradient(circle at center, oklch(0.2 0.05 280), oklch(0.1 0.03 280))"
          ] 
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 -z-20"
      />

      <CanvasBackground />
      <LoadingParticles />

      {/* Vignette Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isExiting ? { scale: 15, opacity: 0, filter: "blur(20px)" } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.5, ease: "easeIn" }}
        className="relative mb-12 z-20"
      >
        <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full" />
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative size-32 ring-2 ring-gold/30 rounded-full flex items-center justify-center"
        >
          <Eye className="size-12 text-gold" />
          
          {/* Rotating Rings */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-4px] border border-gold/10 rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-12px] border border-gold/5 rounded-full"
          />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-24px] border-t border-gold/5 rounded-full"
          />
        </motion.div>
      </motion.div>

      <div className="z-20">
        <h1 className="font-display text-4xl tracking-[0.5em] gold-text mb-2 drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]">
          REVERIE
        </h1>
        
        <div className="h-6 mb-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p 
              key={messageIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-[9px] uppercase tracking-[0.3em] text-gold/80 font-medium"
            >
              {messages[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
      
      <div className="w-full max-w-[200px] space-y-3 z-20">
        <div className="relative h-1.5 w-full bg-card/20 rounded-full overflow-hidden ring-1 ring-gold/10">
          {/* Progress Fill */}
          <motion.div 
            className="h-full bg-gradient-to-r from-mystic via-gold to-mystic relative"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Glow Head */}
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute right-0 top-0 h-full w-4 bg-white blur-md"
            />
          </motion.div>

          {/* Scanning Glow */}
          <motion.div 
            animate={{ left: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 h-full w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
        </div>

        <div className="flex justify-between items-center px-1">
          <div className="flex gap-1">
             {Array.from({ length: 3 }).map((_, i) => (
               <motion.div 
                key={i}
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                className="size-1 rounded-full bg-gold/40"
               />
             ))}
          </div>
          <p className="text-[10px] font-display text-gold/60 tabular-nums">
            {Math.round(progress)}%
          </p>
        </div>
      </div>

      {!hasInteracted && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-12 text-[8px] uppercase tracking-[0.4em] text-gold/40 animate-bounce"
        >
          Tocca per sintonizzare l'audio
        </motion.p>
      )}
    </motion.div>
  );
}

function LoadingParticles() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 0,
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            opacity: [0, 0.4, 0],
            y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`]
          }}
          transition={{ 
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute size-1 bg-gold/40 rounded-full blur-[1px]"
        />
      ))}
    </div>
  );
}

function DeckShuffle() { return <div className="flex items-center justify-center h-full"><Loader2 className="h-12 w-12 text-gold animate-spin opacity-20" /></div>; }
function AdBreakOverlay() { return <div className="absolute inset-0 z-[100] bg-abyss/90 backdrop-blur-md flex items-center justify-center p-8 text-center text-gold font-display text-xl uppercase tracking-widest">Sincronizzazione...</div>; }

export const Route = createFileRoute("/combo")({ component: ComboGame });
