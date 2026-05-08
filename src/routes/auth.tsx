import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, getFirebase } from "@/lib/firebase";
import { MobileFrame } from "@/components/Common";
import { Eye, Mail, Lock, LogIn, UserPlus, Sparkles, Chrome } from "lucide-react";
import { toast } from "sonner";
import { useSound } from "@/hooks/useSound";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { play } = useSound();

  const getAuthInstance = async () => {
    if (auth) return auth;
    const { auth: firebaseAuth } = await getFirebase();
    return firebaseAuth;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && password.length < 6) {
      toast.error("La password deve essere di almeno 6 caratteri");
      return;
    }

    setLoading(true);
    play("lock");

    try {
      const firebaseAuth = await getAuthInstance();
      if (!firebaseAuth) throw new Error("Sistema di autenticazione non disponibile");

      if (isLogin) {
        await signInWithEmailAndPassword(firebaseAuth, email, password);
        toast.success("Bentornato, Sognatore");
      } else {
        const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        const { savePlayerToCloud } = await import("@/game/persistence");
        const currentPlayerState = useGame.getState().player;
        await savePlayerToCloud(userCredential.user.uid, currentPlayerState);
        toast.success("La tua coscienza è stata sincronizzata");
      }
      navigate({ to: "/home" });
    } catch (error: any) {
      console.error("Auth error:", error);
      let msg = error.message;
      if (error.code === "auth/email-already-in-use") msg = "Questa email è già registrata";
      if (error.code === "auth/invalid-email") msg = "Email non valida";
      if (error.code === "auth/weak-password") msg = "Password troppo debole";
      if (error.code === "auth/operation-not-allowed") msg = "Registrazione con email disabilitata";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const firebaseAuth = await getAuthInstance();
      if (!firebaseAuth) throw new Error("Sistema di autenticazione non disponibile");
      await signInWithPopup(firebaseAuth, provider);
      navigate({ to: "/home" });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-abyss p-8 flex flex-col items-center">
      <div className="w-full max-w-sm space-y-8 mt-12">
        <div className="text-center">
          <h1 className="font-display text-4xl gold-text mb-2">REVERIE</h1>
          <p className="text-xs text-gold/60 uppercase tracking-widest">Sincronizzazione</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-card border-2 border-gold/40 rounded-xl py-4 px-4 text-foreground focus:outline-none focus:border-gold"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-card border-2 border-gold/40 rounded-xl py-4 px-4 text-foreground focus:outline-none focus:border-gold"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-mystic py-4 rounded-xl font-display text-lg gold-text border border-gold/50 shadow-lg disabled:opacity-50"
          >
            {loading ? "CARICAMENTO..." : isLogin ? "ACCEDI" : "REGISTRATI"}
          </button>
        </form>

        <p className="text-center text-sm text-gold/60">
          {isLogin ? "Nuovo sognatore?" : "Sei già dei nostri?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-gold underline font-bold ml-1">
            {isLogin ? "Crea account" : "Accedi qui"}
          </button>
        </p>
      </div>
    </div>
  );
}
