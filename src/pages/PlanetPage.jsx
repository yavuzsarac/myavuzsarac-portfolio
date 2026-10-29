import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projects } from '../content/portfolio';
import { planets } from '../content/planets';
import { useLanguage } from '../content/useLanguage';
import SpaceHeader from '../components/space/SpaceHeader';
import Starfield from '../components/space/Starfield';
import PlanetArt from '../components/space/PlanetArt';
function ProjectLinks({ project }) {
 const { t } = useLanguage();
 return <div className="retro-project-links">{project.links?.github && <a href={project.links.github} target="_blank" rel="noopener noreferrer">{t.work.github} ↗</a>}{project.links?.live && <a href={project.links.live} target="_blank" rel="noopener noreferrer">{t.work.live} ↗</a>}</div>;
}
function Projects() {
 const { language, t, ui } = useLanguage();
 const [filter, setFilter] = useState('all');
 const visible = projects.filter(p => filter === 'all' || p.category.includes(filter));
 return <><div className="retro-toolbar"><div className="retro-filters" role="group" aria-label={t.nav.work}>{Object.entries(t.work.filters).map(([id, label]) => <button key={id} onClick={() => setFilter(id)} aria-pressed={filter === id}>{label}</button>)}</div><span>{String(visible.length).padStart(2,'0')} / {projects.length} {ui.projectCount}</span></div><div className="retro-project-grid">{visible.map((project, index) => <article className="retro-project" key={project.id}><Link to={`/projects/${project.id}`} className="retro-project-image"><img loading="lazy" src={project.image} alt={project[language].title} style={{ objectFit: project.imageFit || 'cover' }}/><span>{String(index + 1).padStart(2, '0')} / {project.category.join(' + ')}</span></Link><div className="retro-project-copy"><h2><Link to={`/projects/${project.id}`}>{project[language].title} ↗</Link></h2><p>{project[language].summary}</p><div className="retro-chips">{project[language].tags.map(tag => <span key={tag}>{tag}</span>)}</div><ProjectLinks project={project}/></div></article>)}</div></>;
}
function About() {
 const { t, ui } = useLanguage();
 return <div className="retro-profile"><aside><img src="/profil.png" alt="Yavuz Saraç"/><span className="micro">{ui.profile} / YS—01</span><h2>Yavuz Saraç</h2><p>{t.hero.eyebrow}</p><p>{t.hero.location}</p><div className="profile-stats">{t.about.stats.map(([value,label]) => <div key={label}><strong>{value}</strong><small>{label}</small></div>)}</div><p>{t.about.note}</p></aside><div className="retro-biography">{t.about.chapters.map(chapter => <article key={chapter.number}><span className="micro">{chapter.number} /</span><h2>{chapter.title}</h2>{chapter.paragraphs.map(text => <p key={text}>{text}</p>)}</article>)}</div></div>;
}
function Experience() {
 const { t, ui } = useLanguage();
 return <div className="mission-log"><p className="micro">{ui.log}</p>{t.journey.items.map((item,index) => <article key={item.company}><span className="log-node">{String(index + 1).padStart(2,'0')}</span><div><span className="log-date">{item.date}</span><h2>{item.role}</h2><h3>{item.company}</h3><p>{item.text}</p></div></article>)}</div>;
}
function Skills() {
 const { t, ui } = useLanguage();
 return <div className="retro-skills"><p className="micro">{ui.toolkit}</p>{t.skills.groups.map((group,index) => <article key={group.title}><span className="micro">0{index + 1} /</span><h2>{group.title}</h2><div className="retro-chips">{group.items.map(item => <span key={item}>{item}</span>)}</div></article>)}</div>;
}
function Contact() {
 const { t, ui } = useLanguage();
 return <div className="communication"><p className="micro">{ui.channels}</p>{[{ label: t.contact.emailLabel, value: t.contact.email, href: `mailto:${t.contact.email}` }, { label: 'LinkedIn', value: t.contact.linkedin, href: `https://${t.contact.linkedin}` }, { label: 'GitHub', value: 'github.com/yavuzsarac', href: 'https://github.com/yavuzsarac' }].map((link,index) => <a key={link.label} href={link.href} target={link.href.startsWith('https') ? '_blank' : undefined} rel="noopener noreferrer"><span className="channel-number">0{index+1}</span><div><small>{link.label}</small><strong>{link.value}</strong></div><span>↗</span></a>)}<p>{t.footer.text}</p></div>;
}
export default function PlanetPage({ section, projectDetail = false }) {
 const { id } = useParams();
 const mainRef = useRef(null);
 useEffect(() => { mainRef.current?.focus({ preventScroll: true }); }, [section, id]);
 const { language, t, ui } = useLanguage();
 const planet = planets.find(p => p.id === section);
 const project = projectDetail ? projects.find(p => p.id === id) : null;
 const missing = projectDetail && !project;
 const content = project?.[language];
 return <div className="space-app planet-page" style={{ '--planet-color': planet?.color || '#7ed6e8' }}><Starfield/><SpaceHeader/>
  <main ref={mainRef} tabIndex={-1} id="main-content" className="retro-page-main"><Link className="back-to-space" to="/">← {ui.back}</Link>
   <header className="retro-page-heading"><div><p className="micro">{missing ? '404 /' : `${planet.number} / ${ui.destination}`}</p><h1>{missing ? ui.notFound : content?.title || t.nav[planet.key]}</h1><p>{missing ? ui.notFoundText : content?.summary || t[planet.key].description || t[planet.key].intro || t[planet.key].title}</p></div><PlanetArt type={planet?.type || 'home'}/></header>
   {!projectDetail && section === 'projects' && <Projects/>}
   {!projectDetail && section === 'about' && <About/>}
   {!projectDetail && section === 'experience' && <Experience/>}
   {!projectDetail && section === 'skills' && <Skills/>}
   {!projectDetail && section === 'contact' && <Contact/>}
   {project && <article className="retro-project-detail"><Link to="/projects" className="back-to-space">← {t.nav.work}</Link><img src={project.image} alt={content.title}/><div className="retro-chips">{content.tags.map(tag => <span key={tag}>{tag}</span>)}</div><h2>{t.work.challenge}</h2><p>{content.purpose}</p><h2>{t.work.highlights}</h2><ul>{content.highlights.map(text => <li key={text}>{text}</li>)}</ul><ProjectLinks project={project}/></article>}
   <footer className="retro-page-footer"><span>YAVUZ SARAÇ / {t.hero.location}</span><Link to="/classic">{ui.classic} ↗</Link></footer>
  </main></div>;
}

