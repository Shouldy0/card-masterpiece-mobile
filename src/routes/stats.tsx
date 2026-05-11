import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileFrame } from "@/components/Common";
import { useGame } from "@/game/store";
import { ArrowLeft, Trophy, Flame, Crosshair, ShieldCheck, Star } from "lucide-react";
import { CardFromId } from "@/components/GameCard";

export const Route = createFileRoute("/stats")({ component: Stats });

const XP_WEEK = [120, 80, 200, 160, 90, 240, 180];
const DAYS = ["L", "M", "M", "G", "V", "S", "D"];

function Stats() {
  const p = useGame((s) => s.player);
  const winRate = Math.round((p.wins / Math.max(1, p.matches)) * 100);
  const stats = [
    { l: "Vittorie totali", v: p.wins, i: Trophy },
    { l: "Partite", v: p.matches, i: Crosshair },
    { l: "Win rate", v: `${winRate}%`, i: ShieldCheck },
    { l: "Streak attuale", v: 4, i: Flame },
  ];
  const max = Math.max(...XP_WEEK);
  const distribution = [
    { name: "Archetipi", v: 36, c: "from-gold to-amber-eclipse" },
    { name: "Ricordi", v: 28, c: "from-azure to-mystic-glow" },
    { name: "Maschere", v: 22, c: "from-rose to-mystic" },
  ];

  return (
    <MobileFrame>
      <header className="flex items-center gap-2 px-4 pt-6">
        <Link
          to="/profile"
          className="flex size-9 items-center justify-center rounded-full bg-card/60 ring-1 ring-gold/30"
        >
          <ArrowLeft className="h-4 w-4 text-gold" />
        </Link>
        <h1 className="flex-1 text-center font-display text-lg gold-text tracking-widest">
          STATISTICHE
        </h1>
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
        <p className="text-[10px] uppercase tracking-widest text-gold">XP — Ultimi 7 giorni</p>
        <div className="mt-2 rounded-xl gold-frame bg-card/60 p-4">
          <div className="flex h-24 items-end gap-2">
            {XP_WEEK.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-mystic to-mystic-glow"
                  style={{ height: `${(v / max) * 100}%` }}
                />
                <span className="text-[9px] text-muted-foreground">{DAYS[i]}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            Totale: {XP_WEEK.reduce((a, b) => a + b, 0)} XP
          </p>
        </div>
      </div>

      <div className="mt-4 px-4">
        <p className="text-[10px] uppercase tracking-widest text-gold">
          Performance per Territorio
        </p>
        <div className="mt-2 space-y-2">
          {[
            { n: "Memoria d'Infanzia", w: 72 },
            { n: "Trauma Rimosso", w: 41 },
            { n: "Sogno Lucido", w: 65 },
          ].map((r) => (
            <div key={r.n} className="rounded-lg gold-frame bg-card/50 p-3">
              <div className="flex items-center justify-between text-xs">
                <span>{r.n}</span>
                <span className="font-display text-gold">{r.w}%</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-mystic/20">
                <div
                  className="h-full bg-gradient-to-r from-mystic-glow to-gold"
                  style={{ width: `${r.w}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 px-4">
        <p className="text-[10px] uppercase tracking-widest text-gold">
          Distribuzione carte giocate
        </p>
        <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-mystic/10">
          {distribution.map((d) => (
            <div
              key={d.name}
              className={`bg-gradient-to-r ${d.c}`}
              style={{ width: `${(d.v / 86) * 100}%` }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[9px] uppercase tracking-widest text-muted-foreground">
          {distribution.map((d) => (
            <span key={d.name}>
              {d.name} {d.v}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 px-4 pb-6">
        <p className="text-[10px] uppercase tracking-widest text-gold">Carta MVP della settimana</p>
        <div className="mt-2 flex items-center gap-3 rounded-xl gold-frame bg-card/60 p-3">
          <CardFromId id="sogno_lucido" size="sm" />
          <div className="flex-1">
            <p className="font-display text-sm">Sogno Lucido</p>
            <p className="text-[10px] text-muted-foreground">Giocata 14 volte · 12 vittorie</p>
            <div className="mt-1 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3 w-3 text-gold fill-gold" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}
