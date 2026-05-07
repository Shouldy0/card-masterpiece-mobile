import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileFrame } from "@/components/Common";
import { useGame } from "@/game/store";
import { CardBack } from "@/components/GameCard";
import { Sparkles, Hand, Crown } from "lucide-react";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

const slides = [
  { icon: Sparkles, title: "Benvenuto nel tuo Sogno", body: "Reverie è un duello tra coscienze. Controlla i territori della mente." },
  { icon: Hand, title: "Gioca le Carte", body: "Usa il Focus per evocare Archetipi, Ricordi e Maschere." },
  { icon: Crown, title: "Conquista i Territori", body: "Controlla i territori e sconfiggi la coscienza avversaria." },
];

function Onboarding() {
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  const setDone = useGame((s) => s.setOnboardingDone);
  const Icon = slides[i].icon;
  const { play } = useSound();

  const next = () => {
    if (i < slides.length - 1) { play("chime"); setI(i + 1); }
    else { play("dream_enter"); setDone(); navigate({ to: "/home" }); }
  };

  return (
    <MobileFrame className="px-6 pb-10 pt-12">
      <p className="text-center text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Tutorial</p>
      <h2 className="mt-2 text-center font-display text-2xl gold-text">Capitolo {i + 1}</h2>

      <div className="mt-10 flex flex-1 flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            <div className="relative mb-8">
              <div className="absolute -inset-10 rounded-full bg-mystic/30 blur-3xl" />
              <div className="relative flex size-32 items-center justify-center rounded-2xl gold-frame">
                <Icon className="h-12 w-12 text-gold" />
              </div>
            </div>
            <div className="mb-6 flex gap-2">
              <CardBack size="sm" />
              <CardBack size="sm" />
              <CardBack size="sm" />
            </div>
            <h3 className="font-display text-xl text-foreground">{slides[i].title}</h3>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">{slides[i].body}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mb-6 flex justify-center gap-2">
        {slides.map((_, idx) => (
          <span key={idx} className={`h-1.5 w-6 rounded-full transition-all ${idx === i ? "bg-gold" : "bg-mystic/40"}`} />
        ))}
      </div>

      <button
        onClick={next}
        className="rounded-full gold-frame bg-gradient-to-r from-mystic/80 to-mystic px-8 py-3 font-display text-sm uppercase tracking-widest text-foreground glow-mystic"
      >
        {i < slides.length - 1 ? "Continua" : "Inizia il Viaggio"}
      </button>
    </MobileFrame>
  );
}
