/* ============================================================
   PAES TECHNOVA 2026 — Committees JS
   ============================================================ */
(function() {
  'use strict';

  const committees = [
    { id: 'technical', name: 'Technical', icon: '💻', coordinator: 'Rahul Sharma', coCoordinator: 'Priya Patel', volunteers: ['Aditya M.', 'Sneha K.', 'Vikram R.', 'Neha D.', 'Rohan S.', 'Anjali T.'] },
    { id: 'cultural', name: 'Cultural', icon: '🎭', coordinator: 'Meera Joshi', coCoordinator: 'Arjun Singh', volunteers: ['Shreya B.', 'Kunal P.', 'Divya L.', 'Siddharth G.', 'Pooja M.'] },
    { id: 'sports', name: 'Sports', icon: '⚽', coordinator: 'Amit Kumar', coCoordinator: 'Kavya Reddy', volunteers: ['Raj V.', 'Manish T.', 'Sakshi N.', 'Deepak R.', 'Tanvi S.', 'Varun K.', 'Ishita P.'] },
    { id: 'photography', name: 'Photography / Reels', icon: '📸', coordinator: 'Sanjay Verma', coCoordinator: 'Riya Gupta', volunteers: ['Akash D.', 'Nisha R.', 'Pranav M.', 'Kriti S.'] },
    { id: 'certificates', name: 'Certificates', icon: '🎓', coordinator: 'Ananya Das', coCoordinator: 'Vivek Chandra', volunteers: ['Pallavi K.', 'Harsh J.', 'Swati B.'] },
    { id: 'notices', name: 'Notices & PR', icon: '📢', coordinator: 'Nikhil Rao', coCoordinator: 'Simran Kaur', volunteers: ['Aman G.', 'Ritika S.', 'Mohit L.', 'Tanya V.'] }
  ];

  function renderCommittees() {
    const grid = document.getElementById('committees-grid');
    if (!grid) return;

    grid.innerHTML = committees.map((c, i) => `
      <div class="committee-card reveal" style="animation-delay:${i * 0.1}s">
        <div class="committee-card-inner">
          <!-- FRONT -->
          <div class="committee-card-front">
            <div class="committee-icon">${c.icon}</div>
            <h3 class="committee-name">${c.name}</h3>
            <div class="committee-members-front">
              <div>
                <div class="committee-role">Coordinator</div>
                <div class="committee-person">${c.coordinator}</div>
              </div>
              <div>
                <div class="committee-role">Co-Coordinator</div>
                <div class="committee-person">${c.coCoordinator}</div>
              </div>
            </div>
            <span class="committee-flip-hint">↻ Hover to see volunteers</span>
          </div>
          <!-- BACK -->
          <div class="committee-card-back">
            <div class="committee-back-title">${c.icon} ${c.name} Committee</div>
            <div class="committee-back-subtitle">Volunteers (${c.volunteers.length})</div>
            <ul class="volunteers-list">
              ${c.volunteers.map(v => `<li>${v}</li>`).join('')}
            </ul>
            <div class="committee-dashboard-btn" id="dash-btn-${c.id}" style="display:none;">
              <a href="dashboard.html?committee=${c.id}" class="btn btn-sm btn-secondary w-full">Open Dashboard →</a>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  function init() {
    renderCommittees();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
