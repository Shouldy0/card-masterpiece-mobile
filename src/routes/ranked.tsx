import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MobileFrame } from "@/components/Common";
import { BottomNav } from "@/components/BottomNav";
import { useGame, getNextRankMilestone } from "@/game/store";
import { ArrowLeft, Crown, Package } from "lucide-react";

export const Route = createFileRoute("/ranked")({ component: Ranked });

function Ranked() {
  const { player, startMatch, claimRankReward } = useGame();
  const navigate = useNavigate();
  const nextMilestone = getNextRankMilestone(player.rankPoints);

  return (
    <MobileFrame>
      <header className="flex items-center gap-2 px-4 pt-6">
        <Link
          to="/home"
          className="flex size-9 items-center justify-center rounded-full bg-card/60 ring-1 ring-gold/30"
        >
          <ArrowLeft className="h-4 w-4 text-gold" />
        </Link>
        <h1 className="flex-1 text-center font-display text-lg gold-text tracking-widest">
          RANKED
        </h1>
        <span className="size-9" />
      </header>

      <div className="mt-6 flex flex-col items-center px-6">
        <div className="relative">
          <div className="absolute -inset-10 rounded-full bg-mystic/30 blur-3xl" />
          <div className="relative flex size-32 items-center justify-center rounded-full ring-2 ring-gold/70 bg-gradient-to-br from-mystic/40 to-abyss">
            <Crown className="h-12 w-12 text-gold" />
          </div>
        </div>
        <p className="mt-4 font-display text-2xl gold-text">{player.rank}</p>
        <div className="mt-4 grid w-full max-w-xs grid-cols-2 gap-3">
          <div className="rounded-xl gold-frame bg-card/60 p-3 text-center">
            <p className="text-[9px] uppercase text-muted-foreground">Punteggio</p>
            <p className="font-display text-lg text-foreground">{player.rankPoints}</p>
          </div>
          <div className="rounded-xl gold-frame bg-card/60 p-3 text-center">
            <p className="text-[9px] uppercase text-muted-foreground">Prossimo</p>
            <p className="font-display text-lg text-foreground">
              {nextMilestone.toLocaleString("it-IT")}
            </p>
          </div>
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground text-center">
          I punti Ranked si aggiornano dopo ogni battaglia completata.
        </p>
      </div>

      <div className="mt-6 mx-4">
        <p className="text-[10px] uppercase tracking-widest text-gold">Ricompense Stagionali</p>
        <div className="mt-2 space-y-1.5">
          {[1000, 1500, 2000, 2500].map((pts) => {
            const id = `rank_${pts}`;
            const claimed = player.rankRewardsClaimed.includes(id);
            const canClaim = player.rankPoints >= pts && !claimed;
            return (
              <div
                key={pts}
                className="flex items-center justify-between rounded-lg gold-frame bg-card/50 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-mystic-glow" />
                  <span className="text-xs">{pts.toLocaleString("it-IT")} pt</span>
                </div>
                <button
                  disabled={!canClaim && !claimed}
                  onClick={() => canClaim && claimRankReward(id)}
                  className={`text-[10px] uppercase tracking-widest ${claimed ? "text-gold" : canClaim ? "text-mystic-glow animate-pulse" : "text-muted-foreground"}`}
                >
                  {claimed ? "Ottenuto" : canClaim ? "Riscatta" : "Bloccato"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 mx-4">
        <p className="text-[10px] uppercase tracking-widest text-gold">Top Sognatori</p>
        <div className="mt-2 space-y-1">
          {[
            { r: 1, n: "Veglia Eterna", p: 4820 },
            { r: 2, n: "Eco Lontano", p: 4310 },
            { r: 3, n: "Maschera Vuota", p: 3980 },
            { r: 4, n: "Sussurro", p: 3640 },
            { r: 5, n: "Tu (Dreamer)", p: player.rankPoints, me: true },
          ].map((u) => (
            <div
              key={u.r}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${u.me ? "gold-frame bg-mystic/30" : "bg-card/40"}`}
            >
              <span
                className={`font-display text-sm w-5 ${u.r <= 3 ? "text-gold" : "text-muted-foreground"}`}
              >
                #{u.r}
              </span>
              <span className="flex-1 text-xs">{u.n}</span>
              <span className="font-display text-xs text-gold">{u.p.toLocaleString("it-IT")}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto p-4">
        <button
          onClick={() => {
            startMatch();
            navigate({ to: "/vs" });
          }}
          className="w-full rounded-full gold-frame bg-gradient-to-r from-mystic to-mystic-glow py-3 font-display text-sm uppercase tracking-widest text-foreground glow-mystic"
        >
          Gioca Ranked
        </button>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          Fine stagione tra: 12g 18h 24m
        </p>
      </div>

      <BottomNav />
    </MobileFrame>
  );
}
