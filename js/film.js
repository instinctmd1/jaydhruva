/* The Film — Ken Burns cinematic sequence, captions, lazily-loaded audio. */
(function () {
  var section = document.getElementById('film');
  if (!section) return;

  var playBtn = document.getElementById('filmPlayBtn');
  var stage = document.getElementById('filmStage');
  var framesHost = document.getElementById('filmFrames');
  var captionEl = document.getElementById('filmCaption');
  var progressBar = document.getElementById('filmProgressBar');
  var skipBtn = document.getElementById('filmSkipBtn');
  var audio = document.getElementById('filmAudio');

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var SEQUENCE = [
    { file: 'jay-029.webp' },
    { file: 'jay-001.webp', caption: '19 July 1981. The world quietly received its best man.' },
    { file: 'jay-005.webp' },
    { file: 'jay-078.webp', caption: "8 December 2009, 9:00 PM. I showed up — and you've been my hero every second since." },
    { file: 'jay-074.webp' },
    { file: 'jay-076.webp' },
    { file: 'jay-075.webp' },
    { file: 'jay-026.webp' },
    { file: 'jay-033.webp', caption: 'Every second. Every minute. Every hour. Every day. Every month. Every year.' },
    { file: 'jay-011.webp' },
    { file: 'jay-008.webp' },
    { file: 'jay-017.webp' },
    { file: 'jay-030.webp', caption: 'You never asked for credit. So consider this website my way of giving it to you.' },
    { file: 'jay-014.webp' },
    { file: 'jay-020.webp' },
    { file: 'jay-032.webp' },
    { file: 'jay-045.webp', caption: 'The hard work nobody sees. The results everybody enjoys.' },
    { file: 'jay-040.webp' },
    { file: 'jay-038.webp' },
    { file: 'jay-042.webp', caption: 'You carry all of us. And you make it look easy.' },
    { file: 'jay-047.webp' },
    { file: 'jay-059.webp' },
    { file: 'jay-066.webp' },
    { file: 'jay-068.webp', caption: 'My teacher. My guide. My safe place. My best friend.' },
    { file: 'jay-062.webp' },
    { file: 'jay-084.webp' },
    { file: 'jay-082.webp' },
    { file: 'jay-060.webp', caption: "If I become even half the man you are, I'll call my life a success." },
    { file: 'jay-085.webp', caption: "Happy 45th, Papa. This one's for you." }
  ];

  var FRAME_MS = 4000;
  var LAST_FRAME_MS = 7000;
  var CROSSFADE_MS = 1100;

  var frameEls = [];
  var timers = [];
  var playing = false;
  var current = -1;

  function clearTimers() {
    timers.forEach(function (t) { clearTimeout(t); });
    timers = [];
  }

  function buildFrames() {
    framesHost.innerHTML = '';
    frameEls = SEQUENCE.map(function (item, i) {
      var div = document.createElement('div');
      div.className = 'film-frame' + (i % 2 === 1 ? ' kb-alt' : '');
      var img = document.createElement('img');
      img.alt = '';
      img.dataset.src = 'assets/img/med/' + item.file;
      div.appendChild(img);
      framesHost.appendChild(div);
      return div;
    });
  }

  function loadFrame(i) {
    if (i < 0 || i >= frameEls.length) return;
    var img = frameEls[i].querySelector('img');
    if (img.dataset.src) {
      img.src = img.dataset.src;
      delete img.dataset.src;
    }
  }

  function showFrame(i) {
    current = i;
    loadFrame(i);
    loadFrame(i + 1);
    frameEls.forEach(function (f, idx) { f.classList.toggle('is-active', idx === i); });
    // restart Ken Burns animation on the freshly active frame
    var img = frameEls[i].querySelector('img');
    img.style.animation = 'none';
    // eslint-disable-next-line no-unused-expressions
    img.offsetHeight;
    img.style.animation = '';

    var cap = SEQUENCE[i].caption;
    if (cap) {
      captionEl.textContent = cap;
      requestAnimationFrame(function () { captionEl.classList.add('is-visible'); });
    } else {
      captionEl.classList.remove('is-visible');
    }
  }

  function hideCaption() {
    captionEl.classList.remove('is-visible');
  }

  function totalDuration() {
    return (SEQUENCE.length - 1) * FRAME_MS + LAST_FRAME_MS;
  }

  function animateProgress() {
    var start = performance.now();
    var dur = totalDuration();
    function tick(now) {
      if (!playing) return;
      var pct = Math.min(100, ((now - start) / dur) * 100);
      progressBar.style.width = pct + '%';
      if (pct < 100) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function runSequence() {
    showFrame(0);
    animateProgress();
    for (var i = 1; i < SEQUENCE.length; i++) {
      (function (idx) {
        var at = (idx - 1) * FRAME_MS + (FRAME_MS - CROSSFADE_MS);
        timers.push(setTimeout(hideCaption, at));
        timers.push(setTimeout(function () { showFrame(idx); }, idx * FRAME_MS));
      })(i);
    }
    // Adjust timing to account for longer final hold
    timers.push(setTimeout(closeFilm, totalDuration() + 900));
  }

  function openFilm() {
    if (playing) return;
    playing = true;
    document.body.style.overflow = 'hidden';
    stage.hidden = false;
    buildFrames();

    if (!audio.src) {
      audio.src = 'assets/audio/warm-memories-keys-of-moon.mp3';
    }
    audio.currentTime = 0;
    var playPromise = audio.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(function () { /* autoplay-with-gesture should succeed; ignore otherwise */ });
    }

    runSequence();
  }

  function closeFilm() {
    if (!playing) return;
    playing = false;
    clearTimers();
    stage.hidden = true;
    document.body.style.overflow = '';
    progressBar.style.width = '0%';
    hideCaption();
    audio.pause();
    playBtn.focus();
  }

  playBtn.addEventListener('click', openFilm);
  skipBtn.addEventListener('click', closeFilm);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && playing) closeFilm();
  });
})();
