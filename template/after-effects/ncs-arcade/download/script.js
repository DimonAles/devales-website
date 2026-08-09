const CONFIG = {
  serverUrl: "https://secure-gate-api-y71k.onrender.com",

  videoId: "epp24n91fZo",
  brandWord: "",
  brandSub: "",

  templateName: "NCS Arcade Audio Spectrum Template | After Effects",
  templateDescription: "from SUPER PLAY [MUSIC]",

  tasks: [
    { type: "subscribe", name: "SUPER PLAY [MUSIC]", url: "https://www.youtube.com/@SUPERPLAYMUSIC?sub_confirmation=1" },
    { type: "subscribe", name: "DevAles", url: "https://www.youtube.com/@DevAlesX?sub_confirmation=1" },
    { type: "subscribe", name: "TRAP SUPER PLAY", url: "https://www.youtube.com/@trapsuperplay?sub_confirmation=1" },
    { type: "subscribe", name: "NCS Arcade", url: "https://www.youtube.com/@NCSArcade?sub_confirmation=1" },
    { type: "like", name: "Like YouTube Video", url: "https://www.youtube.com/watch?v=epp24n91fZo" }
  ],

  socialLinks: {
    youtube:   "https://www.youtube.com/c/SUPERPLAYMUSIC",
    instagram: "https://www.instagram.com/super_play2020",
    tiktok:    "https://vm.tiktok.com/ZMR4wgfka",
    twitter:   "https://x.com/superplaycounts",
    discord:   "https://discord.gg/Dvhm44cfUE",
    telegram:  "https://t.me/SPM_YT"
  },

  poweredByText: "DevAles"
};

const bgImg = document.getElementById('bgImg');
const thumbImg = document.getElementById('thumb');
const primaryThumb = `https://img.youtube.com/vi/${CONFIG.videoId}/maxresdefault.jpg`;
const fallbackThumb = `https://img.youtube.com/vi/${CONFIG.videoId}/hqdefault.jpg`;

bgImg.src = primaryThumb;
bgImg.onerror = () => { bgImg.src = fallbackThumb; };

thumbImg.src = primaryThumb;
thumbImg.onerror = () => { thumbImg.src = fallbackThumb; };

document.getElementById('templateName').textContent = CONFIG.templateName;
document.getElementById('templateDesc').textContent = CONFIG.templateDescription;

document.getElementById('previewBtn').addEventListener('click', () => {
  const embedUrl = `https://www.youtube-nocookie.com/embed/${CONFIG.videoId}?autoplay=1&rel=0&enablejsapi=1`;
  document.getElementById('ytFrame').src = embedUrl;
  document.getElementById('videoWrap').hidden = false;
  document.getElementById('previewBtn').style.display = 'none';
});

const followEl = document.getElementById('follow');
const iconMap = {
  youtube:   'fa-youtube',
  instagram: 'fa-instagram',
  tiktok:    'fa-tiktok',
  twitter:   'fa-x-twitter',
  discord:   'fa-discord',
  telegram:  'fa-telegram'
};
followEl.innerHTML = '<span>Follow us</span>' + Object.entries(CONFIG.socialLinks).map(([k, url]) =>
  `<a href="${url}" target="_blank" rel="noopener" aria-label="${k}"><i class="fa-brands ${iconMap[k]}"></i></a>`
).join('');

const completedTasks = new Set();
const channelsEl = document.getElementById('channels');
const progressFill = document.getElementById('progressFill');
const expandPanel = document.getElementById('expandPanel');
const ctaBtn = document.getElementById('ctaBtn');
const ctaLabel = document.getElementById('ctaLabel');
const lockIcon = document.getElementById('lockIcon');
let unlocked = false;

CONFIG.tasks.forEach((task, i) => {
  const btn = document.createElement('button');
  btn.className = 'sub-btn';
  btn.type = 'button';

  const isLike = task.type === 'like';
  const iconClass = isLike ? 'fa-solid fa-thumbs-up' : 'fa-brands fa-youtube';
  const labelText = isLike ? `Like: ${task.name}` : `Subscribe: ${task.name}`;

  btn.innerHTML = `
    <i class="${iconClass}"></i>
    <span class="label">${labelText}</span>
    <i class="fa-solid fa-check check-icon"></i>
  `;
  btn.addEventListener('click', () => handleTask(i, btn, task));
  channelsEl.appendChild(btn);
});

function handleTask(i, btn, task) {
  if (completedTasks.has(i)) return;
  window.open(task.url, '_blank', 'noopener');

  completedTasks.add(i);
  btn.classList.add('done');

  const doneText = task.type === 'like' ? 'Liked' : 'Subscribed';
  btn.querySelector('.label').textContent = doneText;

  const percent = (completedTasks.size / CONFIG.tasks.length) * 100;
  progressFill.style.width = `${percent}%`;

  if (completedTasks.size === CONFIG.tasks.length) {
    setTimeout(unlock, 500);
  }
}

let activeDownloadToken = null;

async function unlock() {
  unlocked = true;
  expandPanel.classList.remove('open');

  try {
    const res = await fetch(`${CONFIG.serverUrl}/api/generate-token`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      activeDownloadToken = data.token;
    }
  } catch (err) {
    console.error('Failed to generate secure unlock token from server:', err);
  }

  ctaBtn.classList.add('shake');
  setTimeout(() => {
    ctaBtn.classList.remove('shake');
    ctaBtn.classList.add('unlocked');
    lockIcon.className = 'fa-solid fa-lock-open lock-i';
    ctaLabel.textContent = 'Download';

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 65,
        startVelocity: 35,
        colors: ['#6a63f5', '#2fe6c4', '#58c9f2'],
        origin: { y: 0.6 }
      });
    }
  }, 450);
}

ctaBtn.addEventListener('click', async () => {
  if (unlocked) {
    if (!activeDownloadToken) {
      try {
        const res = await fetch(`${CONFIG.serverUrl}/api/generate-token`, { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          activeDownloadToken = data.token;
        }
      } catch (err) {
        console.error('Error refreshing download token:', err);
      }
    }

    if (activeDownloadToken) {
      const downloadEndpoint = `${CONFIG.serverUrl}/api/download?token=${activeDownloadToken}`;
      activeDownloadToken = null; // Reset token after use
      window.open(downloadEndpoint, '_blank');
    } else {
      alert('Unable to generate download token. Make sure the server is running!');
    }
    return;
  }
  expandPanel.classList.toggle('open');
});
document.getElementById('closeX').addEventListener('click', () => {
  expandPanel.classList.remove('open');
});
