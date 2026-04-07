// STORAGE
const Storage = {
  get: key => {
    const data = localStorage.getItem(key);
    try { return JSON.parse(data); } catch { return data; }
  },
  set: (key, value) => localStorage.setItem(key, JSON.stringify(value))
};

// NOTIFICATIONS
if ("Notification" in window) Notification.requestPermission();

function notifyUser(msg) {
  if (Notification.permission === "granted") {
    new Notification("Studify", { body: msg });
  } else {
    alert(msg);
  }
}

// TIMER (ACCURATE)
let defaultTime = 1500;
let time = defaultTime;
let interval = null;
let endTime = null;

function startTimer() {
  if (interval) return;

  endTime = Date.now() + time * 1000;

  interval = setInterval(updateTimer, 500);
}

function updateTimer() {
  const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
  time = remaining;

  if (remaining <= 0) {
    pauseTimer();
    notifyUser("Focus session complete!");
  }

  updateDisplay();
}

function pauseTimer() {
  clearInterval(interval);
  interval = null;
}

function resetTimer() {
  pauseTimer();
  time = defaultTime;
  updateDisplay();
}

function updateDisplay() {
  const m = String(Math.floor(time / 60)).padStart(2, "0");
  const s = String(time % 60).padStart(2, "0");
  document.getElementById("timeDisplay").textContent = `${m}:${s}`;

  const progress = ((defaultTime - time) / defaultTime) * 100;
  document.querySelector(".circle").style.background =
    `conic-gradient(#6366f1 ${progress}%, #1e293b ${progress}%)`;
}

// VISIBILITY FIX
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && interval) updateTimer();
});

// TASKS
let tasks = Storage.get("tasks") || [];

document.getElementById("taskForm").addEventListener("submit", e => {
  e.preventDefault();

  const text = taskInput.value.trim();
  const sets = taskSets.value;

  if (!text || !sets) return;

  tasks.push({ text, sets, done: false });

  Storage.set("tasks", tasks);
  renderTasks();
  e.target.reset();
});

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  let completed = 0;

  tasks.forEach((task, i) => {
    const li = document.createElement("li");

    const left = document.createElement("div");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;

    checkbox.onchange = () => {
      task.done = checkbox.checked;

      if (task.done) {
        addXP(20);
        updateStreak();
      }

      Storage.set("tasks", tasks);
      renderTasks();
    };

    const span = document.createElement("span");
    span.textContent = `${task.text} (${task.sets})`;

    if (task.done) {
      span.style.textDecoration = "line-through";
      completed++;
    }

    left.appendChild(checkbox);
    left.appendChild(span);

    const del = document.createElement("button");
    del.textContent = "❌";
    del.onclick = () => {
      tasks.splice(i, 1);
      Storage.set("tasks", tasks);
      renderTasks();
    };

    li.appendChild(left);
    li.appendChild(del);
    list.appendChild(li);
  });

  document.getElementById("progressText").textContent =
    `${completed} / ${tasks.length} completed`;

  updateTracker(completed);
}

// TRACKER
let studyTime = Storage.get("studyTime") || 0;

function updateTracker(done = 0) {
  document.getElementById("studyTime").textContent = studyTime + " min";
  document.getElementById("tasksDone").textContent = done;
  Storage.set("studyTime", studyTime);
}

// TRACK TIME
setInterval(() => {
  if (interval) {
    studyTime++;
    updateTracker();
  }
}, 60000);

// STREAK + XP
let streak = Storage.get("streak") || 0;
let lastDate = Storage.get("lastDate") || null;
let xp = Storage.get("xp") || 0;

function updateStreak() {
  const today = new Date().toDateString();

  if (lastDate === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (lastDate === yesterday.toDateString()) {
    streak++;
  } else {
    streak = 1;
  }

  lastDate = today;

  Storage.set("streak", streak);
  Storage.set("lastDate", lastDate);

  document.getElementById("streakCount").textContent = streak + " days";
}

function addXP(amount) {
  xp += amount;

  Storage.set("xp", xp);
  document.getElementById("xpCount").textContent = xp;
}

// INIT
updateDisplay();
renderTasks();
updateTracker();

document.getElementById("streakCount").textContent = streak + " days";
document.getElementById("xpCount").textContent = xp;