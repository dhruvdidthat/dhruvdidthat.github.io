/* ─────────────────────────────────────────
   script.js — Dhruv Kumar Portfolio
───────────────────────────────────────── */

// ── Scroll Reveal ──────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Navbar Shrink on Scroll ─────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── Hamburger Menu ──────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── GitHub Repo Embeds ──────────────────────────
async function fetchGitHubRepo(repoPath, card) {
  const nameEl  = card.querySelector('.gh-name');
  const descEl  = card.querySelector('.gh-desc');
  const statsEl = card.querySelector('.gh-stats');

  try {
    const res = await fetch(`https://api.github.com/repos/${repoPath}`);
    if (!res.ok) throw new Error('Not found');
    const data = await res.json();

    if (descEl) descEl.textContent = data.description || 'No description available.';
    if (statsEl) {
      statsEl.innerHTML = `
        <span class="gh-stat"><i class="fas fa-star"></i>${data.stargazers_count}</span>
        <span class="gh-stat"><i class="fas fa-code-branch"></i>${data.forks_count}</span>
        <span class="gh-stat"><i class="fas fa-eye"></i>${data.watchers_count}</span>
        ${data.language ? `<span class="gh-stat"><i class="fas fa-circle"></i>${data.language}</span>` : ''}
        ${data.updated_at ? `<span class="gh-stat"><i class="fas fa-clock"></i>Updated ${new Date(data.updated_at).toLocaleDateString('en-GB', {month:'short', year:'numeric'})}</span>` : ''}
      `;
    }
  } catch (e) {
    if (descEl)  descEl.textContent  = 'Visit GitHub to explore this repository.';
    if (statsEl) statsEl.innerHTML   = `<span class="gh-stat"><i class="fab fa-github"></i>SnookyDru</span>`;
  }
}

// Bind all github-embed elements
document.querySelectorAll('.github-embed[data-repo]').forEach(card => {
  fetchGitHubRepo(card.dataset.repo, card);
});

// ── Active nav link highlight ───────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === `#${entry.target.id}`) {
          a.style.color = 'var(--green)';
        }
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

// ── Smooth cursor-blink fallback ────────────────
// Already handled by CSS animation
