// Pixel-space calculations are independent of React and frame timing.
export function selectProximity(point, bodies, currentId = null) {
  const distance = body => Math.hypot(body.x - point.x, body.y - point.y);
  const current = bodies.find(body => body.id === currentId);
  const candidates = bodies.filter(body => distance(body) <= body.radius).sort((a, b) => distance(a) - distance(b));
  const next = candidates[0];
  // Exit hysteresis and a switching margin prevent flickering at orbit boundaries.
  if (current && distance(current) <= current.radius + 18) {
    return next && next.id !== current.id && distance(next) + 16 < distance(current) ? next.id : current.id;
  }
  return next?.id || null;
}
export function magneticOffset(point, body, reducedMotion = false) {
  if (!body || reducedMotion) return { x: 0, y: 0 };
  const dx = body.x - point.x, dy = body.y - point.y;
  const distance = Math.hypot(dx, dy);
  if (!distance || distance > body.radius) return { x: 0, y: 0 };
  // At most 1.5 pixels: visual magnetism never compromises pointing precision.
  const strength = Math.min(1.5, (1 - distance / body.radius) * 1.5);
  return { x: dx / distance * strength, y: dy / distance * strength };
}
export function restorePosition(raw) {
  try {
    const point = JSON.parse(raw);
    if (Number.isFinite(point?.x) && Number.isFinite(point?.y)) {
      return { x: Math.max(0, Math.min(100, point.x)), y: Math.max(0, Math.min(100, point.y)) };
    }
  } catch { /* Invalid session state simply starts at the default location. */ }
  return { x: 49, y: 54 };
}

// The source SVG points upward. These angles describe travel direction, not sprite rotation.
export const SPRITE_ANGLE_OFFSET = Math.PI / 2;
export function movementHeading(from, to, previousHeading, threshold = .9) {
  const dx = to.x - from.x, dy = to.y - from.y;
  if (!Number.isFinite(dx) || !Number.isFinite(dy) || Math.hypot(dx, dy) < threshold) return previousHeading;
  return Math.atan2(dy, dx);
}
export function angleDifference(current, target) {
  return Math.atan2(Math.sin(target - current), Math.cos(target - current));
}
export function turnHeading(current, target, deltaMs, reducedMotion = false) {
  if (reducedMotion) return target;
  const amount = 1 - Math.exp(-Math.max(1, deltaMs) / 48);
  return current + angleDifference(current, target) * amount;
}
export function frameDelta(now, previous) {
  // Never divide by a negative RAF timestamp when restarting after pointer input.
  return previous > 0 && now > previous ? Math.max(1, Math.min(40, now - previous)) : 1000 / 60;
}
export function engineOrigin(point, heading, offset = 22) {
  return { x: point.x - Math.cos(heading) * offset, y: point.y - Math.sin(heading) * offset };
}
