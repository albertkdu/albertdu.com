/* ============================================================
   main.js — Albert Du personal site
   ============================================================ */

'use strict';

/* ============================================================
   PAGE LOADER
   ============================================================ */
(function () {
  var loader = document.getElementById('page-loader');
  if (!loader) return;

  function dismissLoader() {
    loader.classList.add('done');
    loader.addEventListener('transitionend', function handler() {
      loader.removeEventListener('transitionend', handler);
      loader.remove();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(dismissLoader, 850);
    });
  } else {
    setTimeout(dismissLoader, 850);
  }
})();

/* ============================================================
   PAGE TRANSITIONS (exit fade)
   ============================================================ */
(function () {
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('http') ||
      href.startsWith('mailto') ||
      href.startsWith('tel') ||
      link.hasAttribute('target') ||
      link.hasAttribute('download')
    ) return;

    e.preventDefault();
    document.body.classList.add('leaving');
    setTimeout(function () { window.location.href = href; }, 300);
  });
})();

/* ============================================================
   NAVIGATION — scroll class + hamburger
   ============================================================ */
(function () {
  var nav = document.querySelector('.nav');
  if (!nav) return;

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var toggle = nav.querySelector('.nav-toggle');
  var mobileMenu = nav.querySelector('.nav-mobile');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      var open = toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });

    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();

/* ============================================================
   SCROLL SPY
   ============================================================ */
(function () {
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"], .nav-mobile a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(function (s) { observer.observe(s); });
})();

/* ============================================================
   HERO TEXT — word-by-word reveal
   (delays account for loader duration ~0.85s)
   ============================================================ */
(function () {
  var titleEl = document.querySelector('.hero-title');
  if (!titleEl) return;

  var words = titleEl.textContent.trim().split(' ');
  titleEl.innerHTML = words.map(function (word, i) {
    var delay = (0.98 + i * 0.16).toFixed(2);
    return '<span class="hero-word" style="animation-delay:' + delay + 's">' + word + '</span>';
  }).join(' ');
})();

/* ============================================================
   HERO BACKGROUND — subtle mouse parallax
   ============================================================ */
(function () {
  var hero = document.querySelector('.hero');
  var orbs = document.querySelectorAll('.hero-orb');
  var decos = document.querySelectorAll('.hero-deco');
  if (!hero || (!orbs.length && !decos.length)) return;

  var mouseX = 0, mouseY = 0;
  var raf = null;

  hero.addEventListener('mousemove', function (e) {
    var rect = hero.getBoundingClientRect();
    // Normalised -0.5 to 0.5
    mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    mouseY = (e.clientY - rect.top)  / rect.height - 0.5;

    if (!raf) {
      raf = requestAnimationFrame(function () {
        raf = null;
        orbs.forEach(function (orb, i) {
          var strength = (i + 1) * 10;
          orb.style.transform = 'translate(' + (mouseX * strength) + 'px, ' + (mouseY * strength) + 'px)';
        });
        decos.forEach(function (d, i) {
          var s = (i + 1) * 6;
          d.style.transform = 'translate(' + (-mouseX * s) + 'px, ' + (-mouseY * s) + 'px)';
        });
      });
    }
  });

  hero.addEventListener('mouseleave', function () {
    orbs.forEach(function (orb) { orb.style.transform = ''; });
    decos.forEach(function (d)   { d.style.transform = '';   });
  });
})();

/* ============================================================
   SCROLL ANIMATIONS — IntersectionObserver fade-up
   ============================================================ */
(function () {
  var els = document.querySelectorAll('.fade-up');
  if (!els.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  els.forEach(function (el) { observer.observe(el); });
})();

/* ============================================================
   PHOTOGRAPHY PAGE NAV — scrolled class
   ============================================================ */
(function () {
  var nav = document.querySelector('.photo-page-nav');
  if (!nav) return;

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ============================================================
   TEXTS MODAL (tutoring texts list)
   ============================================================ */
(function () {
  var trigger = document.querySelector('.texts-trigger');
  var overlay = document.getElementById('texts-modal');
  if (!trigger || !overlay) return;

  var closeBtn = overlay.querySelector('.modal-close');

  function openModal() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    overlay.focus();
  }

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    trigger.focus();
  }

  trigger.addEventListener('click', openModal);
  trigger.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Click outside modal content to close
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
  });

  overlay.setAttribute('tabindex', '-1');
})();

/* ============================================================
   LIGHTBOX
   ============================================================ */
(function () {
  var lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;

  var imgEl    = lightbox.querySelector('.lightbox-img-wrap img');
  var closeBtn = lightbox.querySelector('.lightbox-close');
  var prevBtn  = lightbox.querySelector('.lightbox-prev');
  var nextBtn  = lightbox.querySelector('.lightbox-next');
  var counter  = lightbox.querySelector('.lightbox-counter');

  var items   = Array.from(document.querySelectorAll('.gallery-item'));
  var current = 0;

  function show(index) {
    var item = items[index];
    if (!item) return;
    var img = item.querySelector('img');
    if (!img) return;
    current = index;
    imgEl.src = img.src;
    imgEl.alt = img.alt || '';
    if (counter) counter.textContent = (index + 1) + ' / ' + items.length;
  }

  function open(index) {
    show(index);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    lightbox.focus();
  }

  function close() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    imgEl.src = '';
  }

  function prev() { show((current - 1 + items.length) % items.length); }
  function next() { show((current + 1) % items.length); }

  items.forEach(function (item, i) {
    item.addEventListener('click', function () { open(i); });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'View photo ' + (i + 1));
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (prevBtn)  prevBtn.addEventListener('click', prev);
  if (nextBtn)  nextBtn.addEventListener('click', next);

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });

  var touchStartX = 0;
  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { if (dx < 0) next(); else prev(); }
  }, { passive: true });

  lightbox.setAttribute('tabindex', '-1');
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Photo lightbox');
})();
