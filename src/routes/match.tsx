import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useGame, TERRITORIES } from "@/game/store";
import { cardsById, TerritoryId } from "@/game/cards";
import { CardFromId } from "@/components/GameCard";
import { sounds } from "@/utils/audio";
import { Info, X, ArrowUpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSound } from "@/hooks/useSound";
import { EnemyTopBar, BattleRow, PlayerHand, ActionButton } from "@/components/battlefield";

export const Route = createFileRoute("/match")({ component: Match });

const territoryMeta: Record<TerritoryId, { color: string; icon: string }> = {
  memoria: { color: "text-gold", icon: "🌳" },
  trauma:  { color: "text-rose", icon: "🖤" },
  sogno:   { color: "text-azure", icon: "🌙" },
};

const territoryList = TERRITORIES.map((t) => ({
  id: t.id as TerritoryId,
  name: t.name,
  icon: territoryMeta[t.id as TerritoryId].icon,
  color: territoryMeta[t.id as TerritoryId].color,
}));

function Match() {
  const navigate = useNavigate();
  const match = useGame((s) => s.match);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealing, setRevealing] = useState<{ uid: string; territory: TerritoryId } | null>(null);
  const playCard = useGame((s) => s.playCard);
  const endTurn = useGame((s) => s.endTurn);
  const startMatch = useGame((s) => s.startMatch);
  const { play } = useSound();

  const [impacts, setImpacts] = useState<Record<string, number>>({});
  const [globalImpact, setGlobalImpact] = useState(0);

  useEffect(() => {
    sounds.startSceneMusic("match");
  }, []);

  useEffect(() => {
    if (!match) startMatch();
  }, [match, startMatch]);

  useEffect(() => {
    if (match?.status === "ended") {
      play(match.result === "win" ? "victory" : "fail");
      const t = setTimeout(() => navigate({ to: "/end" }), 1200);
      return () => clearTimeout(t);
    }
  }, [match?.status, match?.result, navigate, play]);

  if (!match) return null;

  const handleSelect = (id: string) => {
    setSelected(selected === id ? null : id);
    play("lock");
  };

  const handleEndTurn = () => {
    play("ripple");
    endTurn();
    setTimeout(() => play("card_deal"), 250);
  };

  const handlePlay = (territory: TerritoryId) => {
    if (!selected) return;
    const card = cardsById[selected];
    if (!card || card.cost > match.focus.player) { setSelected(null); return; }
    setRevealing({ uid: selected, territory });
    play("card_flip");
    setImpacts((prev) => ({ ...prev, [territory]: (prev[territory] || 0) + 1 }));
    setGlobalImpact((prev) => prev + 1);
    setTimeout(() => {
      playCard(selected, territory);
      setImpacts((prev) => { const n = { ...prev }; delete n[territory]; return n; });
      setGlobalImpact(0);
      setRevealing(null);
      setSelected(null);
    }, 600);
  };

  const handleDragPlayCard = (cardId: string) => {
    const card = cardsById[cardId];
    if (!card || card.cost > match.focus.player) return;
    const territory: TerritoryId = card.type === "ricordo" ? "memoria" : "sogno";
    setRevealing({ uid: cardId, territory });
    play("card_flip");
    setImpacts((prev) => ({ ...prev, [territory]: (prev[territory] || 0) + 1 }));
    setGlobalImpact((prev) => prev + 1);
    setTimeout(() => {
      playCard(cardId, territory);
      setImpacts((prev) => { const n = { ...prev }; delete n[territory]; return n; });
      setGlobalImpact(0);
      setRevealing(null);
      setSelected(null);
    }, 600);
  };

  const tutorialStep = useGame((s) => s.tutorialStep);
  const setTutorialStep = useGame((s) => s.setTutorialStep);

  const getTutorialContent = () => {
    switch (tutorialStep) {
      case 1: return { title: "Inizia il Rituale", desc: "Tocca 'Ossessione' e poi tocca il territorio 'Sogno Lucido' per giocarla.", target: "Ossessione -> Sogno Lucido" };
      case 2: return { title: "Flusso di Energia", desc: "Hai usato Focus. Ora tocca 'END TURN' per passare il turno.", target: "Premi END TURN" };
      case 3: return { title: "Sinergia Territoriale", desc: "L'avversario ha risposto. Tocca 'Bosco Sacro' e poi 'Memoria' per il bonus.", target: "Bosco Sacro -> Memoria" };
      case 4: return { title: "Il Dominio", desc: "Stai controllando 2 territori. Concludi il turno.", target: "Premi END TURN" };
      default: return null;
    }
  };

  const tutorial = getTutorialContent();

  useEffect(() => {
    if (match.isTutorial) {
      if (tutorialStep === 1 && match.board.sogno.length > 0) setTutorialStep(2);
      if (tutorialStep === 2 && match.turn === 2) setTutorialStep(3);
      if (tutorialStep === 3 && match.board.memoria.length > 0) setTutorialStep(4);
    }
  }, [match, tutorialStep, setTutorialStep]);

  const actionLabel = match.isTutorial && tutorialStep === 1 ? "CONFERMA"
    : selected ? "ATTACCA"
    : "FINE TURNO";

  return (
    <div className={cn(
      "relative h-[100dvh] w-screen overflow-hidden bg-abyss text-foreground",
      globalImpact > 0 && "impact-hitstop"
    )}>
      {/* Subtle background atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-mystic/5 via-transparent to-abyss/80" />
        <div className="absolute top-0 -left-1/4 size-[600px] bg-mystic/5 blur-[100px]" />
        <div className="absolute bottom-0 -right-1/4 size-[600px] bg-rose/5 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(0,0,0,0.6)_100%)] pointer-events-none z-[1]" />
      </div>

      {/* Impact flash */}
      <AnimatePresence>
        {globalImpact > 0 && (
          <motion.div
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/5 pointer-events-none z-50"
          />
        )}
      </AnimatePresence>

      {/* Tutorial overlay */}
      <AnimatePresence>
        {match.isTutorial && tutorial && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-16 inset-x-4 z-[200]"
          >
            <div className="bg-black/80 backdrop-blur-xl border border-gold/30 rounded-xl p-3 shadow-2xl flex items-start gap-2.5 ring-1 ring-white/5">
              <button onClick={() => setTutorialStep(99)} className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-red-500/80 text-white flex items-center justify-center shadow-lg pointer-events-auto">
                <X className="size-2.5" />
              </button>
              <div className="size-7 rounded-full bg-gold/10 flex items-center justify-center shrink-0 border border-gold/20">
                <Info className="size-3 text-gold" />
              </div>
              <div className="flex-1">
                <h4 className="font-display text-[9px] text-gold tracking-widest uppercase mb-0.5">{tutorial.title}</h4>
                <p className="text-[8px] text-white/70 leading-tight">{tutorial.desc}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <ArrowUpCircle className="size-2 text-gold animate-bounce" />
                  <span className="text-[6px] uppercase tracking-widest text-gold/60 font-bold">{tutorial.target}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main layout */}
      <div className={cn("relative z-10 flex flex-col h-full", globalImpact > 0 && "impact-shake")}>
        {/* TOP: Enemy info */}
        <EnemyTopBar
          hp={match.hp.ai}
          maxHp={20}
          focus={match.focus.ai}
          maxFocus={match.maxFocus}
          turn={match.turn}
          maxTurns={match.maxTurns}
          name="OMBRA"
        />

        {/* Separator */}
        <div className="mx-3 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        {/* CENTER: Battlefield slots */}
        <BattleRow
          territories={territoryList}
          board={match.board}
          selected={selected}
          impacts={impacts}
          onPlay={handlePlay}
        />

        {/* BOTTOM: Hand + Player info + Action */}
        <div className="relative">
          {/* Player info bar */}
          <div className="flex items-center justify-between px-3 py-1.5">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full border-2 border-gold/30 bg-abyss overflow-hidden shadow-lg shrink-0">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Dreamer&backgroundColor=030617&mouth=smile"
                  alt="Player"
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-display text-[9px] uppercase tracking-wider text-white/60">TU</span>
                  <span className="font-display text-[10px] font-bold text-gold">{match.hp.player}</span>
                </div>
                <div className="w-16 h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold to-yellow-400 transition-all"
                    style={{ width: `${(match.hp.player / 20) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Focus gems */}
              <div className="flex items-center gap-0.5">
                {Array.from({ length: match.maxFocus }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "size-1.5 rounded-sm transition-all duration-300",
                      i < match.focus.player ? "bg-gold shadow-[0_0_6px_rgba(255,215,0,0.5)]" : "bg-white/10"
                    )}
                  />
                ))}
              </div>
              {/* Deck count */}
              <div className="flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 border border-white/5">
                <span className="font-display text-[9px] text-white/40">Mazzo</span>
                <span className="font-display text-[10px] font-bold text-white/80">{match.deck.player.length}</span>
              </div>
            </div>
          </div>

          {/* Hand + Action button */}
          <div className="relative flex items-end">
            <div className="flex-1">
              <PlayerHand
                cards={match.hand.player}
                selected={selected}
                playerFocus={match.focus.player}
                onSelect={handleSelect}
                onDragToPlay={handleDragPlayCard}
              />
            </div>
            {/* Action button - bottom right */}
            <div className="absolute bottom-3 right-3 z-30">
              <ActionButton
                label={actionLabel}
                onClick={handleEndTurn}
                sublabel={selected ? undefined : `Turno ${match.turn}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reveal animation overlay */}
      <AnimatePresence>
        {revealing && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-abyss/80 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative"
              initial={{ scale: 0.6, y: 60, opacity: 0 }}
              animate={{ scale: 1.1, y: 0, opacity: 1 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
            >
              <CardFromId id={revealing.uid} size="xl" glow />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
