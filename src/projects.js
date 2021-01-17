import dom from './dom.js'
import tasks from './tasks.js'
import storage from './storage.js'

var projects = {

    init: function () {
        this.array = []; 
        this.createProjectsArray();
        this.objArray = [];

                //checking for storage
        if (localStorage.projects !== undefined) {
            this.array = storage.projectArray;
        } else {
            this.pushProject("welcome!");
            this.pushProject("how to");
            this.pushProject("new project");
            storage.setProjectStorage();
            storage.setProjectArray();
        } 
    },

    createProjectsArray: function () {
        var dataProjects = Array.from(document.querySelectorAll('.project-title'));
        dataProjects.forEach(el => {
            this.array.push(el.getAttribute('data-name'))
        })
    },

    createObjArray: function () {
        this.objArray = [];
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
            this.checkDeleted();
        } else {
            dom.projectWarning()
        }
    },
    
    checkEmpties: function () {
        storage.projectArray.forEach(element => {
            if (!this.taskInProject(element) && !this.hasEmptyMsg(element)) {
                dom.emptyTemplate(element)
            }
        })
    },

    checkDeleted: function () {
        var x = document.getElementById('alld')
            if (storage.projectArray.length==0) {
                dom.allDeleted()
            } else if (document.body.contains(x)) {
                x.remove();
            }
    },

    loadProjects: function () {
        storage.projectArray.forEach(element => {
            dom.projectTemplate(element)
        })
        this.checkEmpties();
        this.checkDeleted();
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
        this.createObjArray();
    },
    
    matchProjects: function (id) { 
        storage.projectArray.forEach(item => {
            if (id == `project-${item}`) {
                tasks.removeTasksInProject(item);
                tasks.array = storage.taskArray;
                storage.setTaskStorage();
                storage.projectArray.splice(storage.projectArray.indexOf(item), 1);
                dom.removeElementById(id)
                this.array = storage.projectArray;
                storage.setProjectStorage();
                dom.updateProjectSelect();
                dom.cacheDom();
                this.checkEmpties();
                this.checkDeleted();
                this.createObjArray();
             } 
        })
    }
}

export default projects