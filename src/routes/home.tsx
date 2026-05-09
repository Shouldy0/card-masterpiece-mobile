import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
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
  const { player, startMatch } = useGame();
  const navigate = useNavigate();

  return (
    <MobileFrame className="items-center justify-center">
      <h1 className="text-4xl gold-text">REVERIE</h1>
      <p className="text-muted-foreground mt-4 uppercase tracking-widest text-[10px]">Accesso Effettuato</p>
      
      {!player ? (
        <div className="mt-8 size-8 border-2 border-gold/20 border-t-gold animate-spin rounded-full" />
      ) : (
        <div className="flex flex-col items-center gap-6 mt-12">
          <p className="text-gold font-display">Livello {player.level}</p>
          <button 
            onClick={() => { startMatch(); navigate({ to: "/vs" }); }}
            className="px-12 py-4 rounded-full bg-mystic text-white font-display text-xs uppercase tracking-widest ring-1 ring-gold/40"
          >
            INIZIA BATTAGLIA
          </button>
        </div>
      )}
      
      <BottomNav />
    </MobileFrame>
  );
}

function StarterPackOpening({ onOpen, onComplete }: { onOpen: () => string[], onComplete: () => void }) {
  const [stage, setStage] = React.useState<"idle" | "opening" | "ritual" | "revealing" | "done">("idle");
  const [cards, setCards] = React.useState<string[]>([]);
  const [revealed, setRevealed] = React.useState<Set<number>>(new Set());
  const { play } = useSound();
  
  const packRef = useRef<HTMLDivElement>(null);

  // Ritual Logic: Drag pack to pedestal
  const handleRitualComplete = () => {
    setStage("opening");
    play("ripple");
    
    setTimeout(() => {
      const generatedCards = onOpen();
      setCards(generatedCards);
      setStage("revealing");
      play("victory");
    }, 2000);
  };

  const handleCardFlip = (idx: number) => {
    if (revealed.has(idx)) return;
    setRevealed(prev => new Set([...prev, idx]));
    play("card_deal");
    
    // Auto-complete stage if all flipped
    if (revealed.size + 1 === cards.length) {
      setTimeout(() => setStage("done"), 1000);
    }
  };

  const revealAll = () => {
    cards.forEach((_, i) => {
      setTimeout(() => {
        setRevealed(prev => new Set([...prev, i]));
        play("card_deal");
      }, i * 100);
    });
    setTimeout(() => setStage("done"), cards.length * 100 + 1000);
  };

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


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black backdrop-blur-3xl flex flex-col items-center justify-center p-6 overflow-hidden"
    >
      {stage === "idle" || stage === "opening" ? (
        <div className="flex flex-col items-center justify-center z-10 w-full h-full relative">
          
          {/* Sintonization Pedestal / Target */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
             <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="size-[320px] rounded-full border-2 border-gold/20 border-dashed flex items-center justify-center"
             >
                <div className="size-[280px] rounded-full border border-mystic-glow/10 flex items-center justify-center">
                   <div className="size-[200px] rounded-full bg-gold/5 blur-2xl" />
                </div>
             </motion.div>
          </div>

          <motion.div
            layoutId="starter-pack"
            drag={stage === "idle"}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.8}
            onDragEnd={(_, info) => {
               // Check if dragged to center
               const dist = Math.sqrt(info.offset.x ** 2 + info.offset.y ** 2);
               if (dist > 100) {
                  handleRitualComplete();
               }
            }}
            whileDrag={{ scale: 1.1, rotateZ: 5 }}
            style={{ 
              rotateX: stage === "idle" ? rotateX : 0, 
              rotateY: stage === "idle" ? rotateY : 0,
              transformStyle: "preserve-3d" 
            }}
            animate={stage === "opening" ? { 
              scale: [1, 1.5, 0],
              rotateZ: [0, 20, -20, 1080],
              y: [0, -150, 0],
              filter: ["brightness(1) blur(0px)", "brightness(4) blur(10px)", "brightness(0) blur(20px)"]
            } : { 
              y: [0, -20, 0],
            }}
            transition={{ duration: stage === "opening" ? 2 : 4, repeat: stage === "opening" ? 0 : Infinity }}
            className="relative size-80 cursor-grab active:cursor-grabbing z-20"
          >
             {/* Masterpiece Artifact */}
             <div className="absolute inset-0 drop-shadow-[0_0_80px_rgba(150,100,255,0.4)]">
                <img 
                  src="/assets/starter-pack.png" 
                  alt="Starter Pack" 
                  className="size-full object-contain mix-blend-lighten select-none pointer-events-none"
                />
             </div>

             {/* Dynamic Shine Overlay */}
             <motion.div 
               style={{
                 x: useTransform(mouseX, [-150, 150], [-50, 50]),
                 y: useTransform(mouseY, [-150, 150], [-50, 50]),
               }}
               className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent opacity-50 pointer-events-none"
             />
          </motion.div>
          
          <div className="absolute bottom-20 flex flex-col items-center">
            <motion.h2 
               animate={stage === "opening" ? { opacity: 0 } : { opacity: 1 }}
               className="font-display text-2xl gold-text tracking-[0.3em] uppercase mb-4"
            >
              Sintonia Necessaria
            </motion.h2>
            <motion.p 
               animate={stage === "opening" ? { opacity: 0 } : { opacity: 1 }}
               className="text-[10px] text-white/40 uppercase tracking-[0.5em] animate-pulse text-center"
            >
              Trascina l'artefatto per liberarlo
            </motion.p>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center z-10 max-w-lg px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h2 className="font-display text-2xl text-gold tracking-widest uppercase mb-1">Rivelazione Sintonizzata</h2>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.4em]">Tocca le memorie per risvegliarle ({revealed.size}/{cards.length})</p>
          </motion.div>
          
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-10 p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md w-full max-h-[60vh] overflow-y-auto custom-scrollbar shadow-inner">
            {cards.map((id, idx) => (
              <motion.div 
                key={`${id}-${idx}`}
                initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                animate={{ opacity: 1, scale: 1, rotateY: revealed.has(idx) ? 0 : 180 }}
                transition={{ delay: idx * 0.05, duration: 0.6, type: "spring" }}
                className="aspect-[2/3] relative cursor-pointer"
                onClick={() => handleCardFlip(idx)}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Back Face */}
                <div 
                  className={`absolute inset-0 rounded-lg bg-gradient-to-br from-mystic-dark to-black border border-gold/30 flex items-center justify-center overflow-hidden transition-opacity duration-300 ${revealed.has(idx) ? 'opacity-0' : 'opacity-100'}`}
                  style={{ backfaceVisibility: "hidden" }}
                >
                   <div className="size-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
                   <div className="absolute inset-2 border border-gold/10 rounded-md" />
                   <div className="size-8 rounded-full border border-gold/40 flex items-center justify-center animate-pulse">
                      <div className="size-2 bg-gold/60 rounded-full" />
                   </div>
                </div>

                {/* Front Face (Actual Card) */}
                <div 
                  className={`absolute inset-0 transition-opacity duration-300 ${revealed.has(idx) ? 'opacity-100' : 'opacity-0'}`}
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(0deg)" }}
                >
                   <GameCard card={cardsById[id]} size="sm" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col gap-4 w-full">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={revealAll}
              className="px-8 py-3 rounded-full bg-white/10 text-white font-display text-[10px] tracking-widest uppercase border border-white/20 hover:bg-white/20 transition-colors"
            >
              Risveglia Tutto
            </motion.button>

            {stage === "done" && (
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onComplete} 
                className="px-16 py-5 rounded-full bg-gradient-to-r from-gold via-mystic-glow to-gold text-black font-display font-black text-xs tracking-[0.3em] uppercase shadow-[0_0_50px_rgba(255,215,0,0.4)]"
              >
                INIZIA IL VIAGGIO
              </motion.button>
            )}
          </div>
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
