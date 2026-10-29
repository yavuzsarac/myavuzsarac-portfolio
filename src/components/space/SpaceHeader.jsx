import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { planets } from '../../content/planets';
import { useLanguage } from '../../content/useLanguage';
import MusicControl from './MusicControl';
export default function SpaceHeader({ isMap = false }) {
 const { language, setLanguage, t, ui } = useLanguage();
 const [indexOpen, setIndexOpen] = useState(false);
 const [fullscreen, setFullscreen] = useState(false);
 useEffect(() => {
  const update = () => setFullscreen(Boolean(document.fullscreenElement));
  document.addEventListener('fullscreenchange', update);
  return () => document.removeEventListener('fullscreenchange', update);
 }, []);
 const toggleFullscreen = async () => {
  try { if (document.fullscreenElement) { await document.exitFullscreen(); setFullscreen(false); } else { await document.documentElement.requestFullscreen(); setFullscreen(true); } } catch { /* Fullscreen is optional. */ }
 };
 return <header className="space-header">
  <Link className="space-brand" to="/" aria-label={ui.home}><span className="brand-symbol">✦</span><span>YAVUZ SARAÇ<small>AI · COMPUTER VISION · WEB</small></span></Link>
  <div className="header-center"><span className="online-dot"/>{ui.online}</div>
  <div className="header-actions">
   <div className="space-languages" role="group" aria-label={ui.language}>{['tr','en'].map(lang => <button key={lang} aria-pressed={lang === language} onClick={() => setLanguage(lang)}>{lang.toUpperCase()}</button>)}</div>
   <MusicControl/>
   <button aria-label={ui.map} className="index-button" aria-expanded={indexOpen} aria-controls="planet-index" onClick={() => setIndexOpen(!indexOpen)}>☷ <span>{ui.map}</span></button>
   {isMap && <button className="fullscreen-button" onClick={toggleFullscreen} aria-label={fullscreen ? ui.exitFullscreen : ui.fullscreen}>⛶</button>}
  </div>
  {indexOpen && <nav id="planet-index" className="planet-index" aria-label={ui.navigation} onKeyDown={e => { if (e.key === 'Escape') { e.stopPropagation(); setIndexOpen(false); } }}><span className="micro">{ui.mission}</span>{planets.map(planet => <Link key={planet.id} to={planet.route} onClick={() => setIndexOpen(false)}><small style={{ color: planet.color }}>{planet.number}</small>{planet.id === 'classic' ? ui.classic : t.nav[planet.key]}<span>↗</span></Link>)}</nav>}
 </header>;
}




