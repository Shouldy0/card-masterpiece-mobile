import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileFrame } from "@/components/Common";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/connection")({ component: Connection });

function Connection() {
  const rows = [
    { l: "Connessione", v: "Ottima", c: "text-gold" },
    { l: "Server", v: "Online", c: "text-gold" },
    { l: "Ping", v: "35ms", c: "text-foreground" },
    { l: "Perdita pacchetti", v: "0%", c: "text-foreground" },
  ];
  return (
    <MobileFrame>
      <header className="flex items-center gap-2 px-4 pt-6">
        <Link to="/settings" className="flex size-9 items-center justify-center rounded-full bg-card/60 ring-1 ring-gold/30"><ArrowLeft className="h-4 w-4 text-gold" /></Link>
        <h1 className="flex-1 text-center font-display text-lg gold-text tracking-widest">STATO CONNESSIONE</h1>
        <span className="size-9" />
      </header>
      <div className="mt-6 space-y-2 px-4">
        {rows.map((r) => (
          <div key={r.l} className="flex items-center justify-between rounded-xl gold-frame bg-card/60 px-4 py-3 text-sm">
            <span className="text-muted-foreground">{r.l}</span>
            <span className={`font-display ${r.c}`}>{r.v} <span className="ml-1 inline-block size-2 rounded-full bg-gold" /></span>
          </div>
        ))}
      </div>
    </MobileFrame>
  );
}
