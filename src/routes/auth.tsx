import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    play("lock");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Bentornato, Sognatore");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("La tua coscienza è stata sincronizzata");
      }
      navigate({ to: "/home" });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate({ to: "/home" });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <MobileFrame className="items-center justify-center px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="size-20 rounded-full bg-mystic/20 ring-2 ring-gold/40 flex items-center justify-center">
             <Eye className="size-10 text-gold animate-pulse" />
          </div>
          <h1 className="font-display text-3xl gold-text tracking-widest">REVERIE</h1>
          <p className="text-xs text-gold/60 uppercase tracking-[0.3em]">Accedi alla tua coscienza</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gold/40" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-card/20 border border-gold/20 rounded-xl py-3 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-all"
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
              className="w-full bg-card/20 border border-gold/20 rounded-xl py-3 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-mystic/40 hover:bg-mystic/60 ring-1 ring-gold/50 rounded-xl py-3 font-display text-sm gold-text flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? <Sparkles className="size-4 animate-spin" /> : isLogin ? <LogIn className="size-4" /> : <UserPlus className="size-4" />}
            {isLogin ? "ACCEDI" : "REGISTRATI"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gold/10"></div></div>
          <div className="relative flex justify-center text-[8px] uppercase tracking-widest"><span className="bg-abyss px-2 text-gold/40">Oppure</span></div>
        </div>

        <button
          onClick={loginWithGoogle}
          className="w-full bg-white/5 hover:bg-white/10 ring-1 ring-white/10 rounded-xl py-3 text-xs text-foreground flex items-center justify-center gap-2 transition-all"
        >
          <Chrome className="size-4 text-blue-400" />
          ACCEDI CON GOOGLE
        </button>

        <p className="text-[10px] text-gold/40">
          {isLogin ? "Non hai un account?" : "Hai già un account?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-gold underline font-bold ml-1">
            {isLogin ? "Registrati ora" : "Accedi qui"}
          </button>
        </p>
      </motion.div>
    </MobileFrame>
  );
}
