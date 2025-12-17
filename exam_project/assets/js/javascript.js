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

function resetScores() {
  saveScores({ soft: 0, quiet: 0, warm: 0 });
}

function getPageName() {
  // works for live server + file://
  const path = window.location.pathname;
  return path.substring(path.lastIndexOf("/") + 1); // e.g. "q3.html"
}

function nextPageFor(current) {
  const map = {
    "quiz.html": "q1.html",
    "q1.html": "q2.html",
    "q2.html": "q3.html",
    "q3.html": "q4.html",
    "q4.html": "q5.html",
    "q5.html": "result.html",
  };
  return map[current] || "result.html";
}

document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     BURGER MENU (ALL PAGES)
  ========================= */
  const menuBtn = document.getElementById("menuBtn");
  const burgerMenu = document.getElementById("burgerMenu");

  if (menuBtn && burgerMenu) {
    menuBtn.addEventListener("click", () => burgerMenu.classList.toggle("open"));
  }

  /* =========================
     START PAGE (quiz.html)
  ========================= */
  const startBtn = document.getElementById("startBtn");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      resetScores();                 // start fresh every time
      window.location.href = "q1.html";
    });
  }

  /* =========================
     QUESTION PAGES (q1–q5)
  ========================= */
  const answers = document.querySelectorAll(".answer-box");
  const continueBtn = document.getElementById("continueBtn");

  // If a page has no answers/continue button, do nothing (safe for other pages)
  if (!answers.length || !continueBtn) return;

  let selectedMood = null;

  answers.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mood = btn.dataset.mood; // must exist on q1–q4. q5 should also have it when you wire logic.

      // toggle off
      if (btn.classList.contains("selected")) {
        btn.classList.remove("selected");
        selectedMood = null;
        continueBtn.disabled = true;
        return;
      }

      // select this, unselect others
      answers.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedMood = mood;
      continueBtn.disabled = false;
    });
  });

  continueBtn.addEventListener("click", () => {
    if (!selectedMood) return;

    // add score
    const scores = getScores();
    scores[selectedMood] = (scores[selectedMood] || 0) + 1;
    saveScores(scores);

    // go next based on which page we are on
    const current = getPageName();
    window.location.href = nextPageFor(current);
  });
});
