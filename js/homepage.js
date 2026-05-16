/* ============================================================
   PAES TECHNOVA 2026 — Homepage JS
   3D Carousel, Countdown Timers, Ticker
   ============================================================ */

(function () {
  'use strict';

  // ===================== 3D CAROUSEL =====================
  // Now showcasing upcoming events
  const carouselData = [
    {
      id: 'iot-challenge',
      title: 'IoT Innovation Challenge',
      desc: 'Build a working IoT prototype in 6 hours! Sensors, microcontrollers & cloud — perfect for ECE.',
      badge: 'Upcoming',
      badgeClass: 'badge-cyan',
      image: 'assets/banners/hackathon.png'
    },
    {
      id: 'esports',
      title: 'E-Sports Arena',
      desc: 'Valorant, BGMI & Free Fire tournaments. Massive prizes, massive fun!',
      badge: 'Upcoming',
      badgeClass: 'badge-cyan',
      image: 'assets/banners/cultural.png'
    },
    {
      id: 'treasure',
      title: 'CypherChase — Treasure Hunt',
      desc: 'Decode puzzles, solve clues, and race across campus to find the hidden treasure!',
      badge: 'Upcoming',
      badgeClass: 'badge-orange',
      image: 'assets/banners/cultural.png'
    },
    {
      id: 'quiz',
      title: 'BrainBytes — Tech Quiz',
      desc: 'Test your knowledge in electronics, programming, networking & emerging technologies.',
      badge: 'Upcoming',
      badgeClass: 'badge-cyan',
      image: 'assets/banners/hackathon.png'
    },
    {
      id: 'codeblitz',
      title: 'Code Blitz',
      desc: 'Speed programming contest — solve max problems in 2 hours. Quick, competitive & fun!',
      badge: 'Upcoming',
      badgeClass: 'badge-cyan',
      image: 'assets/banners/hackathon.png'
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

  // ===================== RESULTS ANNOUNCEMENT =====================
  function initResultsBanner() {
    const countdownSection = document.getElementById('countdowns');
    if (!countdownSection) return;

    // Replace countdown content with results announcement and upcoming events
    countdownSection.innerHTML = `
      <div class="section-header reveal">
        <h2 class="section-title">Event <span>Updates</span></h2>
        <p class="section-subtitle">All TECHNOVA 2026 events have been successfully completed!</p>
        <div class="section-line"></div>
      </div>

      <!-- Results Announcement Card -->
      <div class="results-announce-card reveal">
        <div class="results-announce-glow"></div>
        <div class="results-announce-inner">
          <div class="results-announce-icon">🏆</div>
          <h3 class="results-announce-title">Results Coming Soon!</h3>
          <p class="results-announce-desc">
            All past events — <strong>Hackathon 2026</strong>, <strong>Sports Meet 2026</strong>, and <strong>Cultural Night 2026</strong> — have been successfully completed! 
            Results & winners will be announced very soon. Stay tuned!
          </p>
          <div class="results-events-row">
            <div class="results-event-chip completed-chip">
              <span class="chip-icon">⚡</span>
              <span>Hackathon</span>
              <span class="chip-status">✅</span>
            </div>
            <div class="results-event-chip completed-chip">
              <span class="chip-icon">🏆</span>
              <span>Sports Meet</span>
              <span class="chip-status">✅</span>
            </div>
            <div class="results-event-chip completed-chip">
              <span class="chip-icon">🎭</span>
              <span>Cultural Night</span>
              <span class="chip-status">✅</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Events Preview -->
      <div class="upcoming-preview reveal" style="margin-top: var(--space-2xl);">
        <h3 class="upcoming-preview-title">🚀 Upcoming Events — Stay Tuned!</h3>
        <p class="upcoming-preview-subtitle">Dates will be finalized soon. We'll notify you!</p>
        <div class="upcoming-chips-grid">
          <a href="events.html#iot-challenge" class="upcoming-chip">
            <span class="upcoming-chip-icon">🏗️</span>
            <span class="upcoming-chip-name">IoT Innovation Challenge</span>
            <span class="upcoming-chip-tag">Technical</span>
          </a>
          <a href="events.html#esports" class="upcoming-chip">
            <span class="upcoming-chip-icon">🎮</span>
            <span class="upcoming-chip-name">E-Sports Arena</span>
            <span class="upcoming-chip-tag">Fun</span>
          </a>
          <a href="events.html#treasure" class="upcoming-chip">
            <span class="upcoming-chip-icon">🧩</span>
            <span class="upcoming-chip-name">CypherChase — Treasure Hunt</span>
            <span class="upcoming-chip-tag">Fun</span>
          </a>
          <a href="events.html#quiz" class="upcoming-chip">
            <span class="upcoming-chip-icon">🧠</span>
            <span class="upcoming-chip-name">BrainBytes — Tech Quiz</span>
            <span class="upcoming-chip-tag">Technical</span>
          </a>
          <a href="events.html#codeblitz" class="upcoming-chip">
            <span class="upcoming-chip-icon">💻</span>
            <span class="upcoming-chip-name">Code Blitz</span>
            <span class="upcoming-chip-tag">Technical</span>
          </a>
        </div>
      </div>
    `;
  }

  // ===================== ANNOUNCEMENT TICKER =====================
  function initTicker() {
    const track = document.getElementById('ticker-track');
    if (!track) return;

    const announcements = [
      '🏆 TECHNOVA 2026 — All Events Successfully Completed!',
      '📊 Results & Winners will be announced very soon — Stay Tuned!',
      '🏗️ UPCOMING: IoT Innovation Challenge — Date TBA',
      '🎮 UPCOMING: E-Sports Arena (Valorant, BGMI, Free Fire) — Date TBA',
      '🧩 UPCOMING: CypherChase Treasure Hunt — Date TBA',
      '🧠 UPCOMING: BrainBytes Tech Quiz — Date TBA',
      '💻 UPCOMING: Code Blitz Speed Programming — Date TBA',
      '🔔 Stay tuned for dates — We will notify you once finalized!',
      '🎓 E-Certificates for All Participants Coming Soon'
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
    initResultsBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
