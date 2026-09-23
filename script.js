/* ============================================
   AWS CLF-C02 · Guía de estudio
   Navegación · Collapsibles · Quiz interactivo
   Vanilla JS, sin frameworks
   ============================================ */

(function () {
  "use strict";

  const DOMAIN_LABELS = {
    "cloud-concepts": "Cloud Concepts",
    "security-compliance": "Security & Compliance",
    technology: "Technology",
    "billing-pricing": "Billing & Pricing",
  };

  let quizData = [];

  /* ============ Navegación móvil ============ */

  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.textContent = open ? "✕" : "☰";
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.textContent = "☰";
      });
    });
  }

  /* ============ Cambio de tema ============ */

  const themeToggle = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("clf-theme", theme);
    themeToggle.textContent = theme === "dark" ? "🌙" : "☀️";
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"
    );
  }

  if (themeToggle) {
    const saved = localStorage.getItem("clf-theme");
    const prefersLight =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches;
    const initial = saved || (prefersLight ? "light" : "dark");
    applyTheme(initial);

    themeToggle.addEventListener("click", () => {
      const next =
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "light"
          : "dark";
      applyTheme(next);
    });
  }

  /* ============ Tabs ============ */

  const tabs = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");

  function activateTab(tag) {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.tag === tag;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.tag === tag;
      panel.classList.toggle("active", isActive);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activateTab(tab.dataset.tag));

    tab.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const index = Array.from(tabs).indexOf(tab);
        const next = e.key === "ArrowRight" ? index + 1 : index - 1;
        const target = tabs[(next + tabs.length) % tabs.length];
        target.focus();
        activateTab(target.dataset.tag);
        e.preventDefault();
      }
    });
  });

  /* ============ Collapsibles ============ */

  const collapseHeads = document.querySelectorAll(".collapse-head");

  collapseHeads.forEach((head) => {
    head.addEventListener("click", () => {
      const body = document.getElementById(head.getAttribute("aria-controls"));
      const isOpen = head.classList.toggle("open");
      body.classList.toggle("open", isOpen);
      head.setAttribute("aria-expanded", String(isOpen));
    });
  });

  /* ============ Scroll suave (mejora para navegadores sin soporte nativo) ============ */

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ============ Quiz interactivo ============ */

  const quizList = document.getElementById("quiz-list");
  const quizFilter = document.getElementById("quiz-filter");
  const quizReset = document.getElementById("quiz-reset");
  const statCorrect = document.getElementById("stat-correct");
  const statWrong = document.getElementById("stat-wrong");
  const statAnswered = document.getElementById("stat-answered");

  function loadQuiz() {
    fetch("data/quiz.json")
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el quiz");
        return res.json();
      })
      .then((data) => {
        quizData = data.quiz || [];
        renderQuiz();
      })
      .catch((err) => {
        quizList.innerHTML =
          '<p class="quiz-error">No se pudo cargar el quiz: ' +
          err.message +
          "</p>";
        console.error("Error cargando el quiz:", err);
      });
  }

  function getFilteredQuestions() {
    const filter = quizFilter.value;
    return filter === "all"
      ? quizData
      : quizData.filter((q) => q.domain === filter);
  }

  function renderQuiz() {
    const questions = getFilteredQuestions();

    if (questions.length === 0) {
      quizList.innerHTML = '<p class="quiz-error">Sin preguntas.</p>';
      return;
    }

    quizList.innerHTML = "";

    questions.forEach((q) => {
      const card = document.createElement("article");
      card.className = "quiz-card";
      card.dataset.qid = q.id;

      const domainBadge = DOMAIN_LABELS[q.domain] || q.domain;

      const head = document.createElement("div");
      head.className = "quiz-card-head";

      const title = document.createElement("h3");
      title.textContent = q.question;

      const badge = document.createElement("span");
      badge.className = "quiz-domain";
      badge.textContent = domainBadge;

      head.appendChild(title);
      head.appendChild(badge);
      card.appendChild(head);

      const optionsWrap = document.createElement("div");
      optionsWrap.className = "quiz-options";

      q.options.forEach((option, idx) => {
        const btn = document.createElement("button");
        btn.className = "quiz-option";
        btn.dataset.idx = idx;
        btn.innerHTML =
          '<span class="opt-letter">' +
          String.fromCharCode(65 + idx) +
          ".</span> <span>" +
          option +
          "</span>";

        btn.addEventListener("click", () => checkAnswer(q.id, btn, q));
        optionsWrap.appendChild(btn);
      });

      card.appendChild(optionsWrap);

      const feedback = document.createElement("div");
      feedback.className = "quiz-feedback";
      feedback.setAttribute("aria-live", "polite");
      card.appendChild(feedback);

      quizList.appendChild(card);
    });

    updateStats();
  }

  function checkAnswer(qid, clickedBtn, question) {
    const card = clickedBtn.closest(".quiz-card");
    const buttons = card.querySelectorAll(".quiz-option");

    if (clickedBtn.dataset.answered === "true") return;

    const feedback = card.querySelector(".quiz-feedback");
    const selected = Number(clickedBtn.dataset.idx);
    const isCorrect = selected === question.correctAnswer;

    buttons.forEach((btn, idx) => {
      let cls = "";
      if (idx === question.correctAnswer) cls = "correct";
      else if (idx === selected && !isCorrect) cls = "wrong";
      btn.classList.add(cls);
      btn.dataset.answered = "true";
      btn.disabled = true;
    });

    const optionLetters = ["A", "B", "C", "D"];
    const correctText = optionLetters[question.correctAnswer] + ". " + question.options[question.correctAnswer];

    if (isCorrect) {
      feedback.className = "quiz-feedback good show";
      feedback.innerHTML =
        "<strong>Correcto ✓</strong> " + question.explanation;
    } else {
      feedback.className = "quiz-feedback bad show";
      feedback.innerHTML =
        "<strong>Incorrecto ✗</strong> La respuesta correcta es " +
        correctText +
        ". " +
        question.explanation;
    }

    updateStats();
  }

  function updateStats() {
    let correct = 0;
    let answered = 0;

    quizList.querySelectorAll(".quiz-card").forEach((card) => {
      const hasWrong = card.querySelector(".quiz-option.wrong") !== null;
      const hasSelected = card.querySelector(".quiz-option[data-answered='true']") !== null;

      if (hasWrong) {
        answered++;
      } else if (hasSelected) {
        correct++;
        answered++;
      }
    });

    statCorrect.textContent = correct;
    statWrong.textContent = answered - correct;
    statAnswered.textContent = answered;
  }

  if (quizFilter) {
    quizFilter.addEventListener("change", renderQuiz);
  }

  if (quizReset) {
    quizReset.addEventListener("click", () => {
      renderQuiz();
    });
  }

  /* ============ Inicio ============ */

  loadQuiz();
})();