document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM loaded!"); // Check if script loads
  
  // Set default tab
  renderChecklist('ARMOR');
  
  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      console.log("Button clicked:", this.dataset.category); // Verify clicks
      
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      renderChecklist(this.dataset.category);
    });
  });
});

function renderChecklist(category) {
  console.log("Rendering:", category); // Check function call
  const container = document.getElementById('checklist-container');
  
  if (!window.gameData || !window.gameData[category]) {
    console.error("No data found for:", category);
    container.innerHTML = "<p>No data available.</p>";
    return;
  }
  
  let html = '';
  const categoryData = window.gameData[category];
  
  // Handle ARMOR (nested structure)
  if (category === 'ARMOR') {
    for (const [chapter, slots] of Object.entries(categoryData)) {
      html += `<div class="chapter"><h3>${chapter}</h3>`;
      
      for (const [slot, items] of Object.entries(slots)) {
        html += `<div class="slot"><h4>${slot}</h4><ul>`;
        
        items.forEach(item => {
          html += `
            <li>
              <input type="checkbox" id="${item.replace(/\s+/g, '-')}">
              <label for="${item.replace(/\s+/g, '-')}">${item}</label>
            </li>
          `;
        });
        
        html += `</ul></div>`;
      }
      html += `</div>`;
    }
  } 
  // Handle other categories (flat structure)
  else {
    for (const [chapter, items] of Object.entries(categoryData)) {
      html += `<div class="chapter"><h3>${chapter}</h3><ul>`;
      
      items.forEach(item => {
        html += `
          <li>
            <input type="checkbox" id="${item.replace(/\s+/g, '-')}">
            <label for="${item.replace(/\s+/g, '-')}">${item}</label>
          </li>
        `;
      });
      
      html += `</ul></div>`;
    }
  }
  
  container.innerHTML = html;
  console.log("Content inserted:", container.innerHTML); // Verify HTML
}
