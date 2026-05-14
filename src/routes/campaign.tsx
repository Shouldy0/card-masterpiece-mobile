import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MobileFrame } from "@/components/Common";
import { useGame } from "@/game/store";
import { ArrowLeft, Book, Lock, Play, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { sounds } from "@/utils/audio";

export const Route = createFileRoute("/campaign")({ component: Campaign });

const CAMPAIGN_NODES = [
  {
    id: 1,
    title: "Il Primo Risveglio",
    lore: "Ti ritrovi in un prato di memorie dimenticate. Un'ombra ti osserva.",
    reward: "Carta Rara",
  },
  {
    id: 2,
    title: "L'Eco del Trauma",
    lore: "I ricordi si fanno oscuri. Il dolore del passato prende forma.",
    reward: "100 Frammenti",
  },
  {
    id: 3,
    title: "Il Labirinto Onirico",
    lore: "Le regole della realtà si sfaldano. Nulla è come sembra.",
    reward: "Card Back Esclusivo",
  },
  {
    id: 4,
    title: "Il Guardiano del Varco",
    lore: "L'ultimo ostacolo tra te e la verità suprema della Reverie.",
    reward: "Titolo Leggendario",
  },
];

function Campaign() {
  const { campaignProgress, startCampaignMatch } = useGame();
  const navigate = useNavigate();

  const handleStartNode = (nodeId: number) => {
    sounds.play("chime");
    startCampaignMatch(nodeId);
    navigate({ to: "/match" });
  };

  return (
    <MobileFrame>
      <header className="flex items-center gap-2 px-4 pt-6">
        <Link to="/home" className="p-2 rounded-full bg-card/60 ring-1 ring-gold/30">
          <ArrowLeft className="size-4 text-gold" />
        </Link>
        <h1 className="flex-1 text-center font-display text-lg gold-text tracking-widest uppercase">
          Campagna
        </h1>
        <div className="size-8" />
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-12 relative custom-scrollbar">
        {/* Parallax Background Decor */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <motion.div
            animate={{ y: [0, -100, 0], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/4 size-64 bg-mystic-glow/20 blur-[100px] rounded-full"
          />
          <motion.div
            animate={{ y: [0, 100, 0], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 right-1/4 size-80 bg-gold/10 blur-[120px] rounded-full"
          />
        </div>

        <div className="relative">
          {/* Progress Indicator */}
          <div className="mb-10 px-4">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-black uppercase text-gold/60 tracking-tighter">
                Sincronia Narrativa
              </span>
              <span className="text-xs font-display font-bold text-gold">
                {Math.round((campaignProgress / CAMPAIGN_NODES.length) * 100)}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(campaignProgress / CAMPAIGN_NODES.length) * 100}%` }}
                className="h-full bg-gradient-to-r from-mystic to-gold shadow-[0_0_10px_rgba(255,215,0,0.5)]"
              />
            </div>
          </div>

          {/* Visual path line */}
          <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-gradient-to-b from-gold/40 via-gold/10 to-transparent" />

          {CAMPAIGN_NODES.map((node, i) => {
            const isLocked = i > campaignProgress;
            const isCurrent = i === campaignProgress;

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn("relative pl-16 pb-12 last:pb-0", isLocked && "opacity-50 grayscale")}
              >
                {/* Node marker */}
                <div
                  className={cn(
                    "absolute left-[26px] top-0 size-10 rounded-full flex items-center justify-center border-2 transition-all shadow-2xl",
                    isCurrent
                      ? "bg-gold border-white scale-110 z-10"
                      : isLocked
                        ? "bg-abyss border-white/10"
                        : "bg-mystic/40 border-gold/50",
                  )}
                >
                  {isLocked ? (
                    <Lock className="size-4 text-white/30" />
                  ) : (
                    <Sparkles
                      className={cn("size-5", isCurrent ? "text-black animate-pulse" : "text-gold")}
                    />
                  )}
                </div>

                <div
                  className={cn(
                    "p-5 rounded-[2rem] border backdrop-blur-md transition-all",
                    isCurrent
                      ? "bg-gold/10 border-gold/40 shadow-[0_0_30px_rgba(255,215,0,0.1)]"
                      : "bg-card/40 border-white/5",
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-display text-sm font-bold text-white tracking-wider">
                      {node.title}
                    </h3>
                    <span className="text-[8px] uppercase tracking-widest text-gold/60 font-black">
                      Nodo 0{node.id}
                    </span>
                  </div>

                  <p className="text-[10px] text-white/50 leading-relaxed mb-4 italic">
                    {node.lore}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Book className="size-3 text-gold/40" />
                      <span className="text-[8px] text-white/30 uppercase tracking-widest">
                        Premio: {node.reward}
                      </span>
                    </div>

                    {!isLocked && (
                      <button
                        onClick={() => handleStartNode(node.id)}
                        className={cn(
                          "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all",
                          isCurrent ? "bg-gold text-black shadow-lg" : "bg-white/10 text-white",
                        )}
                      >
                        <Play className="size-3 fill-current" />
                        {isCurrent ? "Inizia" : "Rigioca"}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <footer className="p-4 bg-abyss/80 border-t border-white/5 backdrop-blur-md text-center">
        <p className="text-[8px] text-white/20 uppercase tracking-[0.4em]">
          Scopri i segreti della tua mente
        </p>
      </footer>
    </MobileFrame>
  );
}
