import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileFrame } from "@/components/Common";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Lock, Check, Diamond, Coins, Package, Sparkles, Crown } from "lucide-react";
import { useGame } from "@/game/store";
import { useSound } from "@/hooks/useSound";
import { toast } from "sonner";

export const Route = createFileRoute("/pass")({ component: Pass });

const REWARDS = Array.from({ length: 30 }, (_, i) => {
  const tier = i + 1;
  const free = tier % 5 === 0 ? { kind: "pack", amount: 1, icon: Package } : tier % 3 === 0 ? { kind: "gold", amount: 50, icon: Coins } : { kind: "frag", amount: 5, icon: Sparkles };
  const prem = tier % 10 === 0 ? { kind: "legendary", amount: 1, icon: Crown } : tier % 5 === 0 ? { kind: "gems", amount: 50, icon: Diamond } : tier % 2 === 0 ? { kind: "gold", amount: 100, icon: Coins } : { kind: "pack", amount: 1, icon: Package };
  return { tier, free, prem };
});

function Pass() {
  const player = useGame((s) => s.player);
  const addGold = useGame((s) => s.addGold);
  const { play } = useSound();
  const [premium, setPremium] = useState(false);
  const [claimed, setClaimed] = useState<Set<string>>(new Set());

  const claim = (key: string, label: string, gold = 0) => {
    if (claimed.has(key)) return;
    play("chime");
    if (gold) addGold(gold);
    setClaimed((c) => new Set([...c, key]));
    toast.success(`Ricompensa raccolta: ${label}`);
  };

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
            <button onClick={() => { play("record"); setPremium(true); toast.success("Pass Premium attivato"); }} disabled={premium} className="absolute right-3 top-3 rounded-full gold-frame bg-gold/30 px-3 py-1 text-[10px] font-display uppercase disabled:opacity-50">{premium ? "Attivo ✓" : "Acquista Pass"}</button>
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

      <div className="mt-4 px-4 grid grid-cols-[2.5rem_1fr_1fr] gap-2 text-[9px] uppercase tracking-widest text-muted-foreground">
        <span>Lv</span>
        <span className="text-center">Gratis</span>
        <span className="text-center text-gold">Premium</span>
      </div>

      <div className="mt-2 flex-1 overflow-y-auto px-4 pb-24">
        <div className="space-y-2">
          {REWARDS.map(({ tier, free, prem }) => {
            const unlockedFree = tier <= player.level;
            const unlockedPrem = tier <= player.level && premium;
            const FIcon = free.icon;
            const PIcon = prem.icon;
            const fKey = `f${tier}`;
            const pKey = `p${tier}`;
            return (
              <div key={tier} className="grid grid-cols-[2.5rem_1fr_1fr] items-center gap-2">
                <div className={`flex size-9 items-center justify-center rounded-md gold-frame font-display text-sm ${unlockedFree ? "bg-mystic/40 text-gold" : "bg-card/60 text-muted-foreground"}`}>{tier}</div>
                <Tier
                  unlocked={unlockedFree}
                  claimed={claimed.has(fKey)}
                  Icon={FIcon}
                  amount={free.amount}
                  onClaim={() => claim(fKey, `+${free.amount} ${free.kind}`, free.kind === "gold" ? free.amount : 0)}
                />
                <Tier
                  unlocked={unlockedPrem}
                  premium
                  locked={!premium}
                  claimed={claimed.has(pKey)}
                  Icon={PIcon}
                  amount={prem.amount}
                  onClaim={() => claim(pKey, `+${prem.amount} ${prem.kind}`, prem.kind === "gold" ? prem.amount : 0)}
                />
              </div>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </MobileFrame>
  );
}

function Tier({ unlocked, premium, locked, claimed, Icon, amount, onClaim }: any) {
  return (
    <button
      disabled={!unlocked || claimed}
      onClick={onClaim}
      className={`flex items-center justify-between rounded-md p-2 ring-1 transition-all ${premium ? "bg-gradient-to-r from-mystic/20 to-gold/10 ring-gold/40" : "bg-card/40 ring-gold/20"} ${!unlocked && "opacity-40"}`}
    >
      <div className="flex items-center gap-1.5">
        <Icon className={`h-4 w-4 ${premium ? "text-gold" : "text-mystic-glow"}`} />
        <span className="text-[10px] font-display">x{amount}</span>
      </div>
      {claimed ? <Check className="h-4 w-4 text-gold" /> : locked ? <Lock className="h-3 w-3 text-muted-foreground" /> : unlocked ? <span className="text-[9px] uppercase tracking-widest text-gold">Claim</span> : <span className="text-[9px] text-muted-foreground">·</span>}
    </button>
  );
}
