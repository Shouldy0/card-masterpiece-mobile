// CONFIGURAZIONE ABSOLUTELY CLIENT-ONLY
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
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
