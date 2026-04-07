/* =============================================
   CUSTOM CURSOR
   ============================================= */

const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateTrail() {
  trailX += (mouseX - trailX) * 0.14;
  trailY += (mouseY - trailY) * 0.14;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
  cursorTrail.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
  cursorTrail.style.opacity = '1';
});

/* =============================================
   NAVBAR — scroll state
   ============================================= */

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* =============================================
   SCROLL REVEAL
   ============================================= */

const revealEls = document.querySelectorAll('[data-reveal]');

const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = `${i * 0.06}s`;
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

/* =============================================
   HERO — parallax on scroll
   ============================================= */

const heroVideo = document.querySelector('.hero video');

if (heroVideo) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroVideo.style.transform = `translateY(${y * 0.2}px)`;
    }
  }, { passive: true });
}

/* =============================================
   ALSO TILES — staggered reveal
   ============================================= */

const alsoTiles = document.querySelectorAll('.also-tile');

const tileObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 120);
      tileObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

alsoTiles.forEach(tile => {
  tile.style.opacity = '0';
  tile.style.transform = 'translateY(24px)';
  tile.style.transition = 'opacity .65s cubic-bezier(.16,1,.3,1), transform .65s cubic-bezier(.16,1,.3,1)';
  tileObserver.observe(tile);
});

/* =============================================
   PHOTOGRAPHY MARQUEE LOOP
   ============================================= */

const photoTrack = document.getElementById('photoTrack');

if (photoTrack) {
  const cards = Array.from(photoTrack.children);
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    photoTrack.appendChild(clone);
  });
}