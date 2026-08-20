/* ─── script.js (cleaned, duplicates removed) ─── */

// ── THEME ──
const themeBtn = document.getElementById('themeBtn'),
  body = document.body;
function applyTheme(l) {
  body.classList.toggle('light', l);
  themeBtn.querySelector('i').className = l ? 'fas fa-moon' : 'fas fa-sun';
  themeBtn.setAttribute('aria-label', l ? 'Switch to dark theme' : 'Switch to light theme');
}
const savedTheme = localStorage.getItem('theme');
if (savedTheme) applyTheme(savedTheme === 'light');
else applyTheme(false);

themeBtn.addEventListener('click', () => {
  const l = !body.classList.contains('light');
  applyTheme(l);
  localStorage.setItem('theme', l ? 'light' : 'dark');
});

// ── MOBILE NAV ──
const hamburger = document.getElementById('hamburger'),
  mobileNav = document.getElementById('mobileNav');
hamburger.addEventListener('click', e => {
  e.stopPropagation();
  const o = mobileNav.classList.toggle('open');
  hamburger.querySelector('i').className = o ? 'fas fa-times' : 'fas fa-bars';
  hamburger.setAttribute('aria-expanded', String(o));
  hamburger.setAttribute('aria-label', o ? 'Close navigation menu' : 'Open navigation menu');
});
document.addEventListener('click', e => {
  if (!mobileNav.contains(e.target) && !hamburger.contains(e.target)) {
    mobileNav.classList.remove('open');
    hamburger.querySelector('i').className = 'fas fa-bars';
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
  }
});
window.closeMobile = () => {
  mobileNav.classList.remove('open');
  hamburger.querySelector('i').className = 'fas fa-bars';
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Open navigation menu');
};

// ── ACTIVE NAV ──
const sections = document.querySelectorAll('section[id]'),
  navLinks = document.querySelectorAll('.nav-links a');
const sectObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (a) a.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => sectObs.observe(s));

// ── SCROLL PROGRESS ──
(function () {
  const progBar = document.getElementById('scroll-progress');
  if (!progBar) return;
  let ticking = false;
  function updateProgress() {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    progBar.style.width = Math.min(pct, 100) + '%';
    ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(updateProgress); ticking = true; } }, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();
})();

// ── CURSOR GLOW ──
(function () {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;
  let x = window.innerWidth / 2, y = window.innerHeight / 2, tx = x, ty = y, raf = null;
  function update() {
    x += (tx - x) * 0.08; y += (ty - y) * 0.08;
    glow.style.left = x + 'px'; glow.style.top = y + 'px';
    raf = requestAnimationFrame(update);
  }
  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  document.addEventListener('touchmove', e => { const t = e.touches[0]; if (t) { tx = t.clientX; ty = t.clientY; } }, { passive: true });
  update();
  window.addEventListener('beforeunload', () => { if (raf) cancelAnimationFrame(raf); });
})();

// ── TYPEWRITER ──
(function () {
  const roleElement = document.getElementById('roleWord');
  if (!roleElement) return;
  const roles = ['CSE Student.', 'Full-Stack Developer.', 'AI Researcher.', 'Problem Solver.'];
  let roleIndex = 0, charIndex = 0, isDeleting = false, currentText = '';
  function typeRole() {
    const full = roles[roleIndex];
    if (isDeleting) { currentText = full.substring(0, charIndex - 1); charIndex--; }
    else { currentText = full.substring(0, charIndex + 1); charIndex++; }
    roleElement.textContent = currentText;
    if (!isDeleting && charIndex === full.length) { isDeleting = true; setTimeout(typeRole, 1800); return; }
    if (isDeleting && charIndex === 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; setTimeout(typeRole, 300); return; }
    setTimeout(typeRole, isDeleting ? 60 : 100);
  }
  setTimeout(typeRole, 600);
})();

