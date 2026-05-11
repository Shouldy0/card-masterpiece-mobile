import { db } from "@/lib/firebase";
import { PlayerProgress } from "./store";

/**
 * Salva i progressi del giocatore su Firebase
 */
export async function savePlayerToCloud(userId: string, data: PlayerProgress): Promise<boolean> {
  if (typeof window === "undefined" || !userId) return false;

  try {
    const { doc, setDoc } = await import("firebase/firestore");
    const { db: firestore } = await import("@/lib/firebase").then((m) => m.getFirebase());

    if (!firestore) {
      console.warn("Firestore not initialized yet, skipping cloud save.");
      return false;
    }
    const userRef = doc(firestore, "players", userId);
    await setDoc(userRef, data, { merge: true });
    console.log(`[Cloud Sync] Dati salvati con successo per l'utente ${userId}`);
    return true;
  } catch (error: any) {
    if (error.code === "permission-denied") {
      console.error(
        "ERRORE CRITICO FIREBASE (Salvataggio): Permessi insufficienti. Verifica le regole di sicurezza per 'players/{userId}'",
      );
    } else {
      console.error("Errore nel salvataggio cloud:", error);
    }
    return false;
  }
}

/**
 * Carica i progressi del giocatore da Firebase
 */
export async function loadPlayerFromCloud(userId: string): Promise<PlayerProgress | null> {
  if (typeof window === "undefined" || !userId) return null;

  try {
    const { doc, getDoc } = await import("firebase/firestore");
    const { db: firestore } = await import("@/lib/firebase").then((m) => m.getFirebase());

    if (!firestore) {
      console.warn("Firestore not initialized yet, skipping cloud load.");
      return null;
    }
    const userRef = doc(firestore, "players", userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      console.log(`Dati cloud caricati con successo per l'utente ${userId}`);
      return snap.data() as PlayerProgress;
    }
    console.log("Nessun dato cloud trovato, inizializzazione nuovo profilo.");
    return null;
  } catch (error: any) {
    if (error.code === "permission-denied") {
      console.error(
        "ERRORE CRITICO FIREBASE: Permessi insufficienti. Assicurati che le Security Rules permettano l'accesso a players/{userId}",
      );
    } else {
      console.error("Errore nel caricamento cloud:", error);
    }
    return null;
  }
}
