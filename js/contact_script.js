/* =============================================
   CONTACT SCRIPT
   ============================================= */

// ── Navbar scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Scroll reveal ──
const observer = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.style.transitionDelay = `${i * 0.1}s`;
      e.target.classList.add('revealed');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

// ── Char counter ──
const textarea  = document.getElementById('message');
const charCount = document.getElementById('charCount');
const MAX_CHARS = 1000;

if (textarea && charCount) {
  textarea.addEventListener('input', () => {
    const len = textarea.value.length;
    charCount.textContent = `${len} / ${MAX_CHARS}`;
    charCount.className = 'char-count';
    if (len > MAX_CHARS * 0.85) charCount.classList.add('near-limit');
    if (len >= MAX_CHARS)        charCount.classList.add('at-limit');
    if (len > MAX_CHARS) textarea.value = textarea.value.slice(0, MAX_CHARS);
  });
}

// ── Form submission (async Formspree) ──
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const btnText    = submitBtn?.querySelector('.btn-text');
const btnIcon    = submitBtn?.querySelector('.btn-icon');
const btnLoading = submitBtn?.querySelector('.btn-loading');
const successEl  = document.getElementById('formSuccess');
const errorEl    = document.getElementById('formError');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic client-side validation
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const subject = form.subject.value;
    const message = form.message.value.trim();

    if (!name || !email || !subject || !message) {
      shakeForm();
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      highlightField('email', 'Please enter a valid email address.');
      return;
    }

    // Loading state
    setLoading(true);
    if (errorEl) errorEl.style.display = 'none';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        // Success
        form.style.display = 'none';
        if (successEl) successEl.style.display = 'flex';
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      setLoading(false);
      if (errorEl) errorEl.style.display = 'block';
    }
  });
}

function setLoading(loading) {
  if (!submitBtn) return;
  submitBtn.disabled = loading;
  if (btnText)    btnText.style.display    = loading ? 'none'  : 'inline';
  if (btnIcon)    btnIcon.style.display    = loading ? 'none'  : 'inline';
  if (btnLoading) btnLoading.style.display = loading ? 'inline': 'none';
}

function shakeForm() {
  form.style.animation = 'none';
  form.offsetHeight; // reflow
  form.style.animation = 'shake .4s ease';
}

function highlightField(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.borderColor = '#e8003d';
  el.focus();
  el.addEventListener('input', () => { el.style.borderColor = ''; }, { once: true });
}

function resetForm() {
  if (form)       form.style.display      = '';
  if (successEl)  successEl.style.display = 'none';
  if (errorEl)    errorEl.style.display   = 'none';
  form?.reset();
  if (charCount) charCount.textContent = '0 / 1000';
  setLoading(false);
}

// ── Shake animation ──
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform:translateX(0); }
    20%      { transform:translateX(-8px); }
    40%      { transform:translateX(8px); }
    60%      { transform:translateX(-4px); }
    80%      { transform:translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);

// ── Input focus line animation ──
document.querySelectorAll('.field-group input, .field-group textarea, .field-group select').forEach(el => {
  el.addEventListener('focus',  () => el.parentElement.classList.add('focused'));
  el.addEventListener('blur',   () => el.parentElement.classList.remove('focused'));
});