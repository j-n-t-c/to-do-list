var dom = {
    cacheDom: function () {
        //display areas
    this.projectDisplay = document.getElementById('project-display')
    this.taskDisplay = document.getElementById('task-display');
        //buttons
    this.submitButton = document.getElementById('submit');
    this.submitNewProject = document.getElementById('submit-new-button')
            //delete buttons array
    this.deleteTaskButtons = Array.from(document.querySelectorAll("button.delete-task-button"));
    this.deleteProjectButtons = Array.from(document.querySelectorAll("button.delete-project-button"));
        //user inputs
            //tasks
    this.title = document.getElementById('input-title');
    this.description = document.getElementById('input-description');
    this.dueDate = document.getElementById('input-duedate');
    this.priority = document.getElementById('input-priority');
    this.notes = document.getElementById('input-notes');
    this.project = document.getElementById('input-project');
            //project
    this.newProject = document.getElementById('input-new-project')
    },
    bindButtons: function () {
        this.deleteTaskButtons.forEach(button => {
            button.addEventListener('click', function() {
                tasks.matchTasks(dom.getParentId(button)); //why dom and not this???
            }, false)
        }),
        this.deleteProjectButtons.forEach(button => {
            button.addEventListener('click', function() {
                //console.log(dom.getParentId(button))
                projects.matchProjects(dom.getParentId(button))
            })
        })
    },
    getParentId: function (element) {
        //console.log('sup')
        return element.parentElement.id;
    },
    projectTemplate: function (project) {
        dom.projectDisplay.insertAdjacentHTML('beforeend', `<div class="project-wrapper">
        <div class="project-title" id="project-${project}" data-name=${project}>
        <button class="delete-project-button">x</button>
        <h3>${project}</h3>
        <div id="task-display-header">
                <div id="task-header-counter">#</div>
                <div id="task-header-title">task</div>
                <div id="task-header-description">description</div>
                <div id="task-header-duedate">due date</div>
                <div id="task-header-priority">priority</div>
                <div id="task-header-notes">notes</div>
        </div>
        </div>`)
    },
    taskTemplate: function (project, element) {
        var projectDiv = document.getElementById(`project-${project}`)
        projectDiv.insertAdjacentHTML('beforeend', `<div class="task-wrapper" id="${element.title + " " + project}">
        <button class="delete-task-button">x</button>
        <div class="task-counter">${element.counter}</div>
        <div class="task-title">${element.title}</div>
        <div class="task-description">${element.description}</div>
        <div class="task-duedate">${element.dueDate}</div>
        <div class="task-priority">${element.priority}</div>
        <div class="task-notes">${element.notes}</div>
    </div>`)
    },
    clearProject: function (id) {
        var x = document.getElementById(id);
        x.remove();
    },
    alertChildren: function (node) {
        node.querySelectorAll('div.project-title').forEach(child => {
          alert(child.id);
        })
    }
}

