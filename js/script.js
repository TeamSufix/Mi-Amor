/* =========================================================
   MARIELLE — BIRTHDAY EXPERIENCE
========================================================= */

"use strict";

/* =========================================================
   STATE
========================================================= */

let currentPage = "hero-page";

let journeyStep = 1;

let celebrationStep = 1;

let musicStarted = false;

let particleInterval = null;

let balloonInterval = null;

let sparkleInterval = null;

/* =========================================================
   DOM HELPERS
========================================================= */

function $(selector) {
  return document.querySelector(selector);
}

function $$(selector) {
  return document.querySelectorAll(selector);
}

/* =========================================================
   PAGE TRANSITIONS
========================================================= */

function transitionTo(pageId) {
  const current = document.getElementById(currentPage);
  const target = document.getElementById(pageId);

  if (!target) return;

  if (current) {
    current.classList.remove("active");
  }

  setTimeout(() => {
    target.classList.add("active");

    currentPage = pageId;

    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, 100);
}

/* =========================================================
   NAVIGATION BUTTONS
========================================================= */

function initializeNavigation() {
  $$("[data-next]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextPage = button.getAttribute("data-next");

      if (!nextPage) return;

      transitionTo(nextPage);
    });
  });
}

/* =========================================================
   JOURNEY
========================================================= */

function nextStep(step) {
  journeyStep = step;

  $$(".journey-step").forEach((item) => {
    item.classList.remove("active");
  });

  $$(".journey-dots span").forEach((item) => {
    item.classList.remove("active");
  });

  const selectedStep = document.getElementById(`step-${step}`);

  const selectedDot = document.getElementById(`journey-dot-${step}`);

  if (selectedStep) {
    selectedStep.classList.add("active");
  }

  if (selectedDot) {
    selectedDot.classList.add("active");
  }

  const counter = document.getElementById("journey-number");

  if (counter) {
    counter.textContent = String(step).padStart(2, "0");
  }
}

/* =========================================================
   START CELEBRATION
========================================================= */

function startCelebration() {
  transitionTo("celebration-page");

  celebrationStep = 1;

  setTimeout(() => {
    createFairyLights();

    createParticles("celebration-particles", 25);
  }, 500);
}

/* =========================================================
   CELEBRATION FLOW
========================================================= */

function celebrationFlow() {
  const page = document.getElementById("celebration-page");

  const title = document.getElementById("celebration-title");

  const hint = document.getElementById("celebration-hint");

  const buttonText = document.getElementById("celebration-button-text");

  const buttonIcon = document.getElementById("celebration-button-icon");

  /* -----------------------------------------
       STEP 1 — LIGHTS
    ----------------------------------------- */

  if (celebrationStep === 1) {
    page.classList.add("bright");

    $("#fairy-lights").classList.add("active");

    setTimeout(() => {
      $$(".bulb").forEach((bulb, index) => {
        setTimeout(() => {
          bulb.classList.add("on");
        }, index * 45);
      });
    }, 300);

    title.textContent = "Now, listen to my heart...";

    title.classList.add("lit");

    hint.textContent =
      "There is a song that reminds me of the love I have for you.";

    buttonIcon.textContent = "🎵";

    buttonText.textContent = "Play Our Song";

    activateProgress(2);

    celebrationStep = 2;

    showToast("The lights are on... ❤️");

    return;
  }

  /* -----------------------------------------
       STEP 2 — MUSIC
    ----------------------------------------- */

  if (celebrationStep === 2) {
    playMusic();

    title.textContent = "For my beautiful Marielle";

    hint.textContent =
      "Close your eyes for a second... then let the memories rise.";

    buttonIcon.textContent = "🎈";

    buttonText.textContent = "Let The Balloons Fly";

    activateProgress(3);

    celebrationStep = 3;

    return;
  }

  /* -----------------------------------------
       STEP 3 — BALLOONS
    ----------------------------------------- */

  if (celebrationStep === 3) {
    launchBalloons();

    title.textContent = "Almost there, my love...";

    hint.textContent = "I saved the most important part for you.";

    buttonIcon.textContent = "✨";

    buttonText.textContent = "Show Me Your Message";

    activateProgress(4);

    celebrationStep = 4;

    return;
  }

  /* -----------------------------------------
       STEP 4 — LETTER
    ----------------------------------------- */

  if (celebrationStep === 4) {
    openLetter();
  }
}

/* =========================================================
   PROGRESS
========================================================= */

function activateProgress(step) {
  $$(".celebration-progress span").forEach((item, index) => {
    item.classList.toggle("active", index < step);
  });
}

/* =========================================================
   MUSIC
========================================================= */

