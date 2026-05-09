import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { MobileFrame } from "@/components/Common";
import { BottomNav } from "@/components/BottomNav";
import { useGame } from "@/game/store";
import { ArrowLeft, Coins, Diamond, Sparkles, Package, Image as ImageIcon, Flame, Star, Zap, Crown, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useSound } from "@/hooks/useSound";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/shop")({ component: Shop });

const tabs = ["Consigliati", "Carte", "Board", "Effetti"] as const;

interface ShopItem {
  id: string;
  title: string;
  sub: string;
  cost: number;
  currency: "gold" | "gems";
  icon: any;
  category: typeof tabs[number];
  badge?: string;
  type: "pack" | "cosmetic";
}

const SHOP_ITEMS: ShopItem[] = [
  // CONSIGLIATI
  { id: "bundle_starter", title: "Bundle Iniziale", sub: "3 Pacchetti + 100 Gemme", cost: 500, currency: "gems", icon: Crown, category: "Consigliati", badge: "MIGLIOR VALORE", type: "pack" },
  { id: "offer_daily", title: "Offerta del Giorno", sub: "Pacchetto Raro a prezzo ridotto", cost: 800, currency: "gold", icon: Flame, category: "Consigliati", badge: "OFFERTA", type: "pack" },
  
  // CARTE (PACCHETTI)
  { id: "pack_standard", title: "Pacchetto Coscienza", sub: "5 Carte · 1 Rara garantita", cost: 1000, currency: "gold", icon: Sparkles, category: "Carte", type: "pack" },
  { id: "pack_premium", title: "Pacchetto Risveglio", sub: "5 Carte · 1 Epica garantita", cost: 300, currency: "gems", icon: Package, category: "Carte", type: "pack" },
  { id: "pack_legend", title: "Scrigno dell'Oracolo", sub: "3 Carte · 1 Leggendaria", cost: 1200, currency: "gems", icon: Star, category: "Carte", type: "pack" },
  
  // BOARD
  { id: "board_lucid", title: "Board: Sogno Lucido", sub: "Sfondo animato ciano e blu", cost: 1500, currency: "gems", icon: ImageIcon, category: "Board", type: "cosmetic" },
  { id: "board_memories", title: "Board: Memorie", sub: "Atmosfera dorata e calda", cost: 12000, currency: "gold", icon: ImageIcon, category: "Board", type: "cosmetic" },
  { id: "board_abyss", title: "Board: Abisso Profondo", sub: "Oscurità e fiamme viola", cost: 2000, currency: "gems", icon: ImageIcon, category: "Board", type: "cosmetic" },
  
  // EFFETTI
  { id: "fx_sparkles", title: "Effetto: Scintille", sub: "Particelle luminose al reveal", cost: 500, currency: "gold", icon: Zap, category: "Effetti", type: "cosmetic" },
  { id: "fx_ghost", title: "Effetto: Ectoplasma", sub: "Scia spettrale per fazione Oblio", cost: 800, currency: "gems", icon: Zap, category: "Effetti", type: "cosmetic" },
  { id: "fx_shield", title: "Effetto: Scudo Astrale", sub: "Aura protettiva per i difensori", cost: 5000, currency: "gold", icon: ShieldCheck, category: "Effetti", type: "cosmetic" },
];

