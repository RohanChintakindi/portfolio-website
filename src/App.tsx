import { useEffect, useMemo, useState } from 'react';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import './App.css';
import { experiences, projects, skillCategories, interests } from './data/portfolio';
import { fetchPosts, getImageUrl, type BlogPost, type SanityImage } from './lib/sanity';

type Theme = 'light' | 'dark';

const projectMedia: Record<string, { devpost: string; image: string; embed?: string }> = {
  MediCall: {
    devpost: 'https://devpost.com/software/medicall-xhds85',
    image: 'https://d112y698adiu2z.cloudfront.net/photos/production/software_thumbnail_photos/003/344/975/datas/medium.png',
  },
  IronVision: {
    devpost: 'https://devpost.com/software/ironvision',
    image: 'https://d112y698adiu2z.cloudfront.net/photos/production/software_thumbnail_photos/004/350/977/datas/medium.png',
  },
  SuiTix: {
    devpost: 'https://devpost.com/software/suitix',
    image: 'https://d112y698adiu2z.cloudfront.net/photos/production/software_thumbnail_photos/003/899/524/datas/medium.png',
    embed: 'https://www.youtube.com/embed/Whz3DoW8TeI',
  },
  Roameo: {
    devpost: 'https://devpost.com/software/roameo-dtrzau',
    image: 'https://d112y698adiu2z.cloudfront.net/photos/production/software_thumbnail_photos/003/370/366/datas/medium.png',
    embed: 'https://www.youtube.com/embed/dqq1xoLwDOY',
  },
  'ClinicFlow AI': {
    devpost: 'https://devpost.com/software/clinicflow-ai',
    image: 'https://d112y698adiu2z.cloudfront.net/photos/production/software_thumbnail_photos/003/330/068/datas/medium.png',
  },
};

const getInitialTheme = (): Theme => {
  const saved = window.localStorage.getItem('rohan-theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const formatDate = (date: string) => new Intl.DateTimeFormat('en', {
  month: 'short',
  year: 'numeric',
}).format(new Date(date));

