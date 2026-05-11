import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { MobileFrame } from "@/components/Common";
import { useSound } from "@/hooks/useSound";
import { ArrowLeft, RefreshCw, Wifi, Globe2, Server, Activity } from "lucide-react";

export const Route = createFileRoute("/connection")({ component: Connection });

function Connection() {
  const [pings, setPings] = useState<number[]>(() =>
    Array.from({ length: 24 }, () => 30 + Math.random() * 20),
  );
  const [region, setRegion] = useState("EU-West · Reverie #4");
  const { play } = useSound();

  useEffect(() => {
    const id = setInterval(() => {
      setPings((p) => [...p.slice(1), 25 + Math.random() * 30]);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const refresh = () => {
    play("reroll");
    setPings(Array.from({ length: 24 }, () => 30 + Math.random() * 20));
    setRegion(
      ["EU-West · Reverie #4", "EU-North · Reverie #2", "EU-South · Reverie #7"][
        Math.floor(Math.random() * 3)
      ],
    );
  };

  const avg = Math.round(pings.reduce((a, b) => a + b, 0) / pings.length);
  const status = avg < 60 ? "OTTIMA" : avg < 100 ? "BUONA" : "INSTABILE";
  const statusColor = avg < 60 ? "text-gold" : avg < 100 ? "text-azure" : "text-rose";

  const max = Math.max(...pings);
  return (
    <MobileFrame>
      <header className="flex items-center gap-2 px-4 pt-6">
        <Link
          to="/settings"
          className="flex size-9 items-center justify-center rounded-full bg-card/60 ring-1 ring-gold/30"
        >
          <ArrowLeft className="h-4 w-4 text-gold" />
        </Link>
        <h1 className="flex-1 text-center font-display text-lg gold-text tracking-widest">
          CONNESSIONE
        </h1>
        <button
          onClick={refresh}
          className="flex size-9 items-center justify-center rounded-full bg-card/60 ring-1 ring-gold/30"
        >
          <RefreshCw className="h-4 w-4 text-gold" />
        </button>
      </header>

      <div className="mt-6 px-4">
        <div className="rounded-2xl gold-frame bg-card/60 p-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Stato Rete</p>
          <p className={`mt-2 font-display text-4xl ${statusColor}`}>{status}</p>
          <p className="mt-1 font-display text-sm text-foreground">
            {avg}
            <span className="text-muted-foreground text-xs"> ms</span>
          </p>

          <div className="mt-5 flex h-16 items-end gap-1">
            {pings.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-gradient-to-t from-mystic to-mystic-glow transition-all"
                style={{ height: `${(v / max) * 100}%`, opacity: 0.3 + (i / pings.length) * 0.7 }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2 px-4">
        <Row icon={Wifi} label="Connessione" value="Wi-Fi" />
        <Row icon={Server} label="Server" value="Online" pulse />
        <Row icon={Globe2} label="Regione" value={region} />
        <Row icon={Activity} label="Perdita pacchetti" value="0%" />
      </div>

      <div className="mt-auto p-4">
        <button
          onClick={refresh}
          className="w-full rounded-full gold-frame bg-mystic/40 py-3 font-display text-sm uppercase tracking-widest text-foreground"
        >
          Riconnetti
        </button>
      </div>
    </MobileFrame>
  );
}

function Row({ icon: Icon, label, value, pulse }: any) {
  return (
    <div className="flex items-center gap-3 rounded-xl gold-frame bg-card/60 px-4 py-3 text-sm">
      <Icon className="h-4 w-4 text-gold" />
      <span className="flex-1 text-muted-foreground">{label}</span>
      <span className="font-display text-foreground flex items-center gap-2">
        {value} {pulse && <span className="size-2 rounded-full bg-gold animate-pulse" />}
      </span>
    </div>
  );
}