function playMusic() {
  const audio = document.getElementById("birthday-audio");

  if (!audio) {
    console.error("Birthday audio element not found.");
    showToast("I couldn't find our song. ❤️");
    return;
  }

  // Make sure the browser knows exactly where the file is
  console.log("Audio source:", audio.currentSrc || audio.querySelector("source")?.src);

  audio.volume = 0.65;

  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        musicStarted = true;

        console.log("Ordinary.mp3 is now playing ❤️");

        showToast("Now playing: Ordinary ❤️");
      })
      .catch((error) => {
        console.error("Audio playback failed:", error);

        showToast("Tap Play Our Song again ❤️");
      });
  }
}
/* =========================================================
   AUDIO FADE
========================================================= */

function fadeAudioIn(audio) {
  let volume = 0;

  const fade = setInterval(() => {
    volume += 0.03;

    audio.volume = Math.min(volume, 0.65);

    if (volume >= 0.65) {
      clearInterval(fade);
    }
  }, 100);
}

/* =========================================================
   FAIRY LIGHTS
========================================================= */

function createFairyLights() {
  const container = document.getElementById("fairy-lights");

  if (!container) return;

  if (container.querySelectorAll(".bulb").length > 0) {
    return;
  }

  const path = document.getElementById("wire-path");

  if (!path) return;

  const pathLength = path.getTotalLength();

  const bulbCount = 27;

  for (let i = 0; i <= bulbCount; i++) {
    const distance = (i / bulbCount) * pathLength;

    const point = path.getPointAtLength(distance);

    const bulb = document.createElement("div");

    bulb.className = "bulb";

    bulb.style.left = `${(point.x / 1200) * 100}%`;

    bulb.style.top = `${point.y}px`;

    bulb.style.setProperty("--flicker", `${0.5 + Math.random() * 2}s`);

    container.appendChild(bulb);
  }
}

/* =========================================================
   BALLOONS
========================================================= */

function launchBalloons() {
  const colors = [
    {
      main: "#ff2d68",
      dark: "#8e1239",
    },

    {
      main: "#ff6f9c",
      dark: "#b11b4f",
    },

    {
      main: "#b7ff4a",
      dark: "#5d8e19",
    },

    {
      main: "#ffd6e2",
      dark: "#ff6f9c",
    },

    {
      main: "#ffffff",
      dark: "#ffb5ca",
    },
  ];

  let count = 0;

  balloonInterval = setInterval(() => {
    createBalloon(colors);

    count++;

    if (count >= 18) {
      clearInterval(balloonInterval);

      balloonInterval = null;
    }
  }, 280);
}

/* =========================================================
   CREATE BALLOON
========================================================= */

function createBalloon(colors) {
  const balloon = document.createElement("div");

  balloon.className = "balloon";

  const shine = document.createElement("div");

  shine.className = "balloon-shine";

  const color = colors[Math.floor(Math.random() * colors.length)];

  balloon.style.left = `${Math.random() * 94}vw`;

  balloon.style.setProperty("--duration", `${6 + Math.random() * 4}s`);

  balloon.style.setProperty("--sway", `${-80 + Math.random() * 160}px`);

  balloon.style.background = `
        radial-gradient(
            circle at 30% 25%,
            #ffffff88,
            transparent 12%
        ),
        radial-gradient(
            circle at 70% 30%,
            ${color.main},
            ${color.dark}
        )
        `;

  balloon.style.boxShadow = `
        inset -12px -14px 22px
        rgba(0,0,0,0.25),

        0 10px 30px
        rgba(0,0,0,0.2)
        `;

  balloon.appendChild(shine);

  document.body.appendChild(balloon);

  setTimeout(() => {
    balloon.remove();
  }, 11000);
}

/* =========================================================
   LETTER
========================================================= */

function openLetter() {
  transitionTo("letter-page");

  setTimeout(() => {
    const stage = document.getElementById("curtain-stage");

    if (!stage) return;

    stage.classList.add("open");

    startLetterSparkles();
  }, 850);
}

/* =========================================================
   LETTER SPARKLES
========================================================= */

function startLetterSparkles() {
  const card = document.querySelector(".letter-card");

  if (!card) return;

  if (sparkleInterval) {
    clearInterval(sparkleInterval);
  }

  sparkleInterval = setInterval(() => {
    if (!document.getElementById("letter-page").classList.contains("active")) {
      return;
    }

    const sparkle = document.createElement("div");

    sparkle.className = "sparkle";

    sparkle.style.left = `${Math.random() * 95}%`;

    sparkle.style.top = `${Math.random() * 95}%`;

    card.appendChild(sparkle);

    setTimeout(() => {
      sparkle.remove();
    }, 1400);
  }, 300);
}