function ThemeButton({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <button
      className="theme-button"
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}

function SiteHeader({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <header className="page-header">
      <a className="page-name" href="#/">Rohan Chintakindi</a>
      <nav aria-label="Primary navigation">
        <a href="#/">Home</a>
        <a href="#/writing">Writing</a>
        <a href="#/work">Work</a>
        <a href="#/experience">Experience</a>
        <a href="#/background">Background</a>
        <a href="https://github.com/RohanChintakindi" target="_blank" rel="noreferrer">GitHub</a>
        <ThemeButton theme={theme} onToggle={onToggle} />
      </nav>
    </header>
  );
}

function HomePage({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <main className="home-page">
      <div className="home-title-row">
        <h1>Rohan Chintakindi</h1>
        <ThemeButton theme={theme} onToggle={onToggle} />
      </div>

      <p>
        Full-stack engineer, AI/ML researcher, and quant analyst building at the intersection
        of systems, intelligence, and markets. US Citizen.
      </p>
      <p>
        I study Computer Science and Mathematics at the University of Maryland, College Park.
      </p>

      <div className="inline-links" aria-label="Links">
        <a href="#/work">Work</a>
        <a href="#/writing">Writing</a>
        <a href="#/background">Background</a>
        <a href="mailto:rchintak@umd.edu">Email</a>
        <a href="https://github.com/RohanChintakindi" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://linkedin.com/in/rohan-chintakindi" target="_blank" rel="noreferrer">LinkedIn</a>
        <a href="https://devpost.com/rchintak" target="_blank" rel="noreferrer">Devpost</a>
      </div>

      <section className="compact-section">
        <h2>Experience</h2>
        <div className="compact-list">
          {experiences.slice(0, 4).map((experience) => (
            <div className="compact-item" key={`${experience.company}-${experience.role}`}>
              <div>
                <a href="#/experience">{experience.role}</a>
                <span>{experience.company}</span>
              </div>
              <span>{experience.date}</span>
            </div>
          ))}
        </div>
        <a className="more-link" href="#/experience">More Experience</a>
      </section>

      <section className="compact-section">
        <h2>Notable Work</h2>
        <div className="compact-list">
          {projects.slice(0, 3).map((project) => (
            <article className="home-work-item" key={project.name}>
              <div>
                <a href="#/work">{project.name}</a>
                <span>{project.award}</span>
              </div>
              <p>{project.desc}</p>
            </article>
          ))}
        </div>
        <a className="more-link" href="#/work">More Work</a>
      </section>
    </main>
  );
}

function WorkPage({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <>
      <SiteHeader theme={theme} onToggle={onToggle} />
      <main className="work-page page-content-wide">
        <div className="page-intro">
          <h1>Work</h1>
          <p>Engineering, research, and projects.</p>
        </div>

        <section aria-labelledby="projects-heading">
          <h2 className="visually-hidden" id="projects-heading">Projects</h2>
          <div className="work-grid">
            {projects.map((project) => (
              <article className="work-card" key={project.name}>
                {projectMedia[project.name]?.embed ? (
                  <iframe
                    className="work-media"
                    src={projectMedia[project.name].embed}
                    title={`${project.name} demo video`}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <a
                    className="work-media-link"
                    href={projectMedia[project.name]?.devpost}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      className="work-media"
                      src={projectMedia[project.name]?.image}
                      alt={`${project.name} project cover from Devpost`}
                      loading="lazy"
                    />
                  </a>
                )}
                <h3>
                  <a href={projectMedia[project.name]?.devpost} target="_blank" rel="noreferrer">
                    {project.name}
                  </a>
                </h3>
                <div className="work-meta">{project.award}</div>
                <p>{project.desc}</p>
                <div className="work-tech">{project.tech.join(' · ')}</div>
              </article>
            ))}
          </div>
        </section>

      </main>
    </>
  );
}

function ExperiencePage({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const current = experiences.filter((experience) => experience.date.includes('Present'));
  const earlier = experiences.filter((experience) => !experience.date.includes('Present'));

  const renderGroup = (label: string, items: typeof experiences) => (
    <section className="experience-group" aria-labelledby={`${label.toLowerCase()}-experience-heading`}>
      <div className="experience-group-header">
        <h2 id={`${label.toLowerCase()}-experience-heading`}>{label}</h2>
        <span>{items.length} {items.length === 1 ? 'role' : 'roles'}</span>
      </div>
      <div className="experience-list">
        {items.map((experience) => (
          <details className="experience-item" key={`${experience.company}-${experience.role}`}>
            <summary>
              <div className="experience-role">
                <strong>{experience.role}</strong>
                <span>{experience.company}</span>
              </div>
              <div className="experience-date">
                <span>{experience.date}</span>
                <span>{experience.location}</span>
              </div>
              <span className="experience-action">
                <span className="experience-action-view">View details</span>
                <span className="experience-action-close">Close</span>
              </span>
            </summary>
            <div className="experience-details">
              <ul>
                {experience.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
            </div>
          </details>
        ))}
      </div>
    </section>
  );

  return (
    <>
      <SiteHeader theme={theme} onToggle={onToggle} />
      <main className="experience-page page-content-wide">
        <div className="page-intro">
          <h1>Experience</h1>
          <p>Roles and research.</p>
        </div>

        <div className="experience-groups">
          {renderGroup('Current', current)}
          {renderGroup('Earlier', earlier)}
        </div>
      </main>
    </>
  );
}

function BackgroundPage({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <>
      <SiteHeader theme={theme} onToggle={onToggle} />
      <main className="background-page page-content-wide">
        <div className="page-intro">
          <h1>Background</h1>
          <p>Education, interests, and tools.</p>
        </div>

        <section className="profile-section" aria-labelledby="profile-heading">
          <h2 className="visually-hidden" id="profile-heading">Background</h2>
          <div className="profile-grid">
            <div>
              <strong>University of Maryland, College Park</strong>
              <p>Bachelor of Science in Computer Science and Mathematics</p>
              <p>Aug 2024 — Dec 2027</p>
              <p>{interests}</p>
            </div>
            <dl>
              {skillCategories.map((category) => (
                <div key={category.label}>
                  <dt>{category.label}</dt>
                  <dd>{category.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
    </>
  );
}

function WritingPage({ theme, onToggle, posts }: {
  theme: Theme;
  onToggle: () => void;
  posts: BlogPost[];
}) {
  return (
    <>
      <SiteHeader theme={theme} onToggle={onToggle} />
      <main className="writing-page page-content-narrow">
        <div className="page-intro">
          <h1>Writing</h1>
          <p>Notes and research writeups.</p>
        </div>
        <div className="post-list">
          {posts.map((post) => (
            <article className="post-row" key={post._id}>
              <div>
                <a href={`#/writing/${post.slug}`}>{post.title}</a>
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              </div>
              <p>{post.excerpt}</p>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}

function ArticleImage({ value }: { value: SanityImage }) {
  const src = getImageUrl(value, 1440);
  if (!src) return null;
  return (
    <figure>
      <img src={src} alt={value.alt || ''} loading="lazy" />
      {value.caption && <figcaption>{value.caption}</figcaption>}
    </figure>
  );
}

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => <ArticleImage value={value as SanityImage} />,
  },
  marks: {
    link: ({ value, children }) => {
      const href = typeof value?.href === 'string' ? value.href : '#';
      const external = href.startsWith('http');
      return <a href={href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>{children}</a>;
    },
  },
};

function ArticlePage({ theme, onToggle, post }: {
  theme: Theme;
  onToggle: () => void;
  post?: BlogPost;
}) {
  return (
    <>
      <SiteHeader theme={theme} onToggle={onToggle} />
      <main className="article-page">
        {!post ? (
          <a href="#/writing">Back to Writing</a>
        ) : (
          <>
            <header className="article-header">
              <a href="#/writing">Writing</a>
              <h1>{post.title}</h1>
              <p>{post.excerpt}</p>
              <div className="article-meta">
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                {post.tags?.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </header>
            {post.mainImage && (
              <figure className="article-hero">
                <img src={getImageUrl(post.mainImage, 1800)} alt={post.mainImage.alt || ''} />
                {post.mainImage.caption && <figcaption>{post.mainImage.caption}</figcaption>}
              </figure>
            )}
            <article className="article-body">
              <PortableText value={post.body} components={portableTextComponents} />
            </article>
          </>
        )}
      </main>
    </>
  );
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [route, setRoute] = useState(window.location.hash || '#/');
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem('rohan-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.title = 'Rohan Chintakindi';
    fetchPosts().then(setPosts).catch(() => setPosts([]));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  const selectedPost = useMemo(() => {
    const slug = route.match(/^#\/writing\/(.+)$/)?.[1];
    return slug ? posts.find((post) => post.slug === slug) : undefined;
  }, [posts, route]);

  const toggleTheme = () => setTheme((value) => value === 'dark' ? 'light' : 'dark');

  if (route.startsWith('#/writing/')) {
    return <ArticlePage theme={theme} onToggle={toggleTheme} post={selectedPost} />;
  }
  if (route === '#/writing') {
    return <WritingPage theme={theme} onToggle={toggleTheme} posts={posts} />;
  }
  if (route === '#/work') {
    return <WorkPage theme={theme} onToggle={toggleTheme} />;
  }
  if (route === '#/experience') {
    return <ExperiencePage theme={theme} onToggle={toggleTheme} />;
  }
  if (route === '#/background') {
    return <BackgroundPage theme={theme} onToggle={toggleTheme} />;
  }
  return <HomePage theme={theme} onToggle={toggleTheme} />;
}
