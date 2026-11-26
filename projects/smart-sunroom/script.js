(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.querySelector('#contents-toggle');
  const panel = document.querySelector('#contents-panel');
  const closeMenu = () => { panel.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.querySelector('span').textContent = '+'; };
  toggle.addEventListener('click', () => { const open = panel.hidden; panel.hidden = !open; toggle.setAttribute('aria-expanded', String(open)); toggle.querySelector('span').textContent = open ? '−' : '+'; });
  document.addEventListener('click', event => { if (!event.target.closest('.reading-tools')) closeMenu(); });
  panel.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { closeMenu(); document.querySelector(link.hash)?.focus({ preventScroll: true }); }));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !panel.hidden) { closeMenu(); toggle.focus(); } });
  const chapters = [...document.querySelectorAll('.figma-section')];
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      panel.querySelectorAll('a').forEach(a => { if (a.hash === '#' + entry.target.id) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
    }
  }, { rootMargin: '-5% 0px -70% 0px', threshold: 0 });
  chapters.forEach(section => { section.tabIndex = -1; observer.observe(section); });
  if (!reducedMotion.matches) {
    document.querySelector('#overview').classList.add('entrance');
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.remove('reveal-pending'); reveal.unobserve(entry.target); } }), { rootMargin: '0px 0px 80px', threshold: .03 });
    document.querySelectorAll('section > .section-title').forEach(title => { title.classList.add('reveal-ready', 'reveal-pending'); reveal.observe(title); });
  }
  const viewer = document.querySelector('#image-viewer');
  const viewerImage = viewer.querySelector('img');
  let returnFocus;
  function inspect(image) { returnFocus = document.activeElement; viewerImage.src = image.src; viewerImage.alt = image.alt; viewer.showModal(); }
  document.querySelectorAll('.inspect-image').forEach(image => {
    image.tabIndex = 0; image.setAttribute('role', 'button'); image.setAttribute('aria-label', 'Enlarge: ' + image.alt);
    image.addEventListener('click', () => inspect(image));
    image.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); inspect(image); } });
  });
  viewer.querySelector('button').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
  viewer.addEventListener('close', () => returnFocus?.focus({ preventScroll: true }));
  const video = document.querySelector('#sunroom-film');
  const playButton = document.querySelector('.film-play');
  if (!video || !playButton) return
  playButton.addEventListener('click', async () => { try { await video.play(); } catch { video.controls = true; video.focus(); } });
  video.addEventListener('play', () => { playButton.hidden = true; });
  video.addEventListener('pause', () => { playButton.hidden = false; });
  video.addEventListener('ended', () => { playButton.hidden = false; });
  video.addEventListener('error', () => { document.querySelector('.media-error').hidden = false; playButton.hidden = true; });
})();
