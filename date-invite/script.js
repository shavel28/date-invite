/* =========================================================
   EDIT ME — customize the whole experience from here.
   Everything a person sees on the site comes from CONFIG.
   ========================================================= */
const CONFIG = {
  // shown on the printable receipt
  dateLabel: "October 25, 2024",
  pickupTime: "17:00 (5:00 PM)",

  places: [
    { title: "Alun-Alun Surabaya", tags: "🚶 Walk · 🧭 Explore · 📷 Take pictures" },
    { title: "Park Shanghai", tags: "☕ Chill · 🚶 Walk · 💬 Talk" },
    { title: "Kota Lama Surabaya", tags: "🧭 Explore · 📷 Photos" },
    { title: "Surabaya North Quay", tags: "🌅 Sunset · 👀 View · 🍹 Chill" },
  ],

  noodleSpots: [
    { name: "Mie Gacoan", desc: "Spicy & casual vibes for a fiery craving", emoji: "🌶️" },
    { name: "Wizz Mie", desc: "Trendy noodles & chill atmosphere", emoji: "✨" },
    { name: "Mie Ayam", desc: "Simple, comforting, classic street food", emoji: "🍜" },
  ],

  riceSpots: [
    { name: "Hotways" },
    { name: "Warung Tunjungan" },
  ],

  afterEating: [
    { title: "Walking around the area", desc: "Let's explore together and digest our meal.", emoji: "🚶", color: "#e4f1da" },
    { title: "Sitting & chatting", desc: "Snacks, drinks, and deep conversations.", emoji: "💬", color: "#fdf1c8" },
    { title: "Going on a motorcycle!", desc: "Let's just ride around and feel the breeze.", emoji: "🏍️", color: "#ece2f7" },
  ],

  sitActivities: [
    { title: "Play Mobile Legends", emoji: "🎮", color: "#fde1e8" },
    { title: "Surprise Game", note: "You'll find out later ✨", emoji: "🎁", color: "#dff2d8" },
    { title: "Casual Snack & Talk", emoji: "🍪", color: "#fbe6c4" },
    { title: "Deep Talk", emoji: "❤️", color: "#fde1e8" },
  ],

  rideActivities: [
    { title: "Wandering around randomly", desc: "Let's see where we end up.", emoji: "🏍️", color: "#f4e3ea" },
    { title: "Moving to another place", desc: "", emoji: "📍", color: "#e0f0da" },
    { title: "Going home", desc: "", emoji: "🏠", color: "#ece2f7" },
  ],

  letter: {
    greeting: "Dear you,",
    paragraphs: [
      "Jadi… sebenarnya ada satu alasan kenapa aku bikin kamu memilih semua ini satu per satu.",
    ],
    highlightLine: "Aku pengen ngajak kamu pergi, makan bareng, jalan-jalan, ngobrol sampai lupa waktu, dan maybe make a little memory together. ♡",
    closingParagraphs: [
      "Nothing too complicated. Just you, me, good food, random conversations, and hopefully a really good day.",
      "So…",
    ],
    question: "Will you go on a date with me?",
    signature: "— from me",
  },
};

/* ========================= STATE ========================= */
const state = {
  place: null,
  foodType: null,
  spot: null,
  after: null,
  activity: null,
};

/* ===================== NAVIGATION ===================== */
function goTo(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const target = document.getElementById(id);
  target.classList.add("active");
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

document.querySelectorAll("[data-next]").forEach(btn => {
  btn.addEventListener("click", () => goTo(btn.dataset.next));
});

/* ===================== STAR FIELD ===================== */
const STAR_COLORS = ["#f0a6c8", "#7fc2ea", "#8fbf6c", "#b6a2e0", "#f0b27f", "#e75c98"];
const starField = document.getElementById("star-field");
const stars = [];

function buildStars(count = 26) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "star";
    el.textContent = "★";
    const size = 10 + Math.random() * 16;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    el.style.left = x + "vw";
    el.style.top = y + "vh";
    el.style.fontSize = size + "px";
    el.style.color = STAR_COLORS[i % STAR_COLORS.length];
    el.style.animationDelay = (Math.random() * 4) + "s";
    starField.appendChild(el);
    stars.push({ el, baseX: x, baseY: y, dx: 0, dy: 0 });
  }
}
buildStars();

