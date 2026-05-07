import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useGame } from "@/game/store";
import { MobileFrame } from "@/components/Common";
import { useSound } from "@/hooks/useSound";
import { Eye } from "lucide-react";

export const Route = createFileRoute("/search")({ component: Search });

function Search() {
  const [t, setT] = useState(12);
  const navigate = useNavigate();
  const startMatch = useGame((s) => s.startMatch);
  const { play } = useSound();
  useEffect(() => { startMatch(); }, [startMatch]);
  useEffect(() => {
    if (t <= 0) { navigate({ to: "/vs" }); return; }
    play("tick");
    const id = setTimeout(() => setT(t - 1), 1000);
    return () => clearTimeout(id);
  }, [t, navigate, play]);

  return (
    <MobileFrame className="items-center justify-center px-6 text-center">
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="relative mb-8"
      >
        <div className="absolute -inset-12 rounded-full bg-mystic/30 blur-3xl" />
        <div className="relative flex size-32 items-center justify-center rounded-full ring-2 ring-gold/60 bg-gradient-to-br from-mystic/40 to-abyss">
          <Eye className="h-12 w-12 text-gold" />
        </div>
      </motion.div>
      <p className="font-display text-2xl gold-text">Ricerca avversario…</p>
      <p className="mt-2 font-display text-3xl text-foreground">00:{String(t).padStart(2, "0")}</p>
      <button onClick={() => navigate({ to: "/home" })} className="mt-10 rounded-full px-8 py-2.5 text-sm gold-frame bg-card/60 text-muted-foreground">Annulla</button>
    </MobileFrame>
  );
}
