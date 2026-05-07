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
  private masterGain: GainNode | null = null;
  private musicVolume: number = 0.7;
  private soundEnabled: boolean = true;

  setMusicVolume(vol: number) {
    this.musicVolume = vol;
    if (this.ambientGain && this.ctx) {
      const config = this.currentScene ? this.sceneConfigs[this.currentScene] : null;
      if (config) {
        const now = this.ctx.currentTime;
        this.ambientGain.gain.linearRampToValueAtTime(config.gain * vol, now + 0.3);
      }
    }
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (!enabled) {
      this.stopSceneMusic();
    }
  }

  private sceneConfigs: Record<Exclude<SceneMusic, null>, SceneMusicConfig> = {
    home: {
      frequencies: [110, 164.81, 220, 329.63], // A2, E3, A3, E4 - mystical open chord
      types: ["sine", "sine", "triangle", "sine"],
      filterFreq: 600,
      filterType: "lowpass",
      gain: 0.04,
      detune: [0, 5, -3, 8]
    },
    vs: {
      frequencies: [73.42, 146.83, 220], // D2, D3, A3 - tense interval
      types: ["sawtooth", "sine", "triangle"],
      filterFreq: 800,
      filterType: "bandpass",
      gain: 0.03,
      detune: [0, 10, -5]
    },
    match: {
      frequencies: [130.81, 196, 261.63, 392], // C3, G3, C4, G4 - powerful fifth
      types: ["sine", "triangle", "sine", "triangle"],
      filterFreq: 1000,
      filterType: "lowpass",
      gain: 0.035,
      detune: [0, 3, -2, 5]
    },
    end: {
      frequencies: [220, 277.18, 329.63, 440], // A3, C#4, E4, A4 - resolution chord
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
    }
  }

  /**
   * Start background music for a specific scene
   */
  startSceneMusic(scene: Exclude<SceneMusic, null>) {
    try {
      if (!this.soundEnabled) return;
      if (this.currentScene === scene) return;
      this.init();
      if (!this.ctx) return;

      // Stop current music with fade out
      if (this.ambientGain) {
        const now = this.ctx.currentTime;
        this.ambientGain.gain.linearRampToValueAtTime(0, now + 0.5);
        // Schedule cleanup after fade
        setTimeout(() => this.cleanupOscillators(), 500);
      }

      const config = this.sceneConfigs[scene];
      const now = this.ctx.currentTime;

      // Create master gain for this scene
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0, now);
      this.ambientGain.gain.linearRampToValueAtTime(config.gain * this.musicVolume, now + 1.5);
      this.ambientGain.connect(this.ctx.destination);

      // Create oscillators for this scene
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
    } catch (e) {
      console.warn("Scene music blocked:", e);
    }
  }

  /**
   * Stop all scene music
   */
  stopSceneMusic() {
    if (this.ambientGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.ambientGain.gain.linearRampToValueAtTime(0, now + 1);
      this.currentScene = null;
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

  /**
   * Legacy method - starts home ambient
   */
  startAmbient() {
    this.startSceneMusic("home");
  }

  /**
   * Legacy method - stops ambient
   */
  stopAmbient() {
    this.stopSceneMusic();
  }

  play(type: "draw" | "success" | "fail" | "tick" | "record" | "lock" | "reroll" | "shuffle" | "victory" | "pulse" | "whoosh" | "chime" | "ripple" | "dream_enter" | "signature" | "card_flip" | "card_deal") {
    try {
      this.init();
      if (!this.ctx) return;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      const now = this.ctx.currentTime;

      switch (type) {
        case "signature":
          // REVERIE Signature Harmonic Tone
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
          subGain.connect(this.ctx.destination);
          subGain.gain.setValueAtTime(0, now);
          subGain.gain.linearRampToValueAtTime(0.05, now + 0.4);
          subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
          sub.start(now);
          sub.stop(now + 1.2);
          
          osc.start(now);
          osc.stop(now + 1.2);
          break;

        case "card_flip":
          // Mystical paper flip
          osc.type = "triangle";
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          
          // Add a little noise for paper texture
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
          flipNG.connect(this.ctx.destination);
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
          noiseGain.connect(this.ctx.destination);
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
