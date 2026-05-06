export type ComboCategory = "character" | "setting" | "action";
export type ComboRarity = "common" | "rare" | "epic" | "legendary";

export interface ComboCard {
  id: string;
  name: string;
  category: ComboCategory;
  rarity: ComboRarity;
  flavor: string;
  icon: string;
  synergyTags: string[];
}

// Synergy tags are used by the scoring engine to evaluate how well cards
// combine. Shared tags across different categories = higher coherence.
// Rare cross-category synergies = "weird but creative" combos.

export const COMBO_CARDS: ComboCard[] = [
  // ── Characters ──────────────────────────────────────────────
  { id: "ch_dreamer",       name: "Il Sognatore",       category: "character", rarity: "common",    flavor: "Occhi chiusi, mente aperta.",                icon: "🌙", synergyTags: ["dream", "mind", "peaceful"] },
  { id: "ch_shadow",        name: "Ombra Errante",      category: "character", rarity: "rare",      flavor: "Segue senza mai parlare.",                  icon: "👤", synergyTags: ["dark", "mystery", "silent"] },
  { id: "ch_child",         name: "Bambino Perduto",    category: "character", rarity: "common",    flavor: "Un ricordo che non invecchia.",              icon: "🧒", synergyTags: ["memory", "innocence", "lost"] },
  { id: "ch_oracle",        name: "L'Oracolo",          category: "character", rarity: "epic",      flavor: "Vede ciò che il tempo nasconde.",            icon: "🔮", synergyTags: ["vision", "time", "mystic"] },
  { id: "ch_mask",          name: "Il Mascherato",      category: "character", rarity: "rare",      flavor: "Nessuno ha mai visto il suo volto.",         icon: "🎭", synergyTags: ["identity", "deception", "dark"] },
  { id: "ch_guardian",      name: "Guardiano Eterno",   category: "character", rarity: "epic",      flavor: "Protegge ciò che è già perduto.",            icon: "🛡️", synergyTags: ["protection", "ancient", "memory"] },
  { id: "ch_wanderer",      name: "Viandante Cosmico",  category: "character", rarity: "legendary", flavor: "Ha camminato oltre i confini della realtà.", icon: "✨", synergyTags: ["cosmic", "journey", "transcend"] },
  { id: "ch_echo",          name: "Eco del Passato",    category: "character", rarity: "common",    flavor: "Ripete parole che nessuno ricorda.",         icon: "🗣️", synergyTags: ["memory", "sound", "lost"] },
  { id: "ch_flame",         name: "Fiamma Vivente",     category: "character", rarity: "rare",      flavor: "Brucia senza mai consumarsi.",               icon: "🔥", synergyTags: ["fire", "passion", "destruction"] },
  { id: "ch_mirror",        name: "Specchio Animato",   category: "character", rarity: "epic",      flavor: "Riflette l'anima, non il corpo.",            icon: "🪞", synergyTags: ["identity", "reflection", "truth"] },

  // ── Settings ────────────────────────────────────────────────
  { id: "st_abyss",         name: "L'Abisso Onirico",   category: "setting", rarity: "rare",      flavor: "Dove i sogni cadono per non risalire.",       icon: "🕳️", synergyTags: ["dream", "dark", "depth"] },
  { id: "st_garden",        name: "Giardino Dimenticato", category: "setting", rarity: "common",  flavor: "I fiori crescono senza sole.",                icon: "🌿", synergyTags: ["nature", "memory", "peaceful"] },
  { id: "st_clock_tower",   name: "Torre dell'Orologio", category: "setting", rarity: "epic",     flavor: "Il tempo qui scorre al contrario.",           icon: "🕰️", synergyTags: ["time", "ancient", "mystic"] },
  { id: "st_mirror_hall",   name: "Sala degli Specchi",  category: "setting", rarity: "rare",     flavor: "Mille riflessi, nessuna verità.",             icon: "🏛️", synergyTags: ["identity", "reflection", "deception"] },
  { id: "st_void",          name: "Il Vuoto Stellare",   category: "setting", rarity: "legendary", flavor: "Un silenzio che contiene tutto.",             icon: "🌌", synergyTags: ["cosmic", "silent", "transcend"] },
  { id: "st_ruins",         name: "Rovine del Sé",       category: "setting", rarity: "common",   flavor: "Tutto ciò che resta di chi eravamo.",         icon: "🏚️", synergyTags: ["memory", "destruction", "lost"] },
  { id: "st_lake",          name: "Lago di Coscienza",   category: "setting", rarity: "common",   flavor: "Le acque riflettono i pensieri.",             icon: "💧", synergyTags: ["reflection", "mind", "peaceful"] },
  { id: "st_labyrinth",     name: "Labirinto Interiore", category: "setting", rarity: "rare",     flavor: "Ogni corridoio porta a un ricordo.",          icon: "🌀", synergyTags: ["journey", "mind", "mystery"] },
  { id: "st_ember_field",   name: "Campo di Braci",      category: "setting", rarity: "rare",     flavor: "Il fuoco qui non uccide, purifica.",          icon: "🔥", synergyTags: ["fire", "passion", "truth"] },
  { id: "st_dream_shore",   name: "Riva dei Sogni",      category: "setting", rarity: "epic",     flavor: "Dove il reale incontra l'impossibile.",       icon: "🏖️", synergyTags: ["dream", "journey", "vision"] },

  // ── Actions ─────────────────────────────────────────────────
  { id: "ac_remember",      name: "Ricordare",           category: "action", rarity: "common",    flavor: "Riportare alla luce ciò che era sepolto.",    icon: "💭", synergyTags: ["memory", "mind", "truth"] },
  { id: "ac_forget",         name: "Dimenticare",         category: "action", rarity: "rare",      flavor: "Lasciare andare per sopravvivere.",           icon: "🌫️", synergyTags: ["lost", "peaceful", "silent"] },
  { id: "ac_shatter",       name: "Frantumare",          category: "action", rarity: "rare",      flavor: "Distruggere per ricostruire.",                icon: "💥", synergyTags: ["destruction", "passion", "identity"] },
  { id: "ac_dream",         name: "Sognare",             category: "action", rarity: "common",    flavor: "Creare mondi con gli occhi chiusi.",          icon: "✨", synergyTags: ["dream", "vision", "cosmic"] },
  { id: "ac_deceive",       name: "Ingannare",           category: "action", rarity: "epic",      flavor: "La verità è un lusso.",                       icon: "🃏", synergyTags: ["deception", "identity", "dark"] },
  { id: "ac_traverse",      name: "Attraversare",        category: "action", rarity: "common",    flavor: "Ogni soglia è un punto di non ritorno.",      icon: "🚪", synergyTags: ["journey", "transcend", "depth"] },
  { id: "ac_ignite",        name: "Incendiare",          category: "action", rarity: "rare",      flavor: "Far bruciare ciò che deve finire.",           icon: "🔥", synergyTags: ["fire", "destruction", "passion"] },
  { id: "ac_reflect",       name: "Riflettere",          category: "action", rarity: "common",    flavor: "Guardarsi dentro è il primo passo.",          icon: "🔍", synergyTags: ["reflection", "truth", "mind"] },
  { id: "ac_transcend",     name: "Trascendere",         category: "action", rarity: "legendary", flavor: "Andare oltre i limiti del possibile.",        icon: "⚡", synergyTags: ["transcend", "cosmic", "mystic"] },
  { id: "ac_protect",       name: "Proteggere",          category: "action", rarity: "common",    flavor: "Alcuni ricordi vanno custoditi.",             icon: "🛡️", synergyTags: ["protection", "memory", "innocence"] },
];

