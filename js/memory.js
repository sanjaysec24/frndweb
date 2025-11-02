// ====== Memory Data ======
const memories = {
  sept2024: [
    { img: "images/sept1.jpg", text: "First day together — laughter overload!" },
    { img: "images/sept2.jpg", text: "Our first café hangout 💕" },
    { img: "images/sept3.jpg", text: "Fun group selfie at the park 🌳" },
    { img: "images/sept4.jpg", text: "Evening snacks & jokes 😋" },
    { img: "images/sept5.jpg", text: "Late-night talk session 💬" }
  ],

  oct2024: [
    { img: "images/oct1.jpg", text: "Spooky party night 🎃" },
    { img: "images/oct2.jpg", text: "Random evening walks & stories" },
    { img: "images/oct3.jpg", text: "Classroom chaos 😆" },
    { img: "images/oct4.jpg", text: "Rainy day fun 🌧️" },
    { img: "images/oct5.jpg", text: "Movie marathon 🍿" }
  ],

  nov2024: [
    { img: "images/nov1.jpg", text: "Beach trip memories 🏖️" },
    { img: "images/nov2.jpg", text: "Crazy photo sessions!" },
    { img: "images/nov3.jpg", text: "Lunch gang moment 🍱" },
    { img: "images/nov4.jpg", text: "Sunset vibes 🌅" },
    { img: "images/nov5.jpg", text: "Random laughter & smiles 😄" }
  ],

  dec2024: [
    { img: "images/dec1.jpg", text: "Christmas fun 🎄" },
    { img: "images/dec2.jpg", text: "New Year countdown 🎆" },
    { img: "images/dec3.jpg", text: "Winter café hangout ☕" },
    { img: "images/dec4.jpg", text: "Secret Santa gifts 🎁" },
    { img: "images/dec5.jpg", text: "Last sunset of 2024 🌇" }
  ],

  jan2025: [
    { img: "images/jan1.jpg", text: "First hangout of 2025 🚀" },
    { img: "images/jan2.jpg", text: "New year vibes ✨" },
    { img: "images/jan3.jpg", text: "Morning ride 🌄" },
    { img: "images/jan4.jpg", text: "Lunch memories 🥗" },
    { img: "images/jan5.jpg", text: "Random goofy selfies 🤪" }
  ],

  feb2025: [
    { img: "images/dec2025-1.jpg", text: "End of an unforgettable era ✨" },
    { img: "images/dec2025-2.jpg", text: "Farewell gathering 🎓" },
    { img: "images/dec2025-3.jpg", text: "Flashback photo wall 🖼️" },
    { img: "images/dec2025-4.jpg", text: "The last group picture 💖" },
    { img: "images/dec2025-5.jpg", text: "Forever memories 💫" }
  ]


};

// ====== Variables ======
let currentImages = [];
let currentIndex = 0;

// ====== Open Popup ======
function openMemory(monthKey) {
  const modal = document.getElementById("memoryModal");
  const photosDiv = document.getElementById("memoryPhotos");
  photosDiv.innerHTML = "";

  currentImages = memories[monthKey] || [];
  currentIndex = 0;

  currentImages.forEach((mem, i) => {
    const div = document.createElement("div");
    div.className = "photo-card";
    div.innerHTML = `
      <img src="${mem.img}" alt="Memory photo ${i + 1}" onclick="openFullscreen(${i})">
      <p>${mem.text}</p>
    `;
    photosDiv.appendChild(div);
  });

  modal.style.display = "flex";
}

// ====== Close Popup ======
function closeMemory() {
  document.getElementById("memoryModal").style.display = "none";
  closeFullscreen();
}

// ====== Fullscreen View ======
function openFullscreen(index) {
  const fullscreen = document.getElementById("fullscreenView");
  const img = document.getElementById("fullscreenImg");

  currentIndex = index;
  img.src = currentImages[currentIndex].img;
  fullscreen.style.display = "flex";
}

function closeFullscreen() {
  document.getElementById("fullscreenView").style.display = "none";
}

// ====== Navigate Fullscreen with Arrows ======
function nextImage() {
  if (currentImages.length > 0) {
    currentIndex = (currentIndex + 1) % currentImages.length;
    document.getElementById("fullscreenImg").src = currentImages[currentIndex].img;
  }
}

function prevImage() {
  if (currentImages.length > 0) {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    document.getElementById("fullscreenImg").src = currentImages[currentIndex].img;
  }
}

// ====== Keyboard Controls ======
document.addEventListener("keydown", (e) => {
  const fullscreen = document.getElementById("fullscreenView");
  const modal = document.getElementById("memoryModal");

  if (e.key === "Escape") {
    if (fullscreen.style.display === "flex") closeFullscreen();
    else if (modal.style.display === "flex") closeMemory();
  }
  if (fullscreen.style.display === "flex") {
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
  }
});
