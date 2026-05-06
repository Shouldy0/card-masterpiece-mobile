import { create } from "zustand";
import { COMBO_CARDS, ComboCard, ScoredCombo, scoreCombo, pickRandom } from "./combo-cards";

// ── Constants ────────────────────────────────────────────────
const DRAW_DELAY = 400; // Snappier draw delay

export type ComboPhase = "idle" | "drawing" | "decision" | "result";

export interface GameResult {
  cards: [ComboCard, ComboCard, ComboCard];
  scored: ScoredCombo;
  rerollsUsed: number;
}

interface ComboState {
  phase: ComboPhase;
  drawnCards: [ComboCard, ComboCard, ComboCard] | null;
  currentResult: ScoredCombo | null;
  
  // Game State
  rerollsLeft: number;
  totalRerolls: number;
  isDailyMode: boolean;
  
  // History/Best
  lastResult: GameResult | null;
  highScore: number;

  // Actions
  startGame: (daily?: boolean) => void;
  drawInitial: () => void;
  reroll: () => void;
  keepCombo: () => void;
  resetAll: () => void;
}

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

export const useComboGame = create<ComboState>((set, get) => ({
  phase: "idle",
  drawnCards: null,
  currentResult: null,
  
  rerollsLeft: 3,
  totalRerolls: 3,
  isDailyMode: false,
  
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
    const { isDailyMode } = get();
    set({ phase: "drawing", drawnCards: null, currentResult: null });

    const characters = COMBO_CARDS.filter((c) => c.category === "character");
    const settings = COMBO_CARDS.filter((c) => c.category === "setting");
    const actions = COMBO_CARDS.filter((c) => c.category === "action");

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
    const { rerollsLeft, phase, isDailyMode, totalRerolls } = get();
    if (rerollsLeft <= 0 || phase !== "decision") return;

    set({ phase: "drawing", drawnCards: null, currentResult: null });

    const characters = COMBO_CARDS.filter((c) => c.category === "character");
    const settings = COMBO_CARDS.filter((c) => c.category === "setting");
    const actions = COMBO_CARDS.filter((c) => c.category === "action");

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

    const gameResult: GameResult = {
      cards: drawnCards,
      scored: currentResult,
      rerollsUsed: totalRerolls - rerollsLeft
    };

    set({
      phase: "result",
      lastResult: gameResult,
      highScore: Math.max(highScore, currentResult.score)
    });
  },

  resetAll: () => {
    set({
      phase: "idle",
      drawnCards: null,
      currentResult: null,
      rerollsLeft: 3
    });
  }
}));
