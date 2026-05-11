import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Card,
  EvaluationResult,
  GameEvent,
  GameEventType,
  Achievement,
  GameVariant,
} from "./engine/types";
import { DeckEngine } from "./engine/deck-engine";
import { CARD_POOL } from "./engine/card-pool";
import { analytics } from "@/utils/analytics";
import { REVERIE_VARIANT } from "./variants";

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "perfect_combo",
    label: "Combo Perfetta",
    description: "Ottieni 5 stelle in una combo.",
    icon: "⭐",
  },
  {
    id: "chaos_master",
    label: "Maestro del Caos",
    description: "Completa un round durante l'evento Caos.",
    icon: "🌀",
  },
  {
    id: "synergy_expert",
    label: "Esperto Sinergie",
    description: "Raggiungi il 100% di sinergia.",
    icon: "🧬",
  },
  { id: "collector", label: "Collezionista", description: "Gioca 10 partite totali.", icon: "📚" },
];

// ── Constants ────────────────────────────────────────────────
const DRAW_DELAY = 400;
const XP_PER_SCORE = 0.5;

const GAME_EVENTS: Record<GameEventType, GameEvent> = {
  none: { type: "none", label: "", description: "", color: "" },
  double_points: {
    type: "double_points",
    label: "✨ RADDOPPIO",
    description: "Tutti i punti sono raddoppiati!",
    color: "text-gold",
  },
  chaos: {
    type: "chaos",
    label: "🌀 CAOS",
    description: "Le sinergie sono invertite!",
    color: "text-mystic-glow",
  },
  rare_boost: {
    type: "rare_boost",
    label: "💎 RAREZZA+",
    description: "Probabilità carte Rare aumentata!",
    color: "text-azure",
  },
  time_pressure: {
    type: "time_pressure",
    label: "⏳ PRESSIONE",
    description: "Scegli in fretta per XP extra!",
    color: "text-rose",
  },
};

export type ComboPhase = "idle" | "drawing" | "decision" | "result";

export interface GameResult {
  cards: [Card, Card, Card];
  scored: EvaluationResult;
  rerollsUsed: number;
  xpEarned: number;
  leveledUp: boolean;
  date: string;
}

interface ComboState {
  phase: ComboPhase;
  drawnCards: [Card, Card, Card] | null;
  currentResult: EvaluationResult | null;

  // Game State
  rerollsLeft: number;
  totalRerolls: number;
  isDailyMode: boolean;

  // Progression
  level: number;
  xp: number;
  streak: number;
  totalGames: number;

  // History/Best
  lastResult: GameResult | null;
  highScore: number;
  dailyHighScore: number;
  dailyBestCombo: GameResult | null;
  lastDailyDate: string | null;

  // Collection
  achievements: Achievement[];
  unlockedPacks: number;

  // Variants
  activeVariant: GameVariant;

  // Events
  activeEvent: GameEvent | null;

  // Actions
  startGame: (daily?: boolean) => void;
  drawInitial: () => void;
  reroll: () => void;
  keepCombo: () => void;
  resetAll: () => void;
  addXp: (amount: number) => { leveledUp: boolean };
}

export const getXpToNextLevel = (level: number) => level * 200;

