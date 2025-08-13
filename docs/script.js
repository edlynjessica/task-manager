const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

// Render task in UI
function addTaskToUI(task) {
    const li = document.createElement("li");
    li.className = "task-item";
    li.dataset.id = task.id;

    li.innerHTML = `
        <label>
            <input type="checkbox" ${task.completed ? "checked" : ""}>
            <span>${task.name}</span>
        </label>
        <button>Delete</button>
    `;

    const checkbox = li.querySelector("input[type='checkbox']");
    const span = li.querySelector("span");

    // Toggle completed + backend update
    checkbox.addEventListener("change", () => {
        span.classList.toggle("completed");
        fetch(`http://localhost:5000/tasks/${task.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: checkbox.checked })
        });
    });

    // Delete task
    li.querySelector("button").addEventListener("click", () => {
        fetch(`http://localhost:5000/tasks/${task.id}`, { method: "DELETE" })
            .then(() => taskList.removeChild(li))
            .catch(err => console.error(err));
    });

    // Initial completed state
    if (task.completed) span.classList.add("completed");

    taskList.appendChild(li);
}

// Fetch all tasks
function loadTasks() {
    fetch("http://localhost:5000/tasks")
        .then(res => res.json())
        .then(data => data.forEach(task => addTaskToUI(task)))
        .catch(err => console.error(err));
}

// Add new task
addBtn.addEventListener("click", () => {
    const taskName = taskInput.value.trim();
    if(!taskName) return;

    fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: taskName })
    })
    .then(res => res.json())
    .then(task => {
        addTaskToUI(task);
        taskInput.value = "";
    })
    .catch(err => console.error(err));
});

taskInput.addEventListener("keypress", (e) => {
    if(e.key === "Enter") addBtn.click();
});

// Initial load
loadTasks();
