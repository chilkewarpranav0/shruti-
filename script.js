(() => {
  const config = window.SURPRISE_CONFIG || {};
  const gate = document.getElementById("gate");
  const site = document.getElementById("site");
  const form = document.getElementById("unlock-form");
  const input = document.getElementById("passcode");
  const error = document.getElementById("password-error");

  function enterSite() {
    gate.classList.add("gate-leave");
    window.setTimeout(() => {
      gate.style.display = "none";
      site.classList.remove("hidden");
      document.body.classList.add("unlocked");
      observeReveals();
    }, 450);
  }

  if (!config.password || config.password.enabled !== true) {
    enterSite();
  } else {
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (input.value === String(config.password.value || "")) {
        error.textContent = "";
        enterSite();
      } else {
        error.textContent = "Not quite — try our special word again 💗";
        input.focus();
      }
    });
  }

  document.getElementById("letter-button").addEventListener("click", event => {
    const letter = document.getElementById("letter-content");
    letter.classList.toggle("hidden");
    event.currentTarget.textContent = letter.classList.contains("hidden") ? "Read my letter ♥" : "Close letter";
  });

  const audio = document.getElementById("background-music");
  const musicButton = document.getElementById("music-toggle");
  if (config.musicFile) audio.src = config.musicFile;
  musicButton.addEventListener("click", async () => {
    if (!audio.src) {
      musicButton.querySelector("span").textContent = "Add a song in config.js";
      return;
    }
    if (audio.paused) {
      try {
        await audio.play();
        musicButton.setAttribute("aria-pressed", "true");
        musicButton.querySelector("span").textContent = "Pause music";
      } catch (_) {
        musicButton.querySelector("span").textContent = "Tap to play";
      }
    } else {
      audio.pause();
      musicButton.setAttribute("aria-pressed", "false");
      musicButton.querySelector("span").textContent = "Play music";
    }
  });

  function observeReveals() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(item => item.classList.add("visible"));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(item => observer.observe(item));
  }

  const hearts = document.querySelector(".hearts");
  for (let i = 0; i < 18; i++) {
    const heart = document.createElement("span");
    heart.textContent = i % 3 === 0 ? "♥" : "♡";
    heart.style.left = `${(i * 37) % 100}%`;
    heart.style.animationDelay = `${(i % 9) * -1.7}s`;
    heart.style.animationDuration = `${12 + (i % 6) * 2}s`;
    hearts.appendChild(heart);
  }
})();