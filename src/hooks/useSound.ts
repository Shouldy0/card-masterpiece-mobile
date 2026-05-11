import { useCallback } from "react";
import { sounds } from "@/utils/audio";
import { useGame } from "@/game/store";

type SfxType = Parameters<typeof sounds.play>[0];

export function useSound() {
  const soundOn = useGame((s) => s.settings.soundOn);
  const play = useCallback(
    (type: SfxType) => {
      if (!soundOn) return;
      sounds.play(type);
    },
    [soundOn],
  );
  return { play };
}
