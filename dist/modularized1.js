var dom = {

    cacheDom: function () {

        //display areas
    this.projectDisplay = document.getElementById('project-display')
    this.taskDisplay = document.getElementById('task-display');

        //buttons
    this.submitButton = document.getElementById('submit');
    this.submitNewProject = document.getElementById('submit-new-button')

            //delete buttons arrays
    this.deleteTaskButtons = Array.from(document.querySelectorAll("button.delete-task-button"));
    this.deleteProjectButtons = Array.from(document.querySelectorAll("button.delete-project-button"));

            //checkboxes
    this.completedBoxes = Array.from(document.querySelectorAll("input.taskcheck"));

        //user inputs
            //tasks
    this.projectSelect = document.getElementById('input-project');
    this.title = document.getElementById('input-title');
    this.description = document.getElementById('input-description');
    this.dueDate = document.getElementById('input-duedate');
    this.priority = document.getElementById('input-priority');
    this.notes = document.getElementById('input-notes');
            //project
    this.newProject = document.getElementById('input-new-project');
    },

    addListeners: function () {

    this.submitNewProject.addEventListener('click', function () {
        projects.submitAndUpdate();
    }),
    this.submitButton.addEventListener('click', function () {
        tasks.submitAndUpdate();
    })
    },

    bindButtons: function () {

        this.deleteTaskButtons.forEach(button => {
            button.addEventListener('click', function() {
                tasks.matchTasks(button.parentElement.id);
            })
        }),

        this.deleteProjectButtons.forEach(button => {

            button.addEventListener('click', function() {
                projects.matchProjects(button.parentElement.id)
            })
        })

    },

    projectSelectTemplate: function (project) {
        dom.projectSelect.insertAdjacentHTML('beforeend', 
        `<option value="${project}">${project}</option>`)
    },

    updateProjectSelect: function () {

        dom.projectSelect.replaceChildren();
        storage.projectArray.forEach(project => {
            this.projectSelectTemplate(project)
        })
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
        <input type="checkbox" class="taskcheck" id="${element.title}-check" data-title="${element.title}" name="completed">
        <label for="completed">completed</label><br>
    </div>`)

        //add event listener - should be able to separate this out to it's own functions
        var checktest = document.getElementById(`${element.title}-check`)
        checktest.addEventListener('change', function() {
            console.log(this.getAttribute('data-title'))
            storage.taskArray.forEach(task => {

                if (this.getAttribute('data-title') == task.title) {
                    task.completed = true
                    console.log('complete?' + task.completed)
                } else {
                    console.log('no match')
                }


            })

        }
        )

    },

    emptyTemplate: function (project) {
        var projectDiv = document.getElementById(`project-${project}`);
        projectDiv.insertAdjacentHTML('beforeend', `<div class="task-wrapper" id="empty + " " + ${project}">
        <div class="task-counter">no tasks found for this project</div>
    </div>`)
    },

    removeElementById: function (id) {
        var x = document.getElementById(id);
        x.remove();
    }
}

var projects = {

    init: function () {
        this.array = []; 
        this.createProjectsArray(); //fills this.array with all project names on dom //should only fire once and probably in an if statement

                //checking for storage
        if (localStorage.projects !== undefined) {
            this.array = storage.projectArray;
        } else {
            this.pushProject("my tasks");
            this.pushProject("test");
            storage.setProjectStorage();
            storage.setProjectArray();
        } 
    },

    createProjectsArray: function () { //NEED TO USE STORAGE?
        //create array of all current projects on page, pushes name string into array
        var dataProjects = Array.from(document.querySelectorAll('.project-title'));
        dataProjects.forEach(el => {
            this.array.push(el.getAttribute('data-name'))
        })
    },

    submitAndUpdate: function () {

        var name = dom.newProject.value;
        if (!this.nameCheck(name)) {
            dom.projectTemplate(name);
            this.pushProject(name);
            storage.setProjectStorage();
            storage.setProjectArray();
            dom.updateProjectSelect();
            dom.cacheDom();
            dom.bindButtons();
            this.checkEmpties();
        } else {
            alert(`A project named ${name} already exists, please rename new project.`)
        }

    },
    checkEmpties: function () {

        storage.projectArray.forEach(element => {
            if (!this.taskInProject(element) && !this.hasEmptyMsg(element)) {
                console.log('yes')
                dom.emptyTemplate(element)
            }
        })
    },

    loadProjects: function () {
        storage.projectArray.forEach(element => {
            dom.projectTemplate(element)
        })
        this.checkEmpties();
    },

    taskInProject: function (project) {
        return storage.taskArray.some(task => task.project == project)
    },
    hasEmptyMsg: function (project) {

        var childArray = Array.from(document.getElementById(`project-${project}`).childNodes);
        return childArray.some(p => p.id == 'empty + ')
    },
    nameCheck: function (name) {
       return storage.projectArray.some(x => x == name);
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
                dom.removeElementById(id)
                this.array = storage.projectArray;
                storage.setProjectStorage();
                dom.updateProjectSelect();
                dom.cacheDom();
                dom.bindButtons();
                this.checkEmpties();

             } 
        })
    }
}

var tasks = {
    init: function () {

        this.array = [];
        storage.init(); //should this be here or in global?
        
        //checking for storage
        if (localStorage.tasks !== undefined) {
            this.array = storage.taskArray;
            console.log('task storage found')
        } else {
            this.pushTask(this.createTask({title: 'create a new task', description: 'this is the first thing on your list!', project: "my tasks"}));
            this.pushTask(this.createTask({title: 'test', description: 'test', project: "test"}));
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
          project: dom.projectSelect.value
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
        completed: false
      }
    },

    titleCheck: function (task) {
        return storage.taskArray.some(x => (x.title == task.title) && (x.project == task.project))
    },

    pushTask: function (task) {
        this.array.push(task);
    },
    markComplete: function(task) {
        task.completed = true;
    },
    submitAndUpdate: function () {
      var task = this.createTask(this.getObject());

      if (!this.titleCheck(task)) {
        this.pushTask(task);
        this.clear(dom.projectDisplay)
        storage.setTaskStorage();
        storage.setTaskArray();
        this.loadTasks();
        dom.cacheDom()
        dom.bindButtons();
        projects.checkEmpties()
      } else {
          alert(`A task with this title already exists under project ${task.project}.`)
      }
    },

    matchTasks: function (id) {
        storage.taskArray.forEach(item => {
            if (id == (item.title + " " + item.project)) {
                storage.taskArray.splice(storage.taskArray.indexOf(item), 1);
                this.clear(dom.projectDisplay)
                this.array = storage.taskArray;
                storage.setTaskStorage();
                this.loadTasks();
                dom.cacheDom();
                dom.bindButtons();
                projects.checkEmpties()
            } 
        })
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

    setTaskArray: function () { //change these to GET not set
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
                                                                    //init
                                                                    dom.cacheDom();
                                                                    tasks.init();
                                                                    projects.init();
                                                                    projects.loadProjects()
                                                                    tasks.loadTasks();
                                                                    dom.addListeners();
                                                                    dom.updateProjectSelect();
                                                                    dom.cacheDom();
                                                                    dom.bindButtons();

                                                                    



                                        //****WORKING ON */
                        //project dropdown in add task
                        
//NOTES : 
//some projects are remaining in dropdown after deleted
//strange, when no projects are on dom 'add' project will clear some from dropdown, can't nail it down




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

// const setUp = function() {

//     projects.pushProject("testing");
//     projects.loadProjects()
//     tasks.pushTask(tasks.createTask({title: 'set', description: 'set', project: "set"}));
//     tasks.loadTasks()
//     storage.setTaskStorage();
//     storage.setTaskArray();
//     storage.setProjectStorage();
//     storage.setProjectArray();
//     dom.cacheDom();
//     dom.bindButtons();
    
// }


                // if(this.containsTask(button)) {
                //     console.log('yes')
                    
                // } else {
                //     console.log('no')
                //     button.addEventListener('click', function() {
                //             console.log('fired')
                //             tasks.matchTasks(dom.getParentId(button));
                //         })
                //     }
                
//#endregion
