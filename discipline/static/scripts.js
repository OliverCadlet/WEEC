// Function to be called when the button is clicked
function handleButtonClick() {
    alert("Welcome to your Accountability App!");
    console.log("Button clicked!");
}

// Adding the event listener to the button
document.addEventListener("DOMContentLoaded", function() {
    const button = document.querySelector("button");
    if (button) {
        button.addEventListener("click", handleButtonClick);
    }

    // Make tasks draggable
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        task.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', task.id);
            task.classList.add('dragging');
        });

        task.addEventListener('dragend', () => {
            task.classList.remove('dragging');
        });
    });

    // Allow tasks to be dropped into columns
    const kanbanColumns = document.querySelectorAll('.kanban-column');
    kanbanColumns.forEach(column => {
        column.addEventListener('dragover', (event) => {
            event.preventDefault();
            const draggingTask = document.querySelector('.dragging');
            if (draggingTask) {
                column.appendChild(draggingTask);
            }
        });

        column.addEventListener('drop', (event) => {
            event.preventDefault();
            const draggingTask = document.querySelector('.dragging');
            if (draggingTask) {
                column.appendChild(draggingTask); // Append the task to the target column
                // Optionally, send the updated task's column status to the server
                updateTaskStatusToServer(draggingTask.id, column.id);
            }
        });
    });
});

// Toggle sidebar expanded/collapsed
function toggleSidebar() {
    var sidebar = document.querySelector('.sidebar');
    var container = document.querySelector('.container');
    var toggleButton = document.querySelector('.toggle-btn');

    // Toggle sidebar expanded state
    sidebar.classList.toggle('expanded');
    container.classList.toggle('sidebar-expanded');

    // Change arrow direction dynamically
    if (sidebar.classList.contains('expanded')) {
        toggleButton.textContent = '<';  // Arrow pointing left when expanded
    } else {
        toggleButton.textContent = '>';  // Arrow pointing right when collapsed
    }
}

// Open the Add Task Modal
function openAddTaskModal() {
    document.getElementById('add-task-modal').style.display = 'block';
}

// Close the Add Task Modal
function closeAddTaskModal() {
    document.getElementById('add-task-modal').style.display = 'none';
}

// Handle the form submission to add a new task
document.getElementById('add-task-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent page reload

    // Get the values from the form inputs
    var taskName = document.getElementById('task-name').value;
    var taskDueDate = document.getElementById('task-due-date').value;
    var taskDescription = document.getElementById('task-description').value;
    var taskResources = document.getElementById('task-resources').value;

    console.log('Adding Task:', taskName, taskDueDate, taskDescription, taskResources); // Debug log

    // Ensure the task list exists in the DOM
    var taskList = document.getElementById('task-list');
    if (!taskList) {
        console.error('Task list not found in the DOM!');
        return;
    }

    // Add the task to the task list dynamically
    var newTask = document.createElement('li');
    newTask.classList.add('task');
    newTask.setAttribute('draggable', 'true');
    newTask.id = 'task-' + taskName; // Unique ID for the task
    newTask.innerHTML = `
        <h3>${taskName}</h3>
        <p>Due: ${taskDueDate}</p>
        <p>${taskDescription}</p>
        <p>Resources: ${taskResources}</p>
    `;
    
    taskList.appendChild(newTask);

    // Debugging the task list after appending
    console.log('Updated Task List:', taskList.innerHTML);

    // Close the modal
    closeAddTaskModal();

    // Clear the form inputs
    document.getElementById('add-task-form').reset();

    // Optionally, send the data to the server (Django) to persist the task
    addTaskToServer(taskName, taskDueDate, taskDescription, taskResources);

    // Make the newly added task draggable
    newTask.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', newTask.id);
        newTask.classList.add('dragging');
    });

    newTask.addEventListener('dragend', () => {
        newTask.classList.remove('dragging');
    });
});

// Send task data to the Django server to be saved in the database
function addTaskToServer(taskName, taskDueDate, taskDescription, taskResources) {
    fetch('/add-task/', { // Adjust the URL based on your Django routing
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // Include CSRF token for security
        },
        body: JSON.stringify({
            name: taskName,
            due_date: taskDueDate,
            description: taskDescription,
            resources: taskResources
        })
    })
    .then(response => response.json())
    .then(data => {
        // Optionally, handle the server response if necessary
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Get CSRF token from cookies (for security)
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
