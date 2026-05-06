import { create } from "zustand";
import { persist } from "zustand/middleware";
import { COMBO_CARDS, ComboCard, ScoredCombo, scoreCombo, pickRandom, RARITY_POINTS } from "./combo-cards";

// ── Constants ────────────────────────────────────────────────
const ROUND_DURATION = 30; // seconds per round
const DRAW_DELAY = 500;    // ms for draw animation

export type ComboPhase = "idle" | "playing" | "drawing" | "drawn" | "scored" | "gameover";

export interface RoundResult {
  cards: [ComboCard, ComboCard, ComboCard];
  scored: ScoredCombo;
  timeBonus: number;
  roundTotal: number;
  judgment?: "correct" | "wrong";
}

interface ComboState {
  phase: ComboPhase;
  drawnCards: [ComboCard, ComboCard, ComboCard] | null;
  currentResult: ScoredCombo | null;
  isDailyMode: boolean;
  isHardMode: boolean;

  // Timer
  timeLeft: number;
  timerInterval: ReturnType<typeof setInterval> | null;

  // Arcade scoring
  totalScore: number;
  highScore: number;
  dailyHighScore: number;
  lastDailyDate: string | null;
  isNewHighScore: boolean;
  isNewDailyRecord: boolean;
  comboCount: number;
  streak: number;
  bestCombo: RoundResult | null;
  roundHistory: RoundResult[];

  // Actions
  startGame: (options?: { daily?: boolean; hard?: boolean }) => void;
  drawCards: () => void;
  validateCombo: () => void;
  judgeCombo: (choice: "accept" | "reject") => void;
  nextRound: () => void;
  endGame: () => void;
  tick: () => void;
  resetAll: () => void;
}

export type Rank = "S" | "A" | "B" | "C" | "D" | "F";

