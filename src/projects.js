import dom from './dom.js'
import tasks from './tasks.js'
import storage from './storage.js'

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
        this.createObjArray();
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

export default projects