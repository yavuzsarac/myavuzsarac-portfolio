import { Link } from 'react-router-dom';
import { useLanguage } from '../../content/useLanguage';
import PlanetArt from './PlanetArt';
export default function Planet({ planet, active, onFocusPlanet }) {
  const { t, ui } = useLanguage();
  const name = planet.id === 'classic' ? ui.classic : t.nav[planet.key];
  return <Link data-planet={planet.id} to={planet.route} className={`planet planet-${planet.id} ${active ? 'is-active' : ''}`} style={{ '--x': `${planet.x}%`, '--y': `${planet.y}%`, '--planet-color': planet.color }} onFocus={event => { if (event.currentTarget.matches(':focus-visible')) onFocusPlanet(planet.id); }} onBlur={() => onFocusPlanet(null)} aria-label={`${planet.number} — ${name}. ${ui.subtitles[planet.id]}`}>
    <div className="planet-orbit"/><PlanetArt type={planet.type}/>
    <span className="planet-label"><small>{planet.number} /</small> {name} <span className="label-arrow">↗</span></span>
    <span className="planet-subtitle">{ui.subtitles[planet.id]}</span>
    <span className="planet-enter">{ui.enterOrbit} <b>↵</b></span>
  </Link>;
}
