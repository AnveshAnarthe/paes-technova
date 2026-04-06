/* ============================================================
   PAES TECHNOVA 2026 — Events Page JS
   Event cards, registration, QR code generation
   ============================================================ */

(function () {
  'use strict';

  // ---- Event Data ----
  const eventsData = [
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
      registered: 47,
      teamEvent: true,
      minTeam: 2,
      maxTeam: 4,
      badge: 'Technical',
      badgeClass: 'badge-cyan',
      regLink: 'https://docs.google.com/forms/d/e/1FAIpQLSdIcXaymDUSWxDu2CDwyCFo-s1j7BgHvXvx9lJVwPKjbsfdAg/viewform?usp=header'
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
      registered: 83,
      teamEvent: false,
      badge: 'Sports',
      badgeClass: 'badge-green'
    },
    {
      id: 'cultural',
      title: 'Cultural Night 2026',
      category: 'cultural',
      date: 'Apr 30, 2026',
      time: '06:00 PM',
      venue: 'Main Auditorium',
      desc: 'Grand Cultural Night — Freshers Party, Farewell & Dinner Night with music, dance, drama performances, and a DJ night to close TECHNOVA 2026.',
      image: 'assets/banners/cultural.png',
      spots: 300,
      registered: 156,
      teamEvent: false,
      badge: 'Cultural',
      badgeClass: 'badge-purple'
    },
    {
      id: 'webdev',
      title: 'Web Dev Challenge',
      category: 'technical',
      date: 'May 15, 2026',
      time: '02:00 PM',
      venue: 'IT Lab 2',
      desc: 'Build a responsive website in 3 hours. Individual event testing HTML, CSS, and JavaScript skills.',
      image: 'assets/banners/hackathon.png',
      spots: 60,
      registered: 22,
      teamEvent: false,
      badge: 'Technical',
      badgeClass: 'badge-cyan'
    },
    {
      id: 'quiz',
      title: 'Tech Quiz',
      category: 'technical',
      date: 'May 16, 2026',
      time: '11:00 AM',
      venue: 'Seminar Hall',
      desc: 'Test your knowledge in electronics, programming, networking, and emerging technologies.',
      image: 'assets/banners/hackathon.png',
      spots: 80,
      registered: 35,
      teamEvent: true,
      minTeam: 2,
      maxTeam: 2,
      badge: 'Technical',
      badgeClass: 'badge-cyan'
    },
    {
      id: 'treasure',
      title: 'Treasure Hunt',
      category: 'fun',
      date: 'May 16, 2026',
      time: '03:00 PM',
      venue: 'Campus Wide',
      desc: 'Solve clues, decode puzzles, and race across campus to find the hidden treasure!',
      image: 'assets/banners/cultural.png',
      spots: 100,
      registered: 41,
      teamEvent: true,
      minTeam: 3,
      maxTeam: 5,
      badge: 'Fun',
      badgeClass: 'badge-orange'
    }
  ];

  let currentFilter = 'all';
  let selectedEvent = null;
  let regType = 'individual';

  // ---- Render Event Cards ----
  function renderEvents(filter = 'all') {
    const grid = document.getElementById('events-grid');
    if (!grid) return;

    const filtered = filter === 'all'
      ? eventsData
      : eventsData.filter(e => e.category === filter);

    grid.innerHTML = filtered.map(event => `
      <div class="event-card reveal" data-category="${event.category}" id="event-${event.id}">
        <div class="event-card-inner">
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
              <span class="event-card-spots">${event.spots - event.registered} spots left</span>
              ${event.regLink
        ? `<a href="${event.regLink}" target="_blank" rel="noopener" class="event-card-register" id="reg-btn-${event.id}">Register</a>`
        : `<button class="event-card-register" onclick="openRegistration('${event.id}')" id="reg-btn-${event.id}">Register</button>`
      }
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Re-init scroll reveal
    initScrollReveal();
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
        const title = card.querySelector('.event-card-title').textContent.toLowerCase();
        const desc = card.querySelector('.event-card-desc').textContent.toLowerCase();
        card.style.display = (title.includes(query) || desc.includes(query)) ? '' : 'none';
      });
    });
  }

  // ---- Registration Modal ----
  window.openRegistration = function (eventId) {
    selectedEvent = eventsData.find(e => e.id === eventId);
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
