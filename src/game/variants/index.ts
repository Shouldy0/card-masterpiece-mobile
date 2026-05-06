import { GameVariant } from "../engine/types";
import { CARD_POOL } from "../engine/card-pool";

export const REVERIE_VARIANT: GameVariant = {
  id: "reverie",
  name: "Reverie",
  description: "Il sogno originale. Surrealismo e introspezione.",
  cards: CARD_POOL,
  synergyRules: [
    { tags: ["dream", "cosmic", "transcend"], bonus: 50, label: "✦ Risveglio Cosmico", description: "Unione tra il sogno e l'infinito." },
    { tags: ["memory", "identity", "truth"], bonus: 40, label: "✦ Frammenti del Sé", description: "La scoperta della propria vera natura." },
    { tags: ["dark", "deception", "mystery"], bonus: 35, label: "✦ Inganno Oscuro", description: "Il velo dell'illusione è calato." },
    { tags: ["destruction", "passion"], bonus: 30, label: "✦ Catarsi Infuocata", description: "La distruzione che purifica l'anima." },
    { tags: ["nature", "peaceful", "memory"], bonus: 25, label: "✦ Armonia Silenziosa", description: "Il ritorno alle origini dimenticate." },
    { tags: ["cosmic", "nature"], bonus: -20, label: "⚠ Squilibrio Naturale", description: "Le forze cosmiche schiacciano la natura.", isPenalty: true },
    { tags: ["dark", "peaceful"], bonus: -15, label: "⚠ Caos Discordante", description: "L'oscurità corrompe la quiete.", isPenalty: true },
    { tags: ["destruction", "peaceful"], bonus: -25, label: "⚠ Violenza Ingiusta", description: "La distruzione annulla la pace.", isPenalty: true },
    { tags: ["mystery", "truth"], bonus: -10, label: "⚠ Paradosso", description: "Il mistero svanisce sotto la verità.", isPenalty: true },
  ],
  theme: {
    primaryColor: "gold",
    secondaryColor: "mystic",
    accentColor: "amber-eclipse",
    backgroundGradient: "from-abyss/20 via-transparent to-abyss/80",
    labels: {
      character: "ANIMA",
      setting: "LUOGO",
      action: "INTENTO",
      modifier: "ESSENZA",
      archetype: "ARCHETIPO",
      memory: "RICORDO",
      mask: "MASCHERA"
    }
  }
};

export const FANTASY_VARIANT: GameVariant = {
  id: "fantasy",
  name: "Dragon Deck",
  description: "Eroi, draghi e incantesimi in un mondo leggendario.",
  cards: [
    { id: "f1", name: "Cavaliere Errante", type: "character", rarity: "rare", icon: "⚔️", tags: ["hero", "noble"], flavor: "In cerca di onore." },
    { id: "f2", name: "Drago di Fuoco", type: "character", rarity: "legendary", icon: "🐉", tags: ["dragon", "fire"], flavor: "Il terrore dei cieli." },
    { id: "f3", name: "Castello di Cristallo", type: "setting", rarity: "epic", icon: "🏰", tags: ["holy", "magic"], flavor: "Riflessi di un'epoca d'oro." },
    { id: "f4", name: "Lanciare Palla di Fuoco", type: "action", rarity: "common", icon: "🔥", tags: ["magic", "fire"], flavor: "Calore distruttivo." },
    { id: "f5", name: "Sconfiggere l'Oscurità", type: "action", rarity: "rare", icon: "✨", tags: ["hero", "holy"], flavor: "La luce prevarrà." },
    { id: "f6", name: "Foresta Incantata", type: "setting", rarity: "rare", icon: "🌲", tags: ["nature", "magic"], flavor: "Gli alberi sussurrano segreti." },
  ],
  synergyRules: [
    { tags: ["dragon", "fire"], bonus: 60, label: "✦ Soffio Infernale", description: "Il drago scatena la sua vera potenza." },
    { tags: ["hero", "holy"], bonus: 40, label: "✦ Giustizia Divina", description: "L'eroe è guidato dalla luce." },
    { tags: ["nature", "magic"], bonus: 30, label: "✦ Comunione Naturale", description: "La magia scorre nelle radici." },
    { tags: ["fire", "nature"], bonus: -30, label: "⚠ Incendio Boschivo", description: "Il fuoco distrugge la foresta.", isPenalty: true },
  ],
  theme: {
    primaryColor: "rose",
    secondaryColor: "emerald",
    accentColor: "amber",
    backgroundGradient: "from-emerald/20 via-transparent to-rose/20",
    labels: {
      character: "EROE",
      setting: "REGNO",
      action: "MAGIA",
      modifier: "PERGAMENA",
      archetype: "CLASSE",
      memory: "LEGGENDA",
      mask: "ELMO"
    }
  }
};
