import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PlayerProgress } from "./store";

/**
 * Salva i progressi del giocatore su Firebase
 */
export async function savePlayerToCloud(userId: string, data: PlayerProgress) {
  try {
    const userRef = doc(db, "players", userId);
    await setDoc(userRef, data, { merge: true });
    console.log("Progressi salvati sul cloud!");
  } catch (error) {
    console.error("Errore nel salvataggio cloud:", error);
  }
}

/**
 * Carica i progressi del giocatore da Firebase
 */
export async function loadPlayerFromCloud(userId: string): Promise<PlayerProgress | null> {
  try {
    const userRef = doc(db, "players", userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as PlayerProgress;
    }
    return null;
  } catch (error) {
    console.error("Errore nel caricamento cloud:", error);
    return null;
  }
}
