import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, getFirebase } from "@/lib/firebase";
import { MobileFrame } from "@/components/Common";
import { Eye, Mail, Lock, LogIn, UserPlus, Sparkles, Chrome } from "lucide-react";
import { toast } from "sonner";
import { useSound } from "@/hooks/useSound";

import { useGame } from "@/game/store";

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
        // RESET player to starter state for NEW user
        useGame.getState().resetPlayer();

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
      const userCredential = await signInWithPopup(firebaseAuth, provider);

      // Sync cloud data for Google users (initialize if new)
      const { loadPlayerFromCloud, savePlayerToCloud } = await import("@/game/persistence");
      const cloudData = await loadPlayerFromCloud(userCredential.user.uid);

      if (cloudData) {
        useGame.setState({ player: cloudData });
      } else {
        // NEW Google user
        useGame.getState().resetPlayer();
        const initialData = useGame.getState().player;
        await savePlayerToCloud(userCredential.user.uid, initialData);
        toast.success("Benvenuto nel Sogno");
      }

      navigate({ to: "/home" });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <MobileFrame className="px-8 pt-12 pb-10 flex flex-col justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4 mb-10">
        <div className="size-20 rounded-full bg-mystic/20 ring-2 ring-gold/40 flex items-center justify-center">
          <Eye className="size-10 text-gold animate-pulse" />
        </div>
        <h1 className="font-display text-4xl gold-text tracking-widest text-center">REVERIE</h1>
        <p className="text-xs text-gold/60 uppercase tracking-[0.3em] text-center">
          Sincronizza la tua coscienza
        </p>
      </div>

      <form onSubmit={handleAuth} className="relative z-30 space-y-6">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gold/40" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-card/40 border border-gold/20 rounded-xl py-3.5 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-all"
            required
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gold/40" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-card/40 border border-gold/20 rounded-xl py-3.5 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-all"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-mystic hover:bg-mystic-glow ring-1 ring-gold/50 rounded-xl py-3.5 font-display text-sm gold-text flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)] disabled:opacity-50"
        >
          {loading ? "SINCRONIZZAZIONE..." : isLogin ? "ACCEDI" : "REGISTRATI"}
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-gold/10">
        <p className="text-center text-xs text-gold/40">
          {isLogin ? "Nuovo sognatore?" : "Sei già dei nostri?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-gold underline font-bold ml-1 hover:text-mystic-glow transition-colors"
          >
            {isLogin ? "Crea account" : "Accedi qui"}
          </button>
        </p>
      </div>
    </MobileFrame>
  );
}
