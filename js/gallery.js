/* ============================================================
   PAES TECHNOVA 2026 — Gallery JS
   ============================================================ */
(function() {
  'use strict';

  const albums = [
    { id: 'technova2025', name: 'TECHNOVA 2025', icon: '🎉', count: 24 },
    { id: 'hackathon', name: 'Hackathon', icon: '💻', count: 18 },
    { id: 'sports', name: 'Sports Meet', icon: '⚽', count: 32 },
    { id: 'cultural', name: 'Cultural Night', icon: '🎭', count: 28 },
    { id: 'workshops', name: 'Workshops', icon: '🔧', count: 15 }
  ];

  // Placeholder images using picsum for demo
  const sampleImages = {
    technova2025: Array.from({length: 12}, (_, i) => ({ id: i, src: `https://picsum.photos/seed/tech${i}/600/${300 + (i % 3) * 100}`, alt: `TECHNOVA 2025 Photo ${i+1}` })),
    hackathon: Array.from({length: 8}, (_, i) => ({ id: i, src: `https://picsum.photos/seed/hack${i}/600/${300 + (i % 3) * 100}`, alt: `Hackathon Photo ${i+1}` })),
    sports: Array.from({length: 10}, (_, i) => ({ id: i, src: `https://picsum.photos/seed/sport${i}/600/${300 + (i % 3) * 100}`, alt: `Sports Photo ${i+1}` })),
    cultural: Array.from({length: 10}, (_, i) => ({ id: i, src: `https://picsum.photos/seed/cult${i}/600/${300 + (i % 3) * 100}`, alt: `Cultural Photo ${i+1}` })),
    workshops: Array.from({length: 6}, (_, i) => ({ id: i, src: `https://picsum.photos/seed/work${i}/600/${300 + (i % 3) * 100}`, alt: `Workshop Photo ${i+1}` }))
  };

  let currentAlbum = 'technova2025';
  let currentImages = [];
  let lightboxIndex = 0;

  function renderAlbums() {
    const carousel = document.getElementById('albums-carousel');
    if (!carousel) return;

    carousel.innerHTML = albums.map(a => `
      <div class="album-card ${a.id === currentAlbum ? 'active' : ''}" onclick="selectAlbum('${a.id}')">
        <div class="album-card-inner">
          <div class="album-card-face">
            <div class="album-icon">${a.icon}</div>
            <div class="album-name">${a.name}</div>
            <div class="album-count">${a.count} photos</div>
          </div>
        </div>
      </div>
    `).join('');
  }

  window.selectAlbum = function(albumId) {
    currentAlbum = albumId;
    document.querySelectorAll('.album-card').forEach(c => c.classList.toggle('active', c.querySelector('.album-card-face') && c.onclick.toString().includes(albumId)));
    renderAlbums();
    renderGallery();
  };

  function renderGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    currentImages = sampleImages[currentAlbum] || [];
    grid.innerHTML = currentImages.map((img, i) => `
      <div class="gallery-item" onclick="openLightbox(${i})">
        <img src="${img.src}" alt="${img.alt}" loading="lazy">
      </div>
    `).join('');
  }

  window.openLightbox = function(index) {
    lightboxIndex = index;
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    img.src = currentImages[index].src;
    img.alt = currentImages[index].alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function(e) {
    if (e && e.target !== document.getElementById('lightbox') && !e.target.classList.contains('lightbox-close')) return;
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
  };

  window.navigateLightbox = function(dir, e) {
    if (e) e.stopPropagation();
    lightboxIndex = (lightboxIndex + dir + currentImages.length) % currentImages.length;
    const img = document.getElementById('lightbox-img');
    img.src = currentImages[lightboxIndex].src;
    img.alt = currentImages[lightboxIndex].alt;
  };

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!document.getElementById('lightbox').classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  window.handleUpload = function(e) {
    const files = e.target.files;
    if (typeof showToast === 'function') showToast(`${files.length} file(s) selected. Upload to Google Drive will be implemented with API setup.`, 'info');
  };

  function init() {
    renderAlbums();
    renderGallery();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
