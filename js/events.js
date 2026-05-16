/* ============================================================
   PAES TECHNOVA 2026 — Events Page JS
   Event cards, registration, QR code generation
   ============================================================ */

(function () {
  'use strict';

  // ---- COMPLETED (Past) Events ----
  const pastEventsData = [
    {
      id: 'hackathon',
      title: 'Hackathon 2026',
      category: 'technical',
      date: 'Apr 17, 2026',
      time: '09:00 AM',
      venue: 'Multipurpose Holl',
      desc: 'A 24-hour coding marathon where teams of 8-10 build innovative solutions. Top Qualified team win cash prize',
      image: 'assets/banners/hackathon.png',
      spots: 120,
      registered: 120,
      teamEvent: true,
      minTeam: 2,
      maxTeam: 4,
      badge: 'Completed',
      badgeClass: 'badge-green',
      status: 'completed'
    },
    {
      id: 'sports',
      title: 'Sports Meet 2026',
      category: 'sports',
      date: 'Apr 13, 2026',
      time: '08:00 AM',
      venue: 'Main Ground',
      desc: 'Inter-class sports competition featuring cricket, football, basketball, badminton, and athletics.',
      image: 'assets/banners/sports.png',
      spots: 200,
      registered: 200,
      teamEvent: false,
      badge: 'Completed',
      badgeClass: 'badge-green',
      status: 'completed'
    },
    {
      id: 'cultural',
      title: 'Cultural Night 2026',
      category: 'cultural',
      date: 'May 12, 2026',
      time: '06:00 PM',
      venue: 'Main Auditorium',
      desc: 'Grand Cultural Night — Freshers Party, Farewell & Dinner Night with music, dance, drama performances, and a DJ night to close TECHNOVA 2026.',
      image: 'assets/banners/cultural.png',
      spots: 300,
      registered: 300,
      teamEvent: false,
      badge: 'Completed',
      badgeClass: 'badge-green',
      status: 'completed'
    }
  ];

  // ---- UPCOMING Events ----
  const upcomingEventsData = [
    {
      id: 'iot-challenge',
      title: 'IoT Innovation Challenge',
      category: 'technical',
      date: 'Coming Soon',
      time: 'TBA',
      venue: 'Electronics Lab',
      desc: 'Build a working IoT prototype in 6 hours! Design smart solutions using sensors, microcontrollers, and cloud platforms. Very relevant for ECE students.',
      image: 'assets/banners/hackathon.png',
      spots: 80,
      registered: 0,
      teamEvent: true,
      minTeam: 2,
      maxTeam: 4,
      badge: 'Upcoming',
      badgeClass: 'badge-cyan',
      status: 'upcoming'
    },
    {
      id: 'esports',
      title: 'E-Sports Arena',
      category: 'fun',
      date: 'Coming Soon',
      time: 'TBA',
      venue: 'IT Lab / Online',
      desc: 'Battle it out in Valorant, BGMI & Free Fire tournaments! Huge prizes await the champions. Massive student engagement guaranteed.',
      image: 'assets/banners/cultural.png',
      spots: 150,
      registered: 0,
      teamEvent: true,
      minTeam: 4,
      maxTeam: 5,
      badge: 'Upcoming',
      badgeClass: 'badge-cyan',
      status: 'upcoming'
    },
    {
      id: 'treasure',
      title: 'CypherChase — Treasure Hunt',
      category: 'fun',
      date: 'Coming Soon',
      time: 'TBA',
      venue: 'Campus Wide',
      desc: 'Solve clues, decode puzzles, and race across campus to find the hidden treasure! A thrilling campus-wide adventure.',
      image: 'assets/banners/cultural.png',
      spots: 100,
      registered: 0,
      teamEvent: true,
      minTeam: 3,
      maxTeam: 5,
      badge: 'Upcoming',
      badgeClass: 'badge-cyan',
      status: 'upcoming'
    },
    {
      id: 'quiz',
      title: 'BrainBytes — Tech Quiz',
      category: 'technical',
      date: 'Coming Soon',
      time: 'TBA',
      venue: 'Seminar Hall',
      desc: 'Test your knowledge in electronics, programming, networking, and emerging technologies. Quick-fire rounds, buzzer rounds & more!',
      image: 'assets/banners/hackathon.png',
      spots: 80,
      registered: 0,
      teamEvent: true,
      minTeam: 2,
      maxTeam: 2,
      badge: 'Upcoming',
      badgeClass: 'badge-cyan',
      status: 'upcoming'
    },
    {
      id: 'codeblitz',
      title: 'Code Blitz',
      category: 'technical',
      date: 'Coming Soon',
      time: 'TBA',
      venue: 'IT Lab 2',
      desc: 'Speed programming contest — solve maximum problems in 2 hours! Individual event testing logic, algorithms & coding skills. Quick, competitive & fun.',
      image: 'assets/banners/hackathon.png',
      spots: 60,
      registered: 0,
      teamEvent: false,
      badge: 'Upcoming',
      badgeClass: 'badge-cyan',
      status: 'upcoming'
    }
  ];

  // Combined for filtering
  const allEventsData = [...pastEventsData, ...upcomingEventsData];

  let currentFilter = 'all';
  let selectedEvent = null;
  let regType = 'individual';

  // ---- Render All Sections ----
  function renderEvents(filter = 'all') {
    const grid = document.getElementById('events-grid');
    if (!grid) return;

    let filteredPast, filteredUpcoming;

    if (filter === 'all') {
      filteredPast = pastEventsData;
      filteredUpcoming = upcomingEventsData;
    } else {
      filteredPast = pastEventsData.filter(e => e.category === filter);
      filteredUpcoming = upcomingEventsData.filter(e => e.category === filter);
    }

    let html = '';

    // ---- Results Announcement Banner ----
    if (filteredPast.length > 0) {
      html += `
        <div class="events-section-banner results-banner reveal" style="grid-column: 1 / -1;">
          <div class="banner-glow"></div>
          <div class="banner-content">
            <div class="banner-icon">🏆</div>
            <h2 class="banner-title">All Events Successfully Completed!</h2>
            <p class="banner-desc">Results will be announced very soon. Stay tuned for winners & certificates!</p>
            <div class="banner-pulse-ring"></div>
          </div>
        </div>
      `;

      // Render completed event cards
      html += filteredPast.map(event => renderCompletedCard(event)).join('');
    }

    // ---- Upcoming Events Banner ----
    if (filteredUpcoming.length > 0) {
      html += `
        <div class="events-section-banner upcoming-banner reveal" style="grid-column: 1 / -1;">
          <div class="banner-glow upcoming-glow"></div>
          <div class="banner-content">
            <div class="banner-icon">🚀</div>
            <h2 class="banner-title">Upcoming Events</h2>
            <p class="banner-desc">Stay tuned for dates — once finalized, we will notify you!</p>
            <div class="banner-pulse-ring upcoming-ring"></div>
          </div>
        </div>
      `;

      // Render upcoming event cards
      html += filteredUpcoming.map(event => renderUpcomingCard(event)).join('');
    }

    if (!filteredPast.length && !filteredUpcoming.length) {
      html = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;">
        <p style="color:var(--text-muted);font-size:1.1rem;">No events found in this category.</p>
      </div>`;
    }

    grid.innerHTML = html;
    initScrollReveal();
  }

  // ---- Completed Event Card ----
  function renderCompletedCard(event) {
    return `
      <div class="event-card completed-event reveal" data-category="${event.category}" id="event-${event.id}">
        <div class="event-card-inner">
          <div class="completed-overlay">
            <div class="completed-stamp">✅ COMPLETED</div>
          </div>
          <img src="${event.image}" alt="${event.title}" class="event-card-image" loading="lazy">
          <div class="event-card-body">
            <div class="event-card-header">
              <h3 class="event-card-title">${event.title}</h3>
              <span class="badge ${event.badgeClass}">${event.badge}</span>
            </div>
            <div class="event-card-meta">
              <span>📅 ${event.date}</span>
              <span>🕐 ${event.time}</span>
            </div>
            <div class="event-card-meta">
              <span>📍 ${event.venue}</span>
              ${event.teamEvent ? `<span>👥 Team (${event.minTeam}-${event.maxTeam})</span>` : '<span>👤 Individual</span>'}
            </div>
            <p class="event-card-desc">${event.desc}</p>
            <div class="event-card-footer">
              <span class="event-card-spots" style="color: var(--neon-orange);">🏆 Results Coming Soon</span>
              <span class="event-status-badge completed-badge">Event Over</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ---- Upcoming Event Card ----
  function renderUpcomingCard(event) {
    return `
      <div class="event-card upcoming-event reveal" data-category="${event.category}" id="event-${event.id}">
        <div class="event-card-inner">
          <div class="upcoming-overlay">
            <div class="upcoming-stamp">🔜 COMING SOON</div>
          </div>
          <img src="${event.image}" alt="${event.title}" class="event-card-image" loading="lazy">
          <div class="event-card-body">
            <div class="event-card-header">
              <h3 class="event-card-title">${event.title}</h3>
              <span class="badge ${event.badgeClass}">${event.badge}</span>
            </div>
            <div class="event-card-meta">
              <span>📅 ${event.date}</span>
              <span>🕐 ${event.time}</span>
            </div>
            <div class="event-card-meta">
              <span>📍 ${event.venue}</span>
              ${event.teamEvent ? `<span>👥 Team (${event.minTeam}-${event.maxTeam})</span>` : '<span>👤 Individual</span>'}
            </div>
            <p class="event-card-desc">${event.desc}</p>
            <div class="event-card-footer">
              <span class="event-card-spots" style="color: var(--neon-cyan);">🔔 Date TBA — Stay Tuned!</span>
              <span class="event-status-badge upcoming-badge-tag">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal:not(.visible)');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));
  }

  // ---- Filter Events ----
  function initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderEvents(currentFilter);
      });
    });
  }

  // ---- Search ----
  function initSearch() {
    const searchInput = document.getElementById('events-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      document.querySelectorAll('.event-card').forEach(card => {
        const title = card.querySelector('.event-card-title')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('.event-card-desc')?.textContent.toLowerCase() || '';
        card.style.display = (title.includes(query) || desc.includes(query)) ? '' : 'none';
      });
      // Also show/hide banners based on if any children are visible
      document.querySelectorAll('.events-section-banner').forEach(banner => {
        banner.style.display = query ? 'none' : '';
      });
    });
  }

  // ---- Registration Modal (kept for future upcoming events) ----
  window.openRegistration = function (eventId) {
    selectedEvent = allEventsData.find(e => e.id === eventId);
    if (!selectedEvent) return;

    const modal = document.getElementById('reg-modal');
    const title = document.getElementById('reg-event-title');
    const form = document.getElementById('reg-form');
    const success = document.getElementById('reg-success');
    const teamSection = document.getElementById('team-section');
    const teamToggle = document.getElementById('reg-type-team');

    title.textContent = selectedEvent.title;
    form.style.display = '';
    success.classList.remove('visible');

    // Show/hide team option
    if (selectedEvent.teamEvent) {
      teamToggle.style.display = '';
      document.getElementById('team-info').textContent =
        `Team size: ${selectedEvent.minTeam} - ${selectedEvent.maxTeam} members`;
    } else {
      teamToggle.style.display = 'none';
      setRegType('individual');
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeRegistration = function () {
    const modal = document.getElementById('reg-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  function setRegType(type) {
    regType = type;
    document.querySelectorAll('.reg-type-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.type === type);
    });
    const teamSection = document.getElementById('team-section');
    if (teamSection) {
      teamSection.classList.toggle('visible', type === 'team');
    }
  }

  // ---- Team Members ----
  let teamMemberCount = 1;

  window.addTeamMember = function () {
    if (!selectedEvent) return;
    if (teamMemberCount >= selectedEvent.maxTeam - 1) {
      if (typeof showToast === 'function') showToast(`Maximum ${selectedEvent.maxTeam} members allowed`, 'warning');
      return;
    }
    teamMemberCount++;
    const container = document.getElementById('team-members-list');
    const row = document.createElement('div');
    row.className = 'team-member-row';
    row.innerHTML = `
      <input type="text" class="form-input team-member-name" placeholder="Member ${teamMemberCount + 1} Name" required>
      <input type="email" class="form-input team-member-email" placeholder="Email" required>
      <button type="button" class="remove-member-btn" onclick="removeTeamMember(this)">×</button>
    `;
    container.appendChild(row);
  };

  window.removeTeamMember = function (btn) {
    btn.closest('.team-member-row').remove();
    teamMemberCount--;
  };

  // ---- Submit Registration ----
  window.submitRegistration = async function (e) {
    e.preventDefault();

    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const year = document.getElementById('reg-year').value;

    if (!name || !email || !phone || !year) {
      if (typeof showToast === 'function') showToast('Please fill all required fields', 'error');
      return;
    }

    // Generate unique registration ID
    const regId = `PAES-${selectedEvent.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    // Collect team members if team registration
    let teamMembers = [];
    if (regType === 'team') {
      const teamName = document.getElementById('reg-team-name')?.value.trim();
      if (!teamName) {
        if (typeof showToast === 'function') showToast('Please enter team name', 'error');
        return;
      }
      const memberNames = document.querySelectorAll('.team-member-name');
      const memberEmails = document.querySelectorAll('.team-member-email');
      memberNames.forEach((input, i) => {
        teamMembers.push({
          name: input.value.trim(),
          email: memberEmails[i]?.value.trim() || ''
        });
      });
    }

    // Prepare data for Google Sheets
    const rowData = {
      timestamp: new Date().toISOString(),
      regId: regId,
      event: selectedEvent.title,
      eventId: selectedEvent.id,
      type: regType,
      name: name,
      email: email,
      phone: phone,
      year: year,
      teamName: regType === 'team' ? (document.getElementById('reg-team-name')?.value || '') : '',
      teamMembers: JSON.stringify(teamMembers),
      status: 'confirmed'
    };

    console.log('Registration data:', rowData);

    // Send to Google Sheets
    try {
      const config = GoogleAPI.getConfig();
      await GoogleAPI.appendRow(
        config.SHEETS.REGISTRATIONS,
        'Sheet1!A:L',
        Object.values(rowData)
      );
      console.log('✅ Saved to Google Sheets');
    } catch (err) {
      console.warn('Sheets save skipped (API not connected yet):', err.message);
    }

    // Show success with QR
    showRegistrationSuccess(regId, name, selectedEvent.title);
  };

  function showRegistrationSuccess(regId, name, eventTitle) {
    const form = document.getElementById('reg-form');
    const success = document.getElementById('reg-success');

    form.style.display = 'none';
    success.classList.add('visible');

    document.getElementById('success-name').textContent = name;
    document.getElementById('success-event').textContent = eventTitle;
    document.getElementById('success-reg-id').textContent = regId;

    // Generate QR Code
    const qrContainer = document.getElementById('qr-code');
    qrContainer.innerHTML = '';

    // Using QRCode.js library
    if (typeof QRCode !== 'undefined') {
      new QRCode(qrContainer, {
        text: `PAES-VERIFY:${regId}`,
        width: 150,
        height: 150,
        colorDark: '#06060e',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    } else {
      // Fallback: Show reg ID prominently
      qrContainer.innerHTML = `<div style="padding:20px;font-family:var(--font-mono);color:#06060e;font-size:0.8rem;word-break:break-all">${regId}</div>`;
    }

    if (typeof showToast === 'function') showToast('Registration successful! 🎉', 'success');
  }

  // ---- Init ----
  function init() {
    renderEvents();
    initFilters();
    initSearch();

    // Registration type toggle
    document.querySelectorAll('.reg-type-btn').forEach(btn => {
      btn.addEventListener('click', () => setRegType(btn.dataset.type));
    });

    // Close modal on overlay click
    const modal = document.getElementById('reg-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeRegistration();
      });
    }

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeRegistration();
    });

    // Check URL hash for direct event link
    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => {
        const card = document.getElementById(`event-${hash}`);
        if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
