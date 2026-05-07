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
  
  // --- NUOVE CARTE (Espansione a 50) ---
  
  // Archetipi
  { id: "nostalgia", name: "Nostalgia", type: "archetipo", cost: 2, power: 2, rarity: "rara", text: "Pesca 1 carta.", flavor: "Un passato che brilla più del presente.", effect: { kind: "draw", amount: 1 }, art: "/cards/ricordo_sfuggente.png" },
  { id: "ossessione", name: "Ossessione", type: "archetipo", cost: 4, power: 6, rarity: "epica", text: "+2 Potere a se stessa.", flavor: "Un pensiero che si nutre di te.", effect: { kind: "buff_self", amount: 2 }, art: "/cards/ombra_celata.png" },
  { id: "armonia", name: "Armonia", type: "archetipo", cost: 3, power: 3, rarity: "rara", text: "Cura 2 HP.", flavor: "Il silenzio perfetto tra due battiti del cuore.", effect: { kind: "heal", amount: 2 }, art: "/cards/catarsi.png" },
  { id: "ambizione", name: "Ambizione", type: "archetipo", cost: 5, power: 8, rarity: "leggendaria", text: "Un potere che consuma.", flavor: "Voglio tutto, anche se il prezzo è la mia anima.", effect: { kind: "none" }, art: "/cards/abisso_interiore.png" },
  { id: "apatia", name: "Apatia", type: "archetipo", cost: 3, power: 5, rarity: "comune", text: "Grigio e immobile.", flavor: "Nulla fa più male, nulla fa più bene.", effect: { kind: "none" }, art: "/cards/io_falso.png" },
  { id: "follia", name: "Follia", type: "archetipo", cost: 6, power: 10, rarity: "leggendaria", text: "Effetto casuale.", flavor: "La verità è un cerchio che non si chiude.", effect: { kind: "none" }, art: "/cards/sogno_lucido.png" },
  { id: "empatia", name: "Empatia", type: "archetipo", cost: 2, power: 2, rarity: "rara", text: "Cura 1 HP.", flavor: "Sento il tuo peso come se fosse il mio.", effect: { kind: "heal", amount: 1 }, art: "/cards/luce_interiore.png" },
  { id: "rancore", name: "Rancore", type: "archetipo", cost: 4, power: 5, rarity: "rara", text: "Debuff -1 globale.", flavor: "Un fuoco che brucia senza mai spegnersi.", effect: { kind: "weaken_enemy", amount: 1 }, art: "/cards/dolore_represso.png" },
  { id: "coraggio", name: "Coraggio", type: "archetipo", cost: 3, power: 4, rarity: "comune", text: "Senza paura.", flavor: "L'ultimo baluardo prima del buio.", effect: { kind: "none" }, art: "/cards/risveglio_se.png" },
  { id: "solitudine", name: "Solitudine", type: "archetipo", cost: 2, power: 4, rarity: "comune", text: "Solo nel vuoto.", flavor: "Un'isola in un mare di stelle morte.", effect: { kind: "none" }, art: "/cards/eco_dimenticato.png" },

  // Ricordi
  { id: "vecchia_chiave", name: "La Vecchia Chiave", type: "ricordo", cost: 1, power: 1, rarity: "comune", text: "Pesca 1 carta.", flavor: "Apre porte che avrei dovuto lasciare chiuse.", effect: { kind: "draw", amount: 1 }, art: "/cards/frammento_verita.png" },
  { id: "primo_volo", name: "Il Primo Volo", type: "ricordo", cost: 3, power: 5, rarity: "rara", text: "Sensazione di libertà.", flavor: "Prima che la gravità diventasse una legge.", effect: { kind: "none" }, art: "/cards/veglia_eterna.png" },
  { id: "giocattolo_rotto", name: "Giocattolo Rotto", type: "ricordo", cost: 2, power: 3, rarity: "comune", text: "Innocenza perduta.", flavor: "Le promesse infrante non si possono riparare.", effect: { kind: "none" }, art: "/cards/infanzia_perduta.png" },
  { id: "lettera_mai_letta", name: "Lettera Mai Letta", type: "ricordo", cost: 2, power: 2, rarity: "rara", text: "Pesca 2 carte.", flavor: "Certe verità dovrebbero restare sigillate.", effect: { kind: "draw", amount: 2 }, art: "/cards/ricordo_sfuggente.png" },
  { id: "bosco_incantato", name: "Il Bosco Incantato", type: "ricordo", cost: 4, power: 6, rarity: "epica", text: "+1 Potere globale.", flavor: "Tutto era magico, finché non abbiamo iniziato a capire.", effect: { kind: "buff_self", amount: 1 }, art: "/cards/radici_spezzate.png" },
  { id: "primo_bacio", name: "Il Primo Bacio", type: "ricordo", cost: 2, power: 3, rarity: "rara", text: "Cura 1 HP.", flavor: "Un lampo di elettricità in un oceano di sogni.", effect: { kind: "heal", amount: 1 }, art: "/cards/frammento_di_me.png" },
  { id: "tempesta_notturna", name: "Tempesta Notturna", type: "ricordo", cost: 5, power: 7, rarity: "epica", text: "Pesca 1 carta.", flavor: "Il cielo urlava la nostra rabbia.", effect: { kind: "draw", amount: 1 }, art: "/cards/sussurro_interiore.png" },
  { id: "giardino_segreto", name: "Giardino Segreto", type: "ricordo", cost: 3, power: 4, rarity: "rara", text: "Cura 2 HP.", flavor: "Un luogo dove il tempo non osa entrare.", effect: { kind: "heal", amount: 2 }, art: "/cards/catarsi.png" },
  { id: "nebbia_fitta", name: "Nebbia Fitta", type: "ricordo", cost: 2, power: 3, rarity: "comune", text: "Visione offuscata.", flavor: "Il passato si confonde con la paura.", effect: { kind: "none" }, art: "/cards/eco_dimenticato.png" },
  { id: "cenere_e_stelle", name: "Cenere e Stelle", type: "ricordo", cost: 6, power: 9, rarity: "leggendaria", text: "+2 Potere globale.", flavor: "Siamo polvere di stelle destinata a tornare cenere.", effect: { kind: "buff_self", amount: 2 }, art: "/cards/abisso_interiore.png" },

  // Maschere
  { id: "il_giullare", name: "Il Giullare", type: "maschera", cost: 2, power: 3, rarity: "comune", text: "Ridere per non piangere.", flavor: "Il pubblico non deve mai vedere la lacrima sotto il trucco.", effect: { kind: "none" }, art: "/cards/io_falso.png" },
  { id: "il_re_caduto", name: "Il Re Caduto", type: "maschera", cost: 5, power: 7, rarity: "epica", text: "Debuff -2 globale.", flavor: "La corona è pesante quando non c'è nessuno da governare.", effect: { kind: "weaken_enemy", amount: 2 }, art: "/cards/ombra_celata.png" },
  { id: "la_vittima", name: "La Vittima", type: "maschera", cost: 3, power: 4, rarity: "rara", text: "Cura 1 HP.", flavor: "Il dolore è l'unica cosa che mi fa sentire vivo.", effect: { kind: "heal", amount: 1 }, art: "/cards/maschera_dolore.png" },
  { id: "l_attore", name: "L'Attore", type: "maschera", cost: 4, power: 5, rarity: "epica", text: "+1 Potere globale.", flavor: "Quale vita sto recitando oggi?", effect: { kind: "buff_self", amount: 1 }, art: "/cards/specchio_distorto.png" },
  { id: "il_martire", name: "Il Martire", type: "maschera", cost: 6, power: 8, rarity: "leggendaria", text: "Debuff -2 globale.", flavor: "Il mio sacrificio sarà il vostro tormento.", effect: { kind: "weaken_enemy", amount: 2 }, art: "/cards/guardiano_silenzio.png" },
  { id: "il_giudice", name: "Il Giudice", type: "maschera", cost: 4, power: 6, rarity: "epica", text: "Sentenza finale.", flavor: "Non c'è appello contro la propria coscienza.", effect: { kind: "none" }, art: "/cards/ombra_celata.png" },
  { id: "il_bambino_eterno", name: "Il Bambino Eterno", type: "maschera", cost: 2, power: 2, rarity: "rara", text: "Cura 2 HP.", flavor: "Non voglio crescere in questo mondo di sogni infranti.", effect: { kind: "heal", amount: 2 }, art: "/cards/infanzia_perduta.png" },
  { id: "l_eremita", name: "L'Eremita", type: "maschera", cost: 3, power: 5, rarity: "comune", text: "Silenzio assoluto.", flavor: "La verità si trova lontano dal rumore degli altri.", effect: { kind: "none" }, art: "/cards/guardiano_silenzio.png" },
  { id: "il_mostro", name: "Il Mostro", type: "maschera", cost: 5, power: 8, rarity: "epica", text: "Paura pura.", flavor: "Siamo tutti il mostro nel sogno di qualcun altro.", effect: { kind: "none" }, art: "/cards/paura_primordiale.png" },
  { id: "la_morte_onirica", name: "Morte Onirica", type: "maschera", cost: 7, power: 12, rarity: "leggendaria", text: "Debuff -3 globale.", flavor: "La fine del viaggio è solo un altro risveglio.", effect: { kind: "weaken_enemy", amount: 3 }, art: "/cards/abisso_interiore.png" },
];

export const cardsById = Object.fromEntries(CARDS.map((c) => [c.id, c]));

export const TERRITORIES: { id: TerritoryId; name: string; rule: string; accent: string; icon: string }[] = [
  { id: "memoria", name: "Memoria d'Infanzia", rule: "Pesca 1 carta se controlli questo territorio.", accent: "var(--amber-eclipse)", icon: "🜂" },
  { id: "trauma", name: "Trauma Rimosso", rule: "Le carte giocate qui perdono -1 Potere.", accent: "var(--rose)", icon: "🜔" },
  { id: "sogno", name: "Sogno Lucido", rule: "Le tue carte hanno +1 Potere.", accent: "var(--azure)", icon: "🜄" },
];
