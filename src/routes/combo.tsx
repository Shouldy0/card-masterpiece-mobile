import React, { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useComboGame, GameResult, getXpToNextLevel, getDailyLeaderboard } from "@/game/combo-store";
import { ComboCard, ComboCategory, RARITY_POINTS, getRank, calculateRisk, getPotentialText } from "@/game/combo-cards";
import { MobileFrame } from "@/components/Common";
import { CanvasBackground } from "@/components/CanvasBackground";
import { sounds } from "@/utils/audio";
import { ads } from "@/utils/ads";
import { Eye, Sparkles, Zap, ArrowLeft, Star, Trophy, RotateCcw, Play, CheckCircle2, RefreshCw, Calendar, Users, Ghost, Loader2, PlayCircle } from "lucide-react";


const catMeta: Record<ComboCategory, { label: string; color: string; gradient: string; bgGlow: string }> = {
  character: { label: "PERSONAGGIO", color: "text-mystic-glow", gradient: "from-[oklch(0.35_0.18_295)] to-[oklch(0.15_0.08_280)]", bgGlow: "oklch(0.55 0.22 295 / 40%)" },
  setting: { label: "AMBIENTAZIONE", color: "text-azure", gradient: "from-[oklch(0.35_0.14_240)] to-[oklch(0.15_0.06_260)]", bgGlow: "oklch(0.7 0.18 240 / 40%)" },
  action: { label: "AZIONE", color: "text-amber-eclipse", gradient: "from-[oklch(0.38_0.14_60)] to-[oklch(0.15_0.06_50)]", bgGlow: "oklch(0.78 0.16 60 / 40%)" },
};

function HandDrawnFilter() {
  return (
    <svg className="hidden">
      <filter id="sketchy">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
      </filter>
    </svg>
  );
}

