/* ════════════════════════════════════════════════════════════════
   OSINACCI — script.js
   ════════════════════════════════════════════════════════════════ */

/* ─── GSAP SETUP ─────────────────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ─── LOADER ─────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
    document.body.classList.remove('loading');
    initRevealAnimations();
    initHeroAnimation();
  }, 2400);
});

/* ─── CUSTOM CURSOR ──────────────────────────────────────────── */
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursor-trail');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function animCursor() {
  tx += (mx - tx) * 0.14;
  ty += (my - ty) * 0.14;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
  trail.style.left  = tx + 'px';
  trail.style.top   = ty + 'px';
  requestAnimationFrame(animCursor);
})();

/* ─── PARTICLES ──────────────────────────────────────────────── */
const pCanvas = document.getElementById('particles-canvas');
const pCtx    = pCanvas.getContext('2d');
let particles = [];

function resizeParticles() {
  pCanvas.width  = window.innerWidth;
  pCanvas.height = window.innerHeight;
}
resizeParticles();
window.addEventListener('resize', resizeParticles);

function spawnParticle() {
  return {
    x: Math.random() * pCanvas.width,
    y: Math.random() * pCanvas.height,
    r: Math.random() * 1.5 + 0.4,
    dx: (Math.random() - 0.5) * 0.3,
    dy: -Math.random() * 0.4 - 0.1,
    alpha: Math.random() * 0.5 + 0.1,
    color: ['#a259ff','#3d9eff','#ff7a1a'][Math.floor(Math.random()*3)]
  };
}
for (let i = 0; i < 120; i++) particles.push(spawnParticle());

(function animParticles() {
  pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
  particles.forEach((p, i) => {
    p.x += p.dx; p.y += p.dy;
    p.alpha -= 0.001;
    if (p.alpha <= 0 || p.y < -10) particles[i] = spawnParticle();
    pCtx.beginPath();
    pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    pCtx.fillStyle = p.color;
    pCtx.globalAlpha = p.alpha;
    pCtx.fill();
    pCtx.globalAlpha = 1;
  });
  requestAnimationFrame(animParticles);
})();

/* ─── NAVBAR SCROLL ──────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ─── HAMBURGER MENU ─────────────────────────────────────────── */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  })
);

/* ─── THEME TOGGLE ───────────────────────────────────────────── */
document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('light');
});

/* ─── HERO ANIMATIONS ────────────────────────────────────────── */
function initHeroAnimation() {
  const els = document.querySelectorAll('#hero .reveal-up');
  gsap.fromTo(els,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 1.1, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
  );
}

/* ─── SCROLL REVEAL ──────────────────────────────────────────── */
function initRevealAnimations() {
  const upEls   = document.querySelectorAll('.reveal-up:not(#hero *)');
  const leftEls = document.querySelectorAll('.reveal-left');
  const rightEls= document.querySelectorAll('.reveal-right');

  upEls.forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        delay: (parseFloat(el.dataset.delay) || 0) / 1000,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      }
    );
  });
  leftEls.forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      }
    );
  });
  rightEls.forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      }
    );
  });
}

/* ─── LIGHTBOX ───────────────────────────────────────────────── */
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lbImg');
const lbClose  = document.getElementById('lbClose');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    lbImg.src = item.querySelector('img').src;
    lightbox.classList.add('open');
  });
});
lbClose.addEventListener('click', () => lightbox.classList.remove('open'));
lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('open'); });

/* ─── CONTACT FORM ───────────────────────────────────────────── */
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  btn.textContent = 'Sent! ✓';
  btn.style.background = 'linear-gradient(135deg,#1db954,#17a244)';
  setTimeout(() => {
    btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
});

/* ════════════════════════════════════════════════════════════════
   MUSIC PLAYER + AUDIO ENGINE
   ════════════════════════════════════════════════════════════════ */
const tracks = [
  { title: 'Banger',            src: '' },
  { title: 'Static Realm',      src: '' },
  { title: 'Neon Cathedral',    src: '' },
];
let currentTrack = 0;
let audioCtx, analyser, source, gainNode;
let audioBuffer = null;
let isPlaying   = false;
let startTime   = 0;
let pauseOffset = 0;
let rafId;

// Fake duration for demo (no real audio file)
const FAKE_DURATION = 225; // 3:45
let fakeElapsed = 0, fakeRaf;

const playBtn      = document.getElementById('playBtn');
const playIcon     = document.getElementById('playIcon');
const prevBtn      = document.getElementById('prevBtn');
const nextBtn      = document.getElementById('nextBtn');
const progressFill = document.getElementById('progressFill');
const progressBar  = document.getElementById('progressBar');
const progressThumb= document.getElementById('progressThumb');
const currentTimeEl= document.getElementById('currentTime');
const totalTimeEl  = document.getElementById('totalTime');
const trackNameEl  = document.getElementById('trackName');
const vinylWrap    = document.getElementById('vinylWrap');
const volumeSlider = document.getElementById('volumeSlider');

