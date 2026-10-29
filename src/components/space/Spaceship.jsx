import { useEffect, useRef } from 'react';
import { readStorage, writeStorage } from '../../content/storage';
import { angleDifference, frameDelta, magneticOffset, movementHeading, restorePosition, selectProximity, SPRITE_ANGLE_OFFSET, turnHeading } from './spacePhysics';
import { EngineTrail } from './engineTrail';

export default function Spaceship({ mapRef, onProximity, onPointerMode }) {
  const shipRef = useRef(null);
  const trailRef = useRef(null);

  useEffect(() => {
    const map = mapRef.current, ship = shipRef.current, canvas = trailRef.current;
    if (!map || !ship || !canvas) return;
    const controls = matchMedia('(pointer: fine) and (min-width: 761px)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const context = canvas.getContext('2d');
    const memory = restorePosition(readStorage('ship-position', 'null', true));
    let position = { x: 0, y: 0 }, previous = { x: 0, y: 0 };
    let width = 1, height = 1, bodies = [], active = null;
    let keyboardMode = false;
    let rawPointer = null, directionAnchor = null;
    let heading = -55 * Math.PI / 180, targetHeading = heading;
    let frame, lastTime = 0, lastMove = -Infinity, disposed = false;
    const trail = new EngineTrail();

    const save = () => writeStorage('ship-position', JSON.stringify({ x: position.x / width * 100, y: position.y / height * 100 }), true);
    const updateSignal = () => {
      const next = selectProximity(position, bodies, active);
      if (next !== active) { active = next; onProximity(next); }
    };
    const paint = () => {
      ship.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`;
    };
    const measure = () => {
      const saved = { x: position.x / width, y: position.y / height };
      const first = bodies.length === 0;
      const bounds = map.getBoundingClientRect();
      if (disposed || bounds.width <= 0 || bounds.height <= 0) return;
      width = bounds.width; height = bounds.height;
      position = first ? { x: memory.x / 100 * width, y: memory.y / 100 * height } : { x: saved.x * width, y: saved.y * height };
      previous = { ...position };
      bodies = [...map.querySelectorAll('.planet')].map(element => {
        const art = element.querySelector('.planet-art').getBoundingClientRect();
        return { id: element.dataset.planet, x: art.left + art.width * .5 - bounds.left, y: art.top + art.height * .52 - bounds.top, radius: Math.max(78, Math.min(125, art.width * .34 + 38)) };
      });
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      context?.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint();
      if (controls.matches) updateSignal();
    };
    const move = event => {
      if (!controls.matches || event.pointerType === 'touch') return;
      if (keyboardMode) { keyboardMode = false; onPointerMode(null); }
      const bounds = map.getBoundingClientRect();
      const pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
      const firstPointer = rawPointer === null;
      rawPointer = pointer;
      if (!directionAnchor) directionAnchor = pointer;
      const nextHeading = movementHeading(directionAnchor, pointer, targetHeading);
      if (Math.hypot(pointer.x - directionAnchor.x, pointer.y - directionAnchor.y) >= .9) directionAnchor = pointer;
      targetHeading = nextHeading;
      if (reduced.matches) { heading = targetHeading; ship.style.setProperty('--ship-angle', String(heading + SPRITE_ANGLE_OFFSET) + 'rad'); }
      const next = selectProximity(pointer, bodies, active);
      const gravity = magneticOffset(pointer, bodies.find(body => body.id === next), reduced.matches);
      position = { x: pointer.x + gravity.x, y: pointer.y + gravity.y };
      if (firstPointer) previous = { ...position };
      if (import.meta.env.DEV) { ship.dataset.pointerX = String(event.clientX); ship.dataset.pointerY = String(event.clientY); }
      lastMove = performance.now();
      // Immediate compositor update removes visible cursor lag; RAF only manages effects.
      paint(); updateSignal();
      if (!frame && !document.hidden) { lastTime = 0; frame = requestAnimationFrame(animate); }
      const x = position.x / width - .5, y = position.y / height - .5;
      map.closest('.space-map-page')?.style.setProperty('--parallax-x', `${reduced.matches ? 0 : x * 5}px`);
      map.closest('.space-map-page')?.style.setProperty('--parallax-y', `${reduced.matches ? 0 : y * 4}px`);
    };
    const animate = () => {
      // Use the same monotonic clock as pointer events, rather than a possibly older RAF timestamp.
      const now = performance.now(), dt = frameDelta(now, lastTime);
      lastTime = now;
      heading = turnHeading(heading, targetHeading, dt, reduced.matches);
      ship.style.setProperty('--ship-angle', `${heading + SPRITE_ANGLE_OFFSET}rad`);
      const moved = Math.hypot(position.x - previous.x, position.y - previous.y) >= .5;
      const moving = now - lastMove < 85;
      ship.classList.toggle('is-moving', moving);
      if (moved && !reduced.matches) trail.emit(previous, position, heading, now, dt);
      const liveTrail = context && !reduced.matches ? trail.draw(context, now, dt, width, height) : 0;
      if (import.meta.env.DEV) {
        canvas.dataset.liveParticles = String(liveTrail);
        canvas.dataset.emitted = String(trail.emitted);
        ship.dataset.heading = String(heading);
        ship.dataset.targetHeading = String(targetHeading);
      }
      previous = { ...position };
      const turning = Math.abs(angleDifference(heading, targetHeading)) > .002;
      frame = moving || liveTrail || turning ? requestAnimationFrame(animate) : null;
    };
    const sync = () => {
      cancelAnimationFrame(frame); frame = null;
      const enabled = controls.matches && !document.hidden;
      map.classList.toggle('ship-pointer-ready', enabled);
      if (enabled) { measure(); lastTime = 0; frame = requestAnimationFrame(animate); }
      else { context?.clearRect(0, 0, width, height); onProximity(null); active = null; }
    };
    const leave = () => { save(); rawPointer = null; directionAnchor = null; };
    const motionPreference = () => {
      if (reduced.matches) { trail.clear(); context?.clearRect(0, 0, width, height); heading = targetHeading; ship.style.setProperty('--ship-angle', String(heading + SPRITE_ANGLE_OFFSET) + 'rad'); }
    };
    reduced.addEventListener('change', motionPreference);
    const keyboard = event => { if (event.key === 'Tab') keyboardMode = true; };
    document.addEventListener('keydown', keyboard);
    const resize = new ResizeObserver(measure);
    resize.observe(map);
    map.addEventListener('pointermove', move);
    map.addEventListener('pointerleave', leave);
    controls.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('pagehide', save);
    document.fonts.ready.then(() => { if (!disposed) measure(); });
    measure(); sync();
    return () => {
      disposed = true; save(); cancelAnimationFrame(frame); resize.disconnect();
      map.classList.remove('ship-pointer-ready');
      map.removeEventListener('pointermove', move); map.removeEventListener('pointerleave', leave);
      controls.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('pagehide', save);
      document.removeEventListener('keydown', keyboard);
      reduced.removeEventListener('change', motionPreference);
    };
  }, [mapRef, onProximity, onPointerMode]);

  return <><canvas className="engine-trail" ref={trailRef} aria-hidden="true"/><div ref={shipRef} className="spaceship" aria-hidden="true"><div className="ship-target"/><div className="ship-body"><svg viewBox="0 0 24 32" shapeRendering="crispEdges"><path className="engine-flame" d="M9 22h6v5h-2v5h-2v-5H9Z" fill="#f1ba77"/><path d="M10 2h4v4h2v8h3v4h3v7h-6v-4H8v4H2v-7h3v-4h3V6h2Z" fill="#cbd8dc"/><path d="M10 9h4v8h-4Z" fill="#66bfd3"/><path d="M2 21h6v4H2Z M16 21h6v4h-6Z" fill="#a67974"/><path d="M10 18h4v4h-4Z" fill="#50677a"/></svg></div><span>YS—01</span></div></>;
}







