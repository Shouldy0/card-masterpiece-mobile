import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect } from "react";
import { MobileFrame } from "@/components/Common";
import { BottomNav } from "@/components/BottomNav";
import { useGame } from "@/game/store";
import { sounds } from "@/utils/audio";
import { Coins, Diamond, Plus, Library, BookOpen, ShoppingBag, Sparkles, Crown, Eye, Zap, Trophy } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { GameCard } from "@/components/GameCard";
import { cardsById } from "@/game/cards";

export const Route = createFileRoute("/home")({ component: Home });

function Home() {
  const { player, startMatch, onboardingPackOpened, openStarterPack } = useGame();
  const navigate = useNavigate();
  const { play } = useSound();

  useEffect(() => {
    sounds.startSceneMusic("home");
    return () => {};
  }, []);

  const play_btn = () => { play("whoosh"); startMatch(); navigate({ to: "/vs" }); };

  return (
    <MobileFrame>
      {/* top bar */}
      <header className="flex items-center justify-between px-4 pt-6">
        <Link to="/profile" className="flex items-center gap-2">
          <div className="size-10 rounded-full ring-2 ring-gold/60 bg-gradient-to-br from-mystic to-abyss flex items-center justify-center">
            <Eye className="h-4 w-4 text-gold" />
          </div>
          <div>
            <p className="font-display text-sm text-foreground leading-none">Dreamer</p>
            <p className="text-[10px] text-muted-foreground">Livello {player.level}</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <ResourcePill icon={Coins} value={player.gold} color="text-gold" />
          <ResourcePill icon={Diamond} value={player.gems} color="text-mystic-glow" />
          <button className="size-7 rounded-full bg-mystic/30 ring-1 ring-gold/40 flex items-center justify-center text-gold">
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </header>

      {/* UTILITY BAR: Missioni / Pass / Ranked */}
      <div className="mt-4 flex items-center justify-center gap-3 px-6 flex-wrap">
        <Link to="/events" className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-card/10 ring-1 ring-gold/10 hover:bg-card/20 transition-all group">
          <Sparkles className="h-4 w-4 text-gold/60 group-hover:text-gold" />
          <span className="text-[9px] uppercase tracking-widest text-gold/60 group-hover:text-gold">Missioni</span>
        </Link>
        <Link to="/pass" className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-card/10 ring-1 ring-gold/10 hover:bg-card/20 transition-all group">
          <Crown className="h-4 w-4 text-gold/60 group-hover:text-gold" />
          <span className="text-[9px] uppercase tracking-widest text-gold/60 group-hover:text-gold">Pass</span>
        </Link>
        <Link to="/ranked" className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-card/10 ring-1 ring-gold/10 hover:bg-card/20 transition-all group">
          <Trophy className="h-4 w-4 text-gold/60 group-hover:text-gold" />
          <span className="text-[9px] uppercase tracking-widest text-gold/60 group-hover:text-gold">Ranked</span>
        </Link>
      </div>

      {/* HERO SECTION */}
      <div className="relative mt-4 flex flex-1 flex-col items-center justify-center px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="relative mb-8"
        >
          <div className="absolute -inset-16 rounded-full bg-mystic/20 blur-3xl" />
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3] 
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-1/2 -z-10 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-mystic-glow/30 via-gold/10 to-transparent blur-2xl" 
          />
           
          <div className="relative flex flex-col items-center">
            <motion.h1
              initial={{ opacity: 0, letterSpacing: "0.5em", paddingLeft: "0.5em" }}
              animate={{ opacity: 1, letterSpacing: "0.4em", paddingLeft: "0.4em" }}
              transition={{ duration: 1.2 }}
              className="font-display text-5xl gold-text text-center"
            >
              REVERIE
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-2 text-[10px] uppercase tracking-[0.4em] text-gold/40 pl-[0.4em] text-center"
            >
              Sintonizza la tua coscienza
            </motion.p>
          </div>
        </motion.div>

        {/* PRIMARY ACTIONS: Clean & Large */}
        <div className="w-full max-w-xs space-y-4">
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            onClick={play_btn} 
            className="w-full py-5 rounded-[2.5rem] bg-gradient-to-br from-mystic via-mystic-glow to-mystic text-foreground font-display text-lg font-bold uppercase tracking-[0.3em] shadow-[0_10px_40px_rgba(150,100,255,0.3)] border border-gold/20"
          >
            GIOCA BATTAGLIA
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            onClick={() => navigate({ to: "/combo" })} 
            className="w-full py-4 rounded-[2rem] bg-gradient-to-r from-abyss/40 via-card/40 to-abyss/40 text-gold font-display text-sm font-bold uppercase tracking-[0.3em] shadow-xl border border-gold/20 backdrop-blur-md"
          >
            MODALITÀ SOGNO
          </motion.button>

          <div className="pt-8 text-center">
             <p className="text-[8px] uppercase tracking-[0.5em] text-gold/20">Esplora le profondità del tuo inconscio</p>
          </div>
        </div>
      </div>

      <BottomNav />

      {/* STARTER PACK OPENING OVERLAY */}
      <AnimatePresence>
        {!onboardingPackOpened && (
          <StarterPackOpening onOpen={openStarterPack} />
        )}
      </AnimatePresence>
    </MobileFrame>
  );
}

