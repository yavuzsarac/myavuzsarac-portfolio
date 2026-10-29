import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SpaceAudioContext } from './useSpaceAudio';
import { readStorage, writeStorage } from './storage';
import { DEFAULT_MUSIC_VOLUME, parseAudioPreferences } from './audioSettings';
import { SpaceAudioEngine } from '../components/space/SpaceAudioEngine';

export default function SpaceAudioProvider({ children }) {
  const [preferences, setPreferences] = useState(() => parseAudioPreferences(readStorage('portfolioSoundEnabled', 'true'), readStorage('portfolioVolume', String(DEFAULT_MUSIC_VOLUME))));
  const [status, setStatus] = useState('waiting');
  const [trackInfo, setTrackInfo] = useState(null);
  const engineRef = useRef(null);
  const preferenceRef = useRef(preferences);
  const begin = useCallback(async (allowResume = true) => {
    const engine = engineRef.current;
    if (!engine || !engine.enabled) return;
    const playing = await engine.start(allowResume);
    if (engineRef.current === engine) { setStatus(playing ? 'playing' : 'waiting'); setTrackInfo(engine.trackInfo || null); }
  }, []);

  useEffect(() => {
    const engine = new SpaceAudioEngine(import.meta.env.SPACE_MUSIC_TRACKS || {});
    engineRef.current = engine;
    engine.configure(preferenceRef.current.enabled, preferenceRef.current.volume);
    // Try once without forcing a blocked resume; a gesture unlocks a suspended context.
    const initial = setTimeout(() => begin(false), 0);
    const gesture = event => {
      if (event.type === 'keydown' && (event.ctrlKey || event.metaKey || event.altKey || event.key === 'Escape')) return;
      if (engine.context?.state !== 'running') begin();
    };
    const click = event => {
      if (event.target.closest('button, a') && !event.target.closest('.sound-control')) engine.play('click');
    };
    document.addEventListener('pointerdown', gesture, true);
    document.addEventListener('keydown', gesture, true);
    document.addEventListener('click', click);
    return () => {
      clearTimeout(initial);
      document.removeEventListener('pointerdown', gesture, true); document.removeEventListener('keydown', gesture, true);
      document.removeEventListener('click', click); engine.dispose(); engineRef.current = null;
    };
  }, [begin]);

  const update = useCallback(patch => {
    const next = { ...preferenceRef.current, ...patch };
    preferenceRef.current = next; setPreferences(next);
    writeStorage('portfolioSoundEnabled', String(next.enabled)); writeStorage('portfolioVolume', String(next.volume));
    engineRef.current?.configure(next.enabled, next.volume);
    if (next.enabled) begin();
  }, [begin]);
  const play = useCallback(kind => engineRef.current?.play(kind), []);
  const setTrack = useCallback(name => engineRef.current?.setTrack(name), []);
  const value = useMemo(() => ({ ...preferences, status, trackInfo, update, play, setTrack }), [preferences, status, trackInfo, update, play, setTrack]);
  return <SpaceAudioContext.Provider value={value}>{children}</SpaceAudioContext.Provider>;
}




