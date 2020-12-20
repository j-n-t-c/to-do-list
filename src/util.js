
//array to hold all tasks
export let taskArray = []

//dom element to show all tasks
export const taskDisplay = document.getElementById('task-display');

//creates elements on page w/ args object for type, id, class, etc
export function createElement(args) {
    const element = document.createElement(args.type)
    setId(element, args.id);
    setClass(element, args.cl);
    setTextContent(element, args.textContent);
    args.parent.appendChild(element);
}
function setId(element, id) {
    if (id !== undefined) {
        element.setAttribute('id', id)
    }
}
function setClass(element, cl) {
    if (cl !== undefined) {
        element.setAttribute('class', cl)
    }
}
function setTextContent(element, textContent) {
    if (textContent !== undefined) {
        element.textContent = textContent;
    }
}

//creates new task from input dom elements, spits out getinfo
export const createTask = ({title, description, dueDate, priority, notes, checklist}) => ({
    title,
    description,
    dueDate,
    priority,
    notes,
    checklist: []
  })

//separate method from object 
export function getTaskInfo (task) {
    const info = `${task.title} (${task.description}) is due on ${task.dueDate}`;
    return info;
}
//functions to get info from dom
function getTitle() {
    return document.getElementById('input-title').value;
}
function getDescription() {
    return document.getElementById('input-description').value;
}
function getDueDate() {
    return document.getElementById('input-duedate').value;
}
//gets all info from dom as one function
export function getObject() {
    const title = getTitle()
    const description = getDescription();
    const dueDate = getDueDate();
    const taskObject = {
        title,
        description,
        dueDate
    }
    return taskObject
}
//pushes tasks to array
export function pushTask(task) {
    taskArray.push(task);
}
//get tasks from local storage
function getStorageArray() {

}
//utility to refresh task list
export function showTasks() {
    storage.forEach(element => createElement({
        type: 'div',
        cl: 'task',
        parent: taskDisplay,
        textContent: getTaskInfo(element)
    }))
}

// function publishTasks() {
//     const taskDisplay = document.getElementById('task-display');
//     taskArray.forEach(element => taskDisplay.textContent = element.getInfo());
// }

export function clear(node) {
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

export function updateStorage() {
    localStorage.setObj('tasks', taskArray)
}

export const storage = localStorage.getObj('tasks');