// stars gently drift away from the cursor
window.addEventListener("pointermove", (e) => {
  const px = (e.clientX / window.innerWidth) * 100;
  const py = (e.clientY / window.innerHeight) * 100;
  stars.forEach(s => {
    const distX = s.baseX - px;
    const distY = s.baseY - py;
    const dist = Math.hypot(distX, distY);
    const radius = 16; // vw/vh influence radius
    if (dist < radius) {
      const force = (radius - dist) / radius;
      s.dx = (distX / (dist || 1)) * force * 6;
      s.dy = (distY / (dist || 1)) * force * 6;
    } else {
      s.dx *= 0.9;
      s.dy *= 0.9;
    }
    s.el.style.transform = `translate(${s.dx}vw, ${s.dy}vh)`;
  });
});

/* ================= SCREEN 2 · "NO" DODGES ================= */
const noBtn = document.getElementById("no-btn");
const readyCard = document.querySelector(".glass-card");
function dodgeNo() {
  const cardRect = readyCard.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();
  const maxX = Math.max(cardRect.width - btnRect.width - 20, 40);
  const maxY = Math.max(cardRect.height - btnRect.height - 20, 40);
  const nx = Math.random() * maxX - maxX / 2;
  const ny = Math.random() * maxY - maxY / 2;
  noBtn.style.transform = `translate(${nx}px, ${ny}px)`;
}
noBtn.addEventListener("pointerenter", dodgeNo);
noBtn.addEventListener("touchstart", (e) => { e.preventDefault(); dodgeNo(); }, { passive: false });
noBtn.addEventListener("click", (e) => { e.preventDefault(); dodgeNo(); });

/* ===================== SCREEN 3 · PLACE ===================== */
const placeList = document.getElementById("place-list");
const placeNextBtn = document.getElementById("place-next");
CONFIG.places.forEach(p => {
  const card = document.createElement("div");
  card.className = "opt-card";
  card.innerHTML = `
    <div>
      <div class="opt-title">${p.title}</div>
      <div class="opt-tags">${p.tags}</div>
    </div>
    <span class="radio-dot"></span>`;
  card.addEventListener("click", () => {
    placeList.querySelectorAll(".opt-card").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
    state.place = p.title;
    placeNextBtn.disabled = false;
  });
  placeList.appendChild(card);
});
placeNextBtn.addEventListener("click", () => goTo("screen-food"));

/* ===================== SCREEN 4 · FOOD ===================== */
document.getElementById("choice-noodle").addEventListener("click", () => {
  state.foodType = "Noodles";
  buildNoodleSpots();
  goTo("screen-noodle-spot");
});
document.getElementById("choice-rice").addEventListener("click", () => {
  state.foodType = "Rice";
  buildRiceSpots();
  goTo("screen-rice-spot");
});

/* ===================== SCREEN 5a · NOODLE SPOT ===================== */
const noodleGrid = document.getElementById("noodle-spot-grid");
function buildNoodleSpots() {
  noodleGrid.innerHTML = "";

  // "Preferred Location" — reuses the place picked earlier in the flow
  const preferred = document.createElement("div");
  preferred.className = "spot-card";
  preferred.innerHTML = `
    <div class="spot-icon">🌶️</div>
    <div class="spot-name">Preferred Location</div>
    <div class="spot-desc">${state.place ? "At " + state.place : "Wherever you already picked"}</div>
    <div class="spot-select">Select Spot →</div>`;
  preferred.addEventListener("click", () => {
    state.spot = state.place ? `Preferred spot near ${state.place}` : "Preferred Location";
    goTo("screen-after");
  });
  noodleGrid.appendChild(preferred);

  CONFIG.noodleSpots.forEach(s => {
    const card = document.createElement("div");
    card.className = "spot-card";
    card.innerHTML = `
      <div class="spot-icon">${s.emoji}</div>
      <div class="spot-name">${s.name}</div>
      <div class="spot-desc">${s.desc}</div>
      <div class="spot-select">Select Spot →</div>`;
    card.addEventListener("click", () => {
      state.spot = s.name;
      goTo("screen-after");
    });
    noodleGrid.appendChild(card);
  });
}

