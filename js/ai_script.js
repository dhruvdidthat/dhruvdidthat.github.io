/* ─────────────────────────────────────────
   ai_script.js — Dhruv Kumar AI Portfolio
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
}, { passive: true });

// ── Hamburger Menu ──────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

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
        ${data.updated_at ? `<span class="gh-stat"><i class="fas fa-clock"></i>Updated ${new Date(data.updated_at).toLocaleDateString('en-GB',{month:'short',year:'numeric'})}</span>` : ''}
      `;
    }
  } catch (e) {
    if (descEl)  descEl.textContent = 'Visit GitHub to explore this repository.';
    if (statsEl) statsEl.innerHTML  = `<span class="gh-stat"><i class="fab fa-github"></i>SnookyDru</span>`;
  }
}

document.querySelectorAll('.github-embed[data-repo]').forEach(card => {
  fetchGitHubRepo(card.dataset.repo, card);
});

// ── Active nav link highlight ───────────────────
const sections   = document.querySelectorAll('section[id]');
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

// ── Codeforces Section ──────────────────────────
(async function loadCodeforces() {
  const CF_HANDLE = 'pvt.dhruvkumar';

  const rankColour = {
    newbie: '#808080', pupil: '#008000', specialist: '#03a89e',
    expert: '#0000ff', 'candidate master': '#aa00aa', master: '#ff8c00',
    'international master': '#ff8c00', grandmaster: '#ff0000',
    'international grandmaster': '#ff0000', 'legendary grandmaster': '#ff0000',
  };

  try {
    const infoRes = await fetch(`https://codeforces.com/api/user.info?handles=${CF_HANDLE}`);
    const info    = await infoRes.json();
    if (info.status === 'OK') {
      const u = info.result[0];
      if (u.titlePhoto || u.avatar) {
        const img = document.getElementById('cf-avatar');
        img.src = u.titlePhoto || u.avatar;
        img.style.display = 'block';
        document.getElementById('cf-avatar-fallback').style.display = 'none';
      }
      document.getElementById('cf-handle').textContent = u.handle;
      const rankEl = document.getElementById('cf-rank');
      const rank   = u.rank || 'Unrated';
      rankEl.textContent = rank.charAt(0).toUpperCase() + rank.slice(1);
      rankEl.style.color       = rankColour[rank.toLowerCase()] || 'var(--green)';
      rankEl.style.borderColor = rankColour[rank.toLowerCase()] || 'rgba(57,255,20,0.4)';
      if (u.rating)    document.getElementById('cf-rating').textContent    = u.rating;
      if (u.maxRating) document.getElementById('cf-max-rating').textContent = u.maxRating;
    }
  } catch(e) {}

  try {
    const subRes  = await fetch(`https://codeforces.com/api/user.status?handle=${CF_HANDLE}&from=1&count=10000`);
    const subData = await subRes.json();
    if (subData.status === 'OK') {
      const now   = Math.floor(Date.now() / 1000);
      const start = now - 52 * 7 * 86400;
      const dayCounts = {};
      let totalSolved = new Set();

      subData.result.forEach(s => {
        if (s.creationTimeSeconds >= start) {
          const day = Math.floor(s.creationTimeSeconds / 86400);
          dayCounts[day] = (dayCounts[day] || 0) + 1;
        }
        if (s.verdict === 'OK') totalSolved.add(`${s.problem.contestId}${s.problem.index}`);
      });

      document.getElementById('cf-solved').textContent = totalSolved.size;

      const max        = Math.max(1, ...Object.values(dayCounts));
      const heatmapEl  = document.getElementById('cf-heatmap');
      heatmapEl.innerHTML = '';
      const startDay   = Math.floor(start / 86400);
      const todayDay   = Math.floor(now   / 86400);

      for (let w = 0; w < 52; w++) {
        const weekEl = document.createElement('div');
        weekEl.className = 'cf-week';
        for (let d = 0; d < 7; d++) {
          const day  = startDay + w * 7 + d;
          const cell = document.createElement('div');
          cell.className = 'cf-cell';
          if (day <= todayDay) {
            const count   = dayCounts[day] || 0;
            const opacity = count === 0 ? 0.06 : 0.18 + (count / max) * 0.82;
            const date    = new Date(day * 86400 * 1000).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
            cell.style.background = `rgba(57,255,20,${opacity.toFixed(2)})`;
            cell.title = `${date}: ${count} submission${count !== 1 ? 's' : ''}`;
          }
          weekEl.appendChild(cell);
        }
        heatmapEl.appendChild(weekEl);
      }
    }
  } catch(e) {
    document.getElementById('cf-heatmap').innerHTML = '<span class="cf-loading">Could not load activity data.</span>';
  }

  try {
    const ratingRes  = await fetch(`https://codeforces.com/api/user.rating?handle=${CF_HANDLE}`);
    const ratingData = await ratingRes.json();
    if (ratingData.status === 'OK' && ratingData.result.length > 0) {
      document.getElementById('cf-contests').textContent = ratingData.result.length;
      drawRatingChart(ratingData.result);
    } else {
      document.getElementById('cf-contests').textContent = '0';
      const nc = document.getElementById('cf-no-contests');
      if (nc) nc.style.display = 'block';
    }
  } catch(e) {
    const nc = document.getElementById('cf-no-contests');
    if (nc) nc.style.display = 'block';
  }

  function drawRatingChart(contests) {
    const canvas = document.getElementById('cf-rating-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W   = canvas.offsetWidth || 800;
    const H   = 130;
    canvas.width  = W;
    canvas.height = H;

    const ratings = contests.map(c => c.newRating);
    const minR  = Math.min(...ratings) - 50;
    const maxR  = Math.max(...ratings) + 50;
    const pad   = { t:16, b:20, l:10, r:10 };
    const chartW = W - pad.l - pad.r;
    const chartH = H - pad.t - pad.b;
    const xOf = i => pad.l + (i / (ratings.length - 1 || 1)) * chartW;
    const yOf = r => pad.t + (1 - (r - minR) / (maxR - minR)) * chartH;

    const grad = ctx.createLinearGradient(0, pad.t, 0, H);
    grad.addColorStop(0, 'rgba(57,255,20,.22)');
    grad.addColorStop(1, 'rgba(57,255,20,0)');

    ctx.beginPath();
    ctx.moveTo(xOf(0), yOf(ratings[0]));
    ratings.forEach((r, i) => { if (i > 0) ctx.lineTo(xOf(i), yOf(r)); });
    ctx.lineTo(xOf(ratings.length - 1), H);
    ctx.lineTo(xOf(0), H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(xOf(0), yOf(ratings[0]));
    ratings.forEach((r, i) => { if (i > 0) ctx.lineTo(xOf(i), yOf(r)); });
    ctx.strokeStyle = '#39ff14';
    ctx.lineWidth   = 2;
    ctx.stroke();

    ratings.forEach((r, i) => {
      ctx.beginPath();
      ctx.arc(xOf(i), yOf(r), 3, 0, Math.PI * 2);
      ctx.fillStyle = '#39ff14';
      ctx.fill();
    });

    const last = ratings[ratings.length - 1];
    ctx.font      = `11px 'Share Tech Mono', monospace`;
    ctx.fillStyle = '#39ff14';
    ctx.textAlign = 'right';
    ctx.fillText(last, xOf(ratings.length - 1) - 6, yOf(last) - 6);
  }
})();