import { useEffect, useRef, useState } from 'react';
import { planets } from '../content/planets';
import { useLanguage } from '../content/useLanguage';
import { readStorage, writeStorage } from '../content/storage';
import Planet from '../components/space/Planet';
import Spaceship from '../components/space/Spaceship';
import Starfield from '../components/space/Starfield';
import SpaceHeader from '../components/space/SpaceHeader';
import PlanetSignal from '../components/space/PlanetSignal';
import AmbientEvents from '../components/space/AmbientEvents';
import { useSpaceNavigation } from '../content/useSpaceNavigation';
import { useSpaceAudio } from '../content/useSpaceAudio';
export default function SpaceMap() {
 const { ui } = useLanguage();
 const mapRef = useRef(null);
 const [nearby, setNearby] = useState(null);
 const [focused, setFocused] = useState(null);
 const [tutorial, setTutorial] = useState(() => readStorage('tutorialSeen', 'false') !== 'true');
 const [booting, setBooting] = useState(() => readStorage('space-booted', 'false', true) !== 'true');
 const [discovered, setDiscovered] = useState(false);
 const activeId = focused || nearby;
 const activePlanet = planets.find(p => p.id === activeId);
 const navigate = useSpaceNavigation();
 const { play } = useSpaceAudio();
 useEffect(() => { if (activeId) play('proximity'); }, [activeId, play]);
 useEffect(() => {
  const timer = setTimeout(() => { setBooting(false); writeStorage('space-booted', 'true', true); }, 650);
  return () => clearTimeout(timer);
 }, []);
 useEffect(() => {
  const onKey = (event) => {
   const focusedPlanet = planets.find(planet => planet.id === event.target.closest('[data-planet]')?.dataset.planet);
   const destination = focusedPlanet || activePlanet;
   if (matchMedia('(pointer: fine) and (min-width: 761px)').matches && event.key.toLowerCase() === 'e' && destination && !['INPUT','TEXTAREA','BUTTON'].includes(event.target.tagName) && !event.ctrlKey && !event.metaKey && !event.altKey) navigate(destination.route);
  };
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
 }, [activePlanet, navigate]);
 return <div className="space-app space-map-page">
  <Starfield/><AmbientEvents/><SpaceHeader isMap/>
  <main tabIndex={-1} id="main-content" className="space-main">
   <div className="map-intro"><p className="micro"><span/> {ui.eyebrow}</p><h1>{ui.title}<br/><span>{ui.titleAccent}</span></h1><p>{ui.intro}</p></div>
   <div className="sector-label"><span className="micro">{ui.sector}</span><span className="sector-coordinate">RA 19h 23m · DEC +39° 12′</span></div>
   <div className="space-map" ref={mapRef} aria-label={ui.navigation}>
    <svg className="travel-paths" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true"><ellipse cx="495" cy="292" rx="350" ry="177" transform="rotate(12 495 292)"/><path d="M200 180 480 132 770 210 650 456 300 432 200 180 M650 456 870 462"/><circle className="orbit-traveler" r="1.5"><animateMotion dur="32s" repeatCount="indefinite" path="M200 180 480 132 770 210 650 456 300 432 200 180"/></circle></svg>
    <div className="map-cross cross-one" aria-hidden="true">+</div><div className="map-cross cross-two" aria-hidden="true">+</div>
    {planets.map(planet => <Planet key={planet.id} planet={planet} active={activeId === planet.id} onFocusPlanet={setFocused}/>)}
    <Spaceship mapRef={mapRef} onProximity={setNearby} onPointerMode={setFocused}/>
    <button className="asteroid" aria-label={ui.asteroid} onClick={() => setDiscovered(true)}><svg viewBox="0 0 22 20" shapeRendering="crispEdges" aria-hidden="true"><path d="M5 2h10v3h4v10h-4v3H4v-4H1V7h4Z" fill="#686778"/><path d="M5 4h7v3H8v4H4V7h1Z" fill="#9490a1"/><path d="M12 10h4v4h-4Z" fill="#474553"/></svg></button>
    <span className="discovery" role="status">{discovered ? `+1 ${ui.discovered}` : ''}</span>
   </div>
   <div className="map-bottom-line"><span>✦ {ui.mission}</span><span>{String(planets.length).padStart(2, '0')} {ui.destinations} / YS—01</span></div>
  </main>
  <footer className="space-footer">
   <div className="flight-manual"><span className="micro">{ui.controls}</span><div className="desktop-controls"><kbd>↖</kbd> {ui.mouse}<kbd>↵</kbd> {ui.click}</div><small>{ui.keyboard}</small><span className="mobile-controls">{ui.tap}</span></div>
   {activePlanet ? <PlanetSignal planet={activePlanet}/> : <div className="assistant-message"><span className="assistant-icon" aria-hidden="true">▣</span><div><strong>{ui.welcome}</strong><p>{ui.explore}</p></div></div>}
   <div className="location-hud"><span className="micro">{ui.location}</span><strong><span className="online-dot"/>{activePlanet ? ui.locations[activePlanet.id] : ui.deepSpace}</strong></div>
  </footer>
  {tutorial && !booting && <aside className="tutorial"><span className="micro">YS—01 / {ui.controls}</span><p className="desktop-tip">{ui.tutorial}</p><p className="mobile-tip">{ui.mobileTip}</p><button onClick={() => { setTutorial(false); writeStorage('tutorialSeen', 'true'); }}>{ui.dismiss} ↗</button></aside>}
  {booting && <div className="boot-screen" aria-hidden="true"><span>YAVUZ SARAÇ</span><p>{ui.initializing}</p><div className="boot-progress"/></div>}
 </div>;
}






