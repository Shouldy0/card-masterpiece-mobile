import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo } from "react";
import { useComboGame, RoundResult, getRank } from "@/game/combo-store";
import { ComboCard, ComboCategory, RARITY_POINTS, generateFunnyCombo } from "@/game/combo-cards";
import { MobileFrame } from "@/components/Common";
import { CanvasBackground } from "@/components/CanvasBackground";
import { sounds } from "@/utils/audio";
import { Eye, Sparkles, Zap, RotateCcw, ArrowLeft, Star, Trophy, Flame, Clock, Play, FastForward, Share2, Ghost } from "lucide-react";

export const Route = createFileRoute("/combo")({ component: ComboGame });

const ROUND_DURATION = 30;

const catMeta: Record<ComboCategory, { label: string; color: string; gradient: string; bgGlow: string }> = {
  character: { label: "PERSONAGGIO", color: "text-mystic-glow", gradient: "from-[oklch(0.35_0.18_295)] to-[oklch(0.15_0.08_280)]", bgGlow: "oklch(0.55 0.22 295 / 40%)" },
  setting: { label: "AMBIENTAZIONE", color: "text-azure", gradient: "from-[oklch(0.35_0.14_240)] to-[oklch(0.15_0.06_260)]", bgGlow: "oklch(0.7 0.18 240 / 40%)" },
  action: { label: "AZIONE", color: "text-amber-eclipse", gradient: "from-[oklch(0.38_0.14_60)] to-[oklch(0.15_0.06_50)]", bgGlow: "oklch(0.78 0.16 60 / 40%)" },
};

