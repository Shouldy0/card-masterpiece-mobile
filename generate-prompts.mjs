import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const CARDS_PATH = resolve(__dirname, "src/game/cards.ts");
const OUTPUT_PATH = resolve(__dirname, "public/cards/prompts.md");

const cardsSource = readFileSync(CARDS_PATH, "utf-8");

const cardRegex =
  /\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*type:\s*"([^"]+)",[^}]*?rarity:\s*"([^"]+)",[^}]*?text:\s*"([^"]*)",[^}]*?flavor:\s*"([^"]*)",/gs;

const PALETTES = {
  archetipo: "deep purple, violet, magenta",
  ricordo: "golden amber, warm sepia, ancient gold",
  maschera: "crimson red, dark burgundy, bloody rose",
  oblio: "ice blue, cold cyan, frozen teal",
  sogno: "bright cyan, luminous aqua, dreamlike teal",
  eco: "emerald green, forest jade, vibrant viridian",
};

const ART_STYLE =
  "Dark fantasy card illustration, mystical cosmic horror, rich colors, intricate details, dramatic lighting, ethereal atmosphere, tarot card aesthetic";

const RARITY_MAP = {
  comune: "Comune",
  rara: "Rara",
  epica: "Epica",
  leggendaria: "Leggendaria",
};

const FACTION_NAMES = {
  archetipo: "Archetipo",
  ricordo: "Ricordo",
  maschera: "Maschera",
  oblio: "Oblio",
  sogno: "Sogno",
  eco: "Eco",
};

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function generatePrompt(card) {
  const palette = PALETTES[card.type];
  const faction = FACTION_NAMES[card.type];
  const rarity = RARITY_MAP[card.rarity];

  const prompts = {
    v1_ambizione: `A swirling gravitational singularity of deep purple energy at the center of a cosmic vortex, golden star fragments being pulled inward like moths to a violet flame, tendrils of magenta light reaching across the void --style raw --ar 3:4`,
    v2_ossessione: `A spiraling tunnel of distorted reality with countless watching eyes embedded in violet walls, a solitary figure trapped in an infinite regression of mirrors reflecting purple and magenta light --style raw --ar 3:4`,
    v3_nostalgia: `A translucent crystalline hourglass floating in violet mist, glowing golden memories swirling inside like captured fireflies, the glass cracking with magenta light seeping through --style raw --ar 3:4`,
    v4_apatia: `A figure made of grey ash seated on a throne of crumbling violet stone, face expressionless and hollow, embers dying in purple twilight air, everything fading to monochrome --style raw --ar 3:4`,
    v5_follia: `An impossible Escher-like staircase twisting through a purple nebula, geometric fractals of magenta and violet collapsing into each other, a lone silhouette falling upward through chaos --style raw --ar 3:4`,
    v6_empatia: `Two ethereal silhouettes connected by a pulsing cord of magenta light, their chests glowing with shared violet heartbeats, emotional ripples spreading through a dark purple dimension --style raw --ar 3:4`,
    v7_rancore: `A bonfire of violet thorns burning with eternal magenta flames, each thorn inscribed with a name, the smoke forming angry faces that dissolve into the purple-dark sky --style raw --ar 3:4`,
    v8_solitudine: `A single barren island floating in an endless void of dead stars, one violet flower blooming alone on cracked earth, surrounded by infinite cold purple darkness --style raw --ar 3:4`,
    v9_coraggio: `A lone knight in violet-etched armor standing before a crumbling gateway of magenta light, shielding smaller figures behind them, their shield glowing with defiant purple radiance --style raw --ar 3:4`,
    v10_armonia: `Two celestial spheres of violet and magenta orbiting each other in perfect sync, a bridge of pure white light connecting them, cosmic dust settling into peaceful golden patterns --style raw --ar 3:4`,

    o1_chiave_antica: `An ornate golden key floating in warm sepia light, intricate filigree patterns glowing with amber warmth, ancient doors receding into infinite golden corridors behind it --style raw --ar 3:4`,
    o2_bosco_sacro: `A cathedral-like forest of golden trees with amber leaves, shafts of warm sepia light piercing through the canopy, ancient roots forming sacred geometric patterns on the forest floor --style raw --ar 3:4`,
    o3_giocattolo: `A porcelain doll with cracked golden paint, one button eye dangling by a thread, sitting in sepia shadows surrounded by broken toys, warm amber dust motes floating in still air --style raw --ar 3:4`,
    o4_lettera: `An aged parchment letter sealed with golden wax, the envelope glowing with ancient amber light, shadows of reaching hands cast upon it, sepia-toned mystery in every fold --style raw --ar 3:4`,
    o5_cenere: `Golden stardust transforming into grey ash mid-fall, a cosmic figure dissolving into both, ancient gold light fighting against sepia darkness in an eternal dance of creation and decay --style raw --ar 3:4`,
    o6_giardino: `A walled garden bathed in eternal golden hour light, ancient amber roses climbing stone arches, a marble fountain flowing with liquid gold, time frozen in warm sepia serenity --style raw --ar 3:4`,
    o7_primo_volo: `A winged silhouette soaring upward through clouds of amber and gold, chains breaking apart below, feathers catching ancient sepia light, the weightlessness of first flight captured in warm tones --style raw --ar 3:4`,
    o8_tempesta: `A churning storm cloud of golden amber and sepia, lightning bolts of ancient gold illuminating a terrified face within the wind, debris swirling in a warm-toned maelstrom --style raw --ar 3:4`,
    o9_nebbia: `Thick rolling fog of golden amber swallowing an ancient city, street lamps glowing with sepia warmth through the haze, figures barely visible as shifting shadows in the mist --style raw --ar 3:4`,
    o10_anello: `A broken golden ring lying on sepia stone, the two halves separated by a crack of dark emptiness, ancient gold light trying in vain to bridge the gap, warm amber dust settling --style raw --ar 3:4`,

    c1_giullare: `A harlequin figure with a cracked porcelain mask of crimson, one painted smile hiding a bloody tear, dark burgundy stage curtains framing the performance, rose-colored spotlight from above --style raw --ar 3:4`,
    c2_re_caduto: `A fallen king in tattered crimson robes, crown askew and tilted, sitting on a shattered throne of dark burgundy stone, bloody roses wilting at his feet, regal despair in every shadow --style raw --ar 3:4`,
    c3_vittima: `A figure wrapped in blood-stained bandages, crimson light seeping through the wrappings, dark burgundy chains hanging from the ceiling, a single bloody rose offered to an unseen hand --style raw --ar 3:4`,
    c4_attore: `A figure holding up a drama mask split in two, one side crimson joy and one burgundy sorrow, stage lights of bloody rose illuminating a theater of infinite reflections --style raw --ar 3:4`,
    c5_martire: `A saint-like figure pierced by crimson thorns, dark burgundy flames consuming them from within, bloody rose petals falling like tears, their expression one of ecstatic sacrifice --style raw --ar 3:4`,
    c6_giudice: `A hooded judge in crimson robes holding scales of dark burgundy, one pan holding a bloody rose heart, the other an empty void, a gavel of bone raised in eternal judgment --style raw --ar 3:4`,
    c7_bambino: `A child-like figure with crimson-dusted cheeks holding a broken toy, dark burgundy shadows of adulthood looming behind, a bloody rose blooming from their innocent tears --style raw --ar 3:4`,
    c8_eremita: `A solitary figure in a crimson hooded cloak walking into a cave of dark burgundy crystal, a single bloody rose lighting the path, complete silence rendered in deep red tones --style raw --ar 3:4`,
    c9_mostro: `A towering silhouette of pure red shadow with too many limbs, bloody rose eyes opening across its body, dark burgundy mist writhing around it, the monster under every bed made manifest --style raw --ar 3:4`,
    c10_boia: `A hooded executioner wielding an axe of dark burgundy crystal, crimson blood dripping from the blade, a bloody rose crown floating above a severed shadow, judgment rendered in red --style raw --ar 3:4`,

    b1_vuoto: `An infinite white void within a frame of ice blue crystal, nothingness staring back with cold cyan eyes, frozen teal light bending into an empty, silent abyss --style raw --ar 3:4`,
    b2_silenzio: `A figure with ice blue lips sewn shut, sound waves freezing mid-air into cold cyan crystal, frozen teal snow falling in absolute quiet, a finger pressed to where a mouth should be --style raw --ar 3:4`,
    b3_oblio: `A floating figure dissolving into ice blue particles, memories fragmenting like cold cyan glass, a frozen teal clock face melting, the question of identity lost in glacial mist --style raw --ar 3:4`,
    b4_neve: `Endless snowfall of ice blue crystals, each flake containing a frozen memory, a lone figure buried up to their chest in cold cyan drifts, frozen teal sky stretching to an infinite horizon --style raw --ar 3:4`,
    b5_cenere_blu: `Ashes of ice blue floating over a dead frozen city, cold cyan embers rising from ruins, frozen teal smoke curling like ghostly fingers, the remains of hope crystallized in cold --style raw --ar 3:4`,
    b6_abisso: `A vertical descent into ice blue nothingness, cold cyan light fading to absolute black below, frozen teal creatures with too many eyes swimming in the depths, the abyss staring back --style raw --ar 3:4`,
    b7_pioggia: `Icy rain of cold cyan falling from a frozen teal sky, each drop a forgotten tear, a figure with upturned face catching ice blue droplets, puddles reflecting a melancholy frozen world --style raw --ar 3:4`,
    b8_fantasma: `A translucent specter of ice blue light, barely visible against cold cyan mist, frozen teal chains trailing where limbs should be, an echo that lost its voice in the frozen waste --style raw --ar 3:4`,
    b9_rovine: `Crumbling pillars of ice blue stone, frozen teal vines cracking through cold cyan masonry, an ancient temple collapsing into glacial fog, structural decay rendered in arctic tones --style raw --ar 3:4`,
    b10_ghiaccio: `A human heart encased in crystalline ice blue, cold cyan frost spreading across the surface, frozen teal veins visible within, emotional numbness preserving pain in eternal ice --style raw --ar 3:4`,

    s1_miraggio: `A shimmering city of bright cyan rising from desert sands, luminous aqua towers warping reality itself, dreamlike teal heat waves distorting the horizon, beauty that vanishes on approach --style raw --ar 3:4`,
    s2_aurora: `Curtains of bright cyan light dancing across a dark sky, luminous aqua waves of energy cascading downward, a sleeping figure bathed in dreamlike teal glow, the promise of dawn eternally deferred --style raw --ar 3:4`,
    s3_nuvola: `A billowing cloud of bright cyan cotton floating above a teal abyss, luminous aqua light filtering through its dreamlike layers, a sleeping figure drifting within the soft mist --style raw --ar 3:4`,
    s4_visione: `A third eye of pure bright cyan opening on a forehead, luminous aqua visions spilling out like liquid light, dreamlike teal timelines branching into infinite possible futures --style raw --ar 3:4`,
    s5_stella: `A single bright cyan star streaking across a dreaming sky, luminous aqua trailing light, a hand reaching up desperately, the moment of brilliance before eternal fade in dreamlike teal --style raw --ar 3:4`,
    s6_labirinto: `Walls of bright cyan light forming an impossible maze, luminous aqua pathways that loop back on themselves, a tiny figure lost in dreamlike teal corridors, no exit in sight --style raw --ar 3:4`,
    s7_farfalla: `A butterfly with wings of bright cyan and luminous aqua, each wingbeat rippling the fabric of reality, dreamlike teal shockwaves spreading through a sleeping mind --style raw --ar 3:4`,
    s8_castello: `A floating castle of bright cyan crystal and luminous aqua light, towers reaching into a dreamlike teal sky, foundations of pure hope holding the impossible structure aloft --style raw --ar 3:4`,
    s9_rugiada: `Dewdrops of bright cyan light on a spiderweb, each droplet a pure moment, luminous aqua reflections of a new dawn, dreamlike teal morning stillness captured in perfect clarity --style raw --ar 3:4`,
    s10_infinito: `An infinite spiral of bright cyan light containing all of existence, luminous aqua galaxies swirling inward, a figure transcending at the center surrounded by dreamlike teal eternity --style raw --ar 3:4`,

    e1_radice: `Massive roots of emerald green plunging into dark earth, glowing jade veins pulsing with ancient life, vibrant viridian tendrils wrapping around fossilized memories below the surface --style raw --ar 3:4`,
    e2_germoglio: `A tiny sprout of brilliant emerald green emerging from cracked obsidian, forest jade light radiating from the first leaf, vibrant viridian energy patterns spreading like a slow explosion --style raw --ar 3:4`,
    e3_foresta: `An ancient forest where emerald green trees have silver bark, forest jade light filtering through a canopy of whispers, vibrant viridian echoes of past voices materializing between the trunks --style raw --ar 3:4`,
    e4_pioggia_smeraldo: `Falling drops of liquid emerald green from a jade sky, each droplet cleansing a psychic wound, vibrant viridian rivers forming on the ground, a baptism of pure green light --style raw --ar 3:4`,
    e5_ciclo: `An ouroboros of emerald green, forest jade and vibrant viridian forming infinity, seasons cycling through a single frame, death and rebirth in an eternal green spiral --style raw --ar 3:4`,
    e6_quercia: `A colossal oak of emerald green with roots spanning dimensions, its trunk carved with faces of ancient thinkers, forest jade leaves holding the wisdom of millennia in vibrant viridian --style raw --ar 3:4`,
    e7_muschio: `Soft carpet of emerald green moss covering ancient ruins, forest jade velvet absorbing all sound, vibrant viridian patches glowing in darkness, nature's perfect silent camouflage --style raw --ar 3:4`,
    e8_vento: `Invisible currents of emerald green wind sweeping through a valley, forest jade leaves carried aloft like thoughts, a figure releasing their burdens into the vibrant viridian gale --style raw --ar 3:4`,
    e9_pietra: `A floating philosopher's stone of emerald green crystal, forest jade runes inscribed on its facets, vibrant viridian alchemical light transmuting shadows into gold, eternal wisdom crystallized --style raw --ar 3:4`,
    e10_eternita: `An emerald green clockface with no hands, time frozen in a single perfect moment, forest jade light shining in all directions at once, vibrant viridian stillness where everything makes sense --style raw --ar 3:4`,
  };

  return (
    prompts[card.id] ||
    `${card.name}, ${faction} card, ${palette} color scheme, ${ART_STYLE} --style raw --ar 3:4`
  );
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/_$/, "");
}

const cards = [];
let match;
while ((match = cardRegex.exec(cardsSource)) !== null) {
  cards.push({
    id: match[1],
    name: match[2],
    type: match[3],
    rarity: match[4],
    text: match[5],
    flavor: match[6],
  });
}

const lines = ["# Card Art Prompts for AI Generation\n"];

for (const card of cards) {
  const prompt = generatePrompt(card);
  const faction = FACTION_NAMES[card.type];
  const rarity = RARITY_MAP[card.rarity];
  const flavorLine = card.flavor ? `*"${card.flavor}"*` : "";

  lines.push(`## ${card.id} — ${card.name} (${faction}, ${rarity})`);
  if (flavorLine) lines.push(flavorLine);
  lines.push(``);
  lines.push(`${prompt}`);
  lines.push(``);
}

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, lines.join("\n"), "utf-8");

console.log(`Generated ${cards.length} prompts to public/cards/prompts.md`);
