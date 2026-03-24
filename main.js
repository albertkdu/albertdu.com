/* ============================================================
   main.js — Albert Du personal site
   Shared across all pages
   ============================================================ */

'use strict';

/* ============================================================
   PAGE TRANSITIONS
   ============================================================ */
(function () {
  // Fade in on load
  document.addEventListener('DOMContentLoaded', function () {
    requestAnimationFrame(function () {
      document.body.classList.add('loaded');
    });
  });

  // Fade out on internal link navigation
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    // Only intercept internal page links
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
    setTimeout(function () {
      window.location.href = href;
    }, 300);
  });
})();

/* ============================================================
   NAVIGATION — scroll class + hamburger
   ============================================================ */
(function () {
  var nav = document.querySelector('.nav');
  if (!nav) return;

  // Scrolled class
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  var toggle = nav.querySelector('.nav-toggle');
  var mobileMenu = nav.querySelector('.nav-mobile');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      var open = toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });

    // Close on mobile link click
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
   SCROLL SPY — highlight active nav link
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
          var match = link.getAttribute('href') === '#' + id;
          link.classList.toggle('active', match);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(function (s) { observer.observe(s); });
})();

/* ============================================================
   HERO TEXT — word-by-word reveal
   ============================================================ */
(function () {
  var titleEl = document.querySelector('.hero-title');
  if (!titleEl) return;

  var raw = titleEl.textContent.trim();
  var words = raw.split(' ');
  titleEl.innerHTML = words.map(function (word, i) {
    var delay = (0.3 + i * 0.18).toFixed(2);
    return '<span class="hero-word" style="animation-delay:' + delay + 's">' + word + '</span>';
  }).join(' ');
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
   LIGHTBOX
   ============================================================ */
(function () {
  var lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;

  var imgWrap   = lightbox.querySelector('.lightbox-img-wrap');
  var imgEl     = lightbox.querySelector('.lightbox-img-wrap img');
  var closeBtn  = lightbox.querySelector('.lightbox-close');
  var prevBtn   = lightbox.querySelector('.lightbox-prev');
  var nextBtn   = lightbox.querySelector('.lightbox-next');
  var counter   = lightbox.querySelector('.lightbox-counter');

  var items    = Array.from(document.querySelectorAll('.gallery-item'));
  var current  = 0;

  function getMediaForItem(item) {
    var img = item.querySelector('img');
    return img ? { src: img.src, alt: img.alt || '' } : null;
  }

  function show(index) {
    var item = items[index];
    if (!item) return;
    var media = getMediaForItem(item);
    if (!media) return;

    current = index;
    imgEl.src = media.src;
    imgEl.alt = media.alt;
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

  // Open on item click
  items.forEach(function (item, i) {
    item.addEventListener('click', function () { open(i); });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'View photo ' + (i + 1));
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(i);
      }
    });
  });

  // Controls
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (prevBtn)  prevBtn.addEventListener('click', prev);
  if (nextBtn)  nextBtn.addEventListener('click', next);

  // Click outside image to close
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   prev();
    if (e.key === 'ArrowRight')  next();
  });

  // Touch/swipe support
  var touchStartX = 0;
  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) next();
      else prev();
    }
  }, { passive: true });

  // Make lightbox focusable for keyboard
  lightbox.setAttribute('tabindex', '-1');
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Photo lightbox');
})();
