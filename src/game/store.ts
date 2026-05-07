import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CARDS, CardDef, cardsById, TerritoryId, TERRITORIES } from "./cards";

export type Side = "player" | "ai";

export interface PlayedCard {
  uid: string;
  cardId: string;
  side: Side;
  power: number; // computed
}

export interface MatchState {
  turn: number;
  maxTurns: number;
  focus: { player: number; ai: number };
  maxFocus: number;
  hp: { player: number; ai: number };
  hand: { player: string[]; ai: string[] };
  deck: { player: string[]; ai: string[] };
  board: Record<TerritoryId, PlayedCard[]>;
  buffs: Record<Side, number>; // self buffs
  weakens: Record<Side, number>; // applied to enemy
  log: string[];
  status: "playing" | "ended";
  result?: "win" | "lose" | "draw";
  territoryResults?: Record<TerritoryId, { p: number; a: number }>;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildStarterDeck(): string[] {
  // 15 cards
  const ids = ["eco_dimenticato","ricordo_sfuggente","sussurro_interiore","frammento_verita","maschera_dolore","catarsi","io_falso","luce_interiore","frammento_di_me","paura_primordiale","specchio_distorto","veglia_eterna","dolore_represso","risveglio_se","sogno_lucido"];
  return ids;
}

export function createInitialMatch(playerDeck: string[]): MatchState {
  const aiDeck = shuffle(["eco_dimenticato","sussurro_interiore","maschera_dolore","io_falso","ricordo_sfuggente","catarsi","paura_primordiale","specchio_distorto","ombra_celata","abisso_interiore","veglia_eterna","luce_interiore","frammento_di_me","dolore_represso","guardiano_silenzio"]);
  const pDeck = shuffle(playerDeck);
  return {
    turn: 1,
    maxTurns: 6,
    focus: { player: 3, ai: 3 },
    maxFocus: 6,
    hp: { player: 20, ai: 20 },
    hand: { player: pDeck.slice(0, 5), ai: aiDeck.slice(0, 5) },
    deck: { player: pDeck.slice(5), ai: aiDeck.slice(5) },
    board: { memoria: [], trauma: [], sogno: [] },
    buffs: { player: 0, ai: 0 },
    weakens: { player: 0, ai: 0 },
    log: ["La Reverie ha inizio…"],
    status: "playing",
  };
}

interface PlayerProgress {
  level: number;
  xp: number;
  xpToNext: number;
  gold: number;
  fragments: number;
  gems: number;
  wins: number;
  matches: number;
  rank: string;
  rankPoints: number;
  collection: string[]; // owned card ids
  deck: string[];
  title: string;
}

interface SettingsState {
  soundOn: boolean;
  musicVolume: number;
  sfxVolume: number;
  vibration: boolean;
  hints: boolean;
  animSpeed: number;
  language: "Italiano" | "English";
}

interface AppStore {
  player: PlayerProgress;
  settings: SettingsState;
  match: MatchState | null;
  onboardingDone: boolean;

