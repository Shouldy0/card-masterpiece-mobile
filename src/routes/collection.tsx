import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileFrame } from "@/components/Common";
import { BottomNav } from "@/components/BottomNav";
import { CARDS, CardDef } from "@/game/cards";
import { GameCard } from "@/components/GameCard";
import { useGame } from "@/game/store";
import { Search, ArrowLeft, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/collection")({ component: Collection });

function Collection() {
  const player = useGame((s) => s.player);
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState<CardDef | null>(null);
  const cards = CARDS.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
  const owned = player.collection.length;

  return (
    <MobileFrame>
      <header className="flex items-center gap-2 px-4 pt-6">
        <Link to="/home" className="flex size-9 items-center justify-center rounded-full bg-card/60 ring-1 ring-gold/30"><ArrowLeft className="h-4 w-4 text-gold" /></Link>
        <h1 className="flex-1 font-display text-lg gold-text tracking-widest text-center">COLLEZIONE</h1>
        <p className="text-[10px] text-muted-foreground">{owned}/{CARDS.length}</p>
      </header>

      <div className="mt-3 flex items-center gap-2 px-4">
        <div className="flex flex-1 items-center gap-2 rounded-full bg-card/60 px-3 py-2 ring-1 ring-gold/30">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cerca carte…" className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 overflow-y-auto scrollbar-hide px-4 pb-4">
        {cards.map((c) => (
          <GameCard key={c.id} card={c} size="md" faded={!player.collection.includes(c.id)} onClick={() => setDetail(c)} showText />
        ))}
      </div>

      <AnimatePresence>
        {detail && (
          <motion.div className="absolute inset-0 z-50 flex items-center justify-center bg-abyss/90 px-6 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button onClick={() => setDetail(null)} className="absolute right-4 top-6 size-9 rounded-full bg-card/60 ring-1 ring-gold/30 flex items-center justify-center"><X className="h-4 w-4 text-gold" /></button>
            <motion.div initial={{ scale: 0.7, rotateY: 180 }} animate={{ scale: 1, rotateY: 0 }} className="flex flex-col items-center">
              <GameCard card={detail} size="xl" glow showText />
              <p className="mt-4 max-w-xs text-center text-sm text-muted-foreground">{detail.text}</p>
              <p className="mt-2 text-[10px] uppercase tracking-widest text-gold">{detail.type} · {detail.rarity}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </MobileFrame>
  );
}