function StarterPackOpening({ onOpen }: { onOpen: () => string[] }) {
  const [stage, setStage] = React.useState<"idle" | "opening" | "revealing" | "done">("idle");
  const [revealed, setRevealed] = React.useState<string[]>([]);
  const { play } = useSound();

  const handleOpen = () => {
    setStage("opening");
    play("ripple");
    
    // Phase 1: The "Burst"
    setTimeout(() => {
      const cards = onOpen();
      setStage("revealing");
      play("victory");
      
      // Phase 2: Sequential Reveal
      cards.forEach((id, i) => {
        setTimeout(() => {
          setRevealed(prev => [...prev, id]);
          play("card_deal");
        }, i * 150);
      });

      setTimeout(() => setStage("done"), cards.length * 150 + 500);
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center p-6 overflow-hidden"
    >
      {/* Background Magic Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] border border-gold/10 rounded-full border-dashed"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[400px] border border-mystic/10 rounded-full border-dashed"
        />
      </div>

      {stage === "idle" || stage === "opening" ? (
        <div className="flex flex-col items-center z-10">
          <motion.div
            layoutId="starter-pack"
            animate={stage === "opening" ? { 
              scale: [1, 1.4, 0],
              rotate: [0, 10, -10, 720],
              y: [0, -50, 0]
            } : { 
              y: [0, -15, 0],
              rotateZ: [0, 2, -2, 0]
            }}
            transition={{ duration: stage === "opening" ? 2 : 4, repeat: stage === "opening" ? 0 : Infinity }}
            className="relative size-64 mb-12 cursor-pointer group"
            onClick={stage === "idle" ? handleOpen : undefined}
          >
             {/* Glowing Aura */}
             <div className="absolute -inset-10 bg-gold/10 blur-3xl rounded-full animate-pulse" />
             <div className="absolute -inset-20 bg-mystic/5 blur-[80px] rounded-full" />             {/* The Pack Asset */}
             <div className="absolute inset-0 rounded-[2rem] shadow-[0_0_60px_rgba(150,100,255,0.2)] overflow-hidden">
                <img 
                  src="/assets/starter-pack.png" 
                  alt="Starter Pack" 
                  className="size-full object-cover"
                />
                {/* Dynamic Inner Glow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10 mix-blend-overlay" />
             </div>

             {/* Interact Hint */}
             {stage === "idle" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-gold/60 uppercase tracking-[0.4em] animate-pulse"
                >
                  Tocca per sintonizzare
                </motion.div>
             )}
          </motion.div>
          
          <h2 className="font-display text-2xl text-gold tracking-widest uppercase mb-2">Pacco Iniziale</h2>
          <p className="text-sm text-foreground/40 mb-8 max-w-xs text-center leading-relaxed">Le tue prime 15 memorie stanno per manifestarsi nella tua coscienza.</p>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-3xl text-gold tracking-widest uppercase mb-1">Coscienza Risvegliata</h2>
            <div className="flex items-center justify-center gap-4">
               <div className="h-px w-12 bg-gold/20" />
               <p className="text-[10px] text-white/40 uppercase tracking-[0.4em]">15 Memorie Sintonizzate</p>
               <div className="h-px w-12 bg-gold/20" />
            </div>
          </motion.div>
          
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-12 p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md max-h-[60vh] overflow-y-auto custom-scrollbar shadow-inner">
            {revealed.map((id, idx) => (
              <motion.div 
                key={`${id}-${idx}`}
                initial={{ opacity: 0, scale: 0, rotate: -20, y: 50 }}
                animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
              >
                <GameCard card={cardsById[id]} size="sm" />
              </motion.div>
            ))}
            
            {/* Placeholders for remaining to-be-revealed cards */}
            {Array.from({ length: 15 - revealed.length }).map((_, i) => (
              <div key={`empty-${i}`} className="size-24 rounded-xl bg-white/5 border border-white/5 animate-pulse" />
            ))}
          </div>

          <AnimatePresence>
            {stage === "done" && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()} 
                className="px-16 py-5 rounded-full bg-gradient-to-r from-gold via-mystic-glow to-gold text-abyss font-display font-black text-xs tracking-[0.3em] uppercase shadow-[0_0_50px_rgba(255,215,0,0.4)] transition-shadow hover:shadow-[0_0_70px_rgba(255,215,0,0.6)]"
              >
                INIZIA IL VIAGGIO
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Opening Flash Overlay */}
      {stage === "opening" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, times: [0, 0.8, 1] }}
          className="fixed inset-0 bg-white z-[110] pointer-events-none mix-blend-overlay"
        />
      )}
    </motion.div>
  );
}

function ResourcePill({ icon: Icon, value, color }: { icon: any; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-card/80 px-2 py-1 ring-1 ring-gold/30">
      <Icon className={`h-3.5 w-3.5 ${color}`} />
      <span className="font-display text-xs text-foreground">{value.toLocaleString("it-IT")}</span>
    </div>
  );
}
