// Existing user-supplied track. Public asset path and filename are case-sensitive on deployment.
export const musicTracks = { space: '/audio/space-theme.mp3' };
export const DEFAULT_MUSIC_VOLUME = .24;
export function parseAudioPreferences(enabled, volume) {
  const parsed = volume === null || volume === '' ? NaN : Number(volume);
  return { enabled: enabled !== 'false', volume: Number.isFinite(parsed) ? Math.max(0, Math.min(1, parsed)) : DEFAULT_MUSIC_VOLUME };
}
// Keep different recordings at a quiet, consistent perceived level while reserving peak headroom.
export function musicGainForLevels(peak, rms) {
  return Math.min(.7, .5 / Math.max(.001, peak), .075 / Math.max(.001, rms));
}