  // actions
  setOnboardingDone: () => void;
  startMatch: () => void;
  playCard: (cardUid: string, territory: TerritoryId) => void;
  endTurn: () => void;
  exitMatch: () => void;
  saveDeck: (deck: string[]) => void;
  toggleSetting: (k: keyof SettingsState, v: any) => void;
  buyPack: (cost: number, currency: "gold" | "gems") => string[] | null;
  addGold: (n: number) => void;
}

function powerWithRules(card: CardDef, side: Side, territory: TerritoryId, buffs: number, weakensAgainst: number): number {
  let p = card.power;
  if (side === "player") p += buffs;
  if (side === "ai") p += buffs;
  // territory rules
  if (territory === "trauma") p -= 1;
  if (territory === "sogno" && side === "player") p += 1;
  // weakens applied by enemy
  p -= weakensAgainst;
  return Math.max(0, p);
}

function applyEffect(state: MatchState, card: CardDef, side: Side) {
  switch (card.effect.kind) {
    case "draw": {
      for (let i = 0; i < card.effect.amount; i++) {
        const top = state.deck[side].shift();
        if (top) state.hand[side].push(top);
      }
      break;
    }
    case "buff_self":
      state.buffs[side] += card.effect.amount;
      break;
    case "weaken_enemy":
      state.weakens[side] += card.effect.amount;
      break;
    case "heal":
      state.hp[side] = Math.min(20, state.hp[side] + card.effect.amount);
      break;
  }
}

function aiTurn(state: MatchState) {
  // simple greedy: play affordable cards on weakest territory
  let safety = 6;
  while (safety-- > 0) {
    const affordable = state.hand.ai
      .map((id) => cardsById[id])
      .filter((c) => c && c.cost <= state.focus.ai)
      .sort((a, b) => b.power / b.cost - a.power / a.cost);
    if (affordable.length === 0) break;
    const card = affordable[0];
    // pick territory where ai is losing most (or random)
    const tIds: TerritoryId[] = ["memoria", "trauma", "sogno"];
    const scored = tIds.map((t) => {
      const aiP = state.board[t].filter((c) => c.side === "ai").reduce((s, c) => s + c.power, 0);
      const plP = state.board[t].filter((c) => c.side === "player").reduce((s, c) => s + c.power, 0);
      return { t, diff: aiP - plP };
    }).sort((a, b) => a.diff - b.diff);
    const territory = scored[0].t;
    state.focus.ai -= card.cost;
    state.hand.ai = state.hand.ai.filter((id) => id !== card.id || false);
    // remove first occurrence
    const idx = state.hand.ai.indexOf(card.id);
    // ensure removal (handle above bug)
    if (idx === -1) {
      const rebuild = [...state.hand.ai];
      const i2 = rebuild.indexOf(card.id);
      if (i2 >= 0) rebuild.splice(i2, 1);
      state.hand.ai = rebuild;
    }
    applyEffect(state, card, "ai");
    const power = powerWithRules(card, "ai", territory, state.buffs.ai, state.weakens.player);
    state.board[territory].push({ uid: `ai-${state.turn}-${Math.random()}`, cardId: card.id, side: "ai", power });
    state.log.push(`Avversario gioca ${card.name} su ${territory}.`);
  }
}

function endMatchIfNeeded(state: MatchState) {
  if (state.turn > state.maxTurns) {
    const results: any = {};
    let pWins = 0, aWins = 0;
    (["memoria","trauma","sogno"] as TerritoryId[]).forEach((t) => {
      const p = state.board[t].filter((c) => c.side === "player").reduce((s, c) => s + c.power, 0);
      const a = state.board[t].filter((c) => c.side === "ai").reduce((s, c) => s + c.power, 0);
      results[t] = { p, a };
      if (p > a) pWins++; else if (a > p) aWins++;
    });
    state.territoryResults = results;
    state.status = "ended";
    state.result = pWins > aWins ? "win" : pWins < aWins ? "lose" : "draw";
  }
}

export const useGame = create<AppStore>()(
  persist(
    (set, get) => ({
      player: {
        level: 23,
        xp: 450,
        xpToNext: 1000,
        gold: 12450,
        fragments: 25,
        gems: 850,
        wins: 368,
        matches: 742,
        rank: "Sognatore I",
        rankPoints: 1250,
        collection: CARDS.map((c) => c.id),
        deck: buildStarterDeck(),
        title: "Sognatore",
      },
      settings: { soundOn: true, musicVolume: 0.5, sfxVolume: 0.8, vibration: true, hints: true, animSpeed: 1, language: "Italiano" },
      match: null,
      onboardingDone: false,

      setOnboardingDone: () => set({ onboardingDone: true }),

      startMatch: () => set({ match: createInitialMatch(get().player.deck) }),

      playCard: (cardUid, territory) => set((s) => {
        if (!s.match || s.match.status !== "playing") return s;
        const m = structuredClone(s.match);
        const cardId = cardUid;
        const card = cardsById[cardId];
        if (!card) return s;
        if (card.cost > m.focus.player) return s;
        const idx = m.hand.player.indexOf(cardId);
        if (idx === -1) return s;
        m.hand.player.splice(idx, 1);
        m.focus.player -= card.cost;
        applyEffect(m, card, "player");
        const power = powerWithRules(card, "player", territory, m.buffs.player, m.weakens.ai);
        m.board[territory].push({ uid: `p-${m.turn}-${Math.random()}`, cardId, side: "player", power });
        m.log.push(`Giochi ${card.name} su ${territory}.`);
        return { match: m };
      }),

      endTurn: () => set((s) => {
        if (!s.match) return s;
        const m = structuredClone(s.match);
        // AI turn
        aiTurn(m);
        // reset turn buffs/weakens
        m.buffs = { player: 0, ai: 0 };
        m.weakens = { player: 0, ai: 0 };
        m.turn += 1;
        m.focus.player = Math.min(m.maxFocus, m.turn + 2);
        m.focus.ai = Math.min(m.maxFocus, m.turn + 2);
        // draw
        const drawP = m.deck.player.shift(); if (drawP) m.hand.player.push(drawP);
        const drawA = m.deck.ai.shift(); if (drawA) m.hand.ai.push(drawA);
        m.log.push(`Turno ${m.turn}.`);
        endMatchIfNeeded(m);
        return { match: m };
      }),

      exitMatch: () => set((s) => {
        // award rewards on win
        if (s.match?.status === "ended" && s.match.result === "win") {
          const p = { ...s.player };
          p.xp += 120;
          p.gold += 50;
          p.fragments += 25;
          p.wins += 1;
          p.matches += 1;
          if (p.xp >= p.xpToNext) { p.level += 1; p.xp = p.xp - p.xpToNext; p.xpToNext = Math.round(p.xpToNext * 1.15); }
          return { match: null, player: p };
        }
        if (s.match?.status === "ended") {
          const p = { ...s.player, matches: s.player.matches + 1, xp: s.player.xp + 40 };
          return { match: null, player: p };
        }
        return { match: null };
      }),

      saveDeck: (deck) => set((s) => ({ player: { ...s.player, deck } })),

      toggleSetting: (k, v) => set((s) => ({ settings: { ...s.settings, [k]: v } })),

      buyPack: (cost, currency) => {
        const s = get();
        const balance = currency === "gold" ? s.player.gold : s.player.gems;
        if (balance < cost) return null;
        const pulled = shuffle(CARDS).slice(0, 5).map((c) => c.id);
        set({
          player: {
            ...s.player,
            gold: currency === "gold" ? s.player.gold - cost : s.player.gold,
            gems: currency === "gems" ? s.player.gems - cost : s.player.gems,
            fragments: s.player.fragments + 5,
          },
        });
        return pulled;
      },

      addGold: (n) => set((s) => ({ player: { ...s.player, gold: s.player.gold + n } })),
    }),
    { name: "reverie-store-v1" }
  )
);

export { TERRITORIES };
