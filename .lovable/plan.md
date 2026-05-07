# Piano: completamento sezioni mancanti + audio

Tutte le 26 route esistono già, ma alcune sono ancora stub piatte e l'audio engine (`src/utils/audio.ts`) **non è mai chiamato** in nessuna schermata. Ecco cosa farò.

## 1. Audio: cablaggio globale

`src/utils/audio.ts` è già pronto (drone ambient + 16 SFX sintetizzati via Web Audio). Aggiungerò:

- **Hook `useSound()`** che rispetta `settings.soundOn` e i volumi salvati in store (musica/SFX separati).
- **Estensione store** (`store.ts`): aggiungo `musicVolume`, `sfxVolume` e fix dello slider Audio in `/settings` (oggi non collegato).
- **Music controller globale** in `__root.tsx`: avvia il drone onirico al primo gesto utente (per via dell'autoplay policy) e lo gestisce via store.
- **Variazioni di musica per scena**: ambient base ovunque, layer più "tense" durante `/match` e `/vs`, fanfare in `/end` (riuso `victory`/`fail`).

## 2. SFX nelle schermate chiave

| Schermata | Suoni |
|---|---|
| `/` (loading) | `signature` all'avvio, `tick` ad ogni step della progress bar |
| `/onboarding` | `chime` su next, `dream_enter` sull'ultima slide |
| `/home` | `whoosh` su tap "GIOCA BATTAGLIA" |
| `/search` | `tick` per countdown, `pulse` ogni 2s |
| `/vs` | `dream_enter` all'entrata, `whoosh` sull'animazione VS |
| `/match` | `card_deal` quando peschi, `card_flip` su reveal, `lock` su selezione carta, `ripple` su fine turno, `success`/`fail` quando l'AI conquista un territorio |
| `/end` | `victory` su win, `fail` su lose, `chime` su draw |
| `/shop` | `record` su acquisto pacco, `reroll` quando insufficienti |
| `/deck` | `card_deal` su add, `lock` su remove, `success` su salva |
| `/pass`, `/ranked` | `chime` sui claim/CTA |

## 3. Schermate da rifinire (oggi minimali)

- **`/connection`** – aggiungo grafico ping live (sparkline finta), refresh button con `reroll` SFX, regione server, status badge animato.
- **`/news`** – 4 articoli invece di 2, layout magazine, tag categoria, "Leggi tutto" che apre dialog.
- **`/titles`** – aggiungo descrizione/lore per ogni titolo, requisiti di sblocco, tap per equipaggiare con SFX `lock`.
- **`/history`** – 12 partite generate, filtro Vittorie/Sconfitte/Tutte, dettaglio espandibile (territori vinti).
- **`/stats`** – aggiungo grafico XP ultimi 7 giorni, distribuzione carte per tipo, miglior carta giocata.
- **`/events`** – sezione "Sfide Settimanali" con 3 missioni tracciate (progress bar live dallo store).
- **`/pass`** – griglia 30 livelli scrollabile (oggi 15), separazione free/premium, claim button funzionante che aggiunge gold/gems.
- **`/ranked`** – aggiungo leaderboard top-5 fittizia, distanza al rank successivo, ricompense season.
- **`/settings`** – collego davvero gli slider Musica/Effetti allo store nuovo, aggiungo "Reset progressi" con conferma.
- **`/profile`** – aggiungo pannello "Carte Preferite" (top 3), badge stagione, link a `/titles` e `/history` con icone più chiare.

## 4. Gameplay: micro-fix mancanti

- AI riceve `success` SFX quando vince un territorio; mostro toast "L'avversario ha conquistato {territorio}".
- Animazione "draw card" all'inizio di ogni turno con `card_deal` scaglionato.
- Indicatore visibile del Focus regenerato a inizio turno (pulse oro).
- Bug fix in `store.ts > aiTurn`: la rimozione carta dalla mano AI è duplicata/buggy → semplifico in un singolo `splice`.

## 5. Tecnico

- Nuovo file `src/hooks/useSound.ts` (wrapper reattivo all'engine).
- Nuovo file `src/components/MusicProvider.tsx` montato in `__root.tsx` `RootComponent`.
- Estensione `SettingsState` in `store.ts` con `musicVolume`, `sfxVolume`; migrazione persist gestita con default sicuri.
- `audio.ts`: aggiungo metodo `setMasterVolumes(music, sfx)` e applico il gain agli SFX.
- Nessuna nuova dipendenza npm. Audio 100% Web Audio (zero asset, zero rete, funziona offline).

Output: app più viva, ogni interazione ha feedback sonoro, drone onirico in sottofondo, e tutte le 26 schermate hanno contenuto sostanziale invece di placeholder.
