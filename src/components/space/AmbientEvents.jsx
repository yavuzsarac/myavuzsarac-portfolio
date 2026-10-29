import { useEffect, useState } from 'react';

export default function AmbientEvents() {
  const [event, setEvent] = useState(null);
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let timer, cleanup, sequence = 0, lastType = -1;
    const schedule = () => {
      clearTimeout(timer);
      if (reduced.matches || document.hidden) return;
      timer = setTimeout(() => {
        if (reduced.matches || document.hidden) return;
        let type = Math.floor(Math.random() * 3);
        if (type === lastType) type = (type + 1) % 3;
        lastType = type;
        const kind = ['meteor', 'npc', 'drifter'][type];
        const duration = kind === 'meteor' ? 1100 : kind === 'npc' ? 6500 : 8500;
        setEvent({ kind, id: sequence++, left: 10 + Math.random() * 65, top: 18 + Math.random() * 54, duration, angle: -45 + Math.random() * 70, direction: Math.random() > .5 ? 1 : -1 });
        cleanup = setTimeout(() => { setEvent(null); schedule(); }, duration);
      }, 10000 + Math.random() * 12000);
    };
    const reset = () => { clearTimeout(timer); clearTimeout(cleanup); setEvent(null); schedule(); };
    reduced.addEventListener('change', reset);
    document.addEventListener('visibilitychange', reset);
    schedule();
    return () => { clearTimeout(timer); clearTimeout(cleanup); reduced.removeEventListener('change', reset); document.removeEventListener('visibilitychange', reset); };
  }, []);
  return <div className="ambient-events" aria-hidden="true">{event && <div key={event.id} className={`ambient-object ambient-${event.kind}`} style={{ left: `${event.left}%`, top: `${event.top}%`, '--event-duration': `${event.duration}ms`, '--direction': event.direction, '--meteor-angle': String(event.angle) + 'deg' }}>{event.kind === 'npc' ? <svg viewBox="0 0 20 12" shapeRendering="crispEdges"><path d="M2 5h4V3h6V1h2v4h4v3h-6v3H6V8H2Z" fill="#859bac"/><path d="M9 4h4v3H9Z" fill="#b6e4db"/><path d="M0 5h3v3H0Z" fill="#d5b88b"/></svg> : event.kind === 'drifter' ? <svg viewBox="0 0 20 20" shapeRendering="crispEdges"><path d="M5 2h9v3h4v9h-4v4H4v-4H1V7h4Z" fill="#697384"/><path d="M5 4h6v4H5Z" fill="#9196a5"/><path d="M10 10h4v4h-4Z" fill="#404c60"/></svg> : null}</div>}</div>;
}

