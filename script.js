
const $ = id => document.getElementById(id);

const welcomeScreen = $("welcomeScreen");
const welcomeForm = $("welcomeForm");
const userNameInput = $("userName");
const app = $("app");

const quotes = [
  "Small progress every day leads to extraordinary results.",
  "Discipline today builds the freedom you want tomorrow.",
  "You do not have to be perfect. You just have to begin.",
  "Dream big, start small, act now.",
  "Your future is created by what you practice today.",
  "Consistency turns small steps into big achievements.",
  "Believe in yourself. You are capable of more than you know.",
  "One focused hour can change your entire day.",
  "Progress, not perfection. Keep moving forward!",
  "Every expert was once a beginner. Keep practicing!"
];

const courses = [
  {
    name: "Python",
    icon: "🐍",
    description: "Learn Python syntax, loops, functions and problem solving.",
    url: "https://www.w3schools.com/python/"
  },
  {
    name: "Java",
    icon: "☕",
    description: "Practice Java fundamentals and object-oriented programming.",
    url: "https://www.w3schools.com/java/"
  },
  {
    name: "DSA",
    icon: "🧩",
    description: "Study arrays, strings, searching, sorting and data structures.",
    url: "https://www.geeksforgeeks.org/data-structures/"
  },
  {
    name: "SQL",
    icon: "🗄️",
    description: "Learn queries, filtering, joins and database concepts.",
    url: "https://www.w3schools.com/sql/"
  },
  {
    name: "Aptitude",
    icon: "🧠",
    description: "Practice percentages, ratios, averages and number systems.",
    url: "https://www.indiabix.com/aptitude/questions-and-answers/"
  },
  {
    name: "Reasoning",
    icon: "🔎",
    description: "Build logical reasoning, puzzles and analytical skills.",
    url: "https://www.indiabix.com/logical-reasoning/questions-and-answers/"
  },
  {
    name: "Coding Practice",
    icon: "💻",
    description: "Solve coding challenges and improve problem-solving skills.",
    url: "https://www.hackerrank.com/domains/algorithms"
  },
  {
    name: "Interview Preparation",
    icon: "🎯",
    description: "Prepare for technical interviews and computer science questions.",
    url: "https://www.geeksforgeeks.org/interview-prep/"
  }
];

let userName = localStorage.getItem("taskflowName") || "";
let tasks = loadTasks();
let currentView = "dashboard";

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem("taskflowTasks") || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem("taskflowTasks", JSON.stringify(tasks));
}

function randomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

function showWelcome() {
  app.hidden = true;
  welcomeScreen.hidden = false;
  $("welcomeQuote").textContent = "💜 " + randomQuote();
  userNameInput.value = userName;
}

function openDashboard(name) {
  const cleanedName = name.trim();
  if (!cleanedName) return;

  userName = cleanedName;
  localStorage.setItem("taskflowName", userName);

  welcomeScreen.hidden = true;
  app.hidden = false;

  $("displayName").textContent = userName;
  $("greeting").textContent = `Welcome, ${userName}! 👋`;

  $("todayDate").textContent = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  showNewDashboardQuote();
  renderCourses();
  renderAllTasks();
  showView("dashboard");
}

function showNewDashboardQuote() {
  const quote = randomQuote();
  $("dailyQuote").textContent = `“${quote}”`;
  $("motivationText").textContent = quote;
}

function showView(view) {
  const allowedViews = [
    "dashboard", "learning", "tasks", "schedule", "completed"
  ];

  if (!allowedViews.includes(view)) return;
  currentView = view;

  document.querySelectorAll(".page-view").forEach(section => {
    section.hidden = section.id !== `view-${view}`;
  });

  document.querySelectorAll("#sidebarNav [data-view]").forEach(button => {
    button.classList.toggle("active", button.dataset.view === view);
  });

  const titles = {
    dashboard: "Dashboard",
    learning: "Learning Hub",
    tasks: "My Tasks",
    schedule: "My Study Schedule",
    completed: "Completed Tasks"
  };

  $("pageTitle").textContent = titles[view];
  renderAllTasks();
}