function ComboGame() {
  const store = useComboGame();
  const { phase, drawnCards, currentResult, rerollsLeft, highScore, startGame, reroll, keepCombo, resetAll } = store;
  const navigate = useNavigate();
  const [isPreloading, setIsPreloading] = useState(true);
  const [isShowingAd, setIsShowingAd] = useState(false);
  const [showShuffle, setShowShuffle] = useState(false);

  // Preload sequence
  useEffect(() => {
    const timer = setTimeout(() => setIsPreloading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Sound triggers
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

  const handleReroll = () => {
    sounds.play("reroll");
    reroll();
  };

  const handleKeep = () => {
    sounds.play("lock");
    keepCombo();
  };

  const handleRestart = async () => {
    setIsShowingAd(true);
    await ads.showInterstitial();
    setIsShowingAd(false);
    startGame(store.isDailyMode);
  };

  if (isPreloading) return <Preloader />;
  if (phase === "result") return <ResultScreen result={store.lastResult} highScore={highScore} onRestart={handleRestart} onExit={() => { resetAll(); navigate({ to: "/home" }); }} />;

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-abyss flex items-center justify-center font-serif">
      <HandDrawnFilter />
      <CanvasBackground />
      <AnimatePresence>
        {isShowingAd && <AdBreakOverlay />}
      </AnimatePresence>
      
      <MobileFrame className="w-full max-w-md h-full px-4 pb-6 pt-3 shadow-none ring-0 bg-transparent flex flex-col relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="relative flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-mystic to-abyss ring-1 ring-gold/40 shadow-lg">
              <span className="font-display text-xs font-bold text-gold">{store.level}</span>
              <div className="absolute -bottom-1 w-full h-0.5 bg-card overflow-hidden rounded-full">
                 <motion.div className="h-full bg-gold" initial={{ width: 0 }} animate={{ width: `${(store.xp / getXpToNextLevel(store.level)) * 100}%` }} />
              </div>
            </div>
            <button onClick={() => { resetAll(); navigate({ to: "/home" }); }} className="flex items-center gap-1.5 rounded-full bg-card/40 px-2.5 py-1 ring-1 ring-gold/30 text-gold hover:bg-card/60 transition-colors backdrop-blur-sm">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="text-[9px] uppercase tracking-widest font-display">Esci</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            {store.isDailyMode && (
              <div className="flex items-center gap-1 rounded-full bg-amber-eclipse/20 px-2 py-1 ring-1 ring-amber-eclipse/40">
                <Calendar className="h-3 w-3 text-amber-eclipse" />
                <span className="font-display text-[8px] text-amber-eclipse uppercase tracking-widest">Daily</span>
              </div>
            )}
            <div className="flex items-center gap-1 rounded-full bg-card/60 px-2.5 py-1 ring-1 ring-gold/30 backdrop-blur-sm">
              <Trophy className="h-3 w-3 text-gold" />
              <span className="font-display text-[10px] text-foreground">{store.isDailyMode ? store.dailyHighScore : store.highScore}</span>
            </div>
          </div>
        </header>

        {/* Start Screen Overlay */}
        <AnimatePresence>
          {phase === "idle" && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-abyss/40 backdrop-blur-sm px-6"
            >
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="text-center w-full">
                <h1 className="font-display text-5xl tracking-[0.2em] gold-text mb-2">REVERIE</h1>
                <div className="mb-4 flex flex-col items-center gap-1">
                   {store.level < 2 && <p className="text-[8px] uppercase tracking-widest text-muted-foreground/60">Liv. 2: Sblocca Carte Leggendarie</p>}
                   {store.level >= 2 && <p className="text-[8px] uppercase tracking-widest text-gold/60">Livello Massimo Raggiunto</p>}
                </div>

                {/* Daily Leaderboard Simulation */}
                <div className="mb-8 w-full max-w-xs mx-auto rounded-2xl bg-card/30 p-4 ring-1 ring-gold/10 backdrop-blur-sm">
                   <div className="flex items-center gap-2 mb-3 border-b border-gold/10 pb-2">
                      <Users className="h-3 w-3 text-gold/60" />
                      <span className="text-[9px] uppercase tracking-widest text-gold/60">Classifica Odierna</span>
                   </div>
                   <div className="space-y-2 text-left">
                      {getDailyLeaderboard(new Date().getDate()).map((entry, i) => (
                        <div key={i} className="flex justify-between items-center text-[10px]">
                           <span className="text-muted-foreground flex items-center gap-2">
                              <span className="text-[8px] w-3 opacity-40">{i+1}</span>
                              {entry.name}
                           </span>
                           <span className="font-display text-gold/80">{entry.score}</span>
                        </div>
                      ))}
                      {store.dailyHighScore > 0 && (
                        <div className="mt-2 pt-2 border-t border-gold/10 flex justify-between items-center text-[10px]">
                           <span className="text-emerald font-bold">Tu</span>
                           <span className="font-display text-emerald">{store.dailyHighScore}</span>
                        </div>
                      )}
                   </div>
                </div>

                <div className="flex flex-col gap-4 items-center">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => startGame(false)} className="w-full max-w-xs rounded-2xl gold-frame bg-gradient-to-r from-mystic to-mystic-glow py-4 font-display text-xl uppercase tracking-[0.25em] text-foreground shadow-2xl">
                    <span className="flex items-center justify-center gap-3"><Play className="h-6 w-6 fill-current" />GIOCA</span>
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => startGame(true)} className="w-full max-w-xs rounded-2xl border-2 border-amber-eclipse/40 bg-amber-eclipse/5 py-4 font-display text-xs uppercase tracking-[0.25em] text-amber-eclipse glow-gold"><span className="flex items-center justify-center gap-2"><Calendar className="h-4 w-4" />SFIDA DEL GIORNO</span></motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Stats */}
        {phase !== "idle" && (
          <div className="mt-4 flex justify-center gap-4 z-10">
             <div className="flex flex-col items-center">
               <span className="text-[8px] uppercase tracking-widest text-muted-foreground">Rerolls</span>
               <div className="flex gap-1 mt-1">
                 {[0, 1, 2].map((i) => (
                   <motion.div key={i} className={`h-1.5 w-6 rounded-full ${i < rerollsLeft ? "bg-gold shadow-[0_0_8px_rgba(255,215,0,0.5)]" : "bg-card/40"}`} animate={i < rerollsLeft ? { scale: [1, 1.2, 1] } : {}} />
                 ))}
               </div>
             </div>
          </div>
        )}

        {/* Main Game Area */}
        <div className="flex-1 flex flex-col justify-center gap-3 mt-4 relative z-10">
          <AnimatePresence mode="wait">
            {showShuffle && <DeckShuffle key="shuffle" />}
            {phase === "drawing" && !showShuffle && (
              <motion.div key="drawing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-2">
                {[0, 1, 2].map((i) => <DrawingSlot key={i} index={i} />)}
              </motion.div>
            )}
            {phase === "decision" && drawnCards && (
              <motion.div key="cards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-2">
                {drawnCards.map((card, i) => <DrawnCard key={card.id} card={card} index={i} />)}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Decision Feedback */}
          <AnimatePresence>
            {phase === "decision" && currentResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-2 px-2 text-center">
                {(() => {
                  const risk = calculateRisk(currentResult);
                  const potential = getPotentialText(currentResult);
                  return (
                    <div className="mb-4 flex flex-col items-center gap-2">
                      <motion.div animate={risk.level === "High" ? { scale: [1, 1.05, 1], rotate: [-0.5, 0.5, -0.5] } : {}} transition={{ repeat: Infinity, duration: 1.5 }} className={`rounded-full px-3 py-1 text-[8px] font-bold uppercase tracking-[0.2em] ring-1 ${risk.level === "High" ? "bg-rose/10 ring-rose/50 text-rose" : risk.level === "Medium" ? "bg-amber-eclipse/10 ring-amber-eclipse/50 text-amber-eclipse" : "bg-emerald/10 ring-emerald/50 text-emerald"}`}>Rischio: {risk.level}</motion.div>
                      <h3 className={`font-display text-base uppercase tracking-widest ${currentResult.stars >= 4 ? "gold-text" : "text-foreground"}`}>{potential}</h3>
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground/60">{risk.description}</p>
                    </div>
                  );
                })()}

                <motion.p 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="mb-4 italic text-[11px] leading-relaxed text-gold/80 font-serif max-w-[280px] mx-auto px-2 border-l-2 border-gold/20"
                >
                  "{currentResult.narration}"
                </motion.p>

                <div className="flex justify-center gap-0.5 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < currentResult.stars ? "text-gold fill-gold drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" : "text-muted-foreground/20"}`} />)}
                </div>
                <h3 className="font-display text-xs gold-text uppercase tracking-[0.2em]">{currentResult.title}</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">{currentResult.score} punti • {currentResult.bonuses.length > 0 ? currentResult.bonuses[0] : "Sinergia Onirica"}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto mb-4 flex flex-col items-center gap-3 z-10">
          {phase === "decision" && currentResult && (
            <>
              <motion.button 
                initial={{ scale: 0.9 }} animate={{ scale: 1, boxShadow: calculateRisk(currentResult).level === "High" ? ["0 0 0px rgba(255,215,0,0)", "0 0 20px rgba(255,215,0,0.3)", "0 0 0px rgba(255,215,0,0)"] : "0 0 0px rgba(0,0,0,0)" }} transition={calculateRisk(currentResult).level === "High" ? { repeat: Infinity, duration: 1 } : {}} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
                onClick={handleKeep}
                className={`w-full max-w-xs rounded-2xl gold-frame py-4 font-display text-lg uppercase tracking-[0.25em] transition-all shadow-2xl ${calculateRisk(currentResult).level === "High" ? "bg-gradient-to-r from-gold-dim via-gold to-gold-dim text-abyss" : "bg-card/40 text-gold ring-1 ring-gold/30"}`}
              >
                <span className="flex items-center justify-center gap-2"><CheckCircle2 className="h-5 w-5" />CONFERMA</span>
              </motion.button>
              <motion.button disabled={rerollsLeft <= 0} initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={rerollsLeft > 0 ? { scale: 1.02, x: [0, -2, 2, 0] } : {}} whileTap={{ scale: 0.95 }} onClick={handleReroll} className={`w-full max-w-xs rounded-2xl border-2 py-3 font-display text-xs uppercase tracking-widest transition-all ${rerollsLeft > 0 ? "border-mystic/40 text-mystic-glow bg-mystic/5 hover:bg-mystic/15" : "border-card/10 text-muted-foreground/20 cursor-not-allowed"}`}><span className="flex items-center justify-center gap-2"><RefreshCw className={`h-4 w-4 ${rerollsLeft > 0 ? "animate-spin-slow" : ""}`} />RERROLL ({rerollsLeft})</span></motion.button>
            </>
          )}
        </div>
      </MobileFrame>
    </div>
  );
}

function Preloader() {
  return (
    <div className="h-[100dvh] w-screen bg-abyss flex flex-col items-center justify-center relative overflow-hidden">
      <CanvasBackground />
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="z-10 text-center px-6">
        <h1 className="font-display text-6xl tracking-[0.3em] gold-text mb-4">REVERIE</h1>
        <div className="w-64 h-1 bg-card/60 rounded-full overflow-hidden mb-3 ring-1 ring-gold/20">
           <motion.div 
             className="h-full bg-gradient-to-r from-mystic via-gold to-mystic" 
             initial={{ x: "-100%" }} 
             animate={{ x: "0%" }} 
             transition={{ duration: 1.8, ease: "easeInOut" }}
           />
        </div>
        <p className="text-[10px] uppercase tracking-[0.5em] text-gold/40 animate-pulse">Sincronizzazione Frammenti...</p>
      </motion.div>
    </div>
  );
}

function AdBreakOverlay() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-abyss/90 backdrop-blur-md"
    >
      <div className="text-center p-8 rounded-3xl bg-card/20 ring-1 ring-gold/20">
        <PlayCircle className="h-12 w-12 text-gold mx-auto mb-4 animate-pulse" />
        <h2 className="font-display text-xl gold-text mb-2 tracking-widest uppercase">Breve Pausa</h2>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-6">Il sogno riprenderà tra un istante</p>
        <div className="w-48 h-1 bg-card rounded-full overflow-hidden">
           <motion.div 
             className="h-full bg-gold" 
             initial={{ width: 0 }} animate={{ width: "100%" }} 
             transition={{ duration: 1.5, ease: "linear" }} 
           />
        </div>
      </div>
    </motion.div>
  );
}

