import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileFrame } from "@/components/Common";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Sparkles, Calendar } from "lucide-react";

export const Route = createFileRoute("/events")({ component: Events });

function Events() {
  return (
    <MobileFrame>
      <header className="flex items-center gap-2 px-4 pt-6">
        <Link to="/home" className="flex size-9 items-center justify-center rounded-full bg-card/60 ring-1 ring-gold/30"><ArrowLeft className="h-4 w-4 text-gold" /></Link>
        <h1 className="flex-1 text-center font-display text-lg gold-text tracking-widest">EVENTI</h1>
        <span className="size-9" />
      </header>

      <div className="mt-4 px-4">
        <p className="text-[10px] uppercase tracking-widest text-gold">Evento Attivo</p>
        <div className="mt-2 overflow-hidden rounded-xl gold-frame">
          <div className="relative h-32 bg-gradient-to-br from-mystic via-rose/40 to-abyss p-4">
            <div className="absolute inset-0 nebula" />
            <div className="relative">
              <p className="font-display text-lg text-foreground">Frammenti del Passato</p>
              <p className="text-[10px] text-muted-foreground">Termina tra: 3g 12h</p>
            </div>
            <div className="relative mt-4 flex items-end justify-between">
              <div className="flex-1">
                <div className="h-1.5 w-3/4 overflow-hidden rounded-full bg-abyss/60">
                  <div className="h-full w-2/5 bg-gradient-to-r from-mystic-glow to-gold" />
                </div>
                <p className="mt-1 text-[9px] text-muted-foreground">Progresso 6/15</p>
              </div>
              <button className="rounded-full gold-frame bg-mystic/40 px-3 py-1 text-[10px] uppercase tracking-widest">Vedi</button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 px-4">
        <p className="text-[10px] uppercase tracking-widest text-gold">Prossimi Eventi</p>
        <div className="mt-2 space-y-2">
          {[{ name: "Incubi della Notte", at: "Inizia tra: 1g 5h", icon: Sparkles }, { name: "Specchi Rotti", at: "Inizia tra: 5g 2h", icon: Calendar }].map((e) => {
            const Icon = e.icon;
            return (
              <div key={e.name} className="flex items-center gap-3 rounded-xl gold-frame bg-card/60 p-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-mystic/30 ring-1 ring-gold/40"><Icon className="h-5 w-5 text-gold" /></div>
                <div className="flex-1">
                  <p className="font-display text-sm">{e.name}</p>
                  <p className="text-[10px] text-muted-foreground">{e.at}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Link to="/news" className="mx-4 mt-6 block rounded-xl gold-frame bg-card/60 p-3 text-center text-[10px] uppercase tracking-widest text-muted-foreground">Vedi Notizie & Manutenzione →</Link>

      <BottomNav />
    </MobileFrame>
  );
}