function renderCourses() {
  function makeCourseCard(course) {
    const card = document.createElement("article");
    card.className = "course-card";

    const icon = document.createElement("div");
    icon.className = "course-icon";
    icon.textContent = course.icon;

    const title = document.createElement("h3");
    title.textContent = course.name;

    const description = document.createElement("p");
    description.textContent = course.description;

    const link = document.createElement("a");
    link.href = course.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Start Learning ↗";

    card.append(icon, title, description, link);
    return card;
  }

  $("learningCourses").replaceChildren(
    ...courses.map(makeCourseCard)
  );

  $("dashboardCourses").replaceChildren(
    ...courses.slice(0, 3).map(makeCourseCard)
  );
}

function updateStats() {
  $("totalCount").textContent = tasks.length;
  $("pendingCount").textContent =
    tasks.filter(task => !task.completed).length;
  $("completedCount").textContent =
    tasks.filter(task => task.completed).length;
}

function formatSchedule(task) {
  if (!task.date && !task.time) return "No schedule set";

  const dateText = task.date
    ? new Date(task.date + "T12:00:00").toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    : "Date not set";

  let timeText = "";
  if (task.time) {
    const [hours, minutes] = task.time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    timeText = date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit"
    });
  }

  return [dateText, timeText].filter(Boolean).join(" · ");
}

function makeTaskRow(task) {
  const row = document.createElement("article");
  row.className = "task-row";

  const info = document.createElement("div");
  info.className = "task-info";

  const details = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = task.title;
  if (task.completed) title.classList.add("done");

  const meta = document.createElement("div");
  meta.className = "task-meta";

  const category = document.createElement("span");
  category.className = "task-date";
  category.textContent = task.category || "General";

  const status = document.createElement("span");
  status.className = "status " + (task.completed ? "completed" : "pending");
  status.textContent = task.completed ? "Completed" : "Pending";

  const priority = document.createElement("span");
  priority.className = "priority " + (task.priority || "Medium").toLowerCase();
  priority.textContent = (task.priority || "Medium") + " priority";

  const schedule = document.createElement("span");
  schedule.className = "task-date";
  schedule.textContent = "🗓 " + formatSchedule(task);

  meta.append(category, status, priority, schedule);
  details.append(title, meta);
  info.append(details);

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const completeBtn = document.createElement("button");
  completeBtn.className = "action-btn complete-btn";
  completeBtn.textContent = task.completed ? "↶ Undo" : "✓ Complete";
  completeBtn.addEventListener("click", () => {
    task.completed = !task.completed;
    saveTasks();
    renderAllTasks();
  });

  const editBtn = document.createElement("button");
  editBtn.className = "action-btn edit-btn";
  editBtn.textContent = "✎ Edit";
  editBtn.addEventListener("click", () => editTask(task));

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "action-btn delete-btn";
  deleteBtn.textContent = "✕ Delete";
  deleteBtn.addEventListener("click", () => {
    if (confirm(`Delete "${task.title}"?`)) {
      tasks = tasks.filter(item => item.id !== task.id);
      saveTasks();
      renderAllTasks();
    }
  });

  actions.append(completeBtn, editBtn, deleteBtn);
  row.append(info, actions);
  return row;
}

function editTask(task) {
  const title = prompt("Enter the updated task name:", task.title);
  if (title === null || !title.trim()) return;

  const category = prompt(
    "Enter subject (Python, Java, DSA, SQL, Aptitude, General, etc.):",
    task.category || "General"
  );
  if (category === null || !category.trim()) return;

  const date = prompt("Enter date as YYYY-MM-DD, or leave blank:", task.date || "");
  if (date === null) return;

  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    alert("Please use the date format YYYY-MM-DD.");
    return;
  }

  const time = prompt("Enter time as HH:MM (24-hour), or leave blank:", task.time || "");
  if (time === null) return;

  if (time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    alert("Please use the time format HH:MM, such as 18:30.");
    return;
  }

  task.title = title.trim();
  task.category = category.trim();
  task.date = date;
  task.time = time;

  saveTasks();
  renderAllTasks();
}