/* ===================== SCREEN 5b · RICE SPOT ===================== */
const riceList = document.getElementById("rice-spot-list");
function buildRiceSpots() {
  riceList.innerHTML = "";

  // "Preferred Location" — reuses the place picked earlier in the flow
  const preferred = document.createElement("div");
  preferred.className = "chev-card";
  preferred.innerHTML = `<span>Preferred Location</span><span>›</span>`;
  preferred.addEventListener("click", () => {
    state.spot = state.place ? `Preferred spot near ${state.place}` : "Preferred Location";
    goTo("screen-after");
  });
  riceList.appendChild(preferred);

  CONFIG.riceSpots.forEach(s => {
    const card = document.createElement("div");
    card.className = "chev-card";
    card.innerHTML = `<span>${s.name}</span><span>›</span>`;
    card.addEventListener("click", () => {
      state.spot = s.name;
      goTo("screen-after");
    });
    riceList.appendChild(card);
  });
}
document.getElementById("rice-custom-btn").addEventListener("click", () => {
  const custom = prompt("Where would you like to eat?");
  if (custom && custom.trim()) {
    state.spot = custom.trim();
    goTo("screen-after");
  }
});

/* ===================== SCREEN 6 · AFTER EATING ===================== */
const afterList = document.getElementById("after-list");
const afterNextBtn = document.getElementById("after-next");
CONFIG.afterEating.forEach(a => {
  const card = document.createElement("div");
  card.className = "opt-icon-card";
  card.innerHTML = `
    <span class="opt-icon" style="background:${a.color}">${a.emoji}</span>
    <div class="opt-body"><b>${a.title}</b><span>${a.desc}</span></div>
    <span class="radio-dot"></span>`;
  card.addEventListener("click", () => {
    afterList.querySelectorAll(".opt-icon-card").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
    state.after = a.title;
    afterNextBtn.disabled = false;
  });
  afterList.appendChild(card);
});
afterNextBtn.addEventListener("click", () => {
  if (state.after.startsWith("Sitting")) {
    buildSitActivities();
    goTo("screen-sit");
  } else if (state.after.startsWith("Going on a motorcycle")) {
    buildRideActivities();
    goTo("screen-ride");
  } else {
    document.getElementById("walk-place-name").textContent = state.place || "the area";
    goTo("screen-walk");
  }
});

/* ===================== SCREEN 7a · SIT ===================== */
const sitList = document.getElementById("sit-list");
function buildSitActivities() {
  sitList.innerHTML = "";
  CONFIG.sitActivities.forEach(s => {
    const card = document.createElement("div");
    card.className = "opt-icon-card";
    card.innerHTML = `
      <span class="opt-icon" style="background:${s.color}">${s.emoji}</span>
      <div class="opt-body"><b>${s.title}</b>${s.note ? `<span>${s.note}</span>` : ""}</div>`;
    card.addEventListener("click", () => {
      state.activity = s.title;
      goTo("screen-thankyou");
    });
    sitList.appendChild(card);
  });
}

/* ===================== SCREEN 7b · RIDE ===================== */
const rideList = document.getElementById("ride-list");
function buildRideActivities() {
  rideList.innerHTML = "";
  CONFIG.rideActivities.forEach(r => {
    const card = document.createElement("div");
    card.className = "opt-icon-card";
    card.innerHTML = `
      <span class="opt-icon" style="background:${r.color}">${r.emoji}</span>
      <div class="opt-body"><b>${r.title}</b>${r.desc ? `<span>${r.desc}</span>` : ""}</div>`;
    card.addEventListener("click", () => {
      state.activity = r.title;
      goTo("screen-thankyou");
    });
    rideList.appendChild(card);
  });
}

/* ===================== SCREEN 7c · WALK (auto activity) ===================== */
document.querySelector('#screen-walk [data-next="screen-thankyou"]').addEventListener("click", () => {
  state.activity = "Walking around " + (state.place || "the area");
});

