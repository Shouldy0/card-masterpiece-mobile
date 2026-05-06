import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileFrame } from "@/components/Common";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Lock, Check, Diamond } from "lucide-react";
import { useGame } from "@/game/store";

export const Route = createFileRoute("/pass")({ component: Pass });

function Pass() {
  const player = useGame((s) => s.player);
  const tiers = Array.from({ length: 15 }, (_, i) => i + 1);

  return (
    <MobileFrame>
      <header className="flex items-center gap-2 px-4 pt-6">
        <Link to="/home" className="flex size-9 items-center justify-center rounded-full bg-card/60 ring-1 ring-gold/30"><ArrowLeft className="h-4 w-4 text-gold" /></Link>
        <h1 className="flex-1 text-center font-display text-lg gold-text tracking-widest">SEASON PASS</h1>
        <span className="size-9" />
      </header>

      <div className="mt-4 px-4">
        <div className="overflow-hidden rounded-xl gold-frame">
          <div className="relative h-28 bg-gradient-to-br from-mystic via-mystic-glow/40 to-abyss p-4">
            <div className="absolute inset-0 nebula" />
            <p className="relative font-display text-base text-foreground">Stagione 1: Risonanze</p>
            <p className="relative text-[10px] text-muted-foreground">Termina tra: 28g 12h</p>
            <button className="absolute right-3 top-3 rounded-full gold-frame bg-gold/30 px-3 py-1 text-[10px] font-display uppercase">Acquista Pass</button>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="font-display text-2xl text-gold">{player.level}</span>
          <div className="flex-1">
            <div className="h-1.5 overflow-hidden rounded-full bg-mystic/20">
              <div className="h-full bg-gradient-to-r from-mystic-glow to-gold" style={{ width: `${(player.xp / player.xpToNext) * 100}%` }} />
            </div>
            <p className="mt-1 text-[9px] text-muted-foreground">{player.xp}/{player.xpToNext} XP</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto scrollbar-hide px-4 pb-4">
        <p className="text-[10px] uppercase tracking-widest text-gold">Ricompense</p>
        <div className="mt-2 space-y-2">
          {tiers.map((t) => {
            const unlocked = t <= player.level;
            return (
              <div key={t} className="grid grid-cols-[2.5rem_1fr_1fr] items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-md gold-frame bg-card/60 font-display text-sm">{t}</div>
                <Tier kind="free" unlocked={unlocked} />
                <Tier kind="premium" unlocked={false} />
              </div>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </MobileFrame>
  );
}

function Tier({ kind, unlocked }: { kind: "free" | "premium"; unlocked: boolean }) {
  return (
    <div className={`flex items-center justify-between rounded-md p-2 ring-1 ${kind === "premium" ? "bg-gradient-to-r from-mystic/20 to-gold/10 ring-gold/40" : "bg-card/40 ring-gold/20"}`}>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{kind}</span>
      {unlocked ? <Check className="h-4 w-4 text-gold" /> : kind === "premium" ? <Lock className="h-4 w-4 text-muted-foreground" /> : <Diamond className="h-4 w-4 text-mystic-glow" />}
    </div>
  );
}
