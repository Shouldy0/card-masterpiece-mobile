/**
 * REVERIE Cinematic Sound Engine
 * Robust implementation to prevent overlapping and ensure smooth transitions.
 */

type SceneMusic = "home" | "match" | "none";

interface BgmSession {
  oscillators: OscillatorNode[];
  gains: GainNode[];
  filters: BiquadFilterNode[];
  interval: any;
}

class SoundEngine {
  private ctx: AudioContext | null = null;
  private currentScene: SceneMusic = "none";
  private musicVol = 0.35;
  private sfxVol = 0.6;
  private muted = false;

  private masterGain: GainNode | null = null;
  private activeSession: BgmSession | null = null;

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
      victory: "/audio/victory.mp3",
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
  }

  setVolumes(music: number, sfx: number, muted: boolean) {
    this.musicVol = music;
    this.sfxVol = sfx;
    this.muted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 1, this.ctx.currentTime, 0.1);
    }
  }

  startAmbient() {
    this.startSceneMusic("home");
  }
  stopAmbient() {
    this.stopSceneMusic();
  }

  startSceneMusic(scene: SceneMusic) {
    this.init();
    if (!this.ctx || this.muted) return;
    if (this.currentScene === scene) return;

    // Immediately clear current scene state to prevent rapid overlapping
    const prevScene = this.currentScene;
    this.currentScene = scene;

    this.stopSceneMusic(prevScene !== "none"); // Fade if transitioning, else hard stop

    if (scene === "none") return;

    const session: BgmSession = { oscillators: [], gains: [], filters: [], interval: null };
    const now = this.ctx.currentTime;

    // 1. DEEP DRONE LAYER
    const droneFreqs = scene === "home" ? [55, 110, 82.41] : [41.2, 82.41, 61.74];
    droneFreqs.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

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
      session.oscillators.push(osc, lfo);
      session.gains.push(gain);
    });

    // 2. GENERATIVE MELODY
    const scale =
      scene === "home" ? [220, 261.63, 329.63, 392, 440] : [196, 233.08, 293.66, 349.23];
    session.interval = setInterval(
      () => {
        if (!this.ctx || this.muted || this.currentScene !== scene) return;
        this.playGhostNote(scale[Math.floor(Math.random() * scale.length)]);
      },
      scene === "home" ? 5000 : 3000,
    );

    this.activeSession = session;
  }

  private playGhostNote(freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    const delay = this.ctx.createDelay();
    const feedback = this.ctx.createGain();

    osc.type = "sine"; // Simpler sine for less overlap clutter
    osc.frequency.setValueAtTime(freq, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(600, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(this.musicVol * 0.1, now + 1.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 6);

    delay.delayTime.setValueAtTime(0.4, now);
    feedback.gain.setValueAtTime(0.3, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(this.masterGain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 6);
  }

  stopSceneMusic(fade = true) {
    if (!this.activeSession) return;

    const session = this.activeSession;
    this.activeSession = null;

    if (session.interval) clearInterval(session.interval);

    const now = this.ctx?.currentTime || 0;
    const fadeTime = fade ? 1.5 : 0.1;

    session.gains.forEach((g) => {
      g.gain.cancelScheduledValues(now);
      g.gain.exponentialRampToValueAtTime(0.001, now + fadeTime);
    });

    setTimeout(
      () => {
        session.oscillators.forEach((o) => {
          try {
            o.stop();
            o.disconnect();
          } catch (e) {}
        });
        session.gains.forEach((g) => g.disconnect());
      },
      fadeTime * 1000 + 100,
    );
  }

  play(type: string) {
    this.init();
    if (this.muted || !this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    
    // Check for pre-loaded assets first
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

    // Procedural SFX for better impact
    switch(type) {
      case "card_play":
      case "ripple": {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
        gain.gain.setValueAtTime(this.sfxVol * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }
      case "damage":
      case "lock": {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noise = this.ctx.createBufferSource();
        const bufferSize = this.ctx.sampleRate * 0.1;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        noise.buffer = buffer;
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.linearRampToValueAtTime(20, now + 0.15);
        gain.gain.setValueAtTime(this.sfxVol * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        noise.connect(gain);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        noise.start(now);
        osc.stop(now + 0.15);
        break;
      }
      case "heal":
      case "chime": {
        [440, 660, 880].forEach((f, i) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, now + i * 0.05);
          gain.gain.setValueAtTime(0, now + i * 0.05);
          gain.gain.linearRampToValueAtTime(this.sfxVol * 0.15, now + i * 0.05 + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
          osc.connect(gain);
          gain.connect(this.masterGain!);
          osc.start(now + i * 0.05);
          osc.stop(now + 0.6);
        });
        break;
      }
      case "ping":
      case "ping_active": {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
        gain.gain.setValueAtTime(this.sfxVol * 0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
      }
      case "destroy": {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(60, now);
        osc.frequency.linearRampToValueAtTime(10, now + 0.5);
        gain.gain.setValueAtTime(this.sfxVol * 0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
      }
      default: {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.05);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    }
  }
}

export const sounds = new SoundEngine();
