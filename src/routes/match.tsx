import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
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
  memoria: { color: "text-gold", icon: "🏺" },
  trauma: { color: "text-rose", icon: "💀" },
  sogno: { color: "text-azure", icon: "✨" },
};

function Match() {
  const match = useGame((s) => s.match);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealing, setRevealing] = useState<{ uid: string; territory: TerritoryId } | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  const [activeResolvingLane, setActiveResolvingLane] = useState<TerritoryId | null>(null);
  const playCard = useGame((s) => s.playCard);
  const repressCard = useGame((s) => s.repressCard);
  const endTurn = useGame((s) => s.endTurn);
  const [globalImpact, setGlobalImpact] = useState(0);
  const navigate = useNavigate();
  const { play } = useSound();

  const territoryList = TERRITORIES.map((t) => ({
    ...t,
    ...territoryMeta[t.id],
  }));

  const impacts = territoryList.map((t) =>
    match?.board[t.id].some((c) => c.uid === revealing?.uid),
  );

  useEffect(() => {
    if (!match) navigate({ to: "/home" });
  }, [match, navigate]);

  if (!match) return null;

  const handleSelect = (id: string) => {
    if (isResolving) return;
    setSelected(selected === id ? null : id);
    play("lock");
  };

  const handleEndTurn = async () => {
    if (isResolving) return;
    play("ripple");
    setIsResolving(true);

    const lanes: TerritoryId[] = ["memoria", "trauma", "sogno"];
    for (const lane of lanes) {
      setActiveResolvingLane(lane);
      play("ping");
      await new Promise((r) => setTimeout(r, 600));
    }

    setActiveResolvingLane(null);
    endTurn();
    setTimeout(() => {
      setIsResolving(false);
      play("card_deal");
    }, 400);
  };

  const handlePlay = (territory: TerritoryId) => {
    if (!selected) return;
    const card = cardsById[selected];
    if (!card || card.cost > match.lucidity.player) {
      play("error");
      return;
    }

    play("card_play");
    setGlobalImpact(1);
    setRevealing({ uid: selected, territory });

    setTimeout(() => {
      playCard(selected, territory);
      setGlobalImpact(0);
      setRevealing(null);
      setSelected(null);
    }, 600);
  };

  const handleDragPlayCard = (cardId: string, territory: TerritoryId) => {
    const card = cardsById[cardId];
    if (!card || card.cost > match.lucidity.player) {
      play("error");
      return;
    }

    play("card_play");
    setGlobalImpact(1);
    setRevealing({ uid: cardId, territory });

    setTimeout(() => {
      playCard(cardId, territory);
      setGlobalImpact(0);
      setRevealing(null);
      setSelected(null);
    }, 600);
  };

  const handleRepress = (cardId: string) => {
    play("ripple");
    repressCard(cardId);
    setSelected(null);
  };

  const tutorialStep = useGame((s) => s.tutorialStep);
  const setTutorialStep = useGame((s) => s.setTutorialStep);

  const getTutorialContent = () => {
    switch (tutorialStep) {
      case 1:
        return {
          title: "Sincronia Mentale",
          desc: "Vedi la barra dorata in basso? È la tua Sincronia (HP). Se arriva a 0, perdi. Sopra c'è la Lucidità (Energia) che cresce ogni turno.",
          target: "Osserva Barra Sincronia",
        };
      case 2:
        return {
          title: "Prima Memoria",
          desc: "Hai 1 Lucidità. Trascina 'Stella Cadente' sul territorio 'Sogno'. Ogni territorio ha regole uniche: leggile in alto!",
          target: "Stella Cadente -> Sogno",
        };
      case 3:
        return {
          title: "Passaggio di Stato",
          desc: "Ottimo. Ora tocca 'FINE TURNO'. Nel prossimo turno avrai 2 Lucidità e potrai giocare memorie più potenti.",
          target: "Premi FINE TURNO",
        };
      case 4:
        return {
          title: "Controllare il Campo",
          desc: "L'avversario ha risposto. Vinci chi ha più POTERE in una zona. Controlla 2 zone su 3 alla fine del Turno 6 per vincere!",
          target: "Gioca in Memoria",
        };
      case 5:
        return {
          title: "Il Dominio",
          desc: "Stai controllando 2 territori. Concludi il turno.",
          target: "Premi FINE TURNO",
        };
      default:
        return null;
    }
  };

  const [hpDiff, setHpDiff] = useState<{ player: number | null; ai: number | null }>({ player: null, ai: null });
  const tutorial = getTutorialContent();
  const prevHP = useRef({ player: match.hp.player, ai: match.hp.ai });
  const prevTrauma = useRef({ player: match.trauma.player, ai: match.trauma.ai });

  useEffect(() => {
    if (match.hp.player !== prevHP.current.player) {
      const diff = match.hp.player - prevHP.current.player;
      setHpDiff(prev => ({ ...prev, player: diff }));
      if (diff < 0) {
        play("damage");
        setGlobalImpact(1);
      } else if (diff > 0) {
        play("heal");
      }
      setTimeout(() => setHpDiff(prev => ({ ...prev, player: null })), 1500);
    }
    prevHP.current.player = match.hp.player;
  }, [match.hp.player, play]);

  useEffect(() => {
    if (match.hp.ai !== prevHP.current.ai) {
      const diff = match.hp.ai - prevHP.current.ai;
      setHpDiff(prev => ({ ...prev, ai: diff }));
      if (diff < 0) {
        play("damage");
        setGlobalImpact(1);
      }
      setTimeout(() => setHpDiff(prev => ({ ...prev, ai: null })), 1500);
    }
    prevHP.current.ai = match.hp.ai;
  }, [match.hp.ai, play]);

  useEffect(() => {
    if (match.trauma.player > prevTrauma.current.player) {
      play("error");
    }
    prevTrauma.current.player = match.trauma.player;
  }, [match.trauma.player, play]);

  useEffect(() => {
    if (match.isTutorial) {
      if (tutorialStep === 2 && match.board.sogno.length > 0) setTutorialStep(3);
      if (tutorialStep === 3 && match.turn === 2) setTutorialStep(4);
    }
  }, [match.isTutorial, match.board.sogno.length, match.turn, tutorialStep, setTutorialStep]);

  const handleTutorialNext = () => {
    if (tutorialStep === 1) setTutorialStep(2);
  };

  const actionLabel =
    isResolving ? "ATTENDI" :
    match.isTutorial && tutorialStep === 1 ? "CAPITO" : selected ? "GIOCA" : "FINE TURNO";

  return (
    <div
      className={cn(
        "relative h-[100dvh] w-screen overflow-hidden bg-abyss text-foreground",
        globalImpact > 0 && "impact-shake",
      )}
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 pointer-events-none" />

      {/* Impact Flash Effect */}
      <AnimatePresence>
        {globalImpact > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[100] pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="relative flex flex-col h-full max-w-md mx-auto overflow-hidden">
        {/* TOP: Enemy Info */}
        <div className="relative">
          <EnemyTopBar
            hp={match.hp.ai}
            maxHp={20}
            lucidity={match.lucidity.ai}
            maxLucidity={match.maxLucidity}
            trauma={match.trauma.ai}
            turn={match.turn}
            maxTurns={match.maxTurns}
            name="OMBRA"
          />
          {/* AI HP Diff Floating Number */}
          <AnimatePresence>
            {hpDiff.ai !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 40 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "absolute right-10 top-10 font-display text-lg font-black z-50",
                  hpDiff.ai > 0 ? "text-green-400" : "text-rose"
                )}
              >
                {hpDiff.ai > 0 ? `+${hpDiff.ai}` : hpDiff.ai}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Separator */}
        <div className="mx-3 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />


        {/* CENTER: Battlefield slots */}
        <div className="relative flex-1 flex flex-col">
          <BattleRow
            territories={territoryList}
            board={match.board}
            selected={selected}
            impacts={impacts}
            onPlay={handlePlay}
          />

          {/* Resolution Overlay / Highlights */}
          <AnimatePresence>
            {isResolving && activeResolvingLane && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 pointer-events-none"
              >
                {territoryList.map((t, i) => (
                  <div
                    key={t.id}
                    className={cn(
                      "absolute top-0 bottom-0 transition-all duration-300",
                      activeResolvingLane === t.id ? "bg-white/5 ring-4 ring-white/20 z-50" : "opacity-0"
                    )}
                    style={{
                      left: `${(i / 3) * 100}%`,
                      width: "33.33%",
                    }}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 1 }}
                        className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-2xl"
                      >
                        <span className="font-display text-[10px] uppercase tracking-[0.3em] font-black text-white">
                          Risoluzione...
                        </span>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Battle Log strip */}
        <AnimatePresence>
          {match.log.length > 0 && (
            <motion.div
              key={match.log[match.log.length - 1]}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mx-3 mb-1 px-3 py-1 bg-black/40 border border-white/5 rounded-lg flex items-center gap-2 overflow-hidden"
            >
              <span className="text-white/20 text-[6px]">▶</span>
              <p className="text-[7px] text-white/60 font-mono truncate flex-1">
                {match.log[match.log.length - 1]}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOTTOM: Hand + Player info + Action */}
        <div className="relative">
          {/* Player info bar */}
          <div className="flex items-center justify-between px-3 py-1.5">
            <div className="flex items-center gap-2 relative">
              <div className="size-8 rounded-full border-2 border-gold/30 bg-abyss overflow-hidden shadow-lg shrink-0">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Dreamer&backgroundColor=030617&mouth=smile"
                  alt="Player"
                  className="size-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-1 w-20">
                {/* HP */}
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[8px] uppercase tracking-wider text-white/60">
                      Sincronia
                    </span>
                    <span className="font-display text-[9px] font-bold text-gold">
                      {match.hp.player}
                    </span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold to-yellow-400 transition-all"
                      style={{ width: `${(match.hp.player / 20) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              {/* Player HP Diff Floating Number */}
              <AnimatePresence>
                {hpDiff.player !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: -30 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "absolute left-10 top-0 font-display text-lg font-black z-50",
                      hpDiff.player > 0 ? "text-green-400" : "text-rose"
                    )}
                  >
                    {hpDiff.player > 0 ? `+${hpDiff.player}` : hpDiff.player}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-[9px] font-bold text-cyan-400 uppercase tracking-widest mr-1">Lucidità</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: match.maxLucidity }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={false}
                      animate={i < match.lucidity.player ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0.3 }}
                      className={cn(
                        "size-2.5 rotate-45 border transition-all duration-300",
                        i < match.lucidity.player
                          ? "bg-cyan-400 border-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                          : "bg-white/5 border-white/10",
                      )}
                    />
                  ))}
                </div>
                <span className="font-display text-xs font-black text-cyan-400 ml-1 ml-2">
                  {match.lucidity.player}
                </span>
              </div>
              <div className="font-display text-[8px] text-white/30 tracking-[0.2em] uppercase">
                Turno <span className="text-white/80 font-bold">{match.turn}</span> / {match.maxTurns}
              </div>
            </div>
          </div>

          <div className="relative px-3 pt-1 pb-4 flex flex-col gap-2">
            {/* Tutorial Overlay */}
            <AnimatePresence>
              {tutorial && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-gold/90 text-black p-3 rounded-2xl shadow-2xl mb-2 border-2 border-white/50"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Info className="size-4" />
                    <span className="font-display text-[10px] font-black uppercase tracking-widest">{tutorial.title}</span>
                  </div>
                  <p className="text-[11px] font-medium leading-tight mb-2">{tutorial.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] opacity-60 font-bold tracking-widest uppercase">{tutorial.target}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Selected Card Info Panel */}
            <AnimatePresence>
              {selected && (() => {
                const selCard = cardsById[selected];
                if (!selCard) return null;
                const traitLabels = (selCard.traits || []).map(t => t.toUpperCase().replace('_', ' '));
                const effectLabel = selCard.effect.kind !== 'none' ? selCard.text : null;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-3 mb-2 shadow-2xl"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={cn("size-2 rounded-full",
                          selCard.type === "archetipo" ? "bg-purple-500" :
                          selCard.type === "ricordo" ? "bg-yellow-500" :
                          selCard.type === "maschera" ? "bg-red-500" :
                          selCard.type === "oblio" ? "bg-blue-500" :
                          selCard.type === "sogno" ? "bg-cyan-400" : "bg-emerald-500"
                        )} />
                        <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">{selCard.name}</h4>
                        <span className={cn("text-[7px] font-bold uppercase px-1.5 py-0.5 rounded border border-current",
                          selCard.type === "archetipo" ? "text-purple-400" :
                          selCard.type === "ricordo" ? "text-yellow-400" :
                          selCard.type === "maschera" ? "text-red-400" :
                          selCard.type === "oblio" ? "text-blue-400" :
                          selCard.type === "sogno" ? "text-cyan-400" : "text-emerald-400"
                        )}>{selCard.type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[8px] text-white/50">Costo</span>
                        <span className="font-display text-[10px] font-bold text-cyan-400">{selCard.cost}</span>
                        <span className="text-[8px] text-white/50 ml-1">Potere</span>
                        <span className="font-display text-[10px] font-bold text-gold">{selCard.power}</span>
                      </div>
                    </div>
                    {effectLabel && (
                      <p className="text-[8px] text-white/90 bg-white/5 rounded px-2 py-1 mb-1 leading-tight">
                        {effectLabel}
                      </p>
                    )}
                    {traitLabels.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {traitLabels.map((t, i) => (
                          <span key={i} className="text-[6.5px] bg-mystic/20 border border-mystic/30 text-mystic-glow px-1.5 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                    )}
                    {!effectLabel && traitLabels.length === 0 && (
                      <p className="text-[7px] text-white/50 italic">{selCard.text}</p>
                    )}
                  </motion.div>
                );
              })()}
            </AnimatePresence>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <PlayerHand
                  cards={match.hand.player}
                  selected={selected}
                  playerLucidity={match.lucidity.player}
                  onSelect={handleSelect}
                  onDragToPlay={handleDragPlayCard}
                  onRepress={handleRepress}
                />
              </div>
              {/* Action button - bottom right */}
              <div className="absolute bottom-3 right-3 z-30">
                <ActionButton
                  label={actionLabel}
                  onClick={match.isTutorial && tutorialStep === 1 ? handleTutorialNext : handleEndTurn}
                  disabled={isResolving}
                  sublabel={isResolving ? "..." : selected ? undefined : `Turno ${match.turn}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reveal animation overlay */}
      <AnimatePresence>
        {revealing && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-abyss/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative"
              initial={{ scale: 0.6, y: 60, opacity: 0 }}
              animate={{ scale: 1.1, y: 0, opacity: 1 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
            >
              <CardFromId id={revealing.uid} size="xl" glow className="card-activating" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
