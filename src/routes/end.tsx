import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { MobileFrame } from "@/components/Common";
import { sounds } from "@/utils/audio";
import { useGame, TERRITORIES, getMatchRewards } from "@/game/store";
import { useSound } from "@/hooks/useSound";
import { Coins, Diamond, Package } from "lucide-react";

export const Route = createFileRoute("/end")({ component: End });

function End() {
  const match = useGame((s) => s.match);
  const exit = useGame((s) => s.exitMatch);
  const startMatch = useGame((s) => s.startMatch);
  const navigate = useNavigate();
  const { play } = useSound();

  useEffect(() => {
    sounds.startSceneMusic("end");
    if (match?.result === "win") play("victory");
    else if (match?.result === "lose") play("fail");
    else if (match?.result === "draw") play("chime");
  }, [match?.result, play]);

  if (!match || !match.territoryResults) {
    navigate({ to: "/home" });
    return null;
  }
  const result = match.result!;
  const rewards = getMatchRewards(result);
  const titles = { win: "VITTORIA", lose: "SCONFITTA", draw: "PAREGGIO" };
  const colors = { win: "text-gold", lose: "text-rose", draw: "text-azure" };

  return (
    <MobileFrame className="px-6 pt-10">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
        <div className="relative mx-auto mb-3 size-32">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-eclipse/40 via-rose/20 to-mystic/40 blur-2xl" />
          <div className="absolute inset-4 rounded-full ring-2 ring-gold/70" />
        </div>
        <h1 className={`font-display text-5xl tracking-[0.3em] ${colors[result]} drop-shadow-[0_0_18px_var(--mystic-glow)]`}>{titles[result]}</h1>
      </motion.div>

      <p className="mt-8 text-center text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Risultato Territori</p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {TERRITORIES.map((t) => {
          const r = match.territoryResults![t.id];
          const winT = r.p > r.a ? "win" : r.p < r.a ? "lose" : "draw";
          return (
            <div key={t.id} className="rounded-xl gold-frame bg-card/60 p-3 text-center">
              <p className="font-display text-[10px] uppercase text-gold leading-tight">{t.name}</p>
              <p className={`mt-2 font-display text-lg ${winT === "win" ? "text-gold" : winT === "lose" ? "text-rose" : "text-azure"}`}>{r.p} - {r.a}</p>
              <p className="text-[9px] uppercase text-muted-foreground">{winT === "win" ? "Tu vinci" : winT === "lose" ? "Avv. vince" : "Pareggio"}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl gold-frame bg-card/60 p-4">
        <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground">Ricompense</p>
        <p className="mt-2 text-center font-display text-3xl gold-text">+{rewards.xp} XP</p>
        <div className="mt-3 flex items-center justify-around">
          <div className="flex items-center gap-1 text-sm"><Coins className="h-4 w-4 text-gold" /> <span className="font-display">+{rewards.gold}</span></div>
          <div className="flex items-center gap-1 text-sm"><Diamond className="h-4 w-4 text-mystic-glow" /> <span className="font-display">+{rewards.gems}</span></div>
          <div className="flex items-center gap-1 text-sm"><Package className="h-4 w-4 text-azure" /> <span className="font-display">+{rewards.packs}</span></div>
        </div>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          Punti Ranked: {rewards.rankPointsDelta >= 0 ? "+" : ""}{rewards.rankPointsDelta}
        </p>
      </div>

      <div className="mt-auto flex flex-col gap-2 pb-8 pt-6">
        <button
          onClick={() => { exit(); startMatch(); navigate({ to: "/vs" }); }}
          className="w-full rounded-full gold-frame bg-gradient-to-r from-mystic to-mystic-glow py-3 font-display text-sm uppercase tracking-widest text-foreground glow-mystic"
        >
          Gioca Ancora
        </button>
        <button
          onClick={() => { exit(); navigate({ to: "/home" }); }}
          className="w-full rounded-full bg-card/60 py-3 font-display text-sm uppercase tracking-widest text-muted-foreground ring-1 ring-gold/30"
        >
          Torna alla Home
        </button>
      </div>
    </MobileFrame>
  );
}