function Shop() {
  const { player, buyPack, buyCosmetic } = useGame();
  const [tab, setTab] = useState<typeof tabs[number]>("Consigliati");
  const { play } = useSound();

  const filteredItems = useMemo(() => {
    if (tab === "Consigliati") return SHOP_ITEMS.filter(i => i.category === "Consigliati" || i.badge);
    return SHOP_ITEMS.filter(i => i.category === tab);
  }, [tab]);

  const handleBuy = (item: ShopItem) => {
    if (item.type === "pack") {
      const r = buyPack(item.cost, item.currency);
      if (!r) { play("fail"); toast.error("Risorse insufficienti"); }
      else { play("success"); toast.success(`${item.title} acquistato!`); }
    } else {
      const success = buyCosmetic(item.id, item.cost, item.currency);
      if (!success) { play("fail"); toast.error("Risorse insufficienti o già posseduto"); }
      else { play("chime"); toast.success(`${item.title} sbloccato!`); }
    }
  };

  return (
    <MobileFrame>
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        <Link to="/home" className="flex size-8 items-center justify-center rounded-full bg-card/60 ring-1 ring-gold/30"><ArrowLeft className="h-4 w-4 text-gold" /></Link>
        <h1 className="flex-1 text-center font-display text-base gold-text tracking-[0.2em] uppercase">Negozio</h1>
        <div className="flex flex-col items-end gap-0.5">
          <div className="flex items-center gap-1 rounded-full bg-card/60 px-2 py-0.5 ring-1 ring-gold/30 text-[10px] text-gold font-bold"><Coins className="h-2.5 w-2.5" />{player.gold.toLocaleString("it-IT")}</div>
          <div className="flex items-center gap-1 rounded-full bg-card/60 px-2 py-0.5 ring-1 ring-gold/30 text-[10px] text-mystic-glow font-bold"><Diamond className="h-2.5 w-2.5" />{player.gems}</div>
        </div>
      </header>

      <div className="mt-2 flex gap-2 overflow-x-auto scrollbar-hide px-4 py-2">
        {tabs.map((t) => (
          <button 
            key={t} 
            onClick={() => { setTab(t); play("click"); }} 
            className={`shrink-0 rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${tab === t ? "bg-mystic text-white ring-2 ring-gold shadow-[0_0_20px_rgba(180,80,255,0.4)]" : "bg-card/40 text-muted-foreground ring-1 ring-gold/20"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-2 flex-1 px-4 overflow-y-auto scrollbar-hide">
        <div className="pb-32 pt-2">
          <AnimatePresence mode="wait">
            <motion.div 
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              {filteredItems.map((item) => (
                <ShopRow 
                  key={item.id} 
                  item={item} 
                  isOwned={player.ownedCosmetics?.includes(item.id)}
                  onBuy={() => handleBuy(item)} 
                />
              ))}
            </motion.div>
          </AnimatePresence>
          
          {tab === "Consigliati" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 p-5 rounded-3xl bg-gradient-to-br from-mystic/30 to-abyss ring-1 ring-gold/30 text-center relative overflow-hidden">
              <div className="absolute inset-0 nebula opacity-40" />
              <Sparkles className="mx-auto h-6 w-6 text-gold mb-3 relative z-10" />
              <h3 className="font-display text-sm text-gold uppercase tracking-[0.2em] relative z-10">Abbonamento Premium</h3>
              <p className="text-[11px] text-foreground/80 mt-2 leading-relaxed relative z-10">Ottieni gemme giornaliere e accesso a card art esclusive.</p>
              <button className="mt-5 w-full py-3 rounded-full bg-gradient-to-r from-gold to-amber-eclipse text-abyss font-display text-[11px] uppercase tracking-widest font-black shadow-lg relative z-10 active:scale-95 transition-transform">Scopri di più</button>
            </motion.div>
          )}
        </div>
      </div>

      <BottomNav />
    </MobileFrame>
  );
}

function ShopRow({ item, isOwned, onBuy }: { item: ShopItem, isOwned: boolean, onBuy: () => void }) {
  const Icon = item.icon;
  
  return (
    <div className={`relative flex items-center gap-4 rounded-2xl p-4 transition-all ${isOwned ? "bg-card/20 opacity-80" : "bg-card/60 ring-1 ring-gold/20 hover:ring-gold/40 shadow-xl"}`}>
      {item.badge && (
        <div className="absolute -top-2.5 left-3 rounded-md bg-gold px-2.5 py-1 text-[8px] font-black uppercase tracking-widest text-abyss shadow-lg z-10">
          {item.badge}
        </div>
      )}
      
      <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-mystic/40 to-abyss ring-1 ring-gold/30">
        <Icon className={`h-7 w-7 ${item.currency === "gems" ? "text-mystic-glow" : "text-gold"}`} />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-display text-[11px] text-foreground uppercase tracking-widest font-bold">{item.title}</h4>
        <p className="text-[10px] text-muted-foreground mt-1 leading-tight">{item.sub}</p>
      </div>

      <button 
        onClick={onBuy}
        disabled={isOwned}
        className={`flex min-w-[85px] items-center justify-center gap-1.5 rounded-full px-3 py-2.5 text-[10px] font-black transition-all ${isOwned ? "bg-emerald-500/20 text-emerald-400 cursor-default ring-1 ring-emerald-500/30" : "bg-mystic/40 text-foreground ring-1 ring-gold/40 hover:bg-mystic/60 active:scale-95"}`}
      >
        {isOwned ? (
          "POSSEDUTO"
        ) : (
          <>
            {item.currency === "gold" ? <Coins className="h-3 w-3 text-gold" /> : <Diamond className="h-3 w-3 text-mystic-glow" />}
            <span className="font-display">{item.cost.toLocaleString("it-IT")}</span>
          </>
        )}
      </button>
    </div>
  );
}
