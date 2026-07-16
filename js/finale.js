/* Finale — 45 candles on a stylized cake; blow them out; confetti + final message. */
(function () {
  var candlesHost = document.getElementById('cakeCandles');
  var blowBtn = document.getElementById('blowBtn');
  var stage = document.getElementById('finaleStage');
  var message = document.getElementById('finaleMessage');
  var confettiCanvas = document.getElementById('finaleConfetti');
  if (!candlesHost || !blowBtn) return;

  var CANDLE_COUNT = 45;
  var candles = [];
  for (var i = 0; i < CANDLE_COUNT; i++) {
    var c = document.createElement('span');
    c.className = 'candle';
    candlesHost.appendChild(c);
    candles.push(c);
  }

  function sizeCanvas() {
    var rect = document.getElementById('finale').getBoundingClientRect();
    confettiCanvas.style.width = rect.width + 'px';
    confettiCanvas.style.height = rect.height + 'px';
  }

  function blowOutCandles() {
    blowBtn.disabled = true;
    blowBtn.textContent = 'Blowing out the candles…';
    var order = candles.slice();
    // shuffle for a natural cascade rather than a strict left-to-right sweep
    for (var i = order.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = order[i]; order[i] = order[j]; order[j] = tmp;
    }
    order.forEach(function (c, idx) {
      setTimeout(function () { c.classList.add('is-out'); }, idx * 45);
    });

    setTimeout(function () {
      sizeCanvas();
      fireConfetti(confettiCanvas, { count: 170, duration: 3200 });
      stage.classList.add('is-hidden');
      message.hidden = false;
      requestAnimationFrame(function () { message.classList.add('is-visible'); });
      message.setAttribute('tabindex', '-1');
      message.focus({ preventScroll: true });
    }, order.length * 45 + 500);
  }

  blowBtn.addEventListener('click', blowOutCandles);
  window.addEventListener('resize', sizeCanvas);
})();
