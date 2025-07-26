document.addEventListener('DOMContentLoaded', function() {
  // Debug: Confirm files loaded
  console.log("gameData:", window.gameData); 
  
  // Default to ARMOR tab
  renderChecklist('ARMOR');

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      renderChecklist(this.dataset.category);
    });
  });
});

function renderChecklist(category) {
  const container = document.getElementById('checklist-container');
  if (!window.gameData || !window.gameData[category]) {
    container.innerHTML = "<p>Data loading failed. Try refreshing.</p>";
    return;
  }

  // ... rest of your render function ...
}
