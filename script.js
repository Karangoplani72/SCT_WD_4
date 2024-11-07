// Select elements from the DOM
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const cancelButton = document.getElementById("cancel-edit");

let tasks = [];
let editingTaskId = null;  // To track which task is being edited

// Event listener for form submission
taskForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent form from refreshing the page

  const title = document.getElementById("task-title").value.trim();
  const desc = document.getElementById("task-desc").value.trim();
  const date = document.getElementById("task-date").value;

  if (!title || !date) {
    alert("Please enter both a title and date for the task.");
    return;
  }

  if (editingTaskId) {
    // Update the task if editing
    const task = tasks.find((task) => task.id === editingTaskId);
    task.title = title;
    task.desc = desc;
    task.date = date;
  } else {
    // Create a new task if not editing
    const task = {
      id: Date.now(),
      title,
      desc,
      date,
      completed: false,
    };
    tasks.push(task);
  }

  // Render tasks and reset the form
  renderTasks();
  taskForm.reset();
  cancelButton.style.display = "none";  // Hide Cancel button after submission
  editingTaskId = null;  // Reset editing task ID
});

// Function to render tasks in the DOM
function renderTasks() {
  taskList.innerHTML = "";
  tasks.sort((a, b) => new Date(a.date) - new Date(b.date));

  tasks.forEach((task) => {
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";
    if (task.completed) taskItem.classList.add("completed");

    taskItem.innerHTML = `
      <div class="task-details">
        <h3>${task.title}</h3>
        <p>${task.desc || "No description"}</p>
        <small>Due: ${new Date(task.date).toLocaleString()}</small>
      </div>
      <div class="actions">
        <button class="edit" onclick="editTask(${task.id})">Edit</button>
        <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
        <div class="checkbox-container">
          <input type="checkbox" id="task-completed-${task.id}" ${task.completed ? "checked" : ""} onclick="toggleComplete(${task.id})">
          <label for="task-completed-${task.id}">Task Completed</label>
        </div>
      </div>
    `;
    taskList.appendChild(taskItem);
  });
}

// Toggle task completion
function toggleComplete(id) {
  const task = tasks.find((task) => task.id === id);
  if (task) {
    task.completed = !task.completed;
    renderTasks();
  }
}

// Delete a task
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  renderTasks();
}

// Edit a task
function editTask(id) {
  const task = tasks.find((task) => task.id === id);
  if (task) {
    document.getElementById("task-title").value = task.title;
    document.getElementById("task-desc").value = task.desc;
    document.getElementById("task-date").value = task.date;
    editingTaskId = task.id;  // Set the editing task ID
    cancelButton.style.display = "inline-block";  // Show Cancel button
  }
}

// Cancel editing and reset form
cancelButton.addEventListener("click", () => {
  editingTaskId = null;  // Clear the editing task ID
  taskForm.reset();  // Reset the form fields
  cancelButton.style.display = "none";  // Hide the Cancel button
});
