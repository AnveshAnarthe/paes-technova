/* ============================================================
   PAES TECHNOVA 2026 — Notices JS
   ============================================================ */
(function() {
  'use strict';

  const sampleNotices = [
    { id: 1, title: 'TECHNOVA 2026 Registrations Open!', content: 'We are excited to announce that registrations for TECHNOVA 2026 are now open! Register for Hackathon, Sports Meet, Cultural Night and many more exciting events. Early bird registrations get exclusive merchandise.', priority: 'urgent', date: '2026-04-05', author: 'VP Anvesh' },
    { id: 2, title: 'Committee Applications — Last Date Extended', content: 'The last date for committee applications has been extended to April 10, 2026. All ECE students from SE, TE, and BE are eligible to apply for coordinator and volunteer positions. Apply through the official form.', priority: 'important', date: '2026-04-03', author: 'Technical Coordinator' },
    { id: 3, title: 'Hackathon Problem Statements Released', content: 'Problem statements for the TECHNOVA Hackathon 2026 have been released. Teams can start brainstorming solutions. Themes include: AI in Healthcare, Smart Campus, Green Technology, and FinTech Innovation.', priority: 'info', date: '2026-04-01', author: 'Technical Committee' },
    { id: 4, title: 'Sports Meet — Team Formation Deadline', content: 'All teams for the Sports Meet must be finalized by April 12. Each class needs to submit their squad list to the Sports Coordinator. Events include cricket, football, basketball, badminton, and athletics.', priority: 'info', date: '2026-03-28', author: 'Sports Coordinator' },
    { id: 5, title: 'Cultural Night — Freshers Party, Farewell & Dinner Night', content: 'Cultural Night on Apr 30 will feature Freshers Party, Farewell and Dinner Night! Auditions for performances will be held from April 8-10 in the Main Auditorium. Solo, duet, and group entries are welcome in music, dance, drama, and fashion show categories.', priority: 'info', date: '2026-03-25', author: 'Cultural Coordinator' }
  ];

  function renderNotices() {
    const list = document.getElementById('notices-list');
    if (!list) return;

    list.innerHTML = sampleNotices.map((notice, i) => `
      <div class="notice-card ${notice.priority} reveal" style="animation-delay:${i * 0.1}s" data-id="${notice.id}">
        <div class="notice-card-header">
          <div>
            <span class="badge badge-${notice.priority === 'urgent' ? 'red' : notice.priority === 'important' ? 'orange' : 'cyan'}">${notice.priority.toUpperCase()}</span>
            <h3 class="notice-card-title mt-sm">${notice.title}</h3>
          </div>
          <div class="notice-card-date">${formatDate(notice.date)}</div>
        </div>
        <div class="notice-card-content truncated" id="notice-content-${notice.id}">${notice.content}</div>
        <button class="notice-read-more" onclick="toggleNoticeContent(${notice.id})">Read More →</button>
        <div class="notice-card-footer">
          <div class="notice-card-logos">
            <img src="assets/logo-dept.png" alt="ECE">
            <img src="assets/logo-vp.png" alt="VP">
            <span style="font-size:0.7rem;color:var(--text-muted);margin-left:4px;">— ${notice.author}</span>
          </div>
          <div class="notice-card-actions">
            <a href="https://wa.me/?text=${encodeURIComponent(`📢 PAES Notice: ${notice.title}\n\n${notice.content}\n\n— TECHNOVA 2026`)}" target="_blank" rel="noopener" class="notice-share-btn">📲 WhatsApp</a>
            <button class="notice-share-btn" onclick="copyNotice(${notice.id})">📋 Copy</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  window.toggleNoticeContent = function(id) {
    const content = document.getElementById(`notice-content-${id}`);
    const btn = content.parentElement.querySelector('.notice-read-more');
    if (content.classList.contains('truncated')) {
      content.classList.remove('truncated');
      btn.textContent = 'Show Less ↑';
    } else {
      content.classList.add('truncated');
      btn.textContent = 'Read More →';
    }
  };

  window.copyNotice = function(id) {
    const notice = sampleNotices.find(n => n.id === id);
    if (notice) {
      navigator.clipboard.writeText(`📢 ${notice.title}\n\n${notice.content}\n\n— PAES TECHNOVA 2026`);
      if (typeof showToast === 'function') showToast('Notice copied to clipboard', 'success');
    }
  };

  window.toggleNoticeForm = function() {
    const form = document.getElementById('notice-form');
    form.style.display = form.style.display === 'none' ? '' : 'none';
  };

  window.submitNotice = function(e) {
    e.preventDefault();
    const title = document.getElementById('notice-title').value;
    const content = document.getElementById('notice-content').value;
    const priority = document.getElementById('notice-priority').value;
    sampleNotices.unshift({ id: Date.now(), title, content, priority, date: new Date().toISOString().split('T')[0], author: 'Admin' });
    renderNotices();
    document.getElementById('notice-form').style.display = 'none';
    if (typeof showToast === 'function') showToast('Notice published!', 'success');
  };

  window.toggleArchive = function() {
    const archive = document.getElementById('notices-archive');
    const toggle = document.getElementById('archive-toggle');
    if (archive.style.display === 'none') {
      archive.style.display = '';
      archive.innerHTML = '<div class="archive-month"><div class="archive-month-title">March 2026</div><p style="color:var(--text-muted);font-size:0.9rem;">Archived notices will appear here when connected to Google Sheets.</p></div>';
      toggle.textContent = '📂 Hide Archive';
    } else {
      archive.style.display = 'none';
      toggle.textContent = '📂 Show Archive';
    }
  };

  function checkAdmin() {
    setTimeout(() => {
      const user = Auth?.getCurrentUser?.();
      if (user) document.getElementById('post-notice-area').style.display = '';
    }, 1000);
  }

  function init() {
    renderNotices();
    checkAdmin();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
