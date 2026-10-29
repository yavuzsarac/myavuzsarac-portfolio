import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { angleDifference, engineOrigin, frameDelta, movementHeading, SPRITE_ANGLE_OFFSET, turnHeading } from '../src/components/space/spacePhysics.js';
import { EngineTrail } from '../src/components/space/engineTrail.js';
import { musicGainForLevels, musicTracks } from '../src/content/audioSettings.js';

const directions = [[1,0,0],[-1,0,Math.PI],[0,-1,-Math.PI/2],[0,1,Math.PI/2],[1,-1,-Math.PI/4],[-1,-1,-3*Math.PI/4],[1,1,Math.PI/4],[-1,1,3*Math.PI/4]];
test('all eight movement directions match the upward-pointing source sprite', () => {
  for (const [dx,dy,expected] of directions) {
    const heading = movementHeading({x:10,y:10},{x:10+dx*20,y:10+dy*20},.5);
    assert.ok(Math.abs(angleDifference(heading, expected)) < 1e-10);
    const rotation = heading + SPRITE_ANGLE_OFFSET;
    assert.ok(Math.abs(Math.cos(rotation - Math.PI/2) - dx / Math.hypot(dx,dy)) < 1e-10);
    assert.ok(Math.abs(Math.sin(rotation - Math.PI/2) - dy / Math.hypot(dx,dy)) < 1e-10);
  }
});
test('rotation takes the shortest turn at ±180°, ignores jitter and snaps under reduced motion', () => {
  const a = 179 * Math.PI/180, b = -179 * Math.PI/180;
  const next = turnHeading(a,b,16);
  assert.ok(next > a && next - a < 2*Math.PI/180);
  assert.equal(movementHeading({x:0,y:0},{x:.1,y:.1},a), a);
  assert.equal(movementHeading({x:0,y:0},{x:NaN,y:1},a), a);
  assert.equal(turnHeading(a,b,16,true), b);
});
test('first movement after idle cannot produce a negative speed or lose its trail', () => {
  assert.ok(frameDelta(1000,1004.4) > 0);
  const trail = new EngineTrail();
  assert.ok(trail.emit({x:100,y:100},{x:130,y:100},0,1000,-4.4) > 0);
  assert.ok(trail.particles.some(p=>p.expires>1000));
});
test('exhaust origin stays at the rotated back of the ship in all directions', () => {
  for (const [dx,dy,heading] of directions) {
    const rear = engineOrigin({x:100,y:100},heading);
    assert.ok((rear.x-100)*dx + (rear.y-100)*dy < 0);
    assert.ok(Math.abs(Math.hypot(rear.x-100,rear.y-100)-22) < 1e-10);
  }
});
test('particle pool is bounded, stationarity emits nothing and trails expire within 700ms', () => {
  const trail = new EngineTrail();
  assert.equal(trail.emit({x:10,y:10},{x:10,y:10},0,100,16),0);
  for(let i=0;i<1000;i++) trail.emit({x:i,y:10},{x:i+35,y:10},0,100,16);
  assert.equal(trail.particles.length,64);
  assert.ok(trail.particles.every(p=>p.life>=300 && p.life<=700));
  let pixels=0;
  const ctx={clearRect(){},fillRect(){pixels++;}};
  assert.ok(trail.draw(ctx,200,16,1000,500)>0);
  assert.ok(pixels>0);
  assert.equal(trail.draw(ctx,801,16,1000,500),0);
});
test('existing soundtrack filename is case-correct and normalization reserves effect headroom', () => {
  assert.ok(fs.readdirSync(new URL('../public/audio/',import.meta.url)).includes('space-theme.mp3'));
  assert.equal(musicTracks.space,'/audio/space-theme.mp3');
  assert.ok(fs.statSync(new URL('../public/audio/space-theme.mp3',import.meta.url)).size>1000);
  const gain=musicGainForLevels(.98,.2);
  assert.ok(gain*.2<=.07500001);
  assert.ok(gain*.98<=.50000001);
  assert.ok(Number.isFinite(musicGainForLevels(0,0)));
});