// ── Scoring Engine ──────────────────────────────────────────
// A "combo" is always 1 Character + 1 Setting + 1 Action.
// Score = (rarityPoints + coherencePoints + thematicBonus) × rarityMultiplier
//  1. Rarity points — base value from card rarity
//  2. Coherence     — shared synergy tags across all 3 cards
//  3. Thematic bonus — specific tag clusters worth extra
//  4. Rarity multiplier — geometric mean amplifies total

export const RARITY_POINTS: Record<ComboRarity, number> = {
  common: 10,
  rare: 25,
  epic: 50,
  legendary: 100,
};

const RARITY_MULTIPLIER: Record<ComboRarity, number> = {
  common: 1,
  rare: 1.3,
  epic: 1.6,
  legendary: 2,
};

export interface ScoredCombo {
  score: number;
  rarityPoints: number;
  coherencePoints: number;
  stars: number;
  title: string;
  feedback: string;
  narration: string;
  bonuses: string[];
}

const THEMATIC_COMBOS: { tags: string[]; bonus: number; label: string }[] = [
  { tags: ["dream", "cosmic", "transcend"],   bonus: 35, label: "✦ Risveglio Cosmico" },
  { tags: ["fire", "destruction", "passion"],  bonus: 25, label: "✦ Catarsi Infuocata" },
  { tags: ["memory", "lost", "identity"],      bonus: 25, label: "✦ Frammenti del Sé" },
  { tags: ["dark", "deception", "silent"],      bonus: 22, label: "✦ Inganno Oscuro" },
  { tags: ["reflection", "truth", "mind"],      bonus: 22, label: "✦ Specchio dell'Anima" },
  { tags: ["journey", "vision", "mystic"],      bonus: 30, label: "✦ Viaggio Mistico" },
  { tags: ["protection", "innocence", "memory"], bonus: 20, label: "✦ Custode dei Ricordi" },
  { tags: ["time", "ancient", "depth"],          bonus: 28, label: "✦ Eco del Tempo" },
  { tags: ["nature", "peaceful", "reflection"],  bonus: 15, label: "✦ Armonia Naturale" },
  { tags: ["dream", "lost", "silent"],          bonus: 20, label: "✦ Silenzio Onirico" },
  { tags: ["ancient", "time", "destruction"],    bonus: 25, label: "✦ Entropia Eterna" },
  { tags: ["identity", "deception", "mystery"],  bonus: 20, label: "✦ Maschera Invisibile" },
  { tags: ["cosmic", "depth", "transcend"],      bonus: 30, label: "✦ Abisso Stellare" },
  { tags: ["nature", "peaceful", "innocence"],   bonus: 18, label: "✦ Purezza Primordiale" },
  { tags: ["mind", "vision", "truth"],           bonus: 24, label: "✦ Chiarezza Interiore" },
];

