import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CARDS, CardDef, cardsById, TerritoryId, TERRITORIES } from "./cards";
import { savePlayerToCloud, loadPlayerFromCloud } from "./persistence";

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
  // 15 cards from the new set
  const ids = ["v1_ambizione", "v3_nostalgia", "v10_armonia", "o1_chiave_antica", "o3_giocattolo", "o6_giardino", "c1_giullare", "c3_vittima", "c7_bambino", "b2_silenzio", "b4_neve", "b7_pioggia", "s1_miraggio", "s3_nuvola", "s9_rugiada"];
  return ids;
}

export function createInitialMatch(playerDeck: string[]): MatchState {
  const aiDeck = shuffle(["v5_follia", "v7_rancore", "o5_cenere", "o8_tempesta", "c5_martire", "c10_boia", "b3_oblio", "b6_abisso", "s8_castello", "s10_infinito", "v2_ossessione", "o2_bosco_sacro", "c2_re_caduto", "b5_cenere_blu", "s4_visione"]);
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

export interface PlayerProgress {
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
  syncCollection: () => void;
  buyPack: (cost: number, currency: "gold" | "gems") => string[] | null;
  addGold: (n: number) => void;
  syncWithCloud: (userId: string) => Promise<void>;
  user: any | null;
  setUser: (user: any | null) => void;
  resetPlayer: () => void;
}

function powerWithRules(state: MatchState, card: CardDef, side: Side, territory: TerritoryId): number {
  let p = card.power;
  const enemySide: Side = side === "player" ? "ai" : "player";
  
  // UNIQUE: Apatia (v4_apatia) ignores all buffs/weakens (Immobilis)
  if (card.id === "v4_apatia") return p;

  // 1. BASE BUFFS / WEAKENS
  p += state.buffs[side];
  p -= state.weakens[enemySide];

  // 2. FACTION PASSIVES (Master Synergy)
  // Archetipo: +1 power for each other Archetipo card already in this territory
  if (card.type === "archetipo") {
    const others = state.board[territory].filter(o => o.side === side && cardsById[o.cardId]?.type === "archetipo").length;
    p += others;
    
    // UNIQUE: Ossessione (v2_ossessione) gains +2 if enemy hand > 3
    if (card.id === "v2_ossessione") {
      const enemyHand = side === "player" ? state.hand.ai.length : state.hand.player.length;
      if (enemyHand > 3) p += 2;
    }
  }

  // Ricordo: +2 power if played in "memoria" territory
  if (card.type === "ricordo" && territory === "memoria") {
    p += 2;
  }

  // 3. TERRITORY GLOBAL RULES
  if (territory === "trauma") p -= 1;
  if (territory === "sogno" && side === "player") p += 1;

  return Math.max(0, p);
}

function applyEffect(state: MatchState, card: CardDef, side: Side, territory: TerritoryId) {
  const enemySide: Side = side === "player" ? "ai" : "player";

  switch (card.effect.kind) {
    case "draw": {
      for (let i = 0; i < card.effect.amount; i++) {
        const top = state.deck[side].shift();
        if (top) state.hand[side].push(top);
      }
      break;
    }
    case "buff_self":
      let amount = card.effect.amount;
      // UNIQUE: Cenere e Stelle (o5_cenere) doubles buff if focus is 0 after play
      if (card.id === "o5_cenere" && state.focus[side] === 0) amount *= 2;
      state.buffs[side] += amount;
      break;
    case "weaken_enemy":
      state.weakens[side] += card.effect.amount;
      break;
    case "heal":
      state.hp[side] = Math.min(20, state.hp[side] + card.effect.amount);
      break;
  }

  // FACTION-SPECIFIC ON-PLAY TRIGGERS
  // Maschera: Drains 1 Focus from the opponent
  if (card.type === "maschera") {
    state.focus[enemySide] = Math.max(0, state.focus[enemySide] - 1);
    state.log.push(`${side === "player" ? "Hai" : "L'avversario ha"} drenato 1 Focus!`);

    // UNIQUE: Il Boia (c10_boia) executes weakest enemy if total power > 15
    if (card.id === "c10_boia") {
      const enemyPower = state.board[territory].filter(o => o.side === enemySide).reduce((s, o) => s + o.power, 0);
      if (enemyPower > 15) {
        const board = state.board[territory].filter(o => o.side === enemySide).sort((a, b) => a.power - b.power);
        if (board.length > 0) {
          const target = board[0];
          state.board[territory] = state.board[territory].filter(o => o.uid !== target.uid);
          state.log.push(`Il Boia ha eseguito una memoria nemica!`);
        }
      }
    }
  }

  // Oblio: Next enemy card in this territory will have -2 Power
  if (card.type === "oblio") {
    state.log.push(`L'Oblio avvolge ${territory}.`);
    
    // UNIQUE: Il Vuoto (b1_vuoto) resets all buffs/weakens in the match for this play
    if (card.id === "b1_vuoto") {
      state.buffs = { player: 0, ai: 0 };
      state.weakens = { player: 0, ai: 0 };
      state.log.push(`Il Vuoto ha azzerato gli effetti globali.`);
    }
  }
}

// Logic for end-of-turn growth (Eternità)
function processEndTurnTriggers(state: MatchState) {
  (["memoria", "trauma", "sogno"] as TerritoryId[]).forEach(t => {
    state.board[t].forEach(o => {
      // UNIQUE: Eternità (e10_eternita) grows +1 each turn
      if (o.cardId === "e10_eternita") {
        o.power += 1;
      }
    });
  });
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
    const idx = state.hand.ai.indexOf(card.id);
    if (idx >= 0) state.hand.ai.splice(idx, 1);
    applyEffect(state, card, "ai", territory);
    const power = powerWithRules(state, card, "ai", territory);
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
    (set, get): AppStore => ({
      player: {
        level: 1,
        xp: 0,
        xpToNext: 100,
        gold: 100,
        fragments: 0,
        gems: 0,
        wins: 0,
        matches: 0,
        rank: "Sognatore Iniziale",
        rankPoints: 0,
        collection: CARDS.slice(0, 15).map((c) => c.id), // Start with a small collection
        deck: buildStarterDeck(),
        title: "Sognatore",
      },
      // Function to ensure collection is always synced with master list and remove obsolete IDs
      syncCollection: () => {
        const { player, match } = get();
        const masterIds = CARDS.map(c => c.id);
        
        // Filter out IDs that no longer exist in master list
        const validCollection = player.collection.filter(id => masterIds.includes(id));
        const validDeck = player.deck.filter(id => masterIds.includes(id));
        
        // Check if current match is still valid
        let matchInvalid = false;
        if (match) {
          const allHandIds = [...match.hand.player, ...match.hand.ai];
          const allBoardIds = Object.values(match.board).flat().map(o => o.cardId);
          if (allHandIds.some(id => !masterIds.includes(id)) || allBoardIds.some(id => !masterIds.includes(id))) {
            matchInvalid = true;
          }
        }
        
        // If collection size changed, deck has invalid IDs, or match is invalid, update state
        const needsSync = validCollection.length !== masterIds.length || validDeck.length !== player.deck.length || matchInvalid;
        
        if (needsSync) {
          set(state => ({
            player: {
              ...state.player,
              collection: masterIds, // For now, let's give them all 50
              deck: validDeck.length === 15 ? validDeck : buildStarterDeck()
            },
            match: matchInvalid ? null : state.match
          }));
        }
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
        applyEffect(m, card, "player", territory);
        const power = powerWithRules(m, card, "player", territory);
        m.board[territory].push({ uid: `p-${m.turn}-${Math.random()}`, cardId, side: "player", power });
        m.log.push(`Giochi ${card.name} su ${territory}.`);
        return { match: m };
      }),

      endTurn: () => set((s) => {
        if (!s.match) return s;
        const m = structuredClone(s.match);
        // AI turn
        aiTurn(m);
        // Process end-of-turn triggers (like growth)
        processEndTurnTriggers(m);
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

      syncWithCloud: async (userId: string) => {
        const { player } = get();
        await savePlayerToCloud(userId, player);
      },

      user: null,
      setUser: (user) => set({ user }),
      resetPlayer: () => set({
        player: {
          level: 1,
          xp: 0,
          xpToNext: 100,
          gold: 100,
          fragments: 0,
          gems: 0,
          wins: 0,
          matches: 0,
          rank: "Sognatore Iniziale",
          rankPoints: 0,
          collection: CARDS.slice(0, 15).map((c) => c.id),
          deck: buildStarterDeck(),
          title: "Sognatore",
        }
      }),
    }),
    { 
      name: "reverie-store-v2",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      } as any)),
      partialize: (state) => {
        const { user, ...rest } = state;
        return rest;
      }
    }
  )
);

export { TERRITORIES };
