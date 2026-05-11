import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileFrame } from "@/components/Common";
import { ArrowLeft, Calendar, Wrench, Sparkles, Megaphone } from "lucide-react";

export const Route = createFileRoute("/news")({ component: News });

const NEWS = [
  {
    tag: "MANUTENZIONE",
    icon: Wrench,
    title: "Manutenzione Programmata",
    date: "Mer 15 Mag · 08:00 / 12:00",
    body: "Aggiornamento server in arrivo: nuove carte leggendarie, una nuova arena onirica e bilanciamenti per il territorio Trauma.",
    grad: "from-mystic via-rose/40 to-abyss",
  },
  {
    tag: "EVENTO",
    icon: Sparkles,
    title: "Frammenti del Passato",
    date: "Termina tra 3g 12h",
    body: "Sblocca ricompense esclusive completando 15 partite questa settimana. Ogni vittoria garantisce un Frammento di Memoria.",
    grad: "from-azure/40 via-mystic/30 to-abyss",
  },
  {
    tag: "AGGIORNAMENTO",
    icon: Megaphone,
    title: "Patch 1.4 — Echi Riemersi",
    date: "Oggi · 02:00",
    body: "Riequilibrate 8 carte, nuovo titolo 'Custode dei Sogni' e effetto onirico potenziato per le carte leggendarie.",
    grad: "from-amber-eclipse/40 via-gold/20 to-abyss",
  },
  {
    tag: "STAGIONE",
    icon: Calendar,
    title: "Stagione 3 in arrivo",
    date: "Inizia il 20 Maggio",
    body: "Nuovo Pass, nuovo rank cap (Architetto), 30 livelli di ricompense gratuite e premium con 4 leggendarie esclusive.",
    grad: "from-rose/40 via-amber-eclipse/20 to-abyss",
  },
];

function News() {
  return (
    <MobileFrame>
      <header className="flex items-center gap-2 px-4 pt-6">
        <Link
          to="/events"
          className="flex size-9 items-center justify-center rounded-full bg-card/60 ring-1 ring-gold/30"
        >
          <ArrowLeft className="h-4 w-4 text-gold" />
        </Link>
        <h1 className="flex-1 text-center font-display text-lg gold-text tracking-widest">
          NOTIZIE
        </h1>
        <span className="size-9" />
      </header>

      <div className="mt-4 space-y-3 px-4 pb-8 overflow-y-auto">
        {NEWS.map((n) => {
          const Icon = n.icon;
          return (
            <article key={n.title} className="overflow-hidden rounded-xl gold-frame bg-card/60">
              <div className={`relative h-28 bg-gradient-to-br ${n.grad}`}>
                <div className="absolute inset-0 nebula" />
                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-abyss/60 px-2 py-1 ring-1 ring-gold/40 backdrop-blur">
                  <Icon className="h-3 w-3 text-gold" />
                  <span className="text-[9px] uppercase tracking-widest text-gold">{n.tag}</span>
                </div>
              </div>
              <div className="p-3">
                <p className="font-display text-sm text-foreground">{n.title}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">{n.date}</p>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{n.body}</p>
                <button className="mt-3 text-[10px] uppercase tracking-widest text-gold">
                  Leggi tutto →
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </MobileFrame>
  );
}
