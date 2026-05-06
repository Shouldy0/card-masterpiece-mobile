import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useGame, TERRITORIES } from "@/game/store";
import { cardsById, TerritoryId } from "@/game/cards";
import { GameCard, CardBack, CardFromId } from "@/components/GameCard";
import { FocusGems, Hexagon, MobileFrame } from "@/components/Common";
import { Hourglass, Settings, Eye } from "lucide-react";

export const Route = createFileRoute("/match")({ component: Match });

const territoryAccents: Record<TerritoryId, string> = {
  memoria: "from-amber-eclipse/30 via-amber-eclipse/10",
  trauma: "from-rose/30 via-rose/10",
  sogno: "from-azure/30 via-azure/10",
};

function Match() {
  const match = useGame((s) => s.match);
  const playCard = useGame((s) => s.playCard);
  const endTurn = useGame((s) => s.endTurn);
  const startMatch = useGame((s) => s.startMatch);
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [revealing, setRevealing] = useState<{ uid: string; territory: TerritoryId } | null>(null);

  useEffect(() => {
    if (!match) startMatch();
  }, [match, startMatch]);

  useEffect(() => {
    if (match?.status === "ended") {
      const t = setTimeout(() => navigate({ to: "/end" }), 800);
      return () => clearTimeout(t);
    }
  }, [match?.status, navigate]);

  if (!match) return null;

  const handlePlay = (territory: TerritoryId) => {
    if (!selected) return;
    const card = cardsById[selected];
    if (!card || card.cost > match.focus.player) { setSelected(null); return; }
    setRevealing({ uid: selected, territory });
    setTimeout(() => {
      playCard(selected, territory);
      setRevealing(null);
      setSelected(null);
    }, 900);
  };

  return (
    <MobileFrame className="px-3 pb-3 pt-3">
      {/* opponent */}
      <PlayerStrip side="ai" name="Ombra Nascosta" sub="Coscienza Errante" hp={match.hp.ai} focus={match.focus.ai} maxFocus={match.maxFocus} hand={match.hand.ai.length} />

      {/* opponent hand (backs) */}
      <div className="mt-2 flex justify-center -space-x-3">
        {Array.from({ length: Math.min(5, match.hand.ai.length) }).map((_, i) => (
          <CardBack key={i} size="xs" />
        ))}
      </div>

      {/* territories */}
      <div className="mt-3 flex flex-1 flex-col gap-2 overflow-y-auto scrollbar-hide">
        {TERRITORIES.map((t) => (
          <TerritoryPanel
            key={t.id}
            territory={t}
            cards={match.board[t.id]}
            onDrop={() => handlePlay(t.id)}
            canPlay={!!selected}
          />
        ))}
      </div>

      {/* player strip */}
      <div className="mt-2">
        <PlayerStrip side="player" name="Dreamer" sub="Risvegliata" hp={match.hp.player} focus={match.focus.player} maxFocus={match.maxFocus} hand={match.hand.player.length} />
      </div>

      {/* hand */}
      <div className="relative mt-2 flex justify-center gap-1 overflow-x-auto scrollbar-hide pb-1">
        {match.hand.player.map((id, i) => (
          <motion.div
            key={`${id}-${i}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.04 }}
          >
            <CardFromId
              id={id}
              size="md"
              selected={selected === id}
              faded={cardsById[id]?.cost > match.focus.player}
              onClick={() => setSelected(selected === id ? null : id)}
            />
          </motion.div>
        ))}
      </div>

      {/* end turn */}
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 rounded-md bg-card/60 px-2 py-1.5 text-[10px] text-muted-foreground ring-1 ring-gold/20">
          <Hourglass className="h-3 w-3 text-gold" /> Turno {match.turn}/{match.maxTurns}
        </div>
        <button
          onClick={() => endTurn()}
          className="rounded-full gold-frame bg-gradient-to-r from-mystic to-mystic-glow px-6 py-2.5 font-display text-sm uppercase tracking-widest text-foreground glow-mystic"
        >
          Fine Turno
        </button>
        <button onClick={() => navigate({ to: "/settings" })} className="size-9 rounded-full bg-card/60 ring-1 ring-gold/30 flex items-center justify-center">
          <Settings className="h-4 w-4 text-gold" />
        </button>
      </div>

      {/* reveal animation overlay */}
      <AnimatePresence>
        {revealing && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-abyss/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ rotateY: 0, scale: 0.8 }}
              animate={{ rotateY: 180, scale: 1.1 }}
              transition={{ duration: 0.7 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div style={{ transform: "rotateY(180deg)" }}>
                <CardFromId id={revealing.uid} size="xl" glow />
              </div>
            </motion.div>
            <motion.div
              className="absolute inset-0 -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.9 }}
            >
              <div className="absolute inset-0 bg-mystic-glow/20 blur-3xl" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MobileFrame>
  );
}

function PlayerStrip({ side, name, sub, hp, focus, maxFocus, hand }: { side: "player" | "ai"; name: string; sub: string; hp: number; focus: number; maxFocus: number; hand: number }) {
  return (
    <div className={`flex items-center gap-2 rounded-xl bg-card/60 p-2 ring-1 ring-gold/20 ${side === "ai" ? "" : "flex-row-reverse text-right"}`}>
      <div className="relative">
        <div className="size-10 rounded-full ring-2 ring-gold/60 bg-gradient-to-br from-mystic to-abyss flex items-center justify-center">
          <Eye className="h-4 w-4 text-gold" />
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2"><Hexagon size="sm" color="rose">{hp}</Hexagon></div>
      </div>
      <div className={`flex-1 ${side === "ai" ? "" : "text-left"}`}>
        <p className="font-display text-xs text-foreground leading-tight">{name}</p>
        <p className="text-[9px] text-muted-foreground">{sub}</p>
      </div>
      <FocusGems value={focus} max={maxFocus} />
      <div className="text-[10px] text-muted-foreground hidden sm:block">{hand} carte</div>
    </div>
  );
}

function TerritoryPanel({ territory, cards, onDrop, canPlay }: { territory: typeof TERRITORIES[number]; cards: any[]; onDrop: () => void; canPlay: boolean }) {
  const playerPower = cards.filter((c) => c.side === "player").reduce((s, c) => s + c.power, 0);
  const aiPower = cards.filter((c) => c.side === "ai").reduce((s, c) => s + c.power, 0);
  const winning = playerPower > aiPower;

  return (
    <button
      onClick={onDrop}
      disabled={!canPlay}
      className={`relative w-full rounded-xl bg-gradient-to-b ${territoryAccents[territory.id]} to-card/80 p-2 text-left ring-1 ring-gold/30 transition-all ${canPlay ? "ring-gold cursor-pointer animate-pulse" : ""}`}
    >
      <div className="mb-1 flex items-center justify-between">
        <div>
          <p className="font-display text-[11px] uppercase tracking-widest text-gold">{territory.name}</p>
          <p className="text-[9px] text-muted-foreground line-clamp-1">{territory.rule}</p>
        </div>
        <div className="text-right">
          <div className={`font-display text-sm ${winning ? "text-gold" : "text-foreground"}`}>{playerPower}</div>
          <div className="text-[9px] text-rose">{aiPower} avv.</div>
        </div>
      </div>

      {/* AI side */}
      <div className="flex gap-1 mb-1 min-h-[2.5rem]">
        {cards.filter((c) => c.side === "ai").map((c) => (
          <CardFromId key={c.uid} id={c.cardId} size="xs" />
        ))}
      </div>
      <div className="h-px bg-gold/20" />
      {/* Player side */}
      <div className="flex gap-1 mt-1 min-h-[2.5rem]">
        {cards.filter((c) => c.side === "player").map((c) => (
          <motion.div key={c.uid} initial={{ scale: 0, rotateY: 180 }} animate={{ scale: 1, rotateY: 0 }} transition={{ duration: 0.4 }}>
            <CardFromId id={c.cardId} size="xs" />
          </motion.div>
        ))}
      </div>
    </button>
  );
}
