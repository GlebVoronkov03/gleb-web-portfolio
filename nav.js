document.addEventListener('DOMContentLoaded', () => {
  const path = location.pathname.replace(/\\/g, '/');
  document.querySelectorAll('.nav-links a[data-nav]').forEach(a => {
    const key = a.getAttribute('data-nav');
    if (key === 'work' && path.includes('/projects')) a.classList.add('active');
    if (key === 'pubs' && path.includes('publications')) a.classList.add('active');
    if (key === 'about' && path.includes('about')) a.classList.add('active');
    if (key === 'home' && (path.endsWith('/') || path.endsWith('index.html') || path.endsWith('gleb-web-portfolio'))) {
      if (!path.includes('/projects') && !path.includes('about') && !path.includes('publications')) a.classList.add('active');
    }
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('reveal'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.case, .pub, .proof').forEach(el => io.observe(el));
});
