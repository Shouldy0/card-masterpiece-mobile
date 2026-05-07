import React, { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/game/store";
import { CARDS, CardType } from "@/game/cards";
import { MobileFrame } from "@/components/Common";
import { CanvasBackground } from "@/components/CanvasBackground";
import { Search, Filter, ChevronDown, Sparkles, LayoutGrid, Zap, Eye, User, Map, Activity, Shield, Shapes, Brain } from "lucide-react";

import { GameCard } from "@/components/GameCard";

type CollectionTab = "CARTE" | "BOARD" | "EFFETTI";

function Collection() {
  const { player } = useGame();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<CollectionTab>("CARTE");
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<CardType | "all">("all");

  const filteredCards = CARDS.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === "all" || c.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-abyss flex items-center justify-center font-serif select-none">
      <CanvasBackground />
      <MobileFrame className="w-full max-w-md h-full px-4 pb-4 pt-6 flex flex-col relative z-10 overflow-hidden">
        
        {/* Header Title */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="font-display text-[10px] text-gold/40 tracking-[0.3em]">12. COLLECTION</span>
          </div>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate({ to: "/home" })}
            className="size-8 rounded-full bg-card/20 flex items-center justify-center ring-1 ring-gold/20"
          >
            <Eye className="size-4 text-gold/60" />
          </motion.button>
        </header>

        {/* Tabs */}
        <div className="flex p-1 bg-card/10 rounded-2xl ring-1 ring-gold/10 mb-6">
          {(["CARTE", "BOARD", "EFFETTI"] as CollectionTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-xl text-[10px] font-bold tracking-[0.2em] transition-all ${
                activeTab === tab 
                  ? "bg-gold/20 text-gold ring-1 ring-gold/40 shadow-[0_0_15px_rgba(255,215,0,0.1)]" 
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Stats & Search */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex flex-col">
            <span className="text-[8px] uppercase tracking-widest text-gold/40 font-bold">Memorie</span>
            <span className="font-display text-sm text-gold">{player.collection.length}/{CARDS.length}</span>
          </div>
          
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-gold/30" />
            <input 
              type="text" 
              placeholder="Cerca memorie..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card/10 ring-1 ring-gold/10 rounded-xl py-2 pl-9 pr-4 text-[10px] text-foreground placeholder:text-gold/20 focus:outline-none focus:ring-gold/30"
            />
          </div>

          <button className="size-9 rounded-xl bg-card/10 ring-1 ring-gold/10 flex items-center justify-center hover:bg-card/20">
            <Filter className="size-4 text-gold/60" />
          </button>
        </div>

        {/* Card Grid */}
        <main className="flex-1 overflow-y-auto pr-1 custom-scrollbar pb-24">
          <div className="grid grid-cols-3 gap-y-6 gap-x-4">
            <AnimatePresence mode="popLayout">
              {filteredCards.map((card, i) => {
                const isOwned = player.collection.includes(card.id);
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <GameCard 
                      card={card} 
                      size="lg" 
                      faded={!isOwned} 
                      glow={isOwned && card.rarity === 'leggendaria'}
                    />
                    <p className="text-[7px] font-medium text-gold/60 uppercase tracking-widest truncate w-full text-center">{card.name}</p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </main>

        {/* Bottom Filter Bar */}
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <div className="bg-abyss/80 backdrop-blur-xl ring-1 ring-gold/20 rounded-2xl p-2 flex items-center justify-between shadow-2xl">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card/20 ring-1 ring-gold/10">
              <span className="text-[8px] font-bold uppercase tracking-widest text-gold/60">Tutte le Tipologie</span>
              <ChevronDown className="size-3 text-gold/40" />
            </button>
            
            <div className="flex items-center gap-1.5 pr-2">
              <TypeToggle active={selectedType === "all"} onClick={() => setSelectedType("all")} icon={<LayoutGrid className="size-3" />} color="gold" />
              <TypeToggle active={selectedType === "archetipo"} onClick={() => setSelectedType("archetipo")} icon={<Brain className="size-3" />} color="azure" />
              <TypeToggle active={selectedType === "ricordo"} onClick={() => setSelectedType("ricordo")} icon={<Shapes className="size-3" />} color="mystic" />
              <TypeToggle active={selectedType === "maschera"} onClick={() => setSelectedType("maschera")} icon={<Shield className="size-3" />} color="emerald" />
            </div>
          </div>
        </div>

      </MobileFrame>
    </div>
  );
}

function TypeToggle({ active, onClick, icon, color }: { active: boolean; onClick: () => void; icon: React.ReactNode; color: string }) {
  const colors: Record<string, string> = {
    gold: "text-gold ring-gold/40 bg-gold/10",
    azure: "text-azure ring-azure/40 bg-azure/10",
    mystic: "text-mystic-glow ring-mystic-glow/40 bg-mystic-glow/10",
    emerald: "text-emerald ring-emerald/40 bg-emerald/10"
  };

  return (
    <button 
      onClick={onClick}
      className={`size-7 rounded-full flex items-center justify-center ring-1 transition-all ${
        active ? colors[color] : "text-white/20 ring-white/10 hover:ring-white/20"
      }`}
    >
      {icon}
    </button>
  );
}

export const Route = createFileRoute("/collection")({ component: Collection });
