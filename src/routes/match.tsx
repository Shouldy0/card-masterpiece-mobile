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
  memoria: { color: "text-gold", icon: "🌳" },
  trauma: { color: "text-rose", icon: "🖤" },
  sogno: { color: "text-azure", icon: "🌙" },
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
  const repressCard = useGame((s) => s.repressCard);
  const endTurn = useGame((s) => s.endTurn);
  const startMatch = useGame((s) => s.startMatch);
  const { play } = useSound();

  const [impacts, setImpacts] = useState<Record<string, number>>({});
  const [globalImpact, setGlobalImpact] = useState(0);

  const [psychosisActive, setPsychosisActive] = useState(false);
  const prevPsychosisCountRef = useRef(match?.psychosisCount.player || 0);

  useEffect(() => {
    if (!match) return;
    if (match.psychosisCount.player > prevPsychosisCountRef.current) {
      setPsychosisActive(true);
      play("fail");
      setTimeout(() => setPsychosisActive(false), 2500);
      prevPsychosisCountRef.current = match.psychosisCount.player;
    }
  }, [match?.psychosisCount.player, play]);

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
    if (!card || card.cost > match.lucidity.player) {
      setSelected(null);
      return;
    }
    setRevealing({ uid: selected, territory });
    play("card_flip");
    setImpacts((prev) => ({ ...prev, [territory]: (prev[territory] || 0) + 1 }));
    setGlobalImpact((prev) => prev + 1);
    setTimeout(() => {
      playCard(selected, territory);
      setImpacts((prev) => {
        const n = { ...prev };
        delete n[territory];
        return n;
      });
      setGlobalImpact(0);
      setRevealing(null);
      setSelected(null);
    }, 600);
  };

  const handleDragPlayCard = (cardId: string) => {
    const card = cardsById[cardId];
    if (!card || card.cost > match.lucidity.player) return;
    const territory: TerritoryId = card.type === "ricordo" ? "memoria" : "sogno";
    setRevealing({ uid: cardId, territory });
    play("card_flip");
    setImpacts((prev) => ({ ...prev, [territory]: (prev[territory] || 0) + 1 }));
    setGlobalImpact((prev) => prev + 1);
    setTimeout(() => {
      playCard(cardId, territory);
      setImpacts((prev) => {
        const n = { ...prev };
        delete n[territory];
        return n;
      });
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
          title: "Inizia il Rituale",
          desc: "Hai 1 Lucidità. Tocca 'Stella Cadente' (Costo 1) e giocala in 'Sogno'.",
          target: "Stella Cadente -> Sogno",
        };
      case 2:
        return {
          title: "Flusso di Energia",
          desc: "Bene. Ogni turno la tua Lucidità aumenta. Ora tocca 'FINE TURNO'.",
          target: "Premi FINE TURNO",
        };
      case 3:
        return {
          title: "Sinergia Territoriale",
          desc: "Turno 2: hai 2 Lucidità. Gioca 'Giocattolo Rotto' in 'Memoria'.",
          target: "Giocattolo Rotto -> Memoria",
        };
      case 4:
        return {
          title: "Il Dominio",
          desc: "Stai controllando 2 territori. Concludi il turno.",
          target: "Premi END TURN",
        };
      default:
        return null;
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

  const actionLabel =
    match.isTutorial && tutorialStep === 1 ? "CONFERMA" : selected ? "ATTACCA" : "FINE TURNO";

  return (
    <div
      className={cn(
        "relative h-[100dvh] w-screen overflow-hidden bg-abyss text-foreground",
        globalImpact > 0 && "impact-hitstop",
      )}
    >
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

      {/* Psychosis Distortion */}
      <AnimatePresence>
        {psychosisActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[150] mix-blend-difference"
          >
            <div className="absolute inset-0 bg-red-600/30 backdrop-invert" />
            <div className="absolute inset-0 psychosis-noise opacity-30 mix-blend-overlay animate-[lane-trauma-glitch_0.2s_infinite]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="font-display text-4xl text-rose tracking-widest uppercase font-black mix-blend-screen animate-pulse shadow-rose drop-shadow-[0_0_20px_rgba(244,63,94,1)]">
                PSICOSI
              </h1>
            </div>
          </motion.div>
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
              <button
                onClick={() => setTutorialStep(99)}
                className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-red-500/80 text-white flex items-center justify-center shadow-lg pointer-events-auto"
              >
                <X className="size-2.5" />
              </button>
              <div className="size-7 rounded-full bg-gold/10 flex items-center justify-center shrink-0 border border-gold/20">
                <Info className="size-3 text-gold" />
              </div>
              <div className="flex-1">
                <h4 className="font-display text-[9px] text-gold tracking-widest uppercase mb-0.5">
                  {tutorial.title}
                </h4>
                <p className="text-[8px] text-white/70 leading-tight">{tutorial.desc}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <ArrowUpCircle className="size-2 text-gold animate-bounce" />
                  <span className="text-[6px] uppercase tracking-widest text-gold/60 font-bold">
                    {tutorial.target}
                  </span>
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
          lucidity={match.lucidity.ai}
          maxLucidity={match.maxLucidity}
          trauma={match.trauma.ai}
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
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full border-2 border-gold/30 bg-abyss overflow-hidden shadow-lg shrink-0">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Dreamer&backgroundColor=030617&mouth=smile"
                  alt="Player"
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
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
                {/* Active Buffs/Weakens */}
                {(match.buffs.player > 0 || match.weakens.ai > 0) && (
                  <div className="flex gap-1 -mt-1">
                    {match.buffs.player > 0 && (
                      <span className="text-[7px] text-green-400 font-bold bg-green-400/10 px-1 rounded">
                        +{match.buffs.player} ATK
                      </span>
                    )}
                    {match.weakens.ai > 0 && (
                      <span className="text-[7px] text-purple-400 font-bold bg-purple-400/10 px-1 rounded">
                        Oppressione
                      </span>
                    )}
                  </div>
                )}
                {/* Trauma */}
                <div className="flex flex-col gap-0.5 mt-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[8px] uppercase tracking-wider text-rose/80">
                      Trauma
                    </span>
                    <span className="font-display text-[9px] font-bold text-rose">
                      {match.trauma.player}%
                    </span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose to-red-600 transition-all"
                      style={{ width: `${Math.min(100, match.trauma.player)}%` }}
                    />
                  </div>
                </div>
              </div>
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

          {/* Hand + Action button */}
          <div className="relative flex items-end">
            {/* Selected card ability preview */}
          <AnimatePresence>
            {selected && (() => {
              const selCard = cardsById[selected];
              if (!selCard) return null;
              const effectLabel = (() => {
                const ef = selCard.effect;
                if (ef.kind === "draw") return `📖 Pesca ${ef.amount} carta${ef.amount > 1 ? "e" : ""}`;
                if (ef.kind === "buff_self") return (ef as any).target === "local" ? `✨ Aura +${ef.amount} Potere in questa Lane` : `⚡ +${ef.amount} Potere globale questo turno`;
                if (ef.kind === "weaken_enemy") return (ef as any).target === "local" ? `💀 Aura -${ef.amount} ai nemici in questa Lane` : `🌑 -${ef.amount} Potere nemico globale`;
                if (ef.kind === "heal") return selCard.traits?.includes("dynamic_heal") ? `💚 Cura 2 HP per Archetipo in gioco` : `💚 Cura ${ef.amount} HP`;
                if (ef.kind === "add_intrusive") return `🕷 Inietta ${ef.amount} Pensiero Intrusivo nella mano nemica`;
                return null;
              })();
              const traitLabels: string[] = [];
              if (selCard.traits?.includes("growth")) traitLabels.push("📈 Cresce +1 ogni turno");
              if (selCard.traits?.includes("loner")) traitLabels.push("🔮 +3 se solo in lane");
              if (selCard.traits?.includes("protector")) traitLabels.push("🛡 Protegge adiacenti");
              if (selCard.traits?.includes("oppressive")) traitLabels.push("👁 Aura -1 ai nemici in lane");
              if (selCard.traits?.includes("resetter")) traitLabels.push("♻ Azzera tutti gli effetti");
              if (selCard.traits?.includes("executioner")) traitLabels.push("⚔ Elimina la carta nemica più debole");
              return (
                <motion.div
                  key={selected}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full left-3 right-3 mb-1 z-30 bg-black/85 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-2xl"
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <h3 className="font-display text-[10px] uppercase tracking-widest text-white font-bold">{selCard.name}</h3>
                      <span className={cn(
                        "text-[7px] uppercase tracking-wider font-bold",
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

            {/* Subconscious Pit visual cue */}
            <AnimatePresence>
              {selected && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="absolute -bottom-8 left-0 right-0 h-40 bg-gradient-to-t from-black via-rose-900/30 to-transparent pointer-events-none flex items-end justify-center pb-12 z-0"
                >
                  <span className="font-display text-[10px] tracking-[0.3em] text-rose/60 uppercase">
                    ↓ Trascina giù per reprimere ↓
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 z-10">
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
              <CardFromId id={revealing.uid} size="xl" glow />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
