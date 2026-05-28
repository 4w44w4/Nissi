/* ════════════════════════════════════════════════════════════════
   NISSI — script.js  (clean merged build)
   ════════════════════════════════════════════════════════════════ */

/* ─── GSAP SETUP ─────────────────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ─── INIT ON LOAD ───────────────────────────────────────────── */
window.addEventListener('load', () => {
  // Fast loader — done in 900ms
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('done');
      document.body.classList.remove('loading');
    }, 900);
  }
  initRevealAnimations();
  initHeroAnimation();
});

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
    p.x += p.dx; p.y += p.dy; p.alpha -= 0.001;
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
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
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
  const upEls    = document.querySelectorAll('.reveal-up:not(#hero *)');
  const leftEls  = document.querySelectorAll('.reveal-left');
  const rightEls = document.querySelectorAll('.reveal-right');
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

/* ─── LIGHTBOX (handled by gallery slider init below) ─────────── */
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lbImg');
const lbClose  = document.getElementById('lbClose');

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
   NOW-PLAYING VINYL PLAYER  (compact horizontal capsule)
   ════════════════════════════════════════════════════════════════ */
const tracks = [
  { title: 'Notice', src: '' },
];
let currentTrack = 0;
let audioCtx, analyser, gainNode;
let isPlaying   = false;
const FAKE_DURATION = 225; // 3:45
let fakeElapsed = 0, fakeRaf;

const playBtn       = document.getElementById('playBtn');
const playIcon      = document.getElementById('playIcon');
const prevBtn       = document.getElementById('prevBtn');
const nextBtn       = document.getElementById('nextBtn');
const progressFill  = document.getElementById('progressFill');
const progressBar   = document.getElementById('progressBar');
const progressThumb = document.getElementById('progressThumb');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl   = document.getElementById('totalTime');
const trackNameEl   = document.getElementById('trackName');
const volumeSlider  = document.getElementById('volumeSlider');

