import { readAudio, storeAudio, type AudioPreferences } from './preferences';
import { MOTIFS, type Cue } from './score';

type AudioStatus = 'idle' | 'ready' | 'paused' | 'blocked' | 'unsupported';
export type AudioSnapshot = { preferences: AudioPreferences; status: AudioStatus; persistent: boolean };

/** One owner per mounted application. Browser audio is allocated only by an explicit action. */
export class AudioService {
  private context?: AudioContext;
  private master?: GainNode;
  private resume?: Promise<boolean>;
  private suspending = false;
  private hidden = false;
  private epoch = 0;
  private voices = new Map<OscillatorNode, GainNode>();
  private lastCue = new Map<Cue, number>();
  private lastFeedback = -Infinity;
  private listeners = new Set<() => void>();
  private snapshot: AudioSnapshot = { preferences: readAudio(), status: 'idle', persistent: true };

  getSnapshot = () => this.snapshot;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };

  private publish(status = this.snapshot.status) {
    this.snapshot = { ...this.snapshot, status };
    this.listeners.forEach(listener => listener());
  }

  private update(preferences: AudioPreferences) {
    this.snapshot = { ...this.snapshot, preferences, persistent: storeAudio(preferences) };
    this.epoch++;
    if (this.master && this.context) this.master.gain.setTargetAtTime(preferences.muted ? 0 : preferences.volume, this.context.currentTime, 0.015);
    if (preferences.muted || preferences.volume === 0) this.pause();
    this.publish();
  }

  setVolume = (volume: number) => {
    if (!Number.isFinite(volume)) return;
    this.update({ ...this.snapshot.preferences, volume: Math.max(0, Math.min(1, volume)) });
  };
  setMuted = (muted: boolean) => {
    this.update({ ...this.snapshot.preferences, muted });
  };
  retry = () => {
    this.lastCue.delete('application');
    this.lastFeedback = -Infinity;
    this.cue('application');
  };

  private audible() { const p = this.snapshot.preferences; return !this.hidden && !p.muted && p.volume > 0; }

  private async activate(): Promise<boolean> {
    if (!this.audible()) return false;
    try {
      if (!this.context) {
        if (typeof window.AudioContext !== 'function') { this.publish('unsupported'); return false; }
        this.context = new window.AudioContext({ latencyHint: 'interactive' });
        this.master = this.context.createGain();
        this.master.gain.value = this.snapshot.preferences.volume;
        this.master.connect(this.context.destination);
      }
      const context = this.context;
      this.master!.gain.setTargetAtTime(this.snapshot.preferences.volume, context.currentTime, 0.015);
      if (context.state === 'running' && !this.suspending) { this.publish('ready'); return true; }
      // Request resume synchronously within the initiating gesture. Never retry on a timer.
      if (!this.resume || this.suspending) {
        // A resume queued before a later suspend cannot resume that later pause.
        const pending = context.resume().then(() => {
          if (this.context !== context || !this.audible()) return false;
          const running = context.state === 'running';
          this.publish(running ? 'ready' : 'blocked');
          return running;
        }).catch(() => { if (this.context === context) this.publish('blocked'); return false; }).finally(() => { if (this.resume === pending) this.resume = undefined; });
        this.resume = pending;
      }
      return await this.resume;
    } catch { this.publish('unsupported'); return false; }
  }

  cue = (cue: Cue) => {
    if (!this.audible()) return;
    const now = performance.now();
    // A comparison can also focus its message app. Give the domain feedback sole ownership.
    if (cue === 'application' && now - this.lastFeedback < 90) return;
    if (now - (this.lastCue.get(cue) ?? -Infinity) < 90) return;
    this.lastCue.set(cue, now);
    if (cue !== 'application') this.lastFeedback = now;
    const epoch = this.epoch;
    void this.activate().then(ready => {
      // A delayed permission response must not replay stale feedback after mute/hide.
      if (!ready || epoch !== this.epoch || !this.audible() || performance.now() - now > 500) return;
      const context = this.context!;
      try {
        for (const [frequency, delay, duration] of MOTIFS[cue]) {
          if (this.voices.size >= 12) break;
          const voice = context.createOscillator();
          const envelope = context.createGain();
          this.voices.set(voice, envelope);
          const start = context.currentTime + delay;
          voice.type = 'sine'; voice.frequency.value = frequency;
          envelope.gain.setValueAtTime(0, start);
          envelope.gain.linearRampToValueAtTime(cue === 'application' ? 0.07 : 0.12, start + 0.012);
          envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
          voice.connect(envelope); envelope.connect(this.master!);
          voice.onended = () => { voice.disconnect(); envelope.disconnect(); this.voices.delete(voice); if (!this.voices.size) this.pause(); };
          voice.start(start); voice.stop(start + duration + 0.015);
        }
      } catch { this.clearVoices(); this.publish('unsupported'); }
    });
  };

  private clearVoices() {
    this.voices.forEach((envelope, voice) => { voice.onended = null; try { voice.stop(); } catch { /* Already ended. */ } voice.disconnect(); envelope.disconnect(); });
    this.voices.clear();
  }
  private pause() {
    this.epoch++;
    this.clearVoices();
    if (this.context) {
      this.master?.gain.cancelScheduledValues(this.context.currentTime);
      this.master?.gain.setValueAtTime(0, this.context.currentTime);
      this.suspending = true;
      void this.context.suspend().catch(() => { /* The master is already silent. */ }).finally(() => { this.suspending = false; });
    }
    this.publish('paused');
  }
  setHidden = (hidden: boolean) => {
    this.hidden = hidden;
    if (hidden) this.pause();
  };
  attach() {
    this.hidden = document.hidden;
    const visibility = () => this.setHidden(document.hidden);
    const pageHide = () => this.setHidden(true);
    const pageShow = () => this.setHidden(document.hidden);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('pagehide', pageHide);
    window.addEventListener('pageshow', pageShow);
    return () => {
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('pagehide', pageHide);
      window.removeEventListener('pageshow', pageShow);
      this.dispose();
    };
  }
  dispose() {
    this.epoch++;
    this.clearVoices();
    this.master?.disconnect(); this.master = undefined;
    const context = this.context;
    this.context = undefined; this.resume = undefined;
    if (context) void context.close().catch(() => { /* Unsupported or already closed. */ });
  }
}
