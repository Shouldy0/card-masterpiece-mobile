import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileFrame } from "@/components/Common";
import { BottomNav } from "@/components/BottomNav";
import { useGame } from "@/game/store";
import { ArrowLeft, Coins, Diamond, Sparkles, Package, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useSound } from "@/hooks/useSound";

export const Route = createFileRoute("/shop")({ component: Shop });

const tabs = ["Consigliati", "Carte", "Board", "Effetti"] as const;

function Shop() {
  const { player, buyPack } = useGame();
  const [tab, setTab] = useState<typeof tabs[number]>("Consigliati");
  const { play } = useSound();

  const buy = (cost: number, cur: "gold" | "gems", label: string) => {
    const r = buyPack(cost, cur);
    if (!r) { play("reroll"); toast.error("Risorse insufficienti"); }
    else { play("record"); toast.success(`${label} acquistato! Ricevuti 5 frammenti.`); }
  };

  return (
    <MobileFrame>
      <header className="flex items-center gap-2 px-4 pt-6">
        <Link to="/home" className="flex size-9 items-center justify-center rounded-full bg-card/60 ring-1 ring-gold/30"><ArrowLeft className="h-4 w-4 text-gold" /></Link>
        <h1 className="flex-1 text-center font-display text-lg gold-text tracking-widest">NEGOZIO</h1>
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 rounded-full bg-card/60 px-2 py-1 ring-1 ring-gold/30 text-xs"><Coins className="h-3 w-3 text-gold" />{player.gold.toLocaleString("it-IT")}</span>
          <span className="flex items-center gap-1 rounded-full bg-card/60 px-2 py-1 ring-1 ring-gold/30 text-xs"><Diamond className="h-3 w-3 text-mystic-glow" />{player.gems}</span>
        </div>
      </header>

      <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide px-4">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`shrink-0 rounded-full px-4 py-1.5 text-[10px] uppercase tracking-widest ring-1 ${tab === t ? "bg-mystic/50 text-foreground ring-gold" : "bg-card/40 text-muted-foreground ring-gold/20"}`}>{t}</button>
        ))}
      </div>

      <div className="mt-4 flex-1 space-y-3 overflow-y-auto scrollbar-hide px-4 pb-4">
        <ShopRow icon={Sparkles} title="Pacchetto Coscienza" sub="5 Carte · 1 Rara garantita" cost={1000} cur="gold" onBuy={() => buy(1000, "gold", "Pacchetto Coscienza")} />
        <ShopRow icon={Package} title="Bundle Ombre" sub="3 pacchetti speciali" cost={2500} cur="gems" onBuy={() => buy(2500, "gems", "Bundle Ombre")} />
        <ShopRow icon={ImageIcon} title="Skin Board: Sogno Lucido" sub="Sfondo del campo onirico" cost={1500} cur="gems" onBuy={() => buy(1500, "gems", "Skin Sogno Lucido")} />
        <ShopRow icon={ImageIcon} title="Skin Board: Memorie" sub="Atmosfera dorata" cost={1000} cur="gold" onBuy={() => buy(1000, "gold", "Skin Memorie")} />
        <ShopRow icon={Sparkles} title="Effetto: Frammenti" sub="Particelle al reveal" cost={500} cur="gold" onBuy={() => buy(500, "gold", "Effetto Frammenti")} />
      </div>

      <BottomNav />
    </MobileFrame>
  );
}

function ShopRow({ icon: Icon, title, sub, cost, cur, onBuy }: any) {
  return (
    <div className="flex items-center gap-3 rounded-xl gold-frame bg-card/60 p-3">
      <div className="flex size-14 items-center justify-center rounded-lg bg-gradient-to-br from-mystic/40 to-abyss ring-1 ring-gold/40">
        <Icon className="h-6 w-6 text-gold" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display text-sm text-foreground truncate">{title}</p>
        <p className="text-[10px] text-muted-foreground">{sub}</p>
      </div>
      <button onClick={onBuy} className="flex items-center gap-1 rounded-full gold-frame bg-mystic/40 px-3 py-1.5 text-xs">
        {cur === "gold" ? <Coins className="h-3 w-3 text-gold" /> : <Diamond className="h-3 w-3 text-mystic-glow" />}
        <span className="font-display">{cost.toLocaleString("it-IT")}</span>
      </button>
    </div>
  );
}
