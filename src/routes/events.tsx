import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileFrame } from "@/components/Common";
import { BottomNav } from "@/components/BottomNav";
import { useGame } from "@/game/store";
import { useSound } from "@/hooks/useSound";
import { ArrowLeft, Sparkles, Calendar, Trophy, Target, Coins, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/events")({ component: Events });

interface Mission {
  id: string;
  name: string;
  progress: number;
  target: number;
  reward: number;
  icon: any;
  minLevel?: number;
  maxLevel?: number;
}

const MISSIONS: Mission[] = [
  // Livello 1-2
  { id: "start1", name: "Risveglio: Vinci 1 partita", progress: 0, target: 1, reward: 50, icon: Sparkles, maxLevel: 2 },
  { id: "play3", name: "Gioca 5 carte", progress: 2, target: 5, reward: 30, icon: Target, maxLevel: 2 },
  
  // Livello 3-5
  { id: "wins3", name: "Vinci 3 partite", progress: 1, target: 3, reward: 150, icon: Trophy, minLevel: 3, maxLevel: 5 },
  { id: "play10", name: "Gioca 10 carte Maschera", progress: 7, target: 10, reward: 80, icon: Target, minLevel: 3 },
  
  // Livello 6+
  { id: "spend6", name: "Maestro del Focus: Spendi 6 in un turno", progress: 0, target: 1, reward: 250, icon: Zap, minLevel: 6 },
  { id: "ranked5", name: "Scalata: Vinci 5 partite Ranked", progress: 2, target: 5, reward: 500, icon: Crown, minLevel: 6 },
];

function Events() {
  const { player, addGold } = useGame();
  const { play } = useSound();

  const filteredMissions = MISSIONS.filter(m => {
    const minOk = m.minLevel ? player.level >= m.minLevel : true;
    const maxOk = m.maxLevel ? player.level <= m.maxLevel : true;
    return minOk && maxOk;
  });

  const claim = (m: Mission) => {
    if (m.progress < m.target) return;
    play("chime");
    addGold(m.reward);
    toast.success(`+${m.reward} oro raccolto`);
  };

  return (
    <MobileFrame>
      <header className="flex items-center gap-2 px-4 pt-6">
        <Link to="/home" className="flex size-9 items-center justify-center rounded-full bg-card/60 ring-1 ring-gold/30"><ArrowLeft className="h-4 w-4 text-gold" /></Link>
        <h1 className="flex-1 text-center font-display text-lg gold-text tracking-widest">EVENTI</h1>
        <span className="size-9" />
      </header>

      <div className="mt-4 px-4">
        <p className="text-[10px] uppercase tracking-widest text-gold">Evento Attivo</p>
        <div className="mt-2 overflow-hidden rounded-xl gold-frame">
          <div className="relative h-32 bg-gradient-to-br from-mystic via-rose/40 to-abyss p-4">
            <div className="absolute inset-0 nebula" />
            <div className="relative">
              <p className="font-display text-lg text-foreground">Frammenti del Passato</p>
              <p className="text-[10px] text-muted-foreground">Termina tra: 3g 12h</p>
            </div>
            <div className="relative mt-4 flex items-end justify-between">
              <div className="flex-1">
                <div className="h-1.5 w-3/4 overflow-hidden rounded-full bg-abyss/60">
                  <div className="h-full w-2/5 bg-gradient-to-r from-mystic-glow to-gold" />
                </div>
                <p className="mt-1 text-[9px] text-muted-foreground">Progresso 6/15</p>
              </div>
              <button className="rounded-full gold-frame bg-mystic/40 px-3 py-1 text-[10px] uppercase tracking-widest">Vedi</button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 px-4">
        <p className="text-[10px] uppercase tracking-widest text-gold">Sfide Settimanali</p>
        <div className="mt-2 space-y-2">
          {filteredMissions.map((m) => {
            const Icon = m.icon;
            const done = m.progress >= m.target;
            return (
              <div key={m.id} className="rounded-xl gold-frame bg-card/60 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-mystic/30 ring-1 ring-gold/40"><Icon className="h-4 w-4 text-gold" /></div>
                  <div className="flex-1">
                    <p className="text-xs">{m.name}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-mystic/20">
                        <div className="h-full bg-gradient-to-r from-mystic-glow to-gold" style={{ width: `${(m.progress / m.target) * 100}%` }} />
                      </div>
                      <span className="text-[10px] font-display text-gold">{m.progress}/{m.target}</span>
                    </div>
                  </div>
                  <button
                    disabled={!done}
                    onClick={() => claim(m)}
                    className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] uppercase tracking-widest gold-frame ${done ? "bg-gold/30 text-gold" : "bg-card/40 text-muted-foreground opacity-50"}`}
                  >
                    {done ? <Check className="h-3 w-3" /> : <Coins className="h-3 w-3" />} {m.reward}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 px-4">
        <p className="text-[10px] uppercase tracking-widest text-gold">Prossimi Eventi</p>
        <div className="mt-2 space-y-2">
          {[{ name: "Incubi della Notte", at: "Inizia tra: 1g 5h", icon: Sparkles }, { name: "Specchi Rotti", at: "Inizia tra: 5g 2h", icon: Calendar }].map((e) => {
            const Icon = e.icon;
            return (
              <div key={e.name} className="flex items-center gap-3 rounded-xl gold-frame bg-card/60 p-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-mystic/30 ring-1 ring-gold/40"><Icon className="h-5 w-5 text-gold" /></div>
                <div className="flex-1">
                  <p className="font-display text-sm">{e.name}</p>
                  <p className="text-[10px] text-muted-foreground">{e.at}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Link to="/news" className="mx-4 mt-5 mb-24 block rounded-xl gold-frame bg-card/60 p-3 text-center text-[10px] uppercase tracking-widest text-muted-foreground">Vedi Notizie & Manutenzione →</Link>

      <BottomNav />
    </MobileFrame>
  );
}
