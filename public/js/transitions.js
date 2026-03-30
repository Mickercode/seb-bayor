// ============================================
// Page Transitions — progress bar + fade + scroll reveal
// ============================================

(function () {
  // 1. Create the progress bar element
  const loader = document.createElement('div');
  loader.id = 'page-loader';
  document.body.prepend(loader);

  // 2. Intercept internal link clicks for smooth transition
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Skip external links, anchors, new-tab links, and non-http
    if (
      link.target === '_blank' ||
      link.hasAttribute('download') ||
      href.startsWith('#') ||
      href.startsWith('http') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('whatsapp:') ||
      href.startsWith('javascript:')
    ) return;

    // Skip if modifier keys are held (open in new tab, etc.)
    if (e.ctrlKey || e.metaKey || e.shiftKey) return;

    e.preventDefault();

    // Show progress bar
    loader.classList.remove('done');
    loader.classList.add('active');

    // Fade out current page
    document.body.style.transition = 'opacity 0.15s ease-out';
    document.body.style.opacity = '0';

    // Navigate after short delay
    setTimeout(function () {
      window.location.href = href;
    }, 150);
  });

  // 3. Mark loader as done when page is fully loaded (covers back/forward nav)
  window.addEventListener('pageshow', function () {
    loader.classList.remove('active');
    loader.classList.add('done');
  });

  // 4. Scroll-reveal observer for sections
  function initScrollReveal() {
    const sections = document.querySelectorAll('section');
    if (!sections.length) return;

    // Add reveal class to sections (skip the first/hero)
    sections.forEach(function (section, i) {
      if (i === 0) return; // Don't animate hero — it should be instantly visible
      section.classList.add('reveal');
    });

    // Intersection Observer
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );

      document.querySelectorAll('.reveal').forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback: just show everything
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }

  // Run scroll reveal after DOM + scripts are ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      // Small delay to let other scripts render content first
      setTimeout(initScrollReveal, 100);
    });
  } else {
    setTimeout(initScrollReveal, 100);
  }
})();
