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

  const myCards = CARDS.filter((c) => player.collection.includes(c.id) && (filter === "all" || c.type === filter));

  const add = (id: string) => {
    if (deck.length >= 15 || deck.includes(id)) return;
    play("card_deal");
    setDeck([...deck, id]);
  };
  const remove = (id: string) => { play("lock"); setDeck(deck.filter((c) => c !== id)); };
  const save = () => { play("success"); saveDeck(deck); toast.success("Deck salvato"); };

  return (
    <MobileFrame>
      <header className="flex items-center justify-between gap-2 px-4 pt-6">
        <Link to="/home" className="flex size-9 items-center justify-center rounded-full bg-card/60 ring-1 ring-gold/30"><ArrowLeft className="h-4 w-4 text-gold" /></Link>
        <h1 className="font-display text-lg gold-text tracking-widest">DECK BUILDER</h1>
        <button
          onClick={() => saveDeck(deck)}
          disabled={deck.length !== 15}
          className="rounded-full gold-frame bg-mystic/40 px-3 py-1.5 text-[10px] uppercase tracking-widest text-foreground disabled:opacity-40"
        ><Save className="inline h-3 w-3 mr-1" /> Salva</button>
      </header>

      {/* deck slots */}
      <section className="mt-4 px-4">
        <div className="flex items-center justify-between">
          <p className="font-display text-xs uppercase tracking-widest text-gold">Il Tuo Mazzo</p>
          <p className="text-xs text-muted-foreground">{deck.length}/15</p>
        </div>
        <div className="mt-2 grid grid-cols-5 gap-1.5 rounded-xl gold-frame bg-card/40 p-2">
          {Array.from({ length: 15 }).map((_, i) => {
            const id = deck[i];
            const c = id ? CARDS.find((x) => x.id === id) : null;
            return c ? (
              <GameCard key={i} card={c} size="xs" onClick={() => remove(c.id)} />
            ) : (
              <div key={i} className="aspect-[3/4] w-full rounded-md ring-1 ring-dashed ring-gold/20 bg-abyss/40" />
            );
          })}
        </div>
      </section>

      {/* filters */}
      <section className="mt-4 flex-1 overflow-hidden px-4">
        <div className="flex items-center justify-between">
          <p className="font-display text-xs uppercase tracking-widest text-gold">Le Mie Carte</p>
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {(["all","archetipo","ricordo","maschera"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f as any)} className={`shrink-0 rounded-full px-3 py-1 text-[10px] uppercase tracking-widest ring-1 ${filter === f ? "bg-mystic/50 text-foreground ring-gold" : "bg-card/40 text-muted-foreground ring-gold/20"}`}>
              {f === "all" ? "Tutte" : f}
            </button>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2 overflow-y-auto scrollbar-hide pb-4 max-h-[40vh]">
          {myCards.map((c) => (
            <GameCard key={c.id} card={c} size="sm" faded={deck.includes(c.id)} onClick={() => add(c.id)} />
          ))}
        </div>
      </section>

      <BottomNav />
    </MobileFrame>
  );
}