function ResultScreen({ result, highScore, onRestart, onExit }: { result: GameResult | null; highScore: number; onRestart: () => void; onExit: () => void }) {
  if (!result) return null;
  const store = useComboGame();
  const { rank, color } = getRank(result.scored.score);
  const xpPct = (store.xp / getXpToNextLevel(store.level)) * 100;

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-abyss flex items-center justify-center">
      <CanvasBackground />
      {result.scored.stars >= 4 && <ParticleLayer color={result.scored.stars >= 5 ? "oklch(0.82 0.13 80)" : "oklch(0.55 0.22 295)"} />}
      <MobileFrame className="w-full max-w-md px-6 pb-8 pt-12 items-center justify-center text-center h-full bg-transparent flex flex-col relative z-10">
        <AnimatePresence>
          {result.leveledUp && (
            <motion.div initial={{ scale: 0, y: 50 }} animate={{ scale: 1, y: 0 }} className="absolute top-20 z-50 rounded-2xl bg-gradient-to-r from-gold via-amber-eclipse to-gold p-px shadow-[0_0_40px_rgba(255,215,0,0.4)]">
              <div className="rounded-2xl bg-abyss px-8 py-3 font-display text-xs font-bold uppercase tracking-[0.4em] text-gold">Level Up!</div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} className="relative flex size-40 items-center justify-center rounded-full bg-gradient-to-br from-card/80 to-abyss/80 ring-4 ring-gold/20 shadow-2xl backdrop-blur-md">
          <span className={`font-display text-8xl font-bold ${color}`}>{rank}</span>
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0, 0.5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -inset-6 rounded-full border-2 border-gold/30" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Punteggio Finale</p>
          <h1 className="font-display text-7xl gold-text mt-1 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]">{result.scored.score}</h1>
          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="flex justify-between w-48 text-[9px] uppercase tracking-widest text-gold/60"><span>Livello {store.level}</span><span>+{result.xpEarned} XP</span></div>
            <div className="h-1.5 w-48 overflow-hidden rounded-full bg-card/60 ring-1 ring-gold/20"><motion.div className="h-full bg-gradient-to-r from-gold to-amber-eclipse" initial={{ width: 0 }} animate={{ width: `${xpPct}%` }} transition={{ duration: 1.5, ease: "easeOut" }} /></div>
          </div>
        </motion.div>
        <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-xs">
          <div className="bg-card/30 rounded-2xl p-4 ring-1 ring-gold/10 backdrop-blur-sm"><p className="text-xl font-display text-gold">{result.scored.stars}</p><p className="text-[8px] uppercase text-muted-foreground">Stelle</p></div>
          <div className="bg-card/30 rounded-2xl p-4 ring-1 ring-gold/10 backdrop-blur-sm"><p className="text-xl font-display text-mystic-glow">{result.rerollsUsed}</p><p className="text-[8px] uppercase text-muted-foreground">Rerolls</p></div>
        </div>
        <div className="mt-10 flex w-full flex-col gap-4 max-w-xs">
          <button onClick={onRestart} className="w-full rounded-2xl gold-frame bg-gradient-to-r from-mystic to-mystic-glow py-5 font-display text-lg uppercase tracking-[0.3em] text-foreground shadow-xl">RIPROVA</button>
          <button onClick={onExit} className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-gold transition-colors py-2">TORNA ALLA HOME</button>
        </div>
      </MobileFrame>
    </div>
  );
}

