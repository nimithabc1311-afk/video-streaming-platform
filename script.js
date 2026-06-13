// ===========================
// ===== DEFAULT VIDEOS =====
// ===========================

const CAT_ICONS = { Music:'🎵', Sports:'⚽', Education:'📚', Gaming:'🎮', Comedy:'😂', Technology:'💻' };

const DEFAULT_VIDEOS = [
  { id:'v1', title:'Arijit Singh Live Concert 2025', channel:'Music India', category:'Music', youtubeId:'CvFH_6DNRCY', duration:'45:12', desc:'An incredible live performance by Arijit Singh featuring his top hits.', views:152000, likes:8400, uploadedAt:'2026-06-01T10:00:00Z' },
  { id:'v2', title:'IPL Final Match Highlights', channel:'Sports Hub', category:'Sports', youtubeId:'LXb3EKWsInQ', duration:'18:30', desc:'Best moments from the IPL 2025 Final match.', views:320000, likes:15600, uploadedAt:'2026-06-03T14:00:00Z' },
  { id:'v3', title:'Learn JavaScript in 1 Hour', channel:'Code With Nimitha', category:'Education', youtubeId:'W6NZfCO5SIk', duration:'1:02:15', desc:'Complete JavaScript tutorial for absolute beginners. Start coding today!', views:98000, likes:7200, uploadedAt:'2026-05-28T09:00:00Z' },
  { id:'v4', title:'GTA 6 Full Gameplay Walkthrough', channel:'GameZone', category:'Gaming', youtubeId:'QdBZExpgErs', duration:'3:24:00', desc:'Complete GTA 6 gameplay with commentary — missions, secrets and more.', views:540000, likes:32000, uploadedAt:'2026-06-05T11:00:00Z' },
  { id:'v5', title:'Stand-Up Comedy — Best of 2025', channel:'Laugh Factory India', category:'Comedy', youtubeId:'ZbZSe6N_BXs', duration:'52:40', desc:'The funniest stand-up comedy acts from 2025 all in one place.', views:210000, likes:18900, uploadedAt:'2026-06-02T16:00:00Z' },
  { id:'v6', title:'AI & Machine Learning Explained', channel:'TechTalk', category:'Technology', youtubeId:'aircAruvnKk', duration:'22:08', desc:'Simple explanation of AI, Machine Learning and Deep Learning concepts.', views:76000, likes:5100, uploadedAt:'2026-05-30T08:00:00Z' },
  { id:'v7', title:'Bollywood Dance Mashup 2025', channel:'Dance India', category:'Music', youtubeId:'6Ib9MKcBJ4g', duration:'14:50', desc:'Epic Bollywood dance mashup featuring songs from 2025 blockbusters.', views:430000, likes:24500, uploadedAt:'2026-06-06T12:00:00Z' },
  { id:'v8', title:'HTML & CSS Full Course', channel:'Code With Nimitha', category:'Education', youtubeId:'G3e-cpL7ofc', duration:'2:18:33', desc:'Build beautiful websites from scratch with this complete HTML & CSS course.', views:63000, likes:4800, uploadedAt:'2026-05-25T10:00:00Z' },
  { id:'v9', title:'FIFA World Cup Goals Compilation', channel:'Sports Hub', category:'Sports', youtubeId:'aVuvfL8LBXI', duration:'28:15', desc:'All the amazing goals from the FIFA World Cup 2026.', views:890000, likes:52000, uploadedAt:'2026-06-07T18:00:00Z' },
];

// ===== LOAD DATA =====
let videos   = JSON.parse(localStorage.getItem('sz_videos'))   || DEFAULT_VIDEOS;
let saved    = JSON.parse(localStorage.getItem('sz_saved'))    || [];
let liked    = JSON.parse(localStorage.getItem('sz_liked'))    || [];

let currentVideoId = null;
let previousPage   = 'home';

