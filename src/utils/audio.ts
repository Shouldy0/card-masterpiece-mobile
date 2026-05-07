/**
 * Minimal Arcade Sound Engine
 * Generates synthesized sounds using Web Audio API to avoid external dependencies.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientSource: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  /**
   * Starts a dreamy, ethereal ambient loop
   */
  startAmbient() {
    try {
      this.init();
      if (!this.ctx || this.ambientSource) return;

      const now = this.ctx.currentTime;
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.05, now + 1.5); // 1.5s fade-in
      this.ambientGain.connect(this.getSfxBus());

      // Create a drone using multiple oscillators for depth
      const frequencies = [110, 164.81, 220]; // A2, E3, A3
      frequencies.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        // Subtle detune for shimmer
        osc.detune.setValueAtTime(i * 5, now);
        
        const filter = this.ctx!.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(400, now);

        osc.connect(filter);
        filter.connect(this.ambientGain!);
        osc.start(now);
      });

      this.ambientSource = {} as any; // Mark as started
    } catch (e) {
      console.warn("Ambient audio blocked");
    }
  }

  stopAmbient() {
    if (this.ambientGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.ambientGain.gain.linearRampToValueAtTime(0, now + 1);
      setTimeout(() => {
        this.ctx?.close();
        this.ctx = null;
        this.ambientSource = null;
      }, 1000);
    }
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
