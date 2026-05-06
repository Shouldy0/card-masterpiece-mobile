import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileFrame } from "@/components/Common";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/news")({ component: News });

function News() {
  return (
    <MobileFrame>
      <header className="flex items-center gap-2 px-4 pt-6">
        <Link to="/events" className="flex size-9 items-center justify-center rounded-full bg-card/60 ring-1 ring-gold/30"><ArrowLeft className="h-4 w-4 text-gold" /></Link>
        <h1 className="flex-1 text-center font-display text-lg gold-text tracking-widest">NOTIZIE</h1>
        <span className="size-9" />
      </header>

      <div className="mt-4 space-y-3 px-4">
        <article className="overflow-hidden rounded-xl gold-frame bg-card/60">
          <div className="h-32 bg-gradient-to-br from-mystic via-rose/40 to-abyss" />
          <div className="p-3">
            <p className="font-display text-sm">Manutenzione Programmata</p>
            <p className="mt-1 text-[10px] text-muted-foreground">Mercoledì 15 Maggio · 08:00 / 12:00</p>
            <p className="mt-2 text-xs text-muted-foreground">Nuovi contenuti in arrivo: 12 carte leggendarie e una nuova arena.</p>
          </div>
        </article>
        <article className="overflow-hidden rounded-xl gold-frame bg-card/60">
          <div className="h-32 bg-gradient-to-br from-azure/40 via-mystic/30 to-abyss" />
          <div className="p-3">
            <p className="font-display text-sm">Evento Frammenti del Passato</p>
            <p className="mt-2 text-xs text-muted-foreground">Sblocca ricompense esclusive completando 15 partite questa settimana.</p>
          </div>
        </article>
      </div>
    </MobileFrame>
  );
}
