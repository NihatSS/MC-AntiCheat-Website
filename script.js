/* ========================================
   VORTEX — JavaScript
   Animations, Interactions, Dashboard, Visuals
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ========== NAVBAR SCROLL ==========
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // ========== MOBILE MENU ==========
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.querySelector('.nav-links');
  const navActions = document.querySelector('.nav-actions');

  const toggleMenu = () => {
    const isOpen = navLinks.classList.toggle('mobile-open');
    navActions.classList.toggle('mobile-open');
    mobileToggle.classList.toggle('open', isOpen);
  };

  mobileToggle.addEventListener('click', toggleMenu);

  // Close mobile menu on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      navActions.classList.remove('mobile-open');
      mobileToggle.classList.remove('open');
    });
  });

  // ========== SMOOTH SCROLL ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // =============================================
  //  UNIFIED SCROLL-TRIGGERED ANIMATION OBSERVER
  // =============================================
  const initScrollAnimations = () => {
    // Collect all animated elements
    const dataAnimated = document.querySelectorAll('[data-animate]');
    const staggerContainers = document.querySelectorAll(
      '.hero-stagger, .stats-stagger, .grid-stagger, .steps-stagger, .check-stagger'
    );

    // Observer for [data-animate] elements
    const dataObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          dataObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    dataAnimated.forEach(el => dataObserver.observe(el));

    // Observer for stagger containers
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          staggerObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    staggerContainers.forEach(el => staggerObserver.observe(el));
  };

  initScrollAnimations();

  // ========== COUNTER ANIMATION ==========
  const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number, .counter');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          const target = parseFloat(entry.target.dataset.target);
          const isDecimal = target % 1 !== 0;
          const duration = 1500;
          const start = performance.now();

          const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const current = eased * target;

            entry.target.textContent = isDecimal
              ? current.toFixed(1)
              : Math.floor(current);

            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  };
  animateCounters();

  // ========== FAQ ACCORDION ==========
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      // Toggle current
      if (!isActive) item.classList.add('active');
    });
  });

  // ========== HERO SECURITY VISUALIZATION (Canvas) ==========
  const canvas = document.getElementById('securityCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animFrame;
    let w, h;

    const resize = () => {
      const container = canvas.parentElement;
      const dpr = window.devicePixelRatio || 1;
      w = container.offsetWidth;
      h = container.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Nodes
    const center = { x: 0, y: 0 };
    const labels = [
      'Packet Analysis', 'Movement Check', 'Combat Analysis',
      'Detection Engine', 'Behavior Scan', 'Inventory Check'
    ];

    // Create directed particles
    class DirectedParticle {
      constructor() { this.reset(); }
      reset() {
        const angle = Math.random() * Math.PI * 2;
        const dist = 180 + Math.random() * 100;
        this.startX = center.x + Math.cos(angle) * dist;
        this.startY = center.y + Math.sin(angle) * dist;
        this.endX = center.x;
        this.endY = center.y;
        this.progress = 0;
        this.speed = Math.random() * 0.8 + 0.3;
        this.isThreat = Math.random() < 0.25;
        this.blocked = false;
        this.blockProgress = 0;
        this.alpha = 1;
      }
      update() {
        this.progress += this.speed * 0.01;

        if (this.progress >= 0.95 && !this.blocked && this.isThreat) {
          this.blocked = true;
        }

        if (this.blocked) {
          this.blockProgress += 0.02;
          this.alpha = Math.max(0, 1 - this.blockProgress);
          if (this.alpha <= 0) this.reset();
        }

        if (this.progress >= 1 && !this.blocked) {
          this.reset();
        }
      }
      draw() {
        const t = Math.min(this.progress, 1);
        const x = this.startX + (this.endX - this.startX) * t;
        const y = this.startY + (this.endY - this.startY) * t;

        if (this.blocked) {
          const bx = this.startX + (this.endX - this.startX) * 0.7;
          const by = this.startY + (this.endY - this.startY) * 0.7;
          // Red flash at block point
          ctx.beginPath();
          ctx.arc(bx, by, 6 * (1 - this.alpha), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 82, 82, ${this.alpha * 0.6})`;
          ctx.fill();
          // X mark
          ctx.strokeStyle = `rgba(255, 82, 82, ${this.alpha * 0.8})`;
          ctx.lineWidth = 2;
          const s = 4;
          ctx.beginPath();
          ctx.moveTo(bx - s, by - s); ctx.lineTo(bx + s, by + s);
          ctx.moveTo(bx + s, by - s); ctx.lineTo(bx - s, by + s);
          ctx.stroke();
          return;
        }

        ctx.beginPath();
        ctx.arc(x, y, this.isThreat ? 2.5 : 2, 0, Math.PI * 2);
        ctx.fillStyle = this.isThreat
          ? 'rgba(255, 82, 82, 0.8)'
          : 'rgba(0, 229, 255, 0.6)';
        ctx.fill();
      }
    }

    // Setup
    const numParticles = 30;
    const particles = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push(new DirectedParticle());
    }

    const drawFrame = () => {
      center.x = w / 2;
      center.y = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Background glow
      const grad = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, 180);
      grad.addColorStop(0, 'rgba(0, 229, 255, 0.06)');
      grad.addColorStop(0.5, 'rgba(124, 77, 255, 0.03)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Connection lines to center
      const lineAngles = [0, 45, 90, 135, 180, 225, 270, 315];
      const lineDist = 160;
      lineAngles.forEach((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const ex = center.x + Math.cos(rad) * lineDist;
        const ey = center.y + Math.sin(rad) * lineDist;

        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = `rgba(0, 229, 255, ${0.06 + Math.sin(Date.now() * 0.002 + i) * 0.03})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Module dots
        ctx.beginPath();
        ctx.arc(ex, ey, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${0.3 + Math.sin(Date.now() * 0.003 + i) * 0.15})`;
        ctx.fill();

        // Labels
        ctx.font = '500 10px Inter, sans-serif';
        ctx.fillStyle = 'rgba(139, 146, 168, 0.7)';
        ctx.textAlign = 'center';
        ctx.fillText(labels[i] || '', ex, ey + 18);
      });

      // Center node
      const pulseSize = 24 + Math.sin(Date.now() * 0.003) * 3;
      ctx.beginPath();
      ctx.arc(center.x, center.y, pulseSize + 10, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 229, 255, 0.05)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(center.x, center.y, pulseSize, 0, Math.PI * 2);
      const coreGrad = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, pulseSize);
      coreGrad.addColorStop(0, 'rgba(0, 229, 255, 0.3)');
      coreGrad.addColorStop(1, 'rgba(124, 77, 255, 0.1)');
      ctx.fillStyle = coreGrad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(center.x, center.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 229, 255, 0.9)';
      ctx.fill();

      // Center label
      ctx.font = '700 11px Inter, sans-serif';
      ctx.fillStyle = 'rgba(232, 234, 240, 0.9)';
      ctx.textAlign = 'center';
      ctx.fillText('VORTEX', center.x, center.y + pulseSize + 24);

      // Particles
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animFrame = requestAnimationFrame(drawFrame);
    };

    drawFrame();
  }

  // ========== BACK TO TOP ==========
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ========== CTA PARTICLES ==========
  const ctaParticles = document.getElementById('ctaParticles');
  if (ctaParticles) {
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 3 + 1}px;
        height: ${Math.random() * 3 + 1}px;
        background: rgba(0, 229, 255, ${Math.random() * 0.3 + 0.1});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: float ${Math.random() * 4 + 3}s ease-in-out infinite;
        animation-delay: ${Math.random() * 3}s;
      `;
      ctaParticles.appendChild(particle);
    }
  }

  // ========== ACTIVE NAV HIGHLIGHTING ==========
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const highlightNav = () => {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navAnchors.forEach(a => {
          a.style.color = '';
          if (a.getAttribute('href') === `#${id}`) {
            a.style.color = 'var(--accent)';
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  // ========== CUSTOM CURSOR + TRAIL ==========
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const trailCanvas = document.getElementById('cursorTrail');

  if (cursorDot && cursorRing && trailCanvas && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let dotX = 0, dotY = 0;
    const trailCtx = trailCanvas.getContext('2d');
    const TRAIL_LEN = 16;
    const trailX = new Float32Array(TRAIL_LEN);
    const trailY = new Float32Array(TRAIL_LEN);
    const trailA = new Float32Array(TRAIL_LEN);
    let trailIdx = 0;
    let trailCount = 0;
    const TWO_PI = 6.2832;

    // Pre-compute color strings to avoid allocations
    const glowColors = new Array(21);
    const coreColors = new Array(21);
    for (let i = 0; i <= 20; i++) {
      const a = i / 20;
      glowColors[i] = 'rgba(0,229,255,' + (a * 0.12).toFixed(2) + ')';
      coreColors[i] = 'rgba(0,229,255,' + (a * 0.7).toFixed(2) + ')';
    }

    // Size canvas
    const resizeTrail = () => {
      trailCanvas.width = window.innerWidth;
      trailCanvas.height = window.innerHeight;
    };
    resizeTrail();
    window.addEventListener('resize', resizeTrail);

    const interactiveSelectors = 'a, button, .btn-primary, .btn-secondary, .btn-outline, .btn-ghost, .faq-question, .pricing-btn, .nav-logo, .nav-links a, .mobile-menu-toggle';

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Push into trail buffer
      trailX[trailIdx] = mouseX;
      trailY[trailIdx] = mouseY;
      trailA[trailIdx] = 1;
      trailIdx = (trailIdx + 1) % TRAIL_LEN;
      if (trailCount < TRAIL_LEN) trailCount++;
    });

    // Single unified animation loop — cursor + trail in one pass
    const tick = () => {
      // --- Dot: instant follow (CSS transform, no layout thrash) ---
      dotX += (mouseX - dotX) * 0.5;
      dotY += (mouseY - dotY) * 0.5;
      cursorDot.style.transform = 'translate(' + (dotX - 3) + 'px,' + (dotY - 3) + 'px)';

      // --- Ring: fast follow, nearly instant but slightly smoothed ---
      ringX += (mouseX - ringX) * 0.4;
      ringY += (mouseY - ringY) * 0.4;
      cursorRing.style.transform = 'translate(' + (ringX - 18) + 'px,' + (ringY - 18) + 'px)';

      // --- Trail ---
      trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
      for (let i = 0; i < trailCount; i++) {
        trailA[i] -= 0.06;
        if (trailA[i] <= 0) continue;

        const a = trailA[i];
        const r = a * 3.5;
        const ci = (a * 20 + 0.5) | 0; // round to nearest color bucket

        trailCtx.beginPath();
        trailCtx.arc(trailX[i], trailY[i], r + 5, 0, TWO_PI);
        trailCtx.fillStyle = glowColors[ci];
        trailCtx.fill();

        trailCtx.beginPath();
        trailCtx.arc(trailX[i], trailY[i], r, 0, TWO_PI);
        trailCtx.fillStyle = coreColors[ci];
        trailCtx.fill();
      }

      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    // Hover detection
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        cursorDot.classList.add('hovering');
        cursorRing.classList.add('hovering');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        cursorDot.classList.remove('hovering');
        cursorRing.classList.remove('hovering');
      }
    });

    // Click pulse
    document.addEventListener('mousedown', () => {
      cursorRing.classList.add('clicking');
    });
    document.addEventListener('mouseup', () => {
      cursorRing.classList.remove('clicking');
    });

    // Hide when mouse leaves window
    document.addEventListener('mouseleave', () => {
      isMouseOnPage = false;
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      isMouseOnPage = true;
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    });
  }

});
