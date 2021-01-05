
import dom from './dom.js'
import tasks from './tasks.js'
import projects from './projects.js'
import storage from './storage.js'


function init () {

//init
dom.cacheDom();
tasks.init();
projects.init();
projects.loadProjects()
tasks.loadTasks();
dom.addListeners();
dom.updateProjectSelect();
dom.cacheDom();
}

export default init;