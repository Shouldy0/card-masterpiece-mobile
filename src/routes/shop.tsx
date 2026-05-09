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
      else { play("success"); toast.success(`${item.title} acquistato!`); navigateToPackOpening(r); }
    } else {
      const success = buyCosmetic(item.id, item.cost, item.currency);
      if (!success) { play("fail"); toast.error("Risorse insufficienti o già posseduto"); }
      else { play("chime"); toast.success(`${item.title} sbloccato!`); }
    }
  };

  // Mock function for now
  const navigateToPackOpening = (cards: string[]) => {
    console.log("Opening cards:", cards);
  };

  return (
    <MobileFrame>
      <header className="flex items-center justify-between px-4 pt-6">
        <Link to="/home" className="flex size-9 items-center justify-center rounded-full bg-card/60 ring-1 ring-gold/30"><ArrowLeft className="h-4 w-4 text-gold" /></Link>
        <h1 className="flex-1 text-center font-display text-lg gold-text tracking-widest">NEGOZIO</h1>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 rounded-full bg-card/60 px-2 py-0.5 ring-1 ring-gold/30 text-[10px]"><Coins className="h-2.5 w-2.5 text-gold" />{player.gold.toLocaleString("it-IT")}</div>
          <div className="flex items-center gap-1 rounded-full bg-card/60 px-2 py-0.5 ring-1 ring-gold/30 text-[10px]"><Diamond className="h-2.5 w-2.5 text-mystic-glow" />{player.gems}</div>
        </div>
      </header>

      <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide px-4">
        {tabs.map((t) => (
          <button 
            key={t} 
            onClick={() => { setTab(t); play("click"); }} 
            className={`shrink-0 rounded-full px-5 py-2 text-[10px] uppercase tracking-widest transition-all ${tab === t ? "bg-mystic text-foreground ring-2 ring-gold shadow-[0_0_15px_rgba(255,215,0,0.3)]" : "bg-card/40 text-muted-foreground ring-1 ring-gold/20 hover:bg-card/60"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6 flex-1 px-4 pb-24 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div 
            key={tab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
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
          <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-mystic/20 to-abyss ring-1 ring-gold/20 text-center">
            <Sparkles className="mx-auto h-6 w-6 text-gold mb-2" />
            <h3 className="font-display text-sm text-gold uppercase tracking-widest">Abbonamento Premium</h3>
            <p className="text-[10px] text-muted-foreground mt-1">Ottieni gemme giornaliere e accesso a card art esclusive.</p>
            <button className="mt-4 w-full py-2 rounded-full bg-gold text-black font-display text-[10px] uppercase tracking-widest font-black">Scopri di più</button>
          </div>
        )}
      </div>

      <BottomNav />
    </MobileFrame>
  );
}

function ShopRow({ item, isOwned, onBuy }: { item: ShopItem, isOwned: boolean, onBuy: () => void }) {
  const Icon = item.icon;
  
  return (
    <div className={`relative flex items-center gap-4 rounded-2xl p-4 transition-all ${isOwned ? "bg-card/20 opacity-80" : "bg-card/40 ring-1 ring-gold/15 hover:ring-gold/40 hover:bg-card/60"}`}>
      {item.badge && (
        <div className="absolute -top-2 -left-1 rounded-md bg-mystic px-2 py-0.5 text-[7px] font-black uppercase tracking-widest text-foreground ring-1 ring-gold/50 shadow-lg z-10">
          {item.badge}
        </div>
      )}
      
      <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-mystic/30 to-abyss ring-1 ring-gold/30">
        <Icon className={`h-6 w-6 ${item.currency === "gems" ? "text-mystic-glow" : "text-gold"}`} />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-display text-xs text-foreground uppercase tracking-wider">{item.title}</h4>
        <p className="text-[9px] text-muted-foreground line-clamp-1 mt-0.5">{item.sub}</p>
      </div>

      <button 
        onClick={onBuy}
        disabled={isOwned}
        className={`flex min-w-[80px] items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[10px] font-bold transition-all ${isOwned ? "bg-emerald-500/20 text-emerald-400 cursor-default" : "bg-mystic/40 text-foreground ring-1 ring-gold/40 hover:bg-mystic/60 active:scale-95"}`}
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
