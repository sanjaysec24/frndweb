// ===============================
// ✅ Import Firebase SDKs
// ===============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { 
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import {
  getFirestore, collection, addDoc, query, orderBy, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// ===============================
// 🔧 Firebase Configuration
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyD8cyhKoLJQELBQEtmOXHVYUpjDfyLq_bw",
  authDomain: "frnd-web.firebaseapp.com",
  projectId: "frnd-web",
  storageBucket: "frnd-web.appspot.com",
  messagingSenderId: "537712345817",
  appId: "1:537712345817:web:af7488b7575ac6ba5ef4c8",
  measurementId: "G-RKM7QNCSYG"
};

// ===============================
// 🚀 Initialize Firebase
// ===============================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ===============================
// 📝 SIGNUP
// ===============================
const signupBtn = document.getElementById("signupBtn");
if (signupBtn) {
  signupBtn.addEventListener("click", () => {
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("✅ Account created successfully!");
        window.location.href = "index.html"; // redirect to index after signup
      })
      .catch(err => alert(err.message));
  });
}

// ===============================
// 🔐 LOGIN
// ===============================
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("✅ Login successful!");
        window.location.href = "index.html"; // redirect to index after login
      })
      .catch(err => alert(err.message));
  });
}

// ===============================
// 🚪 LOGOUT
// ===============================
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
      alert("👋 Logged out!");
      window.location.href = "login.html";
    });
  });
}

// ===============================
// 💬 FIRESTORE — Real-Time Posts
// ===============================
const postBtn = document.getElementById("postBtn");
const postInput = document.getElementById("postInput");
const postsDiv = document.getElementById("posts");

// --- Real-time listener ---
function listenForPosts() {
  const q = query(collection(db, "posts"), orderBy("time", "desc"));
  onSnapshot(q, (snapshot) => {
    postsDiv.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      const div = document.createElement("div");
      div.className = "post";
      div.innerHTML = `<strong>${data.user}</strong>: ${data.text}`;
      postsDiv.appendChild(div);
    });
  });
}

// --- Add new post ---
if (postBtn) {
  postBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to post.");
      return;
    }

    const text = postInput.value.trim();
    if (text) {
      await addDoc(collection(db, "posts"), {
        user: user.email,
        text: text,
        time: Date.now()
      });
      postInput.value = "";
    }
  });
}

// ===============================
// 👤 AUTH STATE
// ===============================
onAuthStateChanged(auth, (user) => {
  const emailField = document.getElementById("userEmail");
  if (user && emailField) {
    emailField.textContent = user.email;
    if (postsDiv) listenForPosts(); // enable real-time updates
  }
});


// === USERNAME CHANGE FEATURE ===
const usernameEl = document.getElementById("username");
const editBtn = document.getElementById("edit-username");

// Load saved name (if exists)
const savedUsername = localStorage.getItem("username");
if (savedUsername) {
  usernameEl.textContent = savedUsername;
}

editBtn.addEventListener("click", () => {
  const newName = prompt("Enter your new username:");
  if (newName && newName.trim() !== "") {
    usernameEl.textContent = newName.trim();
    localStorage.setItem("username", newName.trim());
  }
});