function save() {
  localStorage.setItem('sz_videos', JSON.stringify(videos));
  localStorage.setItem('sz_saved',  JSON.stringify(saved));
  localStorage.setItem('sz_liked',  JSON.stringify(liked));
}

// ===========================
// ===== NAVIGATION =====
// ===========================

function showPage(page, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${page}`).classList.add('active');
  document.querySelectorAll('.btn-nav').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  if (page === 'home')   renderHome();
  if (page === 'browse') renderBrowse();
  if (page === 'saved')  renderSaved();
  if (page === 'admin')  renderAdmin();
  if (page !== 'player') previousPage = page;

  window.scrollTo(0, 0);
}

function goBack() { showPage(previousPage, null); }

function filterCat(cat) {
  showPage('browse', null);
  document.getElementById('filter-cat').value = cat;
  document.getElementById('browse-title').textContent = `${CAT_ICONS[cat]} ${cat} Videos`;
  renderBrowse();
}

// ===========================
// ===== HOME PAGE =====
// ===========================

function renderHome() {
  const totalLikes = videos.reduce((s, v) => s + v.likes, 0);
  const totalViews = videos.reduce((s, v) => s + v.views, 0);
  document.getElementById('stat-videos').textContent = videos.length;
  document.getElementById('stat-likes').textContent  = formatNum(totalLikes);
  document.getElementById('stat-views').textContent  = formatNum(totalViews);

  // Trending = top 4 by views
  const trending = [...videos].sort((a,b) => b.views - a.views).slice(0,4);
  document.getElementById('trending-grid').innerHTML = trending.map(videoCardHTML).join('');

  // New = latest 4
  const newest = [...videos].sort((a,b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)).slice(0,4);
  document.getElementById('new-grid').innerHTML = newest.map(videoCardHTML).join('');
}

// ===========================
// ===== BROWSE PAGE =====
// ===========================

function renderBrowse() {
  const cat  = document.getElementById('filter-cat').value;
  const sort = document.getElementById('filter-sort').value;

  let filtered = cat === 'all' ? [...videos] : videos.filter(v => v.category === cat);

  if (sort === 'views') filtered.sort((a,b) => b.views - a.views);
  else if (sort === 'likes') filtered.sort((a,b) => b.likes - a.likes);
  else filtered.sort((a,b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

  const grid = document.getElementById('browse-grid');
  if (filtered.length === 0) {
    grid.innerHTML = '<p class="no-items">No videos found in this category.</p>';
    return;
  }
  grid.innerHTML = filtered.map(videoCardHTML).join('');
}

// ===========================
// ===== SEARCH =====
// ===========================

function liveSearch() {
  const query = document.getElementById('nav-search').value.toLowerCase().trim();
  if (!query) return;

  showPage('browse', null);
  document.getElementById('browse-title').textContent = `Search: "${query}"`;

  const results = videos.filter(v =>
    v.title.toLowerCase().includes(query) ||
    v.channel.toLowerCase().includes(query) ||
    v.category.toLowerCase().includes(query) ||
    v.desc.toLowerCase().includes(query)
  );

  const grid = document.getElementById('browse-grid');
  if (results.length === 0) {
    grid.innerHTML = '<p class="no-items">No videos match your search.</p>';
    return;
  }
  grid.innerHTML = results.map(videoCardHTML).join('');
}

// ===========================
// ===== VIDEO CARD HTML =====
// ===========================

function videoCardHTML(v) {
  const thumbUrl = `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`;
  const isSaved  = saved.includes(v.id);
  return `
    <div class="video-card" onclick="playVideo('${v.id}')">
      <div class="video-thumb">
        <img src="${thumbUrl}" alt="${v.title}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
        <div class="thumb-placeholder" style="display:none">${CAT_ICONS[v.category]}</div>
        <div class="duration-badge">${v.duration}</div>
        <div class="play-overlay"><span class="play-btn-big">▶</span></div>
      </div>
      <div class="video-card-body">
        <div class="video-card-cat">${CAT_ICONS[v.category]} ${v.category}</div>
        <h3>${v.title}</h3>
        <div class="video-card-meta">
          <span class="video-card-channel">${v.channel}</span>
          <div class="video-card-stats">
            <span>👁️ ${formatNum(v.views)}</span>
            <span>❤️ ${formatNum(v.likes)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ===========================
// ===== VIDEO PLAYER =====
// ===========================

function playVideo(id) {
  const v = videos.find(v => v.id === id);
  if (!v) return;

  currentVideoId = id;

  // Increment views
  v.views++;
  save();

  // Set iframe src
  document.getElementById('main-video').src = `https://www.youtube.com/embed/${v.youtubeId}?autoplay=1`;

  // Set info
  document.getElementById('player-cat').textContent     = `${CAT_ICONS[v.category]} ${v.category}`;
  document.getElementById('player-title').textContent   = v.title;
  document.getElementById('player-channel').textContent = `📺 ${v.channel}`;
  document.getElementById('player-date').textContent    = `📅 ${formatDate(v.uploadedAt)}`;
  document.getElementById('player-views').textContent   = `👁️ ${formatNum(v.views)} views`;
  document.getElementById('player-desc').textContent    = v.desc;
  document.getElementById('like-count').textContent     = formatNum(v.likes);

  // Like / Save state
  const isLiked = liked.includes(id);
  const isSaved = saved.includes(id);
  document.getElementById('like-btn').className = 'action-btn like-btn' + (isLiked ? ' active' : '');
  document.getElementById('like-icon').textContent = isLiked ? '❤️' : '🤍';
  document.getElementById('save-btn').className = 'action-btn save-btn' + (isSaved ? ' active' : '');
  document.getElementById('save-icon').textContent = isSaved ? '✅' : '🔖';

  // Related videos (same category, exclude current)
  const related = videos.filter(r => r.category === v.category && r.id !== id).slice(0, 6);
  document.getElementById('related-list').innerHTML = related.map(r => {
    const thumb = `https://img.youtube.com/vi/${r.youtubeId}/hqdefault.jpg`;
    return `
      <div class="related-card" onclick="playVideo('${r.id}')">
        <div class="related-thumb">
          <img src="${thumb}" alt="${r.title}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
          <div class="related-thumb-placeholder" style="display:none">${CAT_ICONS[r.category]}</div>
        </div>
        <div class="related-info">
          <h4>${r.title}</h4>
          <p>${r.channel} • ${formatNum(r.views)} views</p>
        </div>
      </div>
    `;
  }).join('');

  showPage('player', null);
}

// ===========================
// ===== LIKE & SAVE =====
// ===========================

function toggleLike() {
  if (!currentVideoId) return;
  const v = videos.find(v => v.id === currentVideoId);
  if (!v) return;

  if (liked.includes(currentVideoId)) {
    liked = liked.filter(id => id !== currentVideoId);
    v.likes = Math.max(0, v.likes - 1);
    document.getElementById('like-btn').classList.remove('active');
    document.getElementById('like-icon').textContent = '🤍';
  } else {
    liked.push(currentVideoId);
    v.likes++;
    document.getElementById('like-btn').classList.add('active');
    document.getElementById('like-icon').textContent = '❤️';
  }

  document.getElementById('like-count').textContent = formatNum(v.likes);
  save();
}

function toggleSave() {
  if (!currentVideoId) return;

  if (saved.includes(currentVideoId)) {
    saved = saved.filter(id => id !== currentVideoId);
    document.getElementById('save-btn').classList.remove('active');
    document.getElementById('save-icon').textContent = '🔖';
  } else {
    saved.push(currentVideoId);
    document.getElementById('save-btn').classList.add('active');
    document.getElementById('save-icon').textContent = '✅';
  }

  save();
}

// ===========================
// ===== SAVED PAGE =====
// ===========================

function renderSaved() {
  const grid = document.getElementById('saved-grid');
  const savedVideos = videos.filter(v => saved.includes(v.id));

  if (savedVideos.length === 0) {
    grid.innerHTML = '<p class="no-items">No saved videos yet. Click 🔖 on a video to save it!</p>';
    return;
  }
  grid.innerHTML = savedVideos.map(videoCardHTML).join('');
}

function clearSaved() {
  if (saved.length === 0) return;
  if (!confirm('Remove all saved videos?')) return;
  saved = [];
  save();
  renderSaved();
}

// ===========================
// ===== UPLOAD PAGE =====
// ===========================

function uploadVideo() {
  const title    = document.getElementById('up-title').value.trim();
  const channel  = document.getElementById('up-channel').value.trim();
  const category = document.getElementById('up-category').value;
  const ytId     = document.getElementById('up-url').value.trim();
  const duration = document.getElementById('up-duration').value.trim();
  const desc     = document.getElementById('up-desc').value.trim();
  const tags     = document.getElementById('up-tags').value.trim();

  const errEl = document.getElementById('upload-error');
  const sucEl = document.getElementById('upload-success');
  errEl.style.display = 'none';
  sucEl.style.display = 'none';

  if (!title)    { showErr(errEl, 'Please enter a video title.');       return; }
  if (!channel)  { showErr(errEl, 'Please enter your channel name.');   return; }
  if (!ytId)     { showErr(errEl, 'Please enter a YouTube video ID.');  return; }
  if (!duration) { showErr(errEl, 'Please enter video duration.');      return; }

  const newVideo = {
    id: 'v' + Date.now(),
    title, channel, category,
    youtubeId: ytId,
    duration,
    desc: desc || 'No description provided.',
    tags,
    views: 0, likes: 0,
    uploadedAt: new Date().toISOString()
  };

  videos.unshift(newVideo);
  save();

  sucEl.textContent   = `✅ "${title}" uploaded successfully! Go to Browse to see it.`;
  sucEl.style.display = 'block';

  // Reset form
  ['up-title','up-channel','up-url','up-duration','up-tags','up-desc'].forEach(id => {
    document.getElementById(id).value = '';
  });
}

// ===========================
// ===== ADMIN PAGE =====
// ===========================

function renderAdmin() {
  const totalViews = videos.reduce((s,v) => s + v.views, 0);
  const totalLikes = videos.reduce((s,v) => s + v.likes, 0);

  document.getElementById('a-videos').textContent = videos.length;
  document.getElementById('a-views').textContent  = formatNum(totalViews);
  document.getElementById('a-likes').textContent  = formatNum(totalLikes);
  document.getElementById('a-saved').textContent  = saved.length;

  document.getElementById('admin-tbody').innerHTML = videos.map(v => `
    <tr>
      <td><strong>${v.title}</strong></td>
      <td>${v.channel}</td>
      <td>${CAT_ICONS[v.category]} ${v.category}</td>
      <td>${formatNum(v.views)}</td>
      <td>${formatNum(v.likes)}</td>
      <td>${v.duration}</td>
      <td>
        <button class="btn" style="background:#1a1a1a;color:#aaa;border:1px solid #333;padding:5px 12px;font-size:0.8rem;" onclick="playVideo('${v.id}')">▶ Play</button>
        <button class="btn" style="background:#2a1010;color:#ff4444;border:1px solid #3a1515;padding:5px 12px;font-size:0.8rem;margin-left:6px;" onclick="deleteVideo('${v.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function deleteVideo(id) {
  if (!confirm('Delete this video?')) return;
  videos     = videos.filter(v => v.id !== id);
  saved      = saved.filter(s => s !== id);
  liked      = liked.filter(l => l !== id);
  save();
  renderAdmin();
}

// ===========================
// ===== HELPERS =====
// ===========================

function showErr(el, msg) {
  el.textContent   = msg;
  el.style.display = 'block';
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function formatNum(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)    return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}

// ===== INIT =====
renderHome();
