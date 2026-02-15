let extensionsData = [];

// Theme Toggle Logic
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

themeBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  themeIcon.src = newTheme === 'light' ? './assets/images/icon-moon.svg' : './assets/images/icon-sun.svg';
});

// Load Data
async function loadExtensions() {
  try {
    const res = await fetch('./data.json');
    extensionsData = await res.json();
    renderExtensions('all');
  } catch (err) {
    console.error("Failed to load data:", err);
  }
}

function renderExtensions(filter) {
  const grid = document.getElementById('extensions-grid');
  grid.innerHTML = '';

  const filtered = extensionsData.filter(ext => {
    if (filter === 'active') return ext.isActive;
    if (filter === 'inactive') return !ext.isActive;
    return true;
  });

  filtered.forEach(ext => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-content">
        <img src="${ext.logo}" alt="" class="card-icon">
        <div class="card-text">
          <h3>${ext.name}</h3>
          <p>${ext.description}</p>
        </div>
      </div>
      <div class="card-footer">
        <button class="remove-btn" onclick="removeExt('${ext.name}')">Remove</button>
        <label class="switch">
          <input type="checkbox" ${ext.isActive ? 'checked' : ''} onchange="toggleExt('${ext.name}')">
          <span class="slider"></span>
        </label>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Logic: Toggle Active
window.toggleExt = (name) => {
  const index = extensionsData.findIndex(e => e.name === name);
  extensionsData[index].isActive = !extensionsData[index].isActive;
};

// Logic: Remove
window.removeExt = (name) => {
  extensionsData = extensionsData.filter(e => e.name !== name);
  const currentActiveFilter = document.querySelector('.filter-btn.active').dataset.filter;
  renderExtensions(currentActiveFilter);
};

// Logic: Filter Tabs
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelector('.filter-btn.active').classList.remove('active');
    e.target.classList.add('active');
    renderExtensions(e.target.dataset.filter);
  });
});

loadExtensions();