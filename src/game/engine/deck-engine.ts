import { Card, CardType, CardRarity, GameVariant, EvaluationResult, SynergyRule } from "./types";

export class DeckEngine {
  // --- Procedural Generation Pools (Generic) ---
  private static ADJECTIVES = {
    positive: ["Radiante", "Eterno", "Luminoso", "Puro", "Vibrante", "Sacro"],
    negative: ["Oscuro", "Tormentato", "Fratturato", "Perduto", "Abissale", "Dimenticato"],
    neutral: ["Antico", "Silenzioso", "Misterioso", "Invisibile", "Errante", "Latente"]
  };

  private static NOUNS = {
    character: ["Sognatore", "Guardiano", "Ombra", "Oracolo", "Viandante", "Eco", "Anima", "Spirito"],
    setting: ["Abisso", "Giardino", "Torre", "Vuoto", "Labirinto", "Rovina", "Santuario", "Confine"],
    action: ["Ricordare", "Dimenticare", "Sognare", "Trascendere", "Frantumare", "Osservare", "Evolvere"]
  };

  private static ICONS = {
    character: ["👤", "🧙", "👼", "👻", "🧟", "🤖"],
    setting: ["🏛️", "🌲", "🌌", "🏜️", "🌋", "🏰"],
    action: ["✨", "🔥", "💧", "🌪️", "⚡", "👁️"]
  };

  private static RARITY_SCORE: Record<string, number> = {
    common: 10,
    rare: 25,
    epic: 50,
    legendary: 100,
  };

  /**
   * Generates a unique procedural card based on variant context
   */
  static generateProceduralCard(type: CardType, variant: GameVariant): Card {
    const isPositive = Math.random() > 0.5;
    const adjPool = isPositive ? [...DeckEngine.ADJECTIVES.positive, ...DeckEngine.ADJECTIVES.neutral] : [...DeckEngine.ADJECTIVES.negative, ...DeckEngine.ADJECTIVES.neutral];
    const adj = adjPool[Math.floor(Math.random() * adjPool.length)];
    
    // Customize nouns based on variant labels if possible
    const nounPool = DeckEngine.NOUNS[type as keyof typeof DeckEngine.NOUNS] || [];
    const noun = nounPool[Math.floor(Math.random() * nounPool.length)] || variant.theme.labels[type] || "Entità";
    
    const name = Math.random() > 0.3 ? `${noun} ${adj}` : `${adj} ${noun}`;
    const iconPool = DeckEngine.ICONS[type as keyof typeof DeckEngine.ICONS] || [];
    const icon = iconPool[Math.floor(Math.random() * iconPool.length)] || "❓";
    
    const rarities: CardRarity[] = ["common", "rare", "epic", "legendary"];
    const rarityWeights = [0.6, 0.25, 0.1, 0.05];
    const rVal = Math.random();
    let rarity: CardRarity = "common";
    let cumulative = 0;
    for (let i = 0; i < rarities.length; i++) {
      cumulative += rarityWeights[i];
      if (rVal <= cumulative) { rarity = rarities[i]; break; }
    }

    const tags: string[] = [type];
    if (DeckEngine.ADJECTIVES.positive.includes(adj)) tags.push("peaceful", "truth", "holy");
    if (DeckEngine.ADJECTIVES.negative.includes(adj)) tags.push("dark", "lost", "fire");
    if (DeckEngine.ADJECTIVES.neutral.includes(adj)) tags.push("mystery", "ancient", "magic");
    
    return {
      id: `proc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      type,
      rarity,
      icon,
      tags,
      flavor: `Un'entità generata dalle profondità di ${variant.name}. ${adj} e ${isPositive ? "vivida" : "inquietante"}.`,
    };
  }

  /**
   * Draws a valid combo based on the active variant
   */
  static drawCombo(variant: GameVariant, level: number = 1, streak: number = 0): [Card, Card, Card] {
    const drawOne = (type: CardType) => {
      const procChance = Math.min(0.7, 0.4 + streak * 0.05);
      if (Math.random() < procChance) return this.generateProceduralCard(type, variant);
      
      const pool = variant.cards.filter(c => {
        if (c.type !== type) return false;
        if (c.rarity === "legendary") return level >= 2 || (streak >= 3 && Math.random() < 0.2);
        return true;
      });
      
      if (pool.length === 0) return this.generateProceduralCard(type, variant);
      return pool[Math.floor(Math.random() * pool.length)];
    };

    return [drawOne("character"), drawOne("setting"), drawOne("action")];
  }

  /**
   * Evaluates a combination of cards using the variant's synergy rules
   */
  static evaluate(cards: Card[], variant: GameVariant): EvaluationResult {
    const allTags = cards.flatMap(c => c.tags);
    const tagCounts = new Map<string, number>();
    for (const t of allTags) tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);

    // 1. Rarity Base
    let score = cards.reduce((s, c) => s + (this.RARITY_SCORE[c.rarity] ?? 0), 0);

    // 2. Tag Coherence
    for (const [, count] of tagCounts) {
      if (count === 2) score += 10;
      if (count >= 3) score += 25;
    }

    // 3. Variant-Specific Synergy Rules
    const activeBonuses: string[] = [];
    const activePenalties: string[] = [];
    for (const rule of variant.synergyRules) {
      const matchCount = rule.tags.filter(t => allTags.includes(t)).length;
      if (matchCount >= rule.tags.length) {
        score += rule.bonus;
        if (rule.isPenalty) activePenalties.push(rule.label);
        else activeBonuses.push(rule.label);
      }
    }

    score = Math.max(0, score);
    const synergyLevel = Math.min(100, Math.round((score / 250) * 100));

    let stars: number = 1;
    if (score >= 200) stars = 5;
    else if (score >= 120) stars = 4;
    else if (score >= 70) stars = 3;
    else if (score >= 40) stars = 2;

    const title = this.generateTitle(score, stars);
    const narration = this.generateNarration(cards);

    return {
      score,
      stars,
      title,
      feedback: this.generateFeedback(stars),
      narration,
      bonuses: activeBonuses,
      penalties: activePenalties,
      synergyLevel
    };
  }

  private static generateTitle(score: number, stars: number): string {
    if (stars === 5) return "✦ Verità Assoluta";
    if (stars === 4) return "✦ Visione Cristallina";
    if (stars === 3) return "✦ Eco Coerente";
    if (stars === 2) return "✦ Sussurro Debole";
    return "✦ Frammento Caotico";
  }

  private static generateFeedback(stars: number): string {
    const feedbacks = [
      "Un disastro onirico.",
      "C'è del potenziale.",
      "Una visione interessante.",
      "Magnifico equilibrio!",
      "Il Sognatore si è svegliato!"
    ];
    return feedbacks[stars - 1] || feedbacks[0];
  }

  private static generateNarration(cards: Card[]): string {
    const [c, s, a] = cards;
    return `${c.name} si trova in ${s.name} cercando di ${a.name}.`;
  }
}
