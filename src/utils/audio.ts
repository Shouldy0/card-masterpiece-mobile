/**
 * Minimal Arcade Sound Engine
 * Generates synthesized sounds using Web Audio API to avoid external dependencies.
 */

type SceneMusic = "home" | "vs" | "match" | "end" | null;

interface SceneMusicConfig {
  frequencies: number[];
  types: OscillatorType[];
  filterFreq: number;
  filterType: BiquadFilterType;
  gain: number;
  detune?: number[];
}

class SoundEngine {
  private ctx: AudioContext | null = null;
  private currentScene: SceneMusic = null;
  private oscillators: OscillatorNode[] = [];
  private filters: BiquadFilterNode[] = [];
  private ambientGain: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private musicVol = 0.5;
  private sfxVol = 0.8;
  private muted = false;
  private melodyInterval: any = null;

  private sceneConfigs: Record<Exclude<SceneMusic, null>, SceneMusicConfig> = {
    home: {
      frequencies: [110, 164.81, 220, 329.63],
      types: ["sine", "sine", "triangle", "sine"],
      filterFreq: 600,
      filterType: "lowpass",
      gain: 0.04,
      detune: [0, 5, -3, 8]
    },
    vs: {
      frequencies: [73.42, 146.83, 220],
      types: ["sawtooth", "sine", "triangle"],
      filterFreq: 800,
      filterType: "bandpass",
      gain: 0.03,
      detune: [0, 10, -5]
    },
    match: {
      frequencies: [130.81, 196, 261.63, 392],
      types: ["sine", "triangle", "sine", "triangle"],
      filterFreq: 1000,
      filterType: "lowpass",
      gain: 0.035,
      detune: [0, 3, -2, 5]
    },
    end: {
      frequencies: [220, 277.18, 329.63, 440],
      types: ["sine", "sine", "sine", "triangle"],
      filterFreq: 1200,
      filterType: "lowpass",
      gain: 0.05,
      detune: [0, 0, 0, 0]
    }
  };

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.musicBus = this.ctx.createGain();
      this.musicBus.gain.value = this.muted ? 0 : this.musicVol;
      this.musicBus.connect(this.ctx.destination);
      this.sfxBus = this.ctx.createGain();
      this.sfxBus.gain.value = this.muted ? 0 : this.sfxVol;
      this.sfxBus.connect(this.ctx.destination);
    }
  }

  setVolumes(music: number, sfx: number, muted: boolean) {
    this.musicVol = music;
    this.sfxVol = sfx;
    this.muted = muted;
    if (this.musicBus) this.musicBus.gain.value = muted ? 0 : music;
    if (this.sfxBus) this.sfxBus.gain.value = muted ? 0 : sfx;
  }

  setMusicVolume(vol: number) {
    this.musicVol = vol;
    if (this.musicBus && !this.muted) {
      this.musicBus.gain.value = vol;
    }
  }

  setSoundEnabled(enabled: boolean) {
    this.muted = !enabled;
    if (this.musicBus) this.musicBus.gain.value = enabled ? this.musicVol : 0;
    if (this.sfxBus) this.sfxBus.gain.value = enabled ? this.sfxVol : 0;
    if (!enabled) {
      this.stopSceneMusic();
    }
  }

  private getSfxBus(): AudioNode {
    this.init();
    return this.sfxBus!;
  }

  startSceneMusic(scene: Exclude<SceneMusic, null>) {
    try {
      if (this.muted) return;
      if (this.currentScene === scene) return;
      this.init();
      if (!this.ctx) return;

      if (this.ambientGain) {
        const now = this.ctx.currentTime;
        this.ambientGain.gain.linearRampToValueAtTime(0, now + 0.5);
        setTimeout(() => this.cleanupOscillators(), 500);
      }

      const config = this.sceneConfigs[scene];
      const now = this.ctx.currentTime;

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0, now);
      this.ambientGain.gain.linearRampToValueAtTime(config.gain, now + 1.5);
      this.ambientGain.connect(this.musicBus!);

      this.oscillators = [];
      this.filters = [];

      config.frequencies.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        osc.type = config.types[i] || "sine";
        osc.frequency.setValueAtTime(freq, now);
        
        if (config.detune && config.detune[i]) {
          osc.detune.setValueAtTime(config.detune[i], now);
        }

        const filter = this.ctx!.createBiquadFilter();
        filter.type = config.filterType;
        filter.frequency.setValueAtTime(config.filterFreq, now);

        osc.connect(filter);
        filter.connect(this.ambientGain!);
        osc.start(now);

        this.oscillators.push(osc);
        this.filters.push(filter);
      });

      this.currentScene = scene;

      if (scene === "home" || scene === "match") {
        this.startGenerativeMelody(scene);
      }
    } catch (e) {
      console.warn("Scene music blocked:", e);
    }
  }

  stopSceneMusic() {
    if (this.ambientGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.currentScene = null;
      if (this.melodyInterval) {
        clearInterval(this.melodyInterval);
        this.melodyInterval = null;
      }
      setTimeout(() => this.cleanupOscillators(), 1000);
    }
  }

  private cleanupOscillators() {
    this.oscillators.forEach(osc => {
      try { osc.stop(); osc.disconnect(); } catch (e) {}
    });
    this.filters.forEach(f => {
      try { f.disconnect(); } catch (e) {}
    });
    this.oscillators = [];
    this.filters = [];
    if (this.ambientGain) {
      try { this.ambientGain.disconnect(); } catch (e) {}
      this.ambientGain = null;
    }
  }

  startAmbient() {
    this.startSceneMusic("home");
  }

  stopAmbient() {
    this.stopSceneMusic();
  }

  private startGenerativeMelody(scene: string) {
    if (this.melodyInterval) clearInterval(this.melodyInterval);
    
    const scale = scene === "home" ? [110, 130.81, 164.81, 196, 220, 261.63] : [73.42, 87.31, 110, 123.47];
    const delay = scene === "home" ? 4000 : 2000;

    this.melodyInterval = setInterval(() => {
      if (!this.ctx || this.muted || !this.ambientGain) return;
      
      const now = this.ctx.currentTime;
      const freq = scale[Math.floor(Math.random() * scale.length)];
      
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      const f = this.ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq * 2, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 3);

      f.type = "lowpass";
      f.frequency.setValueAtTime(400, now);

      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.02, now + 1);
      g.gain.exponentialRampToValueAtTime(0.001, now + 4);

      osc.connect(f);
      f.connect(g);
      g.connect(this.ambientGain!);
      
      osc.start(now);
      osc.stop(now + 4);
    }, delay);
  }

  play(type: "draw" | "success" | "fail" | "tick" | "record" | "lock" | "reroll" | "shuffle" | "victory" | "pulse" | "whoosh" | "chime" | "ripple" | "dream_enter" | "signature" | "card_flip" | "card_deal") {
    try {
      this.init();
      if (!this.ctx) return;
       
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.getSfxBus());

      const now = this.ctx.currentTime;

      switch (type) {
        case "signature":
          osc.type = "sine";
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.8);
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.1, now + 0.2);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
           
          const sub = this.ctx.createOscillator();
          const subGain = this.ctx.createGain();
          sub.type = "sine";
          sub.frequency.setValueAtTime(220, now);
          sub.connect(subGain);
          subGain.connect(this.getSfxBus());
          subGain.gain.setValueAtTime(0, now);
          subGain.gain.linearRampToValueAtTime(0.05, now + 0.4);
          subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
          sub.start(now);
          sub.stop(now + 1.2);
           
          osc.start(now);
          osc.stop(now + 1.2);
          break;

        case "card_flip":
          osc.type = "triangle";
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
           
          const flipNoise = this.ctx.createBufferSource();
          const flipBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.1, this.ctx.sampleRate);
          const flipData = flipBuffer.getChannelData(0);
          for (let i = 0; i < flipBuffer.length; i++) { flipData[i] = Math.random() * 2 - 1; }
          flipNoise.buffer = flipBuffer;
          const flipFilter = this.ctx.createBiquadFilter();
          flipFilter.type = "bandpass";
          flipFilter.frequency.setValueAtTime(1000, now);
          const flipNG = this.ctx.createGain();
          flipNG.gain.setValueAtTime(0.02, now);
          flipNG.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          flipNoise.connect(flipFilter);
          flipFilter.connect(flipNG);
          flipNG.connect(this.getSfxBus());
          flipNoise.start(now);
           
          osc.start(now);
          osc.stop(now + 0.2);
          break;

        case "card_deal":
          osc.type = "sine";
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(330, now + 0.1);
          gain.gain.setValueAtTime(0.03, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
          break;

        case "pulse":
          osc.type = "sine";
          osc.frequency.setValueAtTime(60, now);
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.08, now + 0.1);
          gain.gain.linearRampToValueAtTime(0, now + 0.4);
          osc.start(now);
          osc.stop(now + 0.4);
          break;

        case "whoosh":
          const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.5, this.ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          for (let i = 0; i < noiseBuffer.length; i++) { output[i] = Math.random() * 2 - 1; }
          const noise = this.ctx.createBufferSource();
          noise.buffer = noiseBuffer;
          const noiseFilter = this.ctx.createBiquadFilter();
          noiseFilter.type = "lowpass";
          noiseFilter.frequency.setValueAtTime(200, now);
          noiseFilter.frequency.exponentialRampToValueAtTime(1200, now + 0.4);
          const noiseGain = this.ctx.createGain();
          noiseGain.gain.setValueAtTime(0.03, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
          noise.connect(noiseFilter);
          noiseFilter.connect(noiseGain);
          noiseGain.connect(this.getSfxBus());
          noise.start(now);
          break;

        case "chime":
          osc.type = "triangle";
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.exponentialRampToValueAtTime(1320, now + 0.1);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
          osc.start(now);
          osc.stop(now + 1.2);
          break;

        case "draw":
          osc.type = "sine";
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
          break;

        case "lock":
          osc.type = "triangle";
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.setValueAtTime(440, now + 0.05);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
          break;

        case "reroll":
          osc.type = "sine";
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.exponentialRampToValueAtTime(440, now + 0.3);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
          break;

        case "shuffle":
          osc.type = "sine";
          for (let i = 0; i < 5; i++) {
            osc.frequency.setValueAtTime(200 + Math.random() * 400, now + i * 0.05);
          }
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
          break;

        case "victory":
          osc.type = "sine";
          const melody = [523.25, 659.25, 783.99, 1046.50];
          melody.forEach((freq, i) => {
            osc.frequency.setValueAtTime(freq, now + i * 0.15);
          });
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
          osc.start(now);
          osc.stop(now + 0.8);
          break;

        case "success":
          osc.type = "sine";
          osc.frequency.setValueAtTime(523.25, now); 
          osc.frequency.setValueAtTime(659.25, now + 0.1); 
          osc.frequency.setValueAtTime(783.99, now + 0.2); 
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
          osc.start(now);
          osc.stop(now + 0.5);
          break;

        case "fail":
          osc.type = "sine";
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.linearRampToValueAtTime(110, now + 0.4);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.linearRampToValueAtTime(0.001, now + 0.4);
          osc.start(now);
          osc.stop(now + 0.4);
          break;

        case "tick":
          osc.type = "sine";
          osc.frequency.setValueAtTime(1200, now);
          gain.gain.setValueAtTime(0.03, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.start(now);
          osc.stop(now + 0.05);
          break;

        case "record":
          osc.type = "sine";
          const recordMelody = [440, 554.37, 659.25, 880];
          recordMelody.forEach((freq, i) => {
            osc.frequency.setValueAtTime(freq, now + i * 0.1);
          });
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
          osc.start(now);
          osc.stop(now + 0.6);
          break;

        case "ripple":
          osc.type = "sine";
          osc.frequency.setValueAtTime(330, now);
          osc.frequency.exponentialRampToValueAtTime(440, now + 0.2);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
          osc.start(now);
          osc.stop(now + 0.5);
          break;

        case "dream_enter":
          osc.type = "sine";
          osc.frequency.setValueAtTime(110, now);
          osc.frequency.exponentialRampToValueAtTime(660, now + 1.2);
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.15, now + 0.4);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
          osc.start(now);
          osc.stop(now + 1.5);
          break;
      }
    } catch (e) {
      console.warn("Sound blocked by browser or not supported");
    }
  }
}

export const sounds = new SoundEngine();
