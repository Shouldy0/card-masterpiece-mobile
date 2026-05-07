import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileFrame } from "@/components/Common";
import { ArrowLeft, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/history")({ component: History });

const MATCHES = [
  { r: "win", op: "Ombra Nascosta", date: "Oggi · 14:32", score: "3-0", duration: "4:12", territories: { mem: 12, tra: 8, sog: 15 }, opt: { mem: 5, tra: 4, sog: 9 } },
  { r: "lose", op: "Eco Lontano", date: "Oggi · 13:50", score: "1-2", duration: "5:48", territories: { mem: 8, tra: 4, sog: 10 }, opt: { mem: 11, tra: 9, sog: 7 } },
  { r: "win", op: "Veglia Eterna", date: "Ieri · 22:15", score: "2-1", duration: "6:02", territories: { mem: 10, tra: 12, sog: 6 }, opt: { mem: 8, tra: 7, sog: 11 } },
  { r: "draw", op: "Specchio Vuoto", date: "Ieri · 19:08", score: "1-1", duration: "5:30", territories: { mem: 7, tra: 9, sog: 9 }, opt: { mem: 9, tra: 7, sog: 9 } },
  { r: "win", op: "Sussurro", date: "5 Mag", score: "3-0", duration: "3:54", territories: { mem: 11, tra: 10, sog: 13 }, opt: { mem: 4, tra: 5, sog: 6 } },
  { r: "lose", op: "Maschera del Dolore", date: "5 Mag", score: "0-2", duration: "5:12", territories: { mem: 5, tra: 3, sog: 7 }, opt: { mem: 12, tra: 14, sog: 8 } },
  { r: "win", op: "Catarsi", date: "4 Mag", score: "2-0", duration: "4:48", territories: { mem: 9, tra: 11, sog: 10 }, opt: { mem: 6, tra: 8, sog: 7 } },
  { r: "win", op: "Frammento di Me", date: "4 Mag", score: "3-0", duration: "4:01", territories: { mem: 13, tra: 10, sog: 12 }, opt: { mem: 5, tra: 6, sog: 4 } },
  { r: "lose", op: "Abisso", date: "3 Mag", score: "1-2", duration: "6:21", territories: { mem: 6, tra: 8, sog: 9 }, opt: { mem: 10, tra: 11, sog: 6 } },
  { r: "draw", op: "Io Falso", date: "3 Mag", score: "1-1", duration: "5:00", territories: { mem: 8, tra: 7, sog: 9 }, opt: { mem: 7, tra: 9, sog: 8 } },
  { r: "win", op: "Sogno Lucido", date: "2 Mag", score: "3-0", duration: "3:42", territories: { mem: 14, tra: 11, sog: 16 }, opt: { mem: 3, tra: 5, sog: 4 } },
  { r: "win", op: "Risveglio", date: "2 Mag", score: "2-1", duration: "5:18", territories: { mem: 10, tra: 9, sog: 11 }, opt: { mem: 8, tra: 11, sog: 6 } },
];

const FILTERS = ["Tutte", "Vittorie", "Sconfitte"] as const;

function History() {
  const [filter, setFilter] = useState<typeof FILTERS[number]>("Tutte");
  const [open, setOpen] = useState<number | null>(null);

  const filtered = MATCHES.filter((m) => filter === "Tutte" || (filter === "Vittorie" && m.r === "win") || (filter === "Sconfitte" && m.r === "lose"));

  return (
    <MobileFrame>
      <header className="flex items-center gap-2 px-4 pt-6">
        <Link to="/profile" className="flex size-9 items-center justify-center rounded-full bg-card/60 ring-1 ring-gold/30"><ArrowLeft className="h-4 w-4 text-gold" /></Link>
        <h1 className="flex-1 text-center font-display text-lg gold-text tracking-widest">CRONOLOGIA</h1>
        <span className="size-9" />
      </header>

      <div className="mt-4 flex gap-2 px-4">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`flex-1 rounded-full py-1.5 text-[10px] uppercase tracking-widest ring-1 ${filter === f ? "bg-mystic/50 text-foreground ring-gold" : "bg-card/40 text-muted-foreground ring-gold/20"}`}>{f}</button>
        ))}
      </div>

      <div className="mt-4 space-y-2 px-4 pb-6 overflow-y-auto">
        {filtered.map((m, i) => (
          <div key={i} className="rounded-xl gold-frame bg-card/60 overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center gap-3 p-3">
              <div className={`size-2 rounded-full ${m.r === "win" ? "bg-gold" : m.r === "lose" ? "bg-rose" : "bg-azure"}`} />
              <div className="flex-1 text-left">
                <p className="text-sm">{m.op}</p>
                <p className="text-[10px] text-muted-foreground">{m.date} · {m.duration}</p>
              </div>
              <p className={`font-display text-sm ${m.r === "win" ? "text-gold" : m.r === "lose" ? "text-rose" : "text-azure"}`}>{m.score}</p>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && (
              <div className="border-t border-gold/20 px-4 py-3 grid grid-cols-3 gap-2 text-center">
                {[
                  { name: "Memoria", p: m.territories.mem, a: m.opt.mem },
                  { name: "Trauma", p: m.territories.tra, a: m.opt.tra },
                  { name: "Sogno", p: m.territories.sog, a: m.opt.sog },
                ].map((t) => (
                  <div key={t.name}>
                    <p className="text-[9px] uppercase tracking-widest text-gold">{t.name}</p>
                    <p className={`mt-1 font-display text-sm ${t.p > t.a ? "text-gold" : t.p < t.a ? "text-rose" : "text-azure"}`}>{t.p}–{t.a}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </MobileFrame>
  );
}
