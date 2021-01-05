import tasks from './tasks.js'
import projects from './projects.js'
import storage from './storage.js'

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
            <button class="collapse-task-button" id="${element.title}-task-collapse"><span><</span></button>
            <div class="task-title">${element.title}</div>
            <div class="task-notes">${element.notes}</div>
            <div class="task-duedate">${element.dueDate}</div>
            <div class="task-priority">${element.priority}</div>
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
        //make a collapsible div class in template that contains everything you want collapsed
        var collapseButton = document.getElementById(`${element.title}-task-collapse`)
        collapseButton.addEventListener('click', function() {
            console.log(this.parentElement.getElementsByClassName('task-title'))
            //this.parentElement.getElementsByTagName('div')[0].style.display='none';
            //function
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
            if (projInArray.hide == true) {
            dom.hideCmpInProj(project);
            }
            //projects.checkEmpties();
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
            //projects.checkEmpties();
        })
    },

    hideCmpInProj: function (p) {
        //array of all completed tasks in project
        var projInArray = projects.objArray.find(proj => proj.name = p)
        var mappedTaskArray = storage.taskArray.filter(task => (task.project == p && task.completed == true));
        console.log(projInArray)
        //for each completed task, hide wrapper with same id
        mappedTaskArray.forEach(el => {
            console.log(projInArray.hide)
            var wrapper = document.getElementById(el.title + " " + el.project);
            var hideButton = document.getElementById(`${el.project}-hide`)
            if (document.contains(wrapper)) {
                wrapper.remove();
                hideButton.innerText = 'show completed'
            } else if (!document.contains(wrapper)) {
                dom.completedTemplate(el.project, el)
                hideButton.innerText = 'hide completed'
            }
        })
        if (projInArray.hide == false) {
            projInArray.hide = true;
        } else if (projInArray.hide == true) {
            projInArray.hide = false;
        }
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

export default dom