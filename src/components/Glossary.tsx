import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HelpCircle, 
  X, 
  Info, 
  Zap, 
  Heart, 
  Shield, 
  Brain, 
  History, 
  Sparkles,
  Map
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sounds } from "@/utils/audio";

interface GlossaryTerm {
  id: string;
  name: string;
  icon: any;
  color: string;
  definition: string;
  example: string;
  impact: string;
}

const GLOSSARY: GlossaryTerm[] = [
  {
    id: "lucidity",
    name: "Lucidità",
    icon: Zap,
    color: "text-gold",
    definition: "L'energia mentale necessaria per risvegliare le memorie nel sogno.",
    example: "Una carta con costo 3 richiede 3 punti Lucidità per essere giocata.",
    impact: "Determina quante azioni puoi compiere in un turno. La Lucidità aumenta di 1 ogni turno, fino a un massimo di 6."
  },
  {
    id: "trauma",
    name: "Trauma",
    icon: Heart,
    color: "text-rose-500",
    definition: "L'instabilità emotiva causata da eventi negativi o sovraccarico di memorie.",
    example: "Se giochi troppe carte in un territorio 'Trauma', la tua Lucidità massima potrebbe ridursi.",
    impact: "Un alto livello di Trauma danneggia direttamente la tua Chiarezza (HP) alla fine del turno."
  },
  {
    id: "archetype",
    name: "Archetipo",
    icon: Brain,
    color: "text-purple-400",
    definition: "Rappresentano i pilastri fondamentali della psiche (Apatia, Follia, Ambizione).",
    example: "L'Archetipo 'Follia' potenzia se stesso basandosi sul caos del campo.",
    impact: "Carte versatili con effetti che spesso manipolano le regole base del gioco."
  },
  {
    id: "memory",
    name: "Ricordo",
    icon: History,
    color: "text-gold",
    definition: "Frammenti di vita passata che offrono stabilità e supporto.",
    example: "Il Ricordo 'Bosco Sacro' fornisce un bonus di potere a tutte le altre tue carte.",
    impact: "Fondamentali per potenziare le tue unità e pescare nuove risorse dal mazzo."
  },
  {
    id: "mask",
    name: "Maschera",
    icon: Shield,
    color: "text-emerald-400",
    definition: "Difese sociali usate per nascondere la propria vulnerabilità e indebolire l'altro.",
    example: "La Maschera 'Il Boia' riduce drasticamente il potere delle carte avversarie.",
    impact: "Eccellenti per il controllo del territorio e per neutralizzare le minacce nemiche."
  },
  {
    id: "dream",
    name: "Sogno",
    icon: Sparkles,
    color: "text-cyan-400",
    definition: "Manifestazioni di speranza e illusione che sfidano la realtà.",
    example: "Il Sogno 'Miraggio' può confondere l'avversario facendogli sprecare risorse.",
    impact: "Hanno effetti unici e spesso imprevedibili che possono ribaltare le sorti di un match."
  },
  {
    id: "territories",
    name: "Territori",
    icon: Map,
    color: "text-white",
    definition: "Le 3 zone psichiche (Memoria, Trauma, Sogno) dove si svolge la battaglia.",
    example: "Devi controllare almeno 2 territori su 3 per vincere la partita.",
    impact: "Ogni territorio ha regole proprie che influenzano il potere delle carte giocate al suo interno."
  }
];

export function GlossaryOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedTerm = GLOSSARY.find(t => t.id === selectedId);

  const toggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) sounds.play("lock");
    else setSelectedId(null);
  };

  return (
    <>
      <button 
        onClick={toggle}
        className="fixed top-6 right-16 z-[100] size-10 rounded-full bg-black/40 backdrop-blur-md border border-gold/30 flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-90"
      >
        <HelpCircle className="size-5 text-gold" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggle}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg h-[70vh] bg-abyss border border-gold/20 rounded-[3rem] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,1)]"
            >
              <header className="px-8 pt-8 pb-4 flex items-center justify-between border-b border-white/5">
                <div>
                  <h2 className="font-display text-xl gold-text tracking-widest uppercase">Codex della Reverie</h2>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">Guida alla Coscienza Lucida</p>
                </div>
                <button onClick={toggle} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
                  <X className="size-5" />
                </button>
              </header>

              <div className="flex-1 overflow-hidden flex">
                {/* List */}
                <div className="w-1/3 border-r border-white/5 overflow-y-auto no-scrollbar py-4 px-2 space-y-2">
                  {GLOSSARY.map((term) => (
                    <button
                      key={term.id}
                      onClick={() => {
                        setSelectedId(term.id);
                        sounds.play("tick");
                      }}
                      className={cn(
                        "w-full p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all group",
                        selectedId === term.id ? "bg-gold/10 border border-gold/30 scale-[0.98]" : "hover:bg-white/5"
                      )}
                    >
                      <term.icon className={cn("size-5 transition-colors", selectedId === term.id ? "text-gold" : "text-white/20 group-hover:text-white/60")} />
                      <span className={cn("text-[8px] font-black uppercase tracking-tighter text-center", selectedId === term.id ? "text-gold" : "text-white/30")}>
                        {term.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Detail */}
                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                  <AnimatePresence mode="wait">
                    {selectedTerm ? (
                      <motion.div
                        key={selectedTerm.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn("size-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10", selectedTerm.color)}>
                            <selectedTerm.icon className="size-8" />
                          </div>
                          <h3 className="font-display text-2xl text-white font-bold uppercase tracking-widest">{selectedTerm.name}</h3>
                        </div>

                        <section className="space-y-3">
                          <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">Definizione</h4>
                          <p className="text-sm text-white/80 leading-relaxed font-medium">{selectedTerm.definition}</p>
                        </section>

                        <section className="space-y-3 p-5 rounded-2xl bg-white/5 border border-white/10">
                          <div className="flex items-center gap-2 text-gold/60">
                            <Zap className="size-3" />
                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em]">Esempio Pratico</h4>
                          </div>
                          <p className="text-xs text-white/60 italic leading-relaxed">"{selectedTerm.example}"</p>
                        </section>

                        <section className="space-y-3">
                          <div className="flex items-center gap-2 text-blue-400/60">
                            <Info className="size-3" />
                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em]">Impatto Strategico</h4>
                          </div>
                          <p className="text-xs text-white/60 leading-relaxed">{selectedTerm.impact}</p>
                        </section>
                      </motion.div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                        <HelpCircle className="size-16 mb-4" />
                        <p className="text-xs uppercase tracking-widest">Seleziona un termine per approfondire la conoscenza della Reverie</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
