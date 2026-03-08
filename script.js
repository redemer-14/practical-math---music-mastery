/* ============================================
   SkillSpark — Interactive Script
   ============================================ */

(function () {
  "use strict";

  // ---- NAV SCROLL & MOBILE MENU ----
  var navbar = document.getElementById("navbar");
  var menuBtn = document.getElementById("menuBtn");
  var navLinks = document.getElementById("navLinks");

  window.addEventListener("scroll", function () {
    navbar.classList.toggle("scrolled", window.scrollY > 10);
  });

  menuBtn.addEventListener("click", function () {
    navLinks.classList.toggle("open");
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
    });
  });

  // ---- SCROLL REVEAL ----
  var reveals = document.querySelectorAll(".reveal");
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  reveals.forEach(function (el) {
    observer.observe(el);
  });

  // ---- TIP CALCULATOR ----
  var billInput = document.getElementById("billAmount");
  var tipSelect = document.getElementById("tipPercent");
  var splitSelect = document.getElementById("splitCount");
  var tipOutput = document.getElementById("tipOutput");
  var tipBreakdown = document.getElementById("tipBreakdown");

  function calculateTip() {
    var bill = parseFloat(billInput.value) || 0;
    var tipPct = parseInt(tipSelect.value, 10);
    var split = parseInt(splitSelect.value, 10);
    var tip = bill * (tipPct / 100);
    var total = bill + tip;
    var perPerson = total / split;
    tipOutput.textContent = "$" + perPerson.toFixed(2);
    tipBreakdown.textContent =
      "Tip: $" + tip.toFixed(2) + " \u00B7 Total: $" + total.toFixed(2);
  }
  billInput.addEventListener("input", calculateTip);
  tipSelect.addEventListener("change", calculateTip);
  splitSelect.addEventListener("change", calculateTip);
  calculateTip();

  // ---- PIANO ----
  var AudioCtx = window.AudioContext || window.webkitAudioContext;
  var audioCtx = null;

  function ensureAudioCtx() {
    if (!audioCtx) audioCtx = new AudioCtx();
    if (audioCtx.state === "suspended") audioCtx.resume();
  }

  var noteFreqs = {
    C4: 261.63, "C#4": 277.18, D4: 293.66, "D#4": 311.13,
    E4: 329.63, F4: 349.23, "F#4": 369.99, G4: 392.0,
    "G#4": 415.3, A4: 440.0, "A#4": 466.16, B4: 493.88,
    C5: 523.25, D5: 587.33
  };

  var whiteNotes = ["C4","D4","E4","F4","G4","A4","B4","C5"];
  var blackNotes = [
    { note: "C#4", left: "11%" },
    { note: "D#4", left: "23.5%" },
    { note: "F#4", left: "48.5%" },
    { note: "G#4", left: "61%" },
    { note: "A#4", left: "73.5%" }
  ];

  var pianoContainer = document.getElementById("pianoKeys");

  // Build white keys
  whiteNotes.forEach(function (note) {
    var key = document.createElement("div");
    key.className = "white-key";
    key.dataset.note = note;
    key.textContent = note.replace("4", "").replace("5", "");
    key.addEventListener("mousedown", function () { playNote(note); });
    key.addEventListener("touchstart", function (e) {
      e.preventDefault();
      playNote(note);
    });
    pianoContainer.appendChild(key);
  });

  // Build black keys
  blackNotes.forEach(function (item) {
    var key = document.createElement("div");
    key.className = "black-key";
    key.dataset.note = item.note;
    key.style.left = item.left;
    key.addEventListener("mousedown", function () { playNote(item.note); });
    key.addEventListener("touchstart", function (e) {
      e.preventDefault();
      playNote(item.note);
    });
    pianoContainer.appendChild(key);
  });

  function playNote(note) {
    ensureAudioCtx();
    var freq = noteFreqs[note];
    if (!freq) return;

    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.8);

    // Visual feedback
    var keyEl = pianoContainer.querySelector('[data-note="' + note + '"]');
    if (keyEl) {
      keyEl.classList.add("active");
      setTimeout(function () { keyEl.classList.remove("active"); }, 200);
    }
  }

  // Keyboard mapping
  var keyboardMap = {
    a: "C4", w: "C#4", s: "D4", e: "D#4", d: "E4",
    f: "F4", t: "F#4", g: "G4", y: "G#4", h: "A4",
    u: "A#4", j: "B4", k: "C5"
  };
  document.addEventListener("keydown", function (e) {
    if (e.repeat) return;
    var note = keyboardMap[e.key.toLowerCase()];
    if (note) playNote(note);
  });

  // Song playback
  var songs = {
    twinkle: [
      "C4","C4","G4","G4","A4","A4","G4","_",
      "F4","F4","E4","E4","D4","D4","C4","_",
      "G4","G4","F4","F4","E4","E4","D4","_",
      "G4","G4","F4","F4","E4","E4","D4","_",
      "C4","C4","G4","G4","A4","A4","G4","_",
      "F4","F4","E4","E4","D4","D4","C4"
    ],
    mary: [
      "E4","D4","C4","D4","E4","E4","E4","_",
      "D4","D4","D4","_","E4","G4","G4","_",
      "E4","D4","C4","D4","E4","E4","E4","E4",
      "D4","D4","E4","D4","C4"
    ],
    ode: [
      "E4","E4","F4","G4","G4","F4","E4","D4",
      "C4","C4","D4","E4","E4","_","D4","D4","_",
      "E4","E4","F4","G4","G4","F4","E4","D4",
      "C4","C4","D4","E4","D4","_","C4","C4"
    ]
  };

  var currentSong = "free";
  var songPlaying = false;

  document.querySelectorAll(".song-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".song-btn").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      currentSong = btn.dataset.song;
      if (currentSong !== "free" && !songPlaying) {
        playSong(songs[currentSong]);
      }
    });
  });

  function playSong(notes) {
    songPlaying = true;
    var i = 0;
    var tempo = 280;
    function next() {
      if (i >= notes.length) { songPlaying = false; return; }
      if (notes[i] === "_") { i++; setTimeout(next, tempo); return; }
      playNote(notes[i]);
      i++;
      setTimeout(next, tempo);
    }
    next();
  }

  // ---- MENTAL MATH GAME ----
  var gameProblem = document.getElementById("gameProblem");
  var gameAnswer = document.getElementById("gameAnswer");
  var gameSubmit = document.getElementById("gameSubmit");
  var gameFeedback = document.getElementById("gameFeedback");
  var scoreCorrect = document.getElementById("scoreCorrect");
  var scoreStreak = document.getElementById("scoreStreak");
  var scoreTotal = document.getElementById("scoreTotal");
  var streakFill = document.getElementById("streakFill");

  var correct = 0, streak = 0, total = 0, currentAnswer = 0, bestStreak = 0;

  function generateProblem() {
    var ops = ["+", "-", "\u00D7"];
    var op = ops[Math.floor(Math.random() * ops.length)];
    var a, b, answer;

    var difficulty = Math.min(Math.floor(streak / 3), 4);

    if (op === "+") {
      a = randInt(5 + difficulty * 5, 20 + difficulty * 20);
      b = randInt(3 + difficulty * 3, 15 + difficulty * 15);
      answer = a + b;
    } else if (op === "-") {
      a = randInt(10 + difficulty * 5, 30 + difficulty * 20);
      b = randInt(3, a);
      answer = a - b;
    } else {
      a = randInt(2 + difficulty, 9 + difficulty * 3);
      b = randInt(2, 9 + difficulty * 2);
      answer = a * b;
    }

    gameProblem.textContent = a + " " + op + " " + b;
    currentAnswer = answer;
    gameAnswer.value = "";
    gameFeedback.textContent = "";
    gameFeedback.className = "game-feedback";
    gameAnswer.focus();
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function checkGameAnswer() {
    var userAns = parseInt(gameAnswer.value, 10);
    if (isNaN(userAns)) return;
    total++;
    if (userAns === currentAnswer) {
      correct++;
      streak++;
      if (streak > bestStreak) bestStreak = streak;
      gameFeedback.textContent = "Correct!";
      gameFeedback.className = "game-feedback correct";
    } else {
      streak = 0;
      gameFeedback.textContent = "Not quite — the answer was " + currentAnswer;
      gameFeedback.className = "game-feedback wrong";
    }
    scoreCorrect.textContent = correct;
    scoreStreak.textContent = streak;
    scoreTotal.textContent = total;
    streakFill.style.width = Math.min(streak * 10, 100) + "%";
    setTimeout(generateProblem, 900);
  }

  gameSubmit.addEventListener("click", checkGameAnswer);
  gameAnswer.addEventListener("keydown", function (e) {
    if (e.key === "Enter") checkGameAnswer();
  });
  generateProblem();

  // ---- PATTERN RECOGNITION ----
  var patternSequence = document.getElementById("patternSequence");
  var patternChoices = document.getElementById("patternChoices");
  var patternFeedback = document.getElementById("patternFeedback");
  var patternScoreEl = document.getElementById("patternScore");
  var patternScore = 0;
  var patternLevel = 0;

  var patternGenerators = [
    // Arithmetic sequences
    function () {
      var start = randInt(1, 20);
      var step = randInt(2, 8);
      var seq = [];
      for (var i = 0; i < 6; i++) seq.push(start + step * i);
      return seq;
    },
    // Geometric-ish (multiply)
    function () {
      var start = randInt(1, 5);
      var factor = randInt(2, 3);
      var seq = [start];
      for (var i = 1; i < 6; i++) seq.push(seq[i - 1] * factor);
      if (seq[5] > 999) return patternGenerators[0]();
      return seq;
    },
    // Squares
    function () {
      var base = randInt(1, 6);
      var seq = [];
      for (var i = 0; i < 6; i++) seq.push((base + i) * (base + i));
      return seq;
    },
    // Alternating add
    function () {
      var start = randInt(1, 10);
      var a = randInt(2, 5);
      var b = randInt(1, 4);
      var seq = [start];
      for (var i = 1; i < 6; i++) {
        seq.push(seq[i - 1] + (i % 2 === 1 ? a : b));
      }
      return seq;
    },
    // Fibonacci-like
    function () {
      var a = randInt(1, 5);
      var b = randInt(1, 5);
      var seq = [a, b];
      for (var i = 2; i < 6; i++) seq.push(seq[i - 1] + seq[i - 2]);
      return seq;
    },
    // Triangular numbers offset
    function () {
      var offset = randInt(0, 5);
      var seq = [];
      for (var i = 0; i < 6; i++) {
        var n = i + 1 + offset;
        seq.push((n * (n + 1)) / 2);
      }
      return seq;
    }
  ];

  function generatePattern() {
    var genIndex = Math.min(patternLevel, patternGenerators.length - 1);
    var pool = patternGenerators.slice(0, genIndex + 1);
    var gen = pool[Math.floor(Math.random() * pool.length)];
    var seq = gen();
    var answer = seq[5];
    var display = seq.slice(0, 5);

    patternSequence.innerHTML = "";
    display.forEach(function (n) {
      var el = document.createElement("div");
      el.className = "pattern-num";
      el.textContent = n;
      patternSequence.appendChild(el);
    });
    var blank = document.createElement("div");
    blank.className = "pattern-num blank";
    blank.textContent = "?";
    patternSequence.appendChild(blank);

    // Generate choices
    var choices = [answer];
    while (choices.length < 4) {
      var offset = randInt(-5, 5);
      var c = answer + offset;
      if (c !== answer && choices.indexOf(c) === -1 && c >= 0) {
        choices.push(c);
      }
    }
    shuffle(choices);

    patternChoices.innerHTML = "";
    patternFeedback.textContent = "";
    patternFeedback.className = "pattern-feedback";

    choices.forEach(function (c) {
      var btn = document.createElement("button");
      btn.className = "pattern-choice";
      btn.textContent = c;
      btn.addEventListener("click", function () {
        if (btn.disabled) return;
        document.querySelectorAll(".pattern-choice").forEach(function (b) { b.disabled = true; });
        if (c === answer) {
          btn.classList.add("correct-pick");
          patternFeedback.textContent = "Correct! Great pattern recognition.";
          patternFeedback.style.color = "#22c55e";
          patternScore++;
          patternLevel = Math.min(patternLevel + 1, patternGenerators.length - 1);
        } else {
          btn.classList.add("wrong-pick");
          patternFeedback.textContent = "The answer was " + answer + ". Keep trying!";
          patternFeedback.style.color = "#ef4444";
          patternLevel = Math.max(patternLevel - 1, 0);
        }
        patternScoreEl.textContent = "Score: " + patternScore;
        setTimeout(generatePattern, 1400);
      });
      patternChoices.appendChild(btn);
    });
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }

  generatePattern();
})();