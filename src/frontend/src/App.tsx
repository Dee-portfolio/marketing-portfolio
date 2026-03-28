import { useCallback, useEffect, useRef, useState } from "react";

// ─── Data ───────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Services", id: "services" },
  { label: "Work", id: "work" },
  { label: "Results", id: "results" },
  { label: "Contact", id: "contact" },
];

const SERVICES = [
  {
    icon: "✉️",
    title: "Email Marketing",
    desc: "Lifecycle email sequences, segmentation, and A/B testing that nurture leads and drive repeat revenue from your existing audience.",
  },
  {
    icon: "📈",
    title: "Paid Ads",
    desc: "Precision-targeted Google and Meta campaigns engineered for maximum ROAS. Every dollar allocated with intent and measured relentlessly.",
  },
  {
    icon: "📊",
    title: "Analytics",
    desc: "Custom dashboards, attribution modelling, and actionable insights that transform raw data into confident strategic decisions.",
  },
  {
    icon: "🎨",
    title: "Ad Creatives",
    desc: "Scroll-stopping visuals and copy crafted to capture attention, communicate value, and drive clicks that convert.",
  },
  {
    icon: "✍️",
    title: "Blogs",
    desc: "SEO-optimised long-form content that builds authority, attracts organic traffic, and keeps your audience coming back.",
  },
];

const CASE_STUDIES = [
  {
    color: "#C8923A",
    label: "E-Commerce · SEO + Paid",
    title: "Luminary Skincare",
    outcome1: "+340% organic traffic",
    outcome2: "4.2x ROAS in 90 days",
    outcome3: "$2.1M revenue attributed",
  },
  {
    color: "#3A6B8A",
    label: "SaaS · Growth Marketing",
    title: "Helix Analytics",
    outcome1: "68% reduction in CAC",
    outcome2: "12,000 trial sign-ups/mo",
    outcome3: "Series A secured at $8M",
  },
  {
    color: "#5A7A4A",
    label: "DTC · Email + Social",
    title: "Verdant Coffee Roasters",
    outcome1: "58% email open rate",
    outcome2: "3.8x subscriber LTV",
    outcome3: "Launched in 14 markets",
  },
];

const METRICS = [
  { value: 200, suffix: "+", label: "Campaigns Launched", prefix: "" },
  { value: 4.8, suffix: "x", label: "Average ROAS", prefix: "" },
  { value: 12, suffix: "M+", label: "Total Reach", prefix: "" },
  { value: 94, suffix: "%", label: "Client Retention", prefix: "" },
];

// ─── Hooks ──────────────────────────────────────────────────────────────────

function useFadeIn(ref: React.RefObject<Element | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
}

function useCounter(
  ref: React.RefObject<Element | null>,
  target: number,
  duration = 2000,
) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const isDecimal = target % 1 !== 0;
          const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - (1 - progress) ** 3;
            const val = eased * target;
            setCount(isDecimal ? Math.round(val * 10) / 10 : Math.floor(val));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(target);
          };
          requestAnimationFrame(step);
          obs.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, target, duration]);

  return count;
}

// ─── Components ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs font-sans uppercase tracking-[0.2em] mb-4"
      style={{ color: "var(--portfolio-accent)" }}
    >
      {children}
    </p>
  );
}

