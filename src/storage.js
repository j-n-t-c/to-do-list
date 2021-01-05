import tasks from './tasks.js'
import projects from './projects.js'

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

export default storage