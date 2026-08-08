/* ── THEME ── */
const themeBtn = document.getElementById('themeBtn'), body = document.body;
function applyTheme(l) {
  body.classList.toggle('light', l);
  themeBtn.querySelector('i').className = l ? 'fas fa-moon' : 'fas fa-sun';
  themeBtn.setAttribute('aria-label', l ? 'Switch to dark theme' : 'Switch to light theme');
}
const savedTheme = localStorage.getItem('theme');
if (savedTheme) applyTheme(savedTheme === 'light'); else applyTheme(false);
themeBtn.addEventListener('click', () => { const l = !body.classList.contains('light'); applyTheme(l); localStorage.setItem('theme', l ? 'light' : 'dark'); });

/* ── MOBILE NAV ── */
const hamburger = document.getElementById('hamburger'), mobileNav = document.getElementById('mobileNav');
hamburger.addEventListener('click', e => {
  e.stopPropagation();
  const o = mobileNav.classList.toggle('open');
  hamburger.querySelector('i').className = o ? 'fas fa-times' : 'fas fa-bars';
  hamburger.setAttribute('aria-expanded', String(o));
  hamburger.setAttribute('aria-label', o ? 'Close navigation menu' : 'Open navigation menu');
});
document.addEventListener('click', e => { if (!mobileNav.contains(e.target) && !hamburger.contains(e.target)) { mobileNav.classList.remove('open'); hamburger.querySelector('i').className = 'fas fa-bars'; hamburger.setAttribute('aria-expanded', 'false'); hamburger.setAttribute('aria-label', 'Open navigation menu'); } });
window.closeMobile = () => { mobileNav.classList.remove('open'); hamburger.querySelector('i').className = 'fas fa-bars'; hamburger.setAttribute('aria-expanded', 'false'); hamburger.setAttribute('aria-label', 'Open navigation menu'); };

