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
  Eye,
  Brain,
  Shield,
  ChevronRight,
  Edit2,
  Check,
  Palette,
} from "lucide-react";
import { CardFromId } from "@/components/GameCard";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { sounds } from "@/utils/audio";
import { motion, AnimatePresence } from "framer-motion";

const AVATARS: Record<string, { icon: any; color: string }> = {
  default: { icon: Eye, color: "text-gold" },
  archetipo_icon: { icon: Brain, color: "text-purple-400" },
  maschera_icon: { icon: Shield, color: "text-emerald-400" },
  oblio_icon: { icon: History, color: "text-blue-400" },
};

const FRAMES: Record<string, string> = {
  none: "ring-1 ring-gold/20",
  gold_border: "ring-4 ring-gold shadow-[0_0_20px_rgba(255,215,0,0.4)]",
  mystic_glow: "ring-4 ring-mystic-glow shadow-[0_0_25px_rgba(150,100,255,0.5)]",
};

const BGS: Record<string, string> = {
  default: "bg-abyss",
  nebula: "bg-gradient-to-br from-mystic/40 to-abyss",
  abyss: "bg-gradient-to-b from-black to-mystic/20",
};

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  const { player, setProfileItem } = useGame();
  const [isCustomizing, setIsCustomizing] = useState(false);
  const winRate = Math.round((player.wins / Math.max(1, player.matches)) * 100);

  const CurrentAvatar = AVATARS[player.avatarId]?.icon || Eye;
  const avatarColor = AVATARS[player.avatarId]?.color || "text-gold";

  return (
    <MobileFrame className={cn("transition-colors duration-1000", BGS[player.bgId])}>
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
        <button
          onClick={() => {
            setIsCustomizing(true);
            sounds.play("lock");
          }}
          className="flex size-9 items-center justify-center rounded-full bg-card/60 ring-1 ring-gold/30"
        >
          <Palette className="h-4 w-4 text-gold" />
        </button>
      </header>

      <div className="mt-8 flex flex-col items-center px-4">
        <div className="relative mb-4">
          <div className={cn("size-28 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md transition-all duration-500", FRAMES[player.frameId])}>
            <CurrentAvatar className={cn("size-12", avatarColor)} />
          </div>
          <button 
            onClick={() => setIsCustomizing(true)}
            className="absolute bottom-0 right-0 size-8 rounded-full bg-gold text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <Edit2 className="size-4" />
          </button>
        </div>
        
        <div className="text-center">
          <h2 className="font-display text-2xl text-foreground font-bold tracking-tight">Dreamer</h2>
          <p className="text-[10px] text-gold/60 font-black uppercase tracking-[0.4em] mb-4">
             {player.title || "Sognatore"}
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Livello {player.level}</span>
          </div>
          <div className="h-2 w-48 overflow-hidden rounded-full bg-white/5 border border-white/5 mx-auto">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(player.xp / player.xpToNext) * 100}%` }}
              className="h-full bg-gradient-to-r from-mystic-glow to-gold"
            />
          </div>
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

      <AnimatePresence>
        {isCustomizing && (
          <div className="fixed inset-0 z-[100] flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCustomizing(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative h-[80vh] bg-abyss rounded-t-[3rem] border-t border-gold/30 p-6 flex flex-col"
            >
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
              <h3 className="font-display text-xl text-gold text-center tracking-widest uppercase mb-8">Personalizzazione</h3>
              
              <div className="flex-1 overflow-y-auto space-y-8 pb-10 custom-scrollbar">
                {/* Avatars */}
                <section>
                  <h4 className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em] mb-4">Avatar</h4>
                  <div className="grid grid-cols-4 gap-4">
                    {player.ownedAvatars.map((id) => {
                      const A = AVATARS[id]?.icon || Eye;
                      return (
                        <button
                          key={id}
                          onClick={() => {
                            setProfileItem("avatarId", id);
                            sounds.play("tick");
                          }}
                          className={cn(
                            "aspect-square rounded-2xl flex items-center justify-center transition-all",
                            player.avatarId === id ? "bg-gold text-black shadow-lg scale-110" : "bg-white/5 text-white/40 border border-white/5"
                          )}
                        >
                          <A className="size-6" />
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* Frames */}
                <section>
                  <h4 className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em] mb-4">Cornici</h4>
                  <div className="grid grid-cols-4 gap-4">
                    {player.ownedFrames.map((id) => (
                      <button
                        key={id}
                        onClick={() => {
                          setProfileItem("frameId", id);
                          sounds.play("tick");
                        }}
                        className={cn(
                          "aspect-square rounded-2xl border-2 flex items-center justify-center transition-all",
                          player.frameId === id ? "border-gold bg-gold/10" : "border-white/10 bg-white/5"
                        )}
                      >
                        <div className={cn("size-8 rounded-full", FRAMES[id])} />
                      </button>
                    ))}
                  </div>
                </section>

                {/* Titles */}
                <section>
                  <h4 className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em] mb-4">Titoli</h4>
                  <div className="space-y-2">
                    {player.ownedTitles.map((id) => (
                      <button
                        key={id}
                        onClick={() => {
                          setProfileItem("title", id);
                          sounds.play("tick");
                        }}
                        className={cn(
                          "w-full p-4 rounded-xl flex items-center justify-between transition-all",
                          player.title === id ? "bg-gold text-black" : "bg-white/5 text-white/60 border border-white/5"
                        )}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest">{id}</span>
                        {player.title === id && <Check className="size-4" />}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Backgrounds */}
                <section>
                  <h4 className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em] mb-4">Sfondi</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {player.ownedBgs.map((id) => (
                      <button
                        key={id}
                        onClick={() => {
                          setProfileItem("bgId", id);
                          sounds.play("tick");
                        }}
                        className={cn(
                          "h-20 rounded-xl border flex flex-col items-center justify-center gap-2 overflow-hidden relative",
                          player.bgId === id ? "border-gold" : "border-white/10"
                        )}
                      >
                        <div className={cn("absolute inset-0", BGS[id])} />
                        <span className="relative z-10 text-[8px] font-bold uppercase text-white/80">{id}</span>
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              <button
                onClick={() => setIsCustomizing(false)}
                className="w-full py-5 rounded-3xl bg-gold text-black font-black uppercase tracking-[0.2em] text-xs shadow-xl mt-4"
              >
                Conferma Identità
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <BottomNav />
    </MobileFrame>
  );
}
