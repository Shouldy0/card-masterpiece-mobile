import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "public/cards");

const CARDS = [
  { id: "v1_ambizione",    name: "Ambizione",          type: "archetipo", cost: 5, power: 8,  rarity: "leggendaria" },
  { id: "v2_ossessione",   name: "Ossessione",         type: "archetipo", cost: 4, power: 6,  rarity: "epica" },
  { id: "v3_nostalgia",    name: "Nostalgia",          type: "archetipo", cost: 2, power: 3,  rarity: "rara" },
  { id: "v4_apatia",       name: "Apatia",             type: "archetipo", cost: 3, power: 5,  rarity: "comune" },
  { id: "v5_follia",       name: "Follia",             type: "archetipo", cost: 6, power: 10, rarity: "leggendaria" },
  { id: "v6_empatia",      name: "Empatia",            type: "archetipo", cost: 3, power: 3,  rarity: "rara" },
  { id: "v7_rancore",      name: "Rancore",            type: "archetipo", cost: 4, power: 5,  rarity: "rara" },
  { id: "v8_solitudine",   name: "Solitudine",         type: "archetipo", cost: 2, power: 6,  rarity: "comune" },
  { id: "v9_coraggio",     name: "Coraggio",           type: "archetipo", cost: 3, power: 4,  rarity: "comune" },
  { id: "v10_armonia",     name: "Armonia",            type: "archetipo", cost: 4, power: 4,  rarity: "leggendaria" },
  { id: "o1_chiave_antica",name: "Chiave Antica",      type: "ricordo",   cost: 1, power: 1,  rarity: "comune" },
  { id: "o2_bosco_sacro",  name: "Bosco Sacro",        type: "ricordo",   cost: 4, power: 6,  rarity: "epica" },
  { id: "o3_giocattolo",   name: "Giocattolo Rotto",    type: "ricordo",   cost: 2, power: 3,  rarity: "comune" },
  { id: "o4_lettera",      name: "Lettera Sigillata",   type: "ricordo",   cost: 2, power: 2,  rarity: "rara" },
  { id: "o5_cenere",       name: "Cenere e Stelle",    type: "ricordo",   cost: 6, power: 9,  rarity: "leggendaria" },
  { id: "o6_giardino",     name: "Giardino Segreto",    type: "ricordo",   cost: 3, power: 4,  rarity: "rara" },
  { id: "o7_primo_volo",   name: "Primo Volo",         type: "ricordo",   cost: 3, power: 5,  rarity: "rara" },
  { id: "o8_tempesta",     name: "Tempesta",           type: "ricordo",   cost: 5, power: 7,  rarity: "epica" },
  { id: "o9_nebbia",       name: "Nebbia d'Oro",       type: "ricordo",   cost: 2, power: 3,  rarity: "comune" },
  { id: "o10_anello",      name: "L'Anello Spezzato",   type: "ricordo",   cost: 2, power: 4,  rarity: "rara" },
  { id: "c1_giullare",     name: "Il Giullare",        type: "maschera",  cost: 2, power: 3,  rarity: "comune" },
  { id: "c2_re_caduto",    name: "Il Re Caduto",       type: "maschera",  cost: 5, power: 7,  rarity: "epica" },
  { id: "c3_vittima",      name: "La Vittima",         type: "maschera",  cost: 3, power: 4,  rarity: "rara" },
  { id: "c4_attore",       name: "L'Attore",           type: "maschera",  cost: 4, power: 5,  rarity: "epica" },
  { id: "c5_martire",      name: "Il Martire",         type: "maschera",  cost: 6, power: 8,  rarity: "leggendaria" },
  { id: "c6_giudice",      name: "Il Giudice",         type: "maschera",  cost: 4, power: 6,  rarity: "epica" },
  { id: "c7_bambino",      name: "Bambino Eterno",     type: "maschera",  cost: 2, power: 2,  rarity: "rara" },
  { id: "c8_eremita",      name: "L'Eremita",          type: "maschera",  cost: 3, power: 5,  rarity: "comune" },
  { id: "c9_mostro",       name: "Il Mostro",          type: "maschera",  cost: 5, power: 8,  rarity: "epica" },
  { id: "c10_boia",        name: "Il Boia",            type: "maschera",  cost: 6, power: 9,  rarity: "leggendaria" },
  { id: "b1_vuoto",        name: "Il Vuoto",           type: "oblio",     cost: 4, power: 5,  rarity: "rara" },
  { id: "b2_silenzio",     name: "Silenzio",           type: "oblio",     cost: 2, power: 3,  rarity: "comune" },
  { id: "b3_oblio",        name: "Oblio",              type: "oblio",     cost: 6, power: 8,  rarity: "leggendaria" },
  { id: "b4_neve",         name: "Neve Eterna",        type: "oblio",     cost: 3, power: 4,  rarity: "comune" },
  { id: "b5_cenere_blu",   name: "Cenere Blu",         type: "oblio",     cost: 5, power: 7,  rarity: "epica" },
  { id: "b6_abisso",       name: "L'Abisso",           type: "oblio",     cost: 7, power: 11, rarity: "leggendaria" },
  { id: "b7_pioggia",      name: "Pioggia Fredda",     type: "oblio",     cost: 2, power: 2,  rarity: "comune" },
  { id: "b8_fantasma",     name: "Il Fantasma",        type: "oblio",     cost: 3, power: 4,  rarity: "rara" },
  { id: "b9_rovine",       name: "Rovine",             type: "oblio",     cost: 4, power: 6,  rarity: "rara" },
  { id: "b10_ghiaccio",    name: "Cuore di Ghiaccio",   type: "oblio",     cost: 5, power: 6,  rarity: "epica" },
  { id: "s1_miraggio",     name: "Miraggio",           type: "sogno",     cost: 2, power: 2,  rarity: "comune" },
  { id: "s2_aurora",       name: "Aurora",             type: "sogno",     cost: 3, power: 4,  rarity: "rara" },
  { id: "s3_nuvola",       name: "Nuvola di Sogni",    type: "sogno",     cost: 2, power: 3,  rarity: "comune" },
  { id: "s4_visione",      name: "Visione Eterea",     type: "sogno",     cost: 5, power: 7,  rarity: "epica" },
  { id: "s5_stella",       name: "Stella Cadente",     type: "sogno",     cost: 1, power: 2,  rarity: "comune" },
  { id: "s6_labirinto",    name: "Il Labirinto",       type: "sogno",     cost: 4, power: 5,  rarity: "rara" },
  { id: "s7_farfalla",     name: "Farfalla Psichica",  type: "sogno",     cost: 3, power: 3,  rarity: "rara" },
  { id: "s8_castello",     name: "Castello d'Aria",    type: "sogno",     cost: 6, power: 9,  rarity: "leggendaria" },
  { id: "s9_rugiada",      name: "Rugiada",            type: "sogno",     cost: 2, power: 2,  rarity: "comune" },
  { id: "s10_infinito",    name: "L'Infinito",         type: "sogno",     cost: 8, power: 15, rarity: "leggendaria" },
  { id: "e1_radice",       name: "Radice Profonda",    type: "eco",       cost: 2, power: 3,  rarity: "comune" },
  { id: "e2_germoglio",    name: "Germoglio",          type: "eco",       cost: 1, power: 1,  rarity: "comune" },
  { id: "e3_foresta",      name: "Foresta di Echi",    type: "eco",       cost: 5, power: 7,  rarity: "epica" },
  { id: "e4_pioggia_smeraldo", name: "Pioggia Smeraldo", type: "eco",    cost: 3, power: 4,  rarity: "rara" },
  { id: "e5_ciclo",        name: "Il Ciclo",           type: "eco",       cost: 4, power: 6,  rarity: "epica" },
  { id: "e6_quercia",      name: "Quercia Antica",     type: "eco",       cost: 6, power: 10, rarity: "leggendaria" },
  { id: "e7_muschio",      name: "Muschio Morbido",    type: "eco",       cost: 2, power: 2,  rarity: "comune" },
  { id: "e8_vento",        name: "Vento del Nord",     type: "eco",       cost: 3, power: 5,  rarity: "rara" },
  { id: "e9_pietra",       name: "Pietra Filosofale",   type: "eco",       cost: 7, power: 12, rarity: "leggendaria" },
  { id: "e10_eternita",    name: "Eternità",           type: "eco",       cost: 8, power: 18, rarity: "leggendaria" },
];

const F = {
  archetipo: { p: "#a855f7", s: "#7e22ce", t: "#d8b4fe", name: "Archetipo" },
  ricordo:   { p: "#fbbf24", s: "#b45309", t: "#fde68a", name: "Ricordo" },
  maschera:  { p: "#ef4444", s: "#991b1b", t: "#fca5a5", name: "Maschera" },
  oblio:     { p: "#3b82f6", s: "#1e3a5f", t: "#93c5fd", name: "Oblio" },
  sogno:     { p: "#22d3ee", s: "#0891b2", t: "#a5f3fc", name: "Sogno" },
  eco:       { p: "#34d399", s: "#065f46", t: "#a7f3d0", name: "Eco" },
};

const RCOL = { comune: "#9ca3af", rara: "#22d3ee", epica: "#a855f7", leggendaria: "#fbbf24" };

function defs(id, fc) {
  return `<defs>
<radialGradient id="bg_${id}" cx="50%" cy="40%" r="80%"><stop offset="0%" stop-color="${fc.p}08"/><stop offset="60%" stop-color="${fc.s}15"/><stop offset="100%" stop-color="#050008"/></radialGradient>
<linearGradient id="tb_${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(0,0,0,0)"/><stop offset="50%" stop-color="rgba(0,0,0,0.85)"/><stop offset="100%" stop-color="rgba(0,0,0,1)"/></linearGradient>
<linearGradient id="ph_${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffd700"/><stop offset="50%" stop-color="#b8860b"/><stop offset="100%" stop-color="#8b4513"/></linearGradient>
<filter id="g_${id}"><feGaussianBlur stdDeviation="12"/></filter>
<filter id="gm_${id}"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="gs_${id}"><feGaussianBlur stdDeviation="20"/></filter>
<clipPath id="c_${id}"><rect x="0" y="0" width="360" height="480" rx="16"/></clipPath>
</defs>`;
}

function frame(c) {
  const fc = F[c.type];
  const rc = RCOL[c.rarity];
  const up = c.name.toUpperCase();
  let stars = "";
  for (let i = 0, s = c.id.length * 137 + c.power; i < 12; i++) {
    s = (s * 9301 + 49297) % 233280; const r = s / 233280;
    stars += `<circle cx="${(20+r*320).toFixed(1)}" cy="${(60+r*390).toFixed(1)}" r="${(0.5+r*0.8).toFixed(1)}" fill="${fc.t}" opacity="${(0.2+r*0.4).toFixed(2)}"/>`;
  }
  return `<g clip-path="url(#c_${c.id})">
${stars}
<rect x="0" y="0" width="360" height="480" fill="none" stroke="#000" stroke-width="80" opacity="0.5" rx="16"/>
<rect x="0.5" y="0.5" width="359" height="479" fill="none" stroke="${rc}44" stroke-width="1" rx="16"/>
<rect x="2" y="2" width="356" height="476" fill="none" stroke="${rc}" stroke-width="3" rx="14" opacity="0.6"/>
<rect x="2" y="2" width="356" height="476" fill="none" stroke="rgba(255,215,0,0.35)" stroke-width="1.5" rx="14"/>
<path d="M 8 8 L 8 22 M 8 8 L 22 8" fill="none" stroke="rgba(255,215,0,0.7)" stroke-width="1.5"/>
<path d="M 352 8 L 352 22 M 352 8 L 338 8" fill="none" stroke="rgba(255,215,0,0.7)" stroke-width="1.5"/>
<path d="M 8 472 L 8 458 M 8 472 L 22 472" fill="none" stroke="rgba(255,215,0,0.7)" stroke-width="1.5"/>
<path d="M 352 472 L 352 458 M 352 472 L 338 472" fill="none" stroke="rgba(255,215,0,0.7)" stroke-width="1.5"/>
<circle cx="32" cy="32" r="22" fill="${fc.p}" opacity="0.9"/>
<circle cx="32" cy="32" r="22" fill="none" stroke="rgba(255,215,0,0.5)" stroke-width="1.5"/>
<circle cx="28" cy="28" r="8" fill="rgba(255,255,255,0.2)"/>
<text x="32" y="34" text-anchor="middle" dominant-baseline="central" font-size="20" font-weight="900" fill="#fff" font-family="Cinzel,serif">${c.cost}</text>
<circle cx="328" cy="32" r="16" fill="rgba(0,0,0,0.6)" stroke="${fc.p}44" stroke-width="1.5"/>
<circle cx="328" cy="32" r="5" fill="${fc.p}"><animate attributeName="opacity" values="0.3;1;0.3" dur="${(1.5+(c.cost%3)*0.3).toFixed(1)}s" repeatCount="indefinite"/></circle>
<rect x="0" y="300" width="360" height="180" fill="url(#tb_${c.id})"/>
<text x="180" y="425" text-anchor="middle" font-size="17" fill="#fff" font-family="Cinzel,serif" font-weight="700" letter-spacing="3">${up}</text>
<text x="180" y="452" text-anchor="middle" font-size="8" fill="${rc}" font-family="Montserrat,sans-serif" letter-spacing="4" opacity="0.7">${c.rarity.toUpperCase()}</text>
<g transform="translate(180,460)"><polygon points="-30,-18 30,-18 40,0 30,18 -30,18 -40,0" fill="url(#ph_${c.id})" stroke="rgba(255,215,0,0.8)" stroke-width="1.5"/><polygon points="-28,-16 28,-16 38,0 28,16 -28,16 -38,0" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.5"/><text x="0" y="3" text-anchor="middle" dominant-baseline="central" font-size="22" font-weight="900" fill="#000" font-family="Cinzel,serif">${c.power}</text></g>
</g>`;
}

