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
  { title: 'Notice',            src: '' },
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
  const arm = document.getElementById('ttArm');
  const platter = document.getElementById('ttPlatter');
  if (!isPlaying) {
    isPlaying = true;
    playIcon.className = 'fa-solid fa-pause';
    if (arm) arm.classList.add('playing');
    if (platter) platter.classList.add('spinning');
    startFakeProgress();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  } else {
    isPlaying = false;
    playIcon.className = 'fa-solid fa-play';
    if (arm) arm.classList.remove('playing');
    if (platter) platter.classList.remove('spinning');
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

/* ════════════════════════════════════════════════════════════════
   STREAMING CAPSULES — Audio Engine
   ════════════════════════════════════════════════════════════════ */
(function initCapsules() {

  const CAPSULE_TRACKS = [
    {
      title:  'Tornado',
      artist: 'NISSI',
      src:    'https://res.cloudinary.com/dsetw6lec/video/upload/v1779904947/tornado_dy67b7.mp3',
    },
    {
      title:  'Nobody',
      artist: 'NISSI feat. Fireboy DML',
      src:    'https://res.cloudinary.com/dsetw6lec/video/upload/v1779904947/nobody_gvx2ln.mp3',
    },
    {
      title:  'JUDI',
      artist: 'NISSI',
      src:    'https://res.cloudinary.com/dsetw6lec/video/upload/v1779904947/judi_hgqlrb.mp3',
    },
    {
      title:  'Motivate',
      artist: 'NISSI feat. Olamide',
      src:    'https://res.cloudinary.com/dsetw6lec/video/upload/v1779904947/motivate_amnyd3.mp3',
    },
    {
      title:  'IGNITE',
      artist: 'NISSI',
      src:    'https://res.cloudinary.com/dsetw6lec/video/upload/v1779904947/ignite_wdvimc.mp3',
    },
  ];

  /* ── State ── */
  let activeId      = null;   // currently playing track index
  let audioCtxCap   = null;
  let analyserNodes = {};     // trackId → AnalyserNode
  let gainNodeCap   = null;
  let audioEls      = {};     // trackId → <audio>
  let waveRAFs      = {};     // trackId → rAF id
  let progressRAFs  = {};     // trackId → rAF id

  /* ── Helpers ── */
  function fmtTime(s) {
    if (!isFinite(s)) return '—';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  function getCapsule(id) {
    return document.querySelector(`.capsule[data-track="${id}"]`);
  }

  /* ── Web Audio context (lazy) ── */
  function ensureAudioCtx() {
    if (!audioCtxCap) {
      audioCtxCap = new (window.AudioContext || window.webkitAudioContext)();
      gainNodeCap = audioCtxCap.createGain();
      gainNodeCap.gain.value = 0.9;
      gainNodeCap.connect(audioCtxCap.destination);
    }
    if (audioCtxCap.state === 'suspended') audioCtxCap.resume();
  }

  /* ── Build or reuse audio element ── */
  function getAudio(id) {
    if (!audioEls[id]) {
      const el = new Audio();
      el.crossOrigin = 'anonymous';
      el.src = CAPSULE_TRACKS[id].src;
      el.preload = 'metadata';
      audioEls[id] = el;
    }
    return audioEls[id];
  }

  /* ── Connect audio to analyser (once per track) ── */
  function connectAnalyser(id) {
    if (analyserNodes[id]) return analyserNodes[id];
    ensureAudioCtx();
    const audio    = getAudio(id);
    const src      = audioCtxCap.createMediaElementSource(audio);
    const analyser = audioCtxCap.createAnalyser();
    analyser.fftSize = 128;
    src.connect(analyser);
    analyser.connect(gainNodeCap);
    analyserNodes[id] = analyser;
    return analyser;
  }

  /* ── Waveform drawing ── */
  function drawWave(id, analyser, isPlaying) {
    const canvas = document.querySelector(`.capsule-wave[data-trackid="${id}"]`);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth || 200;
    const H = canvas.offsetHeight || 32;
    canvas.width  = W;
    canvas.height = H;

    const bars = 40;
    const t    = Date.now() / 300;
    let data;

    if (analyser && isPlaying) {
      data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
    } else {
      // ambient idle animation
      data = new Uint8Array(bars);
      for (let i = 0; i < bars; i++) {
        data[i] = isPlaying
          ? Math.abs(Math.sin(t + i * 0.5) * 100 + Math.random() * 30)
          : Math.abs(Math.sin(t * 0.3 + i * 0.6) * 18 + 8);
      }
    }

    const bw   = (W / bars) - 1.5;
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < bars; i++) {
      const val  = data[Math.floor((i / bars) * data.length)] / 255;
      const bh   = Math.max(val * H * 0.88 + 2, 2);
      const x    = i * (bw + 1.5);
      const y    = (H - bh) / 2;

      const alpha = isPlaying ? 0.85 : 0.28;
      const grad  = ctx.createLinearGradient(0, y + bh, 0, y);
      if (isPlaying) {
        grad.addColorStop(0, '#a259ff');
        grad.addColorStop(0.5, '#3d9eff');
        grad.addColorStop(1, '#ff7a1a');
      } else {
        grad.addColorStop(0, 'rgba(162,89,255,0.5)');
        grad.addColorStop(1, 'rgba(61,158,255,0.3)');
      }

      ctx.globalAlpha = alpha;
      ctx.fillStyle   = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, bw, bh, 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    waveRAFs[id] = requestAnimationFrame(() => drawWave(id, analyser, isPlaying));
  }

  /* ── Progress updater ── */
  function trackProgress(id) {
    const audio    = audioEls[id];
    const fill     = document.querySelector(`.capsule-scrubber[data-trackid="${id}"] .capsule-scrubber-fill`);
    const dot      = document.querySelector(`.capsule-scrubber[data-trackid="${id}"] .capsule-scrubber-dot`);
    const curEl    = document.querySelector(`.capsule-time-cur[data-trackid="${id}"]`);
    const durEl    = document.querySelector(`.capsule-time-dur[data-trackid="${id}"]`);

    if (!audio) return;

    const dur = audio.duration || 0;
    const cur = audio.currentTime || 0;
    const pct = dur > 0 ? (cur / dur) * 100 : 0;

    if (fill) fill.style.width = pct + '%';
    if (dot) dot.style.left = pct + '%';
    if (curEl) curEl.textContent = fmtTime(cur);
    if (durEl && dur > 0) durEl.textContent = fmtTime(dur);

    if (!audio.paused && !audio.ended) {
      progressRAFs[id] = requestAnimationFrame(() => trackProgress(id));
    }
  }

  /* ── Set playing UI state ── */
  function setPlayState(id, playing) {
    const capsule = getCapsule(id);
    const btn     = document.querySelector(`.cap-play-btn[data-trackid="${id}"]`);
    const icon    = btn ? btn.querySelector('i') : null;

    if (!capsule || !btn) return;

    if (playing) {
      capsule.classList.add('is-playing');
      btn.classList.add('playing');
      btn.classList.remove('loading');
      if (icon) { icon.className = 'fa-solid fa-pause'; }
    } else {
      capsule.classList.remove('is-playing');
      btn.classList.remove('playing');
      btn.classList.remove('loading');
      if (icon) { icon.className = 'fa-solid fa-play'; }
    }
  }

  /* ── Stop all ── */
  function stopAll(exceptId) {
    Object.keys(audioEls).forEach(id => {
      const numId = parseInt(id);
      if (numId === exceptId) return;
      const audio = audioEls[id];
      if (audio && !audio.paused) audio.pause();
      setPlayState(numId, false);
      cancelAnimationFrame(waveRAFs[id]);
    });
  }

  /* ── Play / pause toggle ── */
  function togglePlay(id) {
    ensureAudioCtx();
    const audio    = getAudio(id);
    const analyser = connectAnalyser(id);
    const btn      = document.querySelector(`.cap-play-btn[data-trackid="${id}"]`);

    if (!audio.paused) {
      // → pause
      audio.pause();
      setPlayState(id, false);
      cancelAnimationFrame(waveRAFs[id]);
      cancelAnimationFrame(progressRAFs[id]);
      drawWave(id, analyser, false);
      activeId = null;
    } else {
      // → play
      stopAll(id);
      activeId = id;

      // loading state
      if (btn) btn.classList.add('loading');

      audio.play().then(() => {
        setPlayState(id, true);
        cancelAnimationFrame(waveRAFs[id]);
        drawWave(id, analyser, true);
        trackProgress(id);
      }).catch(err => {
        console.warn('Audio play failed:', err);
        if (btn) btn.classList.remove('loading');
      });
    }
  }

  /* ── Scrubber click ── */
  function bindScrubber(id) {
    const scrubber = document.querySelector(`.capsule-scrubber[data-trackid="${id}"]`);
    if (!scrubber) return;
    scrubber.addEventListener('click', e => {
      const rect = scrubber.getBoundingClientRect();
      const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const audio = getAudio(id);
      if (audio && isFinite(audio.duration)) {
        audio.currentTime = pct * audio.duration;
        trackProgress(id);
      }
    });
  }

  /* ── Duration display when metadata loads ── */
  function bindMeta(id) {
    const audio = getAudio(id);
    const durEl = document.querySelector(`.capsule-time-dur[data-trackid="${id}"]`);
    audio.addEventListener('loadedmetadata', () => {
      if (durEl) durEl.textContent = fmtTime(audio.duration);
    });
    audio.addEventListener('ended', () => {
      setPlayState(id, false);
      activeId = null;
      const analyser = analyserNodes[id];
      cancelAnimationFrame(waveRAFs[id]);
      drawWave(id, analyser, false);
    });
  }

  /* ── 3D tilt for capsules ── */
  function bind3DTilt(id) {
    const capsule = getCapsule(id);
    if (!capsule) return;
    capsule.addEventListener('mousemove', e => {
      const rect = capsule.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 10;
      capsule.style.transform = `perspective(900px) rotateX(${-y * 0.5}deg) rotateY(${x * 0.5}deg) translateY(-3px)`;
    });
    capsule.addEventListener('mouseleave', () => {
      capsule.style.transform = '';
    });
  }

  /* ── Init all capsules ── */
  document.querySelectorAll('.capsule[data-track]').forEach(capsule => {
    const id = parseInt(capsule.dataset.track);
    if (isNaN(id) || id >= CAPSULE_TRACKS.length) return;

    // wire play btn
    const btn = capsule.querySelector(`.cap-play-btn[data-trackid="${id}"]`);
    if (btn) btn.addEventListener('click', () => togglePlay(id));

    // start idle waveform animation (no analyser yet)
    drawWave(id, null, false);

    // load duration
    getAudio(id); // pre-create element
    bindMeta(id);
    bindScrubber(id);
    bind3DTilt(id);
  });

})();