// Simple seeded random for Daily Challenge
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function pickSeeded<T>(arr: T[], n: number, seed: number): T[] {
  const pool = [...arr];
  const result: T[] = [];
  let currentSeed = seed;
  for (let i = 0; i < Math.min(n, pool.length); i++) {
    const r = seededRandom(currentSeed);
    const j = i + Math.floor(r * (pool.length - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];
    result.push(pool[i]);
    currentSeed += 1;
  }
  return result;
}

export const getDailyLeaderboard = (seed: number) => {
  const names = ["Sognatore", "Luna", "Ombra", "Foschia", "Zenit", "Abisso", "Aura", "Eco"];
  const entries = [];
  let currentSeed = seed;
  for (let i = 0; i < 5; i++) {
    const nameIdx = Math.floor(seededRandom(currentSeed++) * names.length);
    const score = 150 + Math.floor(seededRandom(currentSeed++) * 350);
    entries.push({ name: names[nameIdx], score });
  }
  return entries.sort((a, b) => b.score - a.score);
};

export const useComboGame = create<ComboState>()(
  persist(
    (set, get) => ({
      phase: "idle",
      drawnCards: null,
      currentResult: null,

      rerollsLeft: 3,
      totalRerolls: 3,
      isDailyMode: false,

      level: 1,
      xp: 0,
      streak: 0,
      totalGames: 0,

      lastResult: null,
      highScore: 0,
      dailyHighScore: 0,
      dailyBestCombo: null,
      lastDailyDate: null,
      activeEvent: null,

      achievements: [],
      unlockedPacks: 0,

      activeVariant: REVERIE_VARIANT,

      startGame: (daily = false) => {
        const todayStr = new Date().toISOString().split("T")[0];
        const state = get();

        if (state.lastDailyDate !== todayStr) {
          set({ dailyHighScore: 0, dailyBestCombo: null, lastDailyDate: todayStr });
        }

        set({
          phase: "idle",
          drawnCards: null,
          currentResult: null,
          rerollsLeft: 3,
          isDailyMode: daily,
        });
        analytics.track("session_start", { daily });
        get().drawInitial();
      },

      drawInitial: () => {
        const { isDailyMode, level, streak, activeVariant } = get();
        set({ phase: "drawing", drawnCards: null, currentResult: null });

        let char, sett, act;

        if (isDailyMode) {
          const availableCards = activeVariant.cards.filter((c) => {
            if (c.rarity === "legendary") return level >= 2;
            return true;
          });
          const characters = availableCards.filter((c) => c.type === "character");
          const settings = availableCards.filter((c) => c.type === "setting");
          const actions = availableCards.filter((c) => c.type === "action");
          const today = new Date();
          const dateSeed =
            today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
          char = pickSeeded(characters, 1, dateSeed)[0];
          sett = pickSeeded(settings, 1, dateSeed + 1)[0];
          act = pickSeeded(actions, 1, dateSeed + 2)[0];
        } else {
          [char, sett, act] = DeckEngine.drawCombo(activeVariant, level, streak);
        }

        // Randomly trigger event (25% chance)
        let event: GameEvent | null = null;
        if (Math.random() < 0.25) {
          const keys = Object.keys(GAME_EVENTS).filter((k) => k !== "none") as GameEventType[];
          event = GAME_EVENTS[keys[Math.floor(Math.random() * keys.length)]];
        }

        setTimeout(() => {
          let scored = DeckEngine.evaluate([char, sett, act], activeVariant);

          // Apply event modifiers to score
          if (event?.type === "double_points") scored.score *= 2;
          if (event?.type === "chaos") {
            // Swap bonus and penalties (mock logic for score impact)
            scored.score = Math.max(0, scored.score - scored.synergyLevel * 0.5);
          }

          set({
            phase: "decision",
            drawnCards: [char, sett, act],
            currentResult: scored,
            activeEvent: event,
          });
        }, DRAW_DELAY);
      },

      reroll: () => {
        const { rerollsLeft, phase, isDailyMode, totalRerolls, level, streak, activeVariant } =
          get();
        if (rerollsLeft <= 0 || phase !== "decision") return;

        set({ phase: "drawing", drawnCards: null, currentResult: null });

        let char, sett, act;
        if (isDailyMode) {
          const availableCards = activeVariant.cards.filter((c) => {
            if (c.rarity === "legendary") return level >= 2;
            return true;
          });
          const characters = availableCards.filter((c) => c.type === "character");
          const settings = availableCards.filter((c) => c.type === "setting");
          const actions = availableCards.filter((c) => c.type === "action");
          const today = new Date();
          const dateSeed =
            today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
          const rerollSeed = dateSeed + (totalRerolls - rerollsLeft + 1) * 10;
          char = pickSeeded(characters, 1, rerollSeed)[0];
          sett = pickSeeded(settings, 1, rerollSeed + 1)[0];
          act = pickSeeded(actions, 1, rerollSeed + 2)[0];
        } else {
          [char, sett, act] = DeckEngine.drawCombo(activeVariant, level, streak);
        }

        // Keep event if exists or 15% chance to trigger new one on reroll
        let event = get().activeEvent;
        if (!event && Math.random() < 0.15) {
          const keys = Object.keys(GAME_EVENTS).filter((k) => k !== "none") as GameEventType[];
          event = GAME_EVENTS[keys[Math.floor(Math.random() * keys.length)]];
        }

        setTimeout(() => {
          let scored = DeckEngine.evaluate([char, sett, act], activeVariant);

          if (event?.type === "double_points") scored.score *= 2;
          if (event?.type === "chaos")
            scored.score = Math.max(0, scored.score - scored.synergyLevel * 0.5);

          set({
            phase: "decision",
            drawnCards: [char, sett, act],
            currentResult: scored,
            rerollsLeft: rerollsLeft - 1,
            activeEvent: event,
          });
          analytics.track("reroll", { remaining: rerollsLeft - 1 });
        }, DRAW_DELAY);
      },

      keepCombo: () => {
        const {
          drawnCards,
          currentResult,
          rerollsLeft,
          totalRerolls,
          highScore,
          dailyHighScore,
          isDailyMode,
          totalGames,
          streak,
          activeEvent,
          achievements,
        } = get();
        if (!drawnCards || !currentResult) return;

        const xpToGain = Math.round(currentResult.score * XP_PER_SCORE);
        const { leveledUp } = get().addXp(xpToGain);
        const todayStr = new Date().toISOString().split("T")[0];
        const newTotalGames = totalGames + 1;
        const newStreak = currentResult.stars >= 3 ? streak + 1 : 0;

        const gameResult: GameResult = {
          cards: drawnCards,
          scored: currentResult,
          rerollsUsed: totalRerolls - rerollsLeft,
          xpEarned: xpToGain,
          leveledUp,
          date: todayStr,
        };

        // Achievement Logic
        const newAchievements = [...achievements];
        const checkUnlock = (id: string) => {
          if (!newAchievements.find((a) => a.id === id)) {
            const base = ACHIEVEMENTS.find((a) => a.id === id);
            if (base) newAchievements.push({ ...base, unlockedAt: new Date().toISOString() });
          }
        };

        if (currentResult.stars === 5) checkUnlock("perfect_combo");
        if (activeEvent?.type === "chaos") checkUnlock("chaos_master");
        if (currentResult.synergyLevel >= 100) checkUnlock("synergy_expert");
        if (newTotalGames >= 10) checkUnlock("collector");

        const newUnlockedPacks = Math.floor(newTotalGames / 5);

        const newHighScore = Math.max(highScore, currentResult.score);
        let newDailyHighScore = dailyHighScore;
        let newDailyBestCombo = get().dailyBestCombo;

        if (isDailyMode && currentResult.score > dailyHighScore) {
          newDailyHighScore = currentResult.score;
          newDailyBestCombo = gameResult;
        }

        set({
          phase: "result",
          lastResult: gameResult,
          highScore: newHighScore,
          dailyHighScore: newDailyHighScore,
          dailyBestCombo: newDailyBestCombo,
          totalGames: newTotalGames,
          streak: newStreak,
          achievements: newAchievements,
          unlockedPacks: newUnlockedPacks,
        });

        analytics.track("game_complete", {
          score: currentResult.score,
          cards: drawnCards,
          rerolls: totalRerolls - rerollsLeft,
          streak: newStreak,
        });
      },

      addXp: (amount) => {
        const state = get();
        let newXp = state.xp + amount;
        let newLevel = state.level;
        let leveledUp = false;

        while (newXp >= getXpToNextLevel(newLevel)) {
          newXp -= getXpToNextLevel(newLevel);
          newLevel++;
          leveledUp = true;
        }

        set({ xp: newXp, level: newLevel });
        return { leveledUp };
      },

      resetAll: () => {
        const { phase } = get();
        if (phase !== "idle" && phase !== "result") {
          analytics.track("drop_off", { phase });
        }
        set({
          phase: "idle",
          drawnCards: null,
          currentResult: null,
          rerollsLeft: 3,
        });
      },
    }),
    {
      name: "reverie-meta-storage",
      partialize: (state) => ({
        level: state.level,
        xp: state.xp,
        highScore: state.highScore,
        dailyHighScore: state.dailyHighScore,
        dailyBestCombo: state.dailyBestCombo,
        lastDailyDate: state.lastDailyDate,
        achievements: state.achievements,
        totalGames: state.totalGames,
        streak: state.streak,
        unlockedPacks: state.unlockedPacks,
      }),
    },
  ),
);