function renderTaskCollection(containerId, list, emptyId, emptyText) {
  const container = $(containerId);
  container.replaceChildren();

  if (list.length === 0) {
    if (emptyId) {
      $(emptyId).textContent = emptyText;
      $(emptyId).hidden = false;
    } else {
      const empty = document.createElement("p");
      empty.className = "empty-message";
      empty.textContent = emptyText;
      container.append(empty);
    }
    return;
  }

  if (emptyId) $(emptyId).hidden = true;
  list.forEach(task => container.append(makeTaskRow(task)));
}

function renderAllTasks() {
  updateStats();

  const search = $("searchInput").value.trim().toLowerCase();
  const category = $("categoryFilter").value;
  const status = $("filterInput").value;

  const filtered = tasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(search) ||
      (task.category || "General").toLowerCase().includes(search);

    const matchesCategory =
      category === "all" || (task.category || "General") === category;

    const matchesStatus =
      status === "all" ||
      (status === "pending" && !task.completed) ||
      (status === "completed" && task.completed);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  renderTaskCollection(
    "taskList", filtered, "emptyMessage",
    "No matching tasks. Try another search or add a new task."
  );

  const upcoming = tasks
    .filter(task => !task.completed)
    .slice()
    .sort((a, b) => {
      const aKey = (a.date || "9999-12-31") + (a.time || "23:59");
      const bKey = (b.date || "9999-12-31") + (b.time || "23:59");
      return aKey.localeCompare(bKey);
    })
    .slice(0, 4);

  renderTaskCollection(
    "dashboardTasks", upcoming, null,
    "🌷 No pending tasks yet. Add a goal and start your journey!"
  );

  const scheduled = tasks
    .filter(task => task.date || task.time)
    .slice()
    .sort((a, b) => {
      const aKey = (a.date || "9999-12-31") + (a.time || "23:59");
      const bKey = (b.date || "9999-12-31") + (b.time || "23:59");
      return aKey.localeCompare(bKey);
    });

  renderTaskCollection(
    "scheduleList", scheduled, "scheduleEmpty",
    "No scheduled sessions yet. Add a task with a date or time."
  );

  const completed = tasks.filter(task => task.completed);
  renderTaskCollection(
    "completedList", completed, "completedEmpty",
    "Your completed tasks will appear here. Keep going!"
  );
}

function addTaskFromForm(formNumber) {
  const suffix = formNumber === 1 ? "" : "2";

  const title = $(`taskInput${suffix}`).value.trim();
  const category = $(`categoryInput${suffix}`).value;
  const priority = $(`priorityInput${suffix}`).value;
  const date = $(`taskDate${suffix}`).value;
  const time = $(`taskTime${suffix}`).value;

  if (!title) return;

  tasks.unshift({
    id: Date.now() + Math.random(),
    title,
    category,
    priority,
    date,
    time,
    completed: false
  });

  saveTasks();

  $(`taskInput${suffix}`).value = "";
  $(`taskDate${suffix}`).value = "";
  $(`taskTime${suffix}`).value = "";

  $("searchInput").value = "";
  $("categoryFilter").value = "all";
  $("filterInput").value = "all";

  renderAllTasks();

  if (currentView !== "dashboard" && currentView !== "tasks") {
    showView("tasks");
  }
}

welcomeForm.addEventListener("submit", event => {
  event.preventDefault();
  openDashboard(userNameInput.value);
});

$("taskForm").addEventListener("submit", event => {
  event.preventDefault();
  addTaskFromForm(1);
});

$("taskForm2").addEventListener("submit", event => {
  event.preventDefault();
  addTaskFromForm(2);
});

$("sidebarNav").addEventListener("click", event => {
  const button = event.target.closest("[data-view]");
  if (button) showView(button.dataset.view);
});

document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => showView(button.dataset.go));
});

$("searchInput").addEventListener("input", renderAllTasks);
$("categoryFilter").addEventListener("change", renderAllTasks);
$("filterInput").addEventListener("change", renderAllTasks);

$("newQuoteBtn").addEventListener("click", showNewDashboardQuote);

$("changeUser").addEventListener("click", showWelcome);

if (userName) {
  openDashboard(userName);
} else {
  showWelcome();
}
