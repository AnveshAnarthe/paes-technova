/* ============================================================
   PAES TECHNOVA 2026 — Homepage JS
   3D Carousel, Countdown Timers, Ticker
   ============================================================ */

(function () {
  'use strict';

  // ===================== 3D CAROUSEL =====================
  const carouselData = [
    {
      id: 'hackathon',
      title: 'Hackathon 2026',
      desc: '24-hour coding marathon. Build, innovate, and compete for amazing prizes.',
      badge: 'Technical',
      badgeClass: 'badge-cyan',
      image: 'assets/banners/hackathon.png'
    },
    {
      id: 'sports',
      title: 'Sports Meet 2026',
      desc: 'Inter-department sports competition. Cricket, basketball, football & more.',
      badge: 'Sports',
      badgeClass: 'badge-green',
      image: 'assets/banners/sports.png'
    },
    {
      id: 'cultural',
      title: 'Cultural Night 2026',
      desc: 'Grand cultural extravaganza — Freshers Party, Farewell, Dinner Night, music, dance & performances.',
      badge: 'Cultural',
      badgeClass: 'badge-purple',
      image: 'assets/banners/cultural.png'
    }
  ];

  let currentSlide = 0;
  let autoplayInterval;

  function initCarousel() {
    const viewport = document.getElementById('carousel-viewport');
    const dotsContainer = document.getElementById('carousel-dots');
    if (!viewport) return;

    // Create cards
    carouselData.forEach((event, index) => {
      const card = document.createElement('div');
      card.className = 'carousel-card';
      card.dataset.index = index;
      card.innerHTML = `
        <img src="${event.image}" alt="${event.title}" class="carousel-card-img" loading="lazy">
        <div class="carousel-card-overlay">
          <span class="badge ${event.badgeClass} carousel-card-badge">${event.badge}</span>
          <h3 class="carousel-card-title">${event.title}</h3>
          <p class="carousel-card-desc">${event.desc}</p>
        </div>
      `;
      card.addEventListener('click', () => {
        window.location.href = `events.html#${event.id}`;
      });
      viewport.appendChild(card);
    });

    // Create dots
    carouselData.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Slide ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    updateCarousel();
    startAutoplay();
  }

  function updateCarousel() {
    const cards = document.querySelectorAll('.carousel-card');
    const dots = document.querySelectorAll('.carousel-dot');
    const total = cards.length;

    cards.forEach((card, index) => {
      card.classList.remove('active', 'prev', 'next', 'hidden-card');

      if (index === currentSlide) {
        card.classList.add('active');
      } else if (index === (currentSlide - 1 + total) % total) {
        card.classList.add('prev');
      } else if (index === (currentSlide + 1) % total) {
        card.classList.add('next');
      } else {
        card.classList.add('hidden-card');
      }
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }

  function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
    resetAutoplay();
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % carouselData.length;
    updateCarousel();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + carouselData.length) % carouselData.length;
    updateCarousel();
  }

  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  // Carousel nav buttons
  document.addEventListener('DOMContentLoaded', () => {
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
  });

  // ===================== COUNTDOWN TIMERS =====================
  const eventDates = [
    { id: 'countdown-hackathon', name: 'Hackathon', date: '2026-04-17T09:00:00+05:30' },
    { id: 'countdown-sports', name: 'Sports Meet', date: '2026-04-13T08:00:00+05:30' },
    { id: 'countdown-cultural', name: 'Cultural Night', date: '2026-04-30T18:00:00+05:30' }
  ];

  function updateCountdowns() {
    const now = new Date().getTime();

    eventDates.forEach(event => {
      const target = new Date(event.date).getTime();
      const diff = target - now;

      const el = document.getElementById(event.id);
      if (!el) return;

      if (diff <= 0) {
        el.querySelector('.countdown-timer').innerHTML = `
          <span style="font-family:var(--font-display);font-size:1.2rem;color:var(--neon-cyan);text-shadow:var(--text-glow-cyan);">
            🎉 EVENT LIVE!
          </span>
        `;
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const setValue = (cls, val) => {
        const node = el.querySelector(`.${cls}`);
        if (node) node.textContent = String(val).padStart(2, '0');
      };

      setValue('cd-days', days);
      setValue('cd-hours', hours);
      setValue('cd-mins', minutes);
      setValue('cd-secs', seconds);
    });
  }

  // ===================== ANNOUNCEMENT TICKER =====================
  function initTicker() {
    const track = document.getElementById('ticker-track');
    if (!track) return;

    const announcements = [
      '🔥 TECHNOVA 2026 Registrations Now Open!',
      '🏆 Hackathon Prize Backlit Gaming mouse keyboard combo + 3X 16GB Pendrive',
      '⚽ Sports Meet — Apr 13, 2026',
      '🎭 Cultural Night — Apr 30, 2026 | Freshers + Farewell + Dinner Night',
      '📢 Committee Applications Open — Apply Now!',
      '🎓 E-Certificates for All Participants'
    ];

    const content = announcements.map(a =>
      `<span class="ticker-item"><span class="sep">◆</span> ${a}</span>`
    ).join('');

    // Duplicate for seamless loop
    track.innerHTML = content + content;
  }

  // ===================== INIT =====================
  function init() {
    initCarousel();
    initTicker();
    updateCountdowns();
    setInterval(updateCountdowns, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
