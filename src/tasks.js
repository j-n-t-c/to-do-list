import dom from './dom.js'
import projects from './projects.js'
import storage from './storage.js'

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
            this.pushTask(this.createTask({title: 'create a new task', notes: 'this is the first thing on your list!', dueDate: 'March 1', project: "my tasks"}));
            this.pushTask(this.createTask({title: 'test', description: 'test', project: "test"}));
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

export default tasks