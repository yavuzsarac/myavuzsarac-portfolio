import test from 'node:test';
import assert from 'node:assert/strict';
import { magneticOffset, restorePosition, selectProximity } from '../src/components/space/spacePhysics.js';
import { parseAudioPreferences } from '../src/content/audioSettings.js';
import { SpaceAudioEngine } from '../src/components/space/SpaceAudioEngine.js';

const bodies = [{ id: 'projects', x: 100, y: 100, radius: 80 }, { id: 'skills', x: 230, y: 100, radius: 80 }];
test('orbit activation has exit hysteresis and a stable switching margin', () => {
  assert.equal(selectProximity({ x: 25, y: 100 }, bodies), 'projects');
  assert.equal(selectProximity({ x: 15, y: 100 }, bodies, 'projects'), 'projects');
  assert.equal(selectProximity({ x: 1, y: 100 }, bodies, 'projects'), null);
  assert.equal(selectProximity({ x: 168, y: 100 }, bodies, 'projects'), 'projects');
  assert.equal(selectProximity({ x: 190, y: 100 }, bodies, 'projects'), 'skills');
});
test('planet gravity stays below 1.5 pixels and is disabled for reduced motion', () => {
  for (let x = 0; x <= 300; x++) {
    const offset = magneticOffset({ x, y: 100 }, bodies[0]);
    assert.ok(Math.hypot(offset.x, offset.y) <= 1.500001);
  }
  assert.deepEqual(magneticOffset({ x: 101, y: 100 }, bodies[0], true), { x: 0, y: 0 });
  assert.deepEqual(magneticOffset({ x: 400, y: 100 }, bodies[0]), { x: 0, y: 0 });
});
test('position memory preserves normalized coordinates and handles invalid sessions', () => {
  assert.deepEqual(restorePosition('{"x":73.25,"y":37.5}'), { x: 73.25, y: 37.5 });
  assert.deepEqual(restorePosition('bad JSON'), { x: 49, y: 54 });
  assert.deepEqual(restorePosition('{"x":-1,"y":105}'), { x: 0, y: 100 });
  assert.deepEqual(restorePosition('{"x":"25","y":null}'), { x: 49, y: 54 });
});
test('audio defaults on and safely restores mute and volume preferences', () => {
  assert.deepEqual(parseAudioPreferences(null, null), { enabled: true, volume: .24 });
  assert.deepEqual(parseAudioPreferences('false', '.25'), { enabled: false, volume: .25 });
  assert.equal(parseAudioPreferences('true', '100').volume, 1);
  assert.equal(parseAudioPreferences('true', '-1').volume, 0);
  assert.equal(parseAudioPreferences('true', 'bad').volume, .24);
});
test('effects respect global mute and cooldown but remain audible with zero music volume', () => {
  const engine = new SpaceAudioEngine();
  assert.equal(engine.play('warp'), false);
  let created = 0;
  const parameter = () => ({ value: 1, setValueAtTime() {}, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {}, cancelScheduledValues() {} });
  engine.context = { state: 'running', currentTime: 1, createOscillator() { created++; return { frequency: parameter(), connect() {}, start() {}, stop() {} }; }, createGain() { return { gain: parameter(), connect() {} }; } };
  engine.master = { gain: parameter() }; engine.music = { gain: parameter() }; engine.duck = { gain: parameter() };
  assert.equal(engine.play('proximity'), true);
  assert.equal(engine.play('proximity'), false);
  assert.equal(created, 1);
  engine.context.currentTime = 2;
  assert.equal(engine.play('proximity'), true);
  engine.enabled = false;
  assert.equal(engine.play('enter'), false);
  engine.enabled = true; engine.volume = 0;
  assert.equal(engine.play('enter'), true);
  assert.equal(created, 3);
});


test('music slider changes only the music bus while mute controls the shared output', () => {
  const engine = new SpaceAudioEngine();
  const targets = { master: [], music: [] };
  engine.context = { state: 'running', currentTime: 4 };
  engine.master = { gain: { setTargetAtTime(value) { targets.master.push(value); } } };
  engine.music = { gain: { setTargetAtTime(value) { targets.music.push(value); } } };
  engine.configure(true,.24); engine.configure(true,0); engine.configure(false,.24); engine.configure(true,.24);
  assert.deepEqual(targets.master,[1,1,0,1]);
  assert.deepEqual(targets.music,[.24,0,.24,.24]);
});
test('proximity and overlapping warp effects duck music smoothly and recover to unity', () => {
  const engine = new SpaceAudioEngine();
  let events=[];
  engine.context={currentTime:5};
  engine.duck={gain:{value:1,cancelAndHoldAtTime(time){events.push(['hold',time]);},linearRampToValueAtTime(value,time){events.push(['ramp',value,time]);},setValueAtTime(value,time){events.push(['set',value,time]);}}};
  engine.duckMusic('proximity');
  assert.ok(events.some(e=>e[0]==='ramp'&&e[1]===.45&&e[2]>5));
  assert.deepEqual(events.at(-1),['ramp',1,5.6]);
  engine.context.currentTime=5.1; engine.duckMusic('warp');
  engine.context.currentTime=5.15; engine.duckMusic('click');
  assert.equal(engine.duckFloor,.4);
  assert.ok(engine.duckRecovery>=5.85);
  assert.equal(events.at(-1)[1],1);
});

test('autoplay fallback and concurrent gestures load the track once without route-style restarts', async () => {
  const oldWindow=globalThis.window, oldFetch=globalThis.fetch;
  let starts=0, requests=0;
  const parameter=()=>({value:1,setTargetAtTime(){},linearRampToValueAtTime(){},setValueAtTime(){},cancelScheduledValues(){}});
  class FakeAudio {
    state='suspended'; currentTime=0; destination={};
    createGain(){return {gain:parameter(),connect(){},disconnect(){}};}
    resume(){this.state='running';return Promise.resolve();}
    decodeAudioData(){return Promise.resolve({length:32,numberOfChannels:1,duration:1,getChannelData(){return new Float32Array(32).fill(.2);}});}
    createBufferSource(){return {connect(){},start(){starts++;},stop(){},disconnect(){}};}
    close(){this.state='closed';return Promise.resolve();}
  }
  const engine=new SpaceAudioEngine({space:'/audio/space-theme.mp3'});
  try {
    globalThis.window={AudioContext:FakeAudio};
    globalThis.fetch=async()=>{requests++;return {ok:true,arrayBuffer:async()=>new ArrayBuffer(2)};};
    assert.equal(await engine.start(false),false);
    assert.equal(starts,0);
    assert.deepEqual(await Promise.all([engine.start(),engine.start()]),[true,true]);
    assert.equal(engine.trackInfo.kind,'file');
    const start=engine.trackInfo.startedAt;
    assert.equal(await engine.start(),true);
    assert.equal(engine.trackInfo.startedAt,start);
    assert.equal(starts,1); assert.equal(requests,1);
  } finally {engine.dispose();globalThis.window=oldWindow;globalThis.fetch=oldFetch;}
});
