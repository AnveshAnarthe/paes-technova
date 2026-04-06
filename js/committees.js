/* ============================================================
   PAES TECHNOVA 2026 — Committees & Leadership JS
   ============================================================ */
(function () {
  'use strict';

  const leadership = [
    { role: 'President', name: 'Dr. S. S. Lavhate', desc: 'H.O.D. Electronics & Computer Engg.' },
    { role: 'PAES Co-ordinator', name: 'Mr. S. D. Anap', desc: '' },
    { role: 'Vice President', name: 'Mr. Anvesh Sandip Anarthe', desc: '' },
    { role: 'SE Co-coordinator', name: 'Mr. Om Rahane', desc: '' },
    { role: 'Cultural Secretary', name: 'Miss. Ishwari Thokal', desc: '' },
    { role: 'Treasurer', name: 'Mr. Sarthak Achyut Jadhav', desc: '' },
    { role: 'Student Representative', name: 'Mr. Gulave Abhiraj Narayam', desc: '' },
    { role: 'Male Representative', name: 'Mr. Ankush Gangadhar Hire', desc: '' },
    { role: 'Female Representative', name: 'Miss. Sanskruti Bhausaheb Anarthe', desc: '' }
  ];

  const committees = [
    {
      id: 'cultural', name: 'Cultural', icon: '🎭',
      coordinator: 'Ishwari Thokal',
      coCoordinator: 'Taniksha Mandalik, Vidita Rane',
      volunteers: ['Satpute Ishwari', 'Sanskruti Anarthe', 'Gayatri Dahatonde', 'Mamta Kambale', 'Pradnya Jadhav', 'Akanksha Bhumare', 'Om Rahane', 'Ishwari Gawali', 'Mandira Gadekar', 'Mohit Turakane', 'Sarthak Jorvekar', 'Sangram Tambe']
    },
    {
      id: 'technical', name: 'Technical', icon: '💻',
      coordinator: 'Siddhi Kharde',
      coCoordinator: 'Utkarsha Patil, Battin Aaditya',
      volunteers: ['Gayatri Devadhe', 'Sanskruti Anarthe', 'Ketaki Chaudhari', 'Trupti Dabhade', 'Akanksha Shelar', 'Prachi Tambe', 'Prajakta Bidave', 'Shrushti Dhokchaule', 'Aditya Battin', 'Varad Sonawane', 'Nilesh Bhojane']
    },
    {
      id: 'stage', name: 'Stage & Decoration', icon: '🎨',
      coordinator: 'Vishnu Walunj & Gayatri Dahatonde',
      coCoordinator: 'Dyaneshwari Nagare, Utkarsha Shinde',
      volunteers: ['Shrushti Dhokchaule', 'Prachi Tambe', 'Prajakta Bidave', 'Ashwini Kale', 'Nikhil Nehe', 'Kartik Bhand', 'Dnyaneshwari Nagare']
    },
    {
      id: 'publicity', name: 'Invitation/Publicity', icon: '📢',
      coordinator: 'Prajakta More',
      coCoordinator: 'Ishwari Gawali',
      volunteers: ['Yash Wakchaure', 'Pradnya Jadhav', 'Om Jadhav', 'Sanika Raut', 'Sakshi Shinde']
    },
    {
      id: 'discipline', name: 'Discipline', icon: '🛡️',
      coordinator: 'Krushna Mhaske, Saurabh Salunke',
      coCoordinator: 'Mohit Turakane, Saurabh Dhokchaule',
      volunteers: ['Sagar Jadhav', 'Prasad Gosavi', 'Yash Waghchaure', 'Somnath Markad', 'Prachi Tambe', 'Prajakta Bidave', 'Amisha Munde', 'Prachi Pansare', 'Rupesh Magar']
    },
    {
      id: 'momento', name: 'Momento', icon: '🏆',
      coordinator: 'Sarthak Jadhav',
      coCoordinator: 'Sairaj Mandlik',
      volunteers: ['Sarthak Gore']
    },
    {
      id: 'food', name: 'Food', icon: '🍔',
      coordinator: 'Abhiraj Kute',
      coCoordinator: 'Om Jadhav',
      volunteers: ['Arti Gite', 'Punam Fanase', 'Sarthak Jadhav', 'Akanksha Bhumare', 'Utkarsha Shinde', 'Ashlesha Tambe', 'Om Badakh', 'Abhay Gawade']
    },
    {
      id: 'transportation', name: 'Transportation', icon: '🚌',
      coordinator: 'Akanksha Bhumare',
      coCoordinator: 'Sanjana Ahire',
      volunteers: ['Namrata Pawar', 'Om Badakh', 'Anuja Gade', 'Gaurav Shelke']
    },
    {
      id: 'photography', name: 'Photography & Reels', icon: '📸',
      coordinator: 'Kartik Dhanwate, Krushna Mhaske',
      coCoordinator: 'Sangram Tambe, Mayur Katore',
      volunteers: ['Gauri Kharde']
    },
    {
      id: 'documentation', name: 'Documentation', icon: '📝',
      coordinator: 'Adwait Pote',
      coCoordinator: 'Sanika Raut',
      volunteers: ['Prachi Tambe', 'Utkarsha Patil']
    },
    {
      id: 'magazine', name: 'Magazine', icon: '📰',
      coordinator: 'Shravani Kasar (SE), Shubham Jadhav (TE), Shubham Mungase (BE)',
      coCoordinator: '-',
      volunteers: []
    },
    {
      id: 'sports', name: 'Sports', icon: '⚽',
      coordinator: 'Ankush Hire, Sanskruti Anarthe',
      coCoordinator: 'Sarjerao Paul, Amisha Munde',
      volunteers: ['Arti Gite', 'Abhiraj Gulve', 'Atharv Bolke', 'Anushka Kadaskar', 'Atul Ingale']
    }
  ];

  function renderLeadership() {
    const grid = document.getElementById('leadership-grid');
    if (!grid) return;

    grid.innerHTML = leadership.map((l, i) => `
      <div class="leadership-card reveal" style="animation-delay:${i * 0.05}s">
        <div class="leadership-role">${l.role}</div>
        <h3 class="leadership-name">${l.name}</h3>
        ${l.desc ? `<div class="leadership-desc">${l.desc}</div>` : ''}
      </div>
    `).join('');
  }

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
                <div class="committee-role">Coordinator(s)</div>
                <div class="committee-person">${c.coordinator}</div>
              </div>
              ${c.coCoordinator !== '-' ? `
              <div>
                <div class="committee-role">Co-Coordinator(s)</div>
                <div class="committee-person">${c.coCoordinator}</div>
              </div>` : ''}
            </div>
            ${c.volunteers.length > 0 ? `<span class="committee-flip-hint">↻ Hover to see volunteers</span>` : ''}
          </div>
          <!-- BACK -->
          <div class="committee-card-back">
            <div class="committee-back-title">${c.icon} ${c.name} Committee</div>
            <div class="committee-back-subtitle">Volunteers (${c.volunteers.length})</div>
            ${c.volunteers.length > 0 ? `
            <ul class="volunteers-list">
              ${c.volunteers.map(v => `<li>${v}</li>`).join('')}
            </ul>` : '<div style="color:var(--text-muted);font-size:0.9rem;text-align:center;margin-top:20px;">No volunteers listed</div>'}
            <div class="committee-dashboard-btn" id="dash-btn-${c.id}" style="display:none;">
              <a href="dashboard.html?committee=${c.id}" class="btn btn-sm btn-secondary w-full">Open Dashboard →</a>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  function init() {
    renderLeadership();
    renderCommittees();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
