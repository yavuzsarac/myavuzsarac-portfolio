import { Link } from 'react-router-dom';
import { useLanguage } from '../../content/useLanguage';
export default function PlanetSignal({ planet }) {
  const { ui, t } = useLanguage();
  return <div className="planet-signal" style={{ '--planet-color': planet.color }}>
    <div className="signal-copy" role="status" aria-live="polite"><span className="micro">{ui.signalDetected}</span><strong>{planet.id === 'classic' ? ui.classic : t.nav[planet.key]}</strong><small>{ui.signalStrong} · {ui.orbitLocked}</small></div>
    <Link className="signal-action" to={planet.route}>{ui.enterOrbit} <span className="keyboard-entry">E ↵</span><span className="touch-entry">↗</span></Link>
  </div>;
}