function fmtTime(s) {
  const m = Math.floor(s / 60);
  return `${m}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
}

function updateProgress(pct) {
  if (progressFill)  progressFill.style.width = pct + '%';
  if (progressThumb) progressThumb.style.left  = pct + '%';
  if (currentTimeEl) currentTimeEl.textContent = fmtTime(FAKE_DURATION * pct / 100);
}

function loadTrack(i) {
  currentTrack = (i + tracks.length) % tracks.length;
  if (trackNameEl) trackNameEl.textContent = tracks[currentTrack].title;
  if (totalTimeEl) totalTimeEl.textContent = fmtTime(FAKE_DURATION);
  fakeElapsed = 0;
  updateProgress(0);
}

function startFakeProgress() {
  clearInterval(fakeRaf);
  fakeRaf = setInterval(() => {
    fakeElapsed += 0.25;
    if (fakeElapsed >= FAKE_DURATION) fakeElapsed = 0;
    updateProgress((fakeElapsed / FAKE_DURATION) * 100);
  }, 250);
}
function stopFakeProgress() { clearInterval(fakeRaf); }

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser  = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    gainNode  = audioCtx.createGain();
    gainNode.gain.value = volumeSlider ? parseFloat(volumeSlider.value) : 0.8;
    gainNode.connect(audioCtx.destination);
    analyser.connect(gainNode);
    drawSideWave();
  }
}

/* ── Play / Pause ── */
if (playBtn) {
  playBtn.addEventListener('click', () => {
    initAudio();
    const vinyl = document.getElementById('npVinyl');
    if (!isPlaying) {
      isPlaying = true;
      playIcon.className = 'fa-solid fa-pause';
      playBtn.classList.add('playing');
      if (vinyl) vinyl.classList.add('spinning');
      startFakeProgress();
      if (audioCtx.state === 'suspended') audioCtx.resume();
    } else {
      isPlaying = false;
      playIcon.className = 'fa-solid fa-play';
      playBtn.classList.remove('playing');
      if (vinyl) vinyl.classList.remove('spinning');
      stopFakeProgress();
      if (audioCtx.state === 'running') audioCtx.suspend();
    }
  });
}

if (prevBtn) prevBtn.addEventListener('click', () => loadTrack(currentTrack - 1));
if (nextBtn) nextBtn.addEventListener('click', () => loadTrack(currentTrack + 1));

if (progressBar) {
  progressBar.addEventListener('click', e => {
    const rect = progressBar.getBoundingClientRect();
    const pct  = ((e.clientX - rect.left) / rect.width) * 100;
    fakeElapsed = (pct / 100) * FAKE_DURATION;
    updateProgress(pct);
  });
}

if (volumeSlider) {
  volumeSlider.addEventListener('input', () => {
    if (gainNode) gainNode.gain.value = parseFloat(volumeSlider.value);
  });
}

loadTrack(0);

/* ════════════════════════════════════════════════════════════════
   WAVEFORM VISUALISERS
   ════════════════════════════════════════════════════════════════ */
function getFreqData() {
  if (!analyser) {
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

/* ── Side Waveform ───────────────────────────────────── */
const sideWave    = document.getElementById('side-waveform');
const sideWaveCtx = sideWave ? sideWave.getContext('2d') : null;

function drawSideWave() {
  if (!sideWave || !sideWaveCtx) return;
  const W = sideWave.width  = sideWave.offsetWidth  || 50;
  const H = sideWave.height = sideWave.offsetHeight || 300;
  const data = getFreqData();
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
drawSideWave();

/* ════════════════════════════════════════════════════════════════
   GSAP PARALLAX + STAT COUNT-UP + HOVER EFFECTS
   ════════════════════════════════════════════════════════════════ */
gsap.utils.toArray('.section-title').forEach(el => {
  gsap.fromTo(el,
    { backgroundPosition: '0% 100%' },
    { backgroundPosition: '100% 0%', duration: 1,
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 }
    }
  );
});

document.querySelectorAll('.stat-num').forEach(el => {
  const raw    = el.textContent.trim();
  const num    = parseFloat(raw.replace(/[^0-9.]/g, ''));
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

document.querySelectorAll('.tour-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 20;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 20;
    card.style.transform = `perspective(800px) rotateX(${-y*0.3}deg) rotateY(${x*0.3}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

document.querySelectorAll('.music-card, .store-card, .merch-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 12;
    card.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ─── SMOOTH SCROLL ──────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ─── SECTION ENTRANCE GLOW ──────────────────────────────────── */
gsap.utils.toArray('#music, #videos, #store, #merch').forEach(sec => {
  gsap.fromTo(sec,
    { backgroundImage: 'linear-gradient(135deg,rgba(162,89,255,0) 0%, rgba(61,158,255,0) 100%)' },
    { backgroundImage: 'linear-gradient(135deg,rgba(162,89,255,0.04) 0%, rgba(61,158,255,0.04) 100%)',
      duration: 1,
      scrollTrigger: { trigger: sec, start: 'top 70%', end: 'center center', scrub: true }
    }
  );
});

console.log('%c NISSI ', 'background:#a259ff;color:#fff;font-size:2rem;font-weight:bold;padding:8px 20px;border-radius:4px;');
console.log('%c Premium Artist Experience Loaded ', 'color:#3d9eff;font-size:0.8rem;');

/* ════════════════════════════════════════════════════════════════
   STREAMING CAPSULES — Audio Engine
   ════════════════════════════════════════════════════════════════ */
(function initCapsules() {

  const CAPSULE_TRACKS = [
    { title: 'Tornado',  artist: 'NISSI',                  src: 'https://res.cloudinary.com/dsetw6lec/video/upload/v1779904947/tornado_dy67b7.mp3' },
    { title: 'Nobody',   artist: 'NISSI feat. Fireboy DML', src: 'https://res.cloudinary.com/dsetw6lec/video/upload/v1779904947/nobody_gvx2ln.mp3' },
    { title: 'JUDI',     artist: 'NISSI',                  src: 'https://res.cloudinary.com/dsetw6lec/video/upload/v1779904947/judi_hgqlrb.mp3' },
    { title: 'Motivate', artist: 'NISSI feat. Olamide',    src: 'https://res.cloudinary.com/dsetw6lec/video/upload/v1779904947/motivate_amnyd3.mp3' },
    { title: 'IGNITE',   artist: 'NISSI',                  src: 'https://res.cloudinary.com/dsetw6lec/video/upload/v1779904947/ignite_wdvimc.mp3' },
  ];

  let activeId      = null;
  let audioCtxCap   = null;
  let analyserNodes = {};
  let gainNodeCap   = null;
  let audioEls      = {};
  let waveRAFs      = {};
  let progressRAFs  = {};

  function capFmt(s) {
    if (!isFinite(s)) return '—';
    return `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`;
  }

  function getCapsule(id) {
    return document.querySelector(`.capsule[data-track="${id}"]`);
  }

  function ensureAudioCtx() {
    if (!audioCtxCap) {
      audioCtxCap = new (window.AudioContext || window.webkitAudioContext)();
      gainNodeCap = audioCtxCap.createGain();
      gainNodeCap.gain.value = 0.9;
      gainNodeCap.connect(audioCtxCap.destination);
    }
    if (audioCtxCap.state === 'suspended') audioCtxCap.resume();
  }

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

  function connectAnalyser(id) {
    if (analyserNodes[id]) return analyserNodes[id];
    ensureAudioCtx();
    const audio    = getAudio(id);
    const src      = audioCtxCap.createMediaElementSource(audio);
    const an       = audioCtxCap.createAnalyser();
    an.fftSize = 128;
    src.connect(an);
    an.connect(gainNodeCap);
    analyserNodes[id] = an;
    return an;
  }

  function drawWave(id, an, playing) {
    const canvas = document.querySelector(`.capsule-wave[data-trackid="${id}"]`);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth || 200;
    const H = canvas.offsetHeight || 32;
    canvas.width = W; canvas.height = H;

    const bars = 40;
    const t    = Date.now() / 300;
    let data;

    if (an && playing) {
      data = new Uint8Array(an.frequencyBinCount);
      an.getByteFrequencyData(data);
    } else {
      data = new Uint8Array(bars);
      for (let i = 0; i < bars; i++) {
        data[i] = playing
          ? Math.abs(Math.sin(t + i * 0.5) * 100 + Math.random() * 30)
          : Math.abs(Math.sin(t * 0.3 + i * 0.6) * 18 + 8);
      }
    }

    const bw = (W / bars) - 1.5;
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < bars; i++) {
      const val  = data[Math.floor((i / bars) * data.length)] / 255;
      const bh   = Math.max(val * H * 0.88 + 2, 2);
      const x    = i * (bw + 1.5);
      const y    = (H - bh) / 2;
      const grad = ctx.createLinearGradient(0, y + bh, 0, y);
      if (playing) {
        grad.addColorStop(0, '#a259ff');
        grad.addColorStop(0.5, '#3d9eff');
        grad.addColorStop(1, '#ff7a1a');
      } else {
        grad.addColorStop(0, 'rgba(162,89,255,0.5)');
        grad.addColorStop(1, 'rgba(61,158,255,0.3)');
      }
      ctx.globalAlpha = playing ? 0.85 : 0.28;
      ctx.fillStyle   = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, bw, bh, 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    waveRAFs[id] = requestAnimationFrame(() => drawWave(id, an, playing));
  }

  function trackProgress(id) {
    const audio = audioEls[id];
    const fill  = document.querySelector(`.capsule-scrubber[data-trackid="${id}"] .capsule-scrubber-fill`);
    const dot   = document.querySelector(`.capsule-scrubber[data-trackid="${id}"] .capsule-scrubber-dot`);
    const curEl = document.querySelector(`.capsule-time-cur[data-trackid="${id}"]`);
    const durEl = document.querySelector(`.capsule-time-dur[data-trackid="${id}"]`);
    if (!audio) return;
    const dur = audio.duration || 0;
    const cur = audio.currentTime || 0;
    const pct = dur > 0 ? (cur / dur) * 100 : 0;
    if (fill)  fill.style.width  = pct + '%';
    if (dot)   dot.style.left   = pct + '%';
    if (curEl) curEl.textContent = capFmt(cur);
    if (durEl && dur > 0) durEl.textContent = capFmt(dur);
    if (!audio.paused && !audio.ended) {
      progressRAFs[id] = requestAnimationFrame(() => trackProgress(id));
    }
  }

  function setPlayState(id, playing) {
    const capsule = getCapsule(id);
    const btn     = document.querySelector(`.cap-play-btn[data-trackid="${id}"]`);
    const icon    = btn ? btn.querySelector('i') : null;
    if (!capsule || !btn) return;
    if (playing) {
      capsule.classList.add('is-playing');
      btn.classList.add('playing');
      btn.classList.remove('loading');
      if (icon) icon.className = 'fa-solid fa-pause';
    } else {
      capsule.classList.remove('is-playing');
      btn.classList.remove('playing');
      btn.classList.remove('loading');
      if (icon) icon.className = 'fa-solid fa-play';
    }
  }

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

  function togglePlay(id) {
    ensureAudioCtx();
    const audio = getAudio(id);
    const an    = connectAnalyser(id);
    const btn   = document.querySelector(`.cap-play-btn[data-trackid="${id}"]`);

    if (!audio.paused) {
      audio.pause();
      setPlayState(id, false);
      cancelAnimationFrame(waveRAFs[id]);
      cancelAnimationFrame(progressRAFs[id]);
      drawWave(id, an, false);
      activeId = null;
    } else {
      stopAll(id);
      activeId = id;
      if (btn) btn.classList.add('loading');
      audio.play().then(() => {
        setPlayState(id, true);
        cancelAnimationFrame(waveRAFs[id]);
        drawWave(id, an, true);
        trackProgress(id);
      }).catch(err => {
        console.warn('Audio play failed:', err);
        if (btn) btn.classList.remove('loading');
      });
    }
  }

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

  function bindMeta(id) {
    const audio = getAudio(id);
    const durEl = document.querySelector(`.capsule-time-dur[data-trackid="${id}"]`);
    audio.addEventListener('loadedmetadata', () => {
      if (durEl) durEl.textContent = capFmt(audio.duration);
    });
    audio.addEventListener('ended', () => {
      setPlayState(id, false);
      activeId = null;
      cancelAnimationFrame(waveRAFs[id]);
      drawWave(id, analyserNodes[id], false);
    });
  }

  function bind3DTilt(id) {
    const capsule = getCapsule(id);
    if (!capsule) return;
    capsule.addEventListener('mousemove', e => {
      const rect = capsule.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 10;
      capsule.style.transform = `perspective(900px) rotateX(${-y*0.5}deg) rotateY(${x*0.5}deg) translateY(-3px)`;
    });
    capsule.addEventListener('mouseleave', () => { capsule.style.transform = ''; });
  }

  document.querySelectorAll('.capsule[data-track]').forEach(capsule => {
    const id = parseInt(capsule.dataset.track);
    if (isNaN(id) || id >= CAPSULE_TRACKS.length) return;
    const btn = capsule.querySelector(`.cap-play-btn[data-trackid="${id}"]`);
    if (btn) btn.addEventListener('click', () => togglePlay(id));
    drawWave(id, null, false);
    getAudio(id);
    bindMeta(id);
    bindScrubber(id);
    bind3DTilt(id);
  });

})();

/* ════════════════════════════════════════════════════════════════
   VIDEO FALLBACK — detect blocked iframes, swap to thumbnail
   ════════════════════════════════════════════════════════════════ */
(function initVideoFallbacks() {
  const YT_THUMB = id =>
    `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  const YT_URL   = id => `https://youtu.be/${id}`;

  document.querySelectorAll('.video-embed-wrap[data-video-id]').forEach(wrap => {
    const id     = wrap.dataset.videoId;
    const iframe = wrap.querySelector('iframe');
    if (!iframe) return;

    // Give iframe 4s to load; if it errors or stays blank, swap to fallback
    let fallbackTriggered = false;

    function buildFallback() {
      if (fallbackTriggered) return;
      fallbackTriggered = true;

      // Remove the broken iframe
      iframe.remove();

      // Build fallback thumbnail card
      const thumb = document.createElement('div');
      thumb.className = 'vf-thumb';
      thumb.setAttribute('role', 'link');
      thumb.setAttribute('tabindex', '0');
      thumb.setAttribute('aria-label', 'Watch on YouTube');

      thumb.innerHTML = `
        <img src="${YT_THUMB(id)}"
             onerror="this.src='https://img.youtube.com/vi/${id}/hqdefault.jpg'"
             alt="Video thumbnail" />
        <div class="vf-play-ring">
          <div class="vf-play-btn"><i class="fa-solid fa-play"></i></div>
        </div>
        <div class="vf-label"><i class="fa-brands fa-youtube"></i> Watch on YouTube</div>
      `;

      thumb.addEventListener('click', () => window.open(YT_URL(id), '_blank', 'noopener'));
      thumb.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') window.open(YT_URL(id), '_blank', 'noopener');
      });

      wrap.appendChild(thumb);

      // Update the meta link title if possible
      const card  = wrap.closest('.video-card');
      const title = card ? card.querySelector('.video-meta-title') : null;
      if (title && title.textContent.includes('Official')) {
        title.textContent = 'NISSI — Watch on YouTube';
      }
    }

    // Listen for iframe load error
    iframe.addEventListener('error', buildFallback);

    // Fallback: poll after 3.5s — if iframe is blank/blocked, swap it
    setTimeout(() => {
      // Try to detect if video was blocked by checking iframe contentDocument
      try {
        // Cross-origin will throw — means it loaded okay (YouTube controls visible)
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        // If we can access it and body is empty, it's blocked
        if (!doc || !doc.body || doc.body.innerHTML.trim() === '') {
          buildFallback();
        }
      } catch(e) {
        // Cross-origin = normal YouTube loaded fine — do nothing
      }
    }, 3500);

    // Also listen for message from YouTube iframe API indicating error
    window.addEventListener('message', e => {
      try {
        const data = JSON.parse(e.data);
        if (data && data.event === 'infoDelivery' &&
            data.info && data.info.playerState === undefined) {
          buildFallback();
        }
      } catch(_) {}
    });
  });
})();

/* ════════════════════════════════════════════════════════════════
   GALLERY SWIPER SLIDER
   ════════════════════════════════════════════════════════════════ */
(function initGallerySlider() {
  const slider   = document.getElementById('gallerySlider');
  const prevBtn  = document.getElementById('galleryPrev');
  const nextBtn  = document.getElementById('galleryNext');
  const dotsWrap = document.getElementById('galleryDots');
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lbImg');
  const lbClose  = document.getElementById('lbClose');

  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll('.gallery-slide'));
  let current  = 0;
  let startX   = 0;
  let isDrag   = false;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    slider.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll('.gallery-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));

  // Touch / mouse swipe
  slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
  });
  slider.addEventListener('mousedown',  e => { startX = e.clientX; isDrag = true; });
  slider.addEventListener('mouseup',    e => {
    if (!isDrag) return;
    isDrag = false;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
  });

  // Keyboard arrow support
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // Auto-advance every 5s
  let autoTimer = setInterval(() => goTo(current + 1), 5000);
  slider.addEventListener('mouseenter', () => clearInterval(autoTimer));
  slider.addEventListener('mouseleave', () => {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  });

  // Lightbox on click
  slides.forEach(slide => {
    slide.addEventListener('click', () => {
      if (!lightbox || !lbImg) return;
      lbImg.src = slide.querySelector('img').src;
      lightbox.classList.add('open');
    });
  });
  if (lbClose) lbClose.addEventListener('click', () => lightbox.classList.remove('open'));
  if (lightbox) lightbox.addEventListener('click', e => {
    if (e.target === lightbox) lightbox.classList.remove('open');
  });

})();