const FEEDBACK_TABLE: { min: number; stars: 1 | 2 | 3 | 4 | 5; title: string; feedback: string }[] = [
  { min: 200, stars: 5, title: "COMBO LEGGENDARIA!",       feedback: "Una combinazione che riscrive la realtà. Pura maestria onirica." },
  { min: 120, stars: 4, title: "Combo Eccezionale!",        feedback: "Una visione potente. I frammenti si allineano perfettamente." },
  { min: 70,  stars: 3, title: "Buona Combo!",              feedback: "Un legame solido tra i frammenti. C'è armonia." },
  { min: 40,  stars: 2, title: "Bizzarra ma Creativa",      feedback: "Strano accostamento... ma c'è un filo nascosto." },
  { min: 0,   stars: 1, title: "Combo Caotica",             feedback: "I frammenti non si parlano. Ma il caos ha il suo fascino." },
];

function generateStory(c: ComboCard, s: ComboCard, a: ComboCard): string {
  const templates = [
    `C'era una volta ${c.name}, che tra le ombre di ${s.name} decise di ${a.name.toLowerCase()}.`,
    `In un sogno perduto, ${c.name} scelse di ${a.name.toLowerCase()} nel cuore di ${s.name}.`,
    `${c.name} sentì il richiamo di ${s.name} e non poté fare a meno di ${a.name.toLowerCase()}.`,
    `Tutto cambiò quando ${c.name} osò ${a.name.toLowerCase()} presso ${s.name}.`,
    `Si narra che ${c.name} ritorni ancora a ${s.name} per ${a.name.toLowerCase()}.`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

export function scoreCombo(character: ComboCard, setting: ComboCard, action: ComboCard): ScoredCombo {
  const allTags = [...character.synergyTags, ...setting.synergyTags, ...action.synergyTags];
  const tagCounts = new Map<string, number>();
  for (const t of allTags) tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);

  // Rarity base points
  const rarityPoints =
    RARITY_POINTS[character.rarity] +
    RARITY_POINTS[setting.rarity] +
    RARITY_POINTS[action.rarity];

  // Coherence: tags that appear in 2+ cards
  let coherencePoints = 0;
  for (const [, count] of tagCounts) {
    if (count === 2) coherencePoints += 8;
    if (count === 3) coherencePoints += 18;
  }

  // Rarity multiplier (geometric mean)
  const rarityMul =
    (RARITY_MULTIPLIER[character.rarity] *
      RARITY_MULTIPLIER[setting.rarity] *
      RARITY_MULTIPLIER[action.rarity]) ** (1 / 3);

  // Thematic bonus
  const bonuses: string[] = [];
  let thematicBonus = 0;
  for (const combo of THEMATIC_COMBOS) {
    const matched = combo.tags.every((t) => allTags.includes(t));
    if (matched) {
      thematicBonus += combo.bonus;
      bonuses.push(combo.label);
    }
  }

  const rawScore = (rarityPoints + coherencePoints + thematicBonus) * rarityMul;
  const score = Math.round(rawScore);

  const entry = FEEDBACK_TABLE.find((e) => score >= e.min)!;
  return {
    score,
    rarityPoints,
    coherencePoints,
    stars: entry.stars,
    title: entry.title,
    feedback: entry.feedback,
    narration: generateStory(c, s, a),
    bonuses,
  };
}

// Pick N random items from array (Fisher-Yates partial)
export function pickRandom<T>(arr: T[], n: number): T[] {
  const pool = [...arr];
  const result: T[] = [];
  for (let i = 0; i < Math.min(n, pool.length); i++) {
    const j = i + Math.floor(Math.random() * (pool.length - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];
    result.push(pool[i]);
  }
  return result;
}

export function generateFunnyCombo() {
  const characters = COMBO_CARDS.filter((c) => c.category === "character");
  const settings = COMBO_CARDS.filter((c) => c.category === "setting");
  const actions = COMBO_CARDS.filter((c) => c.category === "action");

  const c = pickRandom(characters, 1)[0];
  const s = pickRandom(settings, 1)[0];
  const a = pickRandom(actions, 1)[0];

  const templates = [
    `Il piano segreto di ${c.name}: ${a.name} in ${s.name}!`,
    `Sogno o realtà? ${c.name} sta cercando di ${a.name} proprio in ${s.name}.`,
    `Breaking News: ${c.name} avvistato mentre prova a ${a.name} in ${s.name}!`,
    `La combo più assurda: ${c.name} + ${s.name} + ${a.name}.`,
    `Non crederai mai cosa sta facendo ${c.name} in ${s.name}... sta cercando di ${a.name}!`,
  ];

  return {
    cards: [c, s, a] as [ComboCard, ComboCard, ComboCard],
    text: templates[Math.floor(Math.random() * templates.length)],
  };
}

export type RiskLevel = "Low" | "Medium" | "High";

export function calculateRisk(scored: ScoredCombo): { level: RiskLevel; color: string; description: string } {
  const { stars, score } = scored;
  
  if (stars >= 4 || score >= 200) {
    return { level: "High", color: "text-rose", description: "Difficile ottenere di meglio" };
  }
  if (stars === 3 || score >= 100) {
    return { level: "Medium", color: "text-amber-eclipse", description: "Combo solida, potresti rischiare" };
  }
  return { level: "Low", color: "text-emerald", description: "Vale la pena provare un reroll" };
}

export function getPotentialText(scored: ScoredCombo): string {
  const { stars } = scored;
  if (stars >= 5) return "Combinazione Leggendaria!";
  if (stars === 4) return "Grande Potenziale";
  if (stars === 3) return "Buona Sinergia";
  return "Potenziale Basso";
}
