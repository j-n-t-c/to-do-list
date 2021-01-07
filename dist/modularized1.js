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
        dom.newTaskWrapper.style.display = 'none';
    }),

    this.projectPopup.addEventListener('click', function () {
        dom.newProjectWrapper.style.display = 'block';
    }),

    this.closeProjectPopup.addEventListener('click', function () {
        dom.newProjectWrapper.style.display = 'none';
    }),

    this.taskPopup.addEventListener('click', function () {
        dom.newTaskWrapper.style.display = 'block';
    }),

    this.closeTaskPopup.addEventListener('click', function () {
        dom.newTaskWrapper.style.display = 'none';
    })
    },

    projectSelectTemplate: function (project) {
        dom.projectSelect.insertAdjacentHTML('beforeend', 
        `<option id="${project}-select" value="${project}">${project}</option>`)
        this.projectSelectDynamic = document.getElementById('${project}-select')
    },

    updateProjectSelect: function () {

        dom.projectSelect.replaceChildren();
        storage.projectArray.forEach(project => {
            this.projectSelectTemplate(project)
        })
    },

    //DYNAMIC TEMPLATES
        //projects and tasks
    projectTemplate: function (project) {

        dom.projectDisplay.insertAdjacentHTML('beforeend', `
        <div class="project-wrapper" id="project-${project}-wrappers">
            <div class="project-header project-${project}" id="project-${project}" data-name="${project}">
                <button class="delete-project-button" id="${project}-delete"><span>x</span></button>
                <h3>${project}</h3>
                <button class="hide-completed-button" id="${project}-hide">hide completed</button>
                <button class="project-add-task" id="${project}-add-task">+ task</button>
            </div>
            <div class="opentasks-header" id="project-${project}-opentasks"></div>
            <div class="completed-header" id="project-${project}-completed"></div>
        </div>
        `)


        //add event listeners
        var deleteButton = document.getElementById(`${project}-delete`)
            deleteButton.addEventListener('click', function() {
                console.log(storage.taskArray)
                projects.matchProjects(deleteButton.parentElement.id)
            })

        var hideButton = document.getElementById(`${project}-hide`)
            hideButton.addEventListener('click', function () {
                console.log("hide button clicked")
                var projInArray = projects.objArray.find(proj => proj.name = project)
                var mappedTaskArray = storage.taskArray.filter(task => (task.project == project && task.completed == true));

                if (mappedTaskArray.length >= 1) {
                    dom.hideCmpInProj(project);
                    if (projInArray.hide == false) {
                        projInArray.hide = true;
                    } else if (projInArray.hide == true) {
                        projInArray.hide = false;
                    }
                }
                console.log(projInArray.hide)
            })

        var addTaskButton = document.getElementById(`${project}-add-task`);
            addTaskButton.addEventListener('click', function () {
                dom.lTaskInput(project)
            })
    },

    taskTemplate: function (project, element) {
        var openTasksDiv = document.getElementById(`project-${project}-opentasks`)
        openTasksDiv.insertAdjacentHTML('beforeend', `
        <div class="task-wrapper" id="${element.title + " " + project}">
            <button class="delete-task-button" id="${element.title}-task-delete"><span>x</span></button>
            <div class="task-primary">
                <div class="task-title">${element.title}</div>
                <div class="task-duedate">${element.dueDate}</div>
                <div class="task-priority">${element.priority}</div>
            </div>
            <div class="notes-wrap" id="${element.title}-notes-wrap">
                <div class="task-notes" id="${element.title}-task-notes">${element.notes}</div>
            </div>
            <div class="checkbox-div">
                <span>completed</span>
                <input type="checkbox" class="taskcheck" id="${element.title + " " + element.project}-check" 
                data-forcheck="${element.title + " " + element.project}" name="completed">
            </div>
        </div>
        `)

        //add event listeners
        var deleteButton = document.getElementById(`${element.title}-task-delete`)
        deleteButton.addEventListener('click', function() {
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

            var projInArray = projects.objArray.find(proj => proj.name = project)
            console.log(projInArray.hide)
            if (projInArray.hide == true) {
                console.log('box checked')
            dom.hideCmpInProj(project);
            }
            //projects.checkEmpties();
        })
        
        //notes
        this.nWrap = document.getElementById(`${element.title}-notes-wrap`)
        this.nText = document.getElementById(`${element.title}-task-notes`)
        console.log(this.nWrap.offsetWidth)
        console.log(this.nText.offsetWidth)

        if (this.nText.offsetWidth > (this.nWrap.offsetWidth * 0.9)) {
                this.nText.style.overflow = 'hidden';
                this.nText.style.textOverflow = 'ellipsis';

                this.nWrap.insertAdjacentHTML('afterend', `
                <button id="${element.title}-expand">
                + 
                </button>
                `)

                var expandButton = document.getElementById(`${element.title}-expand`)
                expandButton.addEventListener('click', function () {
                    //insertadjacentHTML under wrapper to expand notes
                    console.log('expand')
                })
        }

    },
    completedTemplate: function (project, element) {

        var completedDiv = document.getElementById(`project-${project}-completed`)
        completedDiv.insertAdjacentHTML('beforeend', `
        <div class="completed-task-wrapper" id="${element.title + " " + project}" data-project="${project}">
            <button class="delete-task-button" id="${element.title}-task-delete"><span>x</span></button>
            <div class="task-primary">
            <div class="task-title">${element.title}</div>
            <div class="task-duedate">${element.dueDate}</div>
            <div class="task-priority">${element.priority}</div>
        </div>
        <div class="notes-wrap" id="${element.title}-notes-wrap">
            <div class="task-notes" id="${element.title}-task-notes">${element.notes}</div>
        </div>
            <div class="checkbox-div">
            <span>completed</span>
            <input type="checkbox" class="taskcheck" id="${element.title + " " + element.project}-check" 
            data-forcheck="${element.title + " " + element.project}" name="completed" checked>
        </div>
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
            //projects.checkEmpties();

            //var projInArray = projects.objArray.find(proj => proj.name = project)
            //if (projInArray.hide == true) { //if this project is supposed to be hidden
            //    console.log('box unchecked')
            //dom.hideCmpInProj(project);
            //} else {
                //console.log()
            //}
        })

                //notes

    },

    emptyTemplate: function (project) {
        var projectDiv = document.getElementById(`project-${project}`);
        projectDiv.insertAdjacentHTML('afterend', 
        `<div class="empty-task-wrapper" id="empty + " " + ${project}">
            <div>no tasks found for this project</div>
        </div>`)
    },

        //POPUP windows
    lTaskInput: function (project) {
        var display = document.querySelector('body');
        display.insertAdjacentHTML('afterbegin', `
            <div class="popup-wrapper" id="dynamic-task-${project}">
                <div class="popup-inside">
                    <div class="popup-header">
                        <h1>add new task</h1>
                    </div>
                    <div id="input-form">

                        <label for="dynamic-project" id="input-title-label">project</label>
                        <input id="dynamic-project" class="input-dynamic" value="${project}" disabled></input>
                            
                        </select>
                
                        <label for="dynamic-title" id="input-title-label">title</label>
                        <input name="form" type="text" id="dynamic-title"></input>

                        <label for="dynamic-notes" id="input-notes-label">notes</label>
                        <input name="form" type="text" id="dynamic-notes"></input>

                        <label for="dynamic-duedate" id="input-duedate-label">due date</label>
                        <input name="form" type="text" id="dynamic-duedate"></input>
                
                    <label for="dynamic-priority" id="input-priority-label">priority</label>
                        <select name="priority" id="dynamic-priority">
                            <option value="urgent">urgent!</option>
                            <option value="high">high</option>
                            <option value="medium">medium</option>
                            <option value="low">low</option>
                            <option value="someday">someday...</option>
                        </select>
                
                        <button id="dynamic-submit">submit</button>
                        <button id="close-new-task-popup">x</button>
                        
                    </div>
                </div>
             </div>    

        `)
        var dynamicPopup = document.getElementById(`dynamic-task-${project}`)
            dynamicPopup.style.display = 'flex';

        this.close = document.getElementById('close-new-task-popup')
        this.close.addEventListener('click', function() {
            dynamicPopup.style.display = 'none';
        })
        this.submit = document.getElementById('dynamic-submit');
        this.submit.addEventListener('click', function() {
            tasks.submitAndUpdate();
            dynamicPopup.style.display = 'none';
        })

        //input elements change for createTask
        this.projectSelect = document.getElementById('dynamic-project');
        this.title = document.getElementById('dynamic-title');
        this.description = document.getElementById('dynamic-description');
        this.dueDate = document.getElementById('dynamic-duedate');
        this.priority = document.getElementById('dynamic-priority');
        this.notes = document.getElementById('dynamic-notes');
    },

    hideCmpInProj: function (p) {
        console.log('hideCmpInProj')
        //array of all completed tasks in project
        var projInArray = projects.objArray.find(proj => proj.name = p)
        var mappedTaskArray = storage.taskArray.filter(task => (task.project == p && task.completed == true));
        //for each completed task, hide wrapper with same id
        //console.log(mappedTaskArray.length)
        //console.log(projInArray.hide)
        if (mappedTaskArray.length > 0) {
            
            mappedTaskArray.forEach(el => {
                var wrapper = document.getElementById(el.title + " " + el.project);
                var hideButton = document.getElementById(`${el.project}-hide`)
                if (document.contains(wrapper)) {
                    wrapper.remove();
                    hideButton.innerText = 'show completed'
                } else if (!document.contains(wrapper)) {
                    dom.completedTemplate(el.project, el)
                    hideButton.innerText = 'hide completed'
                } else { console.log('something fucky')
            }
            })
        }
    },

    removeElementById: function (id) { //had to add parent element because of changes to project template
        var x = document.getElementById(id);
        //console.log(x.parentElement)
        x.parentElement.remove();
    },
}

var projects = {

    init: function () {
        this.array = []; 
        this.createProjectsArray(); //fills this.array with all project names on dom //should only fire once and probably in an if statement
        this.objArray = [];

                //checking for storage
        if (localStorage.projects !== undefined) {
            this.array = storage.projectArray;
        } else {
            this.pushProject("my tasks");
            this.pushProject("test");
            this.pushProject("fandango");
            this.pushProject("wingdings");
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

    createObjArray: function () {
        this.array.forEach(project => {
            this.objArray.push({name: project, hide: false})
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
                dom.emptyTemplate(element)
            }
        })
    },

    loadProjects: function () {
        storage.projectArray.forEach(element => {
            dom.projectTemplate(element)
        })
        this.checkEmpties();
        this.createObjArray();
    },

    taskInProject: function (project) {
        return storage.taskArray.some(task => task.project == project)
    },

    hasEmptyMsg: function (project) {
        var sibling = document.getElementById(`project-${project}`).nextElementSibling;
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
            this.pushTask(this.createTask({title: 'create a new task', dueDate: '08/15', priority: 'urgent!', 
            notes: 'this is the first thing on your list!', project: 'my tasks'})); //this

            this.pushTask(this.createTask({title: 'bananas', dueDate: '08/15', priority: 'urgent!', 
            notes: 'buy some motherfuckin bananas', project: 'my tasks'}));

            this.pushTask(this.createTask({title: 'go on a diet', dueDate: '08/15', priority: 'urgent!', 
            notes: 'google it dumb dumb!', project: 'my tasks'})); //this

            this.pushTask(this.createTask({title: 'oneword', dueDate: '12/01', priority: 'high', 
            notes: 'tesing, testing, testing, testing, testing, testing a long ass note in the notes bruhh', project: 'test'}));

            this.pushTask(this.createTask({title: 'two words', dueDate: '08/15', priority: 'urgent!', 
            notes: 'here is another task to make', project: 'fandango'}));

            this.pushTask(this.createTask({title: 'second test task', dueDate: '12/01', priority: 'high', 
            notes: 'lorem ipsum banana fucker', project: 'test'}));

            //console.log('NO task storage');
            storage.setTaskStorage();
            storage.setTaskArray();
        } 
    },

    getObject: function () { //getObject is argument for createTask //move to dom object??
        const taskObject = {
          title: dom.title.value,
          dueDate: dom.dueDate.value,
          priority: dom.priority.value,
          notes: dom.notes.value,
          project: dom.projectSelect.value
        }
        return taskObject
    },

    createTask: function ({title, dueDate, priority, notes, project, completed}) {
       return {
        title,
        dueDate,
        priority,
        notes,
        project,
        counter: this.array.length + 1,
        completed: completed == true ? true: false
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
                var projInArray = projects.objArray.find(proj => proj.name = item.project)
                console.log(projInArray)
                if (projInArray.hide == true) {
                    dom.hideCmpInProj(item.project)
                }
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
                }  else {
                    if (this.hideCompleted == false){
                        dom.completedTemplate(project, element)
                   }
                }
        })
    },

    removeTasksInProject: function (item) {    //item = project
        console.log(storage.taskArray)
        storage.taskArray.forEach(element => {
            if (element.project == item) {
                console.log('deleted')
                storage.taskArray.splice(storage.taskArray.indexOf(element), 1);
            } else {
                console.log('NOT deleted')
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
                                    console.log(storage.taskArray)

                                                                    



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
