                                    //UTILITIES
//array to hold all tasks YES IN MOD
let taskArray = [];

//dom element to show all tasks YES IN MOD
const taskDisplay = document.getElementById('task-display');

// //creates elements on page w/ args object for type, id, class, etc YES IN MOD
// function createElement(args) {
//     const element = document.createElement(args.type)
//     setId(element, args.id);
//     setClass(element, args.cl);
//     setTextContent(element, args.textContent);
//     args.parent.appendChild(element);
// }
// function setId(element, id) {
//     if (id !== undefined) {
//         element.setAttribute('id', id)
//     }
// }
// function setClass(element, cl) {
//     if (cl !== undefined) {
//         element.setAttribute('class', cl)
//     }
// }
// function setTextContent(element, textContent) {
//     if (textContent !== undefined) {
//         element.textContent = textContent;
//     }
// }

//creates new task from input dom elements, spits out getinfo
const createTask = ({title, description, dueDate, priority, notes, checklist}) => ({
    title,
    description,
    dueDate,
    priority,
    notes,
    counter: taskArray.length + 1,
    checklist: []
  })

//separate method from object  YES IN MOD
function getTaskInfo (task) {
    const info = `${task.title} (${task.description}) is due on ${task.dueDate}`;
    return info;
}

//insert adjacent html for each task YES IN MOD
function taskTemplate(element) {
    taskDisplay.insertAdjacentHTML('beforeend', `<div class="task-wrapper">
    <div class="task-counter">${element.counter}</div>
    <div class="task-title">${element.title}</div>
    <div class="task-description">${element.description}</div>
    <div class="task-duedate">${element.dueDate}</div>
    <div class="task-priority">${element.priority}</div>
    <div class="task-notes">${element.notes}</div>
</div>`)
}


//functions to get info from dom YES IN MOD
function getTitle() {
    return document.getElementById('input-title').value;
}
function getDescription() {
    return document.getElementById('input-description').value;
}
function getDueDate() {
    return document.getElementById('input-duedate').value;
}
function getPriority() {
    return document.getElementById('input-priority').value;
}
function getNotes() {
    return document.getElementById('input-notes').value;
}
//gets all info from dom as one function YES IN MOD
function getObject() {
    const title = getTitle()
    const description = getDescription();
    const dueDate = getDueDate();
    const priority = getPriority();
    const notes = getNotes();
    const taskObject = {
        title,
        description,
        dueDate,
        priority,
        notes
    }
    return taskObject
}
//pushes tasks to array YES IN MOD
function pushTask(task) {
    taskArray.push(task);
}
//utility to refresh task list YES IN MOD as render
function showTasks() {
    storage.forEach(element => taskTemplate(element))
}

//YES IN MOD
function clear(node) {
    //selects node and all children then removes them
    node.querySelectorAll('*').forEach(child => {
        child.remove();
    })
}

//save to local storage
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

function updateStorage() {
    localStorage.setObj('tasks', taskArray)
    storage = localStorage.getObj('tasks');
}



                                    //INIT

//submit button dom and function and listener YES IN MOD
const submitTask = document.getElementById('submit');
function submitAndUpdate() {
    clear(taskDisplay);
    pushTask(createTask(getObject()));
    updateStorage();
    showTasks();
}
submitTask.addEventListener('click', submitAndUpdate, false);

//populate with example tasks
// const task1 = createTask({title: 'test 1', description: 'testing testing', dueDate: 'October 25th'})
// taskArray.push(task1);


console.log('current taskArray')
console.table(taskArray);



