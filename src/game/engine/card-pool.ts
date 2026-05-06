import { Card } from "./types";

/**
 * CENTRAL CARD POOL
 * All cards for all game modes are defined here.
 */
export const CARD_POOL: Card[] = [
  // --- CHARACTERS / ARCHETYPES ---
  { id: "ch_dreamer", name: "Il Sognatore", type: "character", rarity: "common", icon: "🌙", tags: ["dream", "mind", "peaceful"], flavor: "Occhi chiusi, mente aperta." },
  { id: "ch_shadow", name: "Ombra Errante", type: "character", rarity: "rare", icon: "👤", tags: ["dark", "mystery", "silent"], flavor: "Segue senza mai parlare." },
  { id: "ch_oracle", name: "L'Oracolo", type: "character", rarity: "epic", icon: "🔮", tags: ["vision", "time", "mystic"], flavor: "Vede ciò che il tempo nasconde." },
  { id: "ch_wanderer", name: "Viandante Cosmico", type: "character", rarity: "legendary", icon: "✨", tags: ["cosmic", "journey", "transcend"], flavor: "Ha camminato oltre i confini della realtà." },
  { id: "ch_guardian", name: "Guardiano Eterno", type: "character", rarity: "epic", icon: "🛡️", tags: ["protection", "ancient", "memory"], flavor: "Protegge ciò che è già perduto." },
  
  // --- SETTINGS / AMBIENTAZIONI ---
  { id: "st_abyss", name: "L'Abisso Onirico", type: "setting", rarity: "rare", icon: "🕳️", tags: ["dream", "dark", "depth"], flavor: "Dove i sogni cadono per non risalire." },
  { id: "st_clock_tower", name: "Torre dell'Orologio", type: "setting", rarity: "epic", icon: "🕰️", tags: ["time", "ancient", "mystic"], flavor: "Il tempo qui scorre al contrario." },
  { id: "st_void", name: "Il Vuoto Stellare", type: "setting", rarity: "legendary", icon: "🌌", tags: ["cosmic", "silent", "transcend"], flavor: "Un silenzio che contiene tutto." },
  { id: "st_labyrinth", name: "Labirinto Interiore", type: "setting", rarity: "rare", icon: "🌀", tags: ["journey", "mind", "mystery"], flavor: "Ogni corridoio porta a un ricordo." },
  { id: "st_garden", name: "Giardino Dimenticato", type: "setting", rarity: "common", icon: "🌿", tags: ["nature", "memory", "peaceful"], flavor: "I fiori crescono senza sole." },

  // --- ACTIONS / AZIONI ---
  { id: "ac_remember", name: "Ricordare", type: "action", rarity: "common", icon: "💭", tags: ["memory", "mind", "truth"], flavor: "Riportare alla luce ciò che era sepolto." },
  { id: "ac_shatter", name: "Frantumare", type: "action", rarity: "rare", icon: "💥", tags: ["destruction", "passion", "identity"], flavor: "Distruggere per ricostruire." },
  { id: "ac_deceive", name: "Ingannare", type: "action", rarity: "epic", icon: "🃏", tags: ["deception", "identity", "dark"], flavor: "La verità è un lusso." },
  { id: "ac_transcend", name: "Trascendere", type: "action", rarity: "legendary", icon: "⚡", tags: ["transcend", "cosmic", "mystic"], flavor: "Andare oltre i limiti del possibile." },
  { id: "ac_forget", name: "Dimenticare", type: "action", rarity: "rare", icon: "🌫️", tags: ["lost", "peaceful", "silent"], flavor: "Lasciare andare per sopravvivere." },

  // --- MODIFIERS / MASCHERE ---
  { id: "mod_chaos", name: "Frammento del Caos", type: "modifier", rarity: "rare", icon: "🌀", tags: ["dark", "destruction"], flavor: "Il disordine è l'unica costante." },
  { id: "mod_echo", name: "Eco del Passato", type: "modifier", rarity: "common", icon: "🗣️", tags: ["memory", "sound"], flavor: "Ripete parole che nessuno ricorda." },
  { id: "mod_mirror", name: "Specchio dell'Anima", type: "modifier", rarity: "epic", icon: "🪞", tags: ["identity", "truth"], flavor: "Riflette ciò che sei, non ciò che sembri." },
];

export const getCardById = (id: string) => CARD_POOL.find(c => c.id === id);
