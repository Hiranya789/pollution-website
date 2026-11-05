/* ==========================================================
   POLLUTION — Pollution Awareness Website
   One JavaScript file shared by every page.
   1. Navigation (mobile menu and dropdown)
   2. Action checklist (actions.html)
   3. Quiz (quiz.html)
   No personal information is collected anywhere on this website.
   ========================================================== */

/* ---------- 1. Navigation ---------- */
var menuToggle = document.getElementById("menu-toggle");
var navLinks = document.getElementById("nav-links");
var dropdown = document.getElementById("types-dropdown");
var dropdownButton = document.getElementById("types-button");

// Open and close the whole menu on small screens
menuToggle.addEventListener("click", function () {
  var isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", isOpen);
});

// Open or close the Types of Pollution dropdown
function setDropdown(open) {
  dropdown.classList.toggle("open", open);
  dropdownButton.setAttribute("aria-expanded", open);
}

// Mouse click, Enter key and Space key all trigger "click" on a button
dropdownButton.addEventListener("click", function () {
  setDropdown(!dropdown.classList.contains("open"));
});

// Escape key closes the dropdown and returns focus to the button
dropdown.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    setDropdown(false);
    dropdownButton.focus();
  }
});

// Clicking anywhere else, or tabbing out of the menu, closes it
document.addEventListener("click", function (event) {
  if (!dropdown.contains(event.target)) {
    setDropdown(false);
  }
});
dropdown.addEventListener("focusout", function (event) {
  if (!dropdown.contains(event.relatedTarget)) {
    setDropdown(false);
  }
});

/* ---------- 2. Action checklist ---------- */
var checklist = document.getElementById("checklist");

if (checklist) {
  var boxes = checklist.querySelectorAll("input[type='checkbox']");
  var progressText = document.getElementById("progress-text");
  var progressFill = document.getElementById("progress-fill");
  var resetButton = document.getElementById("reset-checklist");
  var STORAGE_KEY = "pollutionChecklist";

  // Read saved ticks. try/catch stops errors if storage is blocked.
  function loadChecklist() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved) {
        for (var i = 0; i < boxes.length; i++) {
          boxes[i].checked = saved[i] === true;
        }
      }
    } catch (error) {
      // The checklist still works, it just will not be remembered.
    }
  }

  function saveChecklist() {
    var ticks = [];
    for (var i = 0; i < boxes.length; i++) {
      ticks.push(boxes[i].checked);
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ticks));
    } catch (error) {
      // Ignore: saving is optional.
    }
  }

  function updateProgress() {
    var done = 0;
    for (var i = 0; i < boxes.length; i++) {
      if (boxes[i].checked) {
        done = done + 1;
      }
    }
    progressText.textContent = done + " of " + boxes.length + " actions completed";
    progressFill.style.width = (done / boxes.length) * 100 + "%";
  }

  for (var i = 0; i < boxes.length; i++) {
    boxes[i].addEventListener("change", function () {
      saveChecklist();
      updateProgress();
    });
  }

  resetButton.addEventListener("click", function () {
    for (var i = 0; i < boxes.length; i++) {
      boxes[i].checked = false;
    }
    saveChecklist();
    updateProgress();
  });

  loadChecklist();
  updateProgress();
}

/* ---------- 3. Quiz ---------- */
var quizForm = document.getElementById("quiz-form");

if (quizForm) {
  var questions = quizForm.querySelectorAll(".quiz-question");
  var quizResult = document.getElementById("quiz-result");

  quizForm.addEventListener("submit", function (event) {
    event.preventDefault(); // stay on the page; nothing is sent anywhere
    var score = 0;
    var answered = 0;

    for (var i = 0; i < questions.length; i++) {
      var question = questions[i];
      var correctAnswer = question.getAttribute("data-answer");
      var explanation = question.getAttribute("data-explanation");
      var chosen = question.querySelector("input:checked");
      var feedback = question.querySelector(".feedback");

      feedback.hidden = false;
      if (!chosen) {
        feedback.className = "feedback wrong";
        feedback.textContent = "You have not answered this question yet.";
      } else if (chosen.value === correctAnswer) {
        answered = answered + 1;
        score = score + 1;
        feedback.className = "feedback correct";
        feedback.textContent = "Correct. " + explanation;
      } else {
        answered = answered + 1;
        feedback.className = "feedback wrong";
        feedback.textContent = "Not quite. " + explanation;
      }
    }

    var message = "You scored " + score + " out of " + questions.length + ".";
    if (answered < questions.length) {
      message = message + " Answer every question, then check again.";
    } else if (score === questions.length) {
      message = message + " Excellent work!";
    } else {
      message = message + " Read the feedback and try again.";
    }
    quizResult.textContent = message;
  });

  quizForm.addEventListener("reset", function () {
    for (var i = 0; i < questions.length; i++) {
      questions[i].querySelector(".feedback").hidden = true;
    }
    quizResult.textContent = "";
  });
}
