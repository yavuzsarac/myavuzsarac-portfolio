import { useEffect, useMemo, useRef, useState } from 'react';
import './portfolio.css';

import { copy, projects } from '../content/portfolio';
import { useLanguage } from '../content/useLanguage';
import { useDialogFocus } from '../content/useDialogFocus';
import { Link } from 'react-router-dom';
function Reveal({ children, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('is-visible');
          observer.unobserve(element);
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`demo-reveal ${className}`}>
      {children}
    </div>
  );
}

function Portfolio() {
  const { language, setLanguage } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [activeProject, setActiveProject] = useState(null);
  const [activeSection, setActiveSection] = useState('about');
  const heroRef = useRef(null);
  const t = copy[language];
  useDialogFocus(Boolean(activeProject));

  const filteredProjects = useMemo(
    () => projects.filter((project) => filter === 'all' || project.category.includes(filter)),
    [filter],
  );
  const visibleProjectCount = filteredProjects.length;
  const totalProjectCount = projects.length;

  useEffect(() => {
    document.body.classList.add('demo-active');
    document.documentElement.lang = language;
    document.title = language === 'tr' ? 'Yavuz Saraç · Portföy' : 'Yavuz Saraç · Portfolio';


    return () => {
      document.body.classList.remove('demo-active');
    };
  }, [language]);

  useEffect(() => {
    const handleScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? window.scrollY / height : 0;
      document.documentElement.style.setProperty('--demo-scroll', progress);

      const sections = ['about', 'work', 'journey', 'skills', 'contact'];
      const current =
        sections
          .map((id) => ({ id, top: document.getElementById(id)?.getBoundingClientRect().top ?? Infinity }))
          .filter((item) => item.top <= 180)
          .at(-1)?.id || 'about';
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeProject ? 'hidden' : '';

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setActiveProject(null);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [activeProject]);

  const moveHero = (event) => {
    const bounds = heroRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroRef.current.style.setProperty('--pointer-x', `${x * 14}px`);
    heroRef.current.style.setProperty('--pointer-y', `${y * 10}px`);
  };

  const resetHero = () => {
    heroRef.current?.style.setProperty('--pointer-x', '0px');
    heroRef.current?.style.setProperty('--pointer-y', '0px');
  };

  return (
    <div className="portfolio-demo">
      <div className="demo-progress" aria-hidden="true" />

      <header className="demo-nav">
        <a className="demo-brand" href="#top" aria-label="Yavuz Saraç">
          MYS<span>.</span>
        </a>

        <nav className="demo-nav-links" aria-label="Portfolio">
          {Object.entries(t.nav).map(([id, label]) => (
            <a key={id} className={activeSection === id ? 'is-active' : ''} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>

        <Link className="classic-space-link" to="/">← {language === 'tr' ? 'Uzaya Dön' : 'Back to Space'}</Link><div className="language-switch" aria-label="Language">
          <button
            type="button"
            className={language === 'tr' ? 'is-active' : ''}
            aria-pressed={language === 'tr'}
            onClick={() => setLanguage('tr')}
          >
            TR
          </button>
          <button
            type="button"
            className={language === 'en' ? 'is-active' : ''}
            aria-pressed={language === 'en'}
            onClick={() => setLanguage('en')}
          >
            EN
          </button>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} key={language} className="demo-language-layer">
        <section
          id="top"
          ref={heroRef}
          className="demo-hero"
          onPointerMove={moveHero}
          onPointerLeave={resetHero}
        >
          <div className="hero-lines" aria-hidden="true">
            {Array.from({ length: 7 }, (_, index) => (
              <span key={`vertical-${index}`} className="line-vertical" />
            ))}
            {Array.from({ length: 4 }, (_, index) => (
              <span key={`horizontal-${index}`} className="line-horizontal" />
            ))}
          </div>

          <div className="hero-signal" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="demo-shell hero-content">
            <div className="hero-copy">
              <p className="demo-eyebrow">{t.hero.eyebrow}</p>
              <h1>
                {t.hero.title}
                <span>{t.hero.titleAccent}</span>
              </h1>
              <p className="hero-description">{t.hero.description}</p>
              <div className="hero-actions">
                <a className="demo-button demo-button-primary" href="#work">
                  {t.hero.projects} <span aria-hidden="true">↓</span>
                </a>
                <a
                  className="demo-button demo-button-secondary"
                  href="https://github.com/yavuzsarac"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.hero.github} <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="portrait-index">01 / 04</div>
              <div className="portrait-frame">
                <img src="/profil.png" alt="" />
              </div>
              <div className="portrait-caption">YAVUZ SARAÇ · 2026</div>
            </div>

            <div className="hero-meta">
              <div>
                <span>{t.hero.locationLabel}</span>
                <strong>{t.hero.location}</strong>
              </div>
              <div>
                <span>{t.hero.focusLabel}</span>
                <strong>{t.hero.focus}</strong>
              </div>
              <div>
                <span>{t.hero.statusLabel}</span>
                <strong className="status-line">{t.hero.status}</strong>
              </div>
            </div>
          </div>

          <a className="scroll-cue" href="#about">
            <span>{t.hero.scroll}</span>
            <i aria-hidden="true" />
          </a>
        </section>

        <section id="about" className="demo-section about-section">
          <div className="demo-shell">
            <div className="about-heading-row">
              <Reveal className="section-heading about-heading">
                <p className="demo-eyebrow">{t.about.eyebrow}</p>
                <h2>{t.about.title}</h2>
                <p className="about-intro">{t.about.intro}</p>
              </Reveal>

              <Reveal className="about-stats">
                {t.about.stats.map(([value, label]) => (
                  <div key={label}>
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </Reveal>
            </div>

            <div className="biography-layout">
              <Reveal className="biography-aside">
                <span className="biography-code">PROFILE / 04</span>
                <p>{t.about.note}</p>
                <div className="biography-track" aria-hidden="true">
                  {t.about.chapters.map((chapter) => (
                    <span key={chapter.number}>{chapter.number}</span>
                  ))}
                </div>
              </Reveal>

              <div className="biography-content">
                {t.about.chapters.map((chapter) => (
                  <Reveal key={chapter.number} className="biography-chapter">
                    <div className="biography-chapter-heading">
                      <span>{chapter.number}</span>
                      <h3>{chapter.title}</h3>
                    </div>
                    <div className="biography-paragraphs">
                      {chapter.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="demo-section work-section">
          <div className="demo-shell">
            <Reveal className="section-heading work-heading">
              <div>
                <p className="demo-eyebrow">{t.work.eyebrow}</p>
                <h2>{t.work.title}</h2>
              </div>
              <p>{t.work.description}</p>
            </Reveal>

            <Reveal className="project-toolbar">
              <div className="project-filters" aria-label="Project filters">
                {Object.entries(t.work.filters).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    className={filter === id ? 'is-active' : ''}
                    aria-pressed={filter === id}
                    onClick={() => setFilter(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <span>
                {String(visibleProjectCount).padStart(2, '0')} / {String(totalProjectCount).padStart(2, '0')}
              </span>
            </Reveal>

            <div className="demo-project-grid">
              {filteredProjects.map((project, index) => {
                const content = project[language];
                return (
                  <Reveal key={project.id} className="project-reveal">
                    <button
                      type="button"
                      className="demo-project-card"
                      onClick={() => setActiveProject(project)}
                    >
                      <span className="project-number">{String(index + 1).padStart(2, '0')}</span>
                      <div className={`project-media ${project.imageFit === 'contain' ? 'is-contain' : ''}`}>
                        <img loading="lazy" src={project.image} alt={content.title} />
                      </div>
                      <div className="project-card-copy">
                        <h3>{content.title}</h3>
                        <p>{content.summary}</p>
                        <div className="project-card-footer">
                          <span>{content.tags.slice(0, 2).join(' · ')}</span>
                          <strong>{t.work.inspect} <i aria-hidden="true">↗</i></strong>
                        </div>
                      </div>
                    </button>
                  </Reveal>
                );
              })}

            </div>
          </div>
        </section>

        <section id="journey" className="demo-section journey-section">
          <div className="demo-shell">
            <Reveal className="section-heading journey-heading">
              <p className="demo-eyebrow">{t.journey.eyebrow}</p>
              <h2>{t.journey.title}</h2>
              <p>{t.journey.description}</p>
            </Reveal>

            <div className="journey-list">
              {t.journey.items.map((item, index) => (
                <Reveal key={item.date} className="journey-item">
                  <span className="journey-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="journey-date">{item.date}</span>
                  <div>
                    <h3>{item.role}</h3>
                    <h4>{item.company}</h4>
                  </div>
                  <p>{item.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="demo-section skills-section">
          <div className="demo-shell">
            <Reveal className="section-heading skills-heading">
              <p className="demo-eyebrow">{t.skills.eyebrow}</p>
              <h2>{t.skills.title}</h2>
            </Reveal>

            <div className="skills-grid">
              {t.skills.groups.map((group, index) => (
                <Reveal key={group.title} className="skill-group">
                  <div className="skill-group-title">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <h3>{group.title}</h3>
                  </div>
                  <div className="skill-cloud">
                    {group.items.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="demo-section contact-section">
          <div className="demo-shell contact-layout">
            <Reveal className="section-heading contact-heading">
              <p className="demo-eyebrow">{t.contact.eyebrow}</p>
              <h2>{t.contact.title}</h2>
              <p>{t.contact.description}</p>
            </Reveal>

            <Reveal className="contact-links">
              <a href={`mailto:${t.contact.email}`}>
                <span>{t.contact.emailLabel}</span>
                <strong>{t.contact.email}</strong>
                <i aria-hidden="true">↗</i>
              </a>
              <a href="https://linkedin.com/in/myavuzsarac" target="_blank" rel="noreferrer">
                <span>{t.contact.linkedinLabel}</span>
                <strong>{t.contact.linkedin}</strong>
                <i aria-hidden="true">↗</i>
              </a>
            </Reveal>
          </div>
        </section>

        <footer className="demo-footer">
          <div className="demo-shell">
            <Reveal>
              <p className="demo-eyebrow">{t.footer.eyebrow}</p>
              <h2>{t.footer.title}</h2>
              <p>{t.footer.text}</p>
              <a
                className="demo-button demo-button-primary"
                href="https://github.com/yavuzsarac"
                target="_blank"
                rel="noreferrer"
              >
                {t.footer.action} <span aria-hidden="true">↗</span>
              </a>
            </Reveal>
            <div className="footer-bottom">
              <span>© {new Date().getFullYear()} · {t.footer.note}</span>
              <a href="#top">{t.footer.back} ↑</a>
            </div>
          </div>
        </footer>
      </main>

      {activeProject && (
        <div
          className="project-dialog-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveProject(null);
          }}
        >
          <div className="project-dialog" role="dialog" aria-modal="true" aria-labelledby="project-dialog-title">
            <button
              type="button"
              className="dialog-close"
              aria-label={t.work.close}
              onClick={() => setActiveProject(null)}
            >
              ×
            </button>
            <div className={`dialog-media ${activeProject.imageFit === 'contain' ? 'is-contain' : ''}`}>
              <img src={activeProject.image} alt={activeProject[language].title} />
            </div>
            <div className="dialog-content">
              <p className="demo-eyebrow">{activeProject[language].tags.join(' · ')}</p>
              <h2 id="project-dialog-title">{activeProject[language].title}</h2>
              <p className="dialog-summary">{activeProject[language].summary}</p>
              <h3>{t.work.challenge}</h3>
              <p>{activeProject[language].purpose}</p>
              <h3>{t.work.highlights}</h3>
              <ul>
                {activeProject[language].highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              {activeProject.links && (
                <div className="dialog-actions">
                  {activeProject.links.github && (
                    <a href={activeProject.links.github} target="_blank" rel="noreferrer">
                      {t.work.github} ↗
                    </a>
                  )}
                  {activeProject.links.live && (
                    <a href={activeProject.links.live} target="_blank" rel="noreferrer">
                      {t.work.live} ↗
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Portfolio;
