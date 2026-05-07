import React, { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useComboGame } from "@/game/combo-store";
import { CARD_POOL } from "@/game/engine/card-pool";
import { MobileFrame } from "@/components/Common";
import { CanvasBackground } from "@/components/CanvasBackground";
import { Search, Filter, ChevronDown, Sparkles, LayoutGrid, Zap, Eye, Ghost, User, Map, Activity } from "lucide-react";

type CollectionTab = "CARTE" | "BOARD" | "EFFETTI";

function Collection() {
  const store = useComboGame();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<CollectionTab>("CARTE");
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  const filteredCards = CARD_POOL.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === "all" || c.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "character": return <User className="size-3" />;
      case "setting": return <Map className="size-3" />;
      case "action": return <Activity className="size-3" />;
      default: return <Sparkles className="size-3" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "text-white/40";
      case "rare": return "text-azure";
      case "epic": return "text-mystic-glow";
      case "legendary": return "text-gold";
      default: return "text-white/20";
    }
  };

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-abyss flex items-center justify-center font-serif select-none">
      <CanvasBackground />
      <MobileFrame className="w-full max-w-md h-full px-4 pb-4 pt-6 flex flex-col relative z-10 overflow-hidden">
        
        {/* Header Title */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="font-display text-[10px] text-gold/40 tracking-[0.3em]">12. COLLECTION</span>
          </div>
          <div className="size-8 rounded-full bg-card/20 flex items-center justify-center ring-1 ring-gold/20">
            <Eye className="size-4 text-gold/60" />
          </div>
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
            <span className="text-[8px] uppercase tracking-widest text-gold/40 font-bold">Trovate</span>
            <span className="font-display text-sm text-gold">{filteredCards.length}/{CARD_POOL.length}</span>
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
        <main className="flex-1 overflow-y-auto pr-1 custom-scrollbar pb-20">
          <div className="grid grid-cols-3 gap-3">
            <AnimatePresence mode="popLayout">
              {filteredCards.map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: i * 0.03 }}
                  className="aspect-[2/2.8] rounded-xl bg-gradient-to-b from-card/30 to-abyss ring-1 ring-gold/20 p-1.5 flex flex-col relative overflow-hidden group shadow-lg"
                >
                  {/* Card Header Info */}
                  <div className="flex justify-between items-start z-10">
                    <div className="size-5 rounded-full bg-abyss/80 ring-1 ring-gold/30 flex items-center justify-center text-[8px] font-bold text-gold">
                      {Math.floor(Math.random() * 5) + 1}
                    </div>
                    <div className={`size-5 rounded-full bg-abyss/80 ring-1 ring-gold/30 flex items-center justify-center ${getRarityColor(card.rarity)}`}>
                      {getTypeIcon(card.type)}
                    </div>
                  </div>

                  {/* Card Image Area */}
                  <div className="flex-1 flex items-center justify-center relative my-1">
                    <div className="absolute inset-0 bg-gold/5 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-4xl filter drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">{card.icon}</span>
                  </div>

                  {/* Card Footer */}
                  <div className="text-center py-1">
                    <p className="text-[8px] font-medium text-foreground truncate px-1 uppercase tracking-tighter">{card.name}</p>
                  </div>

                  {/* Rarity Border Polish */}
                  <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full ${getRarityColor(card.rarity).replace('text-', 'bg-')}`} />
                </motion.div>
              ))}
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
              <TypeToggle active={selectedType === "character"} onClick={() => setSelectedType("character")} icon={<User className="size-3" />} color="azure" />
              <TypeToggle active={selectedType === "setting"} onClick={() => setSelectedType("setting")} icon={<Map className="size-3" />} color="mystic" />
              <TypeToggle active={selectedType === "action"} onClick={() => setSelectedType("action")} icon={<Activity className="size-3" />} color="emerald" />
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