function DeckShuffle() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative size-32">
        {[0, 1, 2, 3].map((i) => (
          <motion.div 
            key={i}
            initial={{ y: 0, rotate: 0 }}
            animate={{ 
              y: [-10 * i, 0, -10 * i], 
              rotate: [0, (i - 1.5) * 10, 0],
              x: [0, (i % 2 === 0 ? 40 : -40), 0]
            }}
            transition={{ duration: 0.4, repeat: 1, ease: "easeInOut" }}
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-card/80 to-abyss/80 ring-2 ring-gold/20 shadow-xl flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,oklch(0.15_0.05_280),oklch(0.15_0.05_280)_5px,oklch(0.12_0.04_280)_5px,oklch(0.12_0.04_280)_10px)] opacity-20" />
            <Eye className="h-8 w-8 text-gold/20" />
          </motion.div>
        ))}
      </div>
      <p className="mt-8 text-[8px] uppercase tracking-[0.5em] text-gold/40 animate-pulse">Sincronizzazione Onirica...</p>
    </div>
  );
}

function DrawingSlot({ index }: { index: number }) {
  return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: index * 0.1 }} className="relative w-full max-w-xs rounded-xl bg-card/60 p-4 ring-1 ring-gold/20 overflow-hidden h-[84px] backdrop-blur-sm">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,oklch(0.15_0.05_280),oklch(0.15_0.05_280)_10px,oklch(0.12_0.04_280)_10px,oklch(0.12_0.04_280)_20px)] opacity-30" />
      <div className="relative flex h-full items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}><Sparkles className="h-8 w-8 text-gold/30" /></motion.div>
      </div>
    </motion.div>
  );
}

