export type CardType = "archetipo" | "ricordo" | "maschera";
export type Rarity = "comune" | "rara" | "epica" | "leggendaria";
export type TerritoryId = "memoria" | "trauma" | "sogno";

export type CardEffect =
  | { kind: "draw"; amount: number }
  | { kind: "buff_self"; amount: number }
  | { kind: "weaken_enemy"; amount: number }
  | { kind: "heal"; amount: number }
  | { kind: "none" };

export interface CardDef {
  id: string;
  name: string;
  type: CardType;
  cost: number;
  power: number;
  rarity: Rarity;
  text: string;
  flavor?: string;
  effect: CardEffect;
  art: string; // path under /cards
}

export const CARDS: CardDef[] = [
  { id: "eco_dimenticato", name: "Eco Dimenticato", type: "archetipo", cost: 3, power: 4, rarity: "rara", text: "Quando viene Rivelata, pesca 1 carta.", flavor: "Parole mai dette che ancora risuonano nel vuoto.", effect: { kind: "draw", amount: 1 }, art: "/cards/eco_dimenticato.png" },
  { id: "maschera_dolore", name: "Maschera del Dolore", type: "maschera", cost: 4, power: 6, rarity: "epica", text: "Indebolisce le carte avversarie di -1.", flavor: "Il volto che mostriamo quando la verità è troppo pesante.", effect: { kind: "weaken_enemy", amount: 1 }, art: "/cards/maschera_dolore.png" },
  { id: "sussurro_interiore", name: "Sussurro Interiore", type: "ricordo", cost: 2, power: 3, rarity: "comune", text: "+1 Potere alle tue carte fino a fine turno.", flavor: "Una voce sottile che ti ricorda chi sei veramente.", effect: { kind: "buff_self", amount: 1 }, art: "/cards/sussurro_interiore.png" },
  { id: "ricordo_sfuggente", name: "Ricordo Sfuggente", type: "ricordo", cost: 2, power: 2, rarity: "comune", text: "Pesca 1 carta.", flavor: "Come fumo tra le dita, svanisce non appena provi ad afferrarlo.", effect: { kind: "draw", amount: 1 }, art: "/cards/ricordo_sfuggente.png" },
  { id: "frammento_verita", name: "Frammento di Verità", type: "archetipo", cost: 2, power: 3, rarity: "comune", text: "Un piccolo frammento luminoso.", flavor: "Tagliente e puro, rivela ciò che l'ombra nasconde.", effect: { kind: "none" }, art: "/cards/frammento_verita.png" },
  { id: "risveglio_se", name: "Risveglio del Sé", type: "archetipo", cost: 5, power: 7, rarity: "epica", text: "Recupera 2 HP.", flavor: "La fine del sogno è solo l'inizio della realtà.", effect: { kind: "heal", amount: 2 }, art: "/cards/risveglio_se.png" },
  { id: "dolore_represso", name: "Dolore Represso", type: "maschera", cost: 4, power: 5, rarity: "rara", text: "Indebolisce le carte avversarie di -1.", flavor: "Cosa succede quando non puoi più gridare?", effect: { kind: "weaken_enemy", amount: 1 }, art: "/cards/dolore_represso.png" },
  { id: "frammento_di_me", name: "Frammento di Me", type: "ricordo", cost: 3, power: 4, rarity: "rara", text: "+1 Potere alle tue carte fino a fine turno.", flavor: "Un pezzo del puzzle che non riuscivo a completare.", effect: { kind: "buff_self", amount: 1 }, art: "/cards/frammento_di_me.png" },
  { id: "io_falso", name: "Io Falso", type: "maschera", cost: 2, power: 2, rarity: "comune", text: "Una maschera fragile.", flavor: "Un riflesso che non riconosco più.", effect: { kind: "none" }, art: "/cards/io_falso.png" },
  { id: "catarsi", name: "Catarsi", type: "archetipo", cost: 2, power: 2, rarity: "comune", text: "Recupera 1 HP.", flavor: "Le lacrime che lavano via il veleno dell'anima.", effect: { kind: "heal", amount: 1 }, art: "/cards/catarsi.png" },
  { id: "radici_spezzate", name: "Radici Spezzate", type: "ricordo", cost: 4, power: 5, rarity: "rara", text: "Pesca 1 carta.", flavor: "Il legame con il passato è stato troncato, ma la terra non dimentica.", effect: { kind: "draw", amount: 1 }, art: "/cards/radici_spezzate.png" },
  { id: "paura_primordiale", name: "Paura Primordiale", type: "maschera", cost: 2, power: 3, rarity: "comune", text: "Una paura antica.", flavor: "L'oscurità che abita sotto il letto del tempo.", effect: { kind: "none" }, art: "/cards/paura_primordiale.png" },
  { id: "specchio_distorto", name: "Specchio Distorto", type: "maschera", cost: 2, power: 2, rarity: "comune", text: "Indebolisce -1.", flavor: "Nulla è come sembra quando guardi attraverso il trauma.", effect: { kind: "weaken_enemy", amount: 1 }, art: "/cards/specchio_distorto.png" },
  { id: "luce_interiore", name: "Luce Interiore", type: "archetipo", cost: 2, power: 3, rarity: "comune", text: "Recupera 1 HP.", flavor: "Una scintilla che non può essere spenta.", effect: { kind: "heal", amount: 1 }, art: "/cards/luce_interiore.png" },
  { id: "ombra_celata", name: "Ombra Celata", type: "maschera", cost: 5, power: 7, rarity: "epica", text: "Indebolisce -2.", flavor: "Ciò che nascondiamo a noi stessi ha il potere più grande.", effect: { kind: "weaken_enemy", amount: 2 }, art: "/cards/ombra_celata.png" },
  { id: "sogno_lucido", name: "Sogno Lucido", type: "archetipo", cost: 6, power: 9, rarity: "leggendaria", text: "+2 Potere alle tue carte.", flavor: "Essere il padrone dell'illusione, per un breve istante.", effect: { kind: "buff_self", amount: 2 }, art: "/cards/sogno_lucido.png" },
  { id: "infanzia_perduta", name: "Infanzia Perduta", type: "ricordo", cost: 1, power: 2, rarity: "comune", text: "Un ricordo lontano.", flavor: "Il profumo di pioggia su una strada che non esiste più.", effect: { kind: "none" }, art: "/cards/infanzia_perduta.png" },
  { id: "abisso_interiore", name: "Abisso Interiore", type: "archetipo", cost: 6, power: 8, rarity: "leggendaria", text: "Pesca 2 carte.", flavor: "Se guardi a lungo nell'abisso, l'abisso ti darà le risposte.", effect: { kind: "draw", amount: 2 }, art: "/cards/abisso_interiore.png" },
  { id: "veglia_eterna", name: "Veglia Eterna", type: "ricordo", cost: 3, power: 4, rarity: "rara", text: "+1 Potere alle tue carte.", flavor: "Non dormire mai significa non smettere mai di ricordare.", effect: { kind: "buff_self", amount: 1 }, art: "/cards/veglia_eterna.png" },
  { id: "guardiano_silenzio", name: "Guardiano del Silenzio", type: "maschera", cost: 5, power: 6, rarity: "epica", text: "Indebolisce -2.", flavor: "Zitto. Senti come il vuoto urla?", effect: { kind: "weaken_enemy", amount: 2 }, art: "/cards/guardiano_silenzio.png" },
];

export const cardsById = Object.fromEntries(CARDS.map((c) => [c.id, c]));

export const TERRITORIES: { id: TerritoryId; name: string; rule: string; accent: string; icon: string }[] = [
  { id: "memoria", name: "Memoria d'Infanzia", rule: "Pesca 1 carta se controlli questo territorio.", accent: "var(--amber-eclipse)", icon: "🜂" },
  { id: "trauma", name: "Trauma Rimosso", rule: "Le carte giocate qui perdono -1 Potere.", accent: "var(--rose)", icon: "🜔" },
  { id: "sogno", name: "Sogno Lucido", rule: "Le tue carte hanno +1 Potere.", accent: "var(--azure)", icon: "🜄" },
];
