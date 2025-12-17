const QUIZ_KEY = "matchmakerQuizScores";

/* =========================
   STORAGE
========================= */
function getScores() {
  const raw = localStorage.getItem(QUIZ_KEY);
  if (!raw) return { soft: 0, quiet: 0, warm: 0 };
  try {
    return JSON.parse(raw);
  } catch {
    return { soft: 0, quiet: 0, warm: 0 };
  }
}

function saveScores(scores) {
  localStorage.setItem(QUIZ_KEY, JSON.stringify(scores));
}

function resetScores() {
  saveScores({ soft: 0, quiet: 0, warm: 0 });
}

/* =========================
   PAGE HELPERS
========================= */
function getPageName() {
  const path = window.location.pathname;
  return path.substring(path.lastIndexOf("/") + 1);
}

function nextPageFor(current) {
  const map = {
    "startquiz.html": "q1.html",
    "q1.html": "q2.html",
    "q2.html": "q3.html",
    "q3.html": "q4.html",
    "q4.html": "q5.html"
  };
  return map[current] || "startquiz.html";
}

function getWinner(scores) {
  const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return entries[0][0]; // soft | quiet | warm
}

function resultPageFor(winner) {
  const map = {
    soft: "result-soft.html",
    quiet: "result-quiet.html",
    warm: "result-warm.html"
  };
  return map[winner] || "result-soft.html";
}

/* =========================
   DOM READY
========================= */
document.addEventListener("DOMContentLoaded", () => {

    const goQuizBtn = document.getElementById("gotoQuizBtn");

if (goQuizBtn) {
  goQuizBtn.addEventListener("click", () => {
    window.location.href = "startquiz.html";
  });
}

  /* =========================
     BURGER MENU (ALL PAGES)
  ========================= */
  const menuBtn = document.getElementById("menuBtn");
  const burgerMenu = document.getElementById("burgerMenu");

  if (menuBtn && burgerMenu) {
    menuBtn.addEventListener("click", () => {
      burgerMenu.classList.toggle("open");
    });
  }

  /* =========================
     START PAGE (quiz.html)
  ========================= */
  const startBtn = document.getElementById("startBtn");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      resetScores();
      window.location.href = "q1.html";
    });
  }

  /* =========================
     QUESTION PAGES (q1–q5)
  ========================= */
  const answers = document.querySelectorAll(".answer-box");
  const continueBtn = document.getElementById("continueBtn");

  // If this page doesn't have quiz controls, stop here safely
  if (!answers.length || !continueBtn) return;

  let selectedMood = null;

  answers.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mood = btn.dataset.mood;
      if (!mood) return;

      // toggle off if clicking same answer
      if (btn.classList.contains("selected")) {
        btn.classList.remove("selected");
        selectedMood = null;
        continueBtn.disabled = true;
        return;
      }

      // select this one
      answers.forEach((b) => b.classList.remove("selected"));
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

    const currentPage = getPageName();

    // FINAL STEP → RESULT PAGE
    if (currentPage === "q5.html") {
      const winner = getWinner(scores);
      window.location.href = resultPageFor(winner);
      return;
    }

    // Otherwise → next question
    window.location.href = nextPageFor(currentPage);
  });
});
