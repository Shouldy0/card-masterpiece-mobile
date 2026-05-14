import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/game/store";
import { useNavigate } from "@tanstack/react-router";
import { sounds } from "@/utils/audio";
import {
  Sparkles,
  Brain,
  BookOpen,
  Zap,
  Trophy,
  ChevronRight,
  X,
  Layout,
  ShoppingBag,
  User,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    type: "concept",
    title: "La Reverie",
    content:
      "Sei un Sognatore. La Reverie è il tuo campo di battaglia mentale dove i pensieri diventano realtà sotto forma di carte chiamate Memorie.",
    icon: <Sparkles className="size-12 text-gold" />,
    color: "gold",
  },
  {
    type: "concept",
    title: "Le Risorse",
    content:
      "La Sincronia rappresenta la tua connessione mentale (HP). Se scende a zero, il sogno finisce. La Lucidità è l'energia che aumenta ogni turno per giocare carte.",
    icon: <Zap className="size-12 text-emerald-400" />,
    color: "emerald",
  },
  {
    type: "ui",
    title: "Navigare la Mente",
    content:
      "Usa la barra in basso: Home per combattere, Mente per il mazzo, Negozio per nuove memorie e Profilo per i tuoi progressi.",
    icon: <Layout className="size-12 text-blue-400" />,
    color: "blue",
  },
  {
    type: "battle",
    title: "I Territori",
    content:
      "Combatti in 3 zone: Memoria, Trauma e Sogno. Controllarne 2 su 3 alla fine del Turno 6 ti darà la vittoria assoluta.",
    icon: <Brain className="size-12 text-purple-400" />,
    color: "purple",
  },
  {
    type: "quiz",
    title: "Test del Sognatore",
    question: "Come si vince un match in Reverie?",
    options: [
      "Distruggendo tutte le carte nemiche",
      "Controllando almeno 2 territori su 3 al Turno 6",
      "Avendo più Lucidità dell'avversario",
    ],
    correct: 1,
  },
  {
    type: "quiz",
    title: "Test del Sognatore",
    question: "Cosa succede alla Lucidità ogni turno?",
    options: [
      "Diminuisce progressivamente",
      "Resta sempre uguale",
      "Aumenta di 1 ogni turno (1, 2, 3...)",
    ],
    correct: 2,
  },
];

export function TutorialOverlay() {
  const { player, setOnboardingDone, startTutorialMatch } = useGame();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<"correct" | "wrong" | null>(null);

  if (player?.onboardingDone) return null;

  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;

  const next = () => {
    if (step.type === "quiz" && quizFeedback !== "correct") return;

    if (isLast) {
      sounds.play("victory");
      setOnboardingDone();
      startTutorialMatch();
      navigate({ to: "/match" });
    } else {
      sounds.play("chime");
      setCurrentStep((s) => s + 1);
      setQuizFeedback(null);
    }
  };

  const handleQuizOption = (idx: number) => {
    if (!step.options) return;
    if (idx === step.correct) {
      setQuizFeedback("correct");
      sounds.play("confirm");
    } else {
      setQuizFeedback("wrong");
      sounds.play("lock");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl"
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
            className="size-[200%] border border-gold/40 rounded-full border-dashed"
          />
        </div>

        <motion.div
          key={currentStep}
          initial={{ scale: 0.95, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 1.05, opacity: 0, y: -30 }}
          className="relative w-full max-w-sm bg-card/10 border border-white/10 rounded-[3.5rem] p-8 text-center shadow-2xl overflow-hidden"
        >
          {/* Progress dots */}
          <div className="absolute top-6 inset-x-0 flex justify-center gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  i <= currentStep ? "w-6 bg-gold" : "w-2 bg-white/10",
                )}
              />
            ))}
          </div>

          {step.type !== "quiz" ? (
            <>
              <div className="mb-8 flex justify-center mt-4">
                <div className="p-6 rounded-full bg-white/5 ring-1 ring-white/10 shadow-2xl relative">
                  {step.icon}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-current blur-3xl"
                    style={{ color: (step as any).color === "gold" ? "#FFD700" : "#3B82F6" }}
                  />
                </div>
              </div>

              <h2 className="font-display text-2xl text-gold tracking-widest uppercase mb-4">
                {step.title}
              </h2>
              <p className="text-sm text-white/70 leading-relaxed font-medium mb-10 px-2">
                {step.content}
              </p>
            </>
          ) : (
            <div className="mt-6 mb-8">
              <div className="flex justify-center mb-6">
                <div
                  className={cn(
                    "p-3 rounded-full bg-white/5",
                    quizFeedback === "correct"
                      ? "text-green-400"
                      : quizFeedback === "wrong"
                        ? "text-rose"
                        : "text-gold",
                  )}
                >
                  {quizFeedback === "correct" ? (
                    <CheckCircle2 className="size-10" />
                  ) : (
                    <AlertCircle className="size-10" />
                  )}
                </div>
              </div>
              <h3 className="font-display text-lg text-white mb-6 leading-tight">
                {step.question}
              </h3>
              <div className="space-y-2 text-left">
                {(step.options ?? []).map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuizOption(i)}
                    className={cn(
                      "w-full p-4 rounded-2xl text-xs font-medium border transition-all",
                      quizFeedback === "correct" && i === step.correct
                        ? "bg-green-500/20 border-green-500 text-green-200"
                        : quizFeedback === "wrong" && i !== step.correct
                          ? "bg-white/5 border-white/5 text-white/40"
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10",
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={next}
              disabled={step.type === "quiz" && quizFeedback !== "correct"}
              className={cn(
                "w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 group transition-all",
                step.type === "quiz" && quizFeedback !== "correct"
                  ? "bg-white/5 text-white/20 border border-white/5"
                  : "bg-gold text-black shadow-[0_0_30px_rgba(255,215,0,0.3)] active:scale-95",
              )}
            >
              {isLast
                ? "Risveglia la tua Mente"
                : quizFeedback === "correct"
                  ? "Procedi"
                  : "Continua il Rituale"}
              <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setOnboardingDone()}
              className="w-full py-2 text-white/20 hover:text-white/40 font-black text-[8px] uppercase tracking-[0.2em] transition-colors"
            >
              Salta tutto
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
