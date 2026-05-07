import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { MobileFrame, Hexagon } from "@/components/Common";
import { sounds } from "@/utils/audio";
import { Eye } from "lucide-react";

export const Route = createFileRoute("/vs")({ component: VS });

function VS() {
  const navigate = useNavigate();
  
  useEffect(() => {
    sounds.startSceneMusic("vs");
  }, []);
  
  useEffect(() => {
    const t = setTimeout(() => navigate({ to: "/match" }), 2400);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <MobileFrame className="items-center justify-center px-6">
      <div className="flex w-full items-center justify-around">
        <motion.div initial={{ x: -200, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-mystic/40 blur-2xl" />
            <div className="relative flex size-24 items-center justify-center rounded-full ring-2 ring-gold/70 bg-gradient-to-br from-mystic to-abyss">
              <Eye className="h-9 w-9 text-gold" />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2"><Hexagon color="rose">20</Hexagon></div>
          </div>
          <p className="mt-6 font-display text-lg text-foreground">Tu</p>
          <p className="text-[10px] text-muted-foreground">Sognatore I</p>
        </motion.div>

        <motion.p initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.6, type: "spring" }} className="font-display text-6xl gold-text">VS</motion.p>

        <motion.div initial={{ x: 200, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-rose/30 blur-2xl" />
            <div className="relative flex size-24 items-center justify-center rounded-full ring-2 ring-rose/70 bg-gradient-to-br from-rose/30 to-abyss">
              <Eye className="h-9 w-9 text-rose" />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2"><Hexagon color="rose">20</Hexagon></div>
          </div>
          <p className="mt-6 font-display text-lg text-foreground">Ombra Nascosta</p>
          <p className="text-[10px] text-muted-foreground">Sognatore I</p>
        </motion.div>
      </div>
    </MobileFrame>
  );
}
