export type CardType = "archetipo" | "ricordo" | "maschera" | "oblio" | "sogno" | "eco";
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
  // --- FAZIONE: ARCHETIPO (VIOLA - PSICHE PROFONDA) ---
  { 
    id: "v1_ambizione", 
    name: "Ambizione", 
    type: "archetipo", 
    cost: 5, 
    power: 8, 
    rarity: "leggendaria", 
    text: "Attira a sé le risorse vicine, potenziando la propria energia per ogni frammento stellare raccolto.", 
    flavor: "Voglio tutto, anche se il prezzo è la mia anima.", 
    effect: { kind: "buff_self", amount: 2 }, 
    art: "/cards/ambizione.png?v=3" 
  },
  { 
    id: "v2_ossessione", 
    name: "Ossessione", 
    type: "archetipo", 
    cost: 4, 
    power: 6, 
    rarity: "epica", 
    text: "Rivela le intenzioni nascoste dell'avversario, distorcendo la sua percezione della realtà.", 
    flavor: "Un pensiero che si nutre di te finché non resta altro.", 
    effect: { kind: "weaken_enemy", amount: 1 }, 
    art: "/cards/ossessione.png?v=3" 
  },
  { 
    id: "v3_nostalgia", 
    name: "Nostalgia", 
    type: "archetipo", 
    cost: 2, 
    power: 3, 
    rarity: "rara", 
    text: "Evoca un ricordo dal passato, permettendo di recuperare una risorsa perduta nel vuoto.", 
    flavor: "Un passato che brilla più del presente.", 
    effect: { kind: "draw", amount: 1 }, 
    art: "/cards/nostalgia.png?v=3" 
  },
  { 
    id: "v4_apatia", 
    name: "Apatia", 
    type: "archetipo", 
    cost: 3, 
    power: 5, 
    rarity: "comune", 
    text: "Immobilizza una minaccia nemica, rendendola inerte come cenere sotto un sole morente.", 
    flavor: "Nulla fa più male, nulla fa più bene.", 
    effect: { kind: "none" }, 
    art: "/cards/apatia.png?v=3" 
  },
  { 
    id: "v5_follia", 
    name: "Follia", 
    type: "archetipo", 
    cost: 6, 
    power: 10, 
    rarity: "leggendaria", 
    text: "Scatena un vortice di caos che spezza le difese nemiche attraverso geometrie impossibili.", 
    flavor: "La verità è un cerchio che non si chiude mai.", 
    effect: { kind: "buff_self", amount: 3 }, 
    art: "/cards/follia.png?v=3" 
  },
  { 
    id: "v6_empatia", 
    name: "Empatia", 
    type: "archetipo", 
    cost: 3, 
    power: 3, 
    rarity: "rara", 
    text: "Crea un riverbero emotivo che guarisce la tua coscienza per ogni carta Archetipo in gioco.", 
    flavor: "Sento il tuo peso come se fosse il mio.", 
    effect: { kind: "heal", amount: 2 }, 
    art: "/cards/empatia.png?v=3" 
  },
  { 
    id: "v7_rancore", 
    name: "Rancore", 
    type: "archetipo", 
    cost: 4, 
    power: 5, 
    rarity: "rara", 
    text: "Infligge un'eco di dolore che riduce il Potere di tutte le carte nemiche in questo territorio.", 
    flavor: "Un fuoco che brucia senza mai spegnersi.", 
    effect: { kind: "weaken_enemy", amount: 1 }, 
    art: "/cards/rancore.png?v=3" 
  },
  { 
    id: "v8_solitudine", 
    name: "Solitudine", 
    type: "archetipo", 
    cost: 2, 
    power: 6, 
    rarity: "comune", 
    text: "Guadagna +3 Potere se è l'unica tua carta in questo territorio.", 
    flavor: "Un'isola in un mare di stelle morte.", 
    effect: { kind: "none" }, 
    art: "/cards/solitudine.png?v=3" 
  },
  { 
    id: "v9_coraggio", 
    name: "Coraggio", 
    type: "archetipo", 
    cost: 3, 
    power: 4, 
    rarity: "comune", 
    text: "Protegge le tue carte adiacenti dalla riduzione di Potere.", 
    flavor: "L'ultimo baluardo prima del buio assoluto.", 
    effect: { kind: "none" }, 
    art: "/cards/coraggio.png?v=3" 
  },
  { 
    id: "v10_armonia", 
    name: "Armonia", 
    type: "archetipo", 
    cost: 4, 
    power: 4, 
    rarity: "leggendaria", 
    text: "Sincronizza le tue risorse: pesca 1 carta e cura 2 HP.", 
    flavor: "Il silenzio perfetto tra due battiti del cuore.", 
    effect: { kind: "draw", amount: 1 }, 
    art: "/cards/armonia.png?v=3" 
  },

  // --- FAZIONE: RICORDO (ORO - FRAMMENTI SACRI) ---
  { id: "o1_chiave_antica", name: "Chiave Antica", type: "ricordo", cost: 1, power: 1, rarity: "comune", text: "Pesca 1 carta.", flavor: "Apre porte che avrei dovuto lasciare chiuse.", effect: { kind: "draw", amount: 1 }, art: "/cards/chiave_antica.png?v=3" },
  { id: "o2_bosco_sacro", name: "Bosco Sacro", type: "ricordo", cost: 4, power: 6, rarity: "epica", text: "+1 Potere globale.", flavor: "Tutto era magico, finché non abbiamo iniziato a capire.", effect: { kind: "buff_self", amount: 1 }, art: "/cards/bosco_sacro.png?v=3" },
  { id: "o3_giocattolo", name: "Giocattolo Rotto", type: "ricordo", cost: 2, power: 3, rarity: "comune", text: "Innocenza perduta.", flavor: "Le promesse infrante non si possono riparare.", effect: { kind: "none" }, art: "/cards/giocattolo_rotto.png?v=3" },
  { id: "o4_lettera", name: "Lettera Sigillata", type: "ricordo", cost: 2, power: 2, rarity: "rara", text: "Pesca 2 carte.", flavor: "Certe verità dovrebbero restare nel buio.", effect: { kind: "draw", amount: 2 }, art: "/cards/lettera_sigillata.png?v=3" },
  { id: "o5_cenere", name: "Cenere e Stelle", type: "ricordo", cost: 6, power: 9, rarity: "leggendaria", text: "+2 Potere globale.", flavor: "Siamo polvere di stelle destinata a tornare cenere.", effect: { kind: "buff_self", amount: 2 }, art: "/cards/cenere_e_stelle.png?v=3" },
  { id: "o6_giardino", name: "Giardino Segreto", type: "ricordo", cost: 3, power: 4, rarity: "rara", text: "Cura 2 HP.", flavor: "Un luogo dove il tempo non osa entrare.", effect: { kind: "heal", amount: 2 }, art: "/cards/giardino_segreto.png?v=3" },
  { id: "o7_primo_volo", name: "Primo Volo", type: "ricordo", cost: 3, power: 5, rarity: "rara", text: "Libertà eterea.", flavor: "Prima che la gravità diventasse una legge crudele.", effect: { kind: "none" }, art: "/cards/primo_volo.png?v=3" },
  { id: "o8_tempesta", name: "Tempesta", type: "ricordo", cost: 5, power: 7, rarity: "epica", text: "Pesca 1 carta.", flavor: "Il cielo urlava la nostra rabbia repressa.", effect: { kind: "draw", amount: 1 }, art: "/cards/tempesta_ricordo.png?v=3" },
  { id: "o9_nebbia", name: "Nebbia d'Oro", type: "ricordo", cost: 2, power: 3, rarity: "comune", text: "Visione offuscata.", flavor: "Il passato si confonde con la bellezza del trauma.", effect: { kind: "none" }, art: "/cards/nebbia_oro.png?v=3" },
  { id: "o10_anello", name: "L'Anello Spezzato", type: "ricordo", cost: 2, power: 4, rarity: "rara", text: "Legame infranto.", flavor: "Un cerchio che non protegge più nulla.", effect: { kind: "none" }, art: "/cards/anello_spezzato.png?v=3" },

  // --- FAZIONE: MASCHERA (CREMISI - DIFESA SOCIALE) ---
  { id: "c1_giullare", name: "Il Giullare", type: "maschera", cost: 2, power: 3, rarity: "comune", text: "Ridere per non urlare.", flavor: "Il pubblico non deve mai vedere la lacrima sotto il trucco.", effect: { kind: "none" }, art: "/cards/giullare.png?v=3" },
  { id: "c2_re_caduto", name: "Il Re Caduto", type: "maschera", cost: 5, power: 7, rarity: "epica", text: "Riduce costi.", flavor: "Una corona di spine pesa più di una d'oro.", effect: { kind: "none" }, art: "/cards/re_caduto.png?v=3" },
  { id: "c3_vittima", name: "La Vittima", type: "maschera", cost: 1, power: 2, rarity: "comune", text: "Sacrificio.", flavor: "Il dolore è l'unica cosa che mi fa sentire vivo.", effect: { kind: "none" }, art: "/cards/vittima.png?v=3" },
  { id: "c4_attore", name: "L'Attore", type: "maschera", cost: 3, power: 4, rarity: "rara", text: "Copia abilità.", flavor: "Posso essere chiunque, tranne me stesso.", effect: { kind: "none" }, art: "/cards/attore.png?v=3" },
  { id: "c5_martire", name: "Il Martire", type: "maschera", cost: 4, power: 5, rarity: "rara", text: "Cura 2 HP.", flavor: "Il mio sangue nutre la speranza degli altri.", effect: { kind: "heal", amount: 2 }, art: "/cards/martire.png?v=3" },
  { id: "c6_giudice", name: "Il Giudice", type: "maschera", cost: 4, power: 6, rarity: "epica", text: "Equilibrio.", flavor: "La giustizia è una bilancia che pende sempre dal lato del vuoto.", effect: { kind: "none" }, art: "/cards/giudice.png?v=3" },
  { id: "c7_bambino", name: "Bambino Eterno", type: "maschera", cost: 2, power: 2, rarity: "rara", text: "Pesca 1 carta.", flavor: "L'innocenza è una maschera che non invecchia mai.", effect: { kind: "draw", amount: 1 }, art: "/cards/bambino_eterno.png?v=3" },
  { id: "c8_eremita", name: "L'Eremita", type: "maschera", cost: 3, power: 5, rarity: "comune", text: "Isolamento.", flavor: "Nel silenzio della maschera, trovo la mia verità.", effect: { kind: "none" }, art: "/cards/eremita.png?v=3" },
  { id: "c9_mostro", name: "Il Mostro", type: "maschera", cost: 5, power: 8, rarity: "rara", text: "Paura.", flavor: "Tutti abbiamo un mostro che indossa un volto umano.", effect: { kind: "none" }, art: "/cards/mostro.png?v=3" },
  { id: "c10_boia", name: "Il Boia", type: "maschera", cost: 6, power: 9, rarity: "leggendaria", text: "Taglia il potere -3.", flavor: "La fine del viaggio è solo un altro colpo di scure.", effect: { kind: "weaken_enemy", amount: 3 }, art: "/cards/boia.png?v=3" },

  // --- FAZIONE: OBLIO (BLU FREDDO - VUOTO E PERDITA) ---
  { id: "b1_vuoto", name: "Il Vuoto", type: "oblio", cost: 4, power: 5, rarity: "rara", text: "Annulla effetti.", flavor: "Non c'è nulla qui, nemmeno il dolore.", effect: { kind: "none" }, art: "/cards/vuoto.png?v=3" },
  { id: "b2_silenzio", name: "Silenzio", type: "oblio", cost: 2, power: 3, rarity: "comune", text: "Senza voce.", flavor: "Il rumore del mondo è solo un ricordo lontano.", effect: { kind: "none" }, art: "/cards/silenzio.png?v=3" },
  { id: "b3_oblio", name: "Oblio", type: "oblio", cost: 6, power: 8, rarity: "leggendaria", text: "Rimuovi 1 carta.", flavor: "Chi eri prima che il tempo ti mangiasse?", effect: { kind: "none" }, art: "/cards/oblio.png?v=3" },
  { id: "b4_neve", name: "Neve Eterna", type: "oblio", cost: 3, power: 4, rarity: "comune", text: "Freddo intenso.", flavor: "Ogni fiocco è un ricordo che si gela.", effect: { kind: "none" }, art: "/cards/neve_eterna.png?v=3" },
  { id: "b5_cenere_blu", name: "Cenere Blu", type: "oblio", cost: 5, power: 7, rarity: "epica", text: "Debuff -2.", flavor: "Ciò che resta dopo che la speranza si è spenta.", effect: { kind: "weaken_enemy", amount: 2 }, art: "/cards/cenere_blu.png?v=3" },
  { id: "b6_abisso", name: "L'Abisso", type: "oblio", cost: 7, power: 11, rarity: "leggendaria", text: "Potere puro.", flavor: "L'oscurità è l'unica casa che ci accetta sempre.", effect: { kind: "none" }, art: "/cards/abisso.png?v=3" },
  { id: "b7_pioggia", name: "Pioggia Fredda", type: "oblio", cost: 2, power: 2, rarity: "comune", text: "Pesca 1 carta.", flavor: "Lacrime dal cielo di un mondo dimenticato.", effect: { kind: "draw", amount: 1 }, art: "/cards/pioggia_fredda.png?v=3" },
  { id: "b8_fantasma", name: "Il Fantasma", type: "oblio", cost: 3, power: 4, rarity: "rara", text: "Invisibile.", flavor: "Un'eco che ha smesso di cercare una voce.", effect: { kind: "none" }, art: "/cards/fantasma.png?v=3" },
  { id: "b9_rovine", name: "Rovine", type: "oblio", cost: 4, power: 6, rarity: "rara", text: "Struttura fragile.", flavor: "Le fondamenta della mente stanno crollando.", effect: { kind: "none" }, art: "/cards/rovine.png?v=3" },
  { id: "b10_ghiaccio", name: "Cuore di Ghiaccio", type: "oblio", cost: 5, power: 6, rarity: "epica", text: "Cura 3 HP.", flavor: "Congela il dolore per non sentirlo più.", effect: { kind: "heal", amount: 3 }, art: "/cards/cuore_ghiaccio.png?v=3" },

  // --- FAZIONE: SOGNO (CIANO - ILLUSIONE e SPERANZA) ---
  { id: "s1_miraggio", name: "Miraggio", type: "sogno", cost: 2, power: 2, rarity: "comune", text: "Illusione ottica.", flavor: "Bello da vedere, impossibile da toccare.", effect: { kind: "none" }, art: "/cards/miraggio.png?v=3" },
  { id: "s2_aurora", name: "Aurora", type: "sogno", cost: 3, power: 4, rarity: "rara", text: "Luce nascente.", flavor: "La promessa di un risveglio che non arriva mai.", effect: { kind: "none" }, art: "/cards/aurora.png?v=3" },
  { id: "s3_nuvola", name: "Nuvola di Sogni", type: "sogno", cost: 2, power: 3, rarity: "comune", text: "Leggerezza.", flavor: "Fluttuare sopra l'abisso del reale.", effect: { kind: "none" }, art: "/cards/nuvola_sogni.png?v=3" },
  { id: "s4_visione", name: "Visione Eterea", type: "sogno", cost: 5, power: 7, rarity: "epica", text: "Pesca 2 carte.", flavor: "Vedere attraverso il velo del tempo.", effect: { kind: "draw", amount: 2 }, art: "/cards/visione_eterea.png?v=3" },
  { id: "s5_stella", name: "Stella Cadente", type: "sogno", cost: 1, power: 2, rarity: "comune", text: "Un desiderio.", flavor: "Brilla intensamente prima di spegnersi per sempre.", effect: { kind: "none" }, art: "/cards/stella_cadente.png?v=3" },
  { id: "s6_isole", name: "Isole Sospese", type: "sogno", cost: 4, power: 5, rarity: "rara", text: "Gravità zero.", flavor: "Dove il pensiero è l'unico peso consentito.", effect: { kind: "none" }, art: "/cards/isole_sospese.png?v=3" },
  { id: "s7_farfalla", name: "Farfalla di Luce", type: "sogno", cost: 2, power: 3, rarity: "rara", text: "Cura 1 HP.", flavor: "Un battito d'ali che sposta le nuvole della mente.", effect: { kind: "heal", amount: 1 }, art: "/cards/farfalla_luce.png?v=3" },
  { id: "s8_arcobaleno", name: "Arcobaleno Notturno", type: "sogno", cost: 3, power: 4, rarity: "rara", text: "Speranza.", flavor: "Anche nel buio più profondo, i colori trovano una via.", effect: { kind: "none" }, art: "/cards/arcobaleno_notturno.png?v=3" },
  { id: "s9_citta", name: "Città Invisibile", type: "sogno", cost: 6, power: 8, rarity: "epica", text: "Rifugio onirico.", flavor: "Costruita con i mattoni di ciò che avremmo voluto essere.", effect: { kind: "none" }, art: "/cards/citta_invisibile.png?v=3" },
  { id: "s10_risveglio", name: "L'Ultimo Risveglio", type: "sogno", cost: 5, power: 6, rarity: "leggendaria", text: "Pesca 1 e Cura 2.", flavor: "Quando il sogno finisce, inizia la vera battaglia.", effect: { kind: "draw", amount: 1 }, art: "/cards/ultimo_risveglio.png?v=3" },

  // --- FAZIONE: ECO (SMERALDO - NATURA E TEMPO) ---
  { id: "e1_radice", name: "Radice Profonda", type: "eco", cost: 2, power: 3, rarity: "comune", text: "Stabilità.", flavor: "Le fondamenta della mente sono vive.", effect: { kind: "none" }, art: "/cards/radice_eco.png?v=3" },
  { id: "e2_germoglio", name: "Germoglio", type: "eco", cost: 1, power: 1, rarity: "comune", text: "Crescita.", flavor: "Ogni grande idea inizia con un piccolo respiro.", effect: { kind: "none" }, art: "/cards/germoglio_eco.png?v=3" },
  { id: "e3_foresta", name: "Foresta di Echi", type: "eco", cost: 5, power: 7, rarity: "epica", text: "+1 Potere.", flavor: "Le voci del passato risuonano tra le foglie d'argento.", effect: { kind: "buff_self", amount: 1 }, art: "/cards/foresta_eco.png?v=3" },
  { id: "e4_pioggia_smeraldo", name: "Pioggia Smeraldo", type: "eco", cost: 3, power: 4, rarity: "rara", text: "Cura 2 HP.", flavor: "Un lavaggio purificatore per la coscienza stanca.", effect: { kind: "heal", amount: 2 }, art: "/cards/pioggia_smeraldo.png?v=3" },
  { id: "e5_ciclo", name: "Il Ciclo", type: "eco", cost: 4, power: 6, rarity: "epica", text: "Pesca 1 carta.", flavor: "Ciò che è stato, sarà ancora.", effect: { kind: "draw", amount: 1 }, art: "/cards/giardino_ciclo.png?v=3" },
  { id: "e6_quercia", name: "Quercia Antica", type: "eco", cost: 6, power: 10, rarity: "leggendaria", text: "Immortale.", flavor: "Ho visto imperi mentali sorgere e cadere.", effect: { kind: "none" }, art: "/cards/quercia_antica.png?v=3" },
  { id: "e7_muschio", name: "Muschio Morbido", type: "eco", cost: 2, power: 2, rarity: "comune", text: "Protezione.", flavor: "Il silenzio della natura è una maschera perfetta.", effect: { kind: "none" }, art: "/cards/muschio_morbido.png?v=3" },
  { id: "e8_vento", name: "Vento del Nord", type: "eco", cost: 3, power: 5, rarity: "rara", text: "Spostamento.", flavor: "Porta via i pensieri pesanti.", effect: { kind: "none" }, art: "/cards/vento_nord.png?v=3" },
  { id: "e9_pietra", name: "Pietra Filosofale", type: "eco", cost: 7, power: 12, rarity: "leggendaria", text: "Alchimia.", flavor: "Trasformare il dolore in saggezza pura.", effect: { kind: "none" }, art: "/cards/pietra_filosofale.png?v=3" },
  { id: "e10_eternita", name: "Eternità", type: "eco", cost: 8, power: 18, rarity: "leggendaria", text: "Fine del tempo.", flavor: "Il momento in cui tutto si ferma e tutto ha senso.", effect: { kind: "none" }, art: "/cards/eternita_eco.png?v=3" },
];

export const cardsById = Object.fromEntries(CARDS.map((c) => [c.id, c]));

export const TERRITORIES: { id: TerritoryId; name: string; rule: string; accent: string; icon: string }[] = [
  { id: "memoria", name: "Memoria d'Infanzia", rule: "Pesca 1 carta se controlli questo territorio.", accent: "var(--amber-eclipse)", icon: "🜂" },
  { id: "trauma", name: "Trauma Rimosso", rule: "Le carte giocate qui perdono -1 Potere.", accent: "var(--rose)", icon: "🜔" },
  { id: "sogno", name: "Sogno Lucido", rule: "Le tue carte hanno +1 Potere.", accent: "var(--azure)", icon: "🜄" },
];
