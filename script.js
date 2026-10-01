/**
 * ==========================================================================
 * ROMANTIC 4TH ANNIVERSARY INTERACTIVE SCRIPT - NANDHINI MAHESH & HARI PRASATH
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientParticles();
  initCursorTrail();
  initStoryNavigation();
  initCakeCuttingExperience();
  initInteractiveEnvelope();
  initTimelineAndPlaceholders();
  initAudioEngine();
  initModalsAndSurprises();
  initScrollAnimations();
});

/* ==========================================================================
   1. AMBIENT PARTICLES CANVAS (FLOATING HEARTS & SPARKLES)
   ========================================================================== */

function initAmbientParticles() {
  const canvas = document.getElementById('ambientCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(35, Math.floor(width / 35));

  const colors = [
    'rgba(244, 114, 182, 0.6)',  // Pink
    'rgba(192, 132, 252, 0.55)', // Lavender
    'rgba(253, 224, 71, 0.5)',   // Gold
    'rgba(251, 113, 133, 0.65)', // Rose
    'rgba(255, 255, 255, 0.4)'   // White shimmer
  ];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 50;
      this.size = Math.random() * 12 + 8;
      this.speedY = Math.random() * 0.8 + 0.3;
      this.speedX = Math.sin(Math.random() * Math.PI * 2) * 0.4;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.opacity = Math.random() * 0.6 + 0.2;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      this.isHeart = Math.random() > 0.4;
      this.sway = Math.random() * 0.02;
      this.swayCount = Math.random() * 100;
    }

    update() {
      this.y -= this.speedY;
      this.swayCount += this.sway;
      this.x += Math.sin(this.swayCount) * 0.6 + this.speedX;
      this.rotation += this.rotationSpeed;

      if (this.y < -30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      if (this.isHeart) {
        ctx.fillStyle = this.color;
        const s = this.size * 0.45;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.3);
        ctx.bezierCurveTo(-s, -s * 0.6, -s * 1.4, s * 0.3, 0, s * 1.3);
        ctx.bezierCurveTo(s * 1.4, s * 0.3, s, -s * 0.6, 0, s * 0.3);
        ctx.fill();
      } else {
        // Soft glowing star/circle
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.25, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    const p = new Particle();
    p.y = Math.random() * height; // Distribute across screen initially
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. INTERACTIVE CURSOR TRAIL CANVAS (SPARKLES & HEARTS ON HOVER/TOUCH)
   ========================================================================== */

function initCursorTrail() {
  const canvas = document.getElementById('cursorTrailCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const trail = [];

  function addPoint(x, y) {
    if (trail.length > 25) trail.shift();
    trail.push({
      x,
      y,
      size: Math.random() * 10 + 6,
      opacity: 1,
      color: Math.random() > 0.5 ? '#f472b6' : '#c084fc',
      shape: Math.random() > 0.4 ? 'heart' : 'sparkle'
    });
  }

  window.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.3) {
      addPoint(e.clientX, e.clientY);
    }
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0 && Math.random() > 0.3) {
      addPoint(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  function drawTrail() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < trail.length; i++) {
      const p = trail[i];
      p.opacity -= 0.025;
      p.size *= 0.96;
      p.y -= 0.5;

      if (p.opacity > 0) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === 'heart') {
          const s = p.size * 0.5;
          ctx.beginPath();
          ctx.moveTo(0, s * 0.3);
          ctx.bezierCurveTo(-s, -s * 0.6, -s * 1.4, s * 0.3, 0, s * 1.3);
          ctx.bezierCurveTo(s * 1.4, s * 0.3, s, -s * 0.6, 0, s * 0.3);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // Clean up dead points
    for (let i = trail.length - 1; i >= 0; i--) {
      if (trail[i].opacity <= 0) {
        trail.splice(i, 1);
      }
    }

    requestAnimationFrame(drawTrail);
  }

  drawTrail();
}

/* ==========================================================================
   3. STORY NAVIGATION & PROGRESS INDICATOR
   ========================================================================== */

function initStoryNavigation() {
  const sections = document.querySelectorAll('.story-section');
  const dotBtns = document.querySelectorAll('.dot-btn');
  const chapterIndicator = document.getElementById('chapterIndicator');
  const chapterName = document.getElementById('chapterName');

  const scrollIndicators = document.querySelectorAll('.scroll-indicator');
  scrollIndicators.forEach(ind => {
    ind.addEventListener('click', () => {
      const targetId = ind.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  dotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Scroll Spy for Chapters
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -40% 0px',
    threshold: 0.2
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const chapter = entry.target.getAttribute('data-chapter') || '01';
        const title = entry.target.getAttribute('data-title') || 'Our Story';

        if (chapterIndicator) chapterIndicator.textContent = `${chapter} / 08`;
        if (chapterName) chapterName.textContent = title;

        dotBtns.forEach(b => {
          if (b.getAttribute('data-target') === id) {
            b.classList.add('active');
          } else {
            b.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   4. PAGE 1 — THE CAKE SURPRISE & CELEBRATION CUTTING
   ========================================================================== */

function initCakeCuttingExperience() {
  const cutCakeBtn = document.getElementById('cutCakeBtn');
  const cakeContainer = document.getElementById('cakeContainer');
  const anniversaryCake = document.getElementById('anniversaryCake');
  const celebrationToast = document.getElementById('celebrationToast');
  const beginStoryBtn = document.getElementById('beginStoryBtn');
  const flames = document.querySelectorAll('.flame');

  let isCut = false;

  function performCakeCut() {
    if (isCut) return;
    isCut = true;

    // Play subtle chime / celebrate
    playCelebrationChime();

    // Trigger cutting animation on cake
    anniversaryCake.classList.add('cutting');

    // Blow / animate candles
    setTimeout(() => {
      flames.forEach(f => f.classList.add('blown-out'));
    }, 400);

    // After slice cut finishes
    setTimeout(() => {
      anniversaryCake.classList.remove('cutting');
      anniversaryCake.classList.add('cut-completed');

      // Trigger Confetti Explosion
      createCelebrationConfetti();

      // Show celebratory toast
      celebrationToast.classList.add('show');
    }, 800);
  }

  if (cutCakeBtn) {
    cutCakeBtn.addEventListener('click', performCakeCut);
  }

  if (cakeContainer) {
    cakeContainer.addEventListener('click', performCakeCut);
  }

  if (beginStoryBtn) {
    beginStoryBtn.addEventListener('click', () => {
      const page2 = document.getElementById('page-2');
      if (page2) {
        page2.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

// Celebration Confetti Cannon (Zero external dependencies)
function createCelebrationConfetti() {
  const count = 75;
  const colors = ['#f472b6', '#fb7185', '#c084fc', '#fde047', '#ffffff', '#e11d48'];
  const symbols = ['💖', '✨', '🌸', '🎂', '💕', '⭐'];

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.left = '50%';
    el.style.top = '50%';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '99999';
    el.style.userSelect = 'none';

    if (Math.random() > 0.4) {
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.fontSize = `${Math.random() * 18 + 14}px`;
    } else {
      el.style.width = `${Math.random() * 10 + 6}px`;
      el.style.height = `${Math.random() * 10 + 6}px`;
      el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    }

    document.body.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 320 + 80;
    const destX = Math.cos(angle) * distance;
    const destY = Math.sin(angle) * distance - Math.random() * 100;
    const rot = Math.random() * 720 - 360;

    el.animate([
      { transform: 'translate(-50%, -50%) scale(0.2) rotate(0deg)', opacity: 1 },
      { transform: `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) scale(1.1) rotate(${rot}deg)`, opacity: 0.9, offset: 0.6 },
      { transform: `translate(calc(-50% + ${destX}px), calc(-50% + ${destY + 120}px)) scale(0.6) rotate(${rot + 180}deg)`, opacity: 0 }
    ], {
      duration: Math.random() * 1400 + 1200,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    }).onfinish = () => el.remove();
  }
}

/* ==========================================================================
   5. PAGE 3 & 4 — INTERACTIVE ENVELOPE & LETTER UNFOLD
   ========================================================================== */

function initInteractiveEnvelope() {
  const envelopeBox = document.getElementById('envelopeBox');
  const envelopeGlow = document.getElementById('envelopeGlow');

  if (!envelopeBox) return;

  let isOpened = false;

  function openEnvelope() {
    if (isOpened) return;
    isOpened = true;

    envelopeBox.classList.add('opened');
    if (envelopeGlow) {
      envelopeGlow.style.width = '600px';
      envelopeGlow.style.height = '450px';
      envelopeGlow.style.background = 'radial-gradient(circle, rgba(244, 114, 182, 0.5) 0%, rgba(253, 224, 71, 0.3) 50%, transparent 70%)';
    }

    createCelebrationConfetti();
    playCelebrationChime();

    // Smooth transition to Page 4 (The Love Letter)
    setTimeout(() => {
      const page4 = document.getElementById('page-4');
      if (page4) {
        page4.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1100);
  }

  envelopeBox.addEventListener('click', openEnvelope);
  envelopeBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEnvelope();
    }
  });
}

/* ==========================================================================
   6. TIMELINE, POLAROID LIGHTBOX & CLIENT-SIDE PHOTO UPLOADS
   ========================================================================== */

function initTimelineAndPlaceholders() {
  const polaroids = document.querySelectorAll('.polaroid-card:not(.placeholder-card)');
  const placeholderCards = document.querySelectorAll('.placeholder-card');
  const imageModal = document.getElementById('imageModal');
  const closeImageModal = document.getElementById('closeImageModal');
  const modalImg = document.getElementById('modalImg');
  const modalDate = document.getElementById('modalDate');
  const modalTitle = document.getElementById('modalTitle');
  const modalQuote = document.getElementById('modalQuote');
  const modalPhotoInput = document.getElementById('modalPhotoInput');

  let currentActiveCard = null;

  // Load saved local custom photos if any exist in localStorage
  loadCustomStoredPhotos();

  // Click polaroid to view enlarged
  polaroids.forEach(card => {
    card.addEventListener('click', () => {
      currentActiveCard = card;
      const img = card.querySelector('.polaroid-img');
      const date = card.querySelector('.photo-date')?.textContent || '';
      const title = card.querySelector('.photo-title')?.textContent || '';
      const quote = card.querySelector('.photo-quote')?.textContent || '';

      if (modalImg && img) modalImg.src = img.src;
      if (modalDate) modalDate.textContent = date;
      if (modalTitle) modalTitle.textContent = title;
      if (modalQuote) modalQuote.textContent = quote;

      if (imageModal) {
        imageModal.classList.add('show');
        imageModal.setAttribute('aria-hidden', 'false');
      }
    });
  });

  // Placeholder cards click triggers file upload directly
  placeholderCards.forEach(card => {
    const fileInput = card.querySelector('.photo-upload-input');
    const frame = card.querySelector('.placeholder-frame');

    card.addEventListener('click', (e) => {
      // If image is already populated, open modal; else trigger file upload
      const existingImg = card.querySelector('.polaroid-img');
      if (existingImg) {
        currentActiveCard = card;
        const date = card.querySelector('.photo-date')?.textContent || '';
        const title = card.querySelector('.photo-title')?.textContent || '';
        const quote = card.querySelector('.photo-quote')?.textContent || '';

        if (modalImg) modalImg.src = existingImg.src;
        if (modalDate) modalDate.textContent = date;
        if (modalTitle) modalTitle.textContent = title;
        if (modalQuote) modalQuote.textContent = quote;

        if (imageModal) {
          imageModal.classList.add('show');
          imageModal.setAttribute('aria-hidden', 'false');
        }
      } else if (fileInput) {
        fileInput.click();
      }
    });

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const dataUrl = event.target.result;
            const slotId = card.getAttribute('data-slot-id');
            setCardImage(card, dataUrl);
            try {
              localStorage.setItem(`anniversary_photo_${slotId}`, dataUrl);
            } catch (err) {
              console.warn('LocalStorage limit reached for custom photo', err);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  });

  // Modal custom photo replace
  if (modalPhotoInput) {
    modalPhotoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && currentActiveCard) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          if (modalImg) modalImg.src = dataUrl;
          setCardImage(currentActiveCard, dataUrl);
          const imgId = currentActiveCard.getAttribute('data-img-id') || currentActiveCard.getAttribute('data-slot-id');
          if (imgId) {
            try {
              localStorage.setItem(`anniversary_photo_${imgId}`, dataUrl);
            } catch (err) {
              console.warn('LocalStorage limit', err);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (closeImageModal && imageModal) {
    closeImageModal.addEventListener('click', () => {
      imageModal.classList.remove('show');
      imageModal.setAttribute('aria-hidden', 'true');
    });

    imageModal.addEventListener('click', (e) => {
      if (e.target === imageModal) {
        imageModal.classList.remove('show');
        imageModal.setAttribute('aria-hidden', 'true');
      }
    });
  }

  function setCardImage(cardEl, src) {
    let img = cardEl.querySelector('.polaroid-img');
    const frame = cardEl.querySelector('.polaroid-img-frame');
    if (!img && frame) {
      frame.innerHTML = `<img src="${src}" alt="Memory" class="polaroid-img"><div class="photo-overlay-zoom"><span>🔍 View</span></div>`;
      cardEl.classList.remove('placeholder-card');
    } else if (img) {
      img.src = src;
    }
  }

  function loadCustomStoredPhotos() {
    document.querySelectorAll('[data-slot-id], [data-img-id]').forEach(card => {
      const id = card.getAttribute('data-slot-id') || card.getAttribute('data-img-id');
      const saved = localStorage.getItem(`anniversary_photo_${id}`);
      if (saved) {
        setCardImage(card, saved);
      }
    });
  }
}

/* ==========================================================================
   7. ROMANTIC AUDIO ENGINE (BUILT-IN SYNTHESIZER + AUDIO ELEMENT)
   ========================================================================== */

let audioCtx = null;
let synthInterval = null;
let isMusicPlaying = false;

function initAudioEngine() {
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const bgAudio = document.getElementById('bgAudio');
  const customAudioInput = document.getElementById('customAudioInput');

  if (!musicToggleBtn) return;

  function toggleMusic() {
    if (!isMusicPlaying) {
      startMusic();
    } else {
      pauseMusic();
    }
  }

  function startMusic() {
    isMusicPlaying = true;
    musicToggleBtn.classList.add('playing');

    // Attempt HTML5 audio first
    if (bgAudio) {
      bgAudio.play().then(() => {
        // Successfully playing
      }).catch(err => {
        console.log('Audio file stream blocked/pending; starting WebAudio romantic acoustic synth engine...', err);
        startDreamyRomanticSynth();
      });
    } else {
      startDreamyRomanticSynth();
    }
  }

  function pauseMusic() {
    isMusicPlaying = false;
    musicToggleBtn.classList.remove('playing');
    if (bgAudio) bgAudio.pause();
    stopDreamyRomanticSynth();
  }

  musicToggleBtn.addEventListener('click', toggleMusic);

  // Allow uploading a custom couple song MP3
  if (customAudioInput && bgAudio) {
    customAudioInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const fileUrl = URL.createObjectURL(file);
        bgAudio.src = fileUrl;
        stopDreamyRomanticSynth();
        startMusic();
      }
    });
  }
}

// Built-in Pure Web Audio API Romantic Lullaby Piano Synthesizer
function startDreamyRomanticSynth() {
  if (synthInterval) return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    // Romantic chord progression frequencies (Canon in D / Romantic Love Progression in C Major)
    // C - G - Am - Em - F - C - F - G
    const chords = [
      [261.63, 329.63, 392.00, 523.25], // C major
      [196.00, 246.94, 293.66, 392.00], // G major
      [220.00, 261.63, 329.63, 440.00], // A minor
      [164.81, 196.00, 246.94, 329.63], // E minor
      [174.61, 220.00, 261.63, 349.23], // F major
      [261.63, 329.63, 392.00, 523.25], // C major
      [174.61, 220.00, 261.63, 349.23], // F major
      [196.00, 246.94, 293.66, 392.00]  // G major
    ];

    let chordIdx = 0;
    let noteIdx = 0;

    function playNextPianoNote() {
      if (!isMusicPlaying || !audioCtx) return;

      const currentChord = chords[chordIdx];
      const freq = currentChord[noteIdx % currentChord.length];

      playGentleTone(freq, 0.8);

      noteIdx++;
      if (noteIdx >= 4) {
        noteIdx = 0;
        chordIdx = (chordIdx + 1) % chords.length;
      }
    }

    synthInterval = setInterval(playNextPianoNote, 480);
  } catch (e) {
    console.warn('WebAudio Synth error:', e);
  }
}

function stopDreamyRomanticSynth() {
  if (synthInterval) {
    clearInterval(synthInterval);
    synthInterval = null;
  }
}

function playGentleTone(freq, duration = 0.8) {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    // Ignore audio context errors
  }
}

function playCelebrationChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.9);
      }, idx * 120);
    });
  } catch (err) {}
}

/* ==========================================================================
   8. MODALS & SURPRISES (SURPRISE LOVE NOTES, BEATING HEART EXPLOSION)
   ========================================================================== */

function initModalsAndSurprises() {
  const grandHeartBtn = document.getElementById('grandHeartBtn');
  const replayStoryBtn = document.getElementById('replayStoryBtn');
  const loveSurpriseBtn = document.getElementById('loveSurpriseBtn');
  const loveNoteModal = document.getElementById('loveNoteModal');
  const closeNoteModal = document.getElementById('closeNoteModal');
  const nextLoveNoteBtn = document.getElementById('nextLoveNoteBtn');
  const surpriseNoteNumber = document.getElementById('surpriseNoteNumber');
  const surpriseNoteTitle = document.getElementById('surpriseNoteTitle');
  const surpriseNoteContent = document.getElementById('surpriseNoteContent');

  // Interactive Beating Heart Explosion
  if (grandHeartBtn) {
    grandHeartBtn.addEventListener('click', () => {
      createCelebrationConfetti();
      playCelebrationChime();
      grandHeartBtn.style.transform = 'scale(1.35)';
      setTimeout(() => {
        grandHeartBtn.style.transform = '';
      }, 300);
    });
  }

  // Replay Story Button
  if (replayStoryBtn) {
    replayStoryBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Surprise Love Notes Dedicated to Nandhini
  const loveNotes = [
    {
      num: 'Love Note #01',
      title: 'Your Beautiful Soul',
      text: '“Every time you smile, the heaviest days become light. You are my calm in every storm.”'
    },
    {
      num: 'Love Note #02',
      title: 'Four Years of Grace',
      text: '“Loving you for four years has been the easiest, most natural, and most blessed thing I have ever done.”'
    },
    {
      num: 'Love Note #03',
      title: 'The Unshakable Promise',
      text: '“Through every high, every low, and every quiet ordinary day, my heart will always beat for Nandhini.”'
    },
    {
      num: 'Love Note #04',
      title: 'My Forever Home',
      text: '“They say home is a place, but for me, home has always been wherever your hand touches mine.”'
    },
    {
      num: 'Love Note #05',
      title: 'A Gift from Above',
      text: '“God gave me many things in life, but giving me you is the greatest blessing I will ever cherish.”'
    },
    {
      num: 'Love Note #06',
      title: 'To All Our Tomorrows',
      text: '“Four years down, a lifetime to go. I love you more than words could ever hold, Nandhini. ❤️”'
    }
  ];

  let currentNoteIdx = 0;

  function showNote(idx) {
    const note = loveNotes[idx];
    if (surpriseNoteNumber) surpriseNoteNumber.textContent = note.num;
    if (surpriseNoteTitle) surpriseNoteTitle.textContent = note.title;
    if (surpriseNoteContent) surpriseNoteContent.textContent = note.text;
  }

  if (loveSurpriseBtn && loveNoteModal) {
    loveSurpriseBtn.addEventListener('click', () => {
      showNote(currentNoteIdx);
      loveNoteModal.classList.add('show');
      loveNoteModal.setAttribute('aria-hidden', 'false');
      createCelebrationConfetti();
    });
  }

  if (nextLoveNoteBtn) {
    nextLoveNoteBtn.addEventListener('click', () => {
      currentNoteIdx = (currentNoteIdx + 1) % loveNotes.length;
      showNote(currentNoteIdx);
      playCelebrationChime();
    });
  }

  if (closeNoteModal && loveNoteModal) {
    closeNoteModal.addEventListener('click', () => {
      loveNoteModal.classList.remove('show');
      loveNoteModal.setAttribute('aria-hidden', 'true');
    });

    loveNoteModal.addEventListener('click', (e) => {
      if (e.target === loveNoteModal) {
        loveNoteModal.classList.remove('show');
        loveNoteModal.setAttribute('aria-hidden', 'true');
      }
    });
  }
}

/* ==========================================================================
   9. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */

function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => scrollObserver.observe(el));
}