function ComboGame() {
  const store = useComboGame();
  const { phase, drawnCards, currentResult, timeLeft, totalScore, comboCount, streak, bestCombo, roundHistory, startGame, drawCards, validateCombo, nextRound, resetAll } = store;
  const navigate = useNavigate();

  const timerPct = (timeLeft / ROUND_DURATION) * 100;
  const isUrgent = timeLeft <= 10 && phase !== "idle" && phase !== "gameover";
  const timerColor = timeLeft <= 5 ? "text-rose" : timeLeft <= 10 ? "text-amber-eclipse" : "text-gold";

  // Cleanup timer on unmount
  useEffect(() => () => { const s = useComboGame.getState(); if (s.timerInterval) clearInterval(s.timerInterval); }, []);

  // Sound & Effects triggers
  useEffect(() => {
    if (phase === "drawing") sounds.play("draw");
    if (phase === "scored") {
      if (currentResult && currentResult.stars >= 4) sounds.play("success");
      else if (currentResult && currentResult.stars === 1) sounds.play("fail");
    }
    if (phase === "gameover") {
      if (store.isNewHighScore || store.isNewDailyRecord) sounds.play("record");
    }
  }, [phase]);

  useEffect(() => {
    if (timeLeft > 0 && timeLeft <= 5 && phase === "playing") {
      sounds.play("tick");
    }
  }, [timeLeft]);

  const shakeControls = useMemo(() => ({
    x: store.isNewHighScore || store.isNewDailyRecord ? [0, -10, 10, -10, 10, 0] : 0,
    transition: { duration: 0.4 }
  }), [store.isNewHighScore, store.isNewDailyRecord]);

  const handleShare = async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "REVERIE Combo", text });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(text);
      // Simple alert as fallback for clipboard
      alert("Copiato negli appunti!");
    }
  };

  if (phase === "gameover") return <GameOverScreen totalScore={totalScore} comboCount={comboCount} bestCombo={bestCombo} roundHistory={roundHistory} onRestart={() => { resetAll(); startGame({ daily: store.isDailyMode, hard: store.isHardMode }); }} onExit={() => { resetAll(); navigate({ to: "/home" }); }} />;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-abyss">
      <CanvasBackground />
      
      <MobileFrame className="mx-auto px-4 pb-4 pt-3 h-full max-w-md shadow-none ring-0 bg-transparent" animate={shakeControls}>
        {/* Header */}
        <header className="flex items-center justify-between">
          <button onClick={() => { resetAll(); navigate({ to: "/home" }); }} className="flex items-center gap-1.5 rounded-full bg-card/40 px-2.5 py-1 ring-1 ring-gold/30 text-gold hover:bg-card/60 transition-colors backdrop-blur-sm">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="text-[9px] uppercase tracking-widest font-display">Menu</span>
          </button>
          <div className="flex items-center gap-1.5">
            {streak > 0 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 rounded-full bg-gradient-to-r from-rose/30 to-amber-eclipse/30 px-2 py-0.5 ring-1 ring-gold/40">
                <Flame className="h-3 w-3 text-rose" />
                <span className="font-display text-[10px] text-gold">x{streak}</span>
              </motion.div>
            )}
            <div className="flex items-center gap-1 rounded-full bg-card/60 px-2 py-0.5 ring-1 ring-gold/30">
              <Trophy className="h-3 w-3 text-gold" />
              <span className="font-display text-[10px] text-muted-foreground mr-1">{store.isDailyMode ? "Daily:" : "Best:"}</span>
              <span className="font-display text-[10px] text-foreground">{store.isDailyMode ? store.dailyHighScore : store.highScore}</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-card/60 px-2 py-0.5 ring-1 ring-gold/30">
              <Zap className="h-3 w-3 text-gold" />
              <span className="font-display text-xs text-foreground">{totalScore}</span>
            </div>
          </div>
        </header>

        {/* Timer Ring */}
        <AnimatePresence>
          {phase !== "idle" && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mt-3 flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                <svg width="80" height="80" className="-rotate-90">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="oklch(0.2 0.04 280)" strokeWidth="4" />
                  <motion.circle cx="40" cy="40" r="34" fill="none" stroke={timeLeft <= 5 ? "oklch(0.7 0.21 10)" : timeLeft <= 10 ? "oklch(0.78 0.16 60)" : "oklch(0.82 0.13 80)"} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 34}`} strokeDashoffset={`${2 * Math.PI * 34 * (1 - timerPct / 100)}`} transition={{ duration: 0.3 }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`font-display text-xl ${timerColor}`}>{timeLeft}</span>
                  <span className="text-[8px] uppercase tracking-widest text-muted-foreground">sec</span>
                </div>
                {isUrgent && <motion.div className="absolute inset-0 rounded-full" animate={{ boxShadow: ["0 0 0 0 oklch(0.7 0.21 10 / 0)", "0 0 20px 4px oklch(0.7 0.21 10 / 0.4)", "0 0 0 0 oklch(0.7 0.21 10 / 0)"] }} transition={{ duration: 1, repeat: Infinity }} />}
              </div>
              <div className="mt-1 flex items-center gap-3 text-[9px] uppercase tracking-widest text-muted-foreground">
                <span>Combo: {comboCount}</span>
                <span>•</span>
                <span className={store.isDailyMode ? "text-gold" : ""}>{store.isDailyMode ? "Sfida del Giorno" : "Arcade Mode"}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Start Screen Overlay */}
        <AnimatePresence>
          {phase === "idle" && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-abyss/80 backdrop-blur-lg"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} 
                animate={{ scale: 1, y: 0 }}
                className="text-center"
              >
                <h1 className="font-display text-5xl tracking-[0.25em] gold-text mb-2">REVERIE</h1>
                <p className="text-[10px] uppercase tracking-[0.5em] text-gold/60 mb-12">Combo Masterpiece</p>
                
                <div className="flex flex-col gap-4 items-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startGame({ daily: false, hard: false })}
                    className="w-64 rounded-2xl gold-frame bg-gradient-to-r from-mystic to-mystic-glow py-6 font-display text-xl uppercase tracking-[0.3em] text-foreground shadow-[0_0_50px_rgba(180,100,255,0.3)]"
                  >
                    <span className="flex items-center justify-center gap-3">
                      <Play className="h-6 w-6 fill-current" />
                      PLAY
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startGame({ hard: true })}
                    className="w-64 rounded-2xl border-2 border-rose/60 bg-gradient-to-r from-abyss to-rose/20 py-4 font-display text-sm uppercase tracking-[0.3em] text-rose glow-rose shadow-xl"
                  >
                    <span className="flex items-center justify-center gap-3">
                      <Zap className="h-5 w-5 fill-current" />
                      HARD MODE
                    </span>
                  </motion.button>

                  <button 
                    onClick={() => startGame({ daily: true })}
                    className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-gold transition-colors py-2"
                  >
                    Sfida del Giorno
                  </button>

                  <button 
                    onClick={() => {
                      const funny = generateFunnyCombo();
                      handleShare(`🔮 ${funny.text} #ReverieCombo`);
                    }}
                    className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-gold transition-colors py-2 flex items-center gap-2"
                  >
                    <Ghost className="h-3 w-3" />
                    Genera Combo Pazza
                  </button>
                </div>

                <div className="mt-16 flex justify-center gap-8 text-[9px] uppercase tracking-[0.2em] text-gold/40">
                  <div className="flex flex-col items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>30s Time</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Star className="h-4 w-4" />
                    <span>Combo</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    <span>Rank S</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Game Area */}
        <div className={`${phase === "idle" ? "hidden" : "mt-4"} flex flex-1 flex-col justify-center gap-2`}>
          <AnimatePresence mode="wait">
            {phase === "playing" && (
              <motion.div key="playing-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-2">
                {(["character", "setting", "action"] as ComboCategory[]).map((cat, i) => <EmptySlot key={cat} category={cat} index={i} />)}
              </motion.div>
            )}
            {phase === "drawing" && (
              <motion.div key="drawing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-2">
                {(["character", "setting", "action"] as ComboCategory[]).map((cat, i) => <DrawingSlot key={cat} category={cat} index={i} />)}
              </motion.div>
            )}
            {(phase === "drawn" || phase === "scored") && drawnCards && (
              <motion.div key="cards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-2">
                {drawnCards.map((card, i) => <DrawnCard key={card.id} card={card} index={i} scored={phase === "scored"} />)}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Score Feedback */}
          <AnimatePresence>
            {phase === "scored" && currentResult && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 10 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.9 }} 
                className="mt-4 rounded-2xl bg-gradient-to-b from-card/95 to-abyss/95 p-4 ring-1 ring-gold/40 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < currentResult.stars ? "text-gold fill-gold drop-shadow-[0_0_8px_var(--gold)]" : "text-muted-foreground/20"}`} />)}
                  </div>
                  <div className="flex items-center gap-2">
                    {store.isHardMode && (
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${store.roundHistory[store.roundHistory.length - 1]?.judgment === "correct" ? "text-emerald" : "text-rose"}`}>
                        {store.roundHistory[store.roundHistory.length - 1]?.judgment === "correct" ? "ESATTO!" : "SBAGLIATO!"}
                      </span>
                    )}
                    {streak >= 2 && (
                      <motion.span 
                        initial={{ x: 20, opacity: 0 }} 
                        animate={{ x: 0, opacity: 1 }}
                        className="rounded-full bg-rose/20 px-2 py-0.5 text-[10px] font-bold text-rose ring-1 ring-rose/30"
                      >
                        x{streak >= 5 ? "2.0" : "1.5"} Bonus
                      </motion.span>
                    )}
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className={`font-display text-2xl ${store.roundHistory[store.roundHistory.length - 1]?.roundTotal && store.roundHistory[store.roundHistory.length - 1]!.roundTotal < 0 ? "text-rose" : "gold-text"}`}>
                      {store.roundHistory[store.roundHistory.length - 1]?.roundTotal ?? 0 >= 0 ? "+" : ""}{store.roundHistory[store.roundHistory.length - 1]?.roundTotal ?? currentResult.score}
                    </motion.span>
                  </div>
                </div>
                <p className="mt-1 font-display text-xs tracking-widest text-gold uppercase">{currentResult.title}</p>
                <p className="text-[10px] text-muted-foreground leading-tight mt-1">
                  {store.isHardMode ? (store.roundHistory[store.roundHistory.length - 1]?.judgment === "correct" ? "Hai giudicato correttamente questa combinazione." : "Giudizio errato. Questa combinazione era " + (currentResult.stars >= 3 ? "coerente." : "caotica.")) : currentResult.feedback}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {phase !== "idle" && (
          <div className="mt-auto mb-4 flex flex-col items-center gap-2">
            {phase === "playing" && (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileTap={{ scale: 0.95 }} onClick={drawCards} className="w-full max-w-xs rounded-full gold-frame bg-gradient-to-r from-mystic to-mystic-glow py-4 font-display text-base uppercase tracking-[0.25em] text-foreground glow-mystic shadow-xl">
                <span className="flex items-center justify-center gap-2"><Sparkles className="h-5 w-5" />PESCA</span>
              </motion.button>
            )}
            {phase === "drawn" && !store.isHardMode && (
              <motion.button initial={{ scale: 0.9 }} animate={{ scale: 1 }} whileTap={{ scale: 0.95 }} onClick={validateCombo} className={`w-full max-w-xs rounded-full gold-frame bg-gradient-to-r from-gold-dim via-gold to-gold-dim py-4 font-display text-base uppercase tracking-[0.25em] text-abyss glow-gold shadow-xl ${isUrgent ? "animate-pulse" : ""}`}>
                <span className="flex items-center justify-center gap-2"><Zap className="h-5 w-5 fill-current" />VALIDA</span>
              </motion.button>
            )}
            {phase === "drawn" && store.isHardMode && (
              <div className="flex w-full max-w-xs gap-3">
                <motion.button 
                  whileTap={{ scale: 0.95 }} 
                  onClick={() => store.judgeCombo("accept")}
                  className="flex-1 rounded-2xl border-2 border-emerald/50 bg-emerald/10 py-4 font-display text-xs uppercase tracking-widest text-emerald glow-emerald"
                >
                  ACCETTA
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.95 }} 
                  onClick={() => store.judgeCombo("reject")}
                  className="flex-1 rounded-2xl border-2 border-rose/50 bg-rose/10 py-4 font-display text-xs uppercase tracking-widest text-rose glow-rose"
                >
                  RIFIUTA
                </motion.button>
              </div>
            )}
            {phase === "scored" && (
              <motion.button initial={{ y: 20 }} animate={{ y: 0 }} whileTap={{ scale: 0.95 }} onClick={nextRound} className="w-full max-w-xs rounded-full gold-frame bg-gradient-to-r from-mystic to-mystic-glow py-4 font-display text-base uppercase tracking-[0.25em] text-foreground glow-mystic shadow-xl">
                <span className="flex items-center justify-center gap-2"><FastForward className="h-5 w-5" />PROSSIMA</span>
              </motion.button>
            )}
          </div>
        )}
      </MobileFrame>
    </div>
  );
}

function GameOverScreen({ totalScore, comboCount, bestCombo, roundHistory, onRestart, onExit }: { totalScore: number; comboCount: number; bestCombo: RoundResult | null; roundHistory: RoundResult[]; onRestart: () => void; onExit: () => void }) {
  const store = useComboGame();
  const avgScore = comboCount > 0 ? Math.round(totalScore / comboCount) : 0;
  const totalStars = roundHistory.reduce((s, r) => s + r.scored.stars, 0);
  const { rank, color } = getRank(totalScore);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-abyss">
      <CanvasBackground />
      
      <MobileFrame className="mx-auto px-6 pb-8 pt-8 items-center justify-center text-center h-full max-w-md bg-transparent shadow-none ring-0">
        <AnimatePresence>
          {(store.isNewHighScore || store.isNewDailyRecord) && (
            <motion.div
              initial={{ scale: 0, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              className="mb-6 rounded-2xl bg-gradient-to-r from-gold via-amber-eclipse to-gold p-px shadow-[0_0_40px_rgba(255,215,0,0.3)]"
            >
              <div className="rounded-2xl bg-abyss px-6 py-2 font-display text-xs font-bold uppercase tracking-[0.3em] text-gold">
                {store.isNewDailyRecord ? "Daily Record!" : "New High Score!"}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative mb-4">
          <motion.div 
            initial={{ scale: 0, rotate: -180 }} 
            animate={{ scale: 1, rotate: 0 }} 
            transition={{ type: "spring", damping: 15 }}
            className="relative flex size-32 items-center justify-center rounded-full bg-gradient-to-br from-card/80 to-abyss/80 ring-4 ring-gold/20 shadow-2xl backdrop-blur-md"
          >
            <span className={`font-display text-7xl font-bold ${color}`}>{rank}</span>
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -inset-4 rounded-full border-2 border-gold/30"
            />
          </motion.div>
          <p className="mt-2 text-[10px] uppercase tracking-[0.4em] text-gold/60">Rank</p>
        </div>

        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-4 font-display text-2xl tracking-[0.3em] gold-text uppercase">
          {store.isHardMode ? "Hard Mode Over" : "Game Over"}
        </motion.h1>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className="mt-4 flex flex-col items-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Total Score</p>
          <p className="font-display text-6xl gold-text mt-1 drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]">{totalScore}</p>
          <div className="mt-2 flex gap-4 text-[9px] uppercase tracking-widest text-muted-foreground">
            <span>Best: {store.highScore}</span>
            <span>Daily: {store.dailyHighScore}</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-8 grid w-full grid-cols-3 gap-3">
          {[
            { label: "Combos", value: comboCount, color: "text-amber-eclipse" },
            { label: "Avg", value: avgScore, color: "text-gold" },
            { label: "Stars", value: totalStars, color: "text-rose" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1.5 rounded-2xl bg-card/30 py-4 ring-1 ring-gold/10 backdrop-blur-sm">
              <span className={`font-display text-xl ${s.color}`}>{s.value}</span>
              <span className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-10 flex w-full flex-col gap-3">
          {bestCombo && (
            <button 
              onClick={() => {
                const text = `🏆 Ho totalizzato ${totalScore} punti in Reverie! La mia miglior combo: ${bestCombo.cards[0].name} + ${bestCombo.cards[1].name} + ${bestCombo.cards[2].name} ✨ #ReverieCombo`;
                if (navigator.share) {
                  navigator.share({ title: "REVERIE Score", text });
                } else {
                  navigator.clipboard.writeText(text);
                  alert("Copiato negli appunti!");
                }
              }}
              className="w-full rounded-2xl bg-card/40 py-3 ring-1 ring-gold/20 flex items-center justify-center gap-2 font-display text-[10px] uppercase tracking-widest text-gold hover:bg-card/60 transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" />
              Condividi Risultato
            </button>
          )}
          <button onClick={onRestart} className="w-full rounded-full gold-frame bg-gradient-to-r from-mystic to-mystic-glow py-5 font-display text-lg uppercase tracking-[0.3em] text-foreground shadow-xl">
            REPLAY
          </button>
          <button onClick={onExit} className="w-full py-2 font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-gold transition-colors">
            Exit to Menu
          </button>
        </motion.div>
      </MobileFrame>
    </div>
  );
}

