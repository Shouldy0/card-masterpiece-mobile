import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
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

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseY, [-100, 100], [15, -15]);
  const rotateY = useTransform(mouseX, [-100, 100], [-15, 15]);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (stage !== "idle") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

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
      className="fixed inset-0 z-[100] bg-black backdrop-blur-3xl flex flex-col items-center justify-center p-6 overflow-hidden"
    >
      {stage === "idle" || stage === "opening" ? (
        <div className="flex flex-col items-center z-10" style={{ perspective: "1200px" }}>
          <motion.div
            layoutId="starter-pack"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            style={{ 
              rotateX: stage === "idle" ? rotateX : 0, 
              rotateY: stage === "idle" ? rotateY : 0,
              transformStyle: "preserve-3d" 
            }}
            animate={stage === "opening" ? { 
              scale: [1, 1.4, 0],
              rotate: [0, 10, -10, 720],
              y: [0, -100, 0],
              z: [0, 100, 0]
            } : { 
              y: [0, -15, 0],
              rotateZ: stage === "idle" ? [0, 1, -1, 0] : 0
            }}
            transition={{ duration: stage === "opening" ? 2 : 5, repeat: stage === "opening" ? 0 : Infinity }}
            className="relative size-64 mb-12 cursor-pointer group"
            onClick={stage === "idle" ? handleOpen : undefined}
          >
             {/* THE 3D BOX CONTAINER */}
             <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
                
                {/* FRONT FACE */}
                <div 
                  className="absolute inset-0 bg-black rounded-[2rem] overflow-hidden border border-white/10"
                  style={{ transform: "translateZ(15px)", backfaceVisibility: "hidden" }}
                >
                  <img src="/assets/starter-pack.png" alt="Front" className="size-full object-contain mix-blend-lighten scale-110" />
                  <motion.div 
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 100%)",
                      x: useTransform(mouseX, [-100, 100], [-150, 150]),
                    }}
                    className="absolute inset-[-100%] pointer-events-none mix-blend-overlay"
                  />
                </div>

                {/* BACK FACE */}
                <div 
                  className="absolute inset-0 bg-black rounded-[2rem] overflow-hidden border border-white/10"
                  style={{ transform: "translateZ(-15px) rotateY(180deg)", backfaceVisibility: "hidden" }}
                >
                   <img src="/assets/starter-pack.png" alt="Back" className="size-full object-contain opacity-40 grayscale" />
                </div>

                {/* LEFT SIDE */}
                <div 
                  className="absolute top-0 bottom-0 left-0 w-[30px] bg-gradient-to-r from-[#0a0a0c] to-[#1a1a1c] border-y border-white/5"
                  style={{ transform: "translateX(-15px) rotateY(-90deg)" }}
                />

                {/* RIGHT SIDE */}
                <div 
                  className="absolute top-0 bottom-0 right-0 w-[30px] bg-gradient-to-l from-[#0a0a0c] to-[#1a1a1c] border-y border-white/5"
                  style={{ transform: "translateX(15px) rotateY(90deg)" }}
                />

                {/* TOP SIDE */}
                <div 
                  className="absolute left-0 right-0 top-0 h-[30px] bg-gradient-to-b from-[#1a1a1c] to-[#0a0a0c] border-x border-white/5"
                  style={{ transform: "translateY(-15px) rotateX(90deg)" }}
                />

                {/* BOTTOM SIDE */}
                <div 
                  className="absolute left-0 right-0 bottom-0 h-[30px] bg-gradient-to-t from-[#1a1a1c] to-[#0a0a0c] border-x border-white/5"
                  style={{ transform: "translateY(15px) rotateX(-90deg)" }}
                />
             </div>

             {/* Interact Hint */}
             {stage === "idle" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-gold/60 uppercase tracking-[0.5em] animate-pulse"
                >
                  Sintonizza la Memoria
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
