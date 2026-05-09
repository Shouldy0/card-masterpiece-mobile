/**
 * REVERIE Enhanced Sound Engine
 * Combines high-quality MP3 assets with synthesized procedural effects.
 */

const REVERIE_ASSETS = {
  bgm: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663172862422/GfXFBIxfUzhEXqnG.mp3",
  click: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663172862422/wZRvtQdggXUqzbVa.mp3",
  match: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663172862422/cTHWPpSKHBtsDFnp.mp3",
  error: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663172862422/slYSlpxjllEbxLNc.mp3",
  victory: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663172862422/ZLDNwNWOXRzfpHTy.mp3"
};

type SceneMusic = "home" | "vs" | "match" | "end" | null;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private currentScene: SceneMusic = null;
  private musicVol = 0.4;
  private sfxVol = 0.7;
  private muted = false;
  
  // High Quality Asset Players
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
      audio.crossOrigin = "anonymous";
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
      target.play().catch(e => console.warn("Music blocked:", e));
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

    // Map internal types to assets if available
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

    // Fallback to synthesized sounds if needed (optional, I'll keep the logic simple for now)
    // For now, if it's not a mapped asset, we can use a generic tick
    if (this.audioElements.click) {
        const el = this.audioElements.click.cloneNode() as HTMLAudioElement;
        el.volume = this.sfxVol * 0.5;
        el.play().catch(() => {});
    }
  }
}

export const sounds = new SoundEngine();