/* ─── Sub-components ─── */

function EmptySlot({ category, index }: { category: ComboCategory; index: number }) {
  const m = catMeta[category];
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 }} className={`relative w-full max-w-xs rounded-xl bg-gradient-to-r ${m.gradient} p-4 ring-1 ring-gold/20 overflow-hidden backdrop-blur-sm`}>
      <div className="relative flex items-center gap-4">
        <div className="flex size-10 items-center justify-center rounded-xl bg-abyss/60 ring-1 ring-gold/20 shadow-inner"><Eye className="h-5 w-5 text-muted-foreground/30" /></div>
        <div>
          <p className={`font-display text-[10px] uppercase tracking-[0.2em] ${m.color}`}>{m.label}</p>
          <p className="text-[10px] text-muted-foreground/40 font-medium">In attesa...</p>
        </div>
      </div>
    </motion.div>
  );
}

function DrawingSlot({ category, index }: { category: ComboCategory; index: number }) {
  const m = catMeta[category];
  return (
    <motion.div 
      initial={{ scale: 0.95, rotateY: 0 }} 
      animate={{ scale: 1 }} 
      className={`relative w-full max-w-xs rounded-xl bg-card p-4 ring-1 ring-gold/30 overflow-hidden shadow-lg h-[84px]`}
    >
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,oklch(0.15_0.05_280),oklch(0.15_0.05_280)_10px,oklch(0.12_0.04_280)_10px,oklch(0.12_0.04_280)_20px)] opacity-50" />
      <div className="relative flex h-full items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="h-8 w-8 text-gold/20" />
        </motion.div>
      </div>
    </motion.div>
  );
}

