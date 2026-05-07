import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileFrame } from "@/components/Common";
import { useSound } from "@/hooks/useSound";
import { ArrowLeft, Award, Lock, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/titles")({ component: Titles });

const TITLES = [
  { n: "Sognatore", lore: "Chi ha varcato la prima soglia.", req: "Completa il tutorial", unlocked: true },
  { n: "Risvegliato", lore: "Coscienza che ha visto la verità.", req: "Vinci 10 partite", unlocked: true },
  { n: "Coscienza Spezzata", lore: "Frantumato e ricomposto.", req: "Subisci 5 sconfitte di fila", unlocked: true },
  { n: "Dominatore", lore: "Conquistatore di tutti i territori.", req: "Vinci 50 partite ranked", unlocked: false },
  { n: "Eco Eterno", lore: "La cui voce risuona nei sogni altrui.", req: "Raggiungi rank Architetto", unlocked: false },
  { n: "Architetto del Sogno", lore: "Plasmatore di realtà oniriche.", req: "Completa il Pass S3", unlocked: false },
  { n: "Custode dei Ricordi", lore: "Guardiano della Memoria.", req: "Colleziona 18 carte rare", unlocked: false },
  { n: "Tessitore di Maschere", lore: "Maestro dell'inganno.", req: "Gioca 100 Maschere", unlocked: false },
];

function Titles() {
  const [equipped, setEquipped] = useState("Sognatore");
  const { play } = useSound();
  const equip = (t: string) => { play("lock"); setEquipped(t); toast.success(`Titolo equipaggiato: ${t}`); };

  return (
    <MobileFrame>
      <header className="flex items-center gap-2 px-4 pt-6">
        <Link to="/profile" className="flex size-9 items-center justify-center rounded-full bg-card/60 ring-1 ring-gold/30"><ArrowLeft className="h-4 w-4 text-gold" /></Link>
        <h1 className="flex-1 text-center font-display text-lg gold-text tracking-widest">TITOLI</h1>
        <span className="size-9" />
      </header>

      <p className="mt-3 text-center text-[10px] uppercase tracking-widest text-muted-foreground">Sbloccati: {TITLES.filter(t => t.unlocked).length}/{TITLES.length}</p>

      <div className="mt-4 space-y-2 px-4 pb-6 overflow-y-auto">
        {TITLES.map((t) => {
          const isEq = equipped === t.n;
          return (
            <button
              key={t.n}
              disabled={!t.unlocked}
              onClick={() => equip(t.n)}
              className={`w-full text-left flex items-center gap-3 rounded-xl gold-frame p-3 transition-all ${isEq ? "bg-mystic/40 ring-2 ring-gold" : "bg-card/60"} ${!t.unlocked && "opacity-40"}`}
            >
              <div className={`flex size-10 items-center justify-center rounded-lg ${isEq ? "bg-gold/30" : "bg-mystic/20"}`}>
                {!t.unlocked ? <Lock className="h-4 w-4 text-muted-foreground" /> : <Award className={`h-5 w-5 ${isEq ? "text-gold" : "text-mystic-glow"}`} />}
              </div>
              <div className="flex-1">
                <p className="font-display text-sm">{t.n}</p>
                <p className="text-[10px] text-muted-foreground italic">"{t.lore}"</p>
                <p className="mt-1 text-[9px] uppercase tracking-widest text-gold/60">{t.req}</p>
              </div>
              {isEq && <Check className="h-4 w-4 text-gold" />}
            </button>
          );
        })}
      </div>
    </MobileFrame>
  );
}
