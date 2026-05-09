/**
 * REVERIE Enhanced Sound Engine
 * Uses local MP3 assets to avoid CORS issues and ensure reliable playback.
 */

const REVERIE_ASSETS = {
  bgm: "/audio/bgm.mp3",
  click: "/audio/click.mp3",
  match: "/audio/match.mp3",
  error: "/audio/error.mp3",
  victory: "/audio/victory.mp3"
};

type SceneMusic = "home" | "vs" | "match" | "end" | null;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private currentScene: SceneMusic = null;
  private musicVol = 0.4;
  private sfxVol = 0.7;
  private muted = false;
  
  private audioElements: Record<string, HTMLAudioElement> = {};
  private activeBgm: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.initAssets();
    }
  }

  private initAssets() {
    Object.entries(REVERIE_ASSETS).forEach(([key, url]) => {
      const audio = new Audio(url);
      if (key === 'bgm' || key === 'match') {
        audio.loop = true;
      }
      this.audioElements[key] = audio;
    });
  }

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  setVolumes(music: number, sfx: number, muted: boolean) {
    this.musicVol = music;
    this.sfxVol = sfx;
    this.muted = muted;
    
    Object.values(this.audioElements).forEach(el => {
      el.muted = muted;
    });
    
    if (this.activeBgm) {
      this.activeBgm.volume = music;
    }
  }

  setMusicVolume(vol: number) {
    this.musicVol = vol;
    if (this.activeBgm) this.activeBgm.volume = vol;
  }

  startSceneMusic(scene: Exclude<SceneMusic, null>) {
    if (this.muted) return;
    if (this.currentScene === scene) return;
    
    this.stopSceneMusic();
    this.currentScene = scene;

    let target: HTMLAudioElement | null = null;
    if (scene === "home") target = this.audioElements.bgm;
    if (scene === "match") target = this.audioElements.match;

    if (target) {
      this.activeBgm = target;
      target.volume = this.musicVol;
      target.currentTime = 0;
      target.play().catch(e => console.warn("Music blocked by browser. Click to start."));
    }
  }

  stopSceneMusic() {
    if (this.activeBgm) {
      this.activeBgm.pause();
      this.activeBgm = null;
    }
    this.currentScene = null;
  }

  startAmbient() {
    this.startSceneMusic("home");
  }

  stopAmbient() {
    this.stopSceneMusic();
  }

  play(type: string) {
    if (this.muted) return;
    this.initContext();

    let assetKey: string | null = null;
    if (type === "tick" || type === "click") assetKey = "click";
    if (type === "fail" || type === "error") assetKey = "error";
    if (type === "victory" || type === "success") assetKey = "victory";

    if (assetKey && this.audioElements[assetKey]) {
      const el = this.audioElements[assetKey].cloneNode() as HTMLAudioElement;
      el.volume = this.sfxVol;
      el.play().catch(e => console.warn("SFX blocked:", e));
      return;
    }

    if (this.audioElements.click) {
        const el = this.audioElements.click.cloneNode() as HTMLAudioElement;
        el.volume = this.sfxVol * 0.5;
        el.play().catch(() => {});
    }
  }
}

export const sounds = new SoundEngine();
