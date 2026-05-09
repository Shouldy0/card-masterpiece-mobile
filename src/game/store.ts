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
  aiStyle: "aggressive" | "control" | "balanced";
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
  if (result === "win") return { xp: 110, gold: 45, fragments: 20, gems: 8, packs: 1, rankPointsDelta: 25 };
  if (result === "lose") return { xp: 25, gold: 10, fragments: 5, gems: 0, packs: 0, rankPointsDelta: -15 };
  return { xp: 45, gold: 18, fragments: 8, gems: 0, packs: 0, rankPointsDelta: 5 };
}

export function buildStarterDeck(): string[] {
  // Filter for Level 1 Commons (Starter Pool)
  const starterPool = CARDS.filter(c => c.rarity === "comune" && (c.unlockLevel ?? 1) <= 1);
  return shuffle(starterPool).slice(0, 15).map(c => c.id);
}

export function createInitialMatch(playerDeck: string[]): MatchState {
  const aiDeck = shuffle(["v5_follia", "v7_rancore", "o5_cenere", "o8_tempesta", "c5_martire", "c10_boia", "b3_oblio", "b6_abisso", "s8_arcobaleno", "s10_risveglio", "v2_ossessione", "o2_bosco_sacro", "c2_re_caduto", "b5_cenere_blu", "s4_visione"]);
  const pDeck = shuffle(playerDeck);
  return {
    turn: 1,
    maxTurns: 6,
    focus: { player: 3, ai: 4 },
    maxFocus: 6,
    hp: { player: 20, ai: 20 },
    hand: { player: pDeck.slice(0, 5), ai: aiDeck.slice(0, 5) },
    deck: { player: pDeck.slice(5), ai: aiDeck.slice(5) },
    board: { memoria: [], trauma: [], sogno: [] },
    buffs: { player: 0, ai: 0 },
    weakens: { player: 0, ai: 0 },
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
  collection: string[]; // owned card ids
  deck: string[];
  title: string;
  premiumPass: boolean;
  passClaimed: string[];
  rankRewardsClaimed: string[];
  ownedCosmetics: string[];
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
  onboardingDone: boolean;
  onboardingPackOpened: boolean;

  // actions
  setOnboardingDone: () => void;
  setOnboardingPackOpened: (v: boolean) => void;
  startMatch: () => void;
  playCard: (cardUid: string, territory: TerritoryId) => void;
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
  resetPlayer: () => void;
  claimPassReward: (id: string, gold?: number) => void;
  activatePremiumPass: () => void;
  claimRankReward: (id: string) => void;
}

function powerWithRules(state: MatchState, card: CardDef, side: Side, territory: TerritoryId, cardUid?: string): number {
  let p = card.power;
  const enemySide: Side = side === "player" ? "ai" : "player";
  
  // UNIQUE: "immobile" trait ignores all buffs/weakens
  if (card.traits?.includes("immobile")) return p;

  // 1. BASE BUFFS / WEAKENS
  let totalBuff = state.buffs[side];
  let totalWeaken = state.weakens[enemySide];

  // UNIQUE: "protector" trait nearby prevents power reduction
  const board = state.board[territory];
  const myIndex = cardUid ? board.findIndex(o => o.uid === cardUid) : -1;
  // If card is already on board, we can check neighbors.
  const neighbors = myIndex >= 0 ? board.filter((o, idx) => o.side === side && Math.abs(idx - myIndex) === 1) : [];
  const isProtected = neighbors.some(n => cardsById[n.cardId]?.traits?.includes("protector"));
  
  if (isProtected) totalWeaken = 0;

  p += totalBuff;
  p -= totalWeaken;

  // 2. FACTION PASSIVES (Master Synergy)
  // Archetipo: +1 power for each other Archetipo card already in this territory
  if (card.type === "archetipo") {
    const others = state.board[territory].filter(o => o.side === side && cardsById[o.cardId]?.type === "archetipo").length;
    p += others;
    
    // UNIQUE: "synergy_buff" logic for specific cards (formerly Ossessione)
    if (card.traits?.includes("synergy_buff")) {
      const enemyHand = side === "player" ? state.hand.ai.length : state.hand.player.length;
      if (enemyHand > 3) p += 2;
    }
  }

  // Ricordo: +2 power if played in "memoria" territory
  if (card.type === "ricordo" && territory === "memoria") {
    p += 2;
  }

  // 3. TERRITORY GLOBAL RULES
  if (territory === "trauma") {
    if (!isProtected) p -= 1;
  }
  if (territory === "sogno") p += 1;

  // 4. TRAIT: Loner (+3 if alone)
  if (card.traits?.includes("loner")) {
    const myCards = state.board[territory].filter(o => o.side === side).length;
    if (myCards <= 1) p += 3; // <= 1 because if it's on board, it counts itself
  }

  // 5. DYNAMIC SYNERGY (Global bonus for each pair of same-type cards in any territory)
  (["memoria", "trauma", "sogno"] as TerritoryId[]).forEach(t => {
    const counts: Record<string, number> = {};
    state.board[t].filter(o => o.side === side).forEach(o => {
      const type = cardsById[o.cardId]?.type;
      if (type) counts[type] = (counts[type] || 0) + 1;
    });
    Object.values(counts).forEach(count => {
      if (count >= 2) p += 1;
    });
  });

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
      // UNIQUE: "synergy_buff" logic for specific cards (formerly Cenere e Stelle)
      if (card.traits?.includes("synergy_buff") && state.focus[side] === 0) amount *= 2;
      state.buffs[side] += amount;
      break;
    case "weaken_enemy":
      state.weakens[side] += card.effect.amount;
      break;
    case "heal":
      let healAmount = card.effect.amount;
      if (card.traits?.includes("dynamic_heal")) {
        // Heal +2 for each Archetipo on board
        const count = (["memoria", "trauma", "sogno"] as TerritoryId[]).reduce((s, t) => 
          s + state.board[t].filter(o => o.side === side && cardsById[o.cardId]?.type === "archetipo").length, 0);
        healAmount = count * 2;
      }
      state.hp[side] = Math.min(20, state.hp[side] + healAmount);
      break;
  }

  // TRAIT: Oppressive (weaken enemy in this territory)
  if (card.traits?.includes("oppressive")) {
    state.log.push(`${card.name} emana un'aura opprimente!`);
    state.weakens[side] += 1;
  }

  // FACTION-SPECIFIC ON-PLAY TRIGGERS
  // Maschera: Drains 1 Focus from the opponent
  if (card.type === "maschera") {
    state.focus[enemySide] = Math.max(0, state.focus[enemySide] - 1);
    state.log.push(`${side === "player" ? "Hai" : "L'avversario ha"} drenato 1 Focus!`);

    // UNIQUE: "executioner" trait executes weakest enemy if total power > 15
    if (card.traits?.includes("executioner")) {
      const enemyPower = state.board[territory].filter(o => o.side === enemySide).reduce((s, o) => s + o.power, 0);
      if (enemyPower > 15) {
        const board = state.board[territory].filter(o => o.side === enemySide).sort((a, b) => a.power - b.power);
        if (board.length > 0) {
          const target = board[0];
          state.board[territory] = state.board[territory].filter(o => o.uid !== target.uid);
          state.log.push(`${card.name} ha eseguito una memoria nemica!`);
        }
      }
    }
  }

  // Oblio: Next enemy card in this territory will have -2 Power
  if (card.type === "oblio") {
    state.log.push(`L'Oblio avvolge ${territory}.`);
    
    // UNIQUE: "resetter" trait resets all buffs/weakens in the match for this play
    if (card.traits?.includes("resetter")) {
      state.buffs = { player: 0, ai: 0 };
      state.weakens = { player: 0, ai: 0 };
      state.log.push(`${card.name} ha azzerato gli effetti globali.`);
    }
  }
}

