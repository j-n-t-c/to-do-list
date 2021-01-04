var dom = {

    cacheDom: function () {

        //display areas
    this.projectDisplay = document.getElementById('project-display')
                //pop up wrappers
    this.newProjectWrapper = document.getElementById('new-project-wrapper');
    this.newTaskWrapper = document.getElementById('new-task-wrapper');

        //buttons
    this.submitButton = document.getElementById('submit');
    this.submitNewProject = document.getElementById('submit-new-button');
    this.projectPopup = document.getElementById('project-popup');
    this.closeProjectPopup = document.getElementById('close-new-project-popup');
    this.taskPopup = document.getElementById('task-popup');
    this.closeTaskPopup = document.getElementById('close-new-task-popup');

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
        dom.newProjectWrapper.style.display = 'none';
    }),

    this.submitButton.addEventListener('click', function () {
        tasks.submitAndUpdate();
    }),

    this.projectPopup.addEventListener('click', function () {
        console.log('clicked')
        dom.newProjectWrapper.style.display = 'block';
    }),

    this.closeProjectPopup.addEventListener('click', function () {
        dom.newProjectWrapper.style.display = 'none';
    }),

    this.taskPopup.addEventListener('click', function () {
        console.log('clicked')
        dom.newTaskWrapper.style.display = 'block';
    }),

    this.closeTaskPopup.addEventListener('click', function () {
        dom.newTaskWrapper.style.display = 'none';
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

        dom.projectDisplay.insertAdjacentHTML('beforeend', `
        <div class="project-wrapper" id="project-${project}-wrappers">
            <div class="project-header project-${project}" id="project-${project}" data-name="${project}">
                <button class="delete-project-button" id="${project}-delete"><span>x</span></button>
                <h3>${project}</h3>
                <button class="hide-completed-button" id="${project}-hide">hide completed</button>
            </div>
            <div class="opentasks-header" id="project-${project}-opentasks"></div>
            <div class="completed-header" id="project-${project}-completed"></div>
        </div>
        `)

        //add event listeners
        var deleteButton = document.getElementById(`${project}-delete`)
            deleteButton.addEventListener('click', function() {
                projects.matchProjects(deleteButton.parentElement.id)
            })

        var hideButton = document.getElementById(`${project}-hide`)
            hideButton.addEventListener('click', function () {
                dom.hideCmpInProj(project);
                console.log('click')
            })
    },

    taskTemplate: function (project, element) {

        var openTasksDiv = document.getElementById(`project-${project}-opentasks`)
        openTasksDiv.insertAdjacentHTML('beforeend', `
        <div class="task-wrapper" id="${element.title + " " + project}">
            <button class="delete-task-button" id="${element.title}-task-delete"><span>x</span></button>
            <div class="task-counter">${element.counter}</div>
            <div class="task-title">${element.title}</div>
            <div class="task-description">${element.description}</div>
            <div class="task-duedate">${element.dueDate}</div>
            <div class="task-priority">${element.priority}</div>
            <div class="task-notes">${element.notes}</div>
            <input type="checkbox" class="taskcheck" id="${element.title + " " + element.project}-check" data-forcheck="${element.title + " " + element.project}" name="completed">
            <label for="completed">completed</label><br>
        </div>
        `)

        //add event listeners
        var deleteButton = document.getElementById(`${element.title}-task-delete`)
        deleteButton.addEventListener('click', function() {
            console.log('click')
            tasks.matchTasks(deleteButton.parentElement.id);
        })

        var checktest = document.getElementById(`${element.title + " " + element.project}-check`)
        checktest.addEventListener('change', function() {
            //console.log(this.getAttribute('data-title'))
            storage.taskArray.forEach(task => {
                //console.log(this.getAttribute('data-forcheck'))
                 if (this.getAttribute('data-forcheck') == (task.title + " " + task.project)) {
                     task.completed = true
                     //console.log('complete?' + task.completed)
                 } else {
                     //console.log('no match')
                 }
            })
            tasks.array = storage.taskArray;
            tasks.clear(dom.projectDisplay)
            tasks.loadTasks();
            projects.checkEmpties();
        }
        )

    },
    completedTemplate: function (project, element) {

        var completedDiv = document.getElementById(`project-${project}-completed`)
        completedDiv.insertAdjacentHTML('beforeend', `
        <div class="completed-task-wrapper" id="${element.title + " " + project}" data-project="${project}">
            <button class="delete-task-button" id="${element.title}-task-delete"><span>x</span></button>
            <div class="task-counter">${element.counter}</div>
            <div class="task-title">${element.title}</div>
            <div class="task-description">${element.description}</div>
            <div class="task-duedate">${element.dueDate}</div>
            <div class="task-priority">${element.priority}</div>
            <div class="task-notes">${element.notes}</div>
            <input type="checkbox" class="taskcheck" id="${element.title + " " + element.project}-check" data-forcheck="${element.title + " " + element.project}" name="completed" checked>
            <label for="completed">completed</label><br>
        </div>
        `)

        //add event listener
        var deleteButton = document.getElementById(`${element.title}-task-delete`)
        deleteButton.addEventListener('click', function() {
            //console.log('click')
            tasks.matchTasks(deleteButton.parentElement.id);
        })

        var checktest = document.getElementById(`${element.title + " " + element.project}-check`)
        checktest.addEventListener('change', function() {

            tasks.array = storage.taskArray;
            storage.taskArray.forEach(task => {
                if (this.getAttribute('data-forcheck') == (task.title + " " + task.project)) {
                    task.completed = false
                }
            })

            tasks.array = storage.taskArray;
            tasks.clear(dom.projectDisplay)
            tasks.loadTasks();
            projects.checkEmpties();
        })
    },

    hideCmpInProj: function (p) {
        //array of all completed tasks on dom
        var wrapperArray = Array.from(document.querySelectorAll('.completed-task-wrapper'));
        //array of all completed tasks in project
        var mappedTaskArray = storage.taskArray.filter(task => (task.project == p && task.completed == true));
        //for each wrapper, if it's id is the same as mapped array .title, hide that wrapper
        console.log(wrapperArray)
        wrapperArray.forEach(el => {
            if (mappedTaskArray.some(task => (task.title + " " + task.project == el.id))) {
                var project = el.getAttribute('data-project');
                var hideButton = document.getElementById(`${project}-hide`)
                console.log(el.style.display)
                if (el.style.display != 'none') {
                    el.style.display = 'none'
                    tasks.hideCompleted = true;
                    hideButton.innerText = 'show completed'
                    console.log(tasks.hideCompleted)
                } else if (el.style.display == 'none') {
                    var hiddenWrapper = document.getElementById(`hidden ${project}`)
                    el.style.display = 'flex';
                    tasks.hideCompleted = false;
                    hideButton.innerText = 'hide completed'
                    console.log(tasks.hideCompleted)
                }
            }
        })
    },

    emptyTemplate: function (project) {
        var projectDiv = document.getElementById(`project-${project}`);
        projectDiv.insertAdjacentHTML('afterend', 
        `<div class="empty-task-wrapper" id="empty + " " + ${project}">
            <div>no tasks found for this project</div>
        </div>`)
    },

    removeElementById: function (id) { //had to add parent element because of changes to project template
        console.log(id)
        var x = document.getElementById(id);
        console.log(x.parentElement)
        x.parentElement.remove();
    },
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
            this.checkEmpties();
        } else {
            alert(`A project named ${name} already exists, please rename new project.`)
        }
    },
    checkEmpties: function () {
        storage.projectArray.forEach(element => {
            if (!this.taskInProject(element) && !this.hasEmptyMsg(element)) {
                console.log('true')
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
        console.log(project)
        var sibling = document.getElementById(`project-${project}`).nextElementSibling;
        console.log(sibling)
        return sibling.id.includes('empty');
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
                this.checkEmpties();
             } 
        })
    }
}