function fmtTime(s) {
  const m = Math.floor(s/60);
  const sec = Math.floor(s%60);
  return `${m}:${sec.toString().padStart(2,'0')}`;
}

function loadTrack(i) {
  currentTrack = (i + tracks.length) % tracks.length;
  trackNameEl.textContent = tracks[currentTrack].title;
  totalTimeEl.textContent = fmtTime(FAKE_DURATION);
  fakeElapsed = 0;
  updateProgress(0);
}

function updateProgress(pct) {
  progressFill.style.width = pct + '%';
  progressThumb.style.left = pct + '%';
  currentTimeEl.textContent = fmtTime(FAKE_DURATION * pct / 100);
}

function startFakeProgress() {
  clearInterval(fakeRaf);
  fakeRaf = setInterval(() => {
    fakeElapsed += 0.25;
    if (fakeElapsed >= FAKE_DURATION) { fakeElapsed = 0; }
    const pct = (fakeElapsed / FAKE_DURATION) * 100;
    updateProgress(pct);
  }, 250);
}
function stopFakeProgress() { clearInterval(fakeRaf); }

/* Web Audio init */
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser  = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    gainNode  = audioCtx.createGain();
    gainNode.gain.value = parseFloat(volumeSlider.value);
    gainNode.connect(audioCtx.destination);
    analyser.connect(gainNode);
    startVisualisers();
  }
}

playBtn.addEventListener('click', () => {
  initAudio();
  if (!isPlaying) {
    isPlaying = true;
    playIcon.className = 'fa-solid fa-pause';
    vinylWrap.classList.add('spinning');
    startFakeProgress();
    // If real audio exists, play it. Otherwise just spin the vis.
    if (audioCtx.state === 'suspended') audioCtx.resume();
  } else {
    isPlaying = false;
    playIcon.className = 'fa-solid fa-play';
    vinylWrap.classList.remove('spinning');
    stopFakeProgress();
    if (audioCtx.state === 'running') audioCtx.suspend();
  }
});

prevBtn.addEventListener('click', () => { loadTrack(currentTrack - 1); });
nextBtn.addEventListener('click', () => { loadTrack(currentTrack + 1); });

progressBar.addEventListener('click', e => {
  const rect = progressBar.getBoundingClientRect();
  const pct  = ((e.clientX - rect.left) / rect.width) * 100;
  fakeElapsed = (pct / 100) * FAKE_DURATION;
  updateProgress(pct);
});

volumeSlider.addEventListener('input', () => {
  if (gainNode) gainNode.gain.value = parseFloat(volumeSlider.value);
});

loadTrack(0);

/* ════════════════════════════════════════════════════════════════
   WAVEFORM VISUALISERS
   ════════════════════════════════════════════════════════════════ */

/* ── Simulated frequency data for demo (no real file) ── */
function getFreqData(analyser) {
  if (!analyser) {
    // Return synthetic animated data
    const arr = new Uint8Array(64);
    const t   = Date.now() / 200;
    for (let i = 0; i < arr.length; i++) {
      arr[i] = isPlaying
        ? Math.abs(Math.sin(t + i * 0.4) * 120 + Math.random() * 40 + 20)
        : Math.abs(Math.sin(t * 0.2 + i * 0.3) * 15 + 10);
    }
    return arr;
  }
  const d = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(d);
  return d;
}

/* ── Player Waveform ──────────────────────────────────── */
const playerWave    = document.getElementById('player-waveform');
const playerWaveCtx = playerWave.getContext('2d');

function drawPlayerWave() {
  const W = playerWave.offsetWidth;
  const H = playerWave.offsetHeight;
  playerWave.width  = W;
  playerWave.height = H;

  const data = getFreqData(analyser);
  const bars = 48;
  const bw   = W / bars - 2;

  playerWaveCtx.clearRect(0, 0, W, H);
  for (let i = 0; i < bars; i++) {
    const val = data[Math.floor((i / bars) * data.length)] / 255;
    const bh  = val * H * 0.9 + 2;
    const x   = i * (bw + 2);

    const grad = playerWaveCtx.createLinearGradient(0, H, 0, H - bh);
    grad.addColorStop(0,   '#a259ff');
    grad.addColorStop(0.5, '#3d9eff');
    grad.addColorStop(1,   '#ff7a1a');

    playerWaveCtx.fillStyle = grad;
    playerWaveCtx.globalAlpha = 0.85;
    playerWaveCtx.beginPath();
    playerWaveCtx.roundRect(x, H - bh, bw, bh, 2);
    playerWaveCtx.fill();
  }
  requestAnimationFrame(drawPlayerWave);
}

