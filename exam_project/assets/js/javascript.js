/* =========================
   QUIZ + MENU SCRIPT (ALL PAGES)
========================= */

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
  return path.substring(path.lastIndexOf("/") + 1) || "index.html";
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
   MENU HELPERS
========================= */
// These must match your <a href="..."> filenames in the burger menu!
const MENU_PAGES = new Set([
  "index.html",
  "startquiz.html",
  "grandgarden.html",
  "japanesepalace.html",
  "lingnercastle.html",
  "favorites.html"
]);

function closeMenu(burgerMenu) {
  burgerMenu.classList.remove("open");
}

function setActiveMenuLink() {
  const burgerMenu = document.getElementById("burgerMenu");
  if (!burgerMenu) return;

  const current = getPageName();

  burgerMenu.querySelectorAll("a").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href) return;

    // mark active if exact match
    if (href === current) a.classList.add("active");
    else a.classList.remove("active");
  });
}

/* =========================
   BUTTONS + QUIZ LOGIC
========================= */
document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     OPTIONAL "MORE INFO" BUTTONS
  ========================= */
  const moreInfoBtn1 = document.getElementById("moreInfoBtn1");
  if (moreInfoBtn1) {
    moreInfoBtn1.addEventListener("click", () => {
      window.location.href = "grandgarden.html";
    });
  }

  const moreInfoBtn2 = document.getElementById("moreInfoBtn2");
  if (moreInfoBtn2) {
    moreInfoBtn2.addEventListener("click", () => {
      window.location.href = "japanesepalace.html";
    });
  }

  const moreInfoBtn3 = document.getElementById("moreInfoBtn3");
  if (moreInfoBtn3) {
    moreInfoBtn3.addEventListener("click", () => {
      window.location.href = "lingnercastle.html";
    });
  }

  const goQuizBtn = document.getElementById("quizBtn");
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
    // Toggle open/close
    menuBtn.addEventListener("click", () => {
      burgerMenu.classList.toggle("open");
    });

    // Close after clicking a link (so it feels smooth on mobile)
    burgerMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu(burgerMenu);
      });
    });

    // Close if clicking outside the menu
    document.addEventListener("click", (e) => {
      const clickedInsideMenu = burgerMenu.contains(e.target);
      const clickedMenuBtn = menuBtn.contains(e.target);
      if (!clickedInsideMenu && !clickedMenuBtn) closeMenu(burgerMenu);
    });

    // Optional: close on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu(burgerMenu);
    });
  }

  // Highlight active link (optional)
  setActiveMenuLink();

  /* =========================
     START PAGE (startquiz.html)
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
