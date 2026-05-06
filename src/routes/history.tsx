import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileFrame } from "@/components/Common";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/history")({ component: History });

const matches = [
  { r: "win", op: "Ombra Nascosta", date: "5 mag", score: "3-0" },
  { r: "lose", op: "Eco Lontano", date: "5 mag", score: "1-2" },
  { r: "win", op: "Veglia", date: "4 mag", score: "2-1" },
  { r: "draw", op: "Specchio", date: "4 mag", score: "1-1" },
  { r: "win", op: "Sussurro", date: "3 mag", score: "3-0" },
];

function History() {
  return (
    <MobileFrame>
      <header className="flex items-center gap-2 px-4 pt-6">
        <Link to="/profile" className="flex size-9 items-center justify-center rounded-full bg-card/60 ring-1 ring-gold/30"><ArrowLeft className="h-4 w-4 text-gold" /></Link>
        <h1 className="flex-1 text-center font-display text-lg gold-text tracking-widest">CRONOLOGIA</h1>
        <span className="size-9" />
      </header>
      <div className="mt-4 space-y-2 px-4">
        {matches.map((m, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl gold-frame bg-card/60 p-3">
            <div className={`size-2 rounded-full ${m.r === "win" ? "bg-gold" : m.r === "lose" ? "bg-rose" : "bg-azure"}`} />
            <div className="flex-1">
              <p className="text-sm">{m.op}</p>
              <p className="text-[10px] text-muted-foreground">{m.date}</p>
            </div>
            <p className={`font-display text-sm ${m.r === "win" ? "text-gold" : m.r === "lose" ? "text-rose" : "text-azure"}`}>{m.score}</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{m.r === "win" ? "VIT" : m.r === "lose" ? "SCF" : "PAR"}</p>
          </div>
        ))}
      </div>
    </MobileFrame>
  );
}
