/* Shared confetti engine — brand palette only. Canvas-based, no dependencies. */
(function () {
  var PALETTE = [
    { color: '#C9A961', weight: 35 }, // champagne
    { color: '#E8D9B5', weight: 35 }, // champagne-light
    { color: '#F3EEE2', weight: 20 }, // cream
    { color: '#B32A32', weight: 10 }  // taillight-red (sparing)
  ];

  function pickColor() {
    var total = PALETTE.reduce(function (s, p) { return s + p.weight; }, 0);
    var r = Math.random() * total;
    for (var i = 0; i < PALETTE.length; i++) {
      if (r < PALETTE[i].weight) return PALETTE[i].color;
      r -= PALETTE[i].weight;
    }
    return PALETTE[0].color;
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function fireConfetti(canvas, opts) {
    if (!canvas) return;
    opts = opts || {};
    var count = opts.count || 130;
    var duration = opts.duration || 2600;

    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    var w = rect.width, h = rect.height;

    if (prefersReducedMotion()) {
      // Minimal static acknowledgement instead of a full animation loop.
      ctx.clearRect(0, 0, w, h);
      for (var s = 0; s < 24; s++) {
        ctx.fillStyle = pickColor();
        ctx.globalAlpha = 0.7;
        ctx.fillRect(Math.random() * w, h * 0.35 + Math.random() * h * 0.2, 5, 8);
      }
      setTimeout(function () { ctx.clearRect(0, 0, w, h); }, 900);
      return;
    }

    var originX = opts.originX != null ? opts.originX : w / 2;
    var originY = opts.originY != null ? opts.originY : h * 0.42;

    var particles = [];
    for (var i = 0; i < count; i++) {
      var angle = (Math.random() * Math.PI) + Math.PI; // upward-ish spread
      var speed = 3 + Math.random() * 7;
      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        vy: -Math.abs(Math.sin(angle) * speed) - 2,
        size: 4 + Math.random() * 5,
        color: pickColor(),
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
        gravity: 0.16 + Math.random() * 0.08,
        drag: 0.992,
        shape: Math.random() > 0.5 ? 'rect' : 'circle'
      });
    }

    var start = performance.now();
    function frame(now) {
      var elapsed = now - start;
      ctx.clearRect(0, 0, w, h);
      var alive = false;
      particles.forEach(function (p) {
        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y < h + 20) alive = true;
        var fade = Math.max(0, 1 - elapsed / duration);
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
      if (elapsed < duration && alive) {
        requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    }
    requestAnimationFrame(frame);
  }

  window.fireConfetti = fireConfetti;
})();
