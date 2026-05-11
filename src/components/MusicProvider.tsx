import { useEffect } from "react";
import { useGame } from "@/game/store";
import { sounds } from "@/utils/audio";

export function MusicProvider() {
  const { soundOn, musicVolume, sfxVolume } = useGame((s) => s.settings);

  // Keep engine volumes in sync with settings
  useEffect(() => {
    if (typeof soundOn !== "boolean" || musicVolume === undefined || sfxVolume === undefined)
      return;
    sounds.setVolumes(musicVolume, sfxVolume, !soundOn);
  }, [soundOn, musicVolume, sfxVolume]);

  // Start ambient on first user gesture (autoplay policy)
  useEffect(() => {
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      sounds.setVolumes(musicVolume, sfxVolume, !soundOn);
      if (soundOn) sounds.startAmbient();
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
    window.addEventListener("pointerdown", start, { once: false });
    window.addEventListener("keydown", start, { once: false });
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
