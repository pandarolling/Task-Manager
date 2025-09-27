const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Load tasks or start empty
let indexToBeDeleted = -1; // Tracks which task to delete
const taskManagerContainer = document.querySelector('.taskManager');
const confirmElement = document.querySelector('.confirm');
const confirmBtn = document.querySelector('.confirmed');
const cancelBtn = document.querySelector('.cancel');


document.getElementById('taskForm').addEventListener('submit', handleFormSubmit);

renderTasks();

// Handle form submit
function handleFormSubmit(event) {
     event.preventDefault();
     const taskInput = document.getElementById('taskInput');
     const taskValue = taskInput.value.trim();
     
     if(taskValue !== ''){
        const newTask = { text: taskValue, completed: false };
        tasks.push(newTask);
        saveTasks();
        taskInput.value = '';
        renderTasks();
     }
}

// Save tasks to localStorage
function saveTasks(){
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render all tasks
function renderTasks(){
    const taskContainer = document.getElementById('taskContainer');
    taskContainer.innerHTML = ''; 

    tasks.forEach((task, index)=> {
        const taskCard = document.createElement('div');
        taskCard.classList.add('taskCard');

        // Status
        let classVal = task.completed ? 'completed' : 'pending';
        let statusVal = task.completed ? 'Completed' : 'Pending';
        taskCard.classList.add(classVal);

        const taskText = document.createElement('p');
        taskText.innerText = task.text;

        const taskStatus= document.createElement('p');
        taskStatus.innerText = statusVal;
        taskStatus.classList.add('status');

        // Toggle button
        const toggleButton = document.createElement('button');
        toggleButton.classList.add('button-box');
        const btnText = document.createElement('span');
        btnText.innerText = task.completed ? 'Mark as Pending' : 'Mark as Completed';
        btnText.classList.add(task.completed ? 'red' : 'green');
        toggleButton.appendChild(btnText);
        toggleButton.addEventListener('click', ()=> {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        });


        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('button-box');
        const delText = document.createElement('span');
        delText.innerText = 'Delete Task';
        delText.classList.add('red');
        deleteButton.appendChild(delText);
        deleteButton.addEventListener('click', () => {
            indexToBeDeleted = index;
            confirmElement.style.display = 'block';
            taskManagerContainer.classList.add('overlay');

             // Scroll dialog into view
            confirmElement.scrollIntoView({ behavior: "smooth", block: "center" });

            // Focus confirm button when dialog opens
            confirmBtn.focus();
        });

        // Append all
        taskCard.appendChild(taskText);
        taskCard.appendChild(taskStatus);
        taskCard.appendChild(toggleButton);
        taskCard.appendChild(deleteButton);
        taskContainer.appendChild(taskCard);
    });
    updateProgressBar();

}

function updateProgressBar() {
           const total = tasks.length;
           const completed = tasks.filter(task => task.completed).length;
           const completionRate = total === 0 ? 0 : (completed / total) * 100;
         
           // Update bar width
           const progressBar = document.getElementById('progress-bar');
           progressBar.style.setProperty('--progress', `${completionRate}%`);
           progressBar.style.position = "relative";

           // Directly adjust width of inner div
           progressBar.querySelector('div')?.remove(); // remove previous filler
           const filler = document.createElement('div');
           filler.style.height = "100%";
           filler.style.width = `${completionRate}%`;
           filler.style.background = "linear-gradient(90deg, #4caf50, #8bc34a)";
           filler.style.transition = "width 0.4s ease";
           progressBar.appendChild(filler);

           // Update text
           document.getElementById('progressText').innerText = `${Math.round(completionRate)}% completed`;
         }

// Confirm delete
confirmBtn.addEventListener('click', ()=> {
    confirmElement.style.display = 'none';
    taskManagerContainer.classList.remove('overlay');
    deleteTask(indexToBeDeleted);
});

// Cancel delete
cancelBtn.addEventListener('click', ()=> {
    confirmElement.style.display = 'none';
    taskManagerContainer.classList.remove('overlay');
});

// Delete task
function deleteTask(index){
    tasks.splice(index,1);
    saveTasks();
    renderTasks();
}