// Logic for end-of-turn growth (Eternità)
function processEndTurnTriggers(state: MatchState) {
  (["memoria", "trauma", "sogno"] as TerritoryId[]).forEach(t => {
    state.board[t].forEach(o => {
      const cardDef = cardsById[o.cardId];
      // UNIQUE: "growth" trait grows +1 each turn
      if (cardDef?.traits?.includes("growth")) {
        o.power += 1;
      }
    });
  });
}

function recalculateBoard(state: MatchState) {
  (["memoria", "trauma", "sogno"] as TerritoryId[]).forEach(t => {
    state.board[t].forEach(o => {
      const def = cardsById[o.cardId];
      if (def) {
        o.power = powerWithRules(state, def, o.side, t, o.uid);
      }
    });
  });
}

function aiTurn(state: MatchState) {
  // Adaptive AI profile: changes priorities to avoid predictable turns.
  const style = state.aiStyle;
  let safety = 6;
  while (safety-- > 0) {
    const affordable = state.hand.ai
      .map((id) => cardsById[id])
      .filter((c) => c && c.cost <= state.focus.ai)
      .sort((a, b) => {
        const score = (card: CardDef) => {
          const efficiency = card.power / Math.max(1, card.cost);
          if (style === "aggressive") return card.power * 1.45 + efficiency * 0.35 + card.cost * 0.25;
          if (style === "control") {
            const utility = card.effect.kind === "weaken_enemy" || card.effect.kind === "heal" || card.effect.kind === "draw" ? 4.5 : 0;
            return efficiency * 1 + utility + card.cost * 0.05;
          }
          return efficiency * 1.35 + card.power * 0.55;
        };
        return score(b) - score(a);
      });
    if (affordable.length === 0) break;
    const card = affordable[0];
    // Territory choice also depends on the selected AI style.
    const tIds: TerritoryId[] = ["memoria", "trauma", "sogno"];
    const scored = tIds.map((t) => {
      const aiP = state.board[t].filter((c) => c.side === "ai").reduce((s, c) => s + c.power, 0);
      const plP = state.board[t].filter((c) => c.side === "player").reduce((s, c) => s + c.power, 0);
      const diff = aiP - plP;
      const territoryValue = t === "sogno" ? 1 : t === "memoria" ? 0.8 : 0.6;
      if (style === "aggressive") return { t, score: diff * -0.45 + territoryValue + plP * 0.35 };
      if (style === "control") return { t, score: diff * -1.35 + territoryValue * 0.75 };
      return { t, score: diff * -0.95 + territoryValue };
    }).sort((a, b) => b.score - a.score);
    const territory = scored[0].t;
    state.focus.ai -= card.cost;
    const idx = state.hand.ai.indexOf(card.id);
    if (idx >= 0) state.hand.ai.splice(idx, 1);
    applyEffect(state, card, "ai", territory);
    const uid = `ai-${state.turn}-${Math.random()}`;
    state.board[territory].push({ uid, cardId: card.id, side: "ai", power: 0 });
    recalculateBoard(state);
    state.log.push(`Avversario (${style}) gioca ${card.name} su ${territory} (Costo ${card.cost}).`);
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
      player: (() => {
        // Initial dummy state - real randomization happens on first initialization if needed
        return {
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
        };
      })(),
      onboardingDone: false,
      onboardingPackOpened: false,
      syncCollection: () => {
        const { player, match } = get();
        const masterIds = CARDS.map(c => c.id);
        
        // Filter out IDs that no longer exist in master list
        const validCollection = player.collection.filter(id => masterIds.includes(id));
        const validDeck = player.deck.filter(id => masterIds.includes(id));
        
        // Ensure starting cards are ALWAYS in collection if somehow lost
        const starterIds = buildStarterDeck();
        const finalCollection = Array.from(new Set([...validCollection, ...starterIds]));

        // Check if current match is still valid
        let matchInvalid = false;
        if (match) {
          const allHandIds = [...match.hand.player, ...match.hand.ai];
          const allBoardIds = Object.values(match.board).flat().map(o => o.cardId);
          if (allHandIds.some(id => !masterIds.includes(id)) || allBoardIds.some(id => !masterIds.includes(id))) {
            matchInvalid = true;
          }
        }
        
        const needsSync = finalCollection.length !== player.collection.length || validDeck.length !== player.deck.length || matchInvalid;
        
        if (needsSync) {
          set(state => ({
            player: {
              ...state.player,
              collection: finalCollection,
              deck: validDeck.length === 15 ? validDeck : buildStarterDeck()
            },
            match: matchInvalid ? null : state.match
          }));
        }
      },
      settings: { soundOn: true, musicVolume: 0.5, sfxVolume: 0.8, vibration: true, hints: true, animSpeed: 1, language: "Italiano" },
      match: null,
      onboardingDone: false,
      syncStatus: "idle",
      lastSyncedAt: null,

      setOnboardingDone: () => set({ onboardingDone: true }),
      setOnboardingPackOpened: (v) => set({ onboardingPackOpened: v }),

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
        const uid = `p-${m.turn}-${Math.random()}`;
        m.board[territory].push({ uid, cardId, side: "player", power: 0 }); // Temporary power
        recalculateBoard(m);
        m.log.push(`Giochi ${card.name} su ${territory} (Costo ${card.cost}).`);
        return { match: m };
      }),

      endTurn: () => set((s) => {
        if (!s.match) return s;
        const m = structuredClone(s.match);
        // AI turn
        aiTurn(m);
        // Process end-of-turn triggers (like growth)
        processEndTurnTriggers(m);
        // Territory rule: controller of Memoria draws one card.
        const memoriaPlayer = m.board.memoria.filter((c) => c.side === "player").reduce((sum, c) => sum + c.power, 0);
        const memoriaAi = m.board.memoria.filter((c) => c.side === "ai").reduce((sum, c) => sum + c.power, 0);
        if (memoriaPlayer !== memoriaAi) {
          const controller: Side = memoriaPlayer > memoriaAi ? "player" : "ai";
          const bonusDraw = m.deck[controller].shift();
          if (bonusDraw) {
            m.hand[controller].push(bonusDraw);
            m.log.push(`${controller === "player" ? "Controlli" : "L'avversario controlla"} Memoria: pesca bonus.`);
          }
        }
        // reset turn buffs/weakens
        m.buffs = { player: 0, ai: 0 };
        m.weakens = { player: 0, ai: 0 };
        m.turn += 1;
        m.focus.player = Math.min(m.maxFocus, m.turn + 2);
        m.focus.ai = Math.min(m.maxFocus, m.turn + 3);
        // draw
        const drawP = m.deck.player.shift(); if (drawP) m.hand.player.push(drawP);
        const drawA = m.deck.ai.shift(); if (drawA) m.hand.ai.push(drawA);
        m.log.push(`Turno ${m.turn}.`);
        recalculateBoard(m);
        endMatchIfNeeded(m);
        return { match: m };
      }),

      exitMatch: () => {
        const { match, player, user, syncWithCloud } = get();
        if (!match) return;

        let updatedPlayer = { ...player };
        
        if (match.status === "ended") {
          const rewards = getMatchRewards(match.result);
          updatedPlayer.xp += rewards.xp;
          updatedPlayer.gold += rewards.gold;
          updatedPlayer.fragments += rewards.fragments;
          updatedPlayer.gems += rewards.gems;
          updatedPlayer.matches += 1;
          if (match.result === "win") updatedPlayer.wins += 1;
          updatedPlayer.rankPoints = Math.max(0, updatedPlayer.rankPoints + rewards.rankPointsDelta);
          updatedPlayer.rank = getRankFromPoints(updatedPlayer.rankPoints);
          while (updatedPlayer.xp >= updatedPlayer.xpToNext) {
            updatedPlayer.level += 1;
            updatedPlayer.xp = updatedPlayer.xp - updatedPlayer.xpToNext;
            updatedPlayer.xpToNext = Math.round(updatedPlayer.xpToNext * 1.15);
            
            // LEVEL REWARD: Grant 3 new cards suitable for the new level
            const rewardPool = CARDS.filter(c => 
              (c.unlockLevel ?? 1) <= updatedPlayer.level && 
              !updatedPlayer.collection.includes(c.id)
            );
            if (rewardPool.length > 0) {
              const rewards = shuffle(rewardPool).slice(0, 3).map(c => c.id);
              updatedPlayer.collection = Array.from(new Set([...updatedPlayer.collection, ...rewards]));
            }
          }
        }

        set({ match: null, player: updatedPlayer });
        
        // Auto-sync if user is logged in
        if (user?.uid) {
          get().syncWithCloud(user.uid);
        }
      },

      saveDeck: (deck) => {
        const { user } = get();
        set((s) => ({ player: { ...s.player, deck } }));
        if (user?.uid) {
          get().syncWithCloud(user.uid);
        }
      },

      openStarterPack: () => {
        const { user } = get();
        const starterCards = buildStarterDeck();
        set((state) => ({
          player: {
            ...state.player,
            collection: [...starterCards],
            deck: [...starterCards]
          }
        }));
        if (user?.uid) {
          get().syncWithCloud(user.uid);
        }
        return starterCards;
      },

      toggleSetting: (k, v) => set((s) => ({ settings: { ...s.settings, [k]: v } })),

      buyPack: (cost, currency) => {
        const s = get();
        const balance = currency === "gold" ? s.player.gold : s.player.gems;
        if (balance < cost) return null;
        
        // Filter cards by level
        const availableCards = CARDS.filter(c => (c.unlockLevel ?? 1) <= s.player.level);
        const pool = availableCards.length >= 10 ? availableCards : CARDS; // Fallback if pool too small
        
        const pulled = shuffle(pool).slice(0, 5).map((c) => c.id);
        const newCollection = Array.from(new Set([...s.player.collection, ...pulled]));

        set({
          player: {
            ...s.player,
            gold: currency === "gold" ? s.player.gold - cost : s.player.gold,
            gems: currency === "gems" ? s.player.gems - cost : s.player.gems,
            fragments: s.player.fragments + 5,
            collection: newCollection
          },
        });
        
        if (s.user?.uid) get().syncWithCloud(s.user.uid);
        
        return pulled;
      },
      buyCosmetic: (id, cost, currency) => {
        const s = get();
        const balance = currency === "gold" ? s.player.gold : s.player.gems;
        if (balance < cost) return false;
        if (s.player.ownedCosmetics.includes(id)) return true;

        set({
          player: {
            ...s.player,
            gold: currency === "gold" ? s.player.gold - cost : s.player.gold,
            gems: currency === "gems" ? s.player.gems - cost : s.player.gems,
            ownedCosmetics: [...s.player.ownedCosmetics, id]
          }
        });

        if (s.user?.uid) get().syncWithCloud(s.user.uid);
        return true;
      },
      addGold: (n) => set((s) => ({ player: { ...s.player, gold: s.player.gold + n } })),

      syncWithCloud: async (userId: string) => {
        if (get().syncStatus === "syncing") return;
        
        set({ syncStatus: "syncing" });
        const { player } = get();
        const success = await savePlayerToCloud(userId, player);
        
        if (success) {
          set({ syncStatus: "saved", lastSyncedAt: new Date().toISOString() });
          // Reset to idle after a few seconds
          setTimeout(() => set({ syncStatus: "idle" }), 3000);
        } else {
          set({ syncStatus: "error" });
        }
      },

      user: null,
      setUser: (user) => set({ user }),
      resetPlayer: () => {
        const starterDeck = buildStarterDeck();
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
            collection: [...starterDeck],
            deck: [...starterDeck],
            title: "Sognatore",
            premiumPass: false,
            passClaimed: [],
            rankRewardsClaimed: [],
            ownedCosmetics: ["default_board"],
          },
          onboardingDone: false,
          onboardingPackOpened: false,
          match: null
        });
      },
      claimPassReward: (id, gold) => {
        set(s => ({
          player: {
            ...s.player,
            gold: s.player.gold + (gold || 0),
            passClaimed: Array.from(new Set([...s.player.passClaimed, id]))
          }
        }));
        const { user, syncWithCloud } = get();
        if (user?.uid) syncWithCloud(user.uid);
      },
      activatePremiumPass: () => {
        set(s => ({ player: { ...s.player, premiumPass: true } }));
        const { user, syncWithCloud } = get();
        if (user?.uid) syncWithCloud(user.uid);
      },
      claimRankReward: (id) => {
        set(s => ({
          player: {
            ...s.player,
            rankRewardsClaimed: Array.from(new Set([...s.player.rankRewardsClaimed, id]))
          }
        }));
        const { user, syncWithCloud } = get();
        if (user?.uid) syncWithCloud(user.uid);
      }
    }),
    { 
      name: "reverie-store-v2",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      } as any)),
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version < 2) {
          // Migration from v1 to v2: ensure ownedCosmetics exists
          if (persistedState && persistedState.player) {
            persistedState.player.ownedCosmetics = persistedState.player.ownedCosmetics || ["default_board"];
          }
        }
        return persistedState as AppStore;
      },
      partialize: (state) => {
        const { user, syncStatus, lastSyncedAt, ...rest } = state;
        return rest;
      }
    }
  )
);

export { TERRITORIES };
