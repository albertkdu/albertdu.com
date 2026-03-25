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
    var thumbImg = item.querySelector('img');
    if (!thumbImg) return;
    current = index;

    var fullSrc = item.dataset.full || thumbImg.src;
    imgEl.alt = thumbImg.alt || '';
    if (counter) counter.textContent = (index + 1) + ' / ' + items.length;

    // Show thumbnail immediately, swap to full-res once loaded
    imgEl.src = thumbImg.src;
    imgEl.style.filter = 'blur(4px)';
    imgEl.style.transition = 'filter 0.3s';

    var fullImg = new Image();
    fullImg.onload = function () {
      if (current === index) {
        imgEl.src = fullSrc;
        imgEl.style.filter = '';
      }
    };
    fullImg.src = fullSrc;
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

/* ============================================================
   INTEREST CARDS — holographic 3D tilt
   ============================================================ */
(function () {
  var cards = document.querySelectorAll('.interest-card');
  if (!cards.length) return;

  cards.forEach(function (card) {
    var raf = null;

    card.addEventListener('mousemove', function (e) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = null;
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width  - 0.5;  // -0.5 to 0.5
        var y = (e.clientY - rect.top)  / rect.height - 0.5;

        card.style.transform =
          'perspective(700px) rotateX(' + (-y * 14) + 'deg) rotateY(' + (x * 14) + 'deg) translateZ(6px)';

        card.style.setProperty('--holo-x', ((x + 0.5) * 100).toFixed(1) + '%');
        card.style.setProperty('--holo-y', ((y + 0.5) * 100).toFixed(1) + '%');

        card.style.boxShadow =
          (x * 10) + 'px ' + (y * 10) + 'px 28px rgba(123,92,191,0.18),' +
          '0 4px 16px rgba(123,92,191,0.10)';

        card.classList.add('holo-active');
      });
    });

    card.addEventListener('mouseleave', function () {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      card.style.transform  = '';
      card.style.boxShadow  = '';
      card.classList.remove('holo-active');
    });
  });
})();

/* ============================================================
   MARQUEE — fill track to cover all screen widths seamlessly
   ============================================================ */
(function () {
  function fillMarquee() {
    var track = document.querySelector('.marquee-track');
    if (!track) return;

    var totalChildren = track.children.length;
    // HTML ships 2 identical sets; one set = half the track width
    var oneSetWidth = track.scrollWidth / 2;
    if (oneSetWidth <= 0) return;

    // Clone until the track covers at least 3× the viewport width
    var target   = window.innerWidth * 3;
    var sets     = 2;
    var originals = Array.prototype.slice.call(track.children, 0, totalChildren / 2);

    while (sets * oneSetWidth < target) {
      originals.forEach(function (el) {
        track.appendChild(el.cloneNode(true));
      });
      sets++;
    }

    // Pin animation distance to exactly one original set in px so scroll
    // speed stays consistent regardless of how many copies were appended.
    track.style.setProperty('--marquee-offset', '-' + oneSetWidth + 'px');
  }

  // Wait for fonts so scrollWidth reflects actual rendered text widths
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fillMarquee);
  } else {
    window.addEventListener('load', fillMarquee);
  }
})();
