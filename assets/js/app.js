// «Дента-Люкс» — слайдер отзывов, счётчики, навигация, форма
(function () {
  'use strict';

  // Шапка
  var nav = document.getElementById('nav');
  var onScroll = function () { nav.classList.toggle('nav--solid', window.scrollY > 40); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Мобильное меню
  var burger = document.getElementById('burger');
  var links = document.getElementById('navLinks');
  if (burger && links) {
    burger.addEventListener('click', function () {
      nav.classList.toggle('nav--open');
      links.classList.toggle('nav__links--open');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('nav--open');
        links.classList.remove('nav__links--open');
      }
    });
  }

  // Появление блоков
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('reveal--in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.14 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // Счётчики
  var counters = document.querySelectorAll('[data-count]');
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      cio.unobserve(el);
      var target = parseInt(el.getAttribute('data-count'), 10);
      var t0 = null;
      var dur = 1600;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = Math.round(target * eased);
        el.textContent = val.toLocaleString('ru-RU');
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  counters.forEach(function (el) { cio.observe(el); });

  // Слайдер отзывов
  var track = document.getElementById('sliderTrack');
  if (track) {
    var slides = track.children.length;
    var dotsBox = document.getElementById('dots');
    var idx = 0;
    for (var i = 0; i < slides; i++) {
      var d = document.createElement('i');
      d.setAttribute('data-i', i);
      if (i === 0) d.className = 'on';
      d.addEventListener('click', function () { go(+this.getAttribute('data-i')); });
      dotsBox.appendChild(d);
    }
    function go(n) {
      idx = (n + slides) % slides;
      track.style.transform = 'translateX(-' + idx * 100 + '%)';
      dotsBox.querySelectorAll('i').forEach(function (d, j) { d.className = j === idx ? 'on' : ''; });
    }
    document.getElementById('prev').addEventListener('click', function () { go(idx - 1); resetAuto(); });
    document.getElementById('next').addEventListener('click', function () { go(idx + 1); resetAuto(); });
    var auto = setInterval(function () { go(idx + 1); }, 6000);
    function resetAuto() { clearInterval(auto); auto = setInterval(function () { go(idx + 1); }, 6000); }
  }

  // Демо-форма
  var form = document.getElementById('bookForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      form.classList.add('form--done');
      form.querySelectorAll('input, select, textarea, button').forEach(function (el) { el.disabled = true; });
    });
  }
})();
