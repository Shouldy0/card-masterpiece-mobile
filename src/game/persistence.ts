import { db } from "@/lib/firebase";
import { PlayerProgress } from "./store";

/**
 * Salva i progressi del giocatore su Firebase
 */
export async function savePlayerToCloud(userId: string, data: PlayerProgress) {
  if (typeof window === "undefined" || !userId) return;
  
  try {
    const { doc, setDoc } = await import("firebase/firestore");
    const { db: firestore } = await import("@/lib/firebase").then(m => m.getFirebase());
    
    if (!firestore) return;
    const userRef = doc(firestore, "players", userId);
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
  if (typeof window === "undefined" || !userId) return null;

  try {
    const { doc, getDoc } = await import("firebase/firestore");
    const { db: firestore } = await import("@/lib/firebase").then(m => m.getFirebase());

    if (!firestore) return null;
    const userRef = doc(firestore, "players", userId);
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