export function getRank(score: number): { rank: Rank; color: string } {
  if (score >= 1200) return { rank: "S", color: "text-gold shadow-[0_0_15px_rgba(255,215,0,0.5)]" };
  if (score >= 800)  return { rank: "A", color: "text-mystic-glow" };
  if (score >= 500)  return { rank: "B", color: "text-azure" };
  if (score >= 250)  return { rank: "C", color: "text-amber-eclipse" };
  if (score >= 100)  return { rank: "D", color: "text-muted-foreground" };
  return { rank: "F", color: "text-rose/60" };
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

export const useComboGame = create<ComboState>()(
  persist(
    (set, get) => ({
      phase: "idle",
      drawnCards: null,
      currentResult: null,
      isDailyMode: false,
      isHardMode: false,

      timeLeft: ROUND_DURATION,
      timerInterval: null,

      totalScore: 0,
      highScore: 0,
      dailyHighScore: 0,
      lastDailyDate: null,
      isNewHighScore: false,
      isNewDailyRecord: false,
      comboCount: 0,
      streak: 0,
      bestCombo: null,
      roundHistory: [],

      startGame: ({ daily = false, hard = false } = {}) => {
        const todayStr = new Date().toISOString().split("T")[0];
        const state = get();
        
        if (state.lastDailyDate !== todayStr) {
          set({ dailyHighScore: 0, lastDailyDate: todayStr });
        }

        const prev = get().timerInterval;
        if (prev) clearInterval(prev);

        const interval = setInterval(() => get().tick(), 1000);

        set({
          phase: "playing",
          drawnCards: null,
          currentResult: null,
          isDailyMode: daily,
          isHardMode: hard,
          timeLeft: ROUND_DURATION,
          timerInterval: interval,
          totalScore: 0,
          isNewHighScore: false,
          isNewDailyRecord: false,
          comboCount: 0,
          streak: 0,
          bestCombo: null,
          roundHistory: [],
        });

        if (hard) {
          get().drawCards();
        }
      },

      drawCards: () => {
        const { phase, isDailyMode, comboCount } = get();
        if (phase !== "playing" && phase !== "scored") return;

        const characters = COMBO_CARDS.filter((c) => c.category === "character");
        const settings = COMBO_CARDS.filter((c) => c.category === "setting");
        const actions = COMBO_CARDS.filter((c) => c.category === "action");

        let char, sett, act;

        if (isDailyMode) {
          const today = new Date();
          const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
          const roundSeed = dateSeed + comboCount;
          char = pickSeeded(characters, 1, roundSeed)[0];
          sett = pickSeeded(settings, 1, roundSeed + 1)[0];
          act = pickSeeded(actions, 1, roundSeed + 2)[0];
        } else {
          char = pickRandom(characters, 1)[0];
          sett = pickRandom(settings, 1)[0];
          act = pickRandom(actions, 1)[0];
        }

        set({ phase: "drawing", drawnCards: null, currentResult: null });

        setTimeout(() => {
          if (get().phase === "drawing") {
            set({ phase: "drawn", drawnCards: [char, sett, act] });
          }
        }, DRAW_DELAY);
      },

      validateCombo: () => {
        const { drawnCards, totalScore, comboCount, streak, bestCombo, roundHistory, timeLeft, highScore, dailyHighScore, isDailyMode, isHardMode } = get();
        if (!drawnCards || get().phase !== "drawn" || isHardMode) return;

        const [char, sett, act] = drawnCards;
        const scored = scoreCombo(char, sett, act);

        const timeFraction = timeLeft / ROUND_DURATION;
        const timeBonus = Math.round(50 * timeFraction);
        const roundTotal = scored.score + timeBonus;

        const newStreak = scored.stars >= 3 ? streak + 1 : 0;
        const streakMul = newStreak >= 5 ? 2 : newStreak >= 3 ? 1.5 : 1;
        const finalRoundScore = Math.round(roundTotal * streakMul);

        const newTotalScore = totalScore + finalRoundScore;
        const roundResult: RoundResult = {
          cards: drawnCards,
          scored,
          timeBonus,
          roundTotal: finalRoundScore,
        };

        const newBestCombo = !bestCombo || finalRoundScore > bestCombo.roundTotal ? roundResult : bestCombo;
        
        let newIsHighScore = false;
        let newIsDailyRecord = false;
        let updatedHighScore = highScore;
        let updatedDailyHighScore = dailyHighScore;

        if (isDailyMode) {
          if (newTotalScore > dailyHighScore) {
            newIsDailyRecord = true;
            updatedDailyHighScore = newTotalScore;
          }
        } else {
          if (newTotalScore > highScore) {
            newIsHighScore = true;
            updatedHighScore = newTotalScore;
          }
        }

        set({
          phase: "scored",
          currentResult: scored,
          totalScore: newTotalScore,
          highScore: updatedHighScore,
          dailyHighScore: updatedDailyHighScore,
          isNewHighScore: newIsHighScore,
          isNewDailyRecord: newIsDailyRecord,
          comboCount: comboCount + 1,
          streak: newStreak,
          bestCombo: newBestCombo,
          roundHistory: [...roundHistory, roundResult],
        });
      },

      judgeCombo: (choice: "accept" | "reject") => {
        const { drawnCards, totalScore, comboCount, streak, roundHistory, timeLeft, highScore, dailyHighScore, isDailyMode, isHardMode } = get();
        if (!drawnCards || get().phase !== "drawn" || !isHardMode) return;

        const [char, sett, act] = drawnCards;
        const scored = scoreCombo(char, sett, act);
        
        const isCoherent = scored.stars >= 3;
        const isCorrect = (choice === "accept" && isCoherent) || (choice === "reject" && !isCoherent);

        const timeFraction = timeLeft / ROUND_DURATION;
        const timeBonus = Math.round(50 * timeFraction);
        
        let roundTotal = 0;
        if (isCorrect) {
          roundTotal = (scored.stars * 40) + timeBonus;
        } else {
          roundTotal = -50; // Penalty for wrong judgment
        }

        const newStreak = isCorrect ? streak + 1 : 0;
        const streakMul = newStreak >= 5 ? 2 : newStreak >= 3 ? 1.5 : 1;
        const finalRoundScore = Math.round(roundTotal * (roundTotal > 0 ? streakMul : 1));

        const newTotalScore = Math.max(0, totalScore + finalRoundScore);
        const roundResult: RoundResult = {
          cards: drawnCards,
          scored,
          timeBonus,
          roundTotal: finalRoundScore,
          judgment: isCorrect ? "correct" : "wrong",
        };

        const newIsHighScore = !isDailyMode && newTotalScore > highScore;
        const newIsDailyRecord = isDailyMode && newTotalScore > dailyHighScore;

        set({
          phase: "scored",
          currentResult: scored,
          totalScore: newTotalScore,
          highScore: newIsHighScore ? newTotalScore : highScore,
          dailyHighScore: newIsDailyRecord ? newTotalScore : dailyHighScore,
          isNewHighScore: newIsHighScore,
          isNewDailyRecord: newIsDailyRecord,
          comboCount: comboCount + 1,
          streak: newStreak,
          roundHistory: [...roundHistory, roundResult],
        });
      },

      nextRound: () => {
        get().drawCards();
      },

      tick: () => {
        const { timeLeft, timerInterval, phase } = get();
        if (phase === "idle" || phase === "gameover") return;

        const newTime = timeLeft - 1;
        if (newTime <= 0) {
          if (timerInterval) clearInterval(timerInterval);
          set({ timeLeft: 0, timerInterval: null, phase: "gameover" });
        } else {
          set({ timeLeft: newTime });
        }
      },

      endGame: () => {
        const { timerInterval } = get();
        if (timerInterval) clearInterval(timerInterval);
        set({ phase: "gameover", timerInterval: null });
      },

      resetAll: () => {
        const { timerInterval } = get();
        if (timerInterval) clearInterval(timerInterval);
        set({
          phase: "idle",
          drawnCards: null,
          currentResult: null,
          timeLeft: ROUND_DURATION,
          timerInterval: null,
          totalScore: 0,
          isNewHighScore: false,
          isNewDailyRecord: false,
          comboCount: 0,
          streak: 0,
          bestCombo: null,
          roundHistory: [],
        });
      },
    }),
    {
      name: "reverie-combo-storage",
      partialize: (state) => ({ 
        highScore: state.highScore, 
        dailyHighScore: state.dailyHighScore,
        lastDailyDate: state.lastDailyDate 
      }),
    }
  )
);