function AccentButton({
  children,
  onClick,
  href,
  type = "button",
  className = "",
  "data-ocid": ocid,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit";
  className?: string;
  "data-ocid"?: string;
}) {
  const styles =
    "inline-block px-7 py-3.5 font-sans font-medium text-sm rounded-sm transition-all duration-300 hover:opacity-90 hover:shadow-md active:scale-95 cursor-pointer";
  const colorStyles = {
    backgroundColor: "var(--portfolio-accent)",
    color: "var(--portfolio-text)",
  };
  if (href) {
    return (
      <a
        href={href}
        className={`${styles} ${className}`}
        style={colorStyles}
        data-ocid={ocid}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles} ${className}`}
      style={colorStyles}
      data-ocid={ocid}
    >
      {children}
    </button>
  );
}

// ─── Sections ────────────────────────────────────────────────────────────────

function Header({ activeSection }: { activeSection: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = useCallback((id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-shadow duration-300"
      style={{
        backgroundColor: "var(--portfolio-dark)",
        boxShadow: scrolled ? "0 1px 20px rgba(0,0,0,0.3)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => scrollTo("home")}
          className="font-serif text-lg font-semibold tracking-tight"
          style={{ color: "#F5F2EE" }}
          data-ocid="nav.link"
        >
          Deepak Kumar D
        </button>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="px-4 py-2 text-sm font-sans transition-colors duration-200 rounded-sm"
              style={{
                color:
                  activeSection === item.id
                    ? "var(--portfolio-accent)"
                    : "rgba(245,242,238,0.75)",
              }}
              data-ocid="nav.link"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <AccentButton
            onClick={() => scrollTo("contact")}
            data-ocid="nav.primary_button"
          >
            Let&apos;s Talk
          </AccentButton>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 rounded"
          style={{ color: "#F5F2EE" }}
          onClick={() => setMenuOpen((p) => !p)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          data-ocid="nav.toggle"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            {menuOpen ? (
              <>
                <line
                  x1="3"
                  y1="3"
                  x2="19"
                  y2="19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="19"
                  y1="3"
                  x2="3"
                  y2="19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </>
            ) : (
              <>
                <line
                  x1="3"
                  y1="6"
                  x2="19"
                  y2="6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="3"
                  y1="11"
                  x2="19"
                  y2="11"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="3"
                  y1="16"
                  x2="19"
                  y2="16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden px-6 pb-4 flex flex-col gap-1"
          style={{ backgroundColor: "var(--portfolio-dark)" }}
        >
          {NAV_ITEMS.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-left px-3 py-2.5 text-sm font-sans rounded transition-colors"
              style={{
                color:
                  activeSection === item.id
                    ? "var(--portfolio-accent)"
                    : "rgba(245,242,238,0.8)",
              }}
              data-ocid="nav.link"
            >
              {item.label}
            </button>
          ))}
          <AccentButton
            onClick={() => scrollTo("contact")}
            className="mt-2 text-center"
            data-ocid="nav.primary_button"
          >
            Let&apos;s Talk
          </AccentButton>
        </div>
      )}
    </header>
  );
}

function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  useFadeIn(ref as React.RefObject<Element>);

  return (
    <section
      id="home"
      ref={ref}
      className="fade-up pt-32 pb-24 md:pt-40 md:pb-32"
      style={{ backgroundColor: "var(--portfolio-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <SectionLabel>Digital Marketing Strategist</SectionLabel>
            <h1
              className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
              style={{ color: "var(--portfolio-text)" }}
            >
              Turning strategy
              <br />
              <em
                className="not-italic"
                style={{ color: "var(--portfolio-accent)" }}
              >
                into growth.
              </em>
            </h1>
            <p
              className="font-sans text-lg leading-relaxed mb-10 max-w-md"
              style={{ color: "var(--portfolio-muted)" }}
            >
              I help ambitious brands scale through data-driven campaigns,
              compelling content, and marketing systems that work while you
              sleep.
            </p>
            <div className="flex flex-wrap gap-4">
              <AccentButton
                onClick={() => {
                  document
                    .getElementById("work")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                data-ocid="hero.primary_button"
              >
                View My Work
              </AccentButton>
              <button
                type="button"
                className="px-7 py-3.5 font-sans font-medium text-sm rounded-sm border transition-all duration-300 hover:opacity-70"
                style={{
                  borderColor: "var(--portfolio-border)",
                  color: "var(--portfolio-text)",
                }}
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                data-ocid="hero.secondary_button"
              >
                Get In Touch
              </button>
            </div>
          </div>

          {/* Right — portrait */}
          <div className="relative flex justify-end">
            <div
              className="relative rounded-sm overflow-hidden"
              style={{
                width: "clamp(280px, 45vw, 480px)",
                aspectRatio: "4/5",
                boxShadow: "12px 16px 0px var(--portfolio-accent)",
              }}
            >
              <img
                src="/assets/uploads/gemini_generated_image_t522aft522aft522-019d358c-0687-753d-ab49-bfe35c6cf6f1-1.png"
                alt="Deepak Kumar D, Digital Marketing Strategist"
                className="w-full h-full object-cover object-top"
              />
              {/* Floating badge */}
              <div
                className="absolute bottom-6 left-6 px-4 py-3 rounded-sm"
                style={{
                  backgroundColor: "var(--portfolio-dark)",
                  color: "#F5F2EE",
                }}
              >
                <p className="font-sans text-xs tracking-widest uppercase opacity-60 mb-0.5">
                  Available for projects
                </p>
                <p className="font-serif text-sm font-semibold">
                  Currently booking Q3 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  useFadeIn(ref as React.RefObject<Element>);

  const skills = [
    "SEO",
    "Google Ads",
    "Meta Ads",
    "Email Automation",
    "Copywriting",
    "Analytics",
    "CRO",
    "Brand Positioning",
    "Content Strategy",
    "LinkedIn Ads",
    "Klaviyo",
    "HubSpot",
  ];

  return (
    <section
      id="about"
      ref={ref}
      className="fade-up py-24 md:py-32"
      style={{ backgroundColor: "var(--portfolio-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          className="h-px w-full mb-20"
          style={{ backgroundColor: "var(--portfolio-border)" }}
        />
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left — bio */}
          <div>
            <SectionLabel>About Me</SectionLabel>
            <h2
              className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-8"
              style={{ color: "var(--portfolio-text)" }}
            >
              Nine years of campaigns,
              <br />
              zero boring results.
            </h2>
            <p
              className="font-sans text-base leading-[1.8] mb-6"
              style={{ color: "var(--portfolio-muted)" }}
            >
              I started my career at a scrappy London agency running Google Ads
              for local businesses with shoestring budgets. The constraint was
              the best teacher I ever had. I learned to obsess over every penny,
              every click, every conversion — and that discipline never left me.
            </p>
            <p
              className="font-sans text-base leading-[1.8]"
              style={{ color: "var(--portfolio-muted)" }}
            >
              Today I work with DTC brands, funded startups, and established
              businesses who are serious about growth. My approach is simple:
              understand the business deeply, build the right strategy, execute
              with precision, and iterate relentlessly on what the data tells
              us.
            </p>
          </div>

          {/* Right — skills + stats */}
          <div>
            <div className="flex flex-wrap gap-2 mb-12">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="font-sans text-sm px-3.5 py-1.5 rounded-full border"
                  style={{
                    borderColor: "var(--portfolio-border)",
                    color: "var(--portfolio-text)",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>

            <div
              className="grid grid-cols-3 gap-6 pt-8 border-t"
              style={{ borderColor: "var(--portfolio-border)" }}
            >
              {[
                { num: "9+", label: "Years Experience" },
                { num: "120+", label: "Clients Served" },
                { num: "350+", label: "Campaigns Run" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p
                    className="font-serif text-3xl font-bold mb-1"
                    style={{ color: "var(--portfolio-accent)" }}
                  >
                    {stat.num}
                  </p>
                  <p
                    className="font-sans text-xs uppercase tracking-widest"
                    style={{ color: "var(--portfolio-muted)" }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  useFadeIn(ref as React.RefObject<Element>);

  return (
    <section
      id="services"
      ref={ref}
      className="fade-up py-24 md:py-32"
      style={{ backgroundColor: "var(--portfolio-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          className="h-px w-full mb-20"
          style={{ backgroundColor: "var(--portfolio-border)" }}
        />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <SectionLabel>What I Do</SectionLabel>
            <h2
              className="font-serif text-4xl md:text-5xl font-bold leading-tight"
              style={{ color: "var(--portfolio-text)" }}
            >
              Services built for
              <br />
              measurable impact.
            </h2>
          </div>
          <p
            className="font-sans text-sm max-w-xs leading-relaxed"
            style={{ color: "var(--portfolio-muted)" }}
          >
            Every engagement is tailored to your specific growth stage,
            audience, and revenue goals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {SERVICES.map((svc, i) => (
            <ServiceCard key={svc.title} service={svc} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: (typeof SERVICES)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const ocid = `services.item.${index + 1}` as const;
  return (
    <div
      className="p-7 rounded-sm border transition-all duration-300 cursor-default"
      style={{
        borderColor: hovered
          ? "var(--portfolio-accent)"
          : "var(--portfolio-border)",
        backgroundColor: "var(--portfolio-bg)",
        boxShadow: hovered
          ? "0 8px 32px rgba(200,146,58,0.12)"
          : "0 2px 12px rgba(26,26,26,0.04)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-ocid={ocid}
    >
      <span className="text-3xl block mb-5">{service.icon}</span>
      <h3
        className="font-serif text-xl font-semibold mb-3"
        style={{ color: "var(--portfolio-text)" }}
      >
        {service.title}
      </h3>
      <p
        className="font-sans text-sm leading-relaxed mb-5"
        style={{ color: "var(--portfolio-muted)" }}
      >
        {service.desc}
      </p>
      <span
        className="font-sans text-sm font-medium transition-colors duration-200"
        style={{
          color: hovered ? "var(--portfolio-accent)" : "var(--portfolio-text)",
        }}
      >
        Learn More →
      </span>
    </div>
  );
}

function WorkSection() {
  const ref = useRef<HTMLElement>(null);
  useFadeIn(ref as React.RefObject<Element>);

  return (
    <section
      id="work"
      ref={ref}
      className="fade-up py-24 md:py-32"
      style={{ backgroundColor: "var(--portfolio-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          className="h-px w-full mb-20"
          style={{ backgroundColor: "var(--portfolio-border)" }}
        />
        <div className="mb-16">
          <SectionLabel>Selected Work</SectionLabel>
          <h2
            className="font-serif text-4xl md:text-5xl font-bold leading-tight"
            style={{ color: "var(--portfolio-text)" }}
          >
            Case studies that
            <br />
            speak for themselves.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
          {CASE_STUDIES.map((cs, i) => (
            <CaseStudyCard key={cs.title} study={cs} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseStudyCard({
  study,
  index,
}: {
  study: (typeof CASE_STUDIES)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const ocid = `work.item.${index + 1}` as const;
  return (
    <div
      className="relative rounded-sm overflow-hidden cursor-pointer"
      style={{ aspectRatio: "4/5" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-ocid={ocid}
    >
      {/* Background */}
      <div
        className="absolute inset-0 transition-transform duration-500"
        style={{
          backgroundColor: study.color,
          transform: hovered ? "scale(1.03)" : "scale(1)",
        }}
      />

      {/* Base info */}
      <div
        className="absolute bottom-0 left-0 right-0 p-6 transition-opacity duration-300"
        style={{ opacity: hovered ? 0 : 1 }}
      >
        <p
          className="font-sans text-xs uppercase tracking-widest mb-2"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          {study.label}
        </p>
        <h3 className="font-serif text-2xl font-bold text-white">
          {study.title}
        </h3>
      </div>

      {/* Hover overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-6 transition-opacity duration-300"
        style={{
          backgroundColor: "rgba(26,26,26,0.88)",
          opacity: hovered ? 1 : 0,
        }}
      >
        <p
          className="font-sans text-xs uppercase tracking-widest mb-3"
          style={{ color: "var(--portfolio-accent)" }}
        >
          {study.label}
        </p>
        <h3 className="font-serif text-2xl font-bold text-white mb-5">
          {study.title}
        </h3>
        <ul className="space-y-2 mb-6">
          {[study.outcome1, study.outcome2, study.outcome3].map((o) => (
            <li
              key={o}
              className="font-sans text-sm text-white flex items-start gap-2"
            >
              <span style={{ color: "var(--portfolio-accent)" }}>✦</span>
              {o}
            </li>
          ))}
        </ul>
        <span
          className="font-sans text-sm font-semibold"
          style={{ color: "var(--portfolio-accent)" }}
        >
          View Project →
        </span>
      </div>
    </div>
  );
}

function MetricCounter({
  target,
  suffix,
  prefix,
  label,
  containerRef,
}: {
  target: number;
  suffix: string;
  prefix: string;
  label: string;
  containerRef: React.RefObject<Element | null>;
}) {
  const count = useCounter(containerRef, target);
  const isDecimal = target % 1 !== 0;
  const display = isDecimal ? count.toFixed(1) : Math.floor(count as number);
  return (
    <div className="text-center">
      <p
        className="font-serif text-5xl md:text-6xl font-bold mb-2"
        style={{ color: "#F5F2EE" }}
      >
        {prefix}
        {display}
        <span style={{ color: "var(--portfolio-accent)" }}>{suffix}</span>
      </p>
      <div
        className="w-10 h-0.5 mx-auto mb-3"
        style={{ backgroundColor: "var(--portfolio-accent)" }}
      />
      <p
        className="font-sans text-xs uppercase tracking-widest"
        style={{ color: "rgba(245,242,238,0.55)" }}
      >
        {label}
      </p>
    </div>
  );
}

function ResultsSection() {
  const ref = useRef<HTMLElement>(null);
  useFadeIn(ref as React.RefObject<Element>);

  return (
    <section
      id="results"
      ref={ref as React.RefObject<HTMLElement>}
      className="fade-up py-24 md:py-32"
      style={{ backgroundColor: "var(--portfolio-dark)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <p
            className="font-sans text-xs uppercase tracking-[0.2em] mb-4"
            style={{ color: "var(--portfolio-accent)" }}
          >
            By The Numbers
          </p>
          <h2
            className="font-serif text-4xl md:text-5xl font-bold"
            style={{ color: "#F5F2EE" }}
          >
            Results that compound.
          </h2>
        </div>

        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-12 stagger-children"
          data-ocid="results.section"
        >
          {METRICS.map((m) => (
            <MetricCounter
              key={m.label}
              target={m.value}
              suffix={m.suffix}
              prefix={m.prefix}
              label={m.label}
              containerRef={ref as React.RefObject<Element>}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  useFadeIn(ref as React.RefObject<Element>);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle = {
    backgroundColor: "transparent",
    borderBottom: "1px solid var(--portfolio-border)",
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    borderRadius: 0,
    outline: "none",
    color: "var(--portfolio-text)",
    fontFamily: "inherit",
    fontSize: "0.9rem",
    paddingBottom: "10px",
    paddingTop: "4px",
    width: "100%",
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="fade-up py-24 md:py-32"
      style={{ backgroundColor: "var(--portfolio-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          className="h-px w-full mb-20"
          style={{ backgroundColor: "var(--portfolio-border)" }}
        />
        <div className="grid md:grid-cols-2 gap-20">
          {/* Left */}
          <div>
            <SectionLabel>Get In Touch</SectionLabel>
            <h2
              className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-8"
              style={{ color: "var(--portfolio-text)" }}
            >
              Let&apos;s build something
              <br />
              remarkable together.
            </h2>

            {/* Availability badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-sans mb-10"
              style={{
                backgroundColor: "rgba(200,146,58,0.12)",
                color: "var(--portfolio-accent)",
                border: "1px solid rgba(200,146,58,0.3)",
              }}
              data-ocid="contact.panel"
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: "var(--portfolio-accent)" }}
              />
              Currently available for new projects
            </div>

            <p
              className="font-sans text-sm leading-relaxed mb-10"
              style={{ color: "var(--portfolio-muted)" }}
            >
              I take on a limited number of projects each quarter to ensure
              every client receives my full attention. Drop me a message and
              I&apos;ll respond within 24 hours.
            </p>

            {/* Contact info */}
            <div className="flex flex-col gap-3">
              {[
                { label: "8088977454", href: "tel:8088977454", icon: "📞" },
                {
                  label: "off.deepak15@gmail.com",
                  href: "mailto:off.deepak15@gmail.com",
                  icon: "✉",
                },
                {
                  label: "linkedin.com/in/deepak-kumar15",
                  href: "https://linkedin.com/in/deepak-kumar15",
                  icon: "in",
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    s.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="flex items-center gap-3 font-sans text-sm transition-colors duration-200 hover:opacity-70"
                  style={{ color: "var(--portfolio-text)" }}
                  data-ocid="contact.link"
                >
                  <span
                    className="w-9 h-9 rounded-sm border flex items-center justify-center text-sm font-bold"
                    style={{ borderColor: "var(--portfolio-border)" }}
                  >
                    {s.icon}
                  </span>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div>
            {submitted ? (
              <div
                className="h-full flex flex-col items-center justify-center text-center py-16"
                data-ocid="contact.success_state"
              >
                <span
                  className="text-4xl mb-4"
                  style={{ color: "var(--portfolio-accent)" }}
                >
                  ✦
                </span>
                <h3
                  className="font-serif text-2xl font-bold mb-3"
                  style={{ color: "var(--portfolio-text)" }}
                >
                  Message received.
                </h3>
                <p
                  className="font-sans text-sm"
                  style={{ color: "var(--portfolio-muted)" }}
                >
                  I&apos;ll be in touch within 24 hours.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-8"
                data-ocid="contact.modal"
              >
                <div>
                  <label
                    htmlFor="contact-name"
                    className="font-sans text-xs uppercase tracking-widest block mb-3"
                    style={{ color: "var(--portfolio-muted)" }}
                  >
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    style={inputStyle}
                    data-ocid="contact.input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="font-sans text-xs uppercase tracking-widest block mb-3"
                    style={{ color: "var(--portfolio-muted)" }}
                  >
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="jane@company.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    style={inputStyle}
                    data-ocid="contact.input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-message"
                    className="font-sans text-xs uppercase tracking-widest block mb-3"
                    style={{ color: "var(--portfolio-muted)" }}
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    placeholder="Tell me about your project and goals..."
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, message: e.target.value }))
                    }
                    style={{ ...inputStyle, resize: "none" }}
                    data-ocid="contact.textarea"
                  />
                </div>
                <div>
                  <AccentButton type="submit" data-ocid="contact.submit_button">
                    Send Message
                  </AccentButton>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  return (
    <footer
      className="py-10 border-t"
      style={{
        backgroundColor: "var(--portfolio-dark)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p
          className="font-serif text-sm"
          style={{ color: "rgba(245,242,238,0.5)" }}
        >
          &copy; {year} Deepak Kumar D
        </p>
        <p
          className="font-sans text-xs"
          style={{ color: "rgba(245,242,238,0.35)" }}
        >
          Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity underline"
            style={{ color: "rgba(245,242,238,0.5)" }}
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((n) => n.id);
    const observers: IntersectionObserver[] = [];

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.4 },
      );
      obs.observe(el);
      observers.push(obs);
    }

    return () => {
      for (const o of observers) o.disconnect();
    };
  }, []);

  return (
    <div style={{ backgroundColor: "var(--portfolio-bg)", minHeight: "100vh" }}>
      <Header activeSection={activeSection} />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <WorkSection />
        <ResultsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
