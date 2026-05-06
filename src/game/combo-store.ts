import { create } from "zustand";
import { persist } from "zustand/middleware";
import { COMBO_CARDS, ComboCard, ScoredCombo, scoreCombo, pickRandom } from "./combo-cards";

// ── Constants ────────────────────────────────────────────────
const DRAW_DELAY = 400; // Snappier draw delay
const XP_PER_SCORE = 0.5; // 100 points = 50 XP

export type ComboPhase = "idle" | "drawing" | "decision" | "result";

export interface GameResult {
  cards: [ComboCard, ComboCard, ComboCard];
  scored: ScoredCombo;
  rerollsUsed: number;
  xpEarned: number;
  leveledUp: boolean;
}

interface ComboState {
  phase: ComboPhase;
  drawnCards: [ComboCard, ComboCard, ComboCard] | null;
  currentResult: ScoredCombo | null;
  
  // Game State
  rerollsLeft: number;
  totalRerolls: number;
  isDailyMode: boolean;
  
  // Progression
  level: number;
  xp: number;
  
  // History/Best
  lastResult: GameResult | null;
  highScore: number;

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
      
      lastResult: null,
      highScore: 0,

      startGame: (daily = false) => {
        set({
          phase: "idle",
          drawnCards: null,
          currentResult: null,
          rerollsLeft: 3,
          isDailyMode: daily,
        });
        get().drawInitial();
      },

      drawInitial: () => {
        const { isDailyMode, level } = get();
        set({ phase: "drawing", drawnCards: null, currentResult: null });

        // Filter cards by level (Legendary requires level 2)
        const availableCards = COMBO_CARDS.filter(c => {
          if (c.rarity === "legendary") return level >= 2;
          return true;
        });

        const characters = availableCards.filter((c) => c.category === "character");
        const settings = availableCards.filter((c) => c.category === "setting");
        const actions = availableCards.filter((c) => c.category === "action");

        let char, sett, act;

        if (isDailyMode) {
          const today = new Date();
          const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
          char = pickSeeded(characters, 1, dateSeed)[0];
          sett = pickSeeded(settings, 1, dateSeed + 1)[0];
          act = pickSeeded(actions, 1, dateSeed + 2)[0];
        } else {
          char = pickRandom(characters, 1)[0];
          sett = pickRandom(settings, 1)[0];
          act = pickRandom(actions, 1)[0];
        }

        setTimeout(() => {
          const scored = scoreCombo(char, sett, act);
          set({ 
            phase: "decision", 
            drawnCards: [char, sett, act],
            currentResult: scored 
          });
        }, DRAW_DELAY);
      },

      reroll: () => {
        const { rerollsLeft, phase, isDailyMode, totalRerolls, level } = get();
        if (rerollsLeft <= 0 || phase !== "decision") return;

        set({ phase: "drawing", drawnCards: null, currentResult: null });

        const availableCards = COMBO_CARDS.filter(c => {
          if (c.rarity === "legendary") return level >= 2;
          return true;
        });

        const characters = availableCards.filter((c) => c.category === "character");
        const settings = availableCards.filter((c) => c.category === "setting");
        const actions = availableCards.filter((c) => c.category === "action");

        let char, sett, act;
        if (isDailyMode) {
          const today = new Date();
          const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
          const rerollSeed = dateSeed + (totalRerolls - rerollsLeft + 1) * 10;
          char = pickSeeded(characters, 1, rerollSeed)[0];
          sett = pickSeeded(settings, 1, rerollSeed + 1)[0];
          act = pickSeeded(actions, 1, rerollSeed + 2)[0];
        } else {
          char = pickRandom(characters, 1)[0];
          sett = pickRandom(settings, 1)[0];
          act = pickRandom(actions, 1)[0];
        }

        setTimeout(() => {
          const scored = scoreCombo(char, sett, act);
          set({ 
            phase: "decision", 
            drawnCards: [char, sett, act],
            currentResult: scored,
            rerollsLeft: rerollsLeft - 1
          });
        }, DRAW_DELAY);
      },

      keepCombo: () => {
        const { drawnCards, currentResult, rerollsLeft, totalRerolls, highScore } = get();
        if (!drawnCards || !currentResult) return;

        const xpToGain = Math.round(currentResult.score * XP_PER_SCORE);
        const { leveledUp } = get().addXp(xpToGain);

        const gameResult: GameResult = {
          cards: drawnCards,
          scored: currentResult,
          rerollsUsed: totalRerolls - rerollsLeft,
          xpEarned: xpToGain,
          leveledUp
        };

        set({
          phase: "result",
          lastResult: gameResult,
          highScore: Math.max(highScore, currentResult.score)
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
        set({
          phase: "idle",
          drawnCards: null,
          currentResult: null,
          rerollsLeft: 3
        });
      }
    }),
    {
      name: "reverie-progression-storage",
      partialize: (state) => ({ 
        level: state.level, 
        xp: state.xp,
        highScore: state.highScore
      }),
    }
  )
);
