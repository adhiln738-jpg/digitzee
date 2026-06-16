/* ======================================================
   DIGITZEE — Premium Agency JavaScript
   ====================================================== */

'use strict';

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initScrollAnimations();
  initCounterAnimations();
  initFAQ();
  initContactForm();
  initStickyNav();
  initActiveNavLinks();
  initSliders();
  initVideoPlayers();
});

// ===== MOBILE CARD SLIDERS WITH DOT INDICATORS =====
function initSliders() {
  const sliders = [
    { gridId: 'services', dotsId: 'services-dots', cardSelector: '.service-card' },
    { gridId: 'packages', dotsId: 'packages-dots',  cardSelector: '.pkg-card'     },
    { gridId: 'videos',   dotsId: 'videos-dots',    cardSelector: '.video-card'   },
  ];

  sliders.forEach(({ gridId, dotsId, cardSelector }) => {
    const section  = document.getElementById(gridId) || document.querySelector(`#${gridId}`);
    const grid     = section ? section.querySelector('.services-grid, .packages-grid, .video-grid') : null;
    const dotsWrap = document.getElementById(dotsId);

    if (!grid || !dotsWrap) return;

    const cards = Array.from(grid.querySelectorAll(cardSelector));
    if (!cards.length) return;

    // Build dots
    function buildDots() {
      dotsWrap.innerHTML = '';
      cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to card ${i + 1}`);
        dot.addEventListener('click', () => {
          cards[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        });
        dotsWrap.appendChild(dot);
      });
    }
    buildDots();

    // Update active dot on scroll
    let ticking = false;
    grid.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveDot();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    function updateActiveDot() {
      // Only active on mobile
      if (window.innerWidth > 640) return;
      const gridLeft  = grid.getBoundingClientRect().left;
      const gridCX    = gridLeft + grid.offsetWidth / 2;
      let closestIdx  = 0;
      let closestDist = Infinity;

      cards.forEach((card, i) => {
        const cardRect = card.getBoundingClientRect();
        const cardCX   = cardRect.left + cardRect.width / 2;
        const dist     = Math.abs(cardCX - gridCX);
        if (dist < closestDist) { closestDist = dist; closestIdx = i; }
      });

      dotsWrap.querySelectorAll('.slider-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === closestIdx);
      });
    }

    // Rebuild dots on resize (e.g. rotation)
    window.addEventListener('resize', buildDots, { passive: true });
  });
}


// ===== NAVBAR SCROLL EFFECT =====
function initNavbar() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-overlay');
  const closeBtn = document.getElementById('mobile-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta');

  function openMenu() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerHeight = document.getElementById('header').offsetHeight;
        const offset = headerHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ===== SCROLL ANIMATIONS (Intersection Observer) =====
function initScrollAnimations() {
  // Add fade-in class to elements
  const animElements = [
    '.service-card',
    '.portfolio-card',
    '.video-card',
    '.pkg-card',
    '.benefit-card',
    '.process-step',
    '.testimonial-card',
    '.faq-item',
    '.meta-feature',
    '.section-header',
    '.hero-left',
    '.hero-right',
    '.why-left',
    '.stats-strip',
    '.portfolio-cta',
    '.trust-badge-big',
  ];

  animElements.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('fade-in');
      if (i % 3 === 1) el.classList.add('fade-in-delay-1');
      if (i % 3 === 2) el.classList.add('fade-in-delay-2');
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ===== COUNTER ANIMATIONS =====
function initCounterAnimations() {
  const counters = document.querySelectorAll('.stat-num[data-target]');

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const start = performance.now();

    const update = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    };

    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));
}

// ===== FAQ ACCORDION =====
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// ===== CONTACT FORM =====
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const successMsg = document.getElementById('form-success');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (!name || !email || !phone) {
      shakeForm(form);
      return;
    }

    if (!isValidEmail(email)) {
      document.getElementById('email').style.borderColor = '#ef4444';
      setTimeout(() => {
        document.getElementById('email').style.borderColor = '';
      }, 2000);
      return;
    }

    // Capture values for WhatsApp
    const businessVal = document.getElementById('business').value;
    const businessText = businessVal ? document.getElementById('business').options[document.getElementById('business').selectedIndex].text : 'Not Specified';

    const serviceVal = document.getElementById('service').value;
    const serviceText = serviceVal ? document.getElementById('service').options[document.getElementById('service').selectedIndex].text : 'Not Specified';

    const message = document.getElementById('message').value.trim();
    const messageText = message ? message : 'No message provided.';

    const waMessage = `*New DIGITZEE Enquiry*\n\n` +
                      `👤 *Name:* ${name}\n` +
                      `📧 *Email:* ${email}\n` +
                      `📞 *Phone:* ${phone}\n` +
                      `🏢 *Business Type:* ${businessText}\n` +
                      `🛠️ *Service:* ${serviceText}\n\n` +
                      `💬 *Message:*\n${messageText}`;

    const waUrl = `https://wa.me/918891903123?text=${encodeURIComponent(waMessage)}`;

    // Open WhatsApp synchronously in the event handler to prevent popup blocking
    window.open(waUrl, '_blank');

    // Simulate form submission feedback on the website
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="2" x2="12" y2="6"/>
        <line x1="12" y1="18" x2="12" y2="22"/>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
        <line x1="2" y1="12" x2="6" y2="12"/>
        <line x1="18" y1="12" x2="22" y2="12"/>
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
      </svg>
      Sending...
    `;
    submitBtn.style.opacity = '0.8';

    setTimeout(() => {
      successMsg.style.display = 'block';
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><polygon points="22 2 15 22 11 13 2 9 22 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Send Enquiry
      `;
      submitBtn.style.opacity = '1';

      setTimeout(() => { successMsg.style.display = 'none'; }, 6000);
    }, 1500);
  });

  // Live email validation
  const emailInput = document.getElementById('email');
  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      if (emailInput.value && !isValidEmail(emailInput.value)) {
        emailInput.style.borderColor = 'rgba(239,68,68,0.7)';
      } else {
        emailInput.style.borderColor = '';
      }
    });
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeForm(form) {
  form.style.animation = 'shake 0.4s ease';
  setTimeout(() => { form.style.animation = ''; }, 400);
}

