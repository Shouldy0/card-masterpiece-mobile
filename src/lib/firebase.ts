// CONFIGURAZIONE ABSOLUTELY CLIENT-ONLY
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let db: any = null;
let auth: any = null;

// Funzione per inizializzare solo quando necessario sul client
export async function getFirebase() {
  if (typeof window === "undefined") return { db: null, auth: null };
  
  if (!db || !auth) {
    const { initializeApp } = await import("firebase/app");
    const { getFirestore } = await import("firebase/firestore");
    const { getAuth } = await import("firebase/auth");
    
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  }
  
  return { db, auth };
}

// Export diretti per retrocompatibilità (saranno null sul server)
export { db, auth };