/* ── ACTIVE NAV ── */
const sections = document.querySelectorAll('section[id]'), navLinks = document.querySelectorAll('.nav-links a');
const sectObs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { navLinks.forEach(l => l.classList.remove('active')); const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`); if (a) a.classList.add('active'); } }); }, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => sectObs.observe(s));

/* ── SCROLL PROGRESS ── */
const progBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  progBar.style.width = pct + '%';
}, { passive: true });

/* ── CURSOR GLOW ── */
const glow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });

/* ── PARTICLES ── */
(function () {
  const cv = document.getElementById('particles-canvas');
  const ctx = cv.getContext('2d');
  let W, H, pts = [];
  function resize() { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; pts = Array.from({ length: 55 }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.5 + .5 })); }
  resize();
  window.addEventListener('resize', resize);
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const light = body.classList.contains('light');
    const pc = light ? 'rgba(108,99,255,' : 'rgba(108,99,255,';
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = pc + (light ? .12 : .25) + ')'; ctx.fill();
    });
    pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 110) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.strokeStyle = `rgba(108,99,255,${(1 - d / 110) * (light ? .06 : .14)})`; ctx.lineWidth = .7; ctx.stroke(); }
    }));
    requestAnimationFrame(draw);
  }
  draw();
})();


/* ── TYPEWRITER ── */
(function () {
  function makeTyper(elId, phrases, startDelay) {
    const el = document.getElementById(elId);
    let pi = 0, ci = 0, deleting = false, pause = false;
    function tick() {
      if (pause) { el.innerHTML = phrases[pi] + '<span class="tw-cur"></span>'; return; }
      const phrase = phrases[pi];
      const visible = phrase.slice(0, ci);
      el.innerHTML = visible + '<span class="tw-cur"></span>';
      if (!deleting) {
        ci++;
        if (ci > phrase.length) {
          ci = phrase.length;
          pause = true;
          setTimeout(() => { pause = false; deleting = true; tick(); }, 1800);
          return;
        }
      } else {
        ci--;
        if (ci < 0) {
          ci = 0;
          deleting = false;
          pi = (pi + 1) % phrases.length;
          setTimeout(tick, 400);
          return;
        }
      }
      setTimeout(tick, deleting ? 38 : 62);
    }
    setTimeout(tick, startDelay);
  }

  makeTyper('tw1', ['CSE Student.', 'Software Engineer.', 'Backend Developer.', 'AI Researcher.'], 900);
  makeTyper('tw2', ['scalable APIs & intelligent systems.', 'production-grade backends.', 'deep learning solutions.', 'full-stack web applications.'], 1200);
})();

/* ── COUNTER ANIMATION ── */
function animateCount(el) {
  const target = parseFloat(el.dataset.target), suffix = el.dataset.suffix || '';
  const isFloat = target % 1 !== 0;
  const dur = 1400, step = 16;
  let current = 0, elapsed = 0;
  const timer = setInterval(() => {
    elapsed += step;
    const progress = Math.min(elapsed / dur, 1);
    const eased = 1 - (1 - progress) ** 3;
    current = target * eased;
    el.textContent = (isFloat ? current.toFixed(2) : Math.round(current)) + suffix;
    if (progress >= 1) { el.textContent = (isFloat ? target.toFixed(2) : target) + suffix; clearInterval(timer); }
  }, step);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); counterObs.unobserve(e.target); } });
}, { threshold: .5 });
document.querySelectorAll('.stat-chip-num[data-target]').forEach(el => counterObs.observe(el));

/* ── REVEAL ANIMATIONS ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add('in'), i * 80); revealObs.unobserve(e.target); } });
}, { threshold: .08 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── SKILL BARS on scroll ── */
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      barObs.unobserve(e.target);
    }
  });
}, { threshold: .25 });
document.querySelectorAll('.skill-card').forEach(c => barObs.observe(c));

/* ── PROJECT FILTER + SHOW MORE ── */
(function () {
  const allCards = Array.from(document.querySelectorAll('.proj-card'));
  const showMoreWrap = document.getElementById('showMoreWrap');
  const showBtn = document.getElementById('showMoreBtn');
  const visibleSpan = document.getElementById('visibleCount');
  const VISIBLE_DEFAULT = 6;
  let expanded = false;
  let activeFilter = 'all';

  // Remove CSS-based hiding — JS controls everything
  allCards.forEach(c => c.classList.remove('hidden-proj'));

  function render() {
    let shown = 0;
    let hiddenByCollapse = 0;

    allCards.forEach((card, i) => {
      const cat = card.dataset.category;
      const matchesFilter = activeFilter === 'all' || cat === activeFilter;

      if (!matchesFilter) {
        card.style.display = 'none';
        return;
      }

      shown++;
      if (!expanded && shown > VISIBLE_DEFAULT) {
        card.style.display = 'none';
        hiddenByCollapse++;
      } else {
        card.style.display = '';
        card.style.animation = 'fadeUp .4s forwards';
      }
    });

    const totalMatch = allCards.filter(c =>
      activeFilter === 'all' || c.dataset.category === activeFilter
    ).length;

    const visibleNow = Math.min(expanded ? totalMatch : VISIBLE_DEFAULT, totalMatch);
    visibleSpan.textContent = visibleNow;

    if (totalMatch <= VISIBLE_DEFAULT || activeFilter !== 'all') {
      showMoreWrap.style.display = 'none';
    } else {
      showMoreWrap.style.display = '';
      const remaining = totalMatch - VISIBLE_DEFAULT;
      if (expanded) {
        showBtn.innerHTML = `<i class="fas fa-chevron-up btn-icon"></i> Show Less <span class="proj-count-pill">−${remaining}</span>`;
        showBtn.classList.add('expanded');
      } else {
        showBtn.innerHTML = `<i class="fas fa-chevron-down btn-icon"></i> Show More Projects <span class="proj-count-pill">+${remaining}</span>`;
        showBtn.classList.remove('expanded');
      }
      document.querySelector('.show-more-hint').innerHTML =
        `Showing <span id="visibleCount">${visibleNow}</span> of ${totalMatch} projects`;
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

  showBtn.addEventListener('click', () => {
    expanded = !expanded;
    render();
    if (!expanded) {
      document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    }
  });

  render();
})();

/* ── AVATAR FALLBACK ── */
const avatarImg = document.getElementById('avatarImg'), avatarFallback = document.getElementById('avatarFallback');
if (avatarImg) { avatarImg.addEventListener('error', () => { avatarImg.style.display = 'none'; if (avatarFallback) avatarFallback.style.display = 'flex'; }); if (avatarImg.complete && avatarImg.naturalWidth === 0) avatarImg.dispatchEvent(new Event('error')); }

/* ── BACK TO TOP ── */
const backBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => { if (window.scrollY > 400) backBtn.classList.add('show'); else backBtn.classList.remove('show'); }, { passive: true });
backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── BD LIVE CLOCK ── */
function updateClock() {
  const now = new Date();
  const bd = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }));
  const mm = String(bd.getMinutes()).padStart(2, '0');
  const ss = String(bd.getSeconds()).padStart(2, '0');
  const ampm = bd.getHours() >= 12 ? 'PM' : 'AM';
  const h12 = bd.getHours() % 12 || 12;
  document.getElementById('bd-clock').textContent = `${String(h12).padStart(2, '0')}:${mm}:${ss} ${ampm}`;
}
updateClock(); setInterval(updateClock, 1000);

/* ── FLOATING CONTACT MENU ── */
const floatToggle = document.getElementById('float-toggle'), floatMenu = document.getElementById('float-menu');
let floatOpen = false;
floatToggle.addEventListener('click', () => {
  floatOpen = !floatOpen;
  floatMenu.classList.toggle('open', floatOpen);
  floatToggle.innerHTML = floatOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-comment-dots"></i>';
  floatToggle.setAttribute('aria-expanded', String(floatOpen));
  floatToggle.setAttribute('aria-label', floatOpen ? 'Close quick contact menu' : 'Open quick contact menu');
});

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ── CONTACT FORM ── */
(function () {
  // TODO: replace with your real Formspree endpoint, e.g. https://formspree.io/f/xxxxxxxx
  const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

  const form = document.getElementById('contactForm');
  if (!form) return; // graceful no-op if section markup isn't present

  const submitBtn = document.getElementById('cfSubmitBtn');
  const submitIcon = document.getElementById('cfSubmitIcon');
  const submitLabel = document.getElementById('cfSubmitLabel');
  const toast = document.getElementById('toast');
  const toastIcon = document.getElementById('toastIcon');
  const toastMsg = document.getElementById('toastMsg');

  function showToast(message, type) {
    if (!toast) return; // degrade gracefully if #toast missing
    toastMsg.textContent = message;
    toast.classList.toggle('error', type === 'error');
    if (toastIcon) toastIcon.className = type === 'error' ? 'fas fa-circle-exclamation' : 'fas fa-check-circle';
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 4000);
  }

  function setFieldError(groupId, hasError) {
    const el = document.getElementById(groupId);
    if (el) el.classList.toggle('error', hasError);
  }

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function validate() {
    const name = form.elements['name'].value.trim();
    const email = form.elements['email'].value.trim();
    const message = form.elements['message'].value.trim();

    const nameOk = name.length > 0;
    const emailOk = isValidEmail(email);
    const messageOk = message.length >= 10;

    setFieldError('fgName', !nameOk);
    setFieldError('fgEmail', !emailOk);
    setFieldError('fgMessage', !messageOk);

    return nameOk && emailOk && messageOk;
  }

  function setLoading(loading) {
    submitBtn.disabled = loading;
    if (submitIcon) submitIcon.className = loading ? 'fas fa-spinner' : 'fas fa-paper-plane';
    if (submitLabel) submitLabel.textContent = loading ? 'Sending…' : 'Send Message';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot: if filled, silently pretend success and bail (likely a bot)
    if (form.elements['_gotcha'] && form.elements['_gotcha'].value) {
      form.reset();
      return;
    }

    if (!validate()) {
      showToast('Please fix the highlighted fields.', 'error');
      return;
    }

    if (FORM_ENDPOINT.includes('YOUR_FORM_ID')) {
      showToast('Form endpoint not configured yet.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.elements['name'].value.trim(),
          email: form.elements['email'].value.trim(),
          message: form.elements['message'].value.trim(),
        }),
      });

      if (res.ok) {
        showToast('Message sent — thanks for reaching out!', 'success');
        form.reset();
        ['fgName', 'fgEmail', 'fgMessage'].forEach(id => setFieldError(id, false));
      } else {
        showToast('Something went wrong. Please try again or email directly.', 'error');
      }
    } catch (err) {
      showToast('Network error. Please try again or email directly.', 'error');
    } finally {
      setLoading(false);
    }
  });

  // Clear a field's error state as soon as the user starts fixing it
  ['cf-name', 'cf-email', 'cf-message'].forEach((id, i) => {
    const groupIds = ['fgName', 'fgEmail', 'fgMessage'];
    const field = document.getElementById(id);
    if (field) field.addEventListener('input', () => setFieldError(groupIds[i], false));
  });
})();

/* ── HERO 3D ORBIT (Three.js) ── */
(function () {
  const canvas = document.getElementById('hero3d');
  if (!canvas || typeof THREE === 'undefined') return; // graceful no-op: CDN failed or canvas missing

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return; // respect user's motion preference — canvas is also display:none via CSS

  const wrap = document.querySelector('.avatar-wrap');
  if (!wrap) return;

  let width = wrap.clientWidth + 60;
  let height = wrap.clientHeight + 60;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height, false);

  // Read theme colors from existing CSS variables — no new colors introduced
  function getCSSColor(varName, fallback) {
    const v = getComputedStyle(document.body).getPropertyValue(varName).trim();
    return v || fallback;
  }

  function makeWireframe(radius, colorHex, detail) {
    const geo = new THREE.IcosahedronGeometry(radius, detail);
    const edges = new THREE.EdgesGeometry(geo);
    const mat = new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: 0.55 });
    return new THREE.LineSegments(edges, mat);
  }

  const accentColor = new THREE.Color(getCSSColor('--accent', '#6c63ff'));
  const cyanColor = new THREE.Color(getCSSColor('--cyan', '#00d4ff'));

  const outerShape = makeWireframe(2.6, accentColor, 1);
  const innerShape = makeWireframe(1.7, cyanColor, 0);
  scene.add(outerShape, innerShape);

  // Sparse ambient particle shell
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
  const starMat = new THREE.PointsMaterial({ color: cyanColor, size: 0.035, transparent: true, opacity: 0.7 });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // Subtle mouse parallax (same input pattern as #cursor-glow)
  let mouseX = 0, mouseY = 0, curRotX = 0, curRotY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  function resize() {
    width = wrap.clientWidth + 60;
    height = wrap.clientHeight + 60;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }
  window.addEventListener('resize', resize);
  resize();

  // Keep wireframe colors in sync when the theme toggle changes body.light
  const themeSyncObserver = new MutationObserver(() => {
    outerShape.material.color.copy(new THREE.Color(getCSSColor('--accent', '#6c63ff')));
    innerShape.material.color.copy(new THREE.Color(getCSSColor('--cyan', '#00d4ff')));
    starMat.color.copy(new THREE.Color(getCSSColor('--cyan', '#00d4ff')));
  });
  themeSyncObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  let raf = null;
  function animate() {
    raf = requestAnimationFrame(animate);
    outerShape.rotation.y += 0.0022;
    outerShape.rotation.x += 0.0009;
    innerShape.rotation.y -= 0.0032;
    innerShape.rotation.x += 0.0014;
    stars.rotation.y += 0.0006;

    curRotX += (mouseY * 0.25 - curRotX) * 0.04;
    curRotY += (mouseX * 0.25 - curRotY) * 0.04;
    scene.rotation.x = curRotX;
    scene.rotation.y = curRotY;

    renderer.render(scene, camera);
  }
  animate();

  // Pause rendering when the hero section scrolls out of view (battery/CPU friendly)
  const heroEl = document.getElementById('home');
  if (heroEl && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!raf) animate();
        } else if (raf) {
          cancelAnimationFrame(raf);
          raf = null;
        }
      });
    }, { threshold: 0.05 }).observe(heroEl);
  }
})();
