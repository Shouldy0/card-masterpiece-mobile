## Reverie — Mobile Card Game

Costruiamo "Reverie", un gioco di carte mobile in stile mockup: tema oniric/psicologico, palette viola-oro su fondo notturno (#0B0D17 → #2D1E66), tipografia Cinzel per titoli + Montserrat per UI. Tutto verticale mobile-first (390×844 baseline), con cornici dorate, glow viola e animazioni di reveal.

### Esperienza di gioco

Match 1v1 vs AI su 3 territori (Memoria d'Infanzia, Trauma Rimosso, Sogno Lucido). Ogni turno il giocatore spende **Focus** (max 6) per giocare carte sui territori. Ogni territorio applica la sua regola passiva al calcolo del Potere. Si gioca a 6 turni; vince chi controlla più territori. HP iniziali 20, una sconfitta di territorio = -danno al perdente.

Tipi carta: **Archetipo**, **Ricordo**, **Maschera**. Ogni carta ha Costo (Focus) e Potere. AI semplice: sceglie la carta col miglior rapporto potere/costo sul territorio dove è più indietro.

### Schermate (26 totali)

1. **Loading** — logo Reverie + barra "sincronizzazione ricordi"
2. **Onboarding** — 3 slide swipe
3. **Home** — logo, GIOCA grande, missioni/pass, scorciatoie Mazzi/Collezione/Negozio, bottom nav
4. **Match (in-game)** — 3 territori verticali, mano in basso, Focus, FINE TURNO, HP, timer
5. **Animazione Reveal carta** — coperta → flip → reveal → attivazione (sequenza Framer Motion)
6. **End Game** — VITTORIA/SCONFITTA, risultato territori, +XP, ricompense
7. **Rewards** — XP, Oro, Frammenti, pacchetti
8. **Deck Builder** — Le mie carte / Il mio mazzo 15 carte, filtri
9. **Collezione** — griglia carte con ricerca + filtri
10. **Card Detail / Upgrade** — card grande, livello, costo upgrade
11. **Negozio** — tabs Consigliati/Carte/Board/Effetti, pacchetti
12. **Profilo** — avatar, livello, statistiche, mazzi preferiti, titoli
13. **Ranked** — rango Sognatore, ricompense stagionali
14. **Eventi** — evento attivo + prossimi
15. **Season Pass** — 15 livelli pass gratuito/premium
16. **Multiplayer Search** — ricerca avversario animata
17. **VS Screen** — scontro avatar prima della partita
18. **Tutorial Match** — overlay guidati con frecce
19. **Settings** — Gioco/Audio/Grafica/Account
20. **Connection Status** — ping, server
21. **Maintenance/News** — annuncio carosello
22-26. Stat dettagliate, Cronologia partite, Titoli, Modalità (VS AI/Ranked/Evento), Ricompensa giornaliera

### Carte generate con AI

20 carte uniche generate via Lovable AI (Nano Banana) con prompt coerente: "ritratto onirico, viola/oro, frammenti di vetro, occhio mistico, stile dark fantasy magic-the-gathering". Generate via script `code--exec` una sola volta, salvate in `public/cards/`. Il retro carta è un asset unico (occhio geometrico dorato).

### Stato e dati

Tutto client-side con Zustand: stato match, mazzo, collezione, valuta (Oro/Frammenti). Persistenza in localStorage. Niente backend per il primo build.

### Sezione tecnica

- TanStack Start con route separate per ogni schermata principale (`/`, `/match`, `/deck`, `/collection`, `/shop`, `/profile`, `/ranked`, `/events`, `/pass`, `/settings`, `/onboarding`, `/end/$result`, ecc.)
- Stato globale Zustand + slices per match/inventory/player
- Logica match in `src/game/engine.ts` (fase turno, calcolo potere territorio, AI)
- Carte definite in `src/game/cards.ts` con id, nome, tipo, costo, potere, effetto, immagine
- Framer Motion per reveal/flip/glow
- Tailwind v4 con tokens custom: `--gold: oklch(0.82 0.13 80)`, `--mystic: oklch(0.55 0.22 295)`, `--abyss: oklch(0.15 0.05 270)`
- Font Cinzel + Montserrat via Google Fonts in `__root.tsx`
- Componenti riusabili: `<GameCard>`, `<TerritoryPanel>`, `<FocusGems>`, `<GoldFrame>`, `<BottomNav>`
- Generazione immagini carte: script Python via skill ai-gateway, modello `google/gemini-3.1-flash-image-preview`, output in `public/cards/*.png`

### Note

Build grosso: ~30 file route + componenti. Le 26 schermate saranno tutte navigabili e visivamente fedeli ai mockup; il "match" sarà completamente giocabile vs AI. Le altre schermate sono interattive (tabs, filtri, acquisti simulati con Oro) ma senza backend.