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
  lucidity: { player: number; ai: number };
  maxLucidity: number;
  trauma: { player: number; ai: number };
  psychosisCount: { player: number; ai: number };
  hp: { player: number; ai: number };
  repressed: Record<Side, { cardId: string; turns: number }[]>;
  hand: { player: string[]; ai: string[] };
  deck: { player: string[]; ai: string[] };
  board: Record<TerritoryId, PlayedCard[]>;
  buffs: Record<Side, number>; // self buffs (global)
  weakens: Record<Side, number>; // applied to enemy (global)
  localBuffs: Record<TerritoryId, Record<Side, number>>;
  localWeakens: Record<TerritoryId, Record<Side, number>>;
  log: string[];
  status: "playing" | "ended";
  result?: "win" | "lose" | "draw";
  territoryResults?: Record<TerritoryId, { p: number; a: number }>;
  aiStyle: "aggressive" | "control" | "balanced";
  isTutorial?: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickAiStyle(): MatchState["aiStyle"] {
  const styles: MatchState["aiStyle"][] = ["aggressive", "control", "balanced"];
  return styles[Math.floor(Math.random() * styles.length)];
}

export function getRankFromPoints(rankPoints: number): string {
  if (rankPoints >= 2400) return "Oracolo della Reverie";
  if (rankPoints >= 1600) return "Custode Lucido";
  if (rankPoints >= 900) return "Sognatore Esperto";
  if (rankPoints >= 300) return "Sognatore Adepto";
  return "Sognatore Iniziale";
}

export function getNextRankMilestone(rankPoints: number): number {
  if (rankPoints < 300) return 300;
  if (rankPoints < 900) return 900;
  if (rankPoints < 1600) return 1600;
  if (rankPoints < 2400) return 2400;
  return 3000;
}

export function getMatchRewards(result: MatchState["result"]): MatchRewards {
  if (result === "win")
    return { xp: 110, gold: 45, fragments: 20, gems: 8, packs: 1, rankPointsDelta: 25 };
  if (result === "lose")
    return { xp: 25, gold: 10, fragments: 5, gems: 0, packs: 0, rankPointsDelta: -15 };
  return { xp: 45, gold: 18, fragments: 8, gems: 0, packs: 0, rankPointsDelta: 5 };
}

export function buildStarterDeck(): string[] {
  const starterPool = CARDS.filter((c) => c.rarity === "comune" && (c.unlockLevel ?? 1) <= 1);
  return shuffle(starterPool)
    .slice(0, 15)
    .map((c) => c.id);
}

