let progressData = JSON.parse(localStorage.getItem("progress")) || {};

function renderChecklist(category) {
  const container = document.getElementById("checklist-container");
  container.innerHTML = "";

  Object.entries(window.gameData[category]).forEach(([chapter, items]) => {
    const chapterDiv = document.createElement("div");
    chapterDiv.className = "chapter";
    chapterDiv.innerHTML = `<div class="chapter-title">${chapter}</div>`;
    
    items.forEach(item => {
      const itemId = `${category}-${chapter}-${item.replace(/\s+/g, "-")}`;
      const isChecked = progressData[itemId] || false;
      
      const itemDiv = document.createElement("div");
      itemDiv.className = `item ${isChecked ? "completed" : ""}`;
      itemDiv.innerHTML = `
        <input type="checkbox" id="${itemId}" ${isChecked ? "checked" : ""}>
        <label for="${itemId}">${item}</label>
      `;
      itemDiv.querySelector("input").addEventListener("change", updateProgress);
      chapterDiv.appendChild(itemDiv);
    });
    
    container.appendChild(chapterDiv);
  });
}

function updateProgress() {
  const checkboxes = document.querySelectorAll("input[type=checkbox]");
  let checked = 0;
  
  checkboxes.forEach(checkbox => {
    progressData[checkbox.id] = checkbox.checked;
    if (checkbox.checked) checked++;
  });

  localStorage.setItem("progress", JSON.stringify(progressData));

  const percent = Math.round((checked / checkboxes.length) * 100);
  document.querySelector(".progress-fill").style.width = `${percent}%`;
  document.getElementById("overall-progress").textContent = `${percent}%`;
}

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderChecklist(btn.dataset.category);
  });
});

renderChecklist("ARMOR");
updateProgress();
