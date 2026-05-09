import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useGame } from "@/game/store";
import { MobileFrame } from "@/components/Common";
import { useSound } from "@/hooks/useSound";
import { Eye } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Loading,
});

function Loading() {
  console.log("REVERIE: Loading component rendering");
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { play } = useSound();

  useEffect(() => {
    // Attempt to play signature sound, ignore if blocked
    try { play("signature"); } catch (e) {}
  }, [play]);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        const n = Math.min(100, p + 2);
        if (n !== p && n % 20 === 0) {
          try { play("tick"); } catch (e) {}
        }
        return n;
      });
    }, 50);
    return () => clearInterval(id);
  }, [play]);

  useEffect(() => {
    if (progress >= 100) {
      const check = async () => {
        try {
          const { getFirebase } = await import("@/lib/firebase");
          const { auth } = await getFirebase();
          
          if (!auth) {
            console.warn("Auth not initialized, redirecting to login");
            return navigate({ to: "/auth" });
          }
          
          // Wait a bit for auth state to stabilize
          setTimeout(() => {
            const user = auth.currentUser;
            navigate({ to: user ? "/home" : "/auth" });
          }, 500);
        } catch (err) {
          console.error("Critical error during initialization:", err);
          navigate({ to: "/auth" }); // Fallback to auth
        }
      };
      check();
    }
  }, [progress, navigate]);

  return (
    <MobileFrame className="items-center justify-center px-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative mb-10"
      >
        <div className="absolute -inset-12 rounded-full bg-mystic/30 blur-3xl" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="relative size-44 rounded-full ring-1 ring-gold/40"
        >
          <div className="absolute inset-2 rounded-full ring-1 ring-gold/30" />
          <div className="absolute inset-6 rounded-full ring-1 ring-gold/20" />
        </motion.div>
        <div className="absolute inset-0 m-auto flex h-44 w-44 items-center justify-center">
          <Eye className="h-14 w-14 text-gold drop-shadow-[0_0_18px_var(--mystic-glow)]" />
        </div>
      </motion.div>

      <h1 className="font-display text-5xl tracking-[0.3em] gold-text">REVERIE</h1>
      <p className="mt-3 text-xs uppercase tracking-[0.4em] text-muted-foreground">
        Sincronizzazione dei ricordi
      </p>

      <div className="mt-12 w-full max-w-xs">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-mystic/20 ring-1 ring-gold/30">
          <motion.div
            className="h-full bg-gradient-to-r from-mystic-glow via-gold to-mystic-glow"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-right text-[10px] tracking-widest text-muted-foreground">
          {progress}%
        </p>
      </div>
    </MobileFrame>
  );
}