export function createInitialMatch(playerDeck: string[]): MatchState {
  const aiDeck = shuffle([
    "v5_follia",
    "v7_rancore",
    "o5_cenere",
    "o8_tempesta",
    "c5_martire",
    "c10_boia",
    "b3_oblio",
    "b6_abisso",
    "s8_arcobaleno",
    "s10_risveglio",
    "v2_ossessione",
    "o2_bosco_sacro",
    "c2_re_caduto",
    "b5_cenere_blu",
    "s4_visione",
  ]);
  const pDeck = shuffle(playerDeck);
  return {
    turn: 1,
    maxTurns: 6,
    lucidity: { player: 6, ai: 6 },
    maxLucidity: 6,
    trauma: { player: 0, ai: 0 },
    psychosisCount: { player: 0, ai: 0 },
    hp: { player: 20, ai: 20 },
    repressed: { player: [], ai: [] },
    hand: { player: pDeck.slice(0, 5), ai: aiDeck.slice(0, 5) },
    deck: { player: pDeck.slice(5), ai: aiDeck.slice(5) },
    board: { memoria: [], trauma: [], sogno: [] },
    buffs: { player: 0, ai: 0 },
    weakens: { player: 0, ai: 0 },
    localBuffs: { memoria: { player: 0, ai: 0 }, trauma: { player: 0, ai: 0 }, sogno: { player: 0, ai: 0 } },
    localWeakens: { memoria: { player: 0, ai: 0 }, trauma: { player: 0, ai: 0 }, sogno: { player: 0, ai: 0 } },
    log: ["La Reverie ha inizio…"],
    status: "playing",
    aiStyle: pickAiStyle(),
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
  collection: string[];
  deck: string[];
  title: string;
  premiumPass: boolean;
  passClaimed: string[];
  rankRewardsClaimed: string[];
  ownedCosmetics: string[];
  onboardingDone: boolean;
}

export interface MatchRewards {
  xp: number;
  gold: number;
  fragments: number;
  gems: number;
  packs: number;
  rankPointsDelta: number;
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
  onboardingPackOpened: boolean;
  tutorialStep: number;

  // actions
  setOnboardingDone: () => void;
  setOnboardingPackOpened: (v: boolean) => void;
  setTutorialStep: (n: number) => void;
  startMatch: () => void;
  startTutorialMatch: () => void;
  playCard: (cardUid: string, territory: TerritoryId) => void;
  repressCard: (cardUid: string) => void;
  endTurn: () => void;
  exitMatch: () => void;
  saveDeck: (deck: string[]) => void;
  openStarterPack: () => string[];
  toggleSetting: (k: keyof SettingsState, v: any) => void;
  syncCollection: () => void;
  buyPack: (cost: number, currency: "gold" | "gems") => string[] | null;
  buyCosmetic: (id: string, cost: number, currency: "gold" | "gems") => boolean;
  addGold: (n: number) => void;
  syncWithCloud: (userId: string) => Promise<void>;
  syncStatus: "idle" | "syncing" | "error" | "saved";
  lastSyncedAt: string | null;
  user: any | null;
  setUser: (user: any | null) => void;
  setPlayer: (player: PlayerProgress) => void;
  resetPlayer: () => void;
  claimPassReward: (id: string, gold?: number) => void;
  activatePremiumPass: () => void;
  claimRankReward: (id: string) => void;
}

export function isLaneCorrupted(cardsInLane: PlayedCard[]): boolean {
  let corruption = 0;
  cardsInLane.forEach((c) => {
    const def = cardsById[c.cardId];
    if (def && (def.type === "oblio" || def.type === "maschera")) {
      corruption += def.power;
    }
  });
  return corruption >= 6;
}

function powerWithRules(
  state: MatchState,
  card: CardDef,
  side: Side,
  territory: TerritoryId,
  cardUid?: string,
): number {
  let p = card.power;
  const enemySide: Side = side === "player" ? "ai" : "player";
  if (card.traits?.includes("immobile")) return p;

  const board = state.board[territory];
  const myIndex = cardUid ? board.findIndex((o) => o.uid === cardUid) : -1;
  const neighbors =
    myIndex >= 0 ? board.filter((o, idx) => o.side === side && Math.abs(idx - myIndex) === 1) : [];
  const isProtected = neighbors.some((n) => cardsById[n.cardId]?.traits?.includes("protector"));

  // --- GLOBAL buffs/weakens (turn-based, reset each turn) ---
  let globalBuff = state.buffs[side];
  let globalWeaken = isProtected ? 0 : state.weakens[enemySide];

  // --- LOCAL AURAS from ally cards in this territory (buff_self, local target) ---
  let localBuff = 0;
  board.forEach((o) => {
    if (o.side === side && o.uid !== cardUid) {
      const def = cardsById[o.cardId];
      if (!def) return;
      if (def.effect.kind === "buff_self" && (def.effect as any).target === "local") {
        let amt = def.effect.amount;
        if (def.traits?.includes("synergy_buff")) {
          const myTypeCount = board.filter((b) => b.side === side && cardsById[b.cardId]?.type === def.type).length;
          if (myTypeCount >= 2) amt += 1;
        }
        localBuff += amt;
      }
    }
  });

  // --- LOCAL AURAS from enemy cards in this territory (weaken_enemy + oppressive) ---
  let localWeaken = 0;
  if (!isProtected) {
    board.forEach((o) => {
      if (o.side === enemySide) {
        const def = cardsById[o.cardId];
        if (!def) return;
        if (def.effect.kind === "weaken_enemy" && (def.effect as any).target === "local") {
          localWeaken += def.effect.amount;
        }
        if (def.traits?.includes("oppressive")) {
          localWeaken += 1;
        }
      }
    });
  }

  p += globalBuff + localBuff;
  p -= globalWeaken + localWeaken;

  // --- Territory rules ---
  if (card.type === "archetipo") {
    const others = board.filter(
      (o) => o.side === side && cardsById[o.cardId]?.type === "archetipo" && o.uid !== cardUid,
    ).length;
    p += others;
    if (card.traits?.includes("synergy_buff")) {
      const enemyHand = side === "player" ? state.hand.ai.length : state.hand.player.length;
      if (enemyHand > 3) p += 2;
    }
  }
  if (card.type === "ricordo" && territory === "memoria") p += 2;
  if (territory === "trauma" && !isProtected) p -= 1;
  if (territory === "sogno") p += 1;
  if (card.traits?.includes("loner")) {
    const myCards = board.filter((o) => o.side === side).length;
    if (myCards <= 1) p += 3;
  }

  // --- Cross-territory synergy bonus ---
  (["memoria", "trauma", "sogno"] as TerritoryId[]).forEach((t) => {
    const counts: Record<string, number> = {};
    state.board[t]
      .filter((o) => o.side === side)
      .forEach((o) => {
        const type = cardsById[o.cardId]?.type;
        if (type) counts[type] = (counts[type] || 0) + 1;
      });
    Object.values(counts).forEach((count) => {
      if (count >= 2) p += 1;
    });
  });

  // --- Corruption Mechanics ---
  if (isLaneCorrupted(board)) {
    if (card.type === "ricordo") {
      p = Math.floor(p / 2);
    } else if (card.type === "oblio" || card.type === "maschera") {
      p *= 2;
    }
  }

  return Math.max(0, p);
}

function applyEffect(state: MatchState, card: CardDef, side: Side, territory: TerritoryId) {
  const enemySide: Side = side === "player" ? "ai" : "player";
  switch (card.effect.kind) {
    case "draw":
      for (let i = 0; i < card.effect.amount; i++) {
        const top = state.deck[side].shift();
        if (top) state.hand[side].push(top);
      }
      break;
    case "buff_self":
      let amount = card.effect.amount;
      if (card.traits?.includes("synergy_buff") && state.lucidity[side] === 0) amount *= 2;
      if ((card.effect as any).target === "local") {
        // Local buff_self: aura effect computed dynamically in powerWithRules — just log it
        state.log.push(`${card.name} emana un'aura potenziante in ${territory}!`);
      } else {
        state.buffs[side] += amount;
        state.log.push(`${card.name} potenzia tutte le tue carte per questo turno (+${amount})!`);
      }
      break;
    case "weaken_enemy":
      if ((card.effect as any).target === "local") {
        // Local weaken: aura effect computed dynamically in powerWithRules — just log it
        state.log.push(`${card.name} indebolisce i nemici in ${territory}!`);
      } else {
        state.weakens[side] += card.effect.amount;
        state.log.push(`${card.name} indebolisce il nemico globalmente (-${card.effect.amount})!`);
      }
      break;
    case "heal":
      let healAmount = card.effect.amount;
      if (card.traits?.includes("dynamic_heal")) {
        const count = (["memoria", "trauma", "sogno"] as TerritoryId[]).reduce(
          (s, t) =>
            s +
            state.board[t].filter(
              (o) => o.side === side && cardsById[o.cardId]?.type === "archetipo",
            ).length,
          0,
        );
        healAmount = count * 2;
      }
      state.hp[side] = Math.min(20, state.hp[side] + healAmount);
      break;
    case "add_intrusive":
      for (let i = 0; i < card.effect.amount; i++) {
        state.hand[enemySide].push("x_pensiero_intrusivo");
      }
      state.log.push(`${side === "player" ? "Hai" : "L'avversario ha"} inflitto un Pensiero Intrusivo!`);
      break;
  }
  if (card.traits?.includes("oppressive")) {
    // Oppressive: persistent aura computed in powerWithRules — just log it
    state.log.push(`${card.name} emana un'aura opprimente in ${territory}!`);
  }
  if (card.type === "maschera") {
    state.lucidity[enemySide] = Math.max(0, state.lucidity[enemySide] - 1);
    state.log.push(`${side === "player" ? "Hai" : "L'avversario ha"} drenato 1 Lucidità!`);
    if (card.traits?.includes("executioner")) {
      const enemyPower = state.board[territory]
        .filter((o) => o.side === enemySide)
        .reduce((s, o) => s + o.power, 0);
      if (enemyPower > 15) {
        const board = state.board[territory]
          .filter((o) => o.side === enemySide)
          .sort((a, b) => a.power - b.power);
        if (board.length > 0) {
          const target = board[0];
          state.board[territory] = state.board[territory].filter((o) => o.uid !== target.uid);
          state.log.push(`${card.name} ha eseguito una memoria nemica!`);
        }
      }
    }
  }
  if (card.type === "oblio") {
    state.log.push(`L'Oblio avvolge ${territory}.`);
    if (card.traits?.includes("resetter")) {
      state.buffs = { player: 0, ai: 0 };
      state.weakens = { player: 0, ai: 0 };
      state.localBuffs = { memoria: { player: 0, ai: 0 }, trauma: { player: 0, ai: 0 }, sogno: { player: 0, ai: 0 } };
      state.localWeakens = { memoria: { player: 0, ai: 0 }, trauma: { player: 0, ai: 0 }, sogno: { player: 0, ai: 0 } };
      state.log.push(`${card.name} ha azzerato gli effetti attivi.`);
    }
  }
}

function processEndTurnTriggers(state: MatchState) {
  (["memoria", "trauma", "sogno"] as TerritoryId[]).forEach((t) => {
    state.board[t].forEach((o) => {
      const cardDef = cardsById[o.cardId];
      if (cardDef?.traits?.includes("growth")) o.power += 1;
    });
  });

  // Repression trauma generation
  (["player", "ai"] as Side[]).forEach((side) => {
    state.repressed[side].forEach((rep) => {
      rep.turns += 1;
      state.trauma[side] = Math.min(100, state.trauma[side] + 5);
      state.log.push(`${side === "player" ? "Un ricordo represso pulsa" : "Un'ombra si agita"} (Trauma +5).`);
    });
  });
}

function checkPsychosis(state: MatchState) {
  (["player", "ai"] as Side[]).forEach((side) => {
    if (state.trauma[side] >= 100) {
      state.log.push(`⚠️ ${side === "player" ? "Hai" : "L'avversario ha"} subito un CROLLO PSICOTICO!`);
      state.psychosisCount[side] += 1;
      
      const currentHandSize = state.hand[side].length;
      state.deck[side].push(...state.hand[side]);
      state.deck[side] = shuffle(state.deck[side]);
      state.hand[side] = [];
      const newHandSize = Math.max(1, currentHandSize - 1);
      for (let i = 0; i < newHandSize; i++) {
        const c = state.deck[side].shift();
        if (c) state.hand[side].push(c);
      }

      const myCards: { territory: TerritoryId; uid: string }[] = [];
      (["memoria", "trauma", "sogno"] as TerritoryId[]).forEach((t) => {
        state.board[t].forEach((c) => {
          if (c.side === side) myCards.push({ territory: t, uid: c.uid });
        });
      });
      if (myCards.length > 0) {
        const target = myCards[Math.floor(Math.random() * myCards.length)];
        state.board[target.territory] = state.board[target.territory].filter((c) => c.uid !== target.uid);
        state.log.push(`La psicosi ha frammentato una carta in ${target.territory}.`);
      }

      state.trauma[side] = 0;
      state.hp[side] = Math.max(1, state.hp[side] - 5); 
    }
  });
}

function recalculateBoard(state: MatchState) {
  (["memoria", "trauma", "sogno"] as TerritoryId[]).forEach((t) => {
    state.board[t].forEach((o) => {
      const def = cardsById[o.cardId];
      if (def) o.power = powerWithRules(state, def, o.side, t, o.uid);
    });
  });
}

function aiTurn(state: MatchState) {
  const style = state.aiStyle;
  let safety = 6;
  while (safety-- > 0) {
    const affordable = state.hand.ai
      .map((id) => cardsById[id])
      .filter((c) => c && c.cost <= state.lucidity.ai)
      .sort((a, b) => {
        const score = (card: CardDef) => {
          const efficiency = card.power / Math.max(1, card.cost);
          if (style === "aggressive")
            return card.power * 1.45 + efficiency * 0.35 + card.cost * 0.25;
          if (style === "control") {
            const utility =
              card.effect.kind === "weaken_enemy" ||
              card.effect.kind === "heal" ||
              card.effect.kind === "draw"
                ? 4.5
                : 0;
            return efficiency * 1 + utility + card.cost * 0.05;
          }
          return efficiency * 1.35 + card.power * 0.55;
        };
        return score(b) - score(a);
      });
    if (affordable.length === 0) break;
    const card = affordable[0];
    const tIds: TerritoryId[] = ["memoria", "trauma", "sogno"];
    const scored = tIds
      .map((t) => {
        const aiP = state.board[t].filter((c) => c.side === "ai").reduce((s, c) => s + c.power, 0);
        const plP = state.board[t]
          .filter((c) => c.side === "player")
          .reduce((s, c) => s + c.power, 0);
        const diff = aiP - plP;
        const territoryValue = t === "sogno" ? 1 : t === "memoria" ? 0.8 : 0.6;
        if (style === "aggressive") return { t, score: diff * -0.45 + territoryValue + plP * 0.35 };
        if (style === "control") return { t, score: diff * -1.35 + territoryValue * 0.75 };
        return { t, score: diff * -0.95 + territoryValue };
      })
      .sort((a, b) => b.score - a.score);
    const territory = scored[0].t;
    state.lucidity.ai -= card.cost;
    const idx = state.hand.ai.indexOf(card.id);
    if (idx >= 0) state.hand.ai.splice(idx, 1);
    applyEffect(state, card, "ai", territory);
    const uid = `ai-${state.turn}-${Math.random()}`;
    state.board[territory].push({ uid, cardId: card.id, side: "ai", power: 0 });
    recalculateBoard(state);
    state.log.push(
      `Avversario (${style}) gioca ${card.name} su ${territory} (Costo ${card.cost}).`,
    );
  }
}

function endMatchIfNeeded(state: MatchState) {
  if (state.turn > state.maxTurns) {
    const results: any = {};
    let pWins = 0,
      aWins = 0;
    (["memoria", "trauma", "sogno"] as TerritoryId[]).forEach((t) => {
      const p = state.board[t].filter((c) => c.side === "player").reduce((s, c) => s + c.power, 0);
      const a = state.board[t].filter((c) => c.side === "ai").reduce((s, c) => s + c.power, 0);
      results[t] = { p, a };
      if (p > a) pWins++;
      else if (a > p) aWins++;
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
        gold: 0,
        fragments: 0,
        gems: 0,
        wins: 0,
        matches: 0,
        rank: "Sognatore Iniziale",
        rankPoints: 0,
        collection: [],
        deck: [],
        title: "Sognatore",
        premiumPass: false,
        passClaimed: [],
        rankRewardsClaimed: [],
        ownedCosmetics: ["default_board"],
        onboardingDone: false,
      },
      onboardingPackOpened: false,
      tutorialStep: 0,
      syncStatus: "idle",
      lastSyncedAt: null,
      user: null,
      match: null,
      settings: {
        soundOn: true,
        musicVolume: 0.5,
        sfxVolume: 0.8,
        vibration: true,
        hints: true,
        animSpeed: 1,
        language: "Italiano",
      },

      setOnboardingDone: () => set((s) => ({ player: { ...s.player, onboardingDone: true } })),
      setOnboardingPackOpened: (v) => set({ onboardingPackOpened: v }),
      setTutorialStep: (n) => set({ tutorialStep: n }),

      startMatch: () => set({ match: createInitialMatch(get().player.deck), tutorialStep: 0 }),
      startTutorialMatch: () => {
        const tutorialMatch = createInitialMatch(buildStarterDeck());
        tutorialMatch.isTutorial = true;
        tutorialMatch.hand.player = [
          "v2_ossessione",
          "o2_bosco_sacro",
          "c2_re_caduto",
          "s4_visione",
          "b3_oblio",
        ];
        tutorialMatch.hand.ai = ["v5_follia", "o5_cenere"];
        set({ match: tutorialMatch, tutorialStep: 1 });
      },

      playCard: (cardUid, territory) =>
        set((s) => {
          if (!s.match || s.match.status !== "playing") return s;
          const m = structuredClone(s.match);
          const cardId = cardUid;
          const card = cardsById[cardId];
          if (!card || card.cost > m.lucidity.player) return s;
          const idx = m.hand.player.indexOf(cardId);
          if (idx === -1) return s;
          m.hand.player.splice(idx, 1);
          m.lucidity.player -= card.cost;

          if (cardId === "x_pensiero_intrusivo") {
            m.log.push(`Hai scartato un Pensiero Intrusivo (Costo ${card.cost} Lucidità).`);
            return { match: m };
          }

          applyEffect(m, card, "player", territory);
          const uid = `p-${m.turn}-${Math.random()}`;
          m.board[territory].push({ uid, cardId, side: "player", power: 0 });
          recalculateBoard(m);
          m.log.push(`Giochi ${card.name} su ${territory} (Costo ${card.cost}).`);
          return { match: m };
        }),

      repressCard: (cardUid) =>
        set((s) => {
          if (!s.match || s.match.status !== "playing") return s;
          const m = structuredClone(s.match);
          const idx = m.hand.player.indexOf(cardUid);
          if (idx === -1) return s;
          if (cardUid === "x_pensiero_intrusivo") {
            m.log.push("I Pensieri Intrusivi non possono essere repressi!");
            return { match: m };
          }
          m.hand.player.splice(idx, 1);
          m.lucidity.player = Math.min(m.maxLucidity, m.lucidity.player + 2);
          m.repressed.player.push({ cardId: cardUid, turns: 0 });
          m.log.push(`Hai represso un ricordo per recuperare Lucidità.`);
          return { match: m };
        }),

      endTurn: () =>
        set((s) => {
          if (!s.match) return s;
          const m = structuredClone(s.match);
          aiTurn(m);
          processEndTurnTriggers(m);
          checkPsychosis(m);
          const pMem = m.board.memoria
            .filter((c) => c.side === "player")
            .reduce((s, c) => s + c.power, 0);
          const aMem = m.board.memoria
            .filter((c) => c.side === "ai")
            .reduce((s, c) => s + c.power, 0);
          if (pMem !== aMem) {
            const controller: Side = pMem > aMem ? "player" : "ai";
            const bonus = m.deck[controller].shift();
            if (bonus) m.hand[controller].push(bonus);
          }
          m.buffs = { player: 0, ai: 0 };
          m.weakens = { player: 0, ai: 0 };
          m.localBuffs = { memoria: { player: 0, ai: 0 }, trauma: { player: 0, ai: 0 }, sogno: { player: 0, ai: 0 } };
          m.localWeakens = { memoria: { player: 0, ai: 0 }, trauma: { player: 0, ai: 0 }, sogno: { player: 0, ai: 0 } };
          m.turn += 1;
          m.lucidity.player = Math.min(m.maxLucidity, m.turn + 2);
          m.lucidity.ai = Math.min(m.maxLucidity, m.turn + 3);
          const dP = m.deck.player.shift();
          if (dP) m.hand.player.push(dP);
          const dA = m.deck.ai.shift();
          if (dA) m.hand.ai.push(dA);
          recalculateBoard(m);
          endMatchIfNeeded(m);
          return { match: m };
        }),

      exitMatch: () => {
        const { match, player, user } = get();
        if (!match) return;
        let updatedPlayer = { ...player };
        if (match.status === "ended") {
          const rewards = getMatchRewards(match.result);
          updatedPlayer.xp += rewards.xp;
          updatedPlayer.gold += rewards.gold;
          updatedPlayer.matches += 1;
          if (match.result === "win") updatedPlayer.wins += 1;
          updatedPlayer.rankPoints = Math.max(
            0,
            updatedPlayer.rankPoints + rewards.rankPointsDelta,
          );
          updatedPlayer.rank = getRankFromPoints(updatedPlayer.rankPoints);
          while (updatedPlayer.xp >= updatedPlayer.xpToNext) {
            updatedPlayer.level += 1;
            updatedPlayer.xp -= updatedPlayer.xpToNext;
            updatedPlayer.xpToNext = Math.round(updatedPlayer.xpToNext * 1.15);
          }
        }
        set({ match: null, player: updatedPlayer });
        if (user?.uid) get().syncWithCloud(user.uid);
      },

      saveDeck: (deck) => {
        set((s) => ({ player: { ...s.player, deck } }));
        if (get().user?.uid) get().syncWithCloud(get().user.uid);
      },

      openStarterPack: () => {
        const starter = buildStarterDeck();
        set((s) => ({ player: { ...s.player, collection: starter, deck: starter } }));
        if (get().user?.uid) get().syncWithCloud(get().user.uid);
        return starter;
      },

      toggleSetting: (k, v) => set((s) => ({ settings: { ...s.settings, [k]: v } })),

      syncCollection: () => {
        const { player } = get();
        const starter = buildStarterDeck();
        const final = Array.from(new Set([...player.collection, ...starter]));
        if (final.length !== player.collection.length) {
          set((s) => ({
            player: {
              ...s.player,
              collection: final,
              deck: s.player.deck.length === 15 ? s.player.deck : starter,
            },
          }));
        }
      },

      buyPack: (cost, currency) => {
        const s = get();
        const balance = currency === "gold" ? s.player.gold : s.player.gems;
        if (balance < cost) return null;
        const pulled = shuffle(CARDS)
          .slice(0, 5)
          .map((c) => c.id);
        set({
          player: {
            ...s.player,
            [currency]: balance - cost,
            collection: Array.from(new Set([...s.player.collection, ...pulled])),
          },
        });
        if (s.user?.uid) s.syncWithCloud(s.user.uid);
        return pulled;
      },

      buyCosmetic: (id, cost, currency) => {
        const s = get();
        const balance = currency === "gold" ? s.player.gold : s.player.gems;
        if (balance < cost || s.player.ownedCosmetics.includes(id)) return false;
        set({
          player: {
            ...s.player,
            [currency]: balance - cost,
            ownedCosmetics: [...s.player.ownedCosmetics, id],
          },
        });
        if (s.user?.uid) s.syncWithCloud(s.user.uid);
        return true;
      },

      addGold: (n) => set((s) => ({ player: { ...s.player, gold: s.player.gold + n } })),

      syncWithCloud: async (userId: string) => {
        set({ syncStatus: "syncing" });
        const success = await savePlayerToCloud(userId, get().player);
        set({ syncStatus: success ? "saved" : "error", lastSyncedAt: new Date().toISOString() });
        setTimeout(() => set({ syncStatus: "idle" }), 3000);
      },

      setUser: (user) => set({ user }),
      setPlayer: (player) => set({ player }),
      resetPlayer: () => {
        const starter = buildStarterDeck();
        set({
          player: {
            level: 1,
            xp: 0,
            xpToNext: 100,
            gold: 0,
            fragments: 0,
            gems: 0,
            wins: 0,
            matches: 0,
            rank: "Sognatore Iniziale",
            rankPoints: 0,
            collection: [...starter],
            deck: [...starter],
            title: "Sognatore",
            premiumPass: false,
            passClaimed: [],
            rankRewardsClaimed: [],
            ownedCosmetics: ["default_board"],
            onboardingDone: false,
          },
          onboardingPackOpened: false,
          match: null,
          tutorialStep: 0,
        });
      },
      claimPassReward: (id, gold) => {
        set((s) => ({
          player: {
            ...s.player,
            gold: s.player.gold + (gold || 0),
            passClaimed: Array.from(new Set([...s.player.passClaimed, id])),
          },
        }));
        if (get().user?.uid) get().syncWithCloud(get().user.uid);
      },
      activatePremiumPass: () => {
        set((s) => ({ player: { ...s.player, premiumPass: true } }));
        if (get().user?.uid) get().syncWithCloud(get().user.uid);
      },
      claimRankReward: (id) => {
        set((s) => ({
          player: {
            ...s.player,
            rankRewardsClaimed: Array.from(new Set([...s.player.rankRewardsClaimed, id])),
          },
        }));
        if (get().user?.uid) get().syncWithCloud(get().user.uid);
      },
    }),
    {
      name: "reverie-store-v5",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : ({ getItem: () => null, setItem: () => {}, removeItem: () => {} } as any),
      ),
      version: 5,
      partialize: (state) => {
        const { user, syncStatus, lastSyncedAt, ...rest } = state;
        return rest;
      },
    },
  ),
);

export { TERRITORIES };
