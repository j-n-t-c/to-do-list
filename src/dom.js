import tasks from './tasks.js'
import projects from './projects.js'
import storage from './storage.js'

var dom = {

    cacheDom: function () {
    
    this.dateSet("input-duedate");

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
            //footer reset button
    this.reset = document.getElementById('reset')
    },

    getDate() {
        var date = new Date();

        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();

        if (month < 10) month = "0" + month;
        if (day < 10) day = "0" + day;

        var today = year + "-" + month + "-" + day;
        return today;
    },

    dateSet: function (id) {

        var date = new Date();

        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();

        if (month < 10) month = "0" + month;
        if (day < 10) day = "0" + day;

        var today = year + "-" + month + "-" + day;       
        document.getElementById(id).value = today;
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
    }),
    this.reset.addEventListener('click', function () {
        storage.clear();
        window.location.reload()
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

    expandNotes: function (project, element, parent, notes) {
        var expanded = parent.getAttribute('data-expanded')
        var expandButton = document.getElementById(`${element.title}-expand`)
            if (expanded == 'false') {   
                parent.insertAdjacentHTML('afterend', `
            <div class="expand-div" id="${element.title}-expand-div">
            ${element.notes}
            </div>
            `)   
            notes.innerHTML = '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp' + 
                                '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp' +
                                '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';               
            parent.setAttribute('data-expanded', 'true');
            expandButton.innerHTML = '<i class="fas fa-chevron-up"></i>';

            } else if (expanded == 'true') {
                var expandDiv = document.getElementById(`${element.title}-expand-div`);
                expandDiv.remove()
                notes.innerHTML = element.notes;  
                parent.setAttribute('data-expanded', 'false');
                expandButton.innerHTML = '<i class="fas fa-chevron-down"></i>';
            }
        },

    //DYNAMIC TEMPLATES
        //projects and tasks
    projectTemplate: function (project) {

        dom.projectDisplay.insertAdjacentHTML('beforeend', `

            <div class="project-wrapper" id="project-${project}-wrappers">
                <div class="project-header project-${project}" id="project-${project}" data-name="${project}">
                    <div class="project-title-delete">
                        <button class="pdelete" id="${project}-delete"><i class="fas fa-times"></i></button>
                        <h2 class="project-h2">${project}</h2>
                    </div>

                    <div class="project-task-hide">
                        <button class="project-add-task hvb" id="${project}-add-task">+ task</button>
                        <button id="${project}-hide" class="hvb">hide completed</button>
                    </div>
                </div>

                <div class="opentasks-header" id="project-${project}-opentasks"></div> 
                <div class="completed-header" id="project-${project}-completed"></div>

            </div>

            `)

        //add event listeners
        var deleteButton = document.getElementById(`${project}-delete`)
            deleteButton.addEventListener('click', function() {
                var wrapperId = deleteButton.parentElement.parentElement.id
                dom.deleteWarning(wrapperId)
            })

        var hideButton = document.getElementById(`${project}-hide`);

            hideButton.addEventListener('click', function () {

                var projInArray = projects.objArray.find(proj => proj.name == project)

                var mappedTaskArray = storage.taskArray.filter(task => (task.project == project && task.completed == true));

                if (mappedTaskArray.length > 0) {
                    if (projInArray.hide == false) {
                        projInArray.hide = true;
                    } else if (projInArray.hide == true) {
                        projInArray.hide = false;
                    }
                    dom.hideCmpInProj(project);
                }

                mappedTaskArray.forEach(task => {
                    var expandDiv = document.getElementById(`${task.title}-expand-div`)
                    if (document.contains(expandDiv)) {
                        expandDiv.remove();
                    }
                })
            })

        var addTaskButton = document.getElementById(`${project}-add-task`);
            addTaskButton.addEventListener('click', function () {
                dom.lTaskInput(project)
            })
    },

    taskTemplate: function (project, element) {
        var openTasksDiv = document.getElementById(`project-${project}-opentasks`)
        openTasksDiv.insertAdjacentHTML('beforeend', `
            <div class="task-wrapper" data-expanded="false" id="${element.title + " " + project}" data-project="${project}">

                <button class="tdelete" id="${element.title}-task-delete"><i class="fas fa-times tdbx"></i></button>

                <div class="task-primary">
                    <div class="task-title">${element.title}</div>
                </div>

                <div class="notes-wrap" id="${element.title}-notes-wrap">
                    <div class="task-notes" id="${element.title}-task-notes">${element.notes}</div>
                </div>

                <div class="task-date-priority">
                    <div class="task-duedate"><i class="far fa-calendar-alt"></i>${element.dueDate}</div>
                    <div class="task-priority" id="${element.title}-priority"><i class="fas fa-exclamation-circle"></i></i><span class="pr">${element.priority}</span></div>
                </div>

                <div class="checkbox-div">
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

            storage.taskArray.forEach(task => {
                 if (this.getAttribute('data-forcheck') == (task.title + " " + task.project)) {
                     task.completed = true
                 } 
            })

            tasks.array = storage.taskArray;
            storage.setTaskStorage();
            tasks.clear(dom.projectDisplay);
            tasks.loadTasks();
            dom.priorityColor();
            projects.checkEmpties();

            projects.objArray.forEach(p => {
                 if (p.hide == true) {
                     dom.hideCmpInProj(p.name);
                     }
            })

            storage.taskArray.forEach(task => {
                var expandDiv = document.getElementById(`${task.title}-expand-div`)
                if (document.contains(expandDiv)) {
                    expandDiv.remove();
                }
            })
            
        })
        
        //notes
        this.nWrap = document.getElementById(`${element.title}-notes-wrap`)
        this.nText = document.getElementById(`${element.title}-task-notes`)
        this.taskWrapper = document.getElementById(`${element.title + " " + project}`)
        
        if (this.nText.offsetWidth > (this.nWrap.offsetWidth * 0.7)) {
                this.nText.style.overflow = 'hidden';
                this.nWrap.insertAdjacentHTML('beforeend', `<button class="expand-button" id="${element.title}-expand"><i class="fas fa-chevron-down"></i></button>`)

                var expandButton = document.getElementById(`${element.title}-expand`)
                expandButton.addEventListener('click', function () {
                    parent = this.parentElement.parentElement;
                    var notes = document.getElementById(`${element.title}-task-notes`);
                    dom.expandNotes(project, element, parent, notes) //try to remove project if possible
                })
        }
    },
 
    completedTemplate: function (project, element) {

        var completedDiv = document.getElementById(`project-${project}-completed`)
        completedDiv.insertAdjacentHTML('beforeend', `
            <div class="completed-task-wrapper" data-expanded="false" id="${element.title + " " + project}" data-project="${project}">

                <button class="tdelete" id="${element.title}-task-delete"><i class="fas fa-times tdbx"></i></button>

                <div class="task-primary">
                    <div class="task-title">${element.title}</div>
                </div>

                <div class="notes-wrap" id="${element.title}-notes-wrap">
                    <div class="task-notes" id="${element.title}-task-notes">${element.notes}</div>
                </div>

                <div class="task-date-priority">
                    <div class="task-duedate"><i class="far fa-calendar-alt"></i>${element.dueDate}</div>
                    <div class="task-priority" id="${element.title}-priority"><i class="fas fa-exclamation-circle"></i></i><span class="pr">${element.priority}</span></div>
                </div>

                <div class="checkbox-div">
                    <input type="checkbox" class="taskcheck" id="${element.title + " " + element.project}-check" 
                    data-forcheck="${element.title + " " + element.project}" name="completed" checked>
                </div>
            </div>
            `)

        //add event listener
        var deleteButton = document.getElementById(`${element.title}-task-delete`)
        deleteButton.addEventListener('click', function() {
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
            storage.setTaskStorage();
            tasks.clear(dom.projectDisplay)
            tasks.loadTasks();
            dom.priorityColor();
            projects.checkEmpties();

            projects.objArray.forEach(p => {
                if (p.hide == true) {
                    dom.hideCmpInProj(p.name);
                    }
           })

            storage.taskArray.forEach(task => {
                var expandDiv = document.getElementById(`${task.title}-expand-div`)
                if (document.contains(expandDiv)) {
                    expandDiv.remove();
                }
            })

        })

        this.nWrap = document.getElementById(`${element.title}-notes-wrap`)
        this.nText = document.getElementById(`${element.title}-task-notes`)
        this.taskWrapper = document.getElementById(`${element.title + " " + project}`)

        if (this.nText.offsetWidth > (this.nWrap.offsetWidth * 0.7)) {
            this.nText.style.overflow = 'hidden';
            this.nWrap.insertAdjacentHTML('beforeend', `<button class="expand-button" id="${element.title}-expand"><i class="fas fa-chevron-down"></i></button>`)

            var expandButton = document.getElementById(`${element.title}-expand`)
            expandButton.addEventListener('click', function () {
                parent = this.parentElement.parentElement;
                var notes = document.getElementById(`${element.title}-task-notes`);
                dom.expandNotes(project, element, parent, notes)
            })
    }
    },

    emptyTemplate: function (project) {
        var projectDiv = document.getElementById(`project-${project}`);
        projectDiv.insertAdjacentHTML('afterend', `

            <div class="empty-task-wrapper" id="empty-${project}">
                <div>no tasks found for this project</div>
            </div>
            `)
    },

    allDeleted: function (project) {
        var display = document.getElementById('display-header');
        display.insertAdjacentHTML('afterend', `

            <div id="alld" class="all-deleted" >
                <div><h3>add a new project to start your To Do list</h3></div>
            </div>
            `)
    },

        //POPUP windows
    lTaskInput: function (project) {
        var display = document.querySelector('body');
        display.insertAdjacentHTML('afterbegin', `

            <div class="popup-wrapper" id="dynamic-task-${project}">
                <div class="popup-inside">
                    <div class="popup-header">
                        <h2>add new task</h2>
                    </div>

                        <div id="input-form">
                            <label for="dynamic-project" id="input-title-label">project</label>
                            <input id="dynamic-project" class="input-dynamic" value="${project}" disabled></input>
                    
                            <input name="form" type="text" id="dynamic-title" maxlength="30" placeholder="enter title"></input>
                            <input name="form" type="text" id="dynamic-notes" placeholder="enter notes"></input>

                            <label for="dynamic-duedate" id="input-duedate-label">due date</label>
                            <input name="duedate" type="date" id="dynamic-duedate"></input>
                    
                            <label for="dynamic-priority" id="input-priority-label">priority</label>
                            <select name="priority" id="dynamic-priority">
                                <option value="urgent">urgent</option>
                                <option value="high">high</option>
                                <option value="medium">medium</option>
                                <option value="low">low</option>
                            </select>
                    
                            <div class="popup-buttons">
                                <button id="dynamic-submit" class="blackbutton">submit</button>
                                <button id="close-new-task-popup" class="popclose"><i class="fas fa-window-close"></i></button>
                            </div>
                        
                        </div>
                </div>
            </div>    

        `)

        this.dateSet("dynamic-duedate");

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
        this.notes = document.getElementById('dynamic-notes');
        this.dueDate = document.getElementById('dynamic-duedate');
        this.priority = document.getElementById('dynamic-priority');
    },

    deleteWarning: function (id) {
        var display = document.querySelector('body');
        display.insertAdjacentHTML('afterbegin', `

            <div class="popup-wrapper" id="delete-warning">
                <div class="popup-inside confirm">
                    <div class="popup-header">
                        <h2>delete project?</h2>
                        <h5>this will delete all tasks in project</h5>
                    </div>

                    <div class="popup-buttons">
                        <button id="confirm-delete" class="blackbutton">confirm</button>
                        <button id="close-new-task-popup" class="blackbutton">cancel</button>
                    </div>
                </div>
            </div>    

        `)

        var deletePopup = document.getElementById('delete-warning');
        deletePopup.style.display = 'flex';

        this.confirm = document.getElementById('confirm-delete');
        this.confirm.addEventListener('click', function () {
            deletePopup.style.display = 'none';
            projects.matchProjects(id)
        })

        this.close = document.getElementById('close-new-task-popup');
        this.close.addEventListener('click', function () {
            deletePopup.style.display = 'none';
            return false
        })

    },

    projectWarning: function () {
        var display = document.querySelector('body');
        display.insertAdjacentHTML('afterbegin', `

            <div class="popup-wrapper" id="project-warning">
                <div class="popup-inside confirm">
                    <div class="popup-header">
                        <h2>oops!</h2>
                        <h5>you already have a project with that name...</h5>
                    </div>

                    <div class="popup-buttons">
                        <button id="confirm-delete" class="blackbutton">try again</button>
                    </div>
                </div>
            </div>    

        `)

        var projectDupPopup = document.getElementById('project-warning');
        projectDupPopup.style.display = 'flex';

        this.confirm = document.getElementById('confirm-delete');
        this.confirm.addEventListener('click', function () {
            projectDupPopup.style.display = 'none';
            dom.newProjectWrapper.style.display = 'none';
            dom.newProjectWrapper.style.display = 'block';
            dom.newProject.value = '';
        })

    },

    taskWarning: function () {
        var display = document.querySelector('body');
        display.insertAdjacentHTML('afterbegin', `

            <div class="popup-wrapper" id="task-warning">
                <div class="popup-inside confirm">
                    <div class="popup-header">
                        <h2>oops!</h2>
                        <h5>you already have a task with that name...</h5>
                    </div>

                    <div class="popup-buttons">
                        <button id="confirm-delete" class="blackbutton">try again</button>
                    </div>
                </div>
            </div>    

        `)

        var taskDupPopup = document.getElementById('task-warning');
        taskDupPopup.style.display = 'flex';

        this.confirm = document.getElementById('confirm-delete');
        this.confirm.addEventListener('click', function () {
            taskDupPopup.style.display = 'none';
            dom.newTaskWrapper.style.display = 'none';
            dom.newTaskWrapper.style.display = 'block';
            this.title.value = '';
            dom.title.value = '';
        })

    },

    hideCmpInProj: function (p) {
        var mappedTaskArray = storage.taskArray.filter(task => (task.project == p && task.completed == true));
        if (mappedTaskArray.length > 0) {
            mappedTaskArray.forEach(el => {
                var wrapper = document.getElementById(el.title + " " + el.project);
                var hideButton = document.getElementById(`${el.project}-hide`)
                if (document.contains(wrapper)) {
                    wrapper.remove();
                    hideButton.innerText = 'show completed'
                    hideButton.style.backgroundColor = 'rgb(20 117 255)'
                    hideButton.style.color = 'white'
                } else if (!document.contains(wrapper)) {
                    dom.completedTemplate(el.project, el)
                    hideButton.innerText = 'hide completed'
                    hideButton.style.backgroundColor = 'white'
                    hideButton.style.color = 'black'
                }
            })
            this.priorityColor()
        }

    },

    removeElementById: function (id) {
        var x = document.getElementById(id);
        x.parentElement.remove();
    },

    priorityColor: function () {

        var hidden = projects.objArray.filter(p => (p.hide == true))
        var hiddenArray = [];
        hidden.forEach(p => {
            hiddenArray.push(p.name);
        })
            storage.taskArray.forEach(task => {

                if (!hiddenArray.includes(task.project)) {

                    var div = document.getElementById(task.title + '-priority')
                    if (task.priority == 'urgent') {
                        div.style.color = 'red';
                    } else if (task.priority == 'high') {
                        div.style.color = 'rgb(215, 80, 24)';
                    }else if (task.priority == 'medium') {
                        div.style.color = 'rgb(213, 210, 120)';
                    } else if (task.priority == 'low') {
                        div.style.color = 'rgb(130, 184, 37)';
                    } else if (task.priority == 'priority'){
                        div.style.color = 'black;'
                    }
                }
                })
    }
}

export default dom