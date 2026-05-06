import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileFrame } from "@/components/Common";
import { useGame } from "@/game/store";
import { ArrowLeft, Trophy, Flame, Crosshair, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/stats")({ component: Stats });

function Stats() {
  const p = useGame((s) => s.player);
  const winRate = Math.round((p.wins / Math.max(1, p.matches)) * 100);
  const stats = [
    { l: "Vittorie totali", v: p.wins, i: Trophy },
    { l: "Partite", v: p.matches, i: Crosshair },
    { l: "Win rate", v: `${winRate}%`, i: ShieldCheck },
    { l: "Streak attuale", v: 4, i: Flame },
  ];
  return (
    <MobileFrame>
      <header className="flex items-center gap-2 px-4 pt-6">
        <Link to="/profile" className="flex size-9 items-center justify-center rounded-full bg-card/60 ring-1 ring-gold/30"><ArrowLeft className="h-4 w-4 text-gold" /></Link>
        <h1 className="flex-1 text-center font-display text-lg gold-text tracking-widest">STATISTICHE</h1>
        <span className="size-9" />
      </header>
      <div className="mt-6 grid grid-cols-2 gap-3 px-4">
        {stats.map((s) => {
          const Icon = s.i;
          return (
            <div key={s.l} className="rounded-xl gold-frame bg-card/60 p-3">
              <Icon className="h-5 w-5 text-gold" />
              <p className="mt-2 font-display text-2xl text-foreground">{s.v}</p>
              <p className="text-[10px] uppercase text-muted-foreground">{s.l}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-6 px-4">
        <p className="text-[10px] uppercase tracking-widest text-gold">Performance per Territorio</p>
        <div className="mt-2 space-y-2">
          {[{ n: "Memoria d'Infanzia", w: 72 }, { n: "Trauma Rimosso", w: 41 }, { n: "Sogno Lucido", w: 65 }].map((r) => (
            <div key={r.n} className="rounded-lg gold-frame bg-card/50 p-3">
              <div className="flex items-center justify-between text-xs"><span>{r.n}</span><span className="font-display text-gold">{r.w}%</span></div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-mystic/20">
                <div className="h-full bg-gradient-to-r from-mystic-glow to-gold" style={{ width: `${r.w}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </MobileFrame>
  );
}
