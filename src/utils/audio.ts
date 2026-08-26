// Cyberpunk & Futuristic Web Audio Synthesizer for DeSuper by s6ft

class SoundManager {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  public playKeyClick() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800 + Math.random() * 200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio fallback
    }
  }

  public playRun() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.18);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 0.18);
    } catch {
      // Audio fallback
    }
  }

  public playSuccess() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.08, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.25);
      });
    } catch {
      // Audio fallback
    }
  }

  public playError() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.22);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 0.22);
    } catch {
      // Audio fallback
    }
  }

  public playLevelUp() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.1, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.3);
      });
    } catch {
      // Audio fallback
    }
  }

  public playLaserAction() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 0.15);
    } catch {
      // Audio fallback
    }
  }

  public playBossHit() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 0.2);
    } catch {
      // Audio fallback
    }
  }

  public playWarp() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.35);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 0.35);
    } catch {
      // Audio fallback
    }
  }

  public playCoin() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }

  public playNitro() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.4);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {}
  }

  public playShield() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.linearRampToValueAtTime(850, now + 0.15);
      osc.frequency.linearRampToValueAtTime(600, now + 0.3);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }

  public playCrash() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.35);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  }

  public playPowerup() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const freqs = [330, 440, 554, 659, 880];
      freqs.forEach((f, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(f, now + idx * 0.05);
        gain.gain.setValueAtTime(0.08, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.15);
      });
    } catch {}
  }

  // Cyber Synthwave Background Arpeggio Music Generator
  private isMusicPlaying: boolean = false;
  private musicInterval: any = null;

  public toggleMusic(forceState?: boolean): boolean {
    const target = forceState !== undefined ? forceState : !this.isMusicPlaying;
    if (target) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
    return this.isMusicPlaying;
  }

  public getIsMusicPlaying(): boolean {
    return this.isMusicPlaying;
  }

  public startMusic() {
    if (!this.isEnabled || this.isMusicPlaying) return;
    this.initCtx();
    if (!this.ctx) return;

    this.isMusicPlaying = true;
    const chords = [
      [130.81, 196.0, 261.63, 329.63], // C
      [110.0, 164.81, 220.0, 261.63],  // A minor
      [146.83, 220.0, 293.66, 349.23], // D minor
      [98.0, 146.83, 196.0, 246.94],   // G
    ];

    let chordIdx = 0;
    let step = 0;

    const playStep = () => {
      if (!this.isMusicPlaying || !this.ctx || !this.isEnabled) return;
      try {
        const now = this.ctx.currentTime;
        const currentChord = chords[chordIdx];
        const noteFreq = currentChord[step % currentChord.length];

        // Bass/Arp Synth Note
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = step % 2 === 0 ? "sawtooth" : "triangle";
        osc.frequency.setValueAtTime(noteFreq * (step % 2 === 0 ? 0.5 : 1), now);

        gain.gain.setValueAtTime(0.025, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.18);

        step++;
        if (step >= 8) {
          step = 0;
          chordIdx = (chordIdx + 1) % chords.length;
        }
      } catch {}
    };

    this.musicInterval = setInterval(playStep, 220);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const sound = new SoundManager();

