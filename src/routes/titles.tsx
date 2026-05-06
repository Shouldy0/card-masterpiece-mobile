import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileFrame } from "@/components/Common";
import { ArrowLeft, Award } from "lucide-react";

export const Route = createFileRoute("/titles")({ component: Titles });

const titles = [
  { n: "Sognatore", unlocked: true, eq: true },
  { n: "Risvegliato", unlocked: true, eq: false },
  { n: "Dominatore", unlocked: false, eq: false },
  { n: "Eco Eterno", unlocked: false, eq: false },
  { n: "Coscienza Spezzata", unlocked: true, eq: false },
  { n: "Architetto del Sogno", unlocked: false, eq: false },
];

function Titles() {
  return (
    <MobileFrame>
      <header className="flex items-center gap-2 px-4 pt-6">
        <Link to="/profile" className="flex size-9 items-center justify-center rounded-full bg-card/60 ring-1 ring-gold/30"><ArrowLeft className="h-4 w-4 text-gold" /></Link>
        <h1 className="flex-1 text-center font-display text-lg gold-text tracking-widest">TITOLI</h1>
        <span className="size-9" />
      </header>
      <div className="mt-4 grid grid-cols-2 gap-2 px-4">
        {titles.map((t) => (
          <div key={t.n} className={`rounded-xl gold-frame p-3 text-center ${t.eq ? "bg-mystic/30" : "bg-card/60"} ${!t.unlocked && "opacity-40"}`}>
            <Award className={`mx-auto h-6 w-6 ${t.eq ? "text-gold" : "text-muted-foreground"}`} />
            <p className="mt-2 font-display text-xs">{t.n}</p>
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{!t.unlocked ? "Bloccato" : t.eq ? "Equipaggiato" : "Equipaggia"}</p>
          </div>
        ))}
      </div>
    </MobileFrame>
  );
}
