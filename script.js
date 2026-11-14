
document.addEventListener("DOMContentLoaded", () => {

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const intro = $("#intro");
  const experience = $("#experience");
  const levels = $$(".level");

  const chapterNames = [
    "Një dëshirë për ty",
    "Një pyetje e vogël",
    "Një shoqëri e vogël",
    "Pak magji",
    "Një letër për ty"
  ];

  const catWords = [
    "Të dua ♡",
    "Dritë",
    "Shpirt",
    "Jetë",
    "Engjëll"
  ];

  let catClicks = 0;
  let catLocked = false;
  let collected = 0;
  let collectionLocked = false;
  let levelFourStarted = false;
  let transitionTimer = null;


  // BACKGROUND EFFECTS

  function makeAtmosphere() {

    const balloons = $("#balloonLayer");
    const sparkles = $("#sparkleLayer");
    const rain = $("#rainLayer");

    if (balloons) {

      const colors = [
        "#f4a7b8",
        "#f7d3c2",
        "#e7b7d2",
        "#d8b9df",
        "#f5c8a2"
      ];

      for (let i = 0; i < 13; i++) {

        const balloon = document.createElement("span");

        balloon.className = "balloon";
        balloon.style.left = `${Math.random() * 100}%`;
        balloon.style.background = colors[i % colors.length];

        balloon.style.setProperty(
          "--dur",
          `${19 + Math.random() * 17}s`
        );

        balloon.style.setProperty(
          "--delay",
          `${Math.random() * -30}s`
        );

        balloon.style.setProperty(
          "--drift",
          `${Math.random() * 100 - 50}px`
        );

        balloons.appendChild(balloon);
      }
    }


    if (sparkles) {

      for (let i = 0; i < 30; i++) {

        const sparkle = document.createElement("span");

        sparkle.className = "sparkle";
        sparkle.textContent = i % 3 === 0 ? "✧" : "·";

        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;

        sparkle.style.setProperty(
          "--dur",
          `${2 + Math.random() * 4}s`
        );

        sparkle.style.setProperty(
          "--delay",
          `${Math.random() * -5}s`
        );

        sparkles.appendChild(sparkle);
      }
    }


    if (rain) {

      for (let i = 0; i < 35; i++) {

        const drop = document.createElement("span");

        drop.className = "raindrop";
        drop.style.left = `${Math.random() * 100}%`;

        drop.style.setProperty(
          "--len",
          `${25 + Math.random() * 45}px`
        );

        drop.style.setProperty(
          "--dur",
          `${1.1 + Math.random() * 1.5}s`
        );

        drop.style.setProperty(
          "--delay",
          `${Math.random() * -4}s`
        );

        rain.appendChild(drop);
      }
    }
  }

  makeAtmosphere();


  // LEVEL NAVIGATION

  function showLevel(number) {

    levels.forEach(level => {
      level.classList.remove("active");
    });

    const nextLevel = $(`#level${number}`);

    if (nextLevel) {
      nextLevel.classList.add("active");
    }

    $("#chapterName").textContent = chapterNames[number - 1];

    $("#chapterNumber").textContent =
      `${String(number).padStart(2, "0")} / 05`;

    $("#progressBar").style.width = `${number * 20}%`;

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }


  // START

  $("#startBtn").addEventListener("click", () => {

    intro.classList.add("hidden");
    experience.classList.remove("hidden");

    showLevel(1);

  });


  // LEVEL 1 - CANDLES

  $("#blowBtn").addEventListener("click", () => {

    $$(".flame").forEach((flame, index) => {

      setTimeout(() => {

        flame.style.opacity = "0";

        flame.style.transform =
          "scale(.1) translateY(-15px)";

      }, index * 150);

    });

    $("#blowBtn").classList.add("hidden");

    $("#candleStatus").textContent =
      "Dëshira u dërgua... ♡";

    setTimeout(() => {

      $("#afterCandles").classList.remove("hidden");

    }, 700);

  });


  $("#toLevel2").addEventListener("click", () => {

    showLevel(2);

  });


  // LEVEL 2 - YES / NO

  const noBtn = $("#noBtn");

  function dodgeNo() {

    if (!noBtn || noBtn.classList.contains("hidden")) {
      return;
    }

    const area = $(".answer-area");
    const bounds = area.getBoundingClientRect();

    const x = Math.round(
      (Math.random() - .5) * Math.min(180, bounds.width * .55)
    );

    const y = Math.round(
      (Math.random() - .5) * 75
    );

    noBtn.style.transform = `translate(${x}px, ${y}px)`;
  }


  noBtn.addEventListener("mouseenter", dodgeNo);

  noBtn.addEventListener("click", (event) => {

    event.preventDefault();
    dodgeNo();

  });

  noBtn.addEventListener("touchstart", (event) => {

    event.preventDefault();
    dodgeNo();

  }, { passive: false });


  $("#yesBtn").addEventListener("click", () => {

    $("#yesResult").classList.remove("hidden");

    $("#yesBtn").classList.add("hidden");

    noBtn.classList.add("hidden");

  });


  $("#afterYes").addEventListener("click", () => {

    showLevel(3);

  });


  // LEVEL 3 - CAT
  // After the fifth tap, level 4 opens automatically.

  const catBtn = $("#catBtn");

  catBtn.addEventListener("click", () => {

    if (catLocked || catClicks >= 5) {
      return;
    }

    catClicks++;

    const word = catWords[catClicks - 1];
    const wordElement = $("#catWord");

    wordElement.classList.remove("show");
    wordElement.textContent = word;

    // Restart the word animation
    void wordElement.offsetWidth;

    wordElement.classList.add("show");

    $("#catSpeech").textContent = word;

    $("#catCount").textContent =
      `${catClicks} / 5`;

    $("#catCounterFill").style.width =
      `${catClicks * 20}%`;

    $("#catNote").textContent =
      catClicks === 5
        ? "Misioni u përfundua!"
        : "Edhe pak dhe surpriza vazhdon...";


    // FIFTH TAP: FINISH CAT LEVEL

    if (catClicks === 5) {

      catLocked = true;

      catBtn.classList.add("leaving");
      catBtn.disabled = true;

      $("#afterCat").classList.remove("hidden");

      $("#catSpeech").textContent =
        "Mirupafshim! ♡";

      transitionTimer = setTimeout(() => {

        showLevel(4);

        startLevelFour();

      }, 1200);

    }

  });


  // LEVEL 4 - SHORT QUESTION

 function startLevelFour() {

  if (levelFourStarted) return;

  levelFourStarted = true;

  const flash = $("#flashMessage");
  const game = $("#romanticGame");

  flash.classList.remove("hidden");

  setTimeout(() => {

    flash.classList.add("hidden");

    game.classList.remove("hidden");

  }, 1100);

  }


  // LEVEL 4 - COLLECT OBJECTS

  const collectItems = $$(".collect-item");

  collectItems.forEach(item => {

    item.addEventListener("click", () => {

      if (
        collectionLocked ||
        item.classList.contains("collected")
      ) {
        return;
      }

      item.classList.add("collected");
      item.disabled = true;

      collected++;

      $("#collectCount").textContent =
        `${collected} / 5`;

      $("#collectFill").style.width =
        `${collected * 20}%`;

      $("#collectMessage").textContent =
        item.dataset.message || "Një kujtim i vogël ♡";


      if (collected === 5) {

        finishCollection();

      }

    });

  });


  function finishCollection() {

    if (collectionLocked) {
      return;
    }

    collectionLocked = true;

    $("#loadingArea").classList.remove("hidden");

    const fill = $("#loadingFill");

    fill.style.transition = "none";
    fill.style.width = "0%";

    requestAnimationFrame(() => {

      fill.style.transition = "width 1.8s ease";
      fill.style.width = "100%";

    });

    setTimeout(() => {

      $("#loadingArea").classList.add("hidden");

      $("#afterCollection").classList.remove("hidden");

      $("#collectMessage").textContent =
        "Gjithçka u mblodh. ♡";

    }, 1900);

  }


  // GO TO FINAL LETTER

  $("#toLevel5").addEventListener("click", () => {

    showLevel(5);

  });


  // RESTART EVERYTHING

  $("#restartBtn").addEventListener("click", () => {

    if (transitionTimer) {
      clearTimeout(transitionTimer);
    }

    catClicks = 0;
    catLocked = false;
    collected = 0;
    collectionLocked = false;
    levelFourStarted = false;


    // RESET CANDLES

    $$(".flame").forEach(flame => {

      flame.style.opacity = "1";
      flame.style.transform = "";

    });

    $("#blowBtn").classList.remove("hidden");

    $("#candleStatus").textContent =
      "Dëshira është gati?";

    $("#afterCandles").classList.add("hidden");


    // RESET LEVEL 2

    $("#yesResult").classList.add("hidden");

    $("#yesBtn").classList.remove("hidden");

    noBtn.classList.remove("hidden");

    noBtn.style.transform = "";


    // RESET CAT

    catBtn.classList.remove("leaving");

    catBtn.disabled = false;

    $("#catWord").textContent = "";

    $("#catWord").classList.remove("show");

    $("#catSpeech").textContent =
      "Më prek edhe një herë ♡";

    $("#catCount").textContent = "0 / 5";

    $("#catCounterFill").style.width = "0%";

    $("#catNote").textContent =
      "Çdo prekje sjell një fjalë të bukur.";

    $("#afterCat").classList.add("hidden");


    // RESET LEVEL 4

    $("#flashMessage").classList.remove("hidden");

    $("#romanticGame").classList.add("hidden");

    $("#loadingArea").classList.add("hidden");

    $("#afterCollection").classList.add("hidden");

    $("#collectMessage").textContent =
      "Mblidhi të gjitha";

    $("#collectCount").textContent = "0 / 5";

    $("#collectFill").style.width = "0%";

    $("#loadingFill").style.width = "0%";


    collectItems.forEach(item => {

      item.classList.remove("collected");

      item.disabled = false;

    });


    // RETURN TO INTRO

    experience.classList.add("hidden");

    intro.classList.remove("hidden");

    showLevel(1);

  });

});
