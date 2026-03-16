/* =============================================
   cursor.js — shared across all pages
   Identical approach to film page (which works).
   Sets left/top directly; CSS handles the -50% centering.
   ============================================= */

(function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursorTrail');
  if (!cursor || !trail) return;

  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  }, { passive: true });

  function animateTrail() {
    trailX += (mouseX - trailX) * 0.14;
    trailY += (mouseY - trailY) * 0.14;
    trail.style.left = trailX + 'px';
    trail.style.top  = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    trail.style.opacity  = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    trail.style.opacity  = '1';
  });
})();