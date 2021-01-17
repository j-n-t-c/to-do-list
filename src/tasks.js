import dom from './dom.js'
import projects from './projects.js'
import storage from './storage.js'

var tasks = {
    init: function () {

        this.array = [];
        storage.init();
        this.hideCompleted = false;
        
        //checking for storage
        if (localStorage.tasks !== undefined) {
            this.array = storage.taskArray;
        } else {

            this.pushTask(this.createTask({title: 'task name', dueDate: 'due date', priority: 'priority', 
            notes: 'task notes', project: 'welcome!'}));

            this.pushTask(this.createTask({title: 'getting started', dueDate: dom.getDate(), priority: 'urgent', 
            notes: 'click me! ------------->&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp click the arrows to see task notes', project: 'how to'}));

            this.pushTask(this.createTask({title: 'add things', dueDate: dom.getDate(), priority: 'high', 
            notes: 'click +project or +task to add new tasks and projects to your To Do list', project: 'how to'}));

            this.pushTask(this.createTask({title: 'delete things', dueDate: dom.getDate(), priority: 'medium', 
            notes: 'click the  \' x \'  next to a project or task to delete. careful! deleting a project will delete all tasks in that project.', project: 'how to'}));

            this.pushTask(this.createTask({title: 'completed tasks', dueDate: dom.getDate(), priority: 'low', 
            notes: 'click the box on the right to mark tasks as completed. you can choose to show or hide the completed tasks in each project', project: 'how to'}));

            storage.setTaskStorage();
            storage.setTaskArray();
        } 
    },

    getObject: function () {
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
        dom.priorityColor();
      } else {
          dom.taskWarning();
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
                projects.checkEmpties()
                var projInArray = projects.objArray.find(proj => proj.name == item.project)
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

    removeTasksInProject: function (item) {    
        storage.taskArray = storage.taskArray.filter(task => task.project !== item)
    }
}

export default tasks