import React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useComboGame } from "@/game/combo-store";
import { MobileFrame } from "@/components/Common";
import { CanvasBackground } from "@/components/CanvasBackground";
import { ArrowLeft, Trophy, Lock, Star, Sparkles, Package } from "lucide-react";

function Collection() {
  const store = useComboGame();
  const { achievements, totalGames, unlockedPacks, streak } = store;
  const navigate = useNavigate();

  const allAchievements = [
    { id: "perfect_combo", label: "Combo Perfetta", description: "Ottieni 5 stelle in una combo.", icon: "⭐" },
    { id: "chaos_master", label: "Maestro del Caos", description: "Completa un round durante l'evento Caos.", icon: "🌀" },
    { id: "synergy_expert", label: "Esperto Sinergie", description: "Raggiungi il 100% di sinergia.", icon: "🧬" },
    { id: "collector", label: "Collezionista", description: "Gioca 10 partite totali.", icon: "📚" },
  ];

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-abyss flex items-center justify-center font-serif">
      <CanvasBackground />
      <MobileFrame className="w-full max-w-md h-full px-6 pb-8 pt-4 flex flex-col relative z-10">
        <header className="flex items-center gap-4 h-12 mb-6">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate({ to: "/home" })} className="p-2 rounded-full bg-card/20 ring-1 ring-gold/30 text-gold">
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          <h1 className="font-display text-xl gold-text tracking-widest uppercase">Collezione</h1>
        </header>

        <main className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
          {/* Stats Overview */}
          <section className="grid grid-cols-2 gap-3">
            <div className="bg-card/20 p-4 rounded-3xl ring-1 ring-gold/10">
              <p className="text-2xl font-display text-gold">{totalGames}</p>
              <p className="text-[8px] uppercase tracking-widest text-muted-foreground/60">Partite Totali</p>
            </div>
            <div className="bg-card/20 p-4 rounded-3xl ring-1 ring-gold/10">
              <p className="text-2xl font-display text-mystic-glow">{streak}</p>
              <p className="text-[8px] uppercase tracking-widest text-muted-foreground/60">Serie Attuale</p>
            </div>
          </section>

          {/* Card Packs */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-4 w-4 text-gold/60" />
              <h2 className="font-display text-xs uppercase tracking-[0.2em] text-gold/60">Pacchetti Sbloccati</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {Array.from({ length: unlockedPacks }).map((_, i) => (
                <motion.div key={i} whileHover={{ y: -5 }} className="min-w-[100px] aspect-[2/3] bg-gradient-to-br from-gold/20 to-abyss rounded-2xl ring-2 ring-gold/40 flex flex-col items-center justify-center gap-2 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                  <Sparkles className="h-6 w-6 text-gold" />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-gold">Premium Pack</span>
                </motion.div>
              ))}
              {unlockedPacks === 0 && (
                <div className="w-full py-8 border-2 border-dashed border-gold/10 rounded-3xl flex flex-col items-center justify-center gap-2 opacity-40">
                  <Package className="h-8 w-8" />
                  <p className="text-[8px] uppercase tracking-widest">Gioca ancora per sbloccare pacchetti</p>
                </div>
              )}
            </div>
          </section>

          {/* Badges */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-4 w-4 text-gold/60" />
              <h2 className="font-display text-xs uppercase tracking-[0.2em] text-gold/60">Obiettivi & Medaglie</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {allAchievements.map((ach) => {
                const isUnlocked = achievements.some(a => a.id === ach.id);
                return (
                  <div key={ach.id} className={`p-4 rounded-3xl ring-1 transition-all flex flex-col items-center text-center gap-2 ${isUnlocked ? "bg-card/40 ring-gold/40 shadow-lg" : "bg-card/10 ring-white/5 opacity-40"}`}>
                    <div className="text-3xl mb-1">{isUnlocked ? ach.icon : <Lock className="h-6 w-6 text-muted-foreground/40" />}</div>
                    <h3 className="text-[9px] font-bold uppercase tracking-widest text-foreground">{ach.label}</h3>
                    <p className="text-[7px] text-muted-foreground/60 leading-tight">{ach.description}</p>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </MobileFrame>
    </div>
  );
}

export const Route = createFileRoute("/collection")({ component: Collection });