function DrawnCard({ card, index }: { card: ComboCard; index: number }) {
  const m = catMeta[card.category];
  const pts = RARITY_POINTS[card.rarity];
  const rarityStyles: Record<string, string> = { 
    common: "ring-muted-foreground/20 grayscale-[20%]", 
    rare: "ring-azure/40 shadow-[0_0_20px_rgba(100,200,255,0.1)]", 
    epic: "ring-mystic/50 shadow-[0_0_25px_rgba(200,100,255,0.15)]", 
    legendary: "ring-gold/60 shadow-[0_0_40px_rgba(255,215,0,0.25)]" 
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -50, rotateY: 90 }} 
      animate={{ opacity: 1, x: 0, rotateY: 0 }} 
      transition={{ delay: index * 0.2, duration: 0.5, type: "spring" }}
      whileHover={{ scale: 1.05, rotateZ: (index - 1) * 2, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full max-w-xs rounded-[2rem] bg-gradient-to-br ${m.gradient} p-5 ring-2 ${rarityStyles[card.rarity]} overflow-hidden shadow-2xl cursor-pointer transition-shadow`}
      style={{ filter: "url(#sketchy)" }}
    >
      {/* Parchment Texture Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/parchment.png')" }} />
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl opacity-30" style={{ background: m.bgGlow }} />
      
      <div className="relative flex items-center gap-5">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-abyss/60 ring-1 ring-gold/20 text-3xl shadow-inner transform rotate-[-2deg]">
          {card.icon}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center justify-between">
            <span className={`text-[9px] font-display uppercase tracking-[0.2em] ${m.color} opacity-80`}>{m.label}</span>
            <span className="text-[10px] font-display text-gold/60">+{pts}</span>
          </div>
          <p className="font-display text-lg text-foreground truncate mt-0.5 tracking-wide leading-tight">
            {card.name}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ParticleLayer({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: "50%", y: "50%", scale: 0, opacity: 1 }}
          animate={{ 
            x: `${Math.random() * 100}%`, 
            y: `${Math.random() * 100}%`, 
            scale: [0, 1, 0], 
            opacity: [1, 0.5, 0] 
          }}
          transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          className="absolute size-1 rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
        />
      ))}
    </div>
  );
}

export const Route = createFileRoute("/combo")({ component: ComboGame });
