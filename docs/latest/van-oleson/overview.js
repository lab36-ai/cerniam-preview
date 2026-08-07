(() => {
  const body = document.body;
  const hero = document.querySelector('.hero');
  const chapters = [...document.querySelectorAll('.chapter')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!hero || !chapters.length) return;

  const stickyOffset = () => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue('--sticky-offset')
      .trim();
    return Number.parseFloat(value) || 124;
  };

  const documentTop = (element) => {
    let top = 0;
    let node = element;
    while (node) {
      top += node.offsetTop;
      node = node.offsetParent;
    }
    return top;
  };

  const updateIdentity = () => {
    const threshold = hero.offsetTop + hero.offsetHeight - stickyOffset();
    body.classList.toggle('identity-visible', window.scrollY >= threshold);
  };

  const chapterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('chapter-entered');
    });
  }, {
    rootMargin: `-${stickyOffset()}px 0px -42% 0px`,
    threshold: 0.04,
  });

  chapters.forEach((chapter) => chapterObserver.observe(chapter));
  hero.classList.add('chapter-entered');
  requestAnimationFrame(() => body.classList.add('transitions-ready'));

  document.querySelectorAll('a[href^="#"]:not(.skip-link)').forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      const behavior = reducedMotion.matches ? 'auto' : 'smooth';
      const top = Math.max(0, documentTop(target) - stickyOffset());
      window.scrollTo({ top, behavior });
      window.setTimeout(updateIdentity, reducedMotion.matches ? 0 : 720);
      history.pushState(null, '', id);
    });
  });

  window.addEventListener('scroll', updateIdentity, { passive: true });
  window.addEventListener('resize', updateIdentity, { passive: true });
  updateIdentity();
})();
