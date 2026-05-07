import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileFrame } from "@/components/Common";
import { BottomNav } from "@/components/BottomNav";
import { useGame } from "@/game/store";
import { CARDS, CardType } from "@/game/cards";
import { GameCard } from "@/components/GameCard";
import { Filter, Save, ArrowLeft } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { toast } from "sonner";

export const Route = createFileRoute("/deck")({ component: Deck });

function Deck() {
  const { player, saveDeck } = useGame();
  const [deck, setDeck] = useState<string[]>(player.deck);
  const [filter, setFilter] = useState<CardType | "all">("all");
  const { play } = useSound();

  const myCards = CARDS.filter((c) => filter === "all" || c.type === filter);

  const add = (id: string) => {
    if (deck.length >= 15 || deck.includes(id)) return;
    const isOwned = player.collection.includes(id);
    if (!isOwned) return;
    play("card_deal");
    setDeck([...deck, id]);
  };
  const remove = (id: string) => { play("lock"); setDeck(deck.filter((c) => c !== id)); };
  const save = () => { play("success"); saveDeck(deck); toast.success("Deck salvato"); };

  return (
    <MobileFrame>
      <header className="flex items-center justify-between gap-2 px-4 pt-6">
        <Link to="/home" className="flex size-9 items-center justify-center rounded-full bg-card/60 ring-1 ring-gold/30"><ArrowLeft className="h-4 w-4 text-gold" /></Link>
        <h1 className="font-display text-lg gold-text tracking-widest uppercase">Mente</h1>
        <button
          onClick={save}
          disabled={deck.length !== 15}
          className="rounded-full gold-frame bg-mystic/40 px-3 py-1.5 text-[10px] uppercase tracking-widest text-foreground disabled:opacity-40"
        ><Save className="inline h-3 w-3 mr-1" /> Salva</button>
      </header>

      {/* deck slots */}
      <section className="mt-4 px-4">
        <div className="flex items-center justify-between">
          <p className="font-display text-[10px] uppercase tracking-[0.2em] text-gold/60 font-bold">Mazzo Corrente</p>
          <p className="text-[10px] text-muted-foreground font-bold tracking-widest">{deck.length}/15</p>
        </div>
        <div className="mt-2 grid grid-cols-5 gap-1.5 rounded-xl gold-frame bg-card/10 p-2 ring-1 ring-gold/20">
          {Array.from({ length: 15 }).map((_, i) => {
            const id = deck[i];
            const c = id ? CARDS.find((x) => x.id === id) : null;
            return c ? (
              <GameCard key={i} card={c} size="xs" onClick={() => remove(c.id)} />
            ) : (
              <div key={i} className="aspect-[3/4] w-full rounded-md ring-1 ring-dashed ring-gold/20 bg-black/40 flex items-center justify-center">
                <div className="size-1 rounded-full bg-gold/20" />
              </div>
            );
          })}
        </div>
      </section>

      {/* filters */}
      <section className="mt-6 flex-1 overflow-hidden px-4 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <p className="font-display text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Le Mie Memorie</p>
          <Filter className="h-3 w-3 text-gold/40" />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {(["all","archetipo","ricordo","maschera"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f as any)} className={`shrink-0 rounded-xl px-4 py-1.5 text-[9px] uppercase tracking-[0.2em] font-bold transition-all ring-1 ${filter === f ? "bg-gold/20 text-gold ring-gold/40 shadow-lg" : "bg-card/10 text-gold/40 ring-gold/10"}`}>
              {f === "all" ? "Tutte" : f}
            </button>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-y-6 gap-x-4 overflow-y-auto custom-scrollbar pb-24 flex-1">
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
      </section>

      <BottomNav />
    </MobileFrame>
  );
}

      <BottomNav />
    </MobileFrame>
  );
}
