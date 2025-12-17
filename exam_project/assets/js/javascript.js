//menu
const menuBtn = document.getElementById("menuBtn");
  const burgerMenu = document.getElementById("burgerMenu");

  menuBtn.addEventListener("click", () => {
    burgerMenu.classList.toggle("open");
  });
  
// quiz
document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");

  if (!startBtn) return;

  startBtn.addEventListener("click", () => {
    // go to first quiz question
    window.location.href = "q1.html";
  });
});
