import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MobileFrame } from "@/components/Common";
import { BottomNav } from "@/components/BottomNav";
import { useGame } from "@/game/store";
import { Coins, Diamond, Plus, Library, BookOpen, ShoppingBag, Sparkles, Crown, Eye, Zap, Trophy } from "lucide-react";
import { useSound } from "@/hooks/useSound";

export const Route = createFileRoute("/home")({ component: Home });

function Home() {
  const player = useGame((s) => s.player);
  const startMatch = useGame((s) => s.startMatch);
  const navigate = useNavigate();
  const { play } = useSound();

  const play_btn = () => { play("whoosh"); startMatch(); navigate({ to: "/vs" }); };

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

      {/* UTILITY BAR: Missioni / Pass / Ranked */}
      <div className="mt-4 flex items-center justify-center gap-3 px-6 flex-wrap">
        <Link to="/events" className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-card/10 ring-1 ring-gold/10 hover:bg-card/20 transition-all group">
          <Sparkles className="h-4 w-4 text-gold/60 group-hover:text-gold" />
          <span className="text-[9px] uppercase tracking-widest text-gold/60 group-hover:text-gold">Missioni</span>
        </Link>
        <Link to="/pass" className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-card/10 ring-1 ring-gold/10 hover:bg-card/20 transition-all group">
          <Crown className="h-4 w-4 text-gold/60 group-hover:text-gold" />
          <span className="text-[9px] uppercase tracking-widest text-gold/60 group-hover:text-gold">Pass</span>
        </Link>
        <Link to="/ranked" className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-card/10 ring-1 ring-gold/10 hover:bg-card/20 transition-all group">
          <Trophy className="h-4 w-4 text-gold/60 group-hover:text-gold" />
          <span className="text-[9px] uppercase tracking-widest text-gold/60 group-hover:text-gold">Ranked</span>
        </Link>
      </div>

      {/* HERO SECTION */}
      <div className="relative mt-4 flex flex-1 flex-col items-center justify-center px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="relative mb-12"
        >
          <div className="absolute -inset-16 rounded-full bg-mystic/20 blur-3xl" />
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3] 
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-1/2 -z-10 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-mystic-glow/30 via-gold/10 to-transparent blur-2xl" 
          />
          
          <div className="relative flex flex-col items-center">
            <motion.h1
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, letterSpacing: "0.4em" }}
              transition={{ duration: 1.2 }}
              className="font-display text-6xl gold-text"
            >
              REVERIE
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-2 text-[10px] uppercase tracking-[0.4em] text-gold/40"
            >
              Sintonizza la tua coscienza
            </motion.p>
          </div>
        </motion.div>

        {/* PRIMARY ACTIONS: Clean & Large */}
        <div className="w-full max-w-xs space-y-4">
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            onClick={play_btn} 
            className="w-full py-6 rounded-[2.5rem] bg-gradient-to-br from-mystic via-mystic-glow to-mystic text-foreground font-display text-xl font-bold uppercase tracking-[0.3em] shadow-[0_10px_40px_rgba(150,100,255,0.3)] border border-gold/20"
          >
            GIOCA BATTAGLIA
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            onClick={() => navigate({ to: "/combo" })} 
            className="w-full py-4 rounded-[2rem] bg-gradient-to-r from-abyss/40 via-card/40 to-abyss/40 text-gold font-display text-sm font-bold uppercase tracking-[0.3em] shadow-xl border border-gold/20 backdrop-blur-md"
          >
            MODALITÀ SOGNO
          </motion.button>

          <div className="pt-8 text-center">
             <p className="text-[8px] uppercase tracking-[0.5em] text-gold/20">Esplora le profondità del tuo inconscio</p>
          </div>
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
