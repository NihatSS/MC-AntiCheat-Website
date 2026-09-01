import { Fragment, useEffect } from 'react';
import { initHomePageEffects } from './siteEffects.js';

const checkPath = 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z';
const circleCheckPath = 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z';

const marqueeItems = [
  'STOP CHEATERS',
  'REAL-TIME DETECTION',
  'ADVANCED PROTECTION',
  'BATTLE-TESTED ENGINE',
  'LOW OVERHEAD',
  'CONTINUOUS UPDATES'
];

const techModules = [
  {
    title: 'Movement Analysis',
    text: 'Detect fly, speed, and impossible player movement patterns',
    icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  },
  {
    title: 'Combat Analysis',
    text: 'Identify reach, auto-aim, and abnormal attack behavior',
    icon: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /></>
  },
  {
    title: 'Packet Validation',
    text: 'Intercept and validate malformed or manipulated game packets',
    icon: <><path d="M4 4h16v16H4z" /><path d="M4 4l16 16M20 4L4 20" /></>
  },
  {
    title: 'Player Behavior',
    text: 'Profile long-term player behavior to detect anomalies',
    icon: <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  },
  {
    title: 'Inventory Analysis',
    text: 'Catch item duplication and illegal inventory manipulations',
    icon: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>
  },
  {
    title: 'World Interaction',
    text: 'Monitor block placement, breaking, and world modifications',
    icon: <path d="M3 21h18M3 7v14M21 7v14M6 7V3h12v4M9 21v-4h6v4" />
  },
  {
    title: 'Auto Mitigation',
    text: 'Automatically respond to threats with configurable actions',
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  },
  {
    title: 'Violation Tracking',
    text: 'Track cumulative violations over time for smarter detection',
    icon: <><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 12h6M9 16h4" /></>
  }
];

