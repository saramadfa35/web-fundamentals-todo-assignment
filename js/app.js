// File: js/app.js
// Student: sara madfa (12429718)

const STUDENT_ID = "12429718";
const API_KEY = "nYs43u5f1oGK9";
const API_BASE = "https://portal.almasar101.com/assignment/api";

// DOM elements
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const statusDiv = document.getElementById("status");
const list = document.getElementById("task-list");

// Update status message
function setStatus(message, isError = false) {
  if (!statusDiv) return;
  statusDiv.textContent = message || "";
  statusDiv.style.color = isError ? "#d9363e" : "#666";
}

// ------------------------
// 1) Load tasks on page load
// ------------------------
document.addEventListener("DOMContentLoaded", loadTasks);

function loadTasks() {
  setStatus("Loading tasks...");

  fetch(`${API_BASE}/get.php?stdid=${STUDENT_ID}&key=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      list.innerHTML = "";

      if (!data.tasks || data.tasks.length === 0) {
        setStatus("No tasks found.");
        return;
      }

      data.tasks.forEach(task => renderTask(task));

      setStatus("Tasks loaded successfully.");
    })
    .catch(err => {
      console.error(err);
      setStatus("Failed to load tasks.", true);
    });
}

// ------------------------
// 2) Add new task
// ------------------------
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = input.value.trim();
  if (title === "") return;

  setStatus("Adding task...");

  fetch(`${API_BASE}/add.php?stdid=${STUDENT_ID}&key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  })
    .then(res => res.json())
    .then(data => {
      if (!data.task) {
        setStatus("Error adding task.", true);
        return;
      }

      renderTask(data.task);
      input.value = "";
      setStatus("Task added successfully.");
    })
    .catch(err => {
      console.error(err);
      setStatus("Failed to add task.", true);
    });
});

// ------------------------
// 3) Render a task in the DOM
// ------------------------
function renderTask(task) {
  const li = document.createElement("li");
  li.className = "task-item";

  const title = document.createElement("span");
  title.className = "task-title";
  title.textContent = task.title;

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const delBtn = document.createElement("button");
  delBtn.className = "task-delete";
  delBtn.textContent = "Delete";

  // Delete handler
  delBtn.addEventListener("click", () => deleteTask(task.id, li));

  actions.appendChild(delBtn);

  li.appendChild(title);
  li.appendChild(actions);

  list.appendChild(li);
}

// ------------------------
// 4) Delete a task
// ------------------------
function deleteTask(id, itemElement) {
  setStatus("Deleting task...");

  fetch(`${API_BASE}/delete.php?stdid=${STUDENT_ID}&key=${API_KEY}&id=${id}`)
    .then(res => res.json())
    .then(() => {
      itemElement.remove();
      setStatus("Task deleted successfully.");
    })
    .catch(err => {
      console.error(err);
      setStatus("Failed to delete task.", true);
    });
}