/* ===================== SCREEN 8 · THANK YOU → auto advance ===================== */
document.getElementById("screen-thankyou").addEventListener("click", () => goTo("screen-envelope"));
// also auto-advance after a short pause so it feels alive
let thankYouTimer = null;
const thankYouObserver = new MutationObserver(() => {
  if (document.getElementById("screen-thankyou").classList.contains("active")) {
    clearTimeout(thankYouTimer);
    thankYouTimer = setTimeout(() => goTo("screen-envelope"), 2200);
  }
});
thankYouObserver.observe(document.getElementById("screen-thankyou"), { attributes: true, attributeFilter: ["class"] });

/* ===================== SCREEN 9 · ENVELOPE ===================== */
const envelope = document.getElementById("envelope");
envelope.addEventListener("click", () => {
  envelope.classList.add("open");
  setTimeout(() => {
    fillLetter();
    goTo("screen-letter");
  }, 700);
});

/* ===================== SCREEN 9b · LETTER ===================== */
function fillLetter() {
  const card = document.querySelector(".letter-card");
  const L = CONFIG.letter;
  card.innerHTML = `
    <p class="letter-greet serif-heading italic">${L.greeting}</p>
    ${L.paragraphs.map(p => `<p class="letter-p">${p}</p>`).join("")}
    <p class="letter-p"><span class="highlight">${L.highlightLine}</span></p>
    ${L.closingParagraphs.map(p => `<p class="letter-p">${p}</p>`).join("")}
    <hr class="letter-rule">
    <p class="letter-question serif-heading">${L.question}<span class="heart-outline">♡</span></p>
    <hr class="letter-rule">
    <p class="letter-sign">${L.signature}</p>
    <button class="btn btn-olive" data-next="screen-receipt">See the details →</button>
  `;
  card.querySelector("[data-next]").addEventListener("click", () => {
    fillReceipt();
    goTo("screen-receipt");
  });
}

/* ===================== SCREEN 10 · RECEIPT ===================== */
function fillReceipt() {
  document.getElementById("r-date").textContent = CONFIG.dateLabel;
  document.getElementById("r-time").textContent = CONFIG.pickupTime;
  document.getElementById("r-time2").textContent = CONFIG.pickupTime;
  document.getElementById("r-place").textContent = state.place || "—";
  document.getElementById("r-foodcat").textContent = state.foodType || "—";
  document.getElementById("r-foodspot").textContent = state.spot || "—";
  document.getElementById("r-after").textContent = state.after || "—";
  document.getElementById("r-activity").textContent = state.activity || "—";
}

document.getElementById("print-btn").addEventListener("click", () => window.print());
document.getElementById("restart-btn").addEventListener("click", () => {
  Object.keys(state).forEach(k => (state[k] = null));
  document.querySelectorAll(".opt-card, .opt-icon-card, .chev-card, .spot-card, .choice-box")
    .forEach(el => el.classList.remove("selected"));
  placeNextBtn.disabled = true;
  afterNextBtn.disabled = true;
  envelope.classList.remove("open");
  goTo("screen-hello");
});

/* ===================== MUSIC ===================== */
const musicBtn = document.getElementById("music-toggle");
const audio = document.getElementById("bg-audio");
audio.volume = 0.8;

musicBtn.addEventListener("click", () => {
  if (audio.paused) {
    // force a fresh load attempt in case the file was added after the page first loaded
    audio.load();
    const playPromise = audio.play();
    if (playPromise && playPromise.catch) {
      playPromise
        .then(() => musicBtn.classList.add("playing"))
        .catch((err) => {
          console.error("Music playback failed:", err);
          alert(
            "Musik belum bisa diputar. Cek 3 hal ini:\n" +
            "1. File lagu ada di: assets/song.mp3 (nama harus persis, huruf kecil semua)\n" +
            "2. File-nya benar format MP3\n" +
            "3. Kalau baru menambahkan filenya, upload ulang semua folder ke hosting\n\n" +
            "Detail teknis: " + err.message
          );
        });
    } else {
      musicBtn.classList.add("playing");
    }
  } else {
    audio.pause();
    musicBtn.classList.remove("playing");
  }
});

audio.addEventListener("error", () => {
  console.error("Audio failed to load. Pastikan file assets/song.mp3 ada dan formatnya benar.");
});
