export type CardType = "character" | "setting" | "action" | "modifier" | "archetype" | "memory" | "mask";
export type CardRarity = "common" | "rare" | "epic" | "legendary";

export type GameEventType = "none" | "double_points" | "chaos" | "rare_boost" | "time_pressure";

export interface GameEvent {
  type: GameEventType;
  label: string;
  description: string;
  color: string;
}

export interface Achievement {
  id: string;
  label: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface VariantTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundGradient: string;
  labels: Record<CardType, string>;
}

export interface GameVariant {
  id: string;
  name: string;
  description: string;
  cards: Card[];
  synergyRules: SynergyRule[];
  theme: VariantTheme;
}

export interface Card {
  id: string;
  name: string;
  type: CardType;
  rarity: CardRarity;
  tags: string[];
  icon: string;
  flavor: string;
  // Optional mechanics
  cost?: number;
  power?: number;
  effect?: any;
}

export interface SynergyRule {
  tags: string[];
  bonus: number;
  label: string;
  description: string;
  isPenalty?: boolean;
}

export interface EvaluationResult {
  score: number;
  stars: number;
  title: string;
  feedback: string;
  narration: string;
  bonuses: string[];
  penalties: string[];
  synergyLevel: number; // 0 to 100
}
