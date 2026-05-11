import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileFrame } from "@/components/Common";
import { BottomNav } from "@/components/BottomNav";
import { useGame } from "@/game/store";
import {
  ArrowLeft,
  BarChart3,
  History,
  Library,
  Award,
  Settings as SettingsIcon,
  Eye,
  ChevronRight,
} from "lucide-react";
import { CardFromId } from "@/components/GameCard";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  const player = useGame((s) => s.player);
  const winRate = Math.round((player.wins / Math.max(1, player.matches)) * 100);

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
          PROFILO
        </h1>
        <Link
          to="/settings"
          className="flex size-9 items-center justify-center rounded-full bg-card/60 ring-1 ring-gold/30"
        >
          <SettingsIcon className="h-4 w-4 text-gold" />
        </Link>
      </header>

      <div className="mt-6 flex items-center gap-3 px-4">
        <div className="relative">
          <div className="size-20 rounded-full ring-2 ring-gold/70 bg-gradient-to-br from-mystic to-abyss flex items-center justify-center">
            <Eye className="h-8 w-8 text-gold" />
          </div>
        </div>
        <div className="flex-1">
          <p className="font-display text-xl text-foreground">Dreamer</p>
          <p className="text-[10px] text-muted-foreground">Coscienza Errante</p>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-gold">
            Livello {player.level}
          </p>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-mystic/20">
            <div
              className="h-full bg-gradient-to-r from-mystic-glow to-gold"
              style={{ width: `${(player.xp / player.xpToNext) * 100}%` }}
            />
          </div>
          <p className="mt-1 text-[9px] text-muted-foreground">
            {player.xp}/{player.xpToNext} XP
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 px-4">
        {[
          { l: "Vittorie", v: player.wins },
          { l: "Partite", v: player.matches },
          { l: "Win rate", v: `${winRate}%` },
        ].map((s) => (
          <div key={s.l} className="rounded-xl gold-frame bg-card/60 p-2 text-center">
            <p className="font-display text-lg text-foreground">{s.v}</p>
            <p className="text-[9px] uppercase text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>

      <Link
        to="/ranked"
        className="mx-4 mt-4 flex items-center justify-between rounded-xl gold-frame bg-card/60 p-3"
      >
        <div>
          <p className="text-[9px] uppercase tracking-widest text-muted-foreground">
            Rango Attuale
          </p>
          <p className="font-display text-sm text-gold">{player.rank}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>

      <div className="mx-4 mt-4">
        <p className="text-[10px] uppercase tracking-widest text-gold">Mazzi Preferiti</p>
        <div className="mt-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {player.matches > 0 ? (
            ["eco_dimenticato", "maschera_dolore", "sogno_lucido"].map((id) => (
              <CardFromId key={id} id={id} size="lg" />
            ))
          ) : (
            <div className="w-full py-8 rounded-xl border border-dashed border-gold/20 flex flex-col items-center justify-center bg-card/20">
              <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                Nessuna memoria risvegliata
              </p>
              <Link
                to="/home"
                className="mt-2 text-[8px] text-gold underline tracking-widest uppercase"
              >
                Inizia la prima battaglia →
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="mx-4 mt-4 grid grid-cols-2 gap-2">
        <Link to="/stats" className="flex items-center gap-2 rounded-xl gold-frame bg-card/60 p-3">
          <BarChart3 className="h-5 w-5 text-gold" />
          <span className="text-xs">Statistiche</span>
        </Link>
        <Link
          to="/history"
          className="flex items-center gap-2 rounded-xl gold-frame bg-card/60 p-3"
        >
          <History className="h-5 w-5 text-gold" />
          <span className="text-xs">Cronologia</span>
        </Link>
        <Link to="/deck" className="flex items-center gap-2 rounded-xl gold-frame bg-card/60 p-3">
          <Library className="h-5 w-5 text-gold" />
          <span className="text-xs">Mazzi</span>
        </Link>
        <Link to="/titles" className="flex items-center gap-2 rounded-xl gold-frame bg-card/60 p-3">
          <Award className="h-5 w-5 text-gold" />
          <span className="text-xs">Titoli</span>
        </Link>
      </div>

      <BottomNav />
    </MobileFrame>
  );
}