var projects = {
    init: function () {
        this.array = []; 
        this.bindEvents()
        this.createProjectsArray(); //fills this.array with all project names on dom

                //checking for storage
        if (localStorage.projects !== undefined) {
            this.array = storage.projectArray;
            console.log('project storage found')
        } else {
            this.pushProject("my tasks");
            console.log('NO project storage');
            storage.setProjectStorage();
            storage.setProjectArray();
        } 
    },
    createProjectsArray: function () { //NEED TO USE STORAGE 
        //create array of all current projects on page, pushes name string into array
        var dataProjects = Array.from(document.querySelectorAll('.project-title'));
        dataProjects.forEach(el => {
            this.array.push(el.getAttribute('data-name'))
        })
    },
    getProject: function() { //can probably move to dom object
        const project = dom.newProject.value;
        return project;
    },
    bindEvents: function () { //figure out best way to move this to DOM??? and same method in tasks object
        dom.submitNewProject.addEventListener('click', this.submitAndUpdate.bind(this), false);
    },
    submitAndUpdate: function () {
        var name = this.getProject();
        dom.projectTemplate(this.getProject());
        //this.createProjectsArray();
        this.pushProject(name);
        storage.setProjectStorage();
        storage.setProjectArray();
        dom.cacheDom();
        dom.bindButtons();
        //tasks.loadTasks();
    },
    loadProjects: function () {
        storage.projectArray.forEach(element => {
                dom.projectTemplate(element)
        })
    },
    pushProject: function (project) {
        this.array.push(project);
        },
    matchProjects: function (id) {
        
        storage.projectArray.forEach(item => {
            if (id == ("project-" + item)) {
                alert(`This will delete your project '${item}' and all associated tasks. Press ok to confirm.`)
                tasks.removeTasksInProject(item);
                storage.projectArray.splice(storage.projectArray.indexOf(item), 1);
                dom.clearProject(id)//need to make general dom method or specific
                this.array = storage.projectArray;
                storage.setProjectStorage();
                //this.loadProjects();
                //tasks.loadTasks(); //this shouldn't be here
                dom.cacheDom();
                dom.bindButtons();
             } else {
                 //alert('nope')
             }
        })
    }
}
var tasks = {
    init: function () {
        this.array = [];
        this.bindEvents();
        storage.init(); //should this be here or in global?

        //checking for storage
        if (localStorage.tasks !== undefined) {
            this.array = storage.taskArray;
            console.log('task storage found')
        } else {
            this.pushTask(this.createTask({title: 'create a new task', description: 'this is the first thing on your list!', project: "my tasks"}));
            console.log('NO task storage');
            storage.setTaskStorage();
            storage.setTaskArray();
        } 
    },
    getObject: function () { //getObject is argument for createTask //move to dom object??
        const taskObject = {
          title: dom.title.value,
          description: dom.description.value,
          dueDate: dom.dueDate.value,
          priority: dom.priority.value,
          notes: dom.notes.value,
          project: dom.project.value
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
        counter: this.array.length + 1,
      }
    },
    pushTask: function (task) {
    this.array.push(task);
    },
    submitAndUpdate: function () {
        if (localStorage.tasks == undefined) {                //******something fucky here here innit
            this.array = [];
        }
      this.pushTask(this.createTask(this.getObject()));
      this.clear(dom.projectDisplay)
      storage.setTaskStorage();
      storage.setTaskArray();
      this.loadTasks();
      dom.cacheDom()
      dom.bindButtons();
    },
    matchTasks: function (id) {
        storage.taskArray.forEach(item => {
            if (id == (item.title + " " + item.project)) {
                //alert('yes')
                storage.taskArray.splice(storage.taskArray.indexOf(item), 1);
                this.clear(dom.projectDisplay)
                this.array = storage.taskArray;
                storage.setTaskStorage();
                this.loadTasks();
                dom.cacheDom();
                dom.bindButtons();
            } else {
               //alert('nope')
            }
        })
    },
    bindEvents: function () {
      dom.submitButton.addEventListener('click', this.submitAndUpdate.bind(this), false);
    },
    clear: function (node) {
      node.querySelectorAll('div.task-wrapper').forEach(child => {
        child.remove();
      })
    },
    loadTasks: function () {
        storage.taskArray.forEach(element => {
                var project = element.project
                dom.taskTemplate(project, element)
        })
    },
    removeTasksInProject: function (item) {
        storage.taskArray.forEach(element => {
            if (element.project == item) {
                storage.taskArray.splice(storage.taskArray.indexOf(element), 1);
            }
            tasks.array = storage.taskArray;
            storage.setTaskStorage();
        })
    }
}

var storage = {
    init: function () {
        this.serializer();
        if (localStorage.tasks !== undefined) {
            this.setTaskArray();
            this.setProjectArray();
        } else {
            this.taskArray = [];
            this.projectArray =[];
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
    setTaskStorage: function () {
        localStorage.setObj('tasks', tasks.array)
    },
    setProjectStorage: function () {
        localStorage.setObj('projects', projects.array)
    },
    setTaskArray: function () {
        this.taskArray = localStorage.getObj('tasks');
    },
    setProjectArray: function () {
        this.projectArray = localStorage.getObj('projects');
    },
    clear: function () {
        window.localStorage.clear();
        this.taskArray = [];
        this.projectArray = [];
    }
}






                                        //****WORKING ON */

                                                                    //init
                                                                    dom.cacheDom();
                                                                    tasks.init();
                                                                    projects.init();
                                                                    projects.loadProjects()
                                                                    tasks.loadTasks();
                                                                    dom.cacheDom();
                                                                    dom.bindButtons();




////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//#region
                                    //*************SCRATCH CODE moved to make room */

//     filterTasks: function (project) { //makes new array of objects that have passed project name
//         return this.array.filter(obj => obj.project == project)
//     },
//     tasksToArrays: function () {
//         //creates array of task objects for each project name
//         projects.allProjects.forEach(project => {
//         var array = this.filterTasks(project)
//         return array;
//         //console.log(array)
//     })
//     }
//#endregion

//NOTES : 
//delete project works now, but now sometimes can't add new tasks under new project after deleting projects