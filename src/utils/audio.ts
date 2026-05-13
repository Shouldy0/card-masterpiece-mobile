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

    const prevScene = this.currentScene;
    this.currentScene = scene;
    this.stopSceneMusic(prevScene !== "none");

    if (scene === "none") return;

    const session: BgmSession = { oscillators: [], gains: [], filters: [], interval: null };
    const now = this.ctx.currentTime;

    // 1. DEEP CINEMATIC DRONE (Multi-oscillator for thickness)
    const baseFreqs = scene === "home" ? [55, 110, 41.2] : [41.2, 82.41, 30.87];
    baseFreqs.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();
      const panner = this.ctx!.createStereoPanner();

      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, now);
      
      // Detune for chorus effect
      osc.detune.setValueAtTime((Math.random() - 0.5) * 15, now);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(150, now);
      filter.Q.setValueAtTime(5, now);

      panner.pan.setValueAtTime((i - 1) * 0.5, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(this.musicVol * 0.3, now + 5);

      osc.connect(filter);
      filter.connect(panner);
      panner.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      session.oscillators.push(osc);
      session.gains.push(gain);
    });

    // 2. ETHEREAL PAD LAYER (Slow breathing)
    const padFreqs = scene === "home" ? [220, 329.63, 440] : [196, 293.66, 392];
    padFreqs.forEach((f, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const lfo = this.ctx!.createOscillator();
      const lfoGain = this.ctx!.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(f, now);

      lfo.frequency.setValueAtTime(0.05 + i * 0.02, now);
      lfoGain.gain.setValueAtTime(this.musicVol * 0.1, now);
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      lfo.start(now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(this.musicVol * 0.15, now + 8);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now);
      
      session.oscillators.push(osc, lfo);
      session.gains.push(gain);
    });

    // 3. IMPROVED GENERATIVE MELODY (Less random, more musical)
    const scales = {
      home: [220, 261.63, 329.63, 392, 440, 523.25, 659.25], // A minor pentatonic
      match: [196, 233.08, 293.66, 349.23, 392, 466.16, 587.33] // G minor
    };
    const scale = scales[scene];

    session.interval = setInterval(() => {
      if (!this.ctx || this.muted || this.currentScene !== scene) return;
      
      // Randomly decide notes count (1-3 for chords)
      const count = Math.random() > 0.8 ? 2 : 1;
      for(let i=0; i<count; i++) {
        const note = scale[Math.floor(Math.random() * scale.length)];
        const delay = Math.random() * 2000;
        setTimeout(() => this.playGhostNote(note), delay);
      }
    }, scene === "home" ? 6000 : 4000);

    this.activeSession = session;
  }

  private playGhostNote(freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    const panner = this.ctx.createStereoPanner();
    const delay = this.ctx.createDelay();
    const feedback = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 4);

    panner.pan.setValueAtTime((Math.random() - 0.5) * 1.6, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(this.musicVol * 0.12, now + 2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 8);

    delay.delayTime.setValueAtTime(0.5, now);
    feedback.gain.setValueAtTime(0.4, now);

    osc.connect(filter);
    filter.connect(panner);
    panner.connect(gain);
    
    // Feedback loop for echo
    gain.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(this.masterGain);
    
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 8);
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
