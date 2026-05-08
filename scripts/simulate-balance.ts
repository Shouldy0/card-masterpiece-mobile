import { CARDS, cardsById, TerritoryId, CardDef } from "../src/game/cards";

type Side = "player" | "ai";
type AiStyle = "aggressive" | "control" | "balanced";

interface PlayedCard {
  uid: string;
  cardId: string;
  side: Side;
  power: number;
}

interface MatchState {
  turn: number;
  maxTurns: number;
  focus: { player: number; ai: number };
  maxFocus: number;
  hp: { player: number; ai: number };
  hand: { player: string[]; ai: string[] };
  deck: { player: string[]; ai: string[] };
  board: Record<TerritoryId, PlayedCard[]>;
  buffs: Record<Side, number>;
  weakens: Record<Side, number>;
  status: "playing" | "ended";
  result?: "win" | "lose" | "draw";
  aiStyle: AiStyle;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildStarterDeck(): string[] {
  return ["v1_ambizione", "v3_nostalgia", "v10_armonia", "o1_chiave_antica", "o3_giocattolo", "o6_giardino", "c1_giullare", "c3_vittima", "c7_bambino", "b2_silenzio", "b4_neve", "b7_pioggia", "s1_miraggio", "s3_nuvola", "s9_citta"];
}

function createInitialMatch(aiStyle: AiStyle): MatchState {
  const aiDeck = shuffle(["v5_follia", "v7_rancore", "o5_cenere", "o8_tempesta", "c5_martire", "c10_boia", "b3_oblio", "b6_abisso", "s8_arcobaleno", "s10_risveglio", "v2_ossessione", "o2_bosco_sacro", "c2_re_caduto", "b5_cenere_blu", "s4_visione"]);
  const pDeck = shuffle(buildStarterDeck());
  return {
    turn: 1,
    maxTurns: 6,
    focus: { player: 3, ai: 4 },
    maxFocus: 6,
    hp: { player: 20, ai: 20 },
    hand: { player: pDeck.slice(0, 5), ai: aiDeck.slice(0, 5) },
    deck: { player: pDeck.slice(5), ai: aiDeck.slice(5) },
    board: { memoria: [], trauma: [], sogno: [] },
    buffs: { player: 0, ai: 0 },
    weakens: { player: 0, ai: 0 },
    status: "playing",
    aiStyle,
  };
}

function powerWithRules(state: MatchState, card: CardDef, side: Side, territory: TerritoryId): number {
  let p = card.power;
  const enemySide: Side = side === "player" ? "ai" : "player";
  if (card.id === "v4_apatia") return p;
  p += state.buffs[side];
  p -= state.weakens[enemySide];
  if (card.type === "archetipo") {
    const others = state.board[territory].filter((o) => o.side === side && cardsById[o.cardId]?.type === "archetipo").length;
    p += others;
    if (card.id === "v2_ossessione") {
      const enemyHand = side === "player" ? state.hand.ai.length : state.hand.player.length;
      if (enemyHand > 3) p += 2;
    }
  }
  if (card.type === "ricordo" && territory === "memoria") p += 2;
  if (territory === "trauma") p -= 1;
  if (territory === "sogno") p += 1;
  return Math.max(0, p);
}

function applyEffect(state: MatchState, card: CardDef, side: Side, territory: TerritoryId) {
  const enemySide: Side = side === "player" ? "ai" : "player";
  switch (card.effect.kind) {
    case "draw":
      for (let i = 0; i < card.effect.amount; i++) {
        const top = state.deck[side].shift();
        if (top) state.hand[side].push(top);
      }
      break;
    case "buff_self": {
      let amount = card.effect.amount;
      if (card.id === "o5_cenere" && state.focus[side] === 0) amount *= 2;
      state.buffs[side] += amount;
      break;
    }
    case "weaken_enemy":
      state.weakens[side] += card.effect.amount;
      break;
    case "heal":
      state.hp[side] = Math.min(20, state.hp[side] + card.effect.amount);
      break;
  }
  if (card.type === "maschera") {
    state.focus[enemySide] = Math.max(0, state.focus[enemySide] - 1);
    if (card.id === "c10_boia") {
      const enemyPower = state.board[territory].filter((o) => o.side === enemySide).reduce((s, o) => s + o.power, 0);
      if (enemyPower > 15) {
        const board = state.board[territory].filter((o) => o.side === enemySide).sort((a, b) => a.power - b.power);
        if (board.length > 0) {
          const target = board[0];
          state.board[territory] = state.board[territory].filter((o) => o.uid !== target.uid);
        }
      }
    }
  }
  if (card.type === "oblio" && card.id === "b1_vuoto") {
    state.buffs = { player: 0, ai: 0 };
    state.weakens = { player: 0, ai: 0 };
  }
}

function aiTurn(state: MatchState) {
  const style = state.aiStyle;
  let safety = 6;
  while (safety-- > 0) {
    const affordable = state.hand.ai
      .map((id) => cardsById[id])
      .filter((c): c is CardDef => !!c && c.cost <= state.focus.ai)
      .sort((a, b) => {
        const score = (card: CardDef) => {
          const efficiency = card.power / Math.max(1, card.cost);
          if (style === "aggressive") return card.power * 1.45 + efficiency * 0.35 + card.cost * 0.25;
          if (style === "control") {
            const utility = card.effect.kind === "weaken_enemy" || card.effect.kind === "heal" || card.effect.kind === "draw" ? 4.5 : 0;
            return efficiency * 1 + utility + card.cost * 0.05;
          }
          return efficiency * 1.35 + card.power * 0.55;
        };
        return score(b) - score(a);
      });
    if (!affordable.length) break;
    const card = affordable[0];
    const tIds: TerritoryId[] = ["memoria", "trauma", "sogno"];
    const scored = tIds
      .map((t) => {
        const aiP = state.board[t].filter((c) => c.side === "ai").reduce((s, c) => s + c.power, 0);
        const plP = state.board[t].filter((c) => c.side === "player").reduce((s, c) => s + c.power, 0);
        const diff = aiP - plP;
        const territoryValue = t === "sogno" ? 1 : t === "memoria" ? 0.8 : 0.6;
        if (style === "aggressive") return { t, score: diff * -0.45 + territoryValue + plP * 0.35 };
        if (style === "control") return { t, score: diff * -1.35 + territoryValue * 0.75 };
        return { t, score: diff * -0.95 + territoryValue };
      })
      .sort((a, b) => b.score - a.score);
    const territory = scored[0].t;
    state.focus.ai -= card.cost;
    const idx = state.hand.ai.indexOf(card.id);
    if (idx >= 0) state.hand.ai.splice(idx, 1);
    applyEffect(state, card, "ai", territory);
    const power = powerWithRules(state, card, "ai", territory);
    state.board[territory].push({ uid: `ai-${state.turn}-${Math.random()}`, cardId: card.id, side: "ai", power });
  }
}

function playerTurnGreedy(state: MatchState) {
  let safety = 6;
  while (safety-- > 0) {
    const affordable = state.hand.player
      .map((id) => cardsById[id])
      .filter((c): c is CardDef => !!c && c.cost <= state.focus.player)
      .sort((a, b) => b.power / Math.max(1, b.cost) - a.power / Math.max(1, a.cost));
    if (!affordable.length) break;
    const card = affordable[0];
    const tIds: TerritoryId[] = ["memoria", "trauma", "sogno"];
    const scored = tIds
      .map((t) => {
        const aiP = state.board[t].filter((c) => c.side === "ai").reduce((s, c) => s + c.power, 0);
        const plP = state.board[t].filter((c) => c.side === "player").reduce((s, c) => s + c.power, 0);
        return { t, score: (aiP - plP) + (t === "sogno" ? 1 : 0) };
      })
      .sort((a, b) => b.score - a.score);
    const territory = scored[0].t;
    state.focus.player -= card.cost;
    const idx = state.hand.player.indexOf(card.id);
    if (idx >= 0) state.hand.player.splice(idx, 1);
    applyEffect(state, card, "player", territory);
    const power = powerWithRules(state, card, "player", territory);
    state.board[territory].push({ uid: `p-${state.turn}-${Math.random()}`, cardId: card.id, side: "player", power });
  }
}

function processEndTurn(state: MatchState) {
  (["memoria", "trauma", "sogno"] as TerritoryId[]).forEach((t) => {
    state.board[t].forEach((o) => {
      if (o.cardId === "e10_eternita") o.power += 1;
    });
  });
  const memoriaPlayer = state.board.memoria.filter((c) => c.side === "player").reduce((sum, c) => sum + c.power, 0);
  const memoriaAi = state.board.memoria.filter((c) => c.side === "ai").reduce((sum, c) => sum + c.power, 0);
  if (memoriaPlayer !== memoriaAi) {
    const controller: Side = memoriaPlayer > memoriaAi ? "player" : "ai";
    const bonusDraw = state.deck[controller].shift();
    if (bonusDraw) state.hand[controller].push(bonusDraw);
  }
  state.buffs = { player: 0, ai: 0 };
  state.weakens = { player: 0, ai: 0 };
  state.turn += 1;
  state.focus.player = Math.min(state.maxFocus, state.turn + 2);
  state.focus.ai = Math.min(state.maxFocus, state.turn + 3);
  const drawP = state.deck.player.shift();
  if (drawP) state.hand.player.push(drawP);
  const drawA = state.deck.ai.shift();
  if (drawA) state.hand.ai.push(drawA);
}

function endMatchIfNeeded(state: MatchState) {
  if (state.turn > state.maxTurns) {
    let pWins = 0;
    let aWins = 0;
    (["memoria", "trauma", "sogno"] as TerritoryId[]).forEach((t) => {
      const p = state.board[t].filter((c) => c.side === "player").reduce((s, c) => s + c.power, 0);
      const a = state.board[t].filter((c) => c.side === "ai").reduce((s, c) => s + c.power, 0);
      if (p > a) pWins++;
      else if (a > p) aWins++;
    });
    state.status = "ended";
    state.result = pWins > aWins ? "win" : pWins < aWins ? "lose" : "draw";
  }
}

function runMatch(style: AiStyle): MatchState["result"] {
  const state = createInitialMatch(style);
  while (state.status === "playing") {
    playerTurnGreedy(state);
    aiTurn(state);
    processEndTurn(state);
    endMatchIfNeeded(state);
  }
  return state.result;
}

function main() {
  const total = Number(process.argv[2] ?? "10");
  const styles: AiStyle[] = ["aggressive", "control", "balanced"];
  const perStyle: Record<AiStyle, { win: number; lose: number; draw: number; total: number }> = {
    aggressive: { win: 0, lose: 0, draw: 0, total: 0 },
    control: { win: 0, lose: 0, draw: 0, total: 0 },
    balanced: { win: 0, lose: 0, draw: 0, total: 0 },
  };
  let win = 0;
  let lose = 0;
  let draw = 0;

  for (let i = 0; i < total; i++) {
    const style = styles[i % styles.length];
    const result = runMatch(style);
    perStyle[style][result as "win" | "lose" | "draw"] += 1;
    perStyle[style].total += 1;
    if (result === "win") win++;
    else if (result === "lose") lose++;
    else draw++;
  }

  console.log(`Simulated matches: ${total}`);
  console.log(`Player win: ${win} (${((win / total) * 100).toFixed(1)}%)`);
  console.log(`Player lose: ${lose} (${((lose / total) * 100).toFixed(1)}%)`);
  console.log(`Draw: ${draw} (${((draw / total) * 100).toFixed(1)}%)`);
  console.log("By AI style:");
  styles.forEach((s) => {
    const x = perStyle[s];
    const pct = (n: number) => (x.total ? ((n / x.total) * 100).toFixed(1) : "0.0");
    console.log(`- ${s}: W ${x.win} (${pct(x.win)}%) / L ${x.lose} (${pct(x.lose)}%) / D ${x.draw} (${pct(x.draw)}%)`);
  });
}

main();
