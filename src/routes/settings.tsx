import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileFrame } from "@/components/Common";
import { useGame } from "@/game/store";
import { sounds } from "@/utils/audio";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/settings")({ component: Settings });

const tabs = ["Gioco", "Audio", "Grafica", "Account"] as const;

function Settings() {
  const { settings, toggleSetting } = useGame();
  const [tab, setTab] = useState<typeof tabs[number]>("Gioco");
  const [musicVol, setMusicVol] = useState(0.7);
  const [sfxVol, setSfxVol] = useState(0.9);

  const handleSoundToggle = (v: boolean) => {
    toggleSetting("soundOn", v);
    sounds.setSoundEnabled(v);
  };

  const handleMusicVol = (v: number) => {
    setMusicVol(v);
    sounds.setMusicVolume(v);
  };

  return (
    <MobileFrame>
      <header className="flex items-center gap-2 px-4 pt-6">
        <Link to="/home" className="flex size-9 items-center justify-center rounded-full bg-card/60 ring-1 ring-gold/30"><ArrowLeft className="h-4 w-4 text-gold" /></Link>
        <h1 className="flex-1 text-center font-display text-lg gold-text tracking-widest">IMPOSTAZIONI</h1>
        <span className="size-9" />
      </header>

      <div className="mt-4 flex gap-2 px-4">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 rounded-full py-1.5 text-[10px] uppercase tracking-widest ring-1 ${tab === t ? "bg-mystic/50 text-foreground ring-gold" : "bg-card/40 text-muted-foreground ring-gold/20"}`}>{t}</button>
        ))}
      </div>

      <div className="mt-4 flex-1 space-y-1 px-4">
        {tab === "Gioco" && (
          <>
            <Slider label="Velocità Animazioni" value={settings.animSpeed} onChange={(v: number) => toggleSetting("animSpeed", v)} />
            <Toggle label="Mostra Effetti" value={true} onChange={() => {}} />
            <Toggle label="Suggerimenti" value={settings.hints} onChange={(v: boolean) => toggleSetting("hints", v)} />
            <Toggle label="Conferma Fine Turno" value={true} onChange={() => {}} />
            <Row label="Lingua" value={settings.language} />
            <Toggle label="Vibrazione" value={settings.vibration} onChange={(v: boolean) => toggleSetting("vibration", v)} />
          </>
        )}
        {tab === "Audio" && (
          <>
            <Toggle label="Audio" value={settings.soundOn} onChange={handleSoundToggle} />
            <Slider label="Musica" value={musicVol} onChange={handleMusicVol} />
            <Slider label="Effetti Sonori" value={sfxVol} onChange={setSfxVol} />
          </>
        )}
        {tab === "Grafica" && (
          <>
            <Toggle label="Particelle" value={true} onChange={() => {}} />
            <Toggle label="Glow & Bloom" value={true} onChange={() => {}} />
            <Toggle label="Sfocature" value={false} onChange={() => {}} />
          </>
        )}
        {tab === "Account" && (
          <>
            <Row label="ID Giocatore" value="DRM-238417" />
            <Row label="Email" value="dreamer@reverie.io" />
            <Link to="/connection" className="block rounded-md gold-frame bg-card/60 px-3 py-3 text-center text-xs">Stato Connessione</Link>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 p-4">
        <button className="rounded-full gold-frame bg-card/60 py-2.5 text-xs uppercase tracking-widest text-muted-foreground">Assistenza</button>
        <button className="rounded-full gold-frame bg-card/60 py-2.5 text-xs uppercase tracking-widest text-rose">Esci</button>
      </div>
    </MobileFrame>
  );
}

function Toggle({ label, value, onChange }: any) {
  return (
    <div className="flex items-center justify-between rounded-md gold-frame bg-card/40 px-3 py-3">
      <span className="text-xs">{label}</span>
      <button onClick={() => onChange(!value)} className={`flex h-5 w-10 items-center rounded-full p-0.5 transition-colors ${value ? "bg-mystic" : "bg-abyss"}`}>
        <span className={`size-4 rounded-full bg-foreground transition-transform ${value ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}
function Slider({ label, value, onChange }: any) {
  return (
    <div className="rounded-md gold-frame bg-card/40 px-3 py-3">
      <div className="flex items-center justify-between text-xs">
        <span>{label}</span>
        <span className="text-gold font-display">{Math.round(value * 100)}%</span>
      </div>
      <input type="range" min={0} max={1} step={0.05} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full accent-mystic" />
    </div>
  );
}
function Row({ label, value }: any) {
  return (
    <div className="flex items-center justify-between rounded-md gold-frame bg-card/40 px-3 py-3 text-xs">
      <span>{label}</span><span className="text-muted-foreground">{value}</span>
    </div>
  );
}