// Add shake animation to CSS dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(shakeStyle);

// ===== STICKY NAV ACTIVE STATE =====
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-100px 0px -60% 0px'
  });

  sections.forEach(section => observer.observe(section));
}

// ===== STICKY NAV LOGO SCROLL =====
function initStickyNav() {
  // Show sticky CTA on scroll past hero
  const hero = document.getElementById('home');
  const stickyCta = document.getElementById('sticky-cta');

  if (!stickyCta) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        stickyCta.classList.add('show');
      } else {
        stickyCta.classList.remove('show');
      }
    });
  }, { threshold: 0 });

  if (hero) observer.observe(hero);
}

// ===== TILT EFFECT ON CARDS (subtle) =====
document.querySelectorAll('.service-card, .pkg-card, .portfolio-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${y * -4}deg) rotateY(${x * 4}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease';
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease';
  });
});


// ===== PARTICLE / GLOW CURSOR (DESKTOP ONLY) =====
if (window.innerWidth > 1024) {
  const cursor = document.createElement('div');
  cursor.id = 'cursor-glow';
  cursor.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(124,58,237,0.06), transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    will-change: transform;
  `;
  document.body.appendChild(cursor);

  let cx = 0, cy = 0;
  let mx = 0, my = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  }, { passive: true });

  function animateCursor() {
    cx += (mx - cx) * 0.1;
    cy += (my - cy) * 0.1;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
  document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
}

// ===== LAZY LOAD IMAGES =====
if ('IntersectionObserver' in window) {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.style.opacity = '0';
        img.addEventListener('load', () => {
          img.style.transition = 'opacity 0.5s ease';
          img.style.opacity = '1';
        });
        imageObserver.unobserve(img);
      }
    });
  });
  lazyImages.forEach(img => imageObserver.observe(img));
}

// ===== SCROLLABLE VIDEO SHOWCASE PLAYBACK =====
function initVideoPlayers() {
  const cards = document.querySelectorAll('.video-card');
  
  cards.forEach(card => {
    const video = card.querySelector('video');
    const overlay = card.querySelector('.video-overlay-play');
    const btn = card.querySelector('.play-toggle-btn');
    
    if (!video || !overlay) return;
    
    const playSvg = `<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
    const pauseSvg = `<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`;
    
    function togglePlay(e) {
      e.stopPropagation(); // prevent bubbling if clicking wrapper
      
      // Pause all other videos
      document.querySelectorAll('.video-card').forEach(otherCard => {
        if (otherCard !== card && otherCard.classList.contains('playing')) {
          const otherVideo = otherCard.querySelector('video');
          if (otherVideo) {
            otherVideo.pause();
            otherCard.classList.remove('playing');
            const otherBtn = otherCard.querySelector('.play-toggle-btn');
            if (otherBtn) otherBtn.innerHTML = playSvg;
          }
        }
      });
      
      if (video.paused) {
        video.play()
          .then(() => {
            card.classList.add('playing');
            if (btn) btn.innerHTML = pauseSvg;
          })
          .catch(err => {
            console.log('Video play failed:', err);
          });
      } else {
        video.pause();
        card.classList.remove('playing');
        if (btn) btn.innerHTML = playSvg;
      }
    }
    
    overlay.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);
  });
}
