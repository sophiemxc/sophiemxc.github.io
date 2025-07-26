// app.js - Complete Interactive Tracker for GitHub Pages
document.addEventListener('DOMContentLoaded', function() {
  console.log("Tracker initialized!"); // Debug: Confirm script loaded
  
  // Initialize with ARMOR tab
  renderChecklist('ARMOR');
  updateProgressBar(); // Set initial progress
  
  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      // Update active tab UI
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Load new category
      renderChecklist(this.dataset.category);
    });
  });
  
  // Load saved progress from localStorage
  loadSavedProgress();
});

// ========================
// CORE FUNCTIONS
// ========================

function renderChecklist(category) {
  const container = document.getElementById('checklist-container');
  container.innerHTML = ''; // Clear previous content
  
  if (!window.gameData || !window.gameData[category]) {
    container.innerHTML = `<p class="error">No data found for ${category}.</p>`;
    return;
  }
  
  const categoryData = window.gameData[category];
  let html = '';
  
  // ARMOR has nested structure (Chapter → Slot → Items)
  if (category === 'ARMOR') {
    Object.entries(categoryData).forEach(([chapter, slots]) => {
      html += `
        <div class="chapter">
          <h3 class="chapter-title">${chapter}</h3>
          <div class="chapter-progress">
            <div class="progress-bar">
              <div class="progress-fill" data-chapter="${chapter}"></div>
            </div>
            <span class="progress-text">0%</span>
          </div>
      `;
      
      Object.entries(slots).forEach(([slot, items]) => {
        html += `
          <div class="slot">
            <h4>${slot}</h4>
            <ul class="item-list">
              ${items.map(item => `
                <li>
                  <input type="checkbox" 
                         id="${category}-${chapter}-${slot}-${item.replace(/\s+/g, '-')}"
                         data-category="${category}"
                         data-chapter="${chapter}"
                         data-slot="${slot}"
                         data-item="${item}">
                  <label for="${category}-${chapter}-${slot}-${item.replace(/\s+/g, '-')}">
                    ${item}
                  </label>
                </li>
              `).join('')}
            </ul>
          </div>
        `;
      });
      
      html += `</div>`; // Close chapter div
    });
  } 
  // Other categories (flat structure)
  else {
    Object.entries(categoryData).forEach(([chapter, items]) => {
      html += `
        <div class="chapter">
          <h3 class="chapter-title">${chapter}</h3>
          <div class="chapter-progress">
            <div class="progress-bar">
              <div class="progress-fill" data-chapter="${chapter}"></div>
            </div>
            <span class="progress-text">0%</span>
          </div>
          <ul class="item-list">
            ${items.map(item => `
              <li>
                <input type="checkbox" 
                       id="${category}-${chapter}-${item.replace(/\s+/g, '-')}"
                       data-category="${category}"
                       data-chapter="${chapter}"
                       data-item="${item}">
                <label for="${category}-${chapter}-${item.replace(/\s+/g, '-')}">
                  ${item}
                </label>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    });
  }
  
  container.innerHTML = html;
  
  // Add event listeners to new checkboxes
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      saveProgress(this);
      updateProgressBar();
    });
  });
  
  // Update all progress bars
  updateProgressBar();
}

// ========================
// PROGRESS TRACKING
// ========================

function saveProgress(checkbox) {
  const progressData = JSON.parse(localStorage.getItem('wukongProgress')) || {};
  const { category, chapter, slot, item } = checkbox.dataset;
  
  // Create nested structure for armor
  if (category === 'ARMOR') {
    if (!progressData[category]) progressData[category] = {};
    if (!progressData[category][chapter]) progressData[category][chapter] = {};
    if (!progressData[category][chapter][slot]) progressData[category][chapter][slot] = {};
    progressData[category][chapter][slot][item] = checkbox.checked;
  } 
  // Flat structure for other categories
  else {
    if (!progressData[category]) progressData[category] = {};
    if (!progressData[category][chapter]) progressData[category][chapter] = {};
    progressData[category][chapter][item] = checkbox.checked;
  }
  
  localStorage.setItem('wukongProgress', JSON.stringify(progressData));
}

function loadSavedProgress() {
  const progressData = JSON.parse(localStorage.getItem('wukongProgress')) || {};
  
  Object.entries(progressData).forEach(([category, chapters]) => {
    Object.entries(chapters).forEach(([chapter, itemsOrSlots]) => {
      // ARMOR has slot-level nesting
      if (category === 'ARMOR') {
        Object.entries(itemsOrSlots).forEach(([slot, items]) => {
          Object.entries(items).forEach(([item, checked]) => {
            const checkbox = document.getElementById(
              `${category}-${chapter}-${slot}-${item.replace(/\s+/g, '-')}`
            );
            if (checkbox) checkbox.checked = checked;
          });
        });
      } 
      // Other categories
      else {
        Object.entries(itemsOrSlots).forEach(([item, checked]) => {
          const checkbox = document.getElementById(
            `${category}-${chapter}-${item.replace(/\s+/g, '-')}`
          );
          if (checkbox) checkbox.checked = checked;
        });
      }
    });
  });
}

function updateProgressBar() {
  // Update overall progress
  const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
  const checkedCount = document.querySelectorAll('input[type="checkbox"]:checked').length;
  const totalCount = allCheckboxes.length;
  const overallPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;
  
  document.querySelector('#overall-progress').textContent = `${overallPercent}%`;
  document.querySelector('.progress-fill').style.width = `${overallPercent}%`;
  
  // Update chapter-level progress
  document.querySelectorAll('.chapter').forEach(chapterDiv => {
    const chapterTitle = chapterDiv.querySelector('.chapter-title').textContent;
    const chapterCheckboxes = chapterDiv.querySelectorAll('input[type="checkbox"]');
    const chapterChecked = chapterDiv.querySelectorAll('input[type="checkbox"]:checked').length;
    const chapterPercent = chapterCheckboxes.length > 0 
      ? Math.round((chapterChecked / chapterCheckboxes.length) * 100) 
      : 0;
    
    const progressFill = chapterDiv.querySelector('.progress-fill');
    const progressText = chapterDiv.querySelector('.progress-text');
    
    if (progressFill) progressFill.style.width = `${chapterPercent}%`;
    if (progressText) progressText.textContent = `${chapterPercent}%`;
  });
}