/* ── Side Waveform ───────────────────────────────────── */
const sideWave    = document.getElementById('side-waveform');
const sideWaveCtx = sideWave.getContext('2d');

function drawSideWave() {
  const W = sideWave.width  = sideWave.offsetWidth  || 50;
  const H = sideWave.height = sideWave.offsetHeight || 300;

  const data = getFreqData(analyser);
  const bars = 24;
  const bh   = H / bars - 2;

  sideWaveCtx.clearRect(0, 0, W, H);
  for (let i = 0; i < bars; i++) {
    const val = data[Math.floor((i / bars) * data.length)] / 255;
    const bw  = val * W * 0.9 + 3;
    const y   = i * (bh + 2);

    const grad = sideWaveCtx.createLinearGradient(0, 0, bw, 0);
    grad.addColorStop(0, '#a259ff');
    grad.addColorStop(1, '#3d9eff');

    sideWaveCtx.fillStyle = grad;
    sideWaveCtx.globalAlpha = 0.7;
    sideWaveCtx.beginPath();
    sideWaveCtx.roundRect(0, y, bw, bh, 2);
    sideWaveCtx.fill();
  }
  requestAnimationFrame(drawSideWave);
}

function startVisualisers() {
  drawPlayerWave();
  drawSideWave();
}

// Start visualisers even before audio context
drawPlayerWave();
drawSideWave();

/* ════════════════════════════════════════════════════════════════
   GSAP SECTION PARALLAX EFFECTS
   ════════════════════════════════════════════════════════════════ */
gsap.utils.toArray('.section-title').forEach(el => {
  gsap.fromTo(el,
    { backgroundPosition: '0% 100%' },
    { backgroundPosition: '100% 0%', duration: 1,
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 }
    }
  );
});

/* ─── STAT NUMBER COUNT-UP ─────────────────────────────────── */
document.querySelectorAll('.stat-num').forEach(el => {
  const raw = el.textContent.trim();
  const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
  const suffix = raw.replace(/[0-9.]/g, '');
  ScrollTrigger.create({
    trigger: el, start: 'top 85%', once: true,
    onEnter: () => {
      gsap.from({ val: 0 }, {
        val: num, duration: 1.8, ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(this.targets()[0].val) + suffix; }
      });
    }
  });
});

/* ─── TOUR CARD HOVER GLOW ─────────────────────────────────── */
document.querySelectorAll('.tour-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 20;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 20;
    card.style.transform = `perspective(800px) rotateX(${-y*0.3}deg) rotateY(${x*0.3}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ─── MUSIC CARD 3D TILT ───────────────────────────────────── */
document.querySelectorAll('.music-card, .store-card, .merch-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 12;
    card.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ─── SMOOTH SCROLL LINKS ──────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      gsap.to(window, { duration: 1, scrollTo: { y: target, offsetY: 72 }, ease: 'power3.inOut' });
    }
  });
});

// GSAP ScrollToPlugin shim (if not loaded, fallback)
if (!gsap.plugins || !gsap.plugins.scrollTo) {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      const el = document.querySelector(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ─── VINYL GLOW ON PLAY ─────────────────────────────────────── */
vinylWrap.addEventListener('mouseenter', () => {
  gsap.to('.vinyl-art', { filter: 'brightness(1.15) saturate(1.3)', duration: 0.4 });
});
vinylWrap.addEventListener('mouseleave', () => {
  gsap.to('.vinyl-art', { filter: 'brightness(1) saturate(1)', duration: 0.4 });
});

/* ─── SECTION ENTRANCE GLOW SHIMMER ─────────────────────────── */
gsap.utils.toArray('#music, #videos, #store, #merch').forEach(sec => {
  gsap.fromTo(sec, { backgroundImage: 'linear-gradient(135deg,rgba(162,89,255,0) 0%, rgba(61,158,255,0) 100%)' },
    { backgroundImage: 'linear-gradient(135deg,rgba(162,89,255,0.04) 0%, rgba(61,158,255,0.04) 100%)',
      duration: 1,
      scrollTrigger: { trigger: sec, start: 'top 70%', end: 'center center', scrub: true }
    }
  );
});

console.log('%c OSINACCI ', 'background:#a259ff;color:#fff;font-size:2rem;font-weight:bold;padding:8px 20px;border-radius:4px;');
console.log('%c Premium Artist Experience Loaded ', 'color:#3d9eff;font-size:0.8rem;');
