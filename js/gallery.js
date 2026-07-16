/* The Scrapbook — masonry gallery (85 photos, filename order) + lightbox. */
(function () {
  var grid = document.getElementById('galleryGrid');
  if (!grid) return;

  // [width, height] per photo, jay-001..jay-085, from photos/manifest.json
  var DIMS = [
    [1600,1026],[1600,1062],[810,1080],[540,720],[1200,1600],[1200,1600],[576,1024],[1024,680],[640,640],[1600,1062],
    [1600,1200],[1200,1600],[1280,707],[853,1280],[853,1280],[853,1280],[1280,853],[1280,853],[1280,853],[1245,1280],
    [1200,1600],[532,800],[570,579],[1182,1200],[1176,1191],[900,1600],[900,1600],[1280,853],[1280,853],[1280,853],
    [1280,853],[1280,960],[1280,960],[960,1280],[640,852],[853,1280],[627,963],[1280,960],[925,1384],[1547,1417],
    [1600,1050],[1056,1436],[1061,1453],[1067,1429],[1091,1456],[1081,1469],[1073,1280],[1600,1132],[1200,1600],[1064,1427],
    [1088,1455],[1100,1415],[1600,1600],[1200,1600],[1200,1600],[1280,853],[1100,1440],[1060,1432],[1592,1600],[982,1600],
    [738,1600],[1179,1177],[768,1024],[1200,1600],[1200,1600],[900,1600],[540,720],[960,1280],[803,1280],[1200,1600],
    [1280,1280],[900,1600],[720,1280],[1280,960],[720,960],[960,720],[720,960],[540,720],[900,1600],[1600,900],
    [900,1600],[1200,1600],[900,1600],[1200,1600],[960,1280]
  ];

  var PHOTOS = DIMS.map(function (d, i) {
    var n = String(i + 1).padStart(3, '0');
    return { file: 'jay-' + n + '.webp', w: d[0], h: d[1], n: i + 1 };
  });

  var frag = document.createDocumentFragment();
  PHOTOS.forEach(function (p, i) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'gallery-item';
    btn.setAttribute('data-index', i);
    btn.setAttribute('aria-label', 'Open photo ' + p.n + ' of 85');
    var img = document.createElement('img');
    img.src = 'assets/img/med/' + p.file;
    img.width = p.w;
    img.height = p.h;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.alt = 'Family photo ' + p.n + ' of 85 from Jay Dhruva’s 45 years, ' + (p.w >= p.h ? 'landscape' : 'portrait') + ' orientation.';
    btn.appendChild(img);
    frag.appendChild(btn);
  });
  grid.appendChild(frag);

  /* ---------------- Lightbox ---------------- */
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lightboxImg');
  var lbCount = document.getElementById('lightboxCount');
  var lbClose = document.getElementById('lightboxClose');
  var lbPrev = document.getElementById('lightboxPrev');
  var lbNext = document.getElementById('lightboxNext');

  var openIndex = -1;
  var lastFocused = null;

  function render() {
    var p = PHOTOS[openIndex];
    lbImg.src = 'assets/img/full/' + p.file;
    lbImg.alt = 'Family photo ' + p.n + ' of 85 from Jay Dhruva’s 45 years.';
    lbCount.textContent = 'Photo ' + p.n + ' of ' + PHOTOS.length;
  }

  function open(i) {
    openIndex = i;
    lastFocused = document.activeElement;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    render();
    lbClose.focus();
  }

  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  function next() { openIndex = (openIndex + 1) % PHOTOS.length; render(); }
  function prev() { openIndex = (openIndex - 1 + PHOTOS.length) % PHOTOS.length; render(); }

  grid.addEventListener('click', function (e) {
    var btn = e.target.closest('.gallery-item');
    if (!btn) return;
    open(Number(btn.getAttribute('data-index')));
  });

  lbClose.addEventListener('click', close);
  lbNext.addEventListener('click', next);
  lbPrev.addEventListener('click', prev);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
  });

  // Swipe navigation
  var touchStartX = null;
  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', function (e) {
    if (touchStartX == null) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
    touchStartX = null;
  }, { passive: true });
})();