/* =========================================================
   GALLERY
========================================================= */

function showGallery() {
  transitionTo("gallery-page");

  setTimeout(() => {
    startGalleryEffects();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, 500);
}

/* =========================================================
   GALLERY EFFECTS
========================================================= */

function startGalleryEffects() {
  createParticles("gallery-effects", 15);
}

/* =========================================================
   PARTICLES
========================================================= */

function createParticles(containerId, amount = 15) {
  const container = document.getElementById(containerId);

  if (!container) return;

  for (let i = 0; i < amount; i++) {
    setTimeout(() => {
      createSingleParticle(container);
    }, i * 120);
  }
}

/* =========================================================
   SINGLE PARTICLE
========================================================= */

function createSingleParticle(container) {
  const particle = document.createElement("div");

  particle.className = "particle";

  if (Math.random() > 0.72) {
    particle.classList.add("lime");
  }

  particle.style.left = `${Math.random() * 100}%`;

  particle.style.bottom = `${-10 + Math.random() * 10}%`;

  particle.style.setProperty("--duration", `${5 + Math.random() * 6}s`);

  particle.style.setProperty("--drift", `${-100 + Math.random() * 200}px`);

  container.appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, 12000);
}

/* =========================================================
   CONTINUOUS HERO PARTICLES
========================================================= */

function startHeroParticles() {
  const container = document.getElementById("hero-particles");

  if (!container) return;

  if (particleInterval) {
    clearInterval(particleInterval);
  }

  particleInterval = setInterval(() => {
    createSingleParticle(container);
  }, 650);
}

/* =========================================================
   LIGHTBOX
========================================================= */

function openLightbox(image, message) {
  const lightbox = document.getElementById("memory-lightbox");

  const lightboxImage = document.getElementById("lightbox-image");

  const lightboxMessage = document.getElementById("lightbox-message");

  lightboxImage.src = image;

  lightboxMessage.textContent = message;

  lightbox.classList.add("open");

  lightbox.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const lightbox = document.getElementById("memory-lightbox");

  lightbox.classList.remove("open");

  lightbox.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";
}

/* =========================================================
   MEMORY CARD EVENTS
========================================================= */

function initializeMemoryCards() {
  $$(".memory-card").forEach((card) => {
    card.addEventListener("click", () => {
      const image = card.querySelector("img");

      const message = card.querySelector(".memory-overlay p");

      if (!image || !message) {
        return;
      }

      openLightbox(image.src, message.textContent);
    });
  });
}

/* =========================================================
   TOAST
========================================================= */

function showToast(message) {
  const toast = document.getElementById("toast");

  if (!toast) return;

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

/* =========================================================
   REPLAY
========================================================= */

function replayExperience() {
  const audio = document.getElementById("birthday-audio");

  if (audio) {
    audio.pause();

    audio.currentTime = 0;
  }

  musicStarted = false;

  celebrationStep = 1;

  journeyStep = 1;

  /* Reset journey */

  $$(".journey-step").forEach((step) => {
    step.classList.remove("active");
  });

  $("#step-1").classList.add("active");

  $$(".journey-dots span").forEach((dot) => {
    dot.classList.remove("active");
  });

  $("#journey-dot-1").classList.add("active");

  $("#journey-number").textContent = "01";

  /* Reset celebration */

  const celebration = document.getElementById("celebration-page");

  celebration.classList.remove("bright");

  $("#fairy-lights").classList.remove("active");

  $$(".bulb").forEach((bulb) => {
    bulb.classList.remove("on");
  });

  $("#celebration-title").textContent = "The room is dark...";

  $("#celebration-title").classList.remove("lit");

  $("#celebration-hint").textContent =
    "But every beautiful story needs a little light.";

  $("#celebration-button-icon").textContent = "💡";

  $("#celebration-button-text").textContent = "Turn On The Lights";

  activateProgress(1);

  /* Reset curtains */

  $("#curtain-stage").classList.remove("open");

  /* Return */

  transitionTo("hero-page");

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

/* =========================================================
   KEYBOARD SUPPORT
========================================================= */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});

/* =========================================================
   CLOSE LIGHTBOX ON BACKDROP
========================================================= */

document
  .getElementById("memory-lightbox")
  .addEventListener("click", (event) => {
    if (event.target.id === "memory-lightbox") {
      closeLightbox();
    }
  });

/* =========================================================
   INITIALIZATION
========================================================= */

window.addEventListener("load", () => {
  startHeroParticles();

  initializeMemoryCards();

  initializeNavigation();

  createParticles("hero-particles", 20);
});
