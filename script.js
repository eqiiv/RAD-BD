const musicButton = document.getElementById("musicButton");
const musicLabel = document.getElementById("musicLabel");
const player = document.getElementById("youtubePlayer");

let isPlaying = false;
let playerReady = false;

// YouTube IFrame API messages let the button control the embedded player.
// The actual song is never downloaded or modified by this website.
window.addEventListener("message", (event) => {
  if (event.origin !== "https://www.youtube-nocookie.com") return;
  try {
    const data = JSON.parse(event.data);
    if (data.event === "onReady") playerReady = true;
  } catch (_) {}
});

function sendYouTubeCommand(command) {
  player.contentWindow.postMessage(JSON.stringify({
    event: "command",
    func: command,
    args: []
  }), "https://www.youtube-nocookie.com");
}

musicButton.addEventListener("click", () => {
  if (!isPlaying) {
    sendYouTubeCommand("playVideo");
    isPlaying = true;
    musicButton.classList.add("playing");
    musicButton.setAttribute("aria-pressed", "true");
    musicButton.setAttribute("aria-label", "Pause birthday music");
    musicLabel.textContent = "Pause Music";
  } else {
    sendYouTubeCommand("pauseVideo");
    isPlaying = false;
    musicButton.classList.remove("playing");
    musicButton.setAttribute("aria-pressed", "false");
    musicButton.setAttribute("aria-label", "Play birthday music");
    musicLabel.textContent = "Play Music";
  }
});

// Reveal elements as they enter the viewport.
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Gentle floating hearts/sparkles.
const particleRoot = document.getElementById("particles");
const symbols = ["♡", "✦", "·", "✧"];

function createParticle() {
  const particle = document.createElement("span");
  particle.className = "particle";
  particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  particle.style.left = `${Math.random() * 100}%`;
  particle.style.fontSize = `${8 + Math.random() * 12}px`;
  particle.style.animationDuration = `${9 + Math.random() * 9}s`;
  particle.style.animationDelay = `${Math.random() * 2}s`;
  particleRoot.appendChild(particle);

  setTimeout(() => particle.remove(), 20000);
}

setInterval(createParticle, 1300);

// Prevent the decorative particles from becoming excessive on reduced-motion devices.
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  for (let i = 0; i < 8; i++) createParticle();
}
