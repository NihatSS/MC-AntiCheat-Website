export function initHomePageEffects() {
  const cleanup = [];
  const observers = [];
  const timeouts = [];
  const counterFrames = new Set();
  let securityFrame = 0;
  let cursorFrame = 0;

  const addListener = (target, type, handler, options) => {
    if (!target) return;
    target.addEventListener(type, handler, options);
    cleanup.push(() => target.removeEventListener(type, handler, options));
  };

  const queueTimeout = (handler, delay) => {
    const id = window.setTimeout(handler, delay);
    timeouts.push(id);
    return id;
  };

  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    handleScroll();
    addListener(window, 'scroll', handleScroll, { passive: true });
  }

  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.querySelector('.nav-links');
  const navActions = document.querySelector('.nav-actions');

  if (mobileToggle && navLinks && navActions) {
    const toggleMenu = () => {
      const isOpen = navLinks.classList.toggle('mobile-open');
      navActions.classList.toggle('mobile-open');
      mobileToggle.classList.toggle('open', isOpen);
    };

    const closeMenu = () => {
      navLinks.classList.remove('mobile-open');
      navActions.classList.remove('mobile-open');
      mobileToggle.classList.remove('open');
    };

    addListener(mobileToggle, 'click', toggleMenu);
    document.querySelectorAll('.nav-links a').forEach((link) => {
      addListener(link, 'click', closeMenu);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    const handleClick = (event) => {
      const href = anchor.getAttribute('href');
      if (!href || href.length <= 1) return;

      const target = document.querySelector(href);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    addListener(anchor, 'click', handleClick);
  });

  const initScrollAnimations = () => {
    const dataAnimated = document.querySelectorAll('[data-animate]');
    const staggerContainers = document.querySelectorAll(
      '.hero-stagger, .stats-stagger, .grid-stagger, .steps-stagger, .check-stagger'
    );

    if (!('IntersectionObserver' in window)) {
      dataAnimated.forEach((el) => el.classList.add('is-visible'));
      staggerContainers.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const dataObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          dataObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    dataAnimated.forEach((el) => dataObserver.observe(el));
    observers.push(dataObserver);

    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          staggerObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    staggerContainers.forEach((el) => staggerObserver.observe(el));
    observers.push(staggerObserver);
  };

  initScrollAnimations();

  const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number, .counter');

    if (!('IntersectionObserver' in window)) {
      counters.forEach((counter) => {
        counter.textContent = counter.dataset.target || counter.textContent;
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          const target = parseFloat(entry.target.dataset.target);
          const isDecimal = target % 1 !== 0;
          const duration = 1500;
          const start = performance.now();

          const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * target;

            entry.target.textContent = isDecimal
              ? current.toFixed(1)
              : Math.floor(current);

            if (progress < 1) {
              const frame = requestAnimationFrame(animate);
              counterFrames.add(frame);
            }
          };

          const frame = requestAnimationFrame(animate);
          counterFrames.add(frame);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach((counter) => observer.observe(counter));
    observers.push(observer);
  };

  animateCounters();

  document.querySelectorAll('.faq-question').forEach((button) => {
    const handleFaqClick = () => {
      const item = button.parentElement;
      const isActive = item?.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach((faqItem) => faqItem.classList.remove('active'));
      if (!isActive) item?.classList.add('active');
    };

    addListener(button, 'click', handleFaqClick);
  });

  const canvas = document.getElementById('securityCanvas');
  const ctx = canvas?.getContext('2d');

  if (canvas && ctx) {
    let w = 0;
    let h = 0;
    const center = { x: 0, y: 0 };
    const labels = [
      'Packet Analysis',
      'Movement Check',
      'Combat Analysis',
      'Detection Engine',
      'Behavior Scan',
      'Inventory Check'
    ];

    const resize = () => {
      const container = canvas.parentElement;
      if (!container) return;

      const dpr = window.devicePixelRatio || 1;
      w = container.offsetWidth;
      h = container.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    addListener(window, 'resize', resize);

    class DirectedParticle {
      constructor() {
        this.reset();
      }

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

          ctx.beginPath();
          ctx.arc(bx, by, 6 * (1 - this.alpha), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 82, 82, ${this.alpha * 0.6})`;
          ctx.fill();

          ctx.strokeStyle = `rgba(255, 82, 82, ${this.alpha * 0.8})`;
          ctx.lineWidth = 2;
          const size = 4;
          ctx.beginPath();
          ctx.moveTo(bx - size, by - size);
          ctx.lineTo(bx + size, by + size);
          ctx.moveTo(bx + size, by - size);
          ctx.lineTo(bx - size, by + size);
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

    const particles = Array.from({ length: 30 }, () => new DirectedParticle());

    const drawFrame = () => {
      center.x = w / 2;
      center.y = h / 2;

      ctx.clearRect(0, 0, w, h);

      const grad = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, 180);
      grad.addColorStop(0, 'rgba(0, 229, 255, 0.06)');
      grad.addColorStop(0.5, 'rgba(124, 77, 255, 0.03)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const lineAngles = [0, 45, 90, 135, 180, 225, 270, 315];
      const lineDist = 160;
      lineAngles.forEach((angle, index) => {
        const rad = (angle * Math.PI) / 180;
        const ex = center.x + Math.cos(rad) * lineDist;
        const ey = center.y + Math.sin(rad) * lineDist;

        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = `rgba(0, 229, 255, ${0.06 + Math.sin(Date.now() * 0.002 + index) * 0.03})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(ex, ey, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${0.3 + Math.sin(Date.now() * 0.003 + index) * 0.15})`;
        ctx.fill();

        ctx.font = '500 10px Inter, sans-serif';
        ctx.fillStyle = 'rgba(139, 146, 168, 0.7)';
        ctx.textAlign = 'center';
        ctx.fillText(labels[index] || '', ex, ey + 18);
      });

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

      ctx.font = '700 11px Inter, sans-serif';
      ctx.fillStyle = 'rgba(232, 234, 240, 0.9)';
      ctx.textAlign = 'center';
      ctx.fillText('VORTEX', center.x, center.y + pulseSize + 24);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      securityFrame = requestAnimationFrame(drawFrame);
    };

    drawFrame();
  }

  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    const handleBackScroll = () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    };

    const handleBackClick = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    handleBackScroll();
    addListener(window, 'scroll', handleBackScroll, { passive: true });
    addListener(backToTop, 'click', handleBackClick);
  }

  const ctaParticles = document.getElementById('ctaParticles');
  const generatedParticles = [];
  if (ctaParticles) {
    for (let i = 0; i < 20; i += 1) {
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
      generatedParticles.push(particle);
    }
  }

  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const highlightNav = () => {
    const scrollPos = window.scrollY + 100;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navAnchors.forEach((anchor) => {
          anchor.style.color = '';
          if (anchor.getAttribute('href') === `#${id}`) {
            anchor.style.color = 'var(--accent)';
          }
        });
      }
    });
  };

  highlightNav();
  addListener(window, 'scroll', highlightNav, { passive: true });

  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const trailCanvas = document.getElementById('cursorTrail');

  if (cursorDot && cursorRing && trailCanvas && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let dotX = 0;
    let dotY = 0;
    const trailCtx = trailCanvas.getContext('2d');
    const trailLength = 16;
    const trailX = new Float32Array(trailLength);
    const trailY = new Float32Array(trailLength);
    const trailA = new Float32Array(trailLength);
    let trailIdx = 0;
    let trailCount = 0;
    const twoPi = 6.2832;

    const glowColors = new Array(21);
    const coreColors = new Array(21);
    for (let i = 0; i <= 20; i += 1) {
      const alpha = i / 20;
      glowColors[i] = `rgba(0,229,255,${(alpha * 0.12).toFixed(2)})`;
      coreColors[i] = `rgba(0,229,255,${(alpha * 0.7).toFixed(2)})`;
    }

    const resizeTrail = () => {
      trailCanvas.width = window.innerWidth;
      trailCanvas.height = window.innerHeight;
    };

    resizeTrail();
    addListener(window, 'resize', resizeTrail);

    const interactiveSelectors = 'a, button, .btn-primary, .btn-secondary, .btn-outline, .btn-ghost, .faq-question, .pricing-btn, .nav-logo, .nav-links a, .mobile-menu-toggle';

    const handleMouseMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      trailX[trailIdx] = mouseX;
      trailY[trailIdx] = mouseY;
      trailA[trailIdx] = 1;
      trailIdx = (trailIdx + 1) % trailLength;
      if (trailCount < trailLength) trailCount += 1;
    };

    const tick = () => {
      dotX += (mouseX - dotX) * 0.5;
      dotY += (mouseY - dotY) * 0.5;
      cursorDot.style.transform = `translate(${dotX - 3}px,${dotY - 3}px)`;

      ringX += (mouseX - ringX) * 0.4;
      ringY += (mouseY - ringY) * 0.4;
      cursorRing.style.transform = `translate(${ringX - 18}px,${ringY - 18}px)`;

      trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
      for (let i = 0; i < trailCount; i += 1) {
        trailA[i] -= 0.06;
        if (trailA[i] <= 0) continue;

        const alpha = trailA[i];
        const radius = alpha * 3.5;
        const colorIndex = (alpha * 20 + 0.5) | 0;

        trailCtx.beginPath();
        trailCtx.arc(trailX[i], trailY[i], radius + 5, 0, twoPi);
        trailCtx.fillStyle = glowColors[colorIndex];
        trailCtx.fill();

        trailCtx.beginPath();
        trailCtx.arc(trailX[i], trailY[i], radius, 0, twoPi);
        trailCtx.fillStyle = coreColors[colorIndex];
        trailCtx.fill();
      }

      cursorFrame = requestAnimationFrame(tick);
    };

    cursorFrame = requestAnimationFrame(tick);

    const handleMouseOver = (event) => {
      if (event.target.closest(interactiveSelectors)) {
        cursorDot.classList.add('hovering');
        cursorRing.classList.add('hovering');
      }
    };

    const handleMouseOut = (event) => {
      if (event.target.closest(interactiveSelectors)) {
        cursorDot.classList.remove('hovering');
        cursorRing.classList.remove('hovering');
      }
    };

    const handleMouseDown = () => cursorRing.classList.add('clicking');
    const handleMouseUp = () => cursorRing.classList.remove('clicking');
    const handleMouseLeave = () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    };
    const handleMouseEnter = () => {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    };

    addListener(document, 'mousemove', handleMouseMove);
    addListener(document, 'mouseover', handleMouseOver);
    addListener(document, 'mouseout', handleMouseOut);
    addListener(document, 'mousedown', handleMouseDown);
    addListener(document, 'mouseup', handleMouseUp);
    addListener(document, 'mouseleave', handleMouseLeave);
    addListener(document, 'mouseenter', handleMouseEnter);
  }

  return () => {
    cleanup.forEach((remove) => remove());
    observers.forEach((observer) => observer.disconnect());
    timeouts.forEach((id) => window.clearTimeout(id));
    counterFrames.forEach((frame) => cancelAnimationFrame(frame));
    if (securityFrame) cancelAnimationFrame(securityFrame);
    if (cursorFrame) cancelAnimationFrame(cursorFrame);
    generatedParticles.forEach((particle) => particle.remove());
    navAnchors.forEach((anchor) => {
      anchor.style.color = '';
    });
  };
}
