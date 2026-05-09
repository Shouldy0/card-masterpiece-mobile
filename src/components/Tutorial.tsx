import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/game/store";
import { useNavigate } from "@tanstack/react-router";
import { sounds } from "@/utils/audio";
import { Sparkles, Brain, BookOpen, Zap, Trophy, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    title: "Benvenuto nella Reverie",
    content: "Il campo di battaglia è un mondo subconscio vivente. Qui, i tuoi ricordi e i tuoi traumi prendono forma.",
    icon: <Sparkles className="size-12 text-gold" />,
    color: "gold"
  },
  {
    title: "I Tre Territori",
    content: "Il match si svolge su tre zone emotive: Memoria, Trauma e Sogno. Ogni zona ha regole uniche che influenzano le tue carte.",
    icon: <Brain className="size-12 text-blue-400" />,
    color: "blue"
  },
  {
    title: "Memorie e Archetipi",
    content: "Gioca le tue carte nei territori. Ogni carta ha un valore di POTERE. A fine partita, chi ha più potere in un territorio lo controlla.",
    icon: <BookOpen className="size-12 text-purple-400" />,
    color: "purple"
  },
  {
    title: "Il Focus (Energia)",
    content: "Ogni turno ricevi Focus. Usalo per evocare le tue memorie. Gestisci saggiamente la tua energia mentale.",
    icon: <Zap className="size-12 text-emerald-400" />,
    color: "emerald"
  },
  {
    title: "Vittoria Finale",
    content: "Per vincere la battaglia psicologica, devi controllare almeno 2 territori su 3 alla fine del sesto turno.",
    icon: <Trophy className="size-12 text-gold" />,
    color: "gold"
  }
];

export function TutorialOverlay() {
  const { player, setOnboardingDone, startTutorialMatch } = useGame();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  if (player.onboardingDone) return null;

  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;

  const next = () => {
    if (isLast) {
      sounds.play("victory");
      setOnboardingDone();
      startTutorialMatch();
      navigate({ to: "/match" });
    } else {
      sounds.play("chime");
      setCurrentStep(s => s + 1);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
      >
        {/* Background Ritual Symbol */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="size-[150%] border border-gold/40 rounded-full border-dashed"
          />
        </div>

        <motion.div 
          key={currentStep}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 1.1, opacity: 0, y: -20 }}
          className="relative w-full max-w-sm bg-card/20 border border-white/10 rounded-[3rem] p-10 text-center shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Progress dots */}
          <div className="absolute top-6 inset-x-0 flex justify-center gap-1.5">
            {STEPS.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  i === currentStep ? "w-8 bg-gold" : "w-2 bg-white/10"
                )} 
              />
            ))}
          </div>

          <button 
            onClick={() => setOnboardingDone()}
            className="absolute top-6 right-6 text-white/20 hover:text-white/60 transition-colors"
          >
            <X className="size-5" />
          </button>

          <div className="mb-8 flex justify-center">
             <div className="p-6 rounded-full bg-white/5 ring-1 ring-white/10 shadow-2xl relative">
                {step.icon}
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-current blur-2xl"
                  style={{ color: step.color === 'gold' ? '#FFD700' : step.color === 'blue' ? '#3B82F6' : step.color === 'purple' ? '#A855F7' : '#10B981' }}
                />
             </div>
          </div>

          <h2 className="font-display text-2xl text-gold tracking-widest uppercase mb-4">{step.title}</h2>
          <p className="text-sm text-white/80 leading-relaxed font-medium mb-10 px-2">{step.content}</p>

          <button 
            onClick={next}
            className="w-full py-4 rounded-2xl bg-gold text-black font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 group shadow-[0_0_30px_rgba(255,215,0,0.3)] active:scale-95 transition-all"
          >
            {isLast ? "Risveglia la tua Mente" : "Continua il Rituale"}
            <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
