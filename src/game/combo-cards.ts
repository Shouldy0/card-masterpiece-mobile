import { EvaluationResult } from "./engine/types";

export type RiskLevel = "Low" | "Medium" | "High";

/**
 * Calculates the risk of rerolling based on the current evaluation
 */
export function calculateRisk(result: EvaluationResult): {
  level: RiskLevel;
  color: string;
  description: string;
} {
  const { stars, score } = result;

  if (stars >= 4 || score >= 150) {
    return { level: "High", color: "text-rose", description: "Difficile ottenere di meglio" };
  }
  if (stars === 3 || score >= 70) {
    return {
      level: "Medium",
      color: "text-amber-eclipse",
      description: "Combo solida, potresti rischiare",
    };
  }
  return { level: "Low", color: "text-emerald", description: "Vale la pena provare un reroll" };
}

/**
 * Returns a human-readable potential label for the current combo
 */
export function getPotentialText(result: EvaluationResult): string {
  const { stars } = result;
  if (stars >= 5) return "Combinazione Leggendaria!";
  if (stars === 4) return "Grande Potenziale";
  if (stars === 3) return "Buona Sinergia";
  return "Potenziale Basso";
}

/**
 * Returns the rank letter (S, A, B...) based on the score
 */
export function getRank(score: number): { rank: string; color: string } {
  if (score >= 200) return { rank: "S", color: "text-gold glow-gold" };
  if (score >= 120) return { rank: "A", color: "text-mystic-glow shadow-mystic" };
  if (score >= 70) return { rank: "B", color: "text-azure" };
  if (score >= 40) return { rank: "C", color: "text-amber-eclipse" };
  return { rank: "D", color: "text-muted-foreground" };
}
