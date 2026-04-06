/* ============================================================
   PAES TECHNOVA 2026 — Analytics JS (Chart.js)
   ============================================================ */
(function() {
  'use strict';

  const neonCyan = '#00f0ff';
  const neonBlue = '#0077ff';
  const neonPurple = '#8b5cf6';
  const neonGreen = '#22d3ee';
  const neonPink = '#f472b6';
  const neonOrange = '#f97316';

  const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#9ca3af', font: { family: 'Rajdhani', size: 12 }, padding: 16 } }
    },
    scales: {
      x: { ticks: { color: '#6b7280', font: { family: 'Share Tech Mono', size: 11 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
      y: { ticks: { color: '#6b7280', font: { family: 'Share Tech Mono', size: 11 } }, grid: { color: 'rgba(255,255,255,0.04)' } }
    }
  };

  function initCharts() {
    // 1. Registrations by Event (Bar)
    new Chart(document.getElementById('chart-registrations'), {
      type: 'bar',
      data: {
        labels: ['Hackathon', 'Sports Meet', 'Cultural Night', 'Web Dev', 'Tech Quiz', 'Treasure Hunt'],
        datasets: [{
          label: 'Registrations',
          data: [47, 83, 156, 22, 35, 41],
          backgroundColor: [neonCyan + '99', neonGreen + '99', neonPurple + '99', neonBlue + '99', neonOrange + '99', neonPink + '99'],
          borderColor: [neonCyan, neonGreen, neonPurple, neonBlue, neonOrange, neonPink],
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: { ...chartDefaults, plugins: { ...chartDefaults.plugins, legend: { display: false } } }
    });

    // 2. Participation by Year (Doughnut)
    new Chart(document.getElementById('chart-year'), {
      type: 'doughnut',
      data: {
        labels: ['FE (1st Year)', 'SE (2nd Year)', 'TE (3rd Year)', 'BE (4th Year)'],
        datasets: [{
          data: [68, 115, 128, 73],
          backgroundColor: [neonCyan + 'cc', neonBlue + 'cc', neonPurple + 'cc', neonGreen + 'cc'],
          borderColor: '#06060e',
          borderWidth: 3,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '55%',
        plugins: { legend: { position: 'bottom', labels: { color: '#9ca3af', font: { family: 'Rajdhani', size: 12 }, padding: 16, usePointStyle: true } } }
      }
    });

    // 3. Registration Trend (Line)
    new Chart(document.getElementById('chart-trend'), {
      type: 'line',
      data: {
        labels: ['Mar 1', 'Mar 8', 'Mar 15', 'Mar 22', 'Mar 29', 'Apr 1', 'Apr 5'],
        datasets: [{
          label: 'Cumulative Registrations',
          data: [12, 45, 98, 167, 248, 320, 384],
          borderColor: neonCyan,
          backgroundColor: neonCyan + '15',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: neonCyan,
          pointBorderColor: '#06060e',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8
        }]
      },
      options: chartDefaults
    });

    // 4. Certificate Distribution (Pie)
    new Chart(document.getElementById('chart-certs'), {
      type: 'pie',
      data: {
        labels: ['Participation', 'Winner', 'Runner-Up', 'Special'],
        datasets: [{
          data: [98, 18, 16, 10],
          backgroundColor: [neonBlue + 'cc', neonCyan + 'cc', neonPurple + 'cc', neonOrange + 'cc'],
          borderColor: '#06060e',
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: '#9ca3af', font: { family: 'Rajdhani', size: 12 }, padding: 16, usePointStyle: true } } }
      }
    });

    // 5. Committee Activity (Horizontal Bar)
    new Chart(document.getElementById('chart-committee'), {
      type: 'bar',
      data: {
        labels: ['Technical', 'Cultural', 'Sports', 'Photography', 'Certificates', 'Notices & PR'],
        datasets: [
          { label: 'Tasks Completed', data: [24, 18, 22, 15, 12, 20], backgroundColor: neonCyan + '99', borderColor: neonCyan, borderWidth: 1, borderRadius: 4 },
          { label: 'Tasks Pending', data: [6, 8, 4, 5, 3, 2], backgroundColor: neonPurple + '66', borderColor: neonPurple, borderWidth: 1, borderRadius: 4 }
        ]
      },
      options: { ...chartDefaults, indexAxis: 'y' }
    });

    // Animate stat counters
    animateCounters();
  }

  function animateCounters() {
    document.querySelectorAll('.stat-value').forEach(el => {
      const target = parseInt(el.textContent);
      let current = 0;
      const increment = Math.ceil(target / 40);
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current;
      }, 30);
    });
  }

  window.exportReport = function() {
    if (typeof showToast === 'function') showToast('Report export requires Google Drive API setup. PDF will include dual logos and PAES branding.', 'info');
  };

  function init() {
    if (typeof Chart !== 'undefined') initCharts();
    else setTimeout(init, 500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
