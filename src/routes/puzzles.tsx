import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MobileFrame } from "@/components/Common";
import { useGame } from "@/game/store";
import { ArrowLeft, Brain, CheckCircle2, Trophy, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { sounds } from "@/utils/audio";

export const Route = createFileRoute("/puzzles")({ component: Puzzles });

const PUZZLES = [
  { id: "p1", title: "Sinergia Sospesa", difficulty: "Facile", task: "Vinci controllando Sogno con una sola carta.", reward: "50 Frammenti" },
  { id: "p2", title: "Il Sacrificio", difficulty: "Medio", task: "Vinci Trauma sacrificando la tua carta più forte.", reward: "Busta Base" },
  { id: "p3", title: "Riflesso Oscuro", difficulty: "Difficile", task: "Usa il potere dell'avversario contro di lui.", reward: "Busta Rara" },
];

function Puzzles() {
  const { completedPuzzles, startPuzzleMatch } = useGame();
  const navigate = useNavigate();

  return (
    <MobileFrame>
      <header className="flex items-center gap-2 px-4 pt-6">
        <Link to="/home" className="p-2 rounded-full bg-card/60 ring-1 ring-gold/30">
          <ArrowLeft className="size-4 text-gold" />
        </Link>
        <h1 className="flex-1 text-center font-display text-lg gold-text tracking-widest uppercase">
          Puzzle Mentali
        </h1>
        <div className="size-8" />
      </header>

      <div className="flex-1 px-4 py-6 space-y-4">
        {PUZZLES.map((p, i) => {
          const isDone = completedPuzzles.includes(p.id);
          return (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => {
                sounds.play("chime");
                startPuzzleMatch(p.id);
                navigate({ to: "/match" });
              }}
              className={cn(
                "w-full p-5 rounded-3xl border text-left transition-all relative overflow-hidden group",
                isDone ? "bg-emerald-500/10 border-emerald-500/30" : "bg-card/40 border-white/5 hover:border-white/20"
              )}
            >
              {isDone && (
                <div className="absolute top-4 right-4 text-emerald-400">
                  <CheckCircle2 className="size-5" />
                </div>
              )}
              
              <div className="flex items-center gap-2 mb-3">
                <Brain className={cn("size-4", isDone ? "text-emerald-400" : "text-mystic")} />
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-widest",
                  p.difficulty === "Facile" ? "text-emerald-400" : p.difficulty === "Medio" ? "text-yellow-400" : "text-rose"
                )}>
                  {p.difficulty}
                </span>
              </div>

              <h3 className="font-display text-base font-bold text-white mb-1">{p.title}</h3>
              <p className="text-[10px] text-white/50 mb-4 pr-10">{p.task}</p>

              <div className="flex items-center gap-2 mt-auto">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                  <Trophy className="size-2.5 text-gold/60" />
                  <span className="text-[8px] text-white/40 uppercase font-bold">{p.reward}</span>
                </div>
              </div>

              {/* Hover effect decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-mystic/0 via-mystic/5 to-mystic/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </motion.button>
          );
        })}
      </div>

      <div className="p-6">
        <div className="bg-mystic/10 rounded-2xl p-4 border border-mystic/20 flex items-center gap-4">
          <div className="size-10 rounded-full bg-mystic/20 flex items-center justify-center">
            <Zap className="size-5 text-mystic-glow" />
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase text-white tracking-widest">Puzzles Settimanali</h4>
            <p className="text-[8px] text-white/40">Nuovi enigmi ogni lunedì alle 04:00</p>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}