function DrawnCard({ card, index, scored }: { card: ComboCard; index: number; scored: boolean }) {
  const m = catMeta[card.category];
  const pts = RARITY_POINTS[card.rarity];
  
  const rarityGlows: Record<string, string> = {
    common: "ring-muted-foreground/30",
    rare: "ring-azure/60 shadow-[0_0_15px_rgba(100,200,255,0.15)]",
    epic: "ring-mystic/70 shadow-[0_0_20px_rgba(200,100,255,0.25)]",
    legendary: "ring-gold/80 shadow-[0_0_30px_rgba(255,215,0,0.35)]"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, rotateY: 90, scale: 0.8 }} 
      animate={{ opacity: 1, rotateY: 0, scale: 1 }} 
      transition={{ 
        delay: index * 0.15, 
        type: "spring", 
        damping: 12, 
        stiffness: 100 
      }}
      className={`relative w-full max-w-xs rounded-2xl bg-gradient-to-r ${m.gradient} p-4 ring-1 ${rarityGlows[card.rarity]} overflow-hidden shadow-2xl perspective-1000`}
    >
      {card.rarity === "legendary" && (
        <motion.div 
          className="absolute inset-0 bg-gold/5" 
          animate={{ opacity: [0.3, 0.6, 0.3] }} 
          transition={{ duration: 2, repeat: Infinity }} 
        />
      )}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl opacity-50" style={{ background: m.bgGlow }} />
      {scored && <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/15 to-transparent" initial={{ x: "-100%" }} animate={{ x: "200%" }} transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.5 }} />}
      
      <div className="relative flex items-center gap-4">
        <motion.div 
          initial={{ scale: 0.5 }} 
          animate={{ scale: 1 }} 
          transition={{ delay: index * 0.2 + 0.3 }}
          className="flex size-12 items-center justify-center rounded-xl bg-abyss/70 ring-1 ring-gold/30 text-2xl shadow-inner"
        >
          {card.icon}
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <p className={`font-display text-[9px] uppercase tracking-[0.2em] ${m.color}`}>{m.label}</p>
              <span className={`rounded-full px-2 py-0.5 text-[7px] uppercase tracking-[0.1em] font-bold ring-1 ${card.rarity === "legendary" ? "text-gold ring-gold/50 bg-gold/10" : card.rarity === "epic" ? "text-mystic-glow ring-mystic/50 bg-mystic/10" : card.rarity === "rare" ? "text-azure ring-azure/50 bg-azure/10" : "text-muted-foreground ring-muted-foreground/30 bg-muted/10"}`}>{card.rarity}</span>
            </div>
            <span className="font-display text-[11px] text-gold/80">+{pts}</span>
          </div>
          <p className="font-display text-base text-foreground leading-tight mt-1 truncate">{card.name}</p>
        </div>
      </div>
      <div className="relative mt-3 flex flex-wrap gap-1.5">
        {card.synergyTags.map((tag) => <span key={tag} className="rounded-full bg-abyss/60 px-2 py-0.5 text-[8px] uppercase tracking-wider text-muted-foreground font-medium ring-1 ring-gold/10">{tag}</span>)}
      </div>
    </motion.div>
  );
}
