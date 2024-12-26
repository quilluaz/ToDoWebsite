// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("addBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Add new variables for modal management
const modalTitle = document.getElementById("modalTitle");
let currentEditingTask = null;
let taskIdCounter = Date.now(); // Using timestamp for unique IDs

// Function to open modal
function openModal(isEditing = false, taskElement = null) {
  modalTitle.textContent = isEditing ? "Edit Task" : "Add Task";
  if (isEditing && taskElement) {
    const taskText = taskElement.querySelector(".task-text").textContent;
    taskInput.value = taskText;
    currentEditingTask = taskElement;
  } else {
    taskInput.value = "";
    currentEditingTask = null;
  }
  modal.classList.add("show");
  taskInput.focus();
}

// Update the add button click handler
btn.onclick = function () {
  openModal(false);
};

// Get save button and input field
const saveButton = document.querySelector(".modal-button--primary");
const taskInput = document.getElementById("task-input");
const activeTasksContainer = document.querySelector(
  "#activeTasks .tasks-container"
);
const completedTasksContainer = document.querySelector(
  "#completedTasks .tasks-container"
);

// Function to create a new task
function createTask(taskText, isCompleted = false) {
  const taskId = `task-${taskIdCounter++}`;
  const taskElement = document.createElement("div");
  taskElement.className = "task-item";
  taskElement.innerHTML = `
    <div class="task-content">
      <div class="task-checkbox">
        <input type="checkbox" id="${taskId}" ${isCompleted ? "checked" : ""}>
        <label for="${taskId}">
          <i class="material-icons">done</i>
        </label>
      </div>
      <span class="task-text ${
        isCompleted ? "completed" : ""
      }">${taskText}</span>
    </div>
    <div class="task-actions">
      <button class="edit-task">
        <i class="material-icons">edit</i>
      </button>
      <button class="delete-task">
        <i class="material-icons">delete</i>
      </button>
    </div>
  `;

  // Add delete functionality
  const deleteBtn = taskElement.querySelector(".delete-task");
  deleteBtn.onclick = () => taskElement.remove();

  // Add checkbox functionality
  const checkbox = taskElement.querySelector(`input[id="${taskId}"]`);
  const textElement = taskElement.querySelector(".task-text");

  checkbox.addEventListener("change", function () {
    const isCompleted = this.checked;
    textElement.classList.toggle("completed", isCompleted);

    // Move task to appropriate container
    const targetContainer = isCompleted
      ? completedTasksContainer
      : activeTasksContainer;
    targetContainer.appendChild(taskElement);
  });

  // Update edit functionality
  const editBtn = taskElement.querySelector(".edit-task");
  editBtn.onclick = () => {
    openModal(true, taskElement);
  };

  return taskElement;
}

// Update save button click handler
saveButton.onclick = function () {
  const taskText = taskInput.value.trim();
  if (taskText) {
    if (currentEditingTask) {
      // Update existing task
      const textElement = currentEditingTask.querySelector(".task-text");
      textElement.textContent = taskText;
    } else {
      // Create new task
      const taskElement = createTask(taskText);
      activeTasksContainer.appendChild(taskElement);
    }
    modal.classList.remove("show");
    taskInput.value = "";
    currentEditingTask = null;
  }
};

// Clear example task if it exists
document.addEventListener("DOMContentLoaded", function () {
  const exampleTask = document.querySelector(".task-item");
  if (exampleTask) {
    exampleTask.remove();
  }
});

// Update modal close handlers to reset currentEditingTask
span.onclick = function () {
  modal.classList.remove("show");
  currentEditingTask = null;
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.classList.remove("show");
    currentEditingTask = null;
  }
};

// Update Enter key handler
taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    saveButton.click();
  }
});
