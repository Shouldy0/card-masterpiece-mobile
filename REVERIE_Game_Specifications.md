# 🌌 REVERIE: Specifiche Tecniche e di Game Design (v1.5)

**REVERIE** è un gioco di carte collezionabili mobile-first ambientato in un universo dark fantasy onirico, dove i giocatori competono per il controllo della psiche attraverso la manipolazione di memorie, traumi e sogni.

---

## 1. Visione Narrativa e Core Loop
- **Setting**: La "Reverie", un piano dimensionale dove la coscienza si frammenta in carte giocabili.
- **Obiettivo**: Ridurre la **Chiarezza** dell'avversario a zero o controllare la maggioranza dei **Territori** alla fine del match.
- **Core Loop**: Colleziona Memorie → Componi il Mazzo → Sfida Ombre o Giocatori → Sblocca Nuovi Livelli di Coscienza.

---

## 2. Meccaniche Core
### Risorse di Gioco
*   **Lucidità (Energia)**: La risorsa per giocare le carte. Parte da 1 e aumenta di 1 ogni turno (max 6).
*   **Chiarezza (HP)**: Rappresenta la stabilità mentale (20 base). Se arriva a 0, il giocatore perde.
*   **Trauma (Pressione)**: Accumulato tramite effetti negativi. Se troppo alto, infligge danni diretti alla Chiarezza alla fine del turno.

### Il Campo di Battaglia
Il tabellone è diviso in **3 Territori** (Lanes):
1.  **Memoria**: Bonus alle unità con trait stabili.
2.  **Trauma**: Gli effetti distruttivi sono raddoppiati.
3.  **Sogno**: Gli effetti casuali o di rivelazione sono potenziati.

---

## 3. Sistema delle Carte
### Fazioni e Archetipi
*   **Archetipo (Viola)**: Manipolazione delle regole e caos.
*   **Ricordo (Oro)**: Supporto, buff di potere e stabilità.
*   **Maschera (Verde)**: Controllo, debuff e protezione.
*   **Sogno (Ciano)**: Effetti imprevedibili e magici.

### Rarità
*   **Comune**: Fondamenta del mazzo.
*   **Rara**: Abilità specializzate.
*   **Epica**: Effetti che cambiano le dinamiche del territorio.
*   **Leggendaria**: Uniche, con VFX esclusivi e poteri devastanti.

---

## 4. Modalità di Gioco
### ⚔️ Battaglia Standard
Match 1v1 contro l'IA (Ombra) o giocatori reali (simulato) per scalare i ranghi della classifica.

### 🗺️ Campagna Narrativa "Il Risveglio"
Una mappa a nodi con sfide progressive. Ogni nodo presenta boss con mazzi IA personalizzati e sblocca frammenti di lore.

### 🧩 Puzzle Tattici
Scenari pre-configurati dove il giocatore deve vincere in un solo turno o con risorse limitate. Ottimo per imparare combo avanzate.

### 👥 Hub Sociale
*   **Amici**: Lista contatti, stato online e sfide dirette.
*   **Gilde**: Obiettivi comuni, classifiche di clan e premi collettivi.
*   **Condivisione**: Sistema di codici alfanumerici (base64) per esportare/importare mazzi.

---

## 5. Personalizzazione e Identità
*   **Profilo Dinamico**: Avatar sbloccabili, cornici (Frames) animate e titoli onorifici.
*   **Estetica del Sogno**: Possibilità di cambiare lo sfondo del profilo (Nebula, Abyss, Void).
*   **Cosmetici del Tabellone**: Skin per il campo di battaglia sbloccabili tramite il Battle Pass.

---

## 6. Infrastruttura Tecnica
### Stack Tecnologico
*   **Frontend**: React + Vite (Fast Refresh).
*   **Styling**: Vanilla CSS + Tailwind per layout responsivi mobile.
*   **State Management**: **Zustand** con persistenza automatica (localStorage).
*   **Routing**: TanStack Router.
*   **Animazioni**: Framer Motion (Transizioni, VFX Danni).

### 🎵 Motore Audio Cinematico
Un sistema **Web Audio API** procedurale che genera:
*   Musica ambientale non ripetitiva basata su scale pentatoniche e minori.
*   Layering polifonico con pads eterei e droni sub-bass.
*   Panning stereo spaziale per una massima immersione.

### 💾 Persistenza e Cloud
Integrazione con **Firebase** per l'autenticazione e il salvataggio dei dati nel cloud, con fallback locale per il gioco offline.

---

## 7. Filosofia di Bilanciamento (v1.2)
*   **Curva PPC**: Rapporto Potere/Costo normalizzato a 1.6x.
*   **Tempo di Gioco**: Match rapidi (3-5 minuti) ottimizzati per l'uso mobile.
*   **Anticipazione**: Indicatori visivi chiari per danni imminenti e attivazione di trait.

---

*Documento generato automaticamente per REVERIE Development Team.*