// ── STAT COUNTER (unified) ──
function animateCounter(el) {
  const targetRaw = el.getAttribute('data-target');
  const suffix = el.getAttribute('data-suffix') || '';
  if (!targetRaw) return;
  const target = parseFloat(targetRaw);
  if (isNaN(target)) return;
  const duration = 2000, start = performance.now();
  const isInt = Number.isInteger(target);
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    let current = target * eased;
    if (isInt) current = Math.round(current);
    else current = Math.round(current * 100) / 100;
    let display = current.toString();
    if (!isInt && targetRaw.includes('.')) {
      const decimals = targetRaw.split('.')[1].length;
      display = current.toFixed(decimals);
    }
    el.textContent = display + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else {
      let finalDisplay = target.toString();
      if (!isInt && targetRaw.includes('.')) {
        const decimals = targetRaw.split('.')[1].length;
        finalDisplay = target.toFixed(decimals);
      }
      el.textContent = finalDisplay + suffix;
    }
  }
  requestAnimationFrame(update);
}

// Observe stat elements with IntersectionObserver
const statEls = document.querySelectorAll('.stat-chip-num[data-target]');
if (statEls.length) {
  const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .5 });
  statEls.forEach(el => statObserver.observe(el));
} else {
  // fallback if already visible
  setTimeout(() => statEls.forEach(el => animateCounter(el)), 800);
}

// ── REVEAL ANIMATIONS ──
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('in'), i * 80);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: .08 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── PROJECT FILTER + SHOW MORE ──
(function () {
  const allCards = Array.from(document.querySelectorAll('.proj-card'));
  const showMoreWrap = document.getElementById('showMoreWrap');
  const showBtn = document.getElementById('showMoreBtn');
  const VISIBLE_DEFAULT = 6;
  let expanded = false, activeFilter = 'all';

  function render() {
    let shown = 0, hiddenByCollapse = 0;
    allCards.forEach(card => {
      const cat = card.dataset.category;
      const matchesFilter = activeFilter === 'all' || cat === activeFilter;
      if (!matchesFilter) { card.style.display = 'none'; return; }
      shown++;
      if (!expanded && shown > VISIBLE_DEFAULT) { card.style.display = 'none'; hiddenByCollapse++; }
      else { card.style.display = ''; card.style.animation = 'fadeUp .4s forwards'; }
    });
    const totalMatch = allCards.filter(c => activeFilter === 'all' || c.dataset.category === activeFilter).length;
    const visibleNow = Math.min(expanded ? totalMatch : VISIBLE_DEFAULT, totalMatch);
    const hint = document.querySelector('.show-more-hint');
    if (hint) hint.innerHTML = `Showing <span id="visibleCount">${visibleNow}</span> of ${totalMatch} projects`;
    if (totalMatch <= VISIBLE_DEFAULT || activeFilter !== 'all') {
      if (showMoreWrap) showMoreWrap.style.display = 'none';
    } else {
      if (showMoreWrap) showMoreWrap.style.display = '';
      const remaining = totalMatch - VISIBLE_DEFAULT;
      if (showBtn) {
        if (expanded) {
          showBtn.innerHTML = `<i class="fas fa-chevron-up btn-icon"></i> Show Less <span class="proj-count-pill">−${remaining}</span>`;
          showBtn.classList.add('expanded');
        } else {
          showBtn.innerHTML = `<i class="fas fa-chevron-down btn-icon"></i> Show More Projects <span class="proj-count-pill">+${remaining}</span>`;
          showBtn.classList.remove('expanded');
        }
      }
    }
  }

  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.dataset.filter;
      expanded = false;
      render();
    });
  });

  if (showBtn) {
    showBtn.addEventListener('click', () => {
      expanded = !expanded;
      render();
      if (!expanded) document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    });
  }
  render();
})();

// ── AVATAR FALLBACK ──
const avatarImg = document.getElementById('avatarImg'),
  avatarFallback = document.getElementById('avatarFallback');
if (avatarImg) {
  avatarImg.addEventListener('error', () => {
    avatarImg.style.display = 'none';
    if (avatarFallback) avatarFallback.style.display = 'flex';
  });
  if (avatarImg.complete && avatarImg.naturalWidth === 0) avatarImg.dispatchEvent(new Event('error'));
}

