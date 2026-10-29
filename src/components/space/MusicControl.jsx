import { useRef, useState } from 'react';
import { useLanguage } from '../../content/useLanguage';
import { useSpaceAudio } from '../../content/useSpaceAudio';
export default function MusicControl({ floating = false }) {
  const { ui } = useLanguage();
  const { enabled, volume, status, trackInfo, update } = useSpaceAudio();
  const toggleRef = useRef(null);
  const [open, setOpen] = useState(false);
  return <div data-track-kind={trackInfo?.kind} data-track-source={trackInfo?.src} data-track-duration={trackInfo?.duration} data-track-start={trackInfo?.startedAt} className={`sound-control ${floating ? 'sound-floating' : ''}`}>
    <button ref={toggleRef} className="music-toggle" aria-label={ui.musicControls} aria-expanded={open} aria-controls="music-panel" onClick={() => setOpen(!open)}>♪ <span>{enabled ? `${Math.round(volume * 100)}%` : ui.muted}</span></button>
    {open && <div id="music-panel" className="music-panel" onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); setOpen(false); toggleRef.current?.focus(); } }}>
      <span className="micro">{ui.musicControls}</span>
      <button className="music-enabled" aria-pressed={enabled} onClick={() => update({ enabled: !enabled })}>{enabled ? ui.soundOn : ui.soundOff} <span>{enabled ? '■' : '□'}</span></button>
      <label htmlFor="music-volume">{ui.musicVolume} <output>{Math.round(volume * 100)}%</output></label>
      <input id="music-volume" type="range" min="0" max="100" step="1" value={Math.round(volume * 100)} onChange={event => update({ volume: Number(event.target.value) / 100 })}/>
      <p role="status">{!enabled ? ui.soundOff : volume === 0 ? ui.musicSilent : status === 'playing' ? ui.audioPlaying : ui.audioWaiting}</p>
    </div>}
  </div>;
}




