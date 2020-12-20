var dom = {
    cacheDom: function () {
    //display areas
    this.projectDisplay = document.getElementById('project-display')
    this.taskDisplay = document.getElementById('task-display');
    //buttons
    this.submitButton = document.getElementById('submit');
    //user inputs
    this.title = document.getElementById('input-title');
    this.description = document.getElementById('input-description');
    this.dueDate = document.getElementById('input-duedate');
    this.priority = document.getElementById('input-priority');
    this.notes = document.getElementById('input-notes');
    this.project = document.getElementById('input-project');
    }
}

var tasks = {
    init: function () {
        this.taskArray = [];
        this.bindEvents();
        storage.init();

        //checking for storage
        if (localStorage.tasks !== undefined) {
            this.taskArray = storage.array;
            console.log('storage found, updated')
        } else {
            this.pushTask(this.createTask({title: 'create a new task', description: 'this is the first thing on your list!', project: "default"}));
            console.log('storage NOT found, set empty array');
            storage.array = this.taskArray;
        } 

    },
    getObject: function () { //getObject is argument for createTask
        const taskObject = {
          title: this.title.value,
          description: this.description.value,
          dueDate: this.dueDate.value,
          priority: this.priority.value,
          notes: this.notes.value,
          project: this.project.value
        }
        return taskObject
    },
    createTask: function ({title, description, dueDate, priority, notes, project}) {
       return {
        title,
        description,
        dueDate,
        priority,
        notes,
        project,
        counter: this.taskArray.length + 1,
      }
    },
    pushTask: function (task) {
    this.taskArray.push(task);
    },
    submitAndUpdate: function () {
        if (localStorage.tasks == undefined) {
            this.taskArray = [];
        }
      this.clear(this.taskDisplay);
      this.pushTask(this.createTask(this.getObject()));
      storage.setStorage();
      storage.setArray();
      this.render();
    },
    bindEvents: function () {
      dom.submitButton.addEventListener('click', this.submitAndUpdate.bind(this), false);
    },
    render: function () {
      storage.array.forEach(element => tasks.taskTemplate(element))
    },
    clear: function (node) {
      node.querySelectorAll('*').forEach(child => {
        child.remove();
      })
    },
    taskTemplate: function (element) {
        dom.taskDisplay.insertAdjacentHTML('beforeend', `<div class="task-wrapper">
        <div class="task-counter">${element.counter}</div>
        <div class="task-title">${element.title}</div>
        <div class="task-description">${element.description}</div>
        <div class="task-duedate">${element.dueDate}</div>
        <div class="task-priority">${element.priority}</div>
        <div class="task-notes">${element.notes}</div>
    </div>`)
    }
}

var storage = {
    init: function () {
        this.serializer();
        if (localStorage.tasks !== undefined) {
            this.setArray();
        } else {
            this.array = [];
        }
        },
    serializer: function () {
        Storage.prototype.setObj = function(key, obj) {
            return this.setItem(key, JSON.stringify(obj))
        }
        Storage.prototype.getObj = function(key) {
            return JSON.parse(this.getItem(key))
        }
    },
    setStorage: function () {
        localStorage.setObj('tasks', tasks.taskArray)
    },
    setArray: function () {
        this.array = localStorage.getObj('tasks');
    },
    clear: function () {
        window.localStorage.clear();
        this.array = [];
    }
}

dom.cacheDom();
tasks.init();
tasks.render();

//~~~~~~~~~~~~~~~~~WORK IN PROGRESS~~~~~~~~~~~~~~~~~will move to modules//

//create array of all current projects on page
var dataProjects = Array.from(document.querySelectorAll('.project-title'));
var allProjects = []
dataProjects.forEach(el => {
    allProjects.push(el.getAttribute('data-name'))
})


//makes new array of objects that have passed name
filterProjects = function (project) {
    return tasks.taskArray.filter(obj => obj.project == project)
}


//creates array of task objects for each project name
allProjects.forEach(project => {
    var array = filterProjects(project)
    console.log(array)
    })

projectTemplate = function () { //empty param for now, will use project
        tasks.projectDisplay.insertAdjacentHTML('afterend', `<div class="project-wrapper">
        <div class="project-title" id="project-testtest" data-name="testtest"><h3>test test</h3></div>
        <div id="task-display-header">
                <div id="task-header-counter">#</div>
                <div id="task-header-title">task</div>
                <div id="task-header-description">description</div>
                <div id="task-header-duedate">due date</div>
                <div id="task-header-priority">priority</div>
                <div id="task-header-notes">notes</div>
        </div>`)
    }