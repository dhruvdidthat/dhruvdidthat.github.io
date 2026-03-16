/* =============================================
   LOADER
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 800);
});

/* =============================================
   CURSOR — loaded via shared cursor.js
   (see js/cursor.js)
   ============================================= */

/* =============================================
   NAVBAR SCROLL STATE
   ============================================= */

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* =============================================
   SCROLL REVEAL (IntersectionObserver)
   ============================================= */

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = `${i * 0.08}s`;
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

/* =============================================
   CHOICE PARALLAX (floating + video)
   ============================================= */

document.querySelectorAll('.choice').forEach(choice => {

  choice.addEventListener('mousemove', e => {
    const rect  = choice.getBoundingClientRect();
    const moveX = (e.clientX - rect.left) / rect.width  * 38 - 19;
    const moveY = (e.clientY - rect.top)  / rect.height * 38 - 19;

    const floating = choice.querySelector('.floating');
    const video    = choice.querySelector('.bg-video');

    if (floating) floating.style.transform =
      `translate3d(${moveX}px,${moveY}px,0) rotateY(${moveX/2.5}deg) rotateX(${-moveY/4}deg)`;
    if (video) video.style.transform =
      `translate3d(${-moveX*.4}px,${-moveY*.4}px,0) scale(1.12)`;
  });

  choice.addEventListener('mouseleave', () => {
    const floating = choice.querySelector('.floating');
    const video    = choice.querySelector('.bg-video');
    if (floating) {
      floating.style.transition = 'transform .7s cubic-bezier(.16,1,.3,1),filter .4s';
      floating.style.transform  = 'translate3d(0,0,0) rotateY(0) rotateX(0)';
    }
    if (video) video.style.transform = 'translate3d(0,0,0) scale(1.05)';
  });

  choice.addEventListener('mouseenter', () => {
    const floating = choice.querySelector('.floating');
    if (floating) floating.style.transition = 'transform .12s ease-out,filter .4s';
  });
});

/* =============================================
   MARQUEE — pause on hover
   ============================================= */

const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  marqueeTrack.addEventListener('mouseenter', () => { marqueeTrack.style.animationPlayState = 'paused'; });
  marqueeTrack.addEventListener('mouseleave', () => { marqueeTrack.style.animationPlayState = 'running'; });
}

/* =============================================
   HERO — subtle vertical parallax
   ============================================= */

const heroVideo = document.querySelector('.hero video');

if (heroVideo) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight)
      heroVideo.style.transform = `translate3d(0,${y * .22}px,0)`;
  }, { passive: true });
}

/* =============================================
   GLITCH on bio name — occasional flicker
   ============================================= */

const bioName = document.querySelector('.bio-name');

if (bioName) {
  const glitch = () => {
    bioName.style.textShadow = '2px 0 rgba(245,196,0,.35), -2px 0 rgba(0,204,255,.2)';
    setTimeout(() => { bioName.style.textShadow = 'none'; }, 80);
    setTimeout(() => { bioName.style.textShadow = '-1px 0 rgba(245,196,0,.2), 1px 0 rgba(255,0,60,.1)'; }, 120);
    setTimeout(() => { bioName.style.textShadow = 'none'; }, 180);
    setTimeout(glitch, 5000 + Math.random() * 4000);
  };
  setTimeout(glitch, 3000);
}