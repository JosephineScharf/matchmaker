

// quiz
document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");

  if (!startBtn) return;

  startBtn.addEventListener("click", () => {
    // go to first quiz question
    window.location.href = "q1.html";
  });
});

const QUIZ_KEY = "matchmakerQuizScores";

function getScores() {
  const raw = localStorage.getItem(QUIZ_KEY);
  if (!raw) return { soft: 0, quiet: 0, warm: 0 };
  try { return JSON.parse(raw); }
  catch { return { soft: 0, quiet: 0, warm: 0 }; }
}

function saveScores(scores) {
  localStorage.setItem(QUIZ_KEY, JSON.stringify(scores));
}

document.addEventListener("DOMContentLoaded", () => {
  // Burger menu (optional)
  const menuBtn = document.getElementById("menuBtn");
  const burgerMenu = document.getElementById("burgerMenu");
  if (menuBtn && burgerMenu) {
    menuBtn.addEventListener("click", () =>
      burgerMenu.classList.toggle("open")
    );
  }

  const answers = document.querySelectorAll(".answer-box");
  const continueBtn = document.getElementById("continueBtn");

  let selectedMood = null;

  answers.forEach(btn => {
    btn.addEventListener("click", () => {
      const mood = btn.dataset.mood;

      // If clicking the already selected answer → deselect
      if (btn.classList.contains("selected")) {
        btn.classList.remove("selected");
        selectedMood = null;
        continueBtn.disabled = true;
        return;
      }

      // Otherwise select this one
      answers.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedMood = mood;
      continueBtn.disabled = false;
    });
  });

  continueBtn.addEventListener("click", () => {
    if (!selectedMood) return;

    const scores = getScores();
    scores[selectedMood] = (scores[selectedMood] || 0) + 1;
    saveScores(scores);

    window.location.href = "q2.html";
  });
});