const BG = (id) => `<rect x="0" y="0" width="360" height="480" fill="url(#bg_${id})"/>`;
const HGLOW = (cx,cy,r,col,id) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col}" filter="url(#g_${id})"/>`;
const HBGLOW = (cx,cy,r,col,id) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col}" filter="url(#gs_${id})"/>`;


// ---- ILLUSTRATION ENGINE ----
function random(seed) {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function generateArt(c) {
  const fc = F[c.type];
  const id = c.id;
  const rnd = random(c.id.charCodeAt(0) * 137 + c.power * 31 + c.cost * 7);
  const parts = [];

  // Background
  parts.push(`<rect x="0" y="0" width="360" height="480" fill="#050008"/>`);
  parts.push(`<rect x="0" y="0" width="360" height="480" fill="url(#bg_${id})"/>`);

  // --- Theme-based illustration generation ---
  const theme = c.id.substring(0, 2); // prefix determines faction + card number

  // Generate elements based on card identity
  switch (c.id) {
    // ========== ARCHETIPO (v1-v10) ==========
    case "v1_ambizione": {
      // Gravitational center pulling star fragments
      parts.push(HGLOW(180,200,130,fc.p,id));
      parts.push(HGLOW(180,200,60,"#a855f7",id));
      for (let i = 0; i < 8; i++) {
        const r = 25 + i * 12;
        parts.push(`<circle cx="180" cy="200" r="${r}" fill="none" stroke="${fc.t}" stroke-width="${0.5}" opacity="${(0.2 - i*0.02).toFixed(2)}"/>`);
      }
      // Star fragments being pulled in (spiral)
      for (let i = 0; i < 50; i++) {
        const a = i * 0.3 + rnd() * 0.5;
        const r = 20 + i * 2.5;
        const op = 0.7 - i * 0.012;
        const x = 180 + Math.cos(a) * r;
        const y = 200 + Math.sin(a) * r;
        const sz = 0.5 + rnd() * 1.2;
        parts.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${sz.toFixed(1)}" fill="#ffd700" opacity="${Math.max(0,op).toFixed(2)}"><animate attributeName="opacity" values="${Math.max(0,op).toFixed(2)};${(Math.max(0,op)*0.2).toFixed(2)};${Math.max(0,op).toFixed(2)}" dur="${(1.5+rnd()*2).toFixed(1)}s" repeatCount="indefinite"/></circle>`);
      }
      // Gravity lines
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        parts.push(`<line x1="180" y1="200" x2="${(180+Math.cos(a)*110).toFixed(0)}" y2="${(200+Math.sin(a)*110).toFixed(0)}" stroke="${fc.t}" stroke-width="0.3" opacity="0.15"/>`);
      }
      parts.push(`<ellipse cx="180" cy="270" rx="80" ry="25" fill="${fc.p}15"/>`);
      break;
    }
    case "v2_ossessione": {
      // Hypnotic spiral eye
      parts.push(HGLOW(180,200,120,fc.p,id));
      for (let i = 0; i < 200; i++) {
        const t = i * 0.08;
        const r = 8 + t * 3;
        const x = 180 + Math.cos(t) * r;
        const y = 200 + Math.sin(t) * r;
        const op = 0.8 - i * 0.003;
        if (i % 2 === 0)
          parts.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.5 - i*0.006).toFixed(2)}" fill="${fc.t}" opacity="${Math.max(0,op).toFixed(2)}"/>`);
      }
      parts.push(`<ellipse cx="180" cy="200" rx="50" ry="30" fill="none" stroke="${fc.p}" stroke-width="1" opacity="0.4"/>`);
      parts.push(`<circle cx="180" cy="200" r="30" fill="${fc.s}40" filter="url(#gm_${id})"/>`);
      parts.push(`<circle cx="180" cy="200" r="6" fill="#fff" opacity="0.6"><animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite"/></circle>`);
      break;
    }
    case "v3_nostalgia": {
      // Warm fading memory
      const warm = "#f59e0b";
      parts.push(HGLOW(180,180,110,warm,id));
      parts.push(HGLOW(180,180,50,"#fbbf24",id));
      for (let i = 0; i < 30; i++) {
        const y = 70 + i * 9;
        const spread = 25 + i * 2.5;
        const op = 0.5 - i * 0.015;
        parts.push(`<line x1="${(180-spread).toFixed(0)}" y1="${y.toFixed(0)}" x2="${(180+spread).toFixed(0)}" y2="${y.toFixed(0)}" stroke="${warm}" stroke-width="0.5" opacity="${Math.max(0,op).toFixed(2)}"/>`);
      }
      // Fading circle (memory dissolving)
      for (let i = 0; i < 8; i++) {
        const r = 15 + i * 8;
        parts.push(`<circle cx="180" cy="200" r="${r}" fill="none" stroke="${warm}" stroke-width="0.5" opacity="${(0.15 - i*0.015).toFixed(2)}"/>`);
      }
      parts.push(`<ellipse cx="180" cy="300" rx="80" ry="20" fill="${fc.p}10"/>`);
      break;
    }
    case "v4_apatia": {
      // Gray falling ash
      parts.push(HGLOW(180,120,90,"#374151",id));
      for (let i = 0; i < 50; i++) {
        const x = 40 + i * 6 + rnd() * 20;
        const y = -20 + i * 9;
        const r = 0.3 + rnd() * 0.6;
        const op = 0.5 - i * 0.008;
        if (y < 480)
          parts.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#6b7280" opacity="${Math.max(0,op).toFixed(2)}"><animate attributeName="cy" values="${y.toFixed(1)};${(y+80).toFixed(1)};${y.toFixed(1)}" dur="${(4+(i%5)*0.3).toFixed(1)}s" repeatCount="indefinite"/></circle>`);
      }
      parts.push(`<line x1="60" y1="220" x2="300" y2="220" stroke="#4b5563" stroke-width="0.3" opacity="0.25"/>`);
      parts.push(`<line x1="80" y1="260" x2="280" y2="260" stroke="#4b5563" stroke-width="0.3" opacity="0.15"/>`);
      break;
    }
    case "v5_follia": {
      // Impossible geometries
      parts.push(HGLOW(180,200,150,"#7e22ce",id));
      for (let i = 0; i < 10; i++) {
        const s = 120 - i * 10;
        const rot = i * 18;
        const op = 0.5 - i * 0.045;
        const pts = `180,${(200-s*0.433).toFixed(1)} ${(180-s*0.433).toFixed(1)},${(200+s*0.216).toFixed(1)} ${(180+s*0.433).toFixed(1)},${(200+s*0.216).toFixed(1)}`;
        parts.push(`<polygon points="${pts}" fill="none" stroke="${fc.t}" stroke-width="${(2 - i*0.15).toFixed(1)}" opacity="${Math.max(0,op).toFixed(2)}" transform="rotate(${rot} 180 200)"/>`);
      }
      // Fractal sub-elements
      for (let i = 0; i < 15; i++) {
        const x = 180 + Math.cos(i * 2.5) * (40 + i * 5);
        const y = 200 + Math.sin(i * 2.5) * (40 + i * 5);
        const s2 = 10 + i * 0.8;
        const pts = `${x.toFixed(0)},${(y-s2*0.866).toFixed(0)} ${(x-s2*0.5).toFixed(0)},${(y+s2*0.289).toFixed(0)} ${(x+s2*0.5).toFixed(0)},${(y+s2*0.289).toFixed(0)}`;
        parts.push(`<polygon points="${pts}" fill="none" stroke="${fc.p}" stroke-width="0.6" opacity="${(0.5 - i*0.03).toFixed(2)}"/>`);
      }
      parts.push(`<circle cx="180" cy="200" r="3" fill="#fff" opacity="0.7"><animate attributeName="opacity" values="0.7;0.1;0.7" dur="1.2s" repeatCount="indefinite"/></circle>`);
      break;
    }
    case "v6_empatia": {
      // Interlocking rings/resonance
      parts.push(HGLOW(130,190,70,fc.p,id));
      parts.push(HGLOW(230,190,70,fc.p,id));
      parts.push(`<circle cx="135" cy="190" r="40" fill="none" stroke="${fc.t}" stroke-width="2.5" opacity="0.6"/>`);
      parts.push(`<circle cx="225" cy="190" r="40" fill="none" stroke="${fc.t}" stroke-width="2.5" opacity="0.6"/>`);
      parts.push(`<path d="M135,190 Q180,165 225,190 Q180,215 135,190" fill="${fc.p}25" stroke="${fc.p}" stroke-width="1" opacity="0.5"/>`);
      // Resonance waves
      for (let i = 1; i <= 3; i++) {
        parts.push(`<circle cx="180" cy="190" r="${45+i*15}" fill="none" stroke="${fc.t}" stroke-width="0.5" opacity="${(0.2 - i*0.05).toFixed(2)}"><animate attributeName="r" values="${45+i*15};${55+i*15};${45+i*15}" dur="${(2.5+i*0.5).toFixed(1)}s" repeatCount="indefinite"/><animate attributeName="opacity" values="${(0.2 - i*0.05).toFixed(2)};0;${(0.2 - i*0.05).toFixed(2)}" dur="${(2.5+i*0.5).toFixed(1)}s" repeatCount="indefinite"/></circle>`);
      }
      break;
    }
    case "v7_rancore": {
      // Smoldering ember/thorns
      const ember = "#dc2626";
      parts.push(HGLOW(180,210,100,ember,id));
      // Thorn paths
      for (let side of [-1, 1]) {
        parts.push(`<path d="M180,160 Q${180+side*30},220 ${180+side*50},280 Q${180+side*60},310 ${180+side*80},330" fill="none" stroke="${ember}" stroke-width="2" opacity="0.4"/>`);
        parts.push(`<path d="M180,180 Q${180+side*20},230 ${180+side*35},270" fill="none" stroke="${fc.t}" stroke-width="0.8" opacity="0.25"/>`);
      }
      // Ember particles
      for (let i = 0; i < 20; i++) {
        const x = 140 + rnd() * 80;
        const y = 170 + rnd() * 100;
        const op = 0.2 + rnd() * 0.4;
        parts.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.3+rnd()*0.7).toFixed(1)}" fill="#fca5a5" opacity="${op.toFixed(2)}"><animate attributeName="opacity" values="${(op*0.3).toFixed(2)};${op.toFixed(2)};${(op*0.3).toFixed(2)}" dur="${(1+rnd()*2).toFixed(1)}s" repeatCount="indefinite"/></circle>`);
      }
      parts.push(`<ellipse cx="180" cy="300" rx="60" ry="20" fill="#dc262615"/>`);
      break;
    }
    case "v8_solitudine": {
      // Lone figure in vastness
      parts.push(HGLOW(180,100,60,"#7e22ce",id));
      parts.push(`<path d="M0,310 Q90,275 180,305 Q270,335 360,295 L360,480 L0,480 Z" fill="#0d001a" opacity="0.8"/>`);
      // Lonely figure
      parts.push(`<circle cx="180" cy="265" r="4" fill="${fc.t}" opacity="0.5"/>`);
      parts.push(`<line x1="180" y1="269" x2="180" y2="285" stroke="${fc.t}" stroke-width="0.5" opacity="0.4"/>`);
      parts.push(`<line x1="180" y1="275" x2="172" y2="282" stroke="${fc.t}" stroke-width="0.4" opacity="0.3"/>`);
      parts.push(`<line x1="180" y1="275" x2="188" y2="282" stroke="${fc.t}" stroke-width="0.4" opacity="0.3"/>`);
      // Single bright star
      parts.push(`<circle cx="180" cy="90" r="3" fill="#fff" opacity="0.9"><animate attributeName="opacity" values="0.9;0.2;0.9" dur="4s" repeatCount="indefinite"/></circle>`);
      parts.push(`<circle cx="180" cy="90" r="8" fill="#fff" opacity="0.15" filter="url(#gm_${id})"/>`);
      // Distant landscape line
      parts.push(`<path d="M60,295 Q140,280 180,290 Q220,300 300,285" fill="none" stroke="${fc.t}" stroke-width="0.3" opacity="0.15"/>`);
      break;
    }
    case "v9_coraggio": {
      // Shield of light
      const gold = "#fbbf24";
      parts.push(HGLOW(180,200,100,gold,id));
      parts.push(`<path d="M180,110 L250,160 L250,240 Q250,290 180,330 Q110,290 110,240 L110,160 Z" fill="${gold}12" stroke="${gold}" stroke-width="2" opacity="0.6"/>`);
      parts.push(`<path d="M180,135 L230,170 L230,240 Q230,275 180,305 Q130,275 130,240 L130,170 Z" fill="none" stroke="${fc.t}" stroke-width="1" opacity="0.3"/>`);
      // Radiant glow
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        parts.push(`<line x1="${(180+Math.cos(a)*70).toFixed(0)}" y1="${(200+Math.sin(a)*70).toFixed(0)}" x2="${(180+Math.cos(a)*140).toFixed(0)}" y2="${(200+Math.sin(a)*140).toFixed(0)}" stroke="${gold}" stroke-width="0.5" opacity="0.15"/>`);
      }
      parts.push(`<circle cx="180" cy="210" r="5" fill="#fff" opacity="0.7"/>`);
      break;
    }
    case "v10_armonia": {
      // Perfect mandala
      parts.push(HGLOW(180,200,90,fc.p,id));
      for (let i = 1; i <= 10; i++) {
        const r = i * 12;
        const op = 0.35 - i * 0.03;
        parts.push(`<circle cx="180" cy="200" r="${r}" fill="none" stroke="${fc.t}" stroke-width="${(0.5 + i*0.15).toFixed(1)}" opacity="${Math.max(0.03,op).toFixed(2)}"/>`);
        // Petals
        const npet = 14 - i;
        for (let j = 0; j < npet; j++) {
          const a = (j / npet) * Math.PI * 2;
          const px = 180 + Math.cos(a) * (r + 5);
          const py = 200 + Math.sin(a) * (r + 5);
          parts.push(`<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="1.5" fill="${fc.p}" opacity="${(0.25 - i*0.02).toFixed(2)}"/>`);
        }
      }
      parts.push(`<circle cx="180" cy="200" r="4" fill="#fff" opacity="0.9"/>`);
      break;
    }

    // ========== RICORDO (o1-o10: Golden memories) ==========
    case "o1_chiave_antica": {
      const gold = "#fbbf24";
      parts.push(HGLOW(180,190,90,gold,id));
      parts.push(`<path d="M180,120 L180,230 M180,130 L160,150 L180,145 L200,160" fill="none" stroke="${gold}" stroke-width="2" opacity="0.6"/>`);
      parts.push(`<circle cx="180" cy="115" r="16" fill="none" stroke="${gold}" stroke-width="2" opacity="0.5"/>`);
      parts.push(`<circle cx="180" cy="115" r="8" fill="${gold}25" stroke="${gold}" stroke-width="1" opacity="0.4"/>`);
      parts.push(`<line x1="180" y1="230" x2="168" y2="250" stroke="${gold}" stroke-width="2" opacity="0.4"/>`);
      parts.push(`<line x1="180" y1="230" x2="180" y2="255" stroke="${gold}" stroke-width="2" opacity="0.4"/>`);
      parts.push(`<line x1="180" y1="230" x2="192" y2="250" stroke="${gold}" stroke-width="2" opacity="0.4"/>`);
      // Light rays
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        parts.push(`<line x1="180" y1="170" x2="${(180+Math.cos(a)*130).toFixed(0)}" y2="${(170+Math.sin(a)*100).toFixed(0)}" stroke="${fc.t}" stroke-width="0.3" opacity="0.1"/>`);
      }
      break;
    }
    case "o2_bosco_sacro": {
      const gold = "#fbbf24";
      parts.push(HGLOW(180,200,110,"#b45309",id));
      for (const [tx, tw] of [[100,8],[180,12],[260,8]]) {
        parts.push(`<path d="M${tx-tw/2},320 L${tx-tw/3},220 L${tx+tw/3},220 L${tx+tw/2},320 Z" fill="#1a1200" stroke="${gold}33" stroke-width="0.5"/>`);
      }
      for (const [cx,cy,cr] of [[100,185,55],[180,165,70],[260,190,50]]) {
        parts.push(`<circle cx="${cx}" cy="${cy}" r="${cr}" fill="${gold}15" filter="url(#g_${id})"/>`);
        parts.push(`<circle cx="${cx}" cy="${cy}" r="${cr}" fill="none" stroke="${gold}" stroke-width="0.5" opacity="0.35"/>`);
        for (let i = 0; i < 12; i++) {
          const a = rnd() * Math.PI * 2;
          const d = cr * (0.2 + rnd() * 0.7);
          parts.push(`<circle cx="${(cx+Math.cos(a)*d).toFixed(0)}" cy="${(cy+Math.sin(a)*d).toFixed(0)}" r="1.5" fill="${fc.t}" opacity="${(0.15+rnd()*0.25).toFixed(2)}"/>`);
        }
      }
      parts.push(`<ellipse cx="180" cy="340" rx="140" ry="25" fill="${gold}10"/>`);
      break;
    }
    case "o3_giocattolo": {
      const gold = "#fbbf24";
      parts.push(HGLOW(180,200,80,"#92400e",id));
      parts.push(`<ellipse cx="180" cy="210" rx="28" ry="35" fill="${gold}15" stroke="${gold}44" stroke-width="1"/>`);
      parts.push(`<circle cx="180" cy="165" r="20" fill="${gold}15" stroke="${gold}44" stroke-width="1"/>`);
      // Cracks
      parts.push(`<path d="M170,150 L182,163 L172,173 L188,182" fill="none" stroke="${gold}" stroke-width="0.8" opacity="0.45"/>`);
      parts.push(`<path d="M195,160 L188,172 L198,185" fill="none" stroke="${gold}" stroke-width="0.5" opacity="0.35"/>`);
      // Broken fragments
      for (const [fx,fy] of [[125,195],[225,215],[155,255]]) {
        parts.push(`<path d="M${fx},${fy} L${fx+10},${fy-5} L${fx+8},${fy+8} Z" fill="${gold}25" opacity="0.4"/>`);
      }
      break;
    }
    case "o4_lettera": {
      const gold = "#fbbf24";
      parts.push(HGLOW(180,190,70,gold,id));
      parts.push(`<path d="M110,155 L250,155 L250,265 L110,265 Z" fill="${gold}08" stroke="${gold}" stroke-width="1.5" opacity="0.55"/>`);
      parts.push(`<path d="M110,155 L180,210 L250,155" fill="none" stroke="${gold}" stroke-width="1" opacity="0.4"/>`);
      // Wax seal
      parts.push(`<circle cx="180" cy="235" r="14" fill="#dc2626" opacity="0.75"/>`);
      parts.push(`<circle cx="180" cy="235" r="11" fill="none" stroke="#dc2626" stroke-width="1.5" opacity="0.5"/>`);
      parts.push(`<text x="180" y="240" text-anchor="middle" font-size="9" fill="#ffd700" font-family="serif" font-weight="700">S</text>`);
      // Paper texture lines
      for (let i = 0; i < 3; i++) {
        parts.push(`<line x1="${130+i*5}" y1="${245+i*6}" x2="${170+i*10}" y2="${245+i*6}" stroke="#fde68a" stroke-width="0.3" opacity="0.2"/>`);
      }
      break;
    }
    case "o5_cenere": {
      const gold = "#fbbf24";
      parts.push(HGLOW(180,200,130,"#78350f",id));
      // Swirling cosmic dust
      for (let i = 0; i < 80; i++) {
        const t = i * 0.15;
        const r = 15 + i * 1.5;
        const x = 180 + Math.cos(t) * r * 0.8;
        const y = 200 + Math.sin(t) * r * 0.6;
        const op = 0.6 - i * 0.007;
        const sz = 0.3 + Math.sin(i) * 0.6;
        const cols = ["#ffd700","#fde68a","#fff","#b8860b"];
        parts.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${Math.abs(sz).toFixed(1)}" fill="${cols[i%4]}" opacity="${Math.max(0,op).toFixed(2)}"><animate attributeName="opacity" values="${Math.max(0,op).toFixed(2)};${(Math.max(0,op)*0.1).toFixed(2)};${Math.max(0,op).toFixed(2)}" dur="${(2+(i%3)*0.5).toFixed(1)}s" repeatCount="indefinite"/></circle>`);
      }
      parts.push(`<ellipse cx="180" cy="310" rx="90" ry="25" fill="${gold}10"/>`);
      break;
    }
    case "o6_giardino": {
      const gold = "#fbbf24";
      parts.push(HGLOW(180,220,90,"#92400e",id));
      parts.push(`<ellipse cx="180" cy="340" rx="140" ry="50" fill="#1a1200" opacity="0.5"/>`);
      // Glowing flowers
      for (const [fx,fy,fr] of [[120,250,9],[150,230,7],[210,240,8],[240,260,6],[170,270,10],[200,290,7],[140,300,6],[230,280,5]]) {
        parts.push(`<circle cx="${fx}" cy="${fy}" r="${fr}" fill="${gold}25" filter="url(#gm_${id})"/>`);
        parts.push(`<circle cx="${fx}" cy="${fy}" r="${fr*0.4}" fill="${gold}45"/>`);
        parts.push(`<circle cx="${fx}" cy="${fy}" r="${fr*0.15}" fill="#fff" opacity="0.5"><animate attributeName="opacity" values="0.5;0.1;0.5" dur="${(1.5+rnd()*1.5).toFixed(1)}s" repeatCount="indefinite"/></circle>`);
      }
      // Fireflies
      for (let i = 0; i < 8; i++) {
        parts.push(`<circle cx="${(60+rnd()*240).toFixed(0)}" cy="${(150+rnd()*150).toFixed(0)}" r="1" fill="${fc.t}" opacity="${(0.1+rnd()*0.4).toFixed(2)}"><animate attributeName="opacity" values="${(0.05+rnd()*0.2).toFixed(2)};${(0.3+rnd()*0.4).toFixed(2)};${(0.05+rnd()*0.2).toFixed(2)}" dur="${(2+rnd()*3).toFixed(1)}s" repeatCount="indefinite"/></circle>`);
      }
      break;
    }
    case "o7_primo_volo": {
      const gold = "#fbbf24";
      parts.push(HGLOW(180,150,90,gold,id));
      // Wings
      parts.push(`<path d="M180,175 Q100,120 50,150 Q80,190 180,200" fill="${gold}18" stroke="${gold}" stroke-width="1" opacity="0.55"/>`);
      parts.push(`<path d="M180,175 Q260,120 310,150 Q280,190 180,200" fill="${gold}18" stroke="${gold}" stroke-width="1" opacity="0.55"/>`);
      parts.push(`<path d="M180,165 Q110,90 40,110 Q70,160 180,190" fill="${gold}12" stroke="${fc.t}" stroke-width="0.5" opacity="0.35"/>`);
      parts.push(`<path d="M180,165 Q250,90 320,110 Q290,160 180,190" fill="${gold}12" stroke="${fc.t}" stroke-width="0.5" opacity="0.35"/>`);
      parts.push(`<ellipse cx="180" cy="215" rx="8" ry="22" fill="${gold}35" stroke="${gold}" stroke-width="0.8" opacity="0.45"/>`);
      // Ascending trail
      for (let i = 0; i < 12; i++) {
        const y = 100 - i * 6;
        parts.push(`<circle cx="180" cy="${y}" r="${(1.2 - i*0.08).toFixed(1)}" fill="${fc.t}" opacity="${(0.35 - i*0.025).toFixed(2)}"/>`);
      }
      break;
    }
    case "o8_tempesta": {
      const gold = "#fbbf24";
      parts.push(HGLOW(180,140,130,"#78350f",id));
      for (const [cx,cy,rr] of [[80,130,60],[140,145,65],[200,160,70],[260,145,55]]) {
        parts.push(`<ellipse cx="${cx}" cy="${cy}" rx="${rr}" ry="28" fill="#1a1200" opacity="0.6"/>`);
        parts.push(`<ellipse cx="${cx}" cy="${cy}" rx="${rr}" ry="28" fill="none" stroke="${gold}33" stroke-width="0.5"/>`);
      }
      // Lightning
      parts.push(`<path d="M200,130 L185,170 L210,175 L190,220 L215,225 L190,270" fill="none" stroke="${gold}" stroke-width="2" opacity="0.6" filter="url(#gm_${id})"/>`);
      parts.push(`<path d="M200,130 L185,170 L210,175 L190,220 L215,225 L190,270" fill="none" stroke="#fff" stroke-width="0.8" opacity="0.8"><animate attributeName="opacity" values="0.8;0;0;0.8;0;0.8" dur="3s" repeatCount="indefinite"/></path>`);
      // Rain
      for (let i = 0; i < 25; i++) {
        const rx = 30 + i * 12 + rnd() * 5;
        const ry = 170 + i * 9;
        parts.push(`<line x1="${rx.toFixed(0)}" y1="${ry.toFixed(0)}" x2="${(rx-3).toFixed(0)}" y2="${(ry+10).toFixed(0)}" stroke="${fc.t}" stroke-width="0.3" opacity="${(0.35 - i*0.01).toFixed(2)}"/>`);
      }
      break;
    }
    case "o9_nebbia": {
      const gold = "#fbbf24";
      parts.push(HGLOW(180,200,130,"#92400e",id));
      for (let i = 0; i < 6; i++) {
        const y = 80 + i * 55;
        const w = 180 + i * 25;
        const op = 0.18 - i * 0.025;
        parts.push(`<ellipse cx="180" cy="${y}" rx="${w}" ry="28" fill="${gold}" opacity="${Math.max(0.02,op).toFixed(2)}" filter="url(#g_${id})"/>`);
      }
      // Vague figure in mist
      parts.push(`<ellipse cx="180" cy="230" rx="35" ry="55" fill="${gold}08" opacity="0.25"/>`);
      parts.push(`<ellipse cx="180" cy="185" rx="22" ry="22" fill="${gold}08" opacity="0.2"/>`);
      break;
    }
    case "o10_anello": {
      const gold = "#fbbf24";
      parts.push(HGLOW(180,200,80,gold,id));
      parts.push(`<path d="M120,200 A60,60 0 1,1 200,260" fill="none" stroke="${gold}" stroke-width="3" opacity="0.65"/>`);
      parts.push(`<path d="M200,140 A60,60 0 0,1 240,195" fill="none" stroke="${gold}" stroke-width="3" opacity="0.65"/>`);
      parts.push(`<path d="M235,190 L245,180 L238,173 L248,163" fill="none" stroke="${fc.t}" stroke-width="1" opacity="0.5"/>`);
      parts.push(`<path d="M250,155 L260,150 L255,145 Z" fill="${gold}45" opacity="0.35"/>`);
      parts.push(`<path d="M110,190 L105,180 L115,185 Z" fill="${gold}45" opacity="0.3"/>`);
      parts.push(`<ellipse cx="180" cy="200" rx="35" ry="35" fill="${gold}08" filter="url(#gm_${id})"/>`);
      break;
    }

    // ========== MASCHERA (c1-c10: Crimson masks) ==========
    case "c1_giullare": {
      const red = "#ef4444";
      parts.push(HGLOW(180,190,90,red,id));
      parts.push(`<ellipse cx="180" cy="200" rx="45" ry="55" fill="#1a0505" stroke="${fc.t}" stroke-width="1" opacity="0.55"/>`);
      parts.push(`<ellipse cx="160" cy="180" rx="8" ry="5" fill="#fff" opacity="0.25"/>`);
      parts.push(`<ellipse cx="200" cy="180" rx="8" ry="5" fill="#fff" opacity="0.25"/>`);
      parts.push(`<circle cx="160" cy="180" r="2.5" fill="#fff" opacity="0.5"/>`);
      parts.push(`<circle cx="200" cy="180" r="2.5" fill="#fff" opacity="0.5"/>`);
      parts.push(`<path d="M198,188 Q203,208 198,218" fill="none" stroke="#22d3ee" stroke-width="1.5" opacity="0.45"><animate attributeName="opacity" values="0.45;0.05;0.45" dur="3s" repeatCount="indefinite"/></path>`);
      parts.push(`<path d="M155,220 Q180,240 205,220" fill="none" stroke="${fc.t}" stroke-width="1.5" opacity="0.45"/>`);
      parts.push(`<path d="M130,160 L180,100 L230,160" fill="${red}25" stroke="${fc.t}" stroke-width="1" opacity="0.45"/>`);
      for (const bx of [130,180,230]) {
        parts.push(`<circle cx="${bx}" cy="${bx===180?100:160}" r="5" fill="${fc.t}" opacity="0.35"/>`);
        parts.push(`<circle cx="${bx}" cy="${bx===180?105:165}" r="2.5" fill="${red}" opacity="0.5"/>`);
      }
      break;
    }
    case "c2_re_caduto": {
      const red = "#ef4444";
      parts.push(HGLOW(180,170,90,"#7f1d1d",id));
      parts.push(`<g transform="rotate(-20 180 140)"><path d="M125,150 L135,105 L155,130 L180,95 L205,130 L225,105 L235,150 Z" fill="${red}25" stroke="${fc.t}" stroke-width="1.5" opacity="0.6"/>${[160,180,200].map(x => `<circle cx="${x}" cy="${x===180?110:125}" r="3.5" fill="${fc.t}" opacity="0.4"/>`).join("")}<circle cx="180" cy="132" r="5" fill="#ffd700" opacity="0.35"/></g>`);
      parts.push(`<path d="M115,200 L135,310 L225,310 L245,200 Z" fill="#1a0505" stroke="${fc.t}44" stroke-width="1" opacity="0.45"/>`);
      parts.push(`<path d="M158,200 L152,255 L162,310" fill="none" stroke="${fc.t}" stroke-width="0.5" opacity="0.25"/>`);
      parts.push(`<path d="M202,200 L208,245 L198,310" fill="none" stroke="${fc.t}" stroke-width="0.5" opacity="0.25"/>`);
      parts.push(`<path d="M120,200 Q100,175 130,165" fill="none" stroke="${fc.t}" stroke-width="0.3" opacity="0.2"/>`);
      parts.push(`<path d="M240,200 Q260,175 230,165" fill="none" stroke="${fc.t}" stroke-width="0.3" opacity="0.2"/>`);
      break;
    }
    case "c3_vittima": {
      const red = "#ef4444";
      parts.push(HGLOW(180,200,90,red,id));
      parts.push(`<ellipse cx="180" cy="180" rx="22" ry="28" fill="#1a0505" stroke="${fc.t}44" stroke-width="1" opacity="0.45"/>`);
      parts.push(`<ellipse cx="180" cy="240" rx="28" ry="38" fill="#1a0505" stroke="${fc.t}44" stroke-width="1" opacity="0.45"/>`);
      parts.push(`<path d="M140,200 Q115,210 105,230 Q95,255 115,265" fill="none" stroke="#9ca3af" stroke-width="2" opacity="0.35"/>`);
      parts.push(`<path d="M220,200 Q245,210 255,230 Q265,255 245,265" fill="none" stroke="#9ca3af" stroke-width="2" opacity="0.35"/>`);
      for (const [cx,cy] of [[105,230],[255,230]]) {
        for (let i = 0; i < 10; i++) {
          const a = (i/10)*Math.PI*2;
          parts.push(`<circle cx="${(cx+Math.cos(a)*4).toFixed(0)}" cy="${(cy+Math.sin(a)*4).toFixed(0)}" r="0.8" fill="#9ca3af" opacity="0.25"/>`);
        }
        parts.push(`<circle cx="${cx}" cy="${cy}" r="7" fill="${red}25" filter="url(#gm_${id})"/>`);
      }
      break;
    }
    case "c4_attore": {
      const red = "#ef4444";
      parts.push(HGLOW(180,190,90,red,id));
      parts.push(`<ellipse cx="140" cy="190" rx="28" ry="33" fill="#1a0505" stroke="${fc.t}" stroke-width="1" opacity="0.55"/>`);
      parts.push(`<ellipse cx="220" cy="190" rx="28" ry="33" fill="#1a0505" stroke="${fc.t}" stroke-width="1" opacity="0.55"/>`);
      // Tragedy mask (left)
      parts.push(`<ellipse cx="130" cy="180" rx="3.5" ry="2.5" fill="${fc.t}" opacity="0.35"/>`);
      parts.push(`<ellipse cx="150" cy="180" rx="3.5" ry="2.5" fill="${fc.t}" opacity="0.35"/>`);
      parts.push(`<path d="M130,200 Q140,195 150,200" fill="none" stroke="${fc.t}" stroke-width="1" opacity="0.35"/>`);
      // Comedy mask (right)
      parts.push(`<ellipse cx="210" cy="180" rx="3.5" ry="2.5" fill="${fc.t}" opacity="0.35"/>`);
      parts.push(`<ellipse cx="230" cy="180" rx="3.5" ry="2.5" fill="${fc.t}" opacity="0.35"/>`);
      parts.push(`<path d="M210,195 Q220,205 230,195" fill="none" stroke="${fc.t}" stroke-width="1" opacity="0.35"/>`);
      // Curtains
      parts.push(`<path d="M50,80 Q80,150 60,300 L40,300 L40,80 Z" fill="${red}25" opacity="0.45"/>`);
      parts.push(`<path d="M310,80 Q280,150 300,300 L320,300 L320,80 Z" fill="${red}25" opacity="0.45"/>`);
      parts.push(`<path d="M45,80 Q55,120 45,160" fill="none" stroke="${red}" stroke-width="0.5" opacity="0.15"/>`);
      parts.push(`<path d="M315,80 Q305,120 315,160" fill="none" stroke="${red}" stroke-width="0.5" opacity="0.15"/>`);
      break;
    }
    case "c5_martire": {
      const red = "#ef4444";
      parts.push(HGLOW(180,190,130,"#7f1d1d",id));
      parts.push(`<ellipse cx="180" cy="150" rx="18" ry="23" fill="#1a0505" stroke="${fc.t}44" stroke-width="1" opacity="0.4"/>`);
      parts.push(`<ellipse cx="180" cy="230" rx="23" ry="38" fill="#1a0505" stroke="${fc.t}44" stroke-width="1" opacity="0.4"/>`);
      parts.push(`<line x1="162" y1="160" x2="100" y2="190" stroke="#1a0505" stroke-width="5" opacity="0.4"/>`);
      parts.push(`<line x1="198" y1="160" x2="260" y2="190" stroke="#1a0505" stroke-width="5" opacity="0.4"/>`);
      parts.push(`<circle cx="180" cy="200" r="18" fill="${red}" opacity="0.35" filter="url(#g_${id})"/>`);
      parts.push(`<circle cx="180" cy="200" r="5" fill="#fff" opacity="0.5"><animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" repeatCount="indefinite"/></circle>`);
      for (let i = -2; i <= 2; i++) {
        if (i === 0) continue;
        parts.push(`<line x1="180" y1="200" x2="${(180+i*45).toFixed(0)}" y2="${(200+Math.abs(i)*18).toFixed(0)}" stroke="${red}" stroke-width="0.5" opacity="0.15"/>`);
      }
      parts.push(`<circle cx="180" cy="130" r="20" fill="none" stroke="#78350f" stroke-width="1.5" opacity="0.35"/>`);
      for (let i = 0; i < 6; i++) {
        const a = (i/6)*Math.PI*2;
        parts.push(`<circle cx="${(180+Math.cos(a)*20).toFixed(0)}" cy="${(130+Math.sin(a)*20).toFixed(0)}" r="1.5" fill="#78350f" opacity="0.25"/>`);
      }
      break;
    }
    case "c6_giudice": {
      const red = "#ef4444";
      parts.push(HGLOW(180,180,80,red,id));
      parts.push(`<line x1="180" y1="140" x2="180" y2="250" stroke="${fc.t}" stroke-width="2" opacity="0.55"/>`);
      parts.push(`<line x1="180" y1="140" x2="100" y2="180" stroke="${fc.t}" stroke-width="1.5" opacity="0.45"/>`);
      parts.push(`<line x1="180" y1="140" x2="260" y2="180" stroke="${fc.t}" stroke-width="1.5" opacity="0.45"/>`);
      parts.push(`<path d="M70,180 L130,180 L120,195 L80,195 Z" fill="${red}18" stroke="${fc.t}" stroke-width="1" opacity="0.45"/>`);
      parts.push(`<path d="M230,180 L290,180 L280,195 L240,195 Z" fill="${red}18" stroke="${fc.t}" stroke-width="1" opacity="0.45"/>`);
      parts.push(`<path d="M280,120 L300,130 L290,140 L270,130 Z" fill="#78350f" opacity="0.55"/>`);
      parts.push(`<line x1="290" y1="140" x2="290" y2="170" stroke="#78350f" stroke-width="2" opacity="0.45"/>`);
      parts.push(`<path d="M170,220 L190,220" stroke="#fff" stroke-width="1.5" opacity="0.35"/>`);
      parts.push(`<path d="M165,225 Q180,230 195,225" fill="none" stroke="${fc.t}" stroke-width="0.5" opacity="0.25"/>`);
      break;
    }
    case "c7_bambino": {
      const red = "#ef4444";
      parts.push(HGLOW(180,200,90,"#fca5a5",id));
      parts.push(`<circle cx="180" cy="180" r="20" fill="#1a0505" stroke="${fc.t}33" stroke-width="1" opacity="0.4"/>`);
      parts.push(`<ellipse cx="180" cy="230" rx="16" ry="23" fill="#1a0505" stroke="${fc.t}33" stroke-width="1" opacity="0.4"/>`);
      parts.push(`<circle cx="172" cy="175" r="4.5" fill="#fff" opacity="0.45"/>`);
      parts.push(`<circle cx="188" cy="175" r="4.5" fill="#fff" opacity="0.45"/>`);
      parts.push(`<circle cx="172" cy="175" r="2" fill="#000" opacity="0.6"/>`);
      parts.push(`<circle cx="188" cy="175" r="2" fill="#000" opacity="0.6"/>`);
      parts.push(`<path d="M174,188 Q180,193 186,188" fill="none" stroke="${fc.t}" stroke-width="1" opacity="0.35"/>`);
      parts.push(`<circle cx="180" cy="200" r="55" fill="${red}08" filter="url(#gm_${id})"/>`);
      for (let i = 0; i < 6; i++) {
        parts.push(`<circle cx="${(140+rnd()*80).toFixed(0)}" cy="${(140+rnd()*80).toFixed(0)}" r="1" fill="${fc.t}" opacity="${(0.15+rnd()*0.35).toFixed(2)}"><animate attributeName="opacity" values="0.1;${(0.25+rnd()*0.35).toFixed(2)};0.1" dur="${(1+rnd()*2).toFixed(1)}s" repeatCount="indefinite"/></circle>`);
      }
      break;
    }
    case "c8_eremita": {
      const red = "#ef4444";
      parts.push(`<path d="M0,0 Q90,100 180,60 Q270,100 360,0 L360,480 L0,480 Z" fill="#050005" opacity="0.9"/>`);
      parts.push(`<path d="M0,100 Q180,50 360,100 L360,480 L0,480 Z" fill="#0a0010" opacity="0.8"/>`);
      parts.push(HGLOW(180,280,70,"#f59e0b",id));
      parts.push(`<rect x="177" y="260" width="6" height="18" fill="#78350f" opacity="0.75"/>`);
      parts.push(`<ellipse cx="180" cy="258" rx="3.5" ry="5.5" fill="#fbbf24" opacity="0.75"/>`);
      parts.push(`<ellipse cx="180" cy="254" rx="2.5" ry="2.5" fill="#fff" opacity="0.55"><animate attributeName="opacity" values="0.55;0.2;0.55" dur="1.5s" repeatCount="indefinite"/></ellipse>`);
      parts.push(`<circle cx="180" cy="255" r="28" fill="#fbbf24" opacity="0.12" filter="url(#g_${id})"/>`);
      parts.push(`<ellipse cx="180" cy="320" rx="18" ry="28" fill="#0a0010" stroke="${fc.t}33" stroke-width="0.5" opacity="0.45"/>`);
      parts.push(`<ellipse cx="180" cy="295" rx="13" ry="14" fill="#0a0010" stroke="${fc.t}33" stroke-width="0.5" opacity="0.35"/>`);
      break;
    }
    case "c9_mostro": {
      const red = "#ef4444";
      parts.push(HGLOW(180,220,110,"#7f1d1d",id));
      parts.push(`<path d="M80,480 Q100,350 130,280 Q150,240 180,220 Q210,240 230,280 Q260,350 280,480 Z" fill="#0a0000" opacity="0.8"/>`);
      parts.push(`<circle cx="155" cy="250" r="7" fill="${red}" opacity="0.7" filter="url(#gm_${id})"/>`);
      parts.push(`<circle cx="205" cy="250" r="7" fill="${red}" opacity="0.7" filter="url(#gm_${id})"/>`);
      parts.push(`<circle cx="155" cy="250" r="2.5" fill="#fff" opacity="0.6"><animate attributeName="opacity" values="0.6;0.05;0.6" dur="2.5s" repeatCount="indefinite"/></circle>`);
      parts.push(`<circle cx="205" cy="250" r="2.5" fill="#fff" opacity="0.6"><animate attributeName="opacity" values="0.6;0.05;0.6" dur="2.5s" repeatCount="indefinite"/></circle>`);
      parts.push(`<path d="M100,320 Q80,290 110,260" fill="none" stroke="#1a0000" stroke-width="5" opacity="0.55"/>`);
      parts.push(`<path d="M260,320 Q280,290 250,260" fill="none" stroke="#1a0000" stroke-width="5" opacity="0.55"/>`);
      parts.push(`<circle cx="180" cy="260" r="45" fill="${red}" opacity="0.12" filter="url(#g_${id})"/>`);
      break;
    }
    case "c10_boia": {
      const red = "#ef4444";
      parts.push(HGLOW(180,190,120,"#7f1d1d",id));
      parts.push(`<path d="M240,100 L260,120 L200,200 L220,220 L280,140 L300,160 L250,220 L270,240 L320,180 L340,200 L270,280 L250,260 L200,300 L180,280 Z" fill="#450a0a" stroke="${red}" stroke-width="0.8" opacity="0.55"/>`);
      parts.push(`<line x1="200" y1="200" x2="140" y2="260" stroke="#78350f" stroke-width="3.5" opacity="0.55"/>`);
      parts.push(`<ellipse cx="160" cy="240" rx="32" ry="48" fill="#0a0000" opacity="0.65"/>`);
      parts.push(`<ellipse cx="160" cy="190" rx="23" ry="28" fill="#0a0000" opacity="0.65"/>`);
      parts.push(`<rect x="148" y="175" width="7" height="2.5" fill="#000" opacity="0.8"/>`);
      parts.push(`<rect x="162" y="175" width="7" height="2.5" fill="#000" opacity="0.8"/>`);
      parts.push(`<path d="M230,250 L230,260 Q230,270 228,275" fill="none" stroke="${red}" stroke-width="1.5" opacity="0.35"/>`);
      parts.push(`<circle cx="228" cy="278" r="1.5" fill="${red}" opacity="0.25"/>`);
      break;
    }
    // ========== OBLIO (b1-b10: Cold blue void) ==========
    case "b1_vuoto": {
      parts.push(`<rect x="0" y="0" width="360" height="480" fill="#000814" opacity="0.5"/>`);
      parts.push(`<circle cx="180" cy="200" r="1" fill="${fc.p}" opacity="0.15"><animate attributeName="r" values="1;110;1" dur="8s" repeatCount="indefinite"/></circle>`);
      parts.push(`<circle cx="180" cy="200" r="1" fill="none" stroke="${fc.p}" stroke-width="0.3" opacity="0.08"><animate attributeName="r" values="1;130;1" dur="10s" repeatCount="indefinite"/></circle>`);
      for (let i = 0; i < 5; i++) {
        const y = 100 + i * 60;
        parts.push(`<line x1="60" y1="${y}" x2="300" y2="${y}" stroke="${fc.p}" stroke-width="0.15" opacity="${(0.06 - i*0.01).toFixed(3)}"/>`);
      }
      break;
    }
    case "b2_silenzio": {
      parts.push(HGLOW(180,200,90,"#1e3a5f",id));
      for (let i = 0; i < 7; i++) {
        const r = 18 + i * 18;
        const op = 0.35 - i * 0.045;
        parts.push(`<circle cx="180" cy="200" r="${r}" fill="none" stroke="${fc.t}" stroke-width="${(1.3 - i*0.15).toFixed(1)}" opacity="${Math.max(0,op).toFixed(2)}"><animate attributeName="r" values="${r};${r+12};${r}" dur="${(3+i*0.5).toFixed(1)}s" repeatCount="indefinite"/><animate attributeName="opacity" values="${Math.max(0,op).toFixed(2)};0;${Math.max(0,op).toFixed(2)}" dur="${(3+i*0.5).toFixed(1)}s" repeatCount="indefinite"/></circle>`);
      }
      parts.push(`<line x1="80" y1="160" x2="280" y2="160" stroke="${fc.t}" stroke-width="0.3" opacity="0.12"/>`);
      parts.push(`<line x1="100" y1="240" x2="260" y2="240" stroke="${fc.t}" stroke-width="0.3" opacity="0.12"/>`);
      parts.push(`<line x1="175" y1="195" x2="185" y2="205" stroke="${fc.t}" stroke-width="1.5" opacity="0.15"/>`);
      parts.push(`<line x1="185" y1="195" x2="175" y2="205" stroke="${fc.t}" stroke-width="1.5" opacity="0.15"/>`);
      break;
    }
    case "b3_oblio": {
      parts.push(HGLOW(180,200,120,"#1e3a5f",id));
      parts.push(`<ellipse cx="180" cy="180" rx="20" ry="26" fill="#000814" stroke="${fc.t}33" stroke-width="1" opacity="0.45"/>`);
      parts.push(`<ellipse cx="180" cy="240" rx="26" ry="33" fill="#000814" stroke="${fc.t}33" stroke-width="1" opacity="0.45"/>`);
      for (let i = 0; i < 30; i++) {
        const t = i * 0.3;
        const x = 180 + Math.cos(t) * (10 + i * 2);
        const y = 260 + i * 3;
        const op = 0.45 - i * 0.013;
        parts.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1 - i*0.02).toFixed(1)}" fill="${fc.t}" opacity="${Math.max(0,op).toFixed(2)}"><animate attributeName="cy" values="${y.toFixed(1)};${(y+35).toFixed(1)};${y.toFixed(1)}" dur="${(3+(i%4)*0.5).toFixed(1)}s" repeatCount="indefinite"/></circle>`);
      }
      parts.push(`<line x1="135" y1="180" x2="225" y2="180" stroke="#1e3a5f" stroke-width="0.5" opacity="0.3"/>`);
      parts.push(`<line x1="145" y1="200" x2="215" y2="200" stroke="#1e3a5f" stroke-width="0.5" opacity="0.2"/>`);
      break;
    }
    case "b4_neve": {
      parts.push(HGLOW(180,100,70,"#93c5fd",id));
      for (let i = 0; i < 40; i++) {
        const x = 20 + (i * 8.5) % 320;
        const y = -10 + i * 11;
        const r = 0.3 + (i % 3) * 0.3;
        const op = 0.55 - i * 0.01;
        if (y < 480) parts.push(`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="${fc.t}" opacity="${Math.max(0.08,op).toFixed(2)}"><animate attributeName="cy" values="${y.toFixed(0)};${(y+120).toFixed(0)};${y.toFixed(0)}" dur="${(6+(i%4)).toFixed(0)}s" repeatCount="indefinite"/></circle>`);
      }
      for (const [sx,sy] of [[140,160],[220,140],[180,250],[110,280],[250,200]]) {
        parts.push(`<g transform="translate(${sx},${sy}) scale(0.5)"><line x1="-7" y1="0" x2="7" y2="0" stroke="${fc.t}" stroke-width="0.5" opacity="0.35"/><line x1="0" y1="-7" x2="0" y2="7" stroke="${fc.t}" stroke-width="0.5" opacity="0.35"/><line x1="-5" y1="-5" x2="5" y2="5" stroke="${fc.t}" stroke-width="0.5" opacity="0.35"/><line x1="5" y1="-5" x2="-5" y2="5" stroke="${fc.t}" stroke-width="0.5" opacity="0.35"/></g>`);
      }
      break;
    }
    case "b5_cenere_blu": {
      parts.push(HGLOW(180,180,90,"#1e3a5f",id));
      for (let i = 0; i < 50; i++) {
        const x = 30 + i * 6 + rnd() * 15;
        const y = 60 + i * 7;
        const r = 0.3 + Math.sin(i * 0.7) * 0.7;
        const op = 0.45 - i * 0.007;
        if (y < 460) parts.push(`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${Math.abs(r).toFixed(1)}" fill="#93c5fd" opacity="${Math.max(0.04,op).toFixed(2)}"><animate attributeName="cx" values="${x.toFixed(0)};${(x+Math.sin(i)*12).toFixed(0)};${x.toFixed(0)}" dur="${(3+(i%5)).toFixed(0)}s" repeatCount="indefinite"/><animate attributeName="cy" values="${y.toFixed(0)};${(y-15).toFixed(0)};${y.toFixed(0)}" dur="${(4+(i%4)*0.5).toFixed(1)}s" repeatCount="indefinite"/></circle>`);
      }
      parts.push(`<ellipse cx="180" cy="340" rx="80" ry="20" fill="#3b82f608"/>`);
      break;
    }
    case "b6_abisso": {
      parts.push(HGLOW(180,340,70,"#1e3a5f",id));
      for (let i = 0; i < 14; i++) {
        const w = 200 - i * 12;
        const y = 30 + i * 30;
        const op = 0.28 - i * 0.018;
        parts.push(`<ellipse cx="180" cy="${y}" rx="${w/2}" ry="${(10+i*2).toFixed(0)}" fill="none" stroke="${fc.t}" stroke-width="${(1.3 - i*0.08).toFixed(1)}" opacity="${Math.max(0.02,op).toFixed(2)}"/>`);
      }
      parts.push(`<ellipse cx="180" cy="240" rx="28" ry="55" fill="#000814" opacity="0.8"/>`);
      parts.push(`<ellipse cx="180" cy="240" rx="18" ry="38" fill="#000" opacity="0.9"/>`);
      for (let i = 0; i < 12; i++) {
        const x = 140 + rnd() * 80;
        const y = 350 - i * 22;
        parts.push(`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(0.4+rnd()*0.5).toFixed(1)}" fill="${fc.t}" opacity="${(0.08+rnd()*0.15).toFixed(2)}"><animate attributeName="cy" values="${y.toFixed(0)};${(y-40).toFixed(0)};${y.toFixed(0)}" dur="${(3+rnd()*3).toFixed(1)}s" repeatCount="indefinite"/></circle>`);
      }
      break;
    }
    case "b7_pioggia": {
      parts.push(HGLOW(180,100,90,"#1e3a5f",id));
      for (let i = 0; i < 35; i++) {
        const x = 20 + i * 9;
        const y1 = -50 + (i * 17) % 200;
        const y2 = y1 + 60 + (i % 3) * 10;
        const op = 0.3 - i * 0.005;
        parts.push(`<line x1="${x.toFixed(0)}" y1="${y1.toFixed(0)}" x2="${(x-2).toFixed(0)}" y2="${y2.toFixed(0)}" stroke="${fc.t}" stroke-width="0.5" opacity="${Math.max(0.04,op).toFixed(2)}"><animate attributeName="y1" values="${y1.toFixed(0)};${(y1+600).toFixed(0)};${y1.toFixed(0)}" dur="${(1+(i%3)*0.3).toFixed(1)}s" repeatCount="indefinite"/><animate attributeName="y2" values="${y2.toFixed(0)};${(y2+600).toFixed(0)};${y2.toFixed(0)}" dur="${(1+(i%3)*0.3).toFixed(1)}s" repeatCount="indefinite"/></line>`);
      }
      parts.push(`<ellipse cx="180" cy="380" rx="110" ry="18" fill="#000814" opacity="0.5"/>`);
      parts.push(`<ellipse cx="180" cy="380" rx="90" ry="12" fill="none" stroke="${fc.t}" stroke-width="0.3" opacity="0.15"><animate attributeName="rx" values="90;120;90" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.15;0;0.15" dur="3s" repeatCount="indefinite"/></ellipse>`);
      break;
    }
    case "b8_fantasma": {
      parts.push(HGLOW(180,200,90,"#3b82f6",id));
      parts.push(`<ellipse cx="180" cy="175" rx="20" ry="23" fill="${fc.t}12" stroke="${fc.t}44" stroke-width="1" opacity="0.45"/>`);
      parts.push(`<path d="M160,200 L160,280 Q160,300 180,300 Q200,300 200,280 L200,200" fill="${fc.t}08" stroke="${fc.t}33" stroke-width="0.8" opacity="0.35"/>`);
      for (let i = 0; i < 5; i++) {
        const bx = 160 + i * 10;
        parts.push(`<path d="M${bx},280 Q${bx+5},300 ${bx},310" fill="none" stroke="${fc.t}" stroke-width="0.5" opacity="${(0.25 - i*0.035).toFixed(2)}"><animate attributeName="d" values="M${bx},280 Q${bx+5},300 ${bx},310;M${bx},280 Q${bx+8},305 ${bx},315;M${bx},280 Q${bx+5},300 ${bx},310" dur="${(2+i*0.3).toFixed(1)}s" repeatCount="indefinite"/></path>`);
      }
      parts.push(`<circle cx="172" cy="172" r="2.5" fill="${fc.t}" opacity="0.45"/>`);
      parts.push(`<circle cx="188" cy="172" r="2.5" fill="${fc.t}" opacity="0.45"/>`);
      break;
    }
    case "b9_rovine": {
      parts.push(HGLOW(180,200,90,"#1e3a5f",id));
      parts.push(`<rect x="80" y="150" width="18" height="190" fill="#0a0a14" stroke="${fc.t}33" stroke-width="1" opacity="0.55"/>`);
      parts.push(`<rect x="260" y="170" width="18" height="170" fill="#0a0a14" stroke="${fc.t}33" stroke-width="1" opacity="0.55"/>`);
      parts.push(`<polygon points="80,150 89,170 89,150" fill="#000814" opacity="0.7"/>`);
      parts.push(`<polygon points="98,150 89,160 98,170" fill="#000814" opacity="0.7"/>`);
      parts.push(`<rect x="98" y="200" width="162" height="8" fill="#0a0a14" stroke="${fc.t}22" stroke-width="0.5" opacity="0.35"/>`);
      for (let i = 0; i < 8; i++) {
        const x = 60 + i * 30 + Math.sin(i) * 10;
        const y = 320 + Math.cos(i) * 18;
        parts.push(`<polygon points="${x.toFixed(0)},${y.toFixed(0)} ${(x+5).toFixed(0)},${(y-3).toFixed(0)} ${(x+8).toFixed(0)},${(y+2).toFixed(0)} ${(x+3).toFixed(0)},${(y+5).toFixed(0)}" fill="${fc.t}22" opacity="0.25"/>`);
      }
      for (let i = 0; i < 8; i++) {
        parts.push(`<circle cx="${(70+rnd()*220).toFixed(0)}" cy="${(160+rnd()*180).toFixed(0)}" r="0.5" fill="${fc.t}" opacity="${(0.08+rnd()*0.15).toFixed(2)}"/>`);
      }
      break;
    }
    case "b10_ghiaccio": {
      parts.push(HGLOW(180,190,90,"#93c5fd",id));
      parts.push(`<path d="M180,140 L150,170 Q130,200 150,220 L180,250 L210,220 Q230,200 210,170 Z" fill="${fc.t}18" stroke="#93c5fd" stroke-width="1.5" opacity="0.65"/>`);
      parts.push(`<line x1="180" y1="140" x2="180" y2="250" stroke="#fff" stroke-width="0.5" opacity="0.25"/>`);
      parts.push(`<line x1="180" y1="195" x2="150" y2="220" stroke="#fff" stroke-width="0.3" opacity="0.15"/>`);
      parts.push(`<line x1="180" y1="195" x2="210" y2="220" stroke="#fff" stroke-width="0.3" opacity="0.15"/>`);
      for (let i = 0; i < 12; i++) {
        parts.push(`<circle cx="${(100+rnd()*160).toFixed(0)}" cy="${(100+rnd()*180).toFixed(0)}" r="${(0.3+rnd()*0.8).toFixed(1)}" fill="#fff" opacity="${(0.08+rnd()*0.25).toFixed(2)}"><animate attributeName="opacity" values="${(0.04+rnd()*0.15).toFixed(2)};${(0.12+rnd()*0.25).toFixed(2)};${(0.04+rnd()*0.15).toFixed(2)}" dur="${(1+rnd()*3).toFixed(1)}s" repeatCount="indefinite"/></circle>`);
      }
      parts.push(`<ellipse cx="160" cy="260" rx="18" ry="4" fill="#93c5fd" opacity="0.08"><animate attributeName="opacity" values="0.08;0;0.08" dur="3s" repeatCount="indefinite"/></ellipse>`);
      break;
    }
    // ========== SOGNO (s1-s10: Cyan illusions) ==========
    case "s1_miraggio": {
      const cyan = "#22d3ee";
      parts.push(HGLOW(180,180,90,"#0891b2",id));
      for (let i = 0; i < 6; i++) {
        const y = 150 + i * 40;
        const op = 0.12 - i * 0.015;
        parts.push(`<path d="M60,${y} Q120,${y-8} 180,${y} Q240,${y+8} 300,${y}" fill="none" stroke="${cyan}" stroke-width="${(1.3 - i*0.18).toFixed(1)}" opacity="${Math.max(0.015,op).toFixed(2)}"><animate attributeName="d" values="M60,${y} Q120,${y-8} 180,${y} Q240,${y+8} 300,${y};M60,${y} Q120,${y+8} 180,${y} Q240,${y-8} 300,${y};M60,${y} Q120,${y-8} 180,${y} Q240,${y+8} 300,${y}" dur="${(2+i*0.3).toFixed(1)}s" repeatCount="indefinite"/></path>`);
      }
      parts.push(`<ellipse cx="180" cy="240" rx="45" ry="18" fill="${cyan}12" opacity="0.35"/>`);
      parts.push(`<ellipse cx="180" cy="240" rx="28" ry="8" fill="${cyan}15" opacity="0.25"/>`);
      parts.push(`<line x1="180" y1="240" x2="180" y2="195" stroke="${cyan}" stroke-width="1.5" opacity="0.25"/>`);
      parts.push(`<path d="M180,198 Q162,190 148,194" fill="none" stroke="${cyan}" stroke-width="0.8" opacity="0.18"/>`);
      parts.push(`<path d="M180,198 Q198,190 212,194" fill="none" stroke="${cyan}" stroke-width="0.8" opacity="0.18"/>`);
      break;
    }
    case "s2_aurora": {
      const cyan = "#22d3ee";
      parts.push(HGLOW(180,140,70,"#0891b2",id));
      for (let i = 0; i < 5; i++) {
        const yOff = 80 + i * 32;
        const colors = ["#22d3ee","#06b6d4","#0891b2","#67e8f9","#a5f3fc"];
        parts.push(`<path d="M-20,${yOff} Q60,${yOff-35} 140,${yOff-12} Q220,${yOff+8} 300,${yOff-22} Q340,${yOff-28} 380,${yOff-18}" fill="none" stroke="${colors[i]}" stroke-width="${(3 - i*0.5).toFixed(1)}" opacity="${(0.35 - i*0.05).toFixed(2)}" filter="url(#g_${id})"><animate attributeName="opacity" values="${(0.35 - i*0.05).toFixed(2)};${(0.15 - i*0.025).toFixed(2)};${(0.35 - i*0.05).toFixed(2)}" dur="${(3+i*0.8).toFixed(1)}s" repeatCount="indefinite"/></path>`);
      }
      for (let i = 0; i < 3; i++) {
        parts.push(`<path d="M-10,${100+i*50} Q100,${70+i*40} 200,${90+i*40} Q280,${110+i*40} 370,${80+i*40}" fill="none" stroke="${cyan}" stroke-width="0.8" opacity="0.08"/>`);
      }
      for (let i = 0; i < 6; i++) {
        parts.push(`<circle cx="${(30+rnd()*300).toFixed(0)}" cy="${(40+rnd()*90).toFixed(0)}" r="${(0.3+rnd()*0.5).toFixed(1)}" fill="#fff" opacity="${(0.3+rnd()*0.4).toFixed(2)}"/>`);
      }
      break;
    }
    case "s3_nuvola": {
      const cyan = "#22d3ee";
      parts.push(HGLOW(180,150,90,"#0891b2",id));
      for (const [cx,cy,rx,ry] of [[180,180,100,35],[120,210,70,25],[240,220,80,30],[150,250,60,20],[200,270,90,25]]) {
        parts.push(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${cyan}08" stroke="${cyan}22" stroke-width="0.5" opacity="0.45" filter="url(#gm_${id})"/>`);
      }
      for (let i = 0; i < 10; i++) {
        const cx = 80 + rnd() * 200;
        const cy = 120 + rnd() * 160;
        parts.push(`<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${(0.5+rnd()*0.8).toFixed(1)}" fill="${fc.t}" opacity="${(0.08+rnd()*0.18).toFixed(2)}"><animate attributeName="cy" values="${cy.toFixed(0)};${(cy-20).toFixed(0)};${cy.toFixed(0)}" dur="${(4+rnd()*4).toFixed(1)}s" repeatCount="indefinite"/></circle>`);
      }
      break;
    }
    case "s4_visione": {
      const cyan = "#22d3ee";
      parts.push(HGLOW(180,190,110,"#0891b2",id));
      parts.push(`<ellipse cx="180" cy="190" rx="48" ry="23" fill="#000a14" stroke="${cyan}" stroke-width="1.5" opacity="0.65"/>`);
      parts.push(`<circle cx="180" cy="190" r="16" fill="${cyan}18" stroke="${cyan}" stroke-width="1" opacity="0.55"/>`);
      parts.push(`<circle cx="180" cy="190" r="7" fill="${cyan}35" opacity="0.45"/>`);
      parts.push(`<circle cx="180" cy="190" r="2.5" fill="#fff" opacity="0.65"/>`);
      for (let i = 0; i < 5; i++) {
        const r = 55 + i * 12;
        parts.push(`<circle cx="180" cy="190" r="${r}" fill="none" stroke="${cyan}" stroke-width="0.5" opacity="${(0.12 - i*0.02).toFixed(2)}"/>`);
      }
      for (let i = 0; i < 12; i++) {
        const a = (i/12)*Math.PI*2;
        parts.push(`<line x1="${(180+Math.cos(a)*52).toFixed(0)}" y1="${(190+Math.sin(a)*52).toFixed(0)}" x2="${(180+Math.cos(a)*125).toFixed(0)}" y2="${(190+Math.sin(a)*125).toFixed(0)}" stroke="${cyan}" stroke-width="0.3" opacity="0.12"/>`);
      }
      break;
    }
    case "s5_stella": {
      const cyan = "#22d3ee";
      parts.push(HGLOW(240,150,55,"#22d3ee",id));
      for (let i = 0; i < 20; i++) {
        const x = 280 - i * 9;
        const y = 130 + i * 3.5;
        const op = 0.7 - i * 0.03;
        const r = (2 - i * 0.08);
        parts.push(`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${Math.max(0.1,r).toFixed(1)}" fill="${fc.t}" opacity="${Math.max(0,op).toFixed(2)}"/>`);
      }
      parts.push(`<circle cx="280" cy="130" r="4" fill="#fff" opacity="0.9"/>`);
      parts.push(`<circle cx="280" cy="130" r="10" fill="${cyan}" opacity="0.25" filter="url(#gm_${id})"/>`);
      for (let i = 0; i < 8; i++) {
        parts.push(`<circle cx="${(40+rnd()*280).toFixed(0)}" cy="${(50+rnd()*280).toFixed(0)}" r="${(0.3+rnd()*0.7).toFixed(1)}" fill="#fff" opacity="${(0.15+rnd()*0.35).toFixed(2)}"/>`);
      }
      break;
    }
    case "s6_labirinto": {
      const cyan = "#22d3ee";
      parts.push(HGLOW(180,200,90,"#0891b2",id));
      for (let i = 0; i < 8; i++) {
        const r = 12 + i * 12;
        const offset = i % 2 === 0 ? 0 : 45;
        const a1 = offset * Math.PI / 180;
        const a2 = (offset + 270) * Math.PI / 180;
        parts.push(`<path d="M${180+Math.cos(a1)*r},${200+Math.sin(a1)*r} A${r},${r} 0 0,1 ${180+Math.cos(a2)*r},${200+Math.sin(a2)*r}" fill="none" stroke="${cyan}" stroke-width="${(0.4 + i*0.2).toFixed(1)}" opacity="${(0.35 - i*0.035).toFixed(2)}"/>`);
      }
      for (let i = 0; i < 6; i++) {
        const pts = [];
        for (let j = 0; j <= 18; j++) {
          const t = j * 0.2;
          const r2 = 8 + t * 3;
          pts.push(`${(180+Math.cos(t+i)*r2).toFixed(0)},${(200+Math.sin(t*1.3+i)*r2).toFixed(0)}`);
        }
        parts.push(`<polyline points="${pts.join(" ")}" fill="none" stroke="${fc.t}" stroke-width="0.5" opacity="${(0.25 - i*0.035).toFixed(2)}"/>`);
      }
      parts.push(`<circle cx="180" cy="200" r="2.5" fill="#fff" opacity="0.45"><animate attributeName="opacity" values="0.45;0.08;0.45" dur="2s" repeatCount="indefinite"/></circle>`);
      break;
    }
    case "s7_farfalla": {
      const cyan = "#22d3ee";
      parts.push(HGLOW(180,190,90,cyan,id));
      parts.push(`<path d="M180,190 Q130,130 80,150 Q100,190 180,210" fill="${cyan}12" stroke="${cyan}" stroke-width="1.5" opacity="0.55"/>`);
      parts.push(`<path d="M180,190 Q130,220 80,210 Q110,240 180,220" fill="${cyan}10" stroke="${fc.t}" stroke-width="0.8" opacity="0.35"/>`);
      parts.push(`<path d="M180,190 Q230,130 280,150 Q260,190 180,210" fill="${cyan}12" stroke="${cyan}" stroke-width="1.5" opacity="0.55"/>`);
      parts.push(`<path d="M180,190 Q230,220 280,210 Q250,240 180,220" fill="${cyan}10" stroke="${fc.t}" stroke-width="0.8" opacity="0.35"/>`);
      parts.push(`<ellipse cx="180" cy="200" rx="3.5" ry="18" fill="${cyan}" opacity="0.45"/>`);
      parts.push(`<path d="M180,180 Q170,160 160,150" fill="none" stroke="${cyan}" stroke-width="0.8" opacity="0.35"/>`);
      parts.push(`<path d="M180,180 Q190,160 200,150" fill="none" stroke="${cyan}" stroke-width="0.8" opacity="0.35"/>`);
      parts.push(`<circle cx="180" cy="200" r="45" fill="none" stroke="${cyan}" stroke-width="0.5" opacity="0.18"><animate attributeName="r" values="45;65;45" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.18;0;0.18" dur="3s" repeatCount="indefinite"/></circle>`);
      break;
    }
    case "s8_castello": {
      const cyan = "#22d3ee";
      parts.push(HGLOW(180,150,80,cyan,id));
      parts.push(`<rect x="130" y="140" width="22" height="65" fill="${cyan}12" stroke="${cyan}" stroke-width="0.8" opacity="0.55"/>`);
      parts.push(`<rect x="208" y="140" width="22" height="65" fill="${cyan}12" stroke="${cyan}" stroke-width="0.8" opacity="0.55"/>`);
      parts.push(`<rect x="152" y="160" width="56" height="45" fill="${cyan}10" stroke="${cyan}" stroke-width="0.8" opacity="0.45"/>`);
      parts.push(`<polygon points="130,140 141,120 152,140" fill="${cyan}18" stroke="${cyan}" stroke-width="0.5" opacity="0.45"/>`);
      parts.push(`<polygon points="208,140 219,120 230,140" fill="${cyan}18" stroke="${cyan}" stroke-width="0.5" opacity="0.45"/>`);
      for (const [cx,cy,rx,ry] of [[180,250,100,20],[130,270,80,18],[230,280,70,15],[180,300,120,25]]) {
        parts.push(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${cyan}06" stroke="${cyan}15" stroke-width="0.5" opacity="0.35"/>`);
      }
      parts.push(`<circle cx="180" cy="165" r="3.5" fill="#fff" opacity="0.45"><animate attributeName="opacity" values="0.45;0.08;0.45" dur="2s" repeatCount="indefinite"/></circle>`);
      break;
    }
    case "s9_rugiada": {
      const cyan = "#22d3ee";
      parts.push(HGLOW(180,200,70,"#0891b2",id));
      parts.push(`<path d="M100,240 Q140,180 180,200 Q220,220 260,240 Q220,300 180,280 Q140,260 100,240 Z" fill="#064e3b" stroke="${cyan}" stroke-width="0.8" opacity="0.45"/>`);
      parts.push(`<line x1="180" y1="200" x2="180" y2="280" stroke="${cyan}" stroke-width="0.3" opacity="0.25"/>`);
      parts.push(`<path d="M180,220 Q150,230 120,240" fill="none" stroke="${cyan}" stroke-width="0.2" opacity="0.15"/>`);
      parts.push(`<path d="M180,230 Q200,240 240,240" fill="none" stroke="${cyan}" stroke-width="0.2" opacity="0.15"/>`);
      for (const [dx,dy,dr] of [[160,230,4],[200,235,3],[170,250,3.5],[190,260,2.5]]) {
        parts.push(`<circle cx="${dx}" cy="${dy}" r="${dr}" fill="${cyan}25" stroke="${cyan}" stroke-width="0.3" opacity="0.55"/>`);
        parts.push(`<ellipse cx="${(dx-dr*0.3).toFixed(0)}" cy="${(dy-dr*0.3).toFixed(0)}" rx="${(dr*0.3).toFixed(1)}" ry="${(dr*0.15).toFixed(1)}" fill="#fff" opacity="0.25"/>`);
      }
      parts.push(`<circle cx="180" cy="120" r="35" fill="${cyan}06" filter="url(#g_${id})"/>`);
      break;
    }
    case "s10_infinito": {
      const cyan = "#22d3ee";
      parts.push(HGLOW(180,200,130,"#22d3ee",id));
      parts.push(HGLOW(180,200,60,"#0891b2",id));
      parts.push(`<path d="M120,190 C100,150 160,150 180,190 C200,230 260,230 240,190 C220,150 160,150 180,190 C200,230 260,230 240,190" fill="none" stroke="${cyan}" stroke-width="3" opacity="0.65" filter="url(#gm_${id})"/>`);
      parts.push(`<path d="M120,190 C100,150 160,150 180,190 C200,230 260,230 240,190 C220,150 160,150 180,190 C200,230 260,230 240,190" fill="none" stroke="#fff" stroke-width="1" opacity="0.35"/>`);
      for (let i = 0; i < 25; i++) {
        const a = i * 0.4;
        const r = 10 + i * 3.8;
        const x = 180 + Math.cos(a) * r * 0.8;
        const y = 190 + Math.sin(a * 1.2) * r * 0.6;
        const op = 0.45 - i * 0.015;
        parts.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.4+Math.sin(i)*0.5).toFixed(1)}" fill="${fc.t}" opacity="${Math.max(0,op).toFixed(2)}"><animate attributeName="opacity" values="${Math.max(0,op).toFixed(2)};0;${Math.max(0,op).toFixed(2)}" dur="${(2+(i%4)*0.3).toFixed(1)}s" repeatCount="indefinite"/></circle>`);
      }
      parts.push(`<circle cx="180" cy="190" r="5" fill="#fff" opacity="0.75"><animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite"/></circle>`);
      break;
    }
    // ========== ECO (e1-e10: Emerald nature) ==========
    case "e1_radice": {
      const green = "#34d399";
      parts.push(HGLOW(180,200,70,"#065f46",id));
      parts.push(`<path d="M0,165 Q90,155 180,170 Q270,185 360,160 L360,360 L0,360 Z" fill="#064e3b" opacity="0.35"/>`);
      for (let i = 0; i < 5; i++) {
        const rx = [140,160,180,200,220][i];
        const ry = [150,130,160,140,155][i];
        const pts = [];
        pts.push(`${rx},${ry}`);
        for (let j = 0; j < 8; j++) {
          const lx = rx + Math.sin(j * 0.8 + i) * (12 + j * 3);
          const ly = ry + 20 + j * 20;
          pts.push(`${lx.toFixed(0)},${ly.toFixed(0)}`);
        }
        parts.push(`<polyline points="${pts.join(" ")}" fill="none" stroke="${green}" stroke-width="${(1.3 - i*0.18).toFixed(1)}" opacity="${(0.45 - i*0.07).toFixed(2)}"/>`);
      }
      for (const [nx,ny,nr] of [[150,210,3],[170,190,2.5],[200,230,2],[185,270,3],[160,250,2]]) {
        parts.push(`<circle cx="${nx}" cy="${ny}" r="${nr}" fill="${green}" opacity="${(0.25+rnd()*0.2).toFixed(2)}"><animate attributeName="opacity" values="0.15;0.35;0.15" dur="${(1.5+rnd()*2).toFixed(1)}s" repeatCount="indefinite"/></circle>`);
      }
      break;
    }
    case "e2_germoglio": {
      const green = "#34d399";
      parts.push(HGLOW(180,190,60,green,id));
      parts.push(`<path d="M0,230 Q180,220 360,230 L360,360 L0,360 Z" fill="#064e3b" opacity="0.3"/>`);
      parts.push(`<line x1="180" y1="240" x2="180" y2="200" stroke="${green}" stroke-width="2" opacity="0.5"/>`);
      parts.push(`<path d="M180,200 Q165,190 155,180 Q170,185 180,195" fill="${green}20" stroke="${green}" stroke-width="0.8" opacity="0.5"/>`);
      parts.push(`<path d="M180,205 Q195,195 205,185 Q190,190 180,200" fill="${green}20" stroke="${green}" stroke-width="0.8" opacity="0.5"/>`);
      parts.push(`<ellipse cx="180" cy="195" rx="8" ry="5" fill="${green}30" opacity="0.45"/>`);
      parts.push(`<circle cx="180" cy="190" r="1.5" fill="#fff" opacity="0.5"><animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" repeatCount="indefinite"/></circle>`);
      // Tiny water drops
      for (const [dx,dy] of [[155,205],[205,210]]) {
        parts.push(`<circle cx="${dx}" cy="${dy}" r="1" fill="#a7f3d0" opacity="0.3"/>`);
      }
      break;
    }
    case "e3_foresta": {
      const green = "#34d399";
      parts.push(HGLOW(180,200,100,"#065f46",id));
      for (let i = 0; i < 7; i++) {
        const tx = 50 + i * 40;
        const th = 120 + Math.sin(i) * 30;
        parts.push(`<path d="M${tx-4},320 L${tx-2},${200+th} L${tx+2},${200+th} L${tx+4},320 Z" fill="#064e3b" stroke="${green}33" stroke-width="0.5" opacity="${(0.5 - i*0.05).toFixed(2)}"/>`);
        parts.push(`<circle cx="${tx}" cy="${170+th*0.5}" r="${25 + i*3}" fill="${green}10" filter="url(#g_${id})"/>`);
      }
      // Sound wave rings
      for (let i = 0; i < 3; i++) {
        const r = 30 + i * 20;
        parts.push(`<ellipse cx="180" cy="220" rx="${r}" ry="${r*0.4}" fill="none" stroke="${green}" stroke-width="0.5" opacity="${(0.2 - i*0.05).toFixed(2)}"><animate attributeName="rx" values="${r};${r+15};${r}" dur="${(3+i).toFixed(1)}s" repeatCount="indefinite"/><animate attributeName="opacity" values="${(0.2 - i*0.05).toFixed(2)};0;${(0.2 - i*0.05).toFixed(2)}" dur="${(3+i).toFixed(1)}s" repeatCount="indefinite"/></ellipse>`);
      }
      parts.push(`<ellipse cx="180" cy="330" rx="140" ry="25" fill="${green}08"/>`);
      break;
    }
    case "e4_pioggia_smeraldo": {
      const green = "#34d399";
      parts.push(HGLOW(180,120,80,"#065f46",id));
      for (let i = 0; i < 35; i++) {
        const x = 15 + i * 9.5;
        const y1 = -30 + (i * 13) % 180;
        const y2 = y1 + 50 + (i % 4) * 8;
        const op = 0.3 - i * 0.005;
        parts.push(`<line x1="${x.toFixed(0)}" y1="${y1.toFixed(0)}" x2="${(x-1.5).toFixed(0)}" y2="${y2.toFixed(0)}" stroke="${green}" stroke-width="0.6" opacity="${Math.max(0.03,op).toFixed(2)}"><animate attributeName="y1" values="${y1.toFixed(0)};${(y1+500).toFixed(0)};${y1.toFixed(0)}" dur="${(1.2+(i%3)*0.3).toFixed(1)}s" repeatCount="indefinite"/><animate attributeName="y2" values="${y2.toFixed(0)};${(y2+500).toFixed(0)};${y2.toFixed(0)}" dur="${(1.2+(i%3)*0.3).toFixed(1)}s" repeatCount="indefinite"/></line>`);
      }
      parts.push(`<ellipse cx="180" cy="370" rx="120" ry="20" fill="#064e3b" opacity="0.4"/>`);
      parts.push(`<ellipse cx="180" cy="370" rx="100" ry="12" fill="none" stroke="${green}" stroke-width="0.3" opacity="0.12"><animate attributeName="rx" values="100;130;100" dur="2.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.12;0;0.12" dur="2.5s" repeatCount="indefinite"/></ellipse>`);
      break;
    }
    case "e5_ciclo": {
      const green = "#34d399";
      parts.push(HGLOW(180,200,90,"#065f46",id));
      // Circular cycle of leaves/seasons
      for (let i = 0; i < 8; i++) {
        const r = 55;
        const a = (i / 8) * Math.PI * 2;
        const px = 180 + Math.cos(a) * r;
        const py = 200 + Math.sin(a) * r;
        parts.push(`<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="12" ry="6" fill="${green}20" stroke="${green}" stroke-width="0.5" opacity="0.5" transform="rotate(${(i*45).toFixed(0)} ${px.toFixed(1)} ${py.toFixed(1)})"/>`);
      }
      parts.push(`<circle cx="180" cy="200" r="30" fill="none" stroke="${green}" stroke-width="1" opacity="0.35"/>`);
      parts.push(`<circle cx="180" cy="200" r="55" fill="none" stroke="${green}" stroke-width="1.5" opacity="0.45"/>`);
      // Arrow-like cycle indicators
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI/4;
        parts.push(`<path d="M${(180+Math.cos(a)*70).toFixed(0)},${(200+Math.sin(a)*70).toFixed(0)} L${(180+Math.cos(a+0.15)*75).toFixed(0)},${(200+Math.sin(a+0.15)*75).toFixed(0)} L${(180+Math.cos(a-0.15)*75).toFixed(0)},${(200+Math.sin(a-0.15)*75).toFixed(0)} Z" fill="${green}" opacity="0.3"/>`);
      }
      parts.push(`<circle cx="180" cy="200" r="4" fill="#fff" opacity="0.5"/>`);
      break;
    }
    case "e6_quercia": {
      const green = "#34d399";
      parts.push(HGLOW(180,160,70,"#065f46",id));
      // Massive trunk
      parts.push(`<path d="M155,320 L160,180 Q160,130 180,110 Q200,130 200,180 L205,320 Z" fill="#064e3b" stroke="${green}44" stroke-width="1" opacity="0.5"/>`);
      // Roots
      parts.push(`<path d="M155,300 Q120,310 100,320" fill="none" stroke="#064e3b" stroke-width="4" opacity="0.4"/>`);
      parts.push(`<path d="M205,300 Q240,310 260,320" fill="none" stroke="#064e3b" stroke-width="4" opacity="0.4"/>`);
      // Canopy
      for (const [cx,cy,cr] of [[150,130,50],[210,130,50],[180,100,55],[130,150,40],[230,150,40]]) {
        parts.push(`<circle cx="${cx}" cy="${cy}" r="${cr}" fill="${green}12" filter="url(#g_${id})"/>`);
        parts.push(`<circle cx="${cx}" cy="${cy}" r="${cr}" fill="none" stroke="${green}" stroke-width="0.5" opacity="0.3"/>`);
      }
      // Fallen leaves
      for (let i = 0; i < 8; i++) {
        const lx = 100 + rnd() * 160;
        const ly = 280 + rnd() * 30;
        parts.push(`<ellipse cx="${lx.toFixed(0)}" cy="${ly.toFixed(0)}" rx="2" ry="1" fill="${green}" opacity="${(0.15+rnd()*0.25).toFixed(2)}" transform="rotate(${rnd()*360} ${lx.toFixed(0)} ${ly.toFixed(0)})"/>`);
      }
      break;
    }
    case "e7_muschio": {
      const green = "#34d399";
      parts.push(HGLOW(180,240,60,"#065f46",id));
      parts.push(`<path d="M40,200 Q110,180 180,210 Q250,240 320,200 L320,350 L40,350 Z" fill="#064e3b" opacity="0.35"/>`);
      // Stone
      parts.push(`<ellipse cx="180" cy="250" rx="60" ry="35" fill="#1a1a1a" stroke="${green}33" stroke-width="0.5" opacity="0.45"/>`);
      // Moss dots on stone
      for (let i = 0; i < 20; i++) {
        const mx = 140 + rnd() * 80;
        const my = 230 + rnd() * 35;
        parts.push(`<circle cx="${mx.toFixed(0)}" cy="${my.toFixed(0)}" r="${(0.5+rnd()*1.5).toFixed(1)}" fill="${green}" opacity="${(0.15+rnd()*0.35).toFixed(2)}"/>`);
      }
      // Soft moss clumps
      for (const [mx,my,mr] of [[130,240,8],[160,230,10],[200,245,7],[220,235,9],[170,255,6]]) {
        parts.push(`<circle cx="${mx}" cy="${my}" r="${mr}" fill="${green}20" filter="url(#gm_${id})"/>`);
      }
      break;
    }
    case "e8_vento": {
      const green = "#34d399";
      parts.push(HGLOW(180,200,80,"#065f46",id));
      // Wind swirl paths
      for (let i = 0; i < 4; i++) {
        const yBase = 160 + i * 40;
        parts.push(`<path d="M-10,${yBase} Q80,${yBase-25} 180,${yBase} Q280,${yBase+25} 370,${yBase}" fill="none" stroke="${green}" stroke-width="${(1.5 - i*0.25).toFixed(1)}" opacity="${(0.4 - i*0.08).toFixed(2)}"><animate attributeName="d" values="M-10,${yBase} Q80,${yBase-25} 180,${yBase} Q280,${yBase+25} 370,${yBase};M-10,${yBase+8} Q80,${yBase-17} 180,${yBase+8} Q280,${yBase+33} 370,${yBase+8};M-10,${yBase} Q80,${yBase-25} 180,${yBase} Q280,${yBase+25} 370,${yBase}" dur="${(2.5+i*0.3).toFixed(1)}s" repeatCount="indefinite"/></path>`);
      }
      // Leaves caught in wind
      for (let i = 0; i < 8; i++) {
        const lx = 40 + i * 40;
        const ly = 180 + Math.sin(i * 1.3) * 50;
        parts.push(`<ellipse cx="${lx}" cy="${ly.toFixed(0)}" rx="2.5" ry="1.5" fill="${green}" opacity="${(0.15+rnd()*0.2).toFixed(2)}" transform="rotate(${(i*35).toFixed(0)} ${lx} ${ly.toFixed(0)}"><animate attributeName="cx" values="${lx};${lx+20};${lx}" dur="${(3+rnd()*2).toFixed(1)}s" repeatCount="indefinite"/></ellipse>`);
      }
      break;
    }
    case "e9_pietra": {
      const green = "#34d399";
      parts.push(HGLOW(180,200,100,green,id));
      parts.push(`<ellipse cx="180" cy="210" rx="45" ry="50" fill="#064e3b" stroke="${green}" stroke-width="1.5" opacity="0.55"/>`);
      // Glowing runes/alchemy symbols
      parts.push(`<path d="M180,170 L190,185 L180,200 L170,185 Z" fill="${green}" opacity="0.35"/>`);
      parts.push(`<circle cx="180" cy="215" r="8" fill="none" stroke="${green}" stroke-width="0.8" opacity="0.3"/>`);
      parts.push(`<circle cx="180" cy="215" r="4" fill="${green}30" opacity="0.35"/>`);
      // Radiant glow
      parts.push(`<circle cx="180" cy="200" r="15" fill="${green}" opacity="0.25" filter="url(#g_${id})"/>`);
      parts.push(`<circle cx="180" cy="200" r="5" fill="#fff" opacity="0.5"><animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.5s" repeatCount="indefinite"/></circle>`);
      // Alchemical rings
      for (let i = 0; i < 3; i++) {
        parts.push(`<circle cx="180" cy="200" r="${55+i*15}" fill="none" stroke="${green}" stroke-width="0.5" opacity="${(0.15 - i*0.04).toFixed(2)}"/>`);
      }
      break;
    }
    case "e10_eternita": {
      const green = "#34d399";
      parts.push(HGLOW(180,180,120,"#065f46",id));
      parts.push(HGLOW(180,180,60,green,id));
      // Hourglass shape
      parts.push(`<path d="M155,130 L205,130 L190,200 L205,270 L155,270 L170,200 Z" fill="${green}10" stroke="${green}" stroke-width="1.5" opacity="0.55"/>`);
      // Sand flowing
      parts.push(`<line x1="175" y1="165" x2="185" y2="165" stroke="${green}" stroke-width="0.5" opacity="0.3"/>`);
      parts.push(`<line x1="177" y1="175" x2="183" y2="175" stroke="${green}" stroke-width="0.5" opacity="0.25"/>`);
      parts.push(`<line x1="178" y1="185" x2="182" y2="185" stroke="${green}" stroke-width="0.5" opacity="0.2"/>`);
      // Sand at bottom
      parts.push(`<path d="M162,235 L198,235 L195,260 L165,260 Z" fill="${green}20" opacity="0.4"/>`);
      // Eternal glow
      parts.push(`<circle cx="180" cy="200" r="4" fill="#fff" opacity="0.7"><animate attributeName="opacity" values="0.7;0.1;0.7" dur="3s" repeatCount="indefinite"/></circle>`);
      // Cosmic particles
      for (let i = 0; i < 15; i++) {
        const a = rnd() * Math.PI * 2;
        const r = 40 + rnd() * 80;
        parts.push(`<circle cx="${(180+Math.cos(a)*r).toFixed(0)}" cy="${(180+Math.sin(a)*r).toFixed(0)}" r="${(0.3+rnd()*0.8).toFixed(1)}" fill="${fc.t}" opacity="${(0.1+rnd()*0.25).toFixed(2)}"><animate attributeName="opacity" values="${(0.05+rnd()*0.15).toFixed(2)};${(0.12+rnd()*0.25).toFixed(2)};${(0.05+rnd()*0.15).toFixed(2)}" dur="${(2+rnd()*3).toFixed(1)}s" repeatCount="indefinite"/></circle>`);
      }
      break;
    }
  }

  return parts.join("\n");
}

// ---- MAIN ----
const total = CARDS.length;
for (let idx = 0; idx < total; idx++) {
  const c = CARDS[idx];
  const fc = F[c.type];
  const art = generateArt(c);

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 480" width="360" height="480">
${defs(c.id, fc)}
<g clip-path="url(#c_${c.id})">
${art}
${frame(c)}
</g>
</svg>`;

  writeFileSync(join(OUT, `${c.id}.svg`), svg);
  console.log(`[${idx+1}/${total}] ${c.id} (${c.name})`);
}

console.log("Done! Generated", total, "cards.");
