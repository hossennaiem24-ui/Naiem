import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  Copy,
  Cpu,
  Download,
  Mail,
  MapPin,
  Megaphone,
  Phone,
  Play,
  Plus,
  Send,
  TrendingUp,
  Video,
} from 'lucide-react';
import { AboutModal } from './components/AboutModal';
import { ContactModal } from './components/ContactModal';
import { Navbar } from './components/Navbar';
import { ProjectCard } from './components/ProjectCard';
import { UploadAdModal } from './components/UploadAdModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import {
  INITIAL_AD_PROJECTS,
  PROOF_METRICS,
  SERVICES_LIST,
  SHOWREEL_PROJECT,
} from './data/portfolioData';
import type { AdCategory, AdProject, NavSectionId, ServiceItem } from './types/portfolio';

const CATEGORY_TABS: { id: AdCategory; label: string }[] = [
  { id: 'all', label: 'All Projects' },
  { id: 'business', label: 'Business Ads' },
  { id: 'automotive', label: 'Car Action' },
  { id: 'travel', label: 'Travel & Aviation' },
  { id: 'lifestyle', label: 'Lifestyle & Reels' },
  { id: 'ai-creative', label: 'AI Creative' },
];

function renderServiceIcon(iconKey: ServiceItem['iconKey']) {
  switch (iconKey) {
    case 'video':
      return <Play className="w-7 h-7 text-violet-400" aria-hidden="true" />;
    case 'megaphone':
      return <Megaphone className="w-7 h-7 text-indigo-400" aria-hidden="true" />;
    case 'cpu':
      return <Cpu className="w-7 h-7 text-cyan-400" aria-hidden="true" />;
    case 'trending':
      return <TrendingUp className="w-7 h-7 text-fuchsia-400" aria-hidden="true" />;
  }
}

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSectionId>('home');
  const [projects, setProjects] = useState<AdProject[]>(INITIAL_AD_PROJECTS);
  const [selectedCategory, setSelectedCategory] = useState<AdCategory>('all');
  const [showAllProjects, setShowAllProjects] = useState(false);

  const [activeVideo, setActiveVideo] = useState<AdProject | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [contactState, setContactState] = useState<{
    open: boolean;
    service: string;
    context: string;
  }>({ open: false, service: 'Video Editing', context: '' });

  const [copiedEmail, setCopiedEmail] = useState(false);

  // Track visible section while scrolling so navbar highlights accurately
  useEffect(() => {
    const sectionIds: NavSectionId[] = ['home', 'portfolio', 'services', 'about', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id as NavSectionId);
        }
      },
      { rootMargin: '-30% 0px -45% 0px', threshold: [0.15, 0.4, 0.65] }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavigate = (section: NavSectionId) => {
    setActiveSection(section);
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredProjects = useMemo(() => {
    const base =
      selectedCategory === 'all'
        ? projects
        : projects.filter((item) => item.category === selectedCategory);
    if (selectedCategory === 'all' && !showAllProjects) {
      return base.slice(0, 4);
    }
    return base;
  }, [projects, selectedCategory, showAllProjects]);

  const handleAddCustomVideo = (newProj: AdProject) => {
    setProjects((prev) => [newProj, ...prev]);
    setSelectedCategory('all');
    setShowAllProjects(true);
    setActiveVideo(newProj);
  };

  const handleCopyEmail = () => {
    void navigator.clipboard?.writeText('rashedul@email.com');
    setCopiedEmail(true);
    window.setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleDownloadHtml = async () => {
    try {
      let htmlContent = '';
      if (window.location.protocol === 'file:') {
        htmlContent = '<!doctype html>\n' + document.documentElement.outerHTML;
      } else {
        const res = await fetch('/rashedul-portfolio.html');
        if (!res.ok) throw new Error('Failed to fetch HTML');
        htmlContent = await res.text();
      }
      const blob = new Blob([htmlContent], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'rashedul-portfolio.html';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.location.href = '/rashedul-portfolio.html';
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('download') === '1') {
      void handleDownloadHtml();
    }
  }, []);

  const openContact = (service = 'Video Editing', context = '') => {
    setContactState({ open: true, service, context });
  };

  const socialLinks = [
    {
      name: 'YouTube',
      href: 'https://youtube.com',
      bg: 'bg-[#FF0000]',
      svg: (
        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com',
      bg: 'bg-[#1877F2]',
      svg: (
        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.5-1.5h1.7V4.9c-.3 0-1.3-.1-2.5-.1-2.4 0-4.1 1.5-4.1 4.2V11H7.5v3h2.6v8h3.4z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com',
      bg: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
      svg: (
        <svg className="w-4 h-4 stroke-white fill-none" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" className="fill-white stroke-none" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      bg: 'bg-[#0A66C2]',
      svg: (
        <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6.1V21h-4v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21h-4V9z" />
        </svg>
      ),
    },
    {
      name: 'Fiverr',
      href: 'https://fiverr.com',
      bg: 'bg-[#1DBF73]',
      svg: (
        <span className="font-display font-extrabold text-[11px] text-white leading-none" aria-hidden="true">
          fi
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#050714] text-slate-100 flex flex-col">
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenHireModal={() => openContact('Video Editing')}
      />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section
          id="home"
          className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(ellipse_at_top_right,rgba(109,40,217,0.22),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(6,182,212,0.14),transparent_50%)]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-10 lg:pt-14 lg:pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              {/* Left Typographic Column */}
              <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-300">
                  <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400 shrink-0" aria-hidden="true" />
                  <span>Video Editor</span>
                  <span aria-hidden="true" className="text-slate-500">
                    ·
                  </span>
                  <span>Social Media</span>
                  <span aria-hidden="true" className="text-slate-500">
                    ·
                  </span>
                  <span>AI Creative</span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight leading-[1.08] text-white [text-wrap:balance]">
                  Creative Digital{' '}
                  <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                    Solutions for
                  </span>{' '}
                  Your Business
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                  Hi, I&apos;m Rashedul. I create engaging videos, social media ads, product visuals
                  and AI-powered creative content.
                </p>

                {/* Primary & Secondary CTAs */}
                <div className="flex flex-wrap items-center gap-3.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleNavigate('portfolio')}
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 text-sm font-semibold text-white shadow-[0_6px_24px_rgba(139,92,246,0.35)] hover:opacity-95 transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <Play className="w-4 h-4 fill-white" aria-hidden="true" />
                    <span>Explore My Work</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openContact('Social Media Ads')}
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl border border-white/25 bg-white/[0.03] hover:bg-white/[0.08] hover:border-cyan-400/60 text-sm font-semibold text-white transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <Mail className="w-4 h-4 text-slate-300" aria-hidden="true" />
                    <span>Contact Me</span>
                  </button>
                </div>

                {/* Social Media Links */}
                <div className="flex items-center gap-3 pt-2">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Rashedul on ${social.name}`}
                      title={social.name}
                      className={`w-9 h-9 rounded-full ${social.bg} flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400`}
                    >
                      {social.svg}
                    </a>
                  ))}
                </div>
              </div>

              {/* Right Hero Portrait Column */}
              <div className="lg:col-span-6 relative flex items-end justify-center lg:justify-end">
                <div className="relative w-full max-w-xl lg:h-full min-h-[290px] sm:min-h-[340px] rounded-2xl overflow-hidden border border-white/10 bg-[#080d24]">
                  <img
                    src="/assets/rashedul-hero.png"
                    alt="Rashedul, Digital Creator and Video Ads Director"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Subtle edge blend scrim */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#050714] via-transparent to-transparent opacity-70"
                  />

                  {/* Interactive Showreel Launcher */}
                  <button
                    type="button"
                    onClick={() => setActiveVideo(SHOWREEL_PROJECT)}
                    className="absolute bottom-4 right-4 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#070b1e]/90 backdrop-blur-md border border-cyan-400/40 hover:border-cyan-300 text-xs font-semibold text-white shadow-xl hover:bg-[#0d1436] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <span className="w-7 h-7 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" aria-hidden="true" />
                    </span>
                    <span className="whitespace-nowrap">Watch 2026 Showreel</span>
                    <span className="font-mono text-cyan-300 tabular-nums">0:28</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Full-Width 4-Column Proof Strip */}
            <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-6">
              {PROOF_METRICS.map((metric) => (
                <div key={metric.label} className="space-y-1">
                  <div className="font-display text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                    {metric.value}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SUBTLE SECTION MARQUEE DIVIDER */}
        <div
          aria-hidden="true"
          className="border-b border-white/10 bg-[#070a1c] py-2.5 overflow-hidden select-none"
        >
          <div className="flex w-max animate-marquee text-xs font-medium tracking-wider text-slate-400 uppercase">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center gap-6 px-3">
                <span>Selected Ad Reels</span>
                <span className="text-violet-400">·</span>
                <span>4K Commercial Editing</span>
                <span className="text-cyan-400">·</span>
                <span>Social Media Performance Ads</span>
                <span className="text-violet-400">·</span>
                <span>AI Product Visuals</span>
                <span className="text-cyan-400">·</span>
                <span>Automotive &amp; Lifestyle Spots</span>
                <span className="text-violet-400">·</span>
              </div>
            ))}
          </div>
        </div>

        {/* PORTFOLIO SECTION */}
        <section
          id="portfolio"
          className="py-16 lg:py-20 bg-[radial-gradient(ellipse_at_center,rgba(88,28,135,0.12),transparent_65%)]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto space-y-2.5">
              <div className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-cyan-400/70" />
                <span>My Portfolio</span>
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-cyan-400/70" />
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white [text-wrap:balance]">
                Selected{' '}
                <span className="bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                  Projects
                </span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300">
                A selection of my best work in video editing, advertising and AI creative content. Click
                any video to watch full playback.
              </p>
            </div>

            {/* Category Filter Tabs + Upload Video Action */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div
                role="tablist"
                aria-label="Filter ad videos by category"
                className="flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-xl bg-[#0a0f25] border border-white/10"
              >
                {CATEGORY_TABS.map((tab) => {
                  const active = selectedCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedCategory(tab.id)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setIsUploadOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-cyan-400/35 bg-cyan-500/10 hover:bg-cyan-500/20 text-xs font-semibold text-cyan-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Add Video Ad</span>
              </button>
            </div>

            {/* Video Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onPlay={(proj) => setActiveVideo(proj)}
                />
              ))}
            </div>

            {/* View All Projects Toggle */}
            {selectedCategory === 'all' && projects.length > 4 && (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => setShowAllProjects((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-violet-400/40 bg-[#0b1026] hover:border-cyan-400/70 hover:bg-white/[0.06] text-xs font-semibold text-white transition-all duration-150 cursor-pointer whitespace-nowrap"
                >
                  <span>{showAllProjects ? 'Show Featured 4 Projects' : 'View All Projects'}</span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform duration-150 ${
                      showAllProjects ? '-rotate-90' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section
          id="services"
          className="py-16 lg:py-20 border-t border-white/10 bg-[#06091b]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2.5">
              <div className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-cyan-400/70" />
                <span>Our Services</span>
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-cyan-400/70" />
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white [text-wrap:balance]">
                What I{' '}
                <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  Do
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {SERVICES_LIST.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() =>
                    openContact(service.title, `Interested in ${service.title} (${service.turnaround}).`)
                  }
                  className="group text-left p-5 rounded-xl bg-[#0a0f25] border border-white/12 hover:border-violet-400/60 transition-all duration-200 flex flex-col justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-cyan-400/40 transition-colors">
                      {renderServiceIcon(service.iconKey)}
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span>Turnaround: {service.turnaround}</span>
                    <span className="text-cyan-400 font-medium group-hover:translate-x-0.5 transition-transform">
                      Book →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT & CONTACT SPLIT SECTION */}
        <section
          id="about"
          className="py-16 lg:py-20 border-t border-white/10 bg-[radial-gradient(ellipse_at_bottom,rgba(30,58,138,0.18),transparent_65%)]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* About Me Card */}
              <div className="lg:col-span-7 rounded-2xl overflow-hidden bg-[#0a0f25] border border-white/15 grid grid-cols-1 sm:grid-cols-12 items-stretch">
                <div className="sm:col-span-5 relative min-h-[220px] bg-[#070a1b]">
                  <img
                    src="/assets/rashedul-about.png"
                    alt="Rashedul, Digital Creator"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0f25]/80 hidden sm:block"
                  />
                </div>
                <div className="sm:col-span-7 p-6 sm:p-7 flex flex-col justify-center space-y-4">
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                      About Me
                    </p>
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                      Hello! I&apos;m{' '}
                      <span className="bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                        Rashedul
                      </span>
                    </h2>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    I&apos;m a passionate Digital Creator, specializing in Video Editing, Social Media
                    Ads and AI-powered content. I love turning ideas into engaging visuals that help
                    brands grow.
                  </p>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAboutOpen(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-xs font-semibold text-white hover:opacity-95 transition-opacity cursor-pointer whitespace-nowrap"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Get In Touch / Contact Card */}
              <div
                id="contact"
                className="lg:col-span-5 rounded-2xl bg-[#0a0f25] border border-white/15 p-6 sm:p-7 flex flex-col justify-between gap-6"
              >
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                    Get In Touch
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                    Let&apos;s Work Together
                  </h2>
                  <p className="text-sm text-slate-300">
                    Have a project in mind? Feel free to reach out!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row sm:items-end lg:items-start xl:items-end justify-between gap-5">
                  <div className="space-y-3 text-sm text-slate-200">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-cyan-400 shrink-0" aria-hidden="true" />
                      <a
                        href="mailto:rashedul@email.com"
                        className="hover:text-cyan-300 transition-colors"
                      >
                        rashedul@email.com
                      </a>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        aria-label="Copy email address"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 cursor-pointer"
                      >
                        {copiedEmail ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-300">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-violet-400 shrink-0" aria-hidden="true" />
                      <a
                        href="tel:+8801234567890"
                        className="font-mono text-sm tabular-nums hover:text-cyan-300 transition-colors"
                      >
                        +880 123 456 7890
                      </a>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-fuchsia-400 shrink-0" aria-hidden="true" />
                      <span>Dhaka, Bangladesh</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openContact('Video Editing')}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-xs font-semibold text-white hover:opacity-95 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Message Me</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* CLEAN FOOTER */}
      <footer className="border-t border-white/10 bg-[#040611] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">© 2026 Rashedul. All rights reserved.</p>

          <div className="flex items-center gap-2.5">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className={`w-7 h-7 rounded-full ${social.bg} flex items-center justify-center hover:scale-110 transition-transform duration-150`}
              >
                {social.svg}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => void handleDownloadHtml()}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-cyan-400/45 bg-cyan-500/15 hover:bg-cyan-500/25 text-xs font-semibold text-cyan-200 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Download Portfolio Website (.html)</span>
            </button>

            <p className="text-xs font-medium text-slate-300 whitespace-nowrap">
              Create <span className="text-cyan-400">·</span> Edit{' '}
              <span className="text-violet-400">·</span> Inspire
            </p>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <VideoPlayerModal
        project={activeVideo}
        playlist={[SHOWREEL_PROJECT, ...projects]}
        onClose={() => setActiveVideo(null)}
        onSelectProject={(proj) => setActiveVideo(proj)}
        onBookSimilar={(proj) => {
          setActiveVideo(null);
          openContact(
            'Social Media Ads',
            `I'd like an ad video in the style of "${proj.title}" (${proj.format}).`
          );
        }}
      />

      <UploadAdModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddProject={handleAddCustomVideo}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onBookProject={() => openContact('Video Editing')}
      />

      <ContactModal
        isOpen={contactState.open}
        initialService={contactState.service}
        initialContext={contactState.context}
        onClose={() => setContactState((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}
