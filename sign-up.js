// ===============================
// 📦 STORAGE
// ===============================
const Storage = {
  get(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// ===============================
// 🚀 SIGNUP HANDLER
// ===============================
document.querySelector(".signup-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = this.querySelector('input[type="text"]').value.trim();
  const email = this.querySelector('input[type="email"]').value.trim();
  const password = this.querySelector('input[type="password"]').value.trim();
  const source = this.querySelector("select").value;

  if (!name || !email || !password || !source) {
    alert("Please fill all fields");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  let users = Storage.get("users");

  // ❗ Check if user already exists
  const exists = users.find(user => user.email === email);

  if (exists) {
    alert("User already exists. Please login.");
    return;
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    source
  };

  users.push(newUser);
  Storage.set("users", users);

  // Save current session
  localStorage.setItem("currentUser", JSON.stringify(newUser));

  alert("Account created successfully 🎉");

  // 👉 Redirect to dashboard
  window.location.href = "dashboard.html";
});