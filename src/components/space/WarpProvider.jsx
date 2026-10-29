import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SpaceNavigationContext } from '../../content/useSpaceNavigation';
import { useSpaceAudio } from '../../content/useSpaceAudio';

export default function WarpProvider({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { play } = useSpaceAudio();
  const [phase, setPhase] = useState(null);
  const locked = useRef(false);
  const timers = useRef([]);
  const travel = useCallback(to => {
    if (locked.current || to === pathname) return;
    const crossingSpace = pathname === '/' || to === '/';
    if (!crossingSpace) { navigate(to); return; }
    play(to === '/' ? 'back' : 'enter');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { navigate(to); return; }
    const ship = document.querySelector('.spaceship')?.getBoundingClientRect();
    const target = [...document.querySelectorAll('.planet')].find(element => element.getAttribute('href') === to)?.querySelector('.planet-art')?.getBoundingClientRect();
    if (ship && target) {
      const dx = target.x + target.width * .5 - ship.x - ship.width * .5;
      const dy = target.y + target.height * .52 - ship.y - ship.height * .5;
      const scale = Math.min(1, 40 / (Math.hypot(dx, dy) || 1));
      document.documentElement.style.setProperty('--departure-x', `${dx * scale}px`);
      document.documentElement.style.setProperty('--departure-y', `${dy * scale}px`);
    }
    locked.current = true;
    setPhase(to === '/' ? 'return' : 'enter');
    document.documentElement.classList.add('is-warping');
    if (to !== '/') timers.current.push(setTimeout(() => play('warp'), 80));
    timers.current.push(setTimeout(() => navigate(to), 280));
    timers.current.push(setTimeout(() => {
      setPhase(null); locked.current = false;
      document.documentElement.classList.remove('is-warping');
      timers.current = [];
    }, 480));
  }, [navigate, pathname, play]);

  useEffect(() => {
    const intercept = event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest('a[href]');
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === pathname || url.hash || url.search) return;
      if (pathname !== '/' && url.pathname !== '/') return;
      event.preventDefault(); travel(url.pathname);
    };
    document.addEventListener('click', intercept, true);
    return () => document.removeEventListener('click', intercept, true);
  }, [pathname, travel]);
  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    locked.current = false;
    document.documentElement.classList.remove('is-warping');
  }, []);

  return <SpaceNavigationContext.Provider value={travel}>{children}{phase && <div className={`warp-overlay warp-${phase}`} aria-hidden="true"><div className="warp-veil"/>{Array.from({ length: 12 }, (_, index) => <i key={index} style={{ '--streak': index, '--angle': `${index * 30}deg` }}/>)}</div>}</SpaceNavigationContext.Provider>;
}




