import { DEFAULT_MUSIC_VOLUME, musicGainForLevels } from '../../content/audioSettings.js';

// A single engine survives route changes. No timers or React renders drive playback.
export class SpaceAudioEngine {
  constructor(tracks = {}) {
    this.tracks = tracks;
    this.context = null;
    this.enabled = true;
    this.volume = DEFAULT_MUSIC_VOLUME;
    this.current = null;
    this.trackName = null;
    this.generation = 0;
    this.cooldowns = new Map();
    this.cleanupTimers = new Set();
  }
  configure(enabled, volume) {
    this.enabled = enabled; this.volume = volume;
    if (this.context && this.context.state !== 'closed') {
      this.master.gain.setTargetAtTime(enabled ? 1 : 0, this.context.currentTime, .025);
      this.music.gain.setTargetAtTime(volume, this.context.currentTime, .04);
    }
  }
  async start(allowResume = true) {
    if (!this.enabled) return false;
    try {
      if (!this.context) {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) return false;
        this.context = new Audio();
        this.master = this.context.createGain();
        this.music = this.context.createGain();
        this.master.gain.value = this.enabled ? 1 : 0;
        this.music.gain.value = this.volume;
        this.duck = this.context.createGain();
        this.duck.connect(this.music);
        this.music.connect(this.master); this.master.connect(this.context.destination);
      }
      if (this.context.state === 'suspended') {
        if (!allowResume) return false;
        await this.context.resume();
      }
      if (this.context.state !== 'running' || !this.enabled) return false;
      if (!this.trackName && !this.loading) this.loading = this.setTrack('space');
      if (this.loading) {
        const pending = this.loading;
        try { await pending; } finally { if (this.loading === pending) this.loading = null; }
      }
      return true;
    } catch { return false; }
  }
  async setTrack(name) {
    if (!this.context || this.context.state === 'closed' || this.trackName === name) return;
    this.trackName = name;
    const generation = ++this.generation;
    let buffer = null;
    if (this.tracks[name]) {
      try {
        const response = await fetch(this.tracks[name]);
        if (response.ok) buffer = await this.context.decodeAudioData(await response.arrayBuffer());
      } catch { /* A malformed user-supplied track falls back to local ambient tones. */ }
    }
    if (generation !== this.generation || this.context.state === 'closed') return;
    const ctx = this.context, bus = ctx.createGain(), nodes = [];
    bus.gain.value = 0; bus.connect(this.duck);
    if (buffer) {
      const source = ctx.createBufferSource(); source.buffer = buffer; source.loop = true;
      source.connect(bus); source.start(); nodes.push(source);
    } else {
      [110, 164.81, 220].forEach(frequency => {
        const oscillator = ctx.createOscillator(); oscillator.frequency.value = frequency;
        oscillator.type = 'sine'; oscillator.connect(bus); oscillator.start(); nodes.push(oscillator);
      });
    }
    const now = ctx.currentTime;
    let trackGain = .006, peak = 0, sum = 0, samples = 0;
    if (buffer) {
      const stride = Math.max(1, Math.floor(buffer.length / 50000));
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const data = buffer.getChannelData(channel);
        for (let i = 0; i < data.length; i += stride) {
          const value = data[i]; peak = Math.max(peak, Math.abs(value)); sum += value * value; samples++;
        }
      }
      trackGain = musicGainForLevels(peak, Math.sqrt(sum / Math.max(1, samples)));
    }
    bus.gain.linearRampToValueAtTime(trackGain, now + .48);
    if (this.current) {
      const previous = this.current;
      previous.bus.gain.cancelScheduledValues(now);
      previous.bus.gain.setValueAtTime(previous.bus.gain.value, now);
      previous.bus.gain.linearRampToValueAtTime(0, now + .48);
      const timer = setTimeout(() => {
        previous.nodes.forEach(node => { try { node.stop(); node.disconnect(); } catch { /* Already disposed. */ } });
        previous.bus.disconnect(); this.cleanupTimers.delete(timer);
      }, 520);
      this.cleanupTimers.add(timer);
    }
    this.current = { bus, nodes };
    this.trackInfo = { kind: buffer ? 'file' : 'ambient', src: this.tracks[name] || '', duration: buffer?.duration || 0, startedAt: performance.timeOrigin + performance.now(), gain: trackGain };
  }
  play(kind) {
    const ctx = this.context;
    if (!this.enabled || ctx?.state !== 'running') return false;
    const now = ctx.currentTime;
    const cooldown = kind === 'proximity' ? .85 : .09;
    if (now - (this.cooldowns.get(kind) ?? -Infinity) < cooldown) return false;
    this.cooldowns.set(kind, now);
    const definitions = { proximity: [660, 990, .18, .11], click: [440, 620, .065, .075], enter: [320, 880, .25, .13], back: [820, 300, .25, .12], warp: [220, 1200, .32, .12] };
    const [from, to, duration, level] = definitions[kind] || definitions.click;
    const oscillator = ctx.createOscillator(), gain = ctx.createGain();
    oscillator.type = kind === 'warp' ? 'triangle' : 'sine';
    oscillator.frequency.setValueAtTime(from, now);
    oscillator.frequency.exponentialRampToValueAtTime(to, now + duration);
    gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(level, now + .012);
    gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
    oscillator.connect(gain); gain.connect(this.master); oscillator.start(); oscillator.stop(now + duration + .01);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    this.duckMusic(kind);
    return true;
  }
  duckMusic(kind) {
    if (!this.duck || !this.context) return;
    const now = this.context.currentTime;
    const amount = kind === 'click' ? .65 : kind === 'proximity' ? .45 : .4;
    const duration = kind === 'click' ? .35 : kind === 'proximity' ? .6 : .75;
    const active = now < (this.duckRecovery || 0);
    this.duckFloor = active ? Math.min(this.duckFloor, amount) : amount;
    this.duckHold = Math.max(this.duckHold || 0, now + (kind === 'click' ? .07 : .2));
    this.duckRecovery = Math.max(this.duckRecovery || 0, now + duration);
    const gain = this.duck.gain;
    if (gain.cancelAndHoldAtTime) gain.cancelAndHoldAtTime(now);
    else { gain.cancelScheduledValues(now); gain.setValueAtTime(gain.value, now); }
    gain.linearRampToValueAtTime(this.duckFloor, now + .03);
    gain.setValueAtTime(this.duckFloor, this.duckHold);
    gain.linearRampToValueAtTime(1, this.duckRecovery);
  }
  dispose() {
    this.generation++;
    this.cleanupTimers.forEach(timer => clearTimeout(timer));
    if (this.context?.state !== 'closed') this.context?.close().catch(() => {});
    this.context = null;
  }
}





