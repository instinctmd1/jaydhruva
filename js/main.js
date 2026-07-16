/* Generic scroll-reveal for letter paragraphs, roles, spec card, salesman, family wall. */
(function () {
  document.documentElement.classList.remove('no-js');

  var targets = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window) || !targets.length) {
    targets.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  targets.forEach(function (el) { io.observe(el); });
})();
