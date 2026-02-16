document.addEventListener("DOMContentLoaded", () => {

    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskList = document.getElementById("task-list");
    const emptyImage = document.querySelector(".empty-image");
    const todosContainer = document.querySelector(".todos-container");
    const progressBar = document.getElementById("progress");
    const progressNumbers = document.getElementById("numbers");

    const toggleEmptyState = () => {
        emptyImage.style.display =
            taskList.children.length === 0 ? "block" : "none";
    };

    const updateProgress = (checkCompletion = true) => {
        const totalTasks = taskList.children.length;
        const completedTasks =
            taskList.querySelectorAll(".checkbox:checked").length;

        const percentage = totalTasks
            ? (completedTasks / totalTasks) * 100
            : 0;

        progressBar.style.width = `${percentage}%`;
        progressNumbers.textContent =
            `${completedTasks} / ${totalTasks}`;

        if (checkCompletion && totalTasks > 0 &&
            completedTasks === totalTasks) {
            Confetti();
        }
    };

    const saveTasks = () => {
        const tasks = Array.from(taskList.querySelectorAll("li"))
            .map(li => ({
                text: li.querySelector("span").textContent,
                completed: li.querySelector(".checkbox").checked
            }));

        localStorage.setItem("tasks", JSON.stringify(tasks));
    };

    const loadTasks = () => {
        const savedTasks =
            JSON.parse(localStorage.getItem("tasks")) || [];

        savedTasks.forEach(task =>
            addTask(task.text, task.completed, false)
        );

        toggleEmptyState();
        updateProgress(false);
    };

    const addTask = (text = "", completed = false, checkCompletion = true) => {

        const taskText = text || taskInput.value.trim();
        if (!taskText) return;

        const li = document.createElement("li");

        li.innerHTML = `
            <input type="checkbox" class="checkbox"
                ${completed ? "checked" : ""}>
            <span>${taskText}</span>
            <div class="task-button">
                <button class="edit-btn">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="delete-btn">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        const checkbox = li.querySelector(".checkbox");
        const editBtn = li.querySelector(".edit-btn");

        if (completed) {
            li.classList.add("completed");
            editBtn.disabled = true;
        }

        checkbox.addEventListener("change", () => {
            li.classList.toggle("completed", checkbox.checked);
            editBtn.disabled = checkbox.checked;
            updateProgress();
            saveTasks();
        });

        editBtn.addEventListener("click", () => {
            if (!checkbox.checked) {
                taskInput.value =
                    li.querySelector("span").textContent;
                li.remove();
                toggleEmptyState();
                updateProgress(false);
                saveTasks();
            }
        });

        li.querySelector(".delete-btn")
            .addEventListener("click", () => {
                li.remove();
                toggleEmptyState();
                updateProgress();
                saveTasks();
            });

        taskList.appendChild(li);
        taskInput.value = "";

        toggleEmptyState();
        updateProgress(checkCompletion);
        saveTasks();
    };

    addTaskBtn.addEventListener("click", e => {
        e.preventDefault();
        addTask();
    });

    taskInput.addEventListener("keypress", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTask();
        }
    });

    loadTasks();
});

const Confetti = () => {
    confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
    });
};
