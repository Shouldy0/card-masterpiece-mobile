/**
 * REVERIE Cinematic Sound Engine
 * Generates an evolving, dark-elegant ambient soundtrack procedurally.
 * Uses advanced Web Audio API nodes for a professional "background" feel.
 */

type SceneMusic = "home" | "match" | "none";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private currentScene: SceneMusic = "none";
  private musicVol = 0.35;
  private sfxVol = 0.6;
  private muted = false;

  // Synthesis Nodes
  private masterGain: GainNode | null = null;
  private bgmNodes: { oscillators: OscillatorNode[], gains: GainNode[], filters: BiquadFilterNode[] } = { oscillators: [], gains: [], filters: [] };
  private generativeInterval: any = null;

  // Asset Audio (keeping for SFX only)
  private sfxElements: Record<string, HTMLAudioElement> = {};

  constructor() {
    if (typeof window !== "undefined") {
      this.initSfx();
    }
  }

  private initSfx() {
    const assets = {
      click: "/audio/click.mp3",
      error: "/audio/error.mp3",
      victory: "/audio/victory.mp3"
    };
    Object.entries(assets).forEach(([key, url]) => {
      const audio = new Audio(url);
      this.sfxElements[key] = audio;
    });
  }

  private init() {
    if (this.ctx || typeof window === "undefined") return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    this.updateVolumes();
  }

  private updateVolumes() {
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.muted ? 0 : 1, this.ctx!.currentTime, 0.1);
    }
  }

  setVolumes(music: number, sfx: number, muted: boolean) {
    this.musicVol = music;
    this.sfxVol = sfx;
    this.muted = muted;
    this.updateVolumes();
  }

  startAmbient() { this.startSceneMusic("home"); }
  stopAmbient() { this.stopSceneMusic(); }

  startSceneMusic(scene: SceneMusic) {
    this.init();
    if (!this.ctx || this.currentScene === scene || this.muted) return;
    
    this.stopSceneMusic();
    this.currentScene = scene;

    const now = this.ctx.currentTime;
    
    // 1. DEEP DRONE LAYER (The Subconscious)
    const droneFreqs = scene === "home" ? [55, 110, 82.41] : [41.20, 82.41, 61.74];
    droneFreqs.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      
      // Slow LFO for frequency modulation
      const lfo = this.ctx!.createOscillator();
      const lfoGain = this.ctx!.createGain();
      lfo.frequency.setValueAtTime(0.1 + i * 0.05, now);
      lfoGain.gain.setValueAtTime(2, now);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(now);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(200, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(this.musicVol * 0.2, now + 4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);
      
      osc.start(now);
      this.bgmNodes.oscillators.push(osc, lfo);
      this.bgmNodes.gains.push(gain);
    });

    // 2. GENERATIVE MELODY (The Memories)
    const scale = scene === "home" ? [220, 261.63, 329.63, 392, 440] : [196, 233.08, 293.66, 349.23];
    this.generativeInterval = setInterval(() => {
      if (!this.ctx || this.muted) return;
      this.playGhostNote(scale[Math.floor(Math.random() * scale.length)]);
    }, scene === "home" ? 5000 : 3000);
  }

  private playGhostNote(freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    const delay = this.ctx.createDelay();
    const feedback = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.01, now + 5);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, now);
    filter.Q.setValueAtTime(5, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(this.musicVol * 0.1, now + 2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 8);

    // Ethereal Echo
    delay.delayTime.setValueAtTime(0.5, now);
    feedback.gain.setValueAtTime(0.4, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(this.masterGain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 8);
  }

  stopSceneMusic() {
    if (this.generativeInterval) {
      clearInterval(this.generativeInterval);
      this.generativeInterval = null;
    }
    const now = this.ctx?.currentTime || 0;
    this.bgmNodes.gains.forEach(g => g.gain.exponentialRampToValueAtTime(0.001, now + 2));
    setTimeout(() => {
      this.bgmNodes.oscillators.forEach(o => { try { o.stop(); o.disconnect(); } catch(e){} });
      this.bgmNodes.gains.forEach(g => g.disconnect());
      this.bgmNodes = { oscillators: [], gains: [], filters: [] };
    }, 2000);
    this.currentScene = "none";
  }

  play(type: string) {
    this.init();
    if (this.muted) return;

    let assetKey: string | null = null;
    if (type === "tick" || type === "click") assetKey = "click";
    if (type === "fail" || type === "error") assetKey = "error";
    if (type === "victory" || type === "success") assetKey = "victory";

    if (assetKey && this.sfxElements[assetKey]) {
      const el = this.sfxElements[assetKey].cloneNode() as HTMLAudioElement;
      el.volume = this.sfxVol;
      el.play().catch(() => {});
      return;
    }

    // Synthesized SFX Fallback
    if (this.ctx) {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.1);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  }
}

export const sounds = new SoundEngine();
