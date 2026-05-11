import React, { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/game/store";
import { CardDef, CardType, CARDS, TERRITORIES } from "@/game/cards";
import { MobileFrame } from "@/components/Common";
import { CanvasBackground } from "@/components/CanvasBackground";
import {
  Search,
  Filter,
  ChevronDown,
  Sparkles,
  LayoutGrid,
  Zap,
  Eye,
  User,
  Map,
  Activity,
  Shield,
  Shapes,
  Brain,
  X,
  Info,
  Layers,
  Sword,
  Heart,
} from "lucide-react";
import { GameCard } from "@/components/GameCard";
import { BottomNav } from "@/components/BottomNav";
import { sounds } from "@/utils/audio";

type CollectionTab = "CARTE" | "BOARD" | "EFFETTI";

function Collection() {
  const { player, syncCollection } = useGame();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<CollectionTab>("CARTE");
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<CardType | "all">("all");
  const [selectedCard, setSelectedCard] = useState<CardDef | null>(null);

  // Sync collection on mount to ensure new cards are visible
  React.useEffect(() => {
    syncCollection();
  }, [syncCollection]);

  const filteredCards = CARDS.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === "all" || c.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="fixed inset-0 overflow-hidden bg-black flex items-center justify-center font-serif select-none">
      <CanvasBackground />

      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] size-64 bg-mystic/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] size-64 bg-gold/10 rounded-full blur-[120px] pointer-events-none" />

      <MobileFrame className="w-full h-full flex flex-col bg-transparent">
        {/* TOP SAFE AREA + HEADER */}
        <div className="shrink-0 pt-[env(safe-area-inset-top,20px)] bg-gradient-to-b from-black/60 to-transparent">
          <header className="flex items-center justify-between mb-4 px-6 pt-4">
            <div className="flex flex-col">
              <span className="font-display text-[8px] text-gold/40 tracking-[0.5em] uppercase font-black">
                Archivio Onirico
              </span>
              <h1 className="font-display text-xl text-gold tracking-widest uppercase mt-1">
                Collezione
              </h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate({ to: "/home" })}
              className="size-10 rounded-2xl bg-gold/10 flex items-center justify-center ring-1 ring-gold/30 shadow-[0_0_20px_rgba(255,215,0,0.1)]"
            >
              <X className="size-5 text-gold" />
            </motion.button>
          </header>

          <div className="px-6 mb-4">
            <div className="flex p-1 bg-black/40 backdrop-blur-md rounded-2xl ring-1 ring-gold/20 shadow-2xl">
              {(["CARTE", "BOARD", "EFFETTI"] as CollectionTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    sounds.play("tick");
                  }}
                  className={`flex-1 py-2 rounded-xl text-[9px] font-black tracking-[0.2em] uppercase transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-gold/20 text-gold ring-1 ring-gold/40 shadow-[0_0_20px_rgba(255,215,0,0.2)]"
                      : "text-white/20 hover:text-white/50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto px-6 no-scrollbar pb-40">
          {activeTab === "CARTE" && (
            <>
              {/* Stats & Search */}
              <div className="flex items-center justify-between gap-4 mb-12 pt-2">
                <div className="flex flex-col px-1">
                  <span className="text-[7px] uppercase tracking-[0.3em] text-gold/40 font-black">
                    Sincronia
                  </span>
                  <span className="font-display text-base text-white">
                    {player.collection.length}
                    <span className="text-gold/40 text-[10px] ml-1">/ {CARDS.length}</span>
                  </span>
                </div>

                <div className="flex-1 relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-gold/30 group-focus-within:text-gold transition-colors" />
                  <input
                    type="text"
                    placeholder="Cerca memorie..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-black/40 backdrop-blur-sm ring-1 ring-gold/20 rounded-xl py-2.5 pl-9 pr-4 text-[10px] text-foreground placeholder:text-gold/20 focus:outline-none focus:ring-gold/50 transition-all font-medium tracking-wider"
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="size-10 rounded-xl bg-gold/5 ring-1 ring-gold/20 flex items-center justify-center hover:bg-gold/10 transition-colors"
                >
                  <Filter className="size-4 text-gold/60" />
                </motion.button>
              </div>

              {/* Card Grid */}
              <div className="grid grid-cols-2 gap-y-16 gap-x-12 mb-20">
                <AnimatePresence mode="popLayout">
                  {filteredCards.map((card, i) => {
                    // FORCE UNLOCK FOR NEW ARCHETYPE CARDS TO SHOW THEM IMMEDIATELY
                    const isOwned =
                      player.collection.includes(card.id) || card.type === "archetipo";
                    return (
                      <motion.div
                        key={card.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                          delay: (i % 10) * 0.05,
                          duration: 0.4,
                          ease: [0.23, 1, 0.32, 1],
                        }}
                        className="flex flex-col items-center"
                      >
                        <GameCard
                          card={card}
                          size="md"
                          faded={!isOwned}
                          glow={isOwned && card.rarity === "leggendaria"}
                          onClick={() => {
                            if (isOwned) {
                              setSelectedCard(card);
                              sounds.play("card_deal");
                            }
                          }}
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </>
          )}

          {activeTab === "BOARD" && (
            <div className="space-y-4 py-4">
              {TERRITORIES.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-gold/5 backdrop-blur-sm rounded-[2rem] p-5 ring-1 ring-gold/20 flex gap-5 items-center group hover:bg-gold/10 transition-all border-l-2 border-gold/40"
                >
                  <div
                    className="size-20 rounded-2xl bg-black flex items-center justify-center text-4xl ring-1 ring-gold/30 shadow-2xl group-hover:scale-110 transition-transform duration-500"
                    style={{ color: t.accent }}
                  >
                    {t.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xs text-gold tracking-[0.2em] uppercase font-black">
                      {t.name}
                    </h3>
                    <p className="text-[10px] text-white/60 mt-1.5 leading-relaxed font-medium">
                      {t.rule}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "EFFETTI" && (
            <div className="space-y-4 py-4">
              <EffectItem
                icon={<Sword className="size-5 text-gold" />}
                label="POTERE"
                desc="Il valore numerico di una memoria. Il giocatore con il potere totale più alto in un territorio lo controlla."
              />
              <EffectItem
                icon={<Layers className="size-5 text-blue-400" />}
                label="SINERGIA"
                desc="Bonus ottenuti combinando memorie con tag simili o complementari."
              />
              <EffectItem
                icon={<Zap className="size-5 text-purple-400" />}
                label="RIVELAZIONE"
                desc="Effetto che si attiva immediatamente quando la memoria viene giocata sul campo."
              />
              <EffectItem
                icon={<Shield className="size-5 text-emerald-400" />}
                label="MASCHERA"
                desc="Memorie difensive che spesso indeboliscono il potere delle memorie avversarie."
              />
              <EffectItem
                icon={<Heart className="size-5 text-rose-400" />}
                label="CHIAREZZA"
                desc="I tuoi punti vita. Se la tua Chiarezza scende a zero, il sogno diventa un incubo."
              />
            </div>
          )}
        </div>

        {/* BOTTOM FIXED AREA */}
        <div className="shrink-0 relative z-30">
          {activeTab === "CARTE" && (
            <div className="absolute bottom-[80px] left-6 right-6 pb-[env(safe-area-inset-bottom,0px)]">
              <div className="bg-black/60 backdrop-blur-2xl ring-1 ring-gold/30 rounded-2xl p-2.5 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t border-white/5">
                <button className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gold/10 ring-1 ring-gold/20 group">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gold/80">
                    Filtri Avanzati
                  </span>
                  <ChevronDown className="size-3 text-gold/40 group-hover:text-gold transition-colors" />
                </button>

                <div className="flex items-center gap-2 pr-2">
                  <TypeToggle
                    active={selectedType === "all"}
                    onClick={() => setSelectedType("all")}
                    icon={<LayoutGrid className="size-3" />}
                    color="gold"
                  />
                  <TypeToggle
                    active={selectedType === "archetipo"}
                    onClick={() => setSelectedType("archetipo")}
                    icon={<Brain className="size-3" />}
                    color="blue"
                  />
                  <TypeToggle
                    active={selectedType === "ricordo"}
                    onClick={() => setSelectedType("ricordo")}
                    icon={<Shapes className="size-3" />}
                    color="purple"
                  />
                  <TypeToggle
                    active={selectedType === "maschera"}
                    onClick={() => setSelectedType("maschera")}
                    icon={<Shield className="size-3" />}
                    color="emerald"
                  />
                </div>
              </div>
            </div>
          )}
          <div className="bg-gradient-to-t from-black via-black/80 to-transparent pb-[env(safe-area-inset-bottom,0px)]">
            <BottomNav />
          </div>
        </div>

        {/* Card Detail Modal (Discovery Mode) */}
        <AnimatePresence>
          {selectedCard && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setSelectedCard(null);
                  sounds.play("lock");
                }}
                className="absolute inset-0 bg-black/95 backdrop-blur-xl"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50, rotateY: 90 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50, rotateY: -90 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="relative w-full max-w-sm flex flex-col items-center"
              >
                <div className="relative group">
                  <GameCard card={selectedCard} size="xl" />
                  <div className="absolute -top-4 -left-4 size-12 border-t-2 border-l-2 border-gold/40 rounded-tl-3xl pointer-events-none" />
                  <div className="absolute -bottom-4 -right-4 size-12 border-b-2 border-r-2 border-gold/40 rounded-br-3xl pointer-events-none" />
                </div>

                <div className="mt-10 w-full space-y-6 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2 className="font-display text-2xl text-gold tracking-[0.3em] uppercase font-black drop-shadow-2xl">
                      {selectedCard.name}
                    </h2>
                    <div className="flex justify-center gap-3 mt-3">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/80 px-4 py-1.5 rounded-xl bg-white/5 ring-1 ring-white/10">
                        {selectedCard.type}
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gold/80 px-4 py-1.5 rounded-xl bg-gold/10 ring-1 ring-gold/30">
                        {selectedCard.rarity}
                      </span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-6 rounded-[2rem] bg-white/5 ring-1 ring-white/10 backdrop-blur-md relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                    <p className="text-xs text-white/90 leading-relaxed font-medium">
                      {selectedCard.text}
                    </p>
                  </motion.div>

                  {selectedCard.flavor && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-[11px] italic text-gold/50 font-serif leading-relaxed px-8 opacity-80"
                    >
                      "{selectedCard.flavor}"
                    </motion.p>
                  )}

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    onClick={() => setSelectedCard(null)}
                    className="mt-4 px-8 py-3 rounded-full bg-gold text-black font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 transition-transform"
                  >
                    Torna all'Archivio
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </MobileFrame>
    </div>
  );
}

function EffectItem({ icon, label, desc }: { icon: React.ReactNode; label: string; desc: string }) {
  return (
    <div className="bg-card/10 rounded-2xl p-4 ring-1 ring-white/5 flex gap-4 items-start">
      <div className="size-10 rounded-xl bg-card/20 flex items-center justify-center ring-1 ring-white/10 shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-[10px] font-bold text-foreground/90 tracking-widest uppercase">
          {label}
        </h3>
        <p className="text-[10px] text-foreground/50 mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function TypeToggle({
  active,
  onClick,
  icon,
  color,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  color: string;
}) {
  const colors: Record<string, string> = {
    gold: "text-gold ring-gold/40 bg-gold/10",
    blue: "text-blue-400 ring-blue-400/40 bg-blue-400/10",
    purple: "text-purple-400 ring-purple-400/40 bg-purple-400/10",
    emerald: "text-emerald-400 ring-emerald-400/40 bg-emerald-400/10",
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
