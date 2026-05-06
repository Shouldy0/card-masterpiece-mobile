import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MobileFrame } from "@/components/Common";
import { BottomNav } from "@/components/BottomNav";
import { useGame } from "@/game/store";
import { Coins, Diamond, Plus, Library, BookOpen, ShoppingBag, Sparkles, Crown, Eye } from "lucide-react";

export const Route = createFileRoute("/home")({ component: Home });

function Home() {
  const player = useGame((s) => s.player);
  const startMatch = useGame((s) => s.startMatch);
  const navigate = useNavigate();

  const play = () => { startMatch(); navigate({ to: "/vs" }); };

  return (
    <MobileFrame>
      {/* top bar */}
      <header className="flex items-center justify-between px-4 pt-6">
        <Link to="/profile" className="flex items-center gap-2">
          <div className="size-10 rounded-full ring-2 ring-gold/60 bg-gradient-to-br from-mystic to-abyss flex items-center justify-center">
            <Eye className="h-4 w-4 text-gold" />
          </div>
          <div>
            <p className="font-display text-sm text-foreground leading-none">Dreamer</p>
            <p className="text-[10px] text-muted-foreground">Livello {player.level}</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <ResourcePill icon={Coins} value={player.gold} color="text-gold" />
          <ResourcePill icon={Diamond} value={player.gems} color="text-mystic-glow" />
          <button className="size-7 rounded-full bg-mystic/30 ring-1 ring-gold/40 flex items-center justify-center text-gold">
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </header>

      {/* missioni / pass */}
      <div className="mt-6 flex items-start justify-between px-6">
        <Link to="/events" className="flex flex-col items-center gap-1">
          <div className="flex size-12 items-center justify-center rounded-xl gold-frame bg-mystic/20">
            <Sparkles className="h-5 w-5 text-gold" />
          </div>
          <span className="text-[10px] text-muted-foreground">Missioni</span>
        </Link>
        <Link to="/pass" className="flex flex-col items-center gap-1">
          <div className="flex size-12 items-center justify-center rounded-xl gold-frame bg-mystic/20">
            <Crown className="h-5 w-5 text-gold" />
          </div>
          <span className="text-[10px] text-muted-foreground">Pass</span>
        </Link>
      </div>

      {/* hero */}
      <div className="relative mt-8 flex flex-1 flex-col items-center justify-end px-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <div className="absolute -inset-16 -z-10 rounded-full bg-mystic/30 blur-3xl" />
          <div className="absolute left-1/2 top-2 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-gradient-to-b from-mystic-glow/40 via-mystic/20 to-transparent blur-2xl" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, letterSpacing: "0.3em" }}
          transition={{ duration: 1.2 }}
          className="font-display text-5xl tracking-[0.3em] gold-text"
        >
          REVERIE
        </motion.h1>
        <p className="mt-1 text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
          Il tuo coraggio, la tua mente
        </p>

        <button
          onClick={play}
          className="mt-10 w-full max-w-xs rounded-full gold-frame bg-gradient-to-r from-mystic to-mystic-glow px-10 py-4 font-display text-lg uppercase tracking-[0.3em] text-foreground glow-mystic"
        >
          Gioca
        </button>

        {/* shortcuts */}
        <div className="mt-6 grid w-full grid-cols-3 gap-3">
          {[
            { to: "/deck", icon: Library, label: "Mazzi" },
            { to: "/collection", icon: BookOpen, label: "Collezione" },
            { to: "/shop", icon: ShoppingBag, label: "Negozio" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <Link key={s.to} to={s.to} className="flex flex-col items-center gap-1 rounded-xl gold-frame bg-card/60 px-2 py-3">
                <Icon className="h-5 w-5 text-gold" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </MobileFrame>
  );
}

function ResourcePill({ icon: Icon, value, color }: { icon: any; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-card/80 px-2 py-1 ring-1 ring-gold/30">
      <Icon className={`h-3.5 w-3.5 ${color}`} />
      <span className="font-display text-xs text-foreground">{value.toLocaleString("it-IT")}</span>
    </div>
  );
}