// ── BACK TO TOP ──
const backBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) backBtn.classList.add('show');
  else backBtn.classList.remove('show');
}, { passive: true });
backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── BD LIVE CLOCK ──
function updateClock() {
  const now = new Date();
  const bd = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }));
  const h = String(bd.getHours() % 12 || 12).padStart(2, '0');
  const m = String(bd.getMinutes()).padStart(2, '0');
  const s = String(bd.getSeconds()).padStart(2, '0');
  const ampm = bd.getHours() >= 12 ? 'PM' : 'AM';
  document.getElementById('bd-clock').textContent = `${h}:${m}:${s} ${ampm}`;
}
updateClock();
setInterval(updateClock, 1000);

// ── FLOATING CONTACT MENU ──
const floatToggle = document.getElementById('float-toggle'),
  floatMenu = document.getElementById('float-menu');
let floatOpen = false;
floatToggle.addEventListener('click', () => {
  floatOpen = !floatOpen;
  floatMenu.classList.toggle('open', floatOpen);
  floatToggle.innerHTML = floatOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-comment-dots"></i>';
  floatToggle.setAttribute('aria-expanded', String(floatOpen));
  floatToggle.setAttribute('aria-label', floatOpen ? 'Close quick contact menu' : 'Open quick contact menu');
});

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ── HERO 3D ORBIT (Three.js) – unchanged ──
(function () {
  const canvas = document.getElementById('hero3d');
  if (!canvas || typeof THREE === 'undefined') return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const wrap = document.querySelector('.avatar-wrap');
  if (!wrap) return;
  let width = wrap.clientWidth + 60, height = wrap.clientHeight + 60;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.z = 6;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height, false);

  function getCSSColor(varName, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    return v || fallback;
  }
  function makeWireframe(radius, colorHex, detail) {
    const geo = new THREE.IcosahedronGeometry(radius, detail);
    const edges = new THREE.EdgesGeometry(geo);
    const mat = new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: 0.55 });
    return new THREE.LineSegments(edges, mat);
  }
  const primaryColor = new THREE.Color(getCSSColor('--gold', '#fbbf24'));
  const secondaryColor = new THREE.Color(getCSSColor('--amber', '#f59e0b'));
  const outerShape = makeWireframe(2.6, primaryColor, 1);
  const innerShape = makeWireframe(1.7, secondaryColor, 0);
  scene.add(outerShape, innerShape);

  const starGeo = new THREE.BufferGeometry();
  const starCount = 60;
  const positions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const r = 3 + Math.random() * 1.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const starMat = new THREE.PointsMaterial({ color: primaryColor, size: 0.035, transparent: true, opacity: 0.7 });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  let mouseX = 0, mouseY = 0, curRotX = 0, curRotY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  function resize() {
    width = wrap.clientWidth + 60; height = wrap.clientHeight + 60;
    camera.aspect = width / height; camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }
  window.addEventListener('resize', resize);
  resize();

  const themeSyncObserver = new MutationObserver(() => {
    const newPrimary = new THREE.Color(getCSSColor('--gold', '#fbbf24'));
    const newSecondary = new THREE.Color(getCSSColor('--amber', '#f59e0b'));
    outerShape.material.color.copy(newPrimary);
    innerShape.material.color.copy(newSecondary);
    starMat.color.copy(newPrimary);
  });
  themeSyncObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  let raf = null;
  function animate() {
    raf = requestAnimationFrame(animate);
    outerShape.rotation.y += 0.0022; outerShape.rotation.x += 0.0009;
    innerShape.rotation.y -= 0.0032; innerShape.rotation.x += 0.0014;
    stars.rotation.y += 0.0006;
    curRotX += (mouseY * 0.25 - curRotX) * 0.04;
    curRotY += (mouseX * 0.25 - curRotY) * 0.04;
    scene.rotation.x = curRotX; scene.rotation.y = curRotY;
    renderer.render(scene, camera);
  }
  animate();

  const heroEl = document.getElementById('home');
  if (heroEl && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { if (!raf) animate(); }
        else if (raf) { cancelAnimationFrame(raf); raf = null; }
      });
    }, { threshold: 0.05 }).observe(heroEl);
  }
})();