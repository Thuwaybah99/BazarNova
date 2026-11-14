(() => {
  const button = document.getElementById('menuToggle');
  const nav = document.getElementById('siteNav');
  if (button && nav) {
    button.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open'); button.setAttribute('aria-expanded', 'false');
    }));
  }
  const frames = [...document.querySelectorAll('.viz-frame iframe[data-src]')];
  const load = frame => {
    if (!frame.src || frame.src === location.href) frame.src = frame.dataset.src;
    const wrapper = frame.closest('.viz-frame');
    frame.addEventListener('load', () => wrapper?.classList.add('loaded'), { once:true });
    // The loading message is not evidence of chart availability; Tableau may restrict embeds.
  };
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { load(entry.target); obs.unobserve(entry.target); }
    }), {rootMargin:'600px 0px'});
    frames.forEach(f=>obs.observe(f));
  } else frames.forEach(load);
})();
