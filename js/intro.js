/* Ignition intro gate: push-start button -> ignite flash -> odometer 0-45 -> headline + confetti -> dismiss */
(function () {
  var gate = document.getElementById('gate');
  var main = document.getElementById('main');
  var footer = document.querySelector('.site-footer');
  var siteMark = document.querySelector('.site-mark');
  if (!gate) return;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.body.classList.add('gate-open');
  if ('inert' in HTMLElement.prototype) {
    if (main) main.inert = true;
    if (footer) footer.inert = true;
  }

  var ignitionBtn = document.getElementById('ignitionBtn');
  var gateFlash = document.getElementById('gateFlash');
  var stageStart = document.getElementById('gateStageStart');
  var stageReveal = document.getElementById('gateStageReveal');
  var odoTens = document.getElementById('odoTens');
  var odoUnits = document.getElementById('odoUnits');
  var headline = document.getElementById('gateHeadline');
  var sub = document.getElementById('gateSub');
  var continueBtn = document.getElementById('gateContinue');
  var confettiCanvas = document.getElementById('confettiCanvas');

  var dismissed = false;
  var autoDismissTimer = null;

  function buildReel(windowEl, target, cycles) {
    windowEl.innerHTML = '';
    var reel = document.createElement('div');
    reel.className = 'odometer-reel';
    var totalRows = cycles * 10 + target + 1;
    for (var i = 0; i < totalRows; i++) {
      var d = document.createElement('span');
      d.className = 'odometer-digit';
      d.textContent = String(i % 10);
      reel.appendChild(d);
    }
    windowEl.appendChild(reel);
    return reel;
  }

  function spinOdometer() {
    var tensReel = buildReel(odoTens, 4, reduceMotion ? 0 : 3);
    var unitsReel = buildReel(odoUnits, 5, reduceMotion ? 0 : 4);

    // Force layout before animating.
    // eslint-disable-next-line no-unused-expressions
    tensReel.getBoundingClientRect();

    requestAnimationFrame(function () {
      var digitH = odoTens.getBoundingClientRect().height;
      var tensRows = tensReel.children.length;
      var unitsRows = unitsReel.children.length;
      tensReel.style.transform = 'translateY(-' + ((tensRows - 1) * digitH) + 'px)';
      unitsReel.style.transitionDelay = reduceMotion ? '0ms' : '120ms';
      unitsReel.style.transform = 'translateY(-' + ((unitsRows - 1) * digitH) + 'px)';
    });
  }

  function sizeConfettiCanvas() {
    if (!confettiCanvas) return;
    var rect = gate.getBoundingClientRect();
    confettiCanvas.style.width = rect.width + 'px';
    confettiCanvas.style.height = rect.height + 'px';
  }

  function dismissGate() {
    if (dismissed) return;
    dismissed = true;
    clearTimeout(autoDismissTimer);
    gate.setAttribute('data-dismissed', 'true');
    document.body.classList.remove('gate-open');
    if ('inert' in HTMLElement.prototype) {
      if (main) main.inert = false;
      if (footer) footer.inert = false;
    }
    if (siteMark) siteMark.classList.add('is-visible');
    setTimeout(function () {
      gate.setAttribute('hidden', '');
      var hero = document.getElementById('hero');
      if (hero) {
        var h1 = hero.querySelector('h1');
        if (h1) {
          h1.setAttribute('tabindex', '-1');
          h1.focus({ preventScroll: true });
        }
      }
    }, 750);
  }

  function runSequence() {
    ignitionBtn.disabled = true;
    ignitionBtn.classList.add('is-pressed');

    gateFlash.classList.add('is-igniting');

    setTimeout(function () {
      stageStart.hidden = true;
      stageReveal.hidden = false;
      sizeConfettiCanvas();
      spinOdometer();
    }, 260);

    var odometerSettle = reduceMotion ? 200 : 1700;

    setTimeout(function () {
      headline.classList.add('is-visible');
      sub.classList.add('is-visible');
      fireConfetti(confettiCanvas, { count: reduceMotion ? 0 : 150, originY: confettiCanvas.getBoundingClientRect().height * 0.4 });
    }, 260 + odometerSettle);

    setTimeout(function () {
      continueBtn.classList.add('is-visible');
      autoDismissTimer = setTimeout(dismissGate, 4200);
    }, 260 + odometerSettle + 500);
  }

  ignitionBtn.addEventListener('click', runSequence);
  continueBtn.addEventListener('click', dismissGate);
  stageReveal.addEventListener('click', function (e) {
    if (e.target === continueBtn) return;
    if (continueBtn.classList.contains('is-visible')) dismissGate();
  });

  window.addEventListener('resize', function () {
    if (!dismissed) sizeConfettiCanvas();
  });
})();