var tasks = {
    init: function () {

        this.array = [];
        storage.init(); //should this be here or in global?
        this.hideCompleted = false;
        
        //checking for storage
        if (localStorage.tasks !== undefined) {
            this.array = storage.taskArray;
            //console.log('task storage found')
        } else {
            this.pushTask(this.createTask({title: 'create a new task', description: 'this is the first thing on your list!', project: "my tasks"}));
            this.pushTask(this.createTask({title: 'test', description: 'test', project: "test"}));
            //console.log('NO task storage');
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
        projects.checkEmpties()
      } else {
          alert(`A task with this title already exists under project ${task.project}.`)
      }
    },

    matchTasks: function (id) {
        storage.taskArray.forEach(item => {
            //console.log('alert')
            if (id == (item.title + " " + item.project)) {
                storage.taskArray.splice(storage.taskArray.indexOf(item), 1);
                this.clear(dom.projectDisplay)
                this.array = storage.taskArray;
                storage.setTaskStorage();
                this.loadTasks();
                dom.cacheDom();
                projects.checkEmpties()
            } 
        })
    },

    clear: function (node) {
      node.querySelectorAll('div.task-wrapper, div.completed-task-wrapper, div.empty-task-wrapper').forEach(child => {
        child.remove();
      })
    },

    loadTasks: function () {
        storage.taskArray.forEach(element => {
                var project = element.project
                if (element.completed == false) {
                dom.taskTemplate(project, element)
                } else {
                    if (this.hideCompleted == false){
                        dom.completedTemplate(project, element)
                    }
                }
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

                                                                    



                                        //****WORKING ON */
                        //project dropdown in add task
                        

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
                

                
                //hide
                //this.globalHide = document.getElementById('global-hide');

// this.globalHide.addEventListener('click', function () {
//     //need to put something here to check that there are completed tasks, also hide button if not
//     if (tasks.array.some(t => t.completed == true)) {

//             if (tasks.hideCompleted == false) {
//                 tasks.hideCompleted = true;
//             } else if (tasks.hideCompleted == true) {
//                 tasks.hideCompleted = false;
//             }

//             tasks.clear(dom.projectDisplay)
//             tasks.loadTasks()
//             projects.checkEmpties();
//         }
//     })
//#endregion