const features = [
  ['Advanced Movement Detection', 'Analyze player movement and identify impossible or highly suspicious behavior in real-time.', 'Behavioral', techModules[0].icon],
  ['Combat Analysis', 'Analyze attack patterns, rotations, reach, timing, and abnormal combat behavior.', 'Combat', techModules[1].icon],
  ['Packet Validation', 'Inspect suspicious or malformed game packets before they affect server integrity.', 'Network', techModules[2].icon],
  ['Smart Violations', 'Track suspicious behavior over time instead of relying on a single event to reduce false positives.', 'Intelligence', techModules[6].icon],
  ['Configurable Punishments', 'Allow server owners to configure warnings, kicks, bans, or other custom actions per violation.', 'Config', <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" />],
  ['Performance First', 'Designed to minimize unnecessary impact on server resources while maintaining detection accuracy.', 'Performance', <path d="M22 12h-4l-3 9L9 3l-3 9H2" />],
  ['Continuous Updates', 'Detection logic evolves alongside new cheat techniques and Minecraft version updates.', 'Updates', <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />],
  ['Detailed Logging', 'Give staff clear information about why a player was flagged with comprehensive violation logs.', 'Logging', techModules[7].icon]
];

const faqItems = [
  ['How do I install the anti-cheat?', "Installation is simple. Drop the Voltex JAR file into your server's plugins folder, restart the server, and configure the settings through the generated config file or our web dashboard. The entire process takes just a few minutes."],
  ['What Minecraft versions are supported?', 'Voltex supports Minecraft 1.20.x through 1.21.x. We continuously update our compatibility as new Minecraft versions are released.'],
  ['Does it affect server performance?', 'Voltex is designed to be extremely lightweight. Most detection processing happens asynchronously with minimal TPS impact. Our architecture ensures your server runs smoothly even under heavy player loads.'],
  ['How does the detection system work?', 'Voltex uses a multi-layered detection approach. It analyzes player movement patterns, combat behavior, packet integrity, and inventory actions. Suspicious behavior is tracked over time through a violation system, reducing false positives while catching even sophisticated cheats.'],
  ['Can I customize punishments?', 'Yes. Voltex provides fully configurable punishment actions including warnings, kicks, temporary bans, permanent bans, and custom commands. You can set different actions for different detection types and violation levels.'],
  ['Does it support multiple servers?', 'Yes. Our Network plan supports multi-server setups with shared player tracking and network-wide protection. The Enterprise plan offers even more advanced multi-network configurations.'],
  ['Do you provide updates?', 'Voltex receives frequent updates to address new cheat techniques, Minecraft version changes, and community feedback. Updates are automatic and seamless — no manual intervention required.'],
  ['How does licensing work?', 'Licenses are tied to your server or network and are billed monthly. You can upgrade, downgrade, or cancel your plan at any time through your dashboard.'],
  ['Can I try it before purchasing?', 'We offer a free trial period so you can test Voltex on your server before committing to a subscription. Contact our team on Discord to get started with a trial.']
];

function Logo({ gradientId = 'logoGrad' }) {
  return (
    <div className="logo-icon">
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2L4 14l6 1-4 14 16-18-6 1 4-12z" fill={`url(#${gradientId})`} stroke={`url(#${gradientId})`} strokeWidth="1" strokeLinejoin="round" />
        <defs>
          <linearGradient id={gradientId} x1="4" y1="2" x2="22" y2="30">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="100%" stopColor="#7c4dff" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function CheckIcon({ circle = false }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d={circle ? circleCheckPath : checkPath} />
    </svg>
  );
}

function StrokeIcon({ children, viewBox = '0 0 24 24' }) {
  return (
    <svg viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth="1.5">
      {children}
    </svg>
  );
}

function MarqueeContent() {
  const repeated = Array.from({ length: 4 }, () => marqueeItems).flat();

  return (
    <div className="marquee-content">
      {repeated.map((item, index) => (
        <Fragment key={`${item}-${index}`}>
          <span>{item}</span><span className="marquee-dot">●</span>
        </Fragment>
      ))}
    </div>
  );
}

function ArrowLine({ viewBox = '0 0 60 12', x2 = 50, tip = '50,2 58,6 50,10' }) {
  return (
    <svg viewBox={viewBox} fill="none">
      <line x1="0" y1="6" x2={x2} y2="6" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 4" />
      <polygon points={tip} fill="var(--accent)" />
    </svg>
  );
}

export default function Home() {
  useEffect(() => {
    document.title = 'Voltex — Next-Generation Minecraft Anti-Cheat';
    return initHomePageEffects();
  }, []);

  return (
    <>
      <canvas className="cursor-trail" id="cursorTrail" />
      <div className="cursor-dot" id="cursorDot" />
      <div className="cursor-ring" id="cursorRing" />

      <nav className="navbar" id="navbar">
        <div className="nav-container">
          <a href="#" className="nav-logo">
            <Logo />
            <span className="logo-text">Voltex</span>
          </a>
          <div className="nav-links" id="navLinks">
            <a href="#overview">Overview</a>
            <a href="#features">Features</a>
            <a href="#technology">Technology</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <a href="#docs" className="nav-docs-link">Documentation</a>
          </div>
          <div className="nav-actions">
            <a href="#pricing" className="btn-primary btn-sm">Get Started</a>
          </div>
          <button className="mobile-menu-toggle" id="mobileToggle" aria-label="Toggle menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      <section className="hero" id="overview">
        <div className="hero-bg-grid"></div>
        <div className="hero-glow"></div>
        <div className="hero-container">
          <div className="hero-content hero-stagger">
            <div className="hero-badge" data-animate="pop-in">NEXT-GENERATION MINECRAFT SECURITY</div>
            <h1 className="hero-title" data-animate="fade-up">
              Stop Cheaters<br />Before They <span className="gradient-text">Ruin Your Server.</span>
            </h1>
            <p className="hero-description" data-animate="fade-up">
              Voltex is a modern Minecraft anti-cheat built to detect abnormal player behavior, protect competitive gameplay, and keep your server running smoothly.
            </p>
            <div className="hero-buttons" data-animate="fade-up">
              <a href="#pricing" className="btn-primary btn-lg">Get Started</a>
              <a href="#features" className="btn-secondary btn-lg">Explore Features</a>
            </div>
            <div className="hero-trust" data-animate="fade-up">
              {['Low Server Overhead', 'Real-Time Detection', 'Continuous Updates'].map((item) => (
                <div className="trust-item" key={item}>
                  <CheckIcon circle />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-viz-container" id="heroViz">
              <canvas id="securityCanvas"></canvas>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <p className="stats-label" data-animate="fade-up">Built for serious Minecraft networks</p>
          <div className="stats-grid stats-stagger">
            {[
              ['99.9', '%', 'Detection Engine Uptime'],
              ['24', '/7', 'Protection'],
              ['50', '+', 'Detection Modules'],
              ['1', 'ms', 'Local Processing']
            ].map(([target, suffix, label], index) => (
              <Fragment key={label}>
                <div className="stat-item">
                  <span className="stat-number" data-target={target}>0</span><span className="stat-suffix">{suffix}</span>
                  <span className="stat-label">{label}</span>
                </div>
                {index < 3 && <div className="stat-divider"></div>}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="marquee-section" aria-label="Stop cheaters, real-time detection, advanced protection, battle-tested engine, low overhead, continuous updates">
        <div className="marquee-track" aria-hidden="true">
          <MarqueeContent />
          <MarqueeContent />
        </div>
      </section>

      <section className="vision-section">
        <div className="container">
          <div className="vision-content" data-animate="fade-up">
            <h2 className="vision-title">
              Not just detection.<br />
              <span className="gradient-text">Prediction.</span>
            </h2>
            <p className="vision-sub">Voltex learns from every interaction, adapting to new threats before they reach your players.</p>
          </div>
        </div>
      </section>

      <section className="problem-section">
        <div className="container">
          <h2 className="section-title" data-animate="fade-up">Cheats Evolve.<br /><span className="gradient-text">Your Protection Should Too.</span></h2>
          <div className="problem-cards grid-stagger">
            <div className="problem-card">
              <div className="problem-icon">
                <StrokeIcon><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></StrokeIcon>
              </div>
              <h3>Traditional Detection</h3>
              <p>Static checks can become predictable and easier for advanced cheats to work around.</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon warning">
                <StrokeIcon><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></StrokeIcon>
              </div>
              <h3>False Positives</h3>
              <p>Overly aggressive detection can punish legitimate players and hurt your community.</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon danger">
                <StrokeIcon><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></StrokeIcon>
              </div>
              <h3>Server Performance</h3>
              <p>Heavy processing can unnecessarily consume server resources and degrade the player experience.</p>
            </div>
          </div>
          <div className="problem-solution" data-animate="fade-up">
            <div className="solution-arrow">
              {['Threat', 'Analysis', 'Detection', 'Protection'].map((label, index) => (
                <Fragment key={label}>
                  <span>{label}</span>
                  {index < 3 && <ArrowLine />}
                </Fragment>
              ))}
            </div>
            <p className="solution-text">
              <strong>Voltex</strong> approaches detection through multiple layers of behavioral, movement, combat, and packet analysis — evolving alongside new cheat techniques.
            </p>
          </div>
        </div>
      </section>

      <section className="technology-section" id="technology">
        <div className="container">
          <h2 className="section-title" data-animate="fade-up">Multiple Layers.<br /><span className="gradient-text">One Defense.</span></h2>
          <p className="section-subtitle" data-animate="fade-up">Eight detection modules working together through a central engine to protect your server.</p>
          <div className="tech-grid grid-stagger">
            {techModules.map((module) => (
              <div className="tech-card" key={module.title}>
                <div className="tech-card-icon">
                  <StrokeIcon>{module.icon}</StrokeIcon>
                </div>
                <h4>{module.title}</h4>
                <p>{module.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="container">
          <h2 className="section-title" data-animate="fade-up">Built to Detect<br /><span className="gradient-text">What Others Miss.</span></h2>
          <p className="section-subtitle" data-animate="fade-up">Every detection module is purpose-built for modern Minecraft gameplay.</p>
          <div className="features-grid grid-stagger">
            {features.map(([title, text, tag, icon]) => (
              <div className="feature-card" key={title}>
                <div className="feature-icon">
                  <StrokeIcon>{icon}</StrokeIcon>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
                <div className="feature-tag">{tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="how-section">
        <div className="container">
          <h2 className="section-title" data-animate="fade-up">How It Works</h2>
          <p className="section-subtitle" data-animate="fade-up">From player action to automated response — in milliseconds.</p>
          <div className="steps-container steps-stagger">
            {[
              ['01', 'Player Action', 'Player movement, combat, inventory, and packet activity enters the detection system.'],
              ['02', 'Analysis', 'Multiple detection layers analyze the behavior against known cheat patterns.'],
              ['03', 'Verification', 'Suspicious activity is evaluated against expected legitimate behavior patterns.'],
              ['04', 'Response', 'The configured mitigation or punishment is triggered automatically.']
            ].map(([number, title, text], index) => (
              <Fragment key={number}>
                <div className="step">
                  <div className="step-number">{number}</div>
                  <div className="step-line"></div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
                {index < 3 && (
                  <div className="step-arrow">
                    <ArrowLine viewBox="0 0 40 12" x2={32} tip="32,2 40,6 32,10" />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="compat-section">
        <div className="container">
          <h2 className="section-title" data-animate="fade-up">Fits Into Your <span className="gradient-text">Existing Network.</span></h2>
          <p className="section-subtitle" data-animate="fade-up">Seamless integration with the platforms you already use.</p>
          <div className="compat-grid grid-stagger">
            {[
              ['P', 'Paper', 'Supported', 'supported'],
              ['S', 'Spigot', 'Supported', 'supported'],
              ['Pu', 'Purpur', 'Supported', 'supported'],
              ['F', 'Folia', 'Coming Soon', 'coming-soon'],
              ['V', 'Velocity', 'Supported', 'supported']
            ].map(([logo, name, status, statusClass]) => (
              <div className="compat-card" key={name}>
                <div className="compat-logo">{logo}</div>
                <h4>{name}</h4>
                <span className={`compat-status ${statusClass}`}>{status}</span>
              </div>
            ))}
          </div>
          <div className="version-section" data-animate="fade-up">
            <h3>Supported Minecraft Versions</h3>
            <div className="version-tags">
              {['1.20.x', '1.21.x', '1.21.4', '1.21.5'].map((version) => (
                <span className="version-tag" key={version}>{version}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pricing-section" id="pricing">
        <div className="container">
          <h2 className="section-title" data-animate="fade-up">Simple, Transparent <span className="gradient-text">Pricing.</span></h2>
          <p className="section-subtitle" data-animate="fade-up">Choose the plan that fits your server network.</p>
          <div className="pricing-grid grid-stagger">
            <PricingCard
              title="Starter"
              text="For small Minecraft servers"
              features={['Up to [X] players', 'Core detections', 'Basic logging', 'Discord support', 'Automatic updates']}
              href="checkout.html?plan=starter"
              buttonClass="btn-secondary pricing-btn"
              buttonText="Start with Starter"
            />
            <PricingCard
              recommended
              title="Network"
              text="For serious Minecraft networks"
              features={['Up to [X] players', 'Full detection suite', 'Advanced logging', 'Priority support', 'Network-wide protection', 'Automatic updates']}
              href="checkout.html?plan=network"
              buttonClass="btn-primary pricing-btn"
              buttonText="Choose Network"
            />
          </div>

          <div className="enterprise-card" data-animate="fade-up">
            <div className="enterprise-content">
              <h3>Enterprise</h3>
              <p>Custom infrastructure and requirements</p>
            </div>
            <div className="enterprise-features">
              <span>Custom player limits</span>
              <span>Multiple server networks</span>
              <span>Dedicated support</span>
              <span>Custom integrations</span>
            </div>
            <a href="#" className="btn-outline">Let's Talk</a>
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="container">
          <div className="why-grid">
            <div className="why-content" data-animate="slide-left">
              <h2 className="section-title left-aligned">Protection Without <span className="gradient-text">The Complexity.</span></h2>
              <p className="why-desc">Everything you need to keep your server fair, without the headaches of traditional anti-cheat solutions.</p>
            </div>
            <div className="why-checklist check-stagger">
              {['Easy installation', 'Lightweight architecture', 'Detailed staff tools', 'Configurable punishments', 'Frequent updates', 'Discord support', 'Designed for modern Minecraft networks'].map((item) => (
                <div className="check-item" key={item}><CheckIcon /><span>{item}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section" id="faq">
        <div className="container">
          <h2 className="section-title" data-animate="fade-up">Frequently Asked <span className="gradient-text">Questions.</span></h2>
          <div className="faq-list" data-animate="fade-up">
            {faqItems.map(([question, answer]) => (
              <div className="faq-item" key={question}>
                <button className="faq-question">
                  <span>{question}</span>
                  <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                </button>
                <div className="faq-answer">
                  <p>{answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-particles" id="ctaParticles"></div>
        <div className="container">
          <h2 className="cta-title" data-animate="fade-up">Your Server Deserves<br /><span className="gradient-text">Better Protection.</span></h2>
          <p className="cta-desc" data-animate="fade-up">Keep your players focused on the game — not the cheaters.</p>
          <div className="cta-buttons" data-animate="fade-up">
            <a href="#pricing" className="btn-primary btn-lg">Get Started</a>
            <a href="#" className="btn-secondary btn-lg">Join Discord</a>
          </div>
          <p className="cta-note" data-animate="fade-in">Setup takes only a few minutes.</p>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="#" className="nav-logo">
                <Logo gradientId="logoGrad2" />
                <span className="logo-text">Voltex</span>
              </a>
              <p className="footer-desc">Next-generation Minecraft anti-cheat protection for serious server networks.</p>
            </div>
            <FooterColumn title="Product" links={[['Features', '#features'], ['Pricing', '#pricing'], ['Documentation', '#docs'], ['Changelog', '#']]} />
            <FooterColumn title="Resources" links={[['Documentation', '#docs'], ['Discord', '#'], ['Support', '#'], ['Status', '#']]} />
            <FooterColumn title="Legal" links={[['Terms', '#'], ['Privacy', '#'], ['License', '#']]} />
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Voltex. All rights reserved.</p>
            <p>Not affiliated with Mojang Studios or Microsoft.</p>
          </div>
        </div>
      </footer>

      <button className="back-to-top" id="backToTop" aria-label="Back to top">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6" /></svg>
      </button>
    </>
  );
}

function PricingCard({ title, text, features: items, href, buttonClass, buttonText, recommended = false }) {
  return (
    <div className={`pricing-card${recommended ? ' recommended' : ''}`}>
      {recommended && <div className="recommended-badge">Recommended</div>}
      <div className="pricing-card-header">
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      <div className="pricing-price">
        <span className="price-currency">$</span>
        <span className="price-amount">X</span>
        <span className="price-period">/month</span>
      </div>
      <ul className="pricing-features">
        {items.map((item) => (
          <li key={item}><CheckIcon /> {item}</li>
        ))}
      </ul>
      <a href={href} className={buttonClass}>{buttonText}</a>
    </div>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div className="footer-col">
      <h4>{title}</h4>
      {links.map(([label, href]) => (
        <a href={href} key={`${title}-${label}`}>{label}</a>
      ))}
    </div>
  );
}
