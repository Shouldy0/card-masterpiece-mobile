import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";
import { MobileFrame, FocusGems } from "@/components/Common";
import { BottomNav } from "@/components/BottomNav";
import { useGame } from "@/game/store";
import { CARDS, CardType } from "@/game/cards";
import { GameCard } from "@/components/GameCard";
import { X } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CanvasBackground } from "@/components/CanvasBackground";

export const Route = createFileRoute("/deck")({ component: Deck });

const DECK_SIZE = 15;

function Deck() {
  const { player, saveDeck, syncCollection } = useGame();
  const navigate = useNavigate();
  const [deck, setDeck] = useState<string[]>(player.deck);
  const [filter, setFilter] = useState<CardType | "all">("all");
  const { play } = useSound();

  // Sync collection on mount to ensure new cards are visible
  React.useEffect(() => {
    syncCollection();
  }, [syncCollection]);

  const myCards = CARDS.filter((c) => filter === "all" || c.type === filter);

  const add = (id: string) => {
    if (deck.length >= DECK_SIZE || deck.includes(id)) return;
    const isOwned = player.collection.includes(id);
    if (!isOwned) {
      toast.error("Non possiedi questa memoria");
      return;
    }
    play("card_deal");
    setDeck([...deck, id]);
  };
  const remove = (id: string) => { play("lock"); setDeck(deck.filter((c) => c !== id)); };
  const save = () => { play("success"); saveDeck(deck); toast.success("Deck salvato"); };

  return (
    <div className="fixed inset-0 overflow-hidden bg-black flex items-center justify-center font-serif select-none">
      <CanvasBackground />
      
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] size-64 bg-mystic/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] size-64 bg-gold/10 rounded-full blur-[120px] pointer-events-none" />

      <MobileFrame className="w-full h-[100dvh] flex flex-col bg-transparent">
        
        {/* TOP SAFE AREA + HEADER */}
        <div className="shrink-0 pt-[env(safe-area-inset-top,20px)] bg-gradient-to-b from-black/60 to-transparent">
          <header className="flex items-center justify-between mb-4 px-6 pt-4">
            <div className="flex flex-col">
              <span className="font-display text-[8px] text-gold/40 tracking-[0.5em] uppercase font-black">Laboratorio Arcano</span>
              <h1 className="font-display text-xl text-gold tracking-widest uppercase mt-1">Mente</h1>
            </div>
            <div className="flex items-center gap-3">
              <FocusGems value={deck.length} max={DECK_SIZE} />
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate({ to: "/home" })}
                className="size-10 rounded-2xl bg-gold/10 flex items-center justify-center ring-1 ring-gold/30 shadow-[0_0_20px_rgba(255,215,0,0.1)]"
              >
                <X className="size-5 text-gold" />
              </motion.button>
            </div>
          </header>

          {/* Filters */}
          <div className="px-6 mb-4">
            <div className="flex p-1 bg-black/40 backdrop-blur-md rounded-2xl ring-1 ring-gold/20 shadow-2xl">
              {(["all", "archetipo", "ricordo", "maschera"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`flex-1 py-2 rounded-xl text-[9px] font-black tracking-[0.1em] uppercase transition-all duration-300 ${
                    filter === t 
                      ? "bg-gold/20 text-gold ring-1 ring-gold/40 shadow-[0_0_20px_rgba(255,215,0,0.2)]" 
                      : "text-white/20 hover:text-white/50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto px-6 custom-scrollbar pb-32">
          {/* Deck Preview Row */}
          <div className="mb-12 px-1">
             <div className="flex items-center justify-between mb-4">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gold/60">Mazzo Selezionato</span>
                <button onClick={save} className="text-[8px] font-black uppercase tracking-[0.2em] text-gold underline">Salva Modifiche</button>
             </div>
             <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {deck.map((id) => {
                  const card = CARDS.find(c => c.id === id);
                  if (!card) return null;
                  return (
                    <div key={id} className="shrink-0 transition-transform active:scale-95" onClick={() => remove(id)}>
                      <GameCard card={card} size="xs" />
                    </div>
                  );
                })}
                {deck.length === 0 && <div className="text-[10px] text-white/20 italic py-4">Seleziona memorie sotto...</div>}
             </div>
          </div>

          <div className="grid grid-cols-2 gap-y-12 gap-x-8 pt-10 mb-10 border-t border-white/5">
            {myCards.map((c) => {
              const isOwned = player.collection.includes(c.id);
              const inDeck = deck.includes(c.id);
              return (
                <div key={c.id} className="flex flex-col items-center">
                  <GameCard 
                    card={c} 
                    size="lg" 
                    faded={!isOwned || inDeck} 
                    glow={inDeck}
                    onClick={() => add(c.id)} 
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM FIXED AREA */}
        <div className="shrink-0 relative z-30">
          <div className="bg-gradient-to-t from-black via-black/80 to-transparent pb-[env(safe-area-inset-bottom,0px)]">
            <BottomNav />
          </div>
        </div>
      </MobileFrame>
    </div>
  );
}
