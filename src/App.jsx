import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import LanguageProvider from './content/LanguageProvider';
import { useLanguage } from './content/useLanguage';
import { planets } from './content/planets';
import SpaceMap from './pages/SpaceMap';
import SpaceAudioProvider from './content/SpaceAudioProvider';
import WarpProvider from './components/space/WarpProvider';
import MusicControl from './components/space/MusicControl';
import { useSpaceNavigation } from './content/useSpaceNavigation';
import './space.css';
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Home = lazy(() => import('./pages/Home'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const PlanetPage = lazy(() => import('./pages/PlanetPage'));
function RouteEffects() {
 const { pathname } = useLocation();
 const navigate = useSpaceNavigation();
 const { t, ui } = useLanguage();
 useEffect(() => {
  window.scrollTo(0,0);
  const planet = planets.find(p => pathname === p.route || (p.id === 'projects' && pathname.startsWith('/projects/')));
  document.title = `Yavuz Saraç · ${planet ? (planet.id === 'classic' ? ui.classic : t.nav[planet.key]) : ui.eyebrow}`;
  const onKey = e => { if (e.key === 'Escape' && pathname !== '/' && !['/classic', '/demo'].includes(pathname)) navigate('/'); };
  window.addEventListener('keydown', onKey);
  if (pathname !== '/') requestAnimationFrame(() => document.querySelector('main')?.focus({ preventScroll: true }));
  return () => window.removeEventListener('keydown', onKey);
 }, [pathname, t, ui, navigate]);
 return null;
}
function ClassicAudio() {
 const { pathname } = useLocation();
 return ['/classic', '/demo', '/eski'].includes(pathname) || pathname.startsWith('/proje/') ? <MusicControl floating/> : null;
}
function NotFound() {
 const { ui } = useLanguage();
 return <main id="main-content" className="space-app missing-page"><p>404 / LOST SIGNAL</p><h1>{ui.notFound}</h1><p>{ui.notFoundText}</p><Link to="/">← {ui.back}</Link></main>;
}
export default function App() {
 return <LanguageProvider><SpaceAudioProvider><WarpProvider><RouteEffects/><a className="skip-link" href="#main-content">Skip to content / İçeriğe geç</a><Suspense fallback={<div className="route-loading" aria-label="Loading / Yükleniyor">✦</div>}><Routes><Route path="/" element={<SpaceMap/>}/>{planets.filter(p => p.id !== 'classic').map(p => <Route key={p.id} path={p.route} element={<PlanetPage section={p.id}/>}/>)}<Route path="/projects/:id" element={<PlanetPage section="projects" projectDetail/>}/><Route path="/classic" element={<Portfolio/>}/><Route path="/demo" element={<Portfolio/>}/><Route path="/eski" element={<Home/>}/><Route path="/proje/:id" element={<ProjectDetail/>}/><Route path="*" element={<NotFound/>}/></Routes></Suspense><ClassicAudio/></WarpProvider></SpaceAudioProvider></LanguageProvider>;
}
