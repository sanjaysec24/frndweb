// ===============================
// ✅ Import Firebase SDKs
// ===============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// ===============================
// 🔧 Firebase Config
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyD8cyhKoLJQELBQEtmOXHVYUpjDfyLq_bw",
  authDomain: "frnd-web.firebaseapp.com",
  projectId: "frnd-web",
  storageBucket: "frnd-web.appspot.com",
  messagingSenderId: "537712345817",
  appId: "1:537712345817:web:af7488b7575ac6ba5ef4c8",
  measurementId: "G-RKM7QNCSYG",
};

// ===============================
// 🚀 Initialize Firebase
// ===============================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ===============================
// 🎧 DOM Elements
// ===============================
const songTitle = document.getElementById("songTitle");
const songUrl = document.getElementById("songUrl");
const addSongBtn = document.getElementById("addSongBtn");
const playlistDiv = document.getElementById("playlist");
const userEmail = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");
const editNameBtn = document.getElementById("editNameBtn"); // add this button near logout

let currentUserEmail = null;
let currentDisplayName = null;

// ===============================
// 🧠 Get or Set Display Name
// ===============================
async function getOrSetDisplayName(user) {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    currentDisplayName = userSnap.data().displayName;
  } else {
    let newName = prompt("Enter your display name (this name appears in playlists):");
    if (!newName || newName.trim() === "") {
      newName = user.email.split("@")[0];
    }
    await setDoc(userRef, { displayName: newName.trim() });
    currentDisplayName = newName.trim();
  }

  if (userEmail) userEmail.textContent = `Welcome ${currentDisplayName} 🎧`;
  return currentDisplayName;
}

// ===============================
// 🔐 Auth State
// ===============================
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUserEmail = user.email;
    await getOrSetDisplayName(user);
    loadPlaylists();
  } else {
    alert("Please login first!");
    window.location.href = "login.html";
  }
});

// ===============================
// 🎶 Load All Friends’ Playlists
// ===============================
function loadPlaylists() {
  const q = query(collection(db, "playlists"), orderBy("addedAt", "desc"));
  onSnapshot(q, (snapshot) => {
    playlistDiv.innerHTML = "";

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const id = docSnap.id;

      const sectionId = `user-${data.displayName}`;
      let section = document.getElementById(sectionId);

      if (!section) {
        section = document.createElement("div");
        section.className = "user-playlist";
        section.id = sectionId;
        section.innerHTML = `
          <h3>${data.displayName}'s Playlist 🎧</h3>
          <div class="songs"></div>
        `;
        playlistDiv.appendChild(section);
      }

      // 🎵 Spotify-Style Song Card
      const songDiv = document.createElement("div");
      songDiv.className = "song-card";

      songDiv.innerHTML = `
        <div class="card-header">
          <div class="song-info">
            <p class="song-title">🎵 ${data.title}</p>
            <p class="song-owner">@${data.displayName}</p>
          </div>
          ${
            data.user === currentUserEmail
              ? `<button class="delete-btn" data-id="${id}">🗑️</button>`
              : ""
          }
        </div>
        <div class="player-wrapper">
          <iframe
            src="${data.songUrl}"
            frameborder="0"
            allow="autoplay; clipboard-write; encrypted-media;"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      `;

      section.querySelector(".songs").appendChild(songDiv);
    });

    // 🗑️ Delete buttons
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const songId = btn.dataset.id;
        if (confirm("🗑️ Are you sure you want to delete this song?")) {
          await deleteDoc(doc(db, "playlists", songId));
        }
      });
    });
  });
}

// ===============================
// ➕ Add Song
// ===============================
if (addSongBtn) {
  addSongBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return alert("Please login first.");

    let title = songTitle.value.trim();
    let url = songUrl.value.trim();

    if (!title || !url) return alert("Please fill in both fields.");

    // 🎧 Convert YouTube/Spotify links
    if (url.includes("youtube.com/watch?v=")) {
      const id = url.split("v=")[1].split("&")[0];
      url = `https://www.youtube.com/embed/${id}`;
    } else if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1].split("?")[0];
      url = `https://www.youtube.com/embed/${id}`;
    } else if (url.includes("open.spotify.com/track/")) {
      const id = url.split("track/")[1].split("?")[0];
      url = `https://open.spotify.com/embed/track/${id}`;
    }

    try {
      await addDoc(collection(db, "playlists"), {
        user: user.email,
        displayName: currentDisplayName || user.email.split("@")[0],
        title,
        songUrl: url,
        addedAt: Date.now(),
      });

      songTitle.value = "";
      songUrl.value = "";
      alert("✅ Song added successfully!");
    } catch (err) {
      alert("❌ Error adding song: " + err.message);
    }
  });
}

// ===============================
// ✏️ Change Display Name
// ===============================
if (editNameBtn) {
  editNameBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return alert("Please login first.");

    const newName = prompt("Enter your new display name:");
    if (!newName || newName.trim() === "") return;

    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { displayName: newName.trim() }, { merge: true });
    currentDisplayName = newName.trim();
    userEmail.textContent = `Welcome ${newName.trim()} 🎧`;
    alert("✅ Display name updated!");
  });
}

// ===============================
// 🚪 Logout
// ===============================
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        alert("👋 Logged out!");
        window.location.href = "login.html";
      })
      .catch((err) => alert("Error logging out: " + err.message));
  });
}
