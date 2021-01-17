(()=>{"use strict";const e={init:function(){this.serializer(),void 0!==localStorage.tasks?(this.setTaskArray(),this.setProjectArray()):(this.taskArray=[],this.projectArray=[])},serializer:function(){Storage.prototype.setObj=function(e,t){return this.setItem(e,JSON.stringify(t))},Storage.prototype.getObj=function(e){return JSON.parse(this.getItem(e))}},setTaskStorage:function(){localStorage.setObj("tasks",n.array)},setProjectStorage:function(){localStorage.setObj("projects",t.array)},setTaskArray:function(){this.taskArray=localStorage.getObj("tasks")},setProjectArray:function(){this.projectArray=localStorage.getObj("projects")},clear:function(){window.localStorage.clear(),this.taskArray=[],this.projectArray=[]}},t={init:function(){this.array=[],this.createProjectsArray(),this.objArray=[],void 0!==localStorage.projects?this.array=e.projectArray:(this.pushProject("welcome!"),this.pushProject("how to"),this.pushProject("new project"),e.setProjectStorage(),e.setProjectArray())},createProjectsArray:function(){Array.from(document.querySelectorAll(".project-title")).forEach((e=>{this.array.push(e.getAttribute("data-name"))}))},createObjArray:function(){this.objArray=[],this.array.forEach((e=>{this.objArray.push({name:e,hide:!1})}))},submitAndUpdate:function(){var t=i.newProject.value;this.nameCheck(t)?i.projectWarning():(i.projectTemplate(t),this.pushProject(t),e.setProjectStorage(),e.setProjectArray(),i.updateProjectSelect(),i.cacheDom(),this.checkEmpties(),this.checkDeleted())},checkEmpties:function(){e.projectArray.forEach((e=>{this.taskInProject(e)||this.hasEmptyMsg(e)||i.emptyTemplate(e)}))},checkDeleted:function(){var t=document.getElementById("alld");0==e.projectArray.length?i.allDeleted():document.body.contains(t)&&t.remove()},loadProjects:function(){e.projectArray.forEach((e=>{i.projectTemplate(e)})),this.checkEmpties(),this.checkDeleted(),this.createObjArray()},taskInProject:function(t){return e.taskArray.some((e=>e.project==t))},hasEmptyMsg:function(e){return document.getElementById("project-"+e).nextElementSibling.id.includes("empty")},nameCheck:function(t){return e.projectArray.some((e=>e==t))},pushProject:function(e){this.array.push(e),this.createObjArray()},matchProjects:function(t){e.projectArray.forEach((a=>{t=="project-"+a&&(n.removeTasksInProject(a),n.array=e.taskArray,e.setTaskStorage(),e.projectArray.splice(e.projectArray.indexOf(a),1),i.removeElementById(t),this.array=e.projectArray,e.setProjectStorage(),i.updateProjectSelect(),i.cacheDom(),this.checkEmpties(),this.checkDeleted(),this.createObjArray())}))}},n={init:function(){this.array=[],e.init(),this.hideCompleted=!1,void 0!==localStorage.tasks?this.array=e.taskArray:(this.pushTask(this.createTask({title:"task name",dueDate:"due date",priority:"priority",notes:"task notes",project:"welcome!"})),this.pushTask(this.createTask({title:"getting started",dueDate:i.getDate(),priority:"urgent",notes:"click me! -------------\x3e&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp click the arrows to see task notes",project:"how to"})),this.pushTask(this.createTask({title:"add things",dueDate:i.getDate(),priority:"high",notes:"click +project or +task to add new tasks and projects to your To Do list",project:"how to"})),this.pushTask(this.createTask({title:"delete things",dueDate:i.getDate(),priority:"medium",notes:"click the  ' x '  next to a project or task to delete. careful! deleting a project will delete all tasks in that project.",project:"how to"})),this.pushTask(this.createTask({title:"completed tasks",dueDate:i.getDate(),priority:"low",notes:"click the box on the right to mark tasks as completed. you can choose to show or hide the completed tasks in each project",project:"how to"})),e.setTaskStorage(),e.setTaskArray())},getObject:function(){return{title:i.title.value,dueDate:i.dueDate.value,priority:i.priority.value,notes:i.notes.value,project:i.projectSelect.value}},createTask:function({title:e,dueDate:t,priority:n,notes:a,project:i,completed:s}){return{title:e,dueDate:t,priority:n,notes:a,project:i,counter:this.array.length+1,completed:1==s}},titleCheck:function(t){return e.taskArray.some((e=>e.title==t.title&&e.project==t.project))},pushTask:function(e){this.array.push(e)},markComplete:function(e){e.completed=!0},submitAndUpdate:function(){var n=this.createTask(this.getObject());this.titleCheck(n)?i.taskWarning():(this.pushTask(n),this.clear(i.projectDisplay),e.setTaskStorage(),e.setTaskArray(),this.loadTasks(),i.cacheDom(),t.checkEmpties(),i.priorityColor())},matchTasks:function(n){e.taskArray.forEach((a=>{n==a.title+" "+a.project&&(e.taskArray.splice(e.taskArray.indexOf(a),1),this.clear(i.projectDisplay),this.array=e.taskArray,e.setTaskStorage(),this.loadTasks(),i.cacheDom(),t.checkEmpties(),1==t.objArray.find((e=>e.name==a.project)).hide&&i.hideCmpInProj(a.project))}))},clear:function(e){e.querySelectorAll("div.task-wrapper, div.completed-task-wrapper, div.empty-task-wrapper").forEach((e=>{e.remove()}))},loadTasks:function(){e.taskArray.forEach((e=>{var t=e.project;0==e.completed?i.taskTemplate(t,e):0==this.hideCompleted&&i.completedTemplate(t,e)}))},removeTasksInProject:function(t){e.taskArray=e.taskArray.filter((e=>e.project!==t))}};var a={cacheDom:function(){this.dateSet("input-duedate"),this.projectDisplay=document.getElementById("project-display"),this.newProjectWrapper=document.getElementById("new-project-wrapper"),this.newTaskWrapper=document.getElementById("new-task-wrapper"),this.submitButton=document.getElementById("submit"),this.submitNewProject=document.getElementById("submit-new-button"),this.projectPopup=document.getElementById("project-popup"),this.closeProjectPopup=document.getElementById("close-new-project-popup"),this.taskPopup=document.getElementById("task-popup"),this.closeTaskPopup=document.getElementById("close-new-task-popup"),this.projectSelect=document.getElementById("input-project"),this.title=document.getElementById("input-title"),this.description=document.getElementById("input-description"),this.dueDate=document.getElementById("input-duedate"),this.priority=document.getElementById("input-priority"),this.notes=document.getElementById("input-notes"),this.newProject=document.getElementById("input-new-project"),this.reset=document.getElementById("reset")},getDate(){var e=new Date,t=e.getDate(),n=e.getMonth()+1;return n<10&&(n="0"+n),t<10&&(t="0"+t),e.getFullYear()+"-"+n+"-"+t},dateSet:function(e){var t=new Date,n=t.getDate(),a=t.getMonth()+1;a<10&&(a="0"+a),n<10&&(n="0"+n);var i=t.getFullYear()+"-"+a+"-"+n;document.getElementById(e).value=i},addListeners:function(){this.submitNewProject.addEventListener("click",(function(){t.submitAndUpdate(),a.newProjectWrapper.style.display="none"})),this.submitButton.addEventListener("click",(function(){n.submitAndUpdate(),a.newTaskWrapper.style.display="none"})),this.projectPopup.addEventListener("click",(function(){a.newProjectWrapper.style.display="block"})),this.closeProjectPopup.addEventListener("click",(function(){a.newProjectWrapper.style.display="none"})),this.taskPopup.addEventListener("click",(function(){a.newTaskWrapper.style.display="block"})),this.closeTaskPopup.addEventListener("click",(function(){a.newTaskWrapper.style.display="none"})),this.reset.addEventListener("click",(function(){e.clear(),window.location.reload()}))},projectSelectTemplate:function(e){a.projectSelect.insertAdjacentHTML("beforeend",`<option id="${e}-select" value="${e}">${e}</option>`),this.projectSelectDynamic=document.getElementById("${project}-select")},updateProjectSelect:function(){a.projectSelect.replaceChildren(),e.projectArray.forEach((e=>{this.projectSelectTemplate(e)}))},expandNotes:function(e,t,n,a){var i=n.getAttribute("data-expanded"),s=document.getElementById(t.title+"-expand");"false"==i?(n.insertAdjacentHTML("afterend",`\n            <div class="expand-div" id="${t.title}-expand-div">\n            ${t.notes}\n            </div>\n            `),a.innerHTML="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp",n.setAttribute("data-expanded","true"),s.innerHTML='<i class="fas fa-chevron-up"></i>'):"true"==i&&(document.getElementById(t.title+"-expand-div").remove(),a.innerHTML=t.notes,n.setAttribute("data-expanded","false"),s.innerHTML='<i class="fas fa-chevron-down"></i>')},projectTemplate:function(n){a.projectDisplay.insertAdjacentHTML("beforeend",`\n\n            <div class="project-wrapper" id="project-${n}-wrappers">\n                <div class="project-header project-${n}" id="project-${n}" data-name="${n}">\n                    <div class="project-title-delete">\n                        <button class="pdelete" id="${n}-delete"><i class="fas fa-times"></i></button>\n                        <h2 class="project-h2">${n}</h2>\n                    </div>\n\n                    <div class="project-task-hide">\n                        <button class="project-add-task hvb" id="${n}-add-task">+ task</button>\n                        <button id="${n}-hide" class="hvb">hide completed</button>\n                    </div>\n                </div>\n\n                <div class="opentasks-header" id="project-${n}-opentasks"></div> \n                <div class="completed-header" id="project-${n}-completed"></div>\n\n            </div>\n\n            `);var i=document.getElementById(n+"-delete");i.addEventListener("click",(function(){var e=i.parentElement.parentElement.id;a.deleteWarning(e)})),document.getElementById(n+"-hide").addEventListener("click",(function(){var i=t.objArray.find((e=>e.name==n)),s=e.taskArray.filter((e=>e.project==n&&1==e.completed));s.length>0&&(0==i.hide?i.hide=!0:1==i.hide&&(i.hide=!1),a.hideCmpInProj(n)),s.forEach((e=>{var t=document.getElementById(e.title+"-expand-div");document.contains(t)&&t.remove()}))})),document.getElementById(n+"-add-task").addEventListener("click",(function(){a.lTaskInput(n)}))},taskTemplate:function(i,s){document.getElementById(`project-${i}-opentasks`).insertAdjacentHTML("beforeend",`\n            <div class="task-wrapper" data-expanded="false" id="${s.title+" "+i}" data-project="${i}">\n\n                <button class="tdelete" id="${s.title}-task-delete"><i class="fas fa-times tdbx"></i></button>\n\n                <div class="task-primary">\n                    <div class="task-title">${s.title}</div>\n                </div>\n\n                <div class="notes-wrap" id="${s.title}-notes-wrap">\n                    <div class="task-notes" id="${s.title}-task-notes">${s.notes}</div>\n                </div>\n\n                <div class="task-date-priority">\n                    <div class="task-duedate"><i class="far fa-calendar-alt"></i>${s.dueDate}</div>\n                    <div class="task-priority" id="${s.title}-priority"><i class="fas fa-exclamation-circle"></i></i><span class="pr">${s.priority}</span></div>\n                </div>\n\n                <div class="checkbox-div">\n                    <input type="checkbox" class="taskcheck" id="${s.title+" "+s.project}-check" \n                    data-forcheck="${s.title+" "+s.project}" name="completed">\n                </div>\n\n            </div>\n            `);var r=document.getElementById(s.title+"-task-delete");r.addEventListener("click",(function(){n.matchTasks(r.parentElement.id)})),document.getElementById(s.title+" "+s.project+"-check").addEventListener("change",(function(){e.taskArray.forEach((e=>{this.getAttribute("data-forcheck")==e.title+" "+e.project&&(e.completed=!0)})),n.array=e.taskArray,e.setTaskStorage(),n.clear(a.projectDisplay),n.loadTasks(),a.priorityColor(),t.checkEmpties(),t.objArray.forEach((e=>{1==e.hide&&a.hideCmpInProj(e.name)})),e.taskArray.forEach((e=>{var t=document.getElementById(e.title+"-expand-div");document.contains(t)&&t.remove()}))})),this.nWrap=document.getElementById(s.title+"-notes-wrap"),this.nText=document.getElementById(s.title+"-task-notes"),this.taskWrapper=document.getElementById(s.title+" "+i),this.nText.offsetWidth>.7*this.nWrap.offsetWidth&&(this.nText.style.overflow="hidden",this.nWrap.insertAdjacentHTML("beforeend",`<button class="expand-button" id="${s.title}-expand"><i class="fas fa-chevron-down"></i></button>`),document.getElementById(s.title+"-expand").addEventListener("click",(function(){parent=this.parentElement.parentElement;var e=document.getElementById(s.title+"-task-notes");a.expandNotes(i,s,parent,e)})))},completedTemplate:function(i,s){document.getElementById(`project-${i}-completed`).insertAdjacentHTML("beforeend",`\n            <div class="completed-task-wrapper" data-expanded="false" id="${s.title+" "+i}" data-project="${i}">\n\n                <button class="tdelete" id="${s.title}-task-delete"><i class="fas fa-times tdbx"></i></button>\n\n                <div class="task-primary">\n                    <div class="task-title">${s.title}</div>\n                </div>\n\n                <div class="notes-wrap" id="${s.title}-notes-wrap">\n                    <div class="task-notes" id="${s.title}-task-notes">${s.notes}</div>\n                </div>\n\n                <div class="task-date-priority">\n                    <div class="task-duedate"><i class="far fa-calendar-alt"></i>${s.dueDate}</div>\n                    <div class="task-priority" id="${s.title}-priority"><i class="fas fa-exclamation-circle"></i></i><span class="pr">${s.priority}</span></div>\n                </div>\n\n                <div class="checkbox-div">\n                    <input type="checkbox" class="taskcheck" id="${s.title+" "+s.project}-check" \n                    data-forcheck="${s.title+" "+s.project}" name="completed" checked>\n                </div>\n            </div>\n            `);var r=document.getElementById(s.title+"-task-delete");r.addEventListener("click",(function(){n.matchTasks(r.parentElement.id)})),document.getElementById(s.title+" "+s.project+"-check").addEventListener("change",(function(){n.array=e.taskArray,e.taskArray.forEach((e=>{this.getAttribute("data-forcheck")==e.title+" "+e.project&&(e.completed=!1)})),n.array=e.taskArray,e.setTaskStorage(),n.clear(a.projectDisplay),n.loadTasks(),a.priorityColor(),t.checkEmpties(),t.objArray.forEach((e=>{1==e.hide&&a.hideCmpInProj(e.name)})),e.taskArray.forEach((e=>{var t=document.getElementById(e.title+"-expand-div");document.contains(t)&&t.remove()}))})),this.nWrap=document.getElementById(s.title+"-notes-wrap"),this.nText=document.getElementById(s.title+"-task-notes"),this.taskWrapper=document.getElementById(s.title+" "+i),this.nText.offsetWidth>.7*this.nWrap.offsetWidth&&(this.nText.style.overflow="hidden",this.nWrap.insertAdjacentHTML("beforeend",`<button class="expand-button" id="${s.title}-expand"><i class="fas fa-chevron-down"></i></button>`),document.getElementById(s.title+"-expand").addEventListener("click",(function(){parent=this.parentElement.parentElement;var e=document.getElementById(s.title+"-task-notes");a.expandNotes(i,s,parent,e)})))},emptyTemplate:function(e){document.getElementById("project-"+e).insertAdjacentHTML("afterend",`\n\n            <div class="empty-task-wrapper" id="empty-${e}">\n                <div>no tasks found for this project</div>\n            </div>\n            `)},allDeleted:function(e){document.getElementById("display-header").insertAdjacentHTML("afterend",'\n\n            <div id="alld" class="all-deleted" >\n                <div><h3>add a new project to start your To Do list</h3></div>\n            </div>\n            ')},lTaskInput:function(e){document.querySelector("body").insertAdjacentHTML("afterbegin",`\n\n            <div class="popup-wrapper" id="dynamic-task-${e}">\n                <div class="popup-inside">\n                    <div class="popup-header">\n                        <h2>add new task</h2>\n                    </div>\n\n                        <div id="input-form">\n                            <label for="dynamic-project" id="input-title-label">project</label>\n                            <input id="dynamic-project" class="input-dynamic" value="${e}" disabled></input>\n                    \n                            <input name="form" type="text" id="dynamic-title" maxlength="30" placeholder="enter title"></input>\n                            <input name="form" type="text" id="dynamic-notes" placeholder="enter notes"></input>\n\n                            <label for="dynamic-duedate" id="input-duedate-label">due date</label>\n                            <input name="duedate" type="date" id="dynamic-duedate"></input>\n                    \n                            <label for="dynamic-priority" id="input-priority-label">priority</label>\n                            <select name="priority" id="dynamic-priority">\n                                <option value="urgent">urgent</option>\n                                <option value="high">high</option>\n                                <option value="medium">medium</option>\n                                <option value="low">low</option>\n                            </select>\n                    \n                            <div class="popup-buttons">\n                                <button id="dynamic-submit" class="blackbutton">submit</button>\n                                <button id="close-new-task-popup" class="popclose"><i class="fas fa-window-close"></i></button>\n                            </div>\n                        \n                        </div>\n                </div>\n            </div>    \n\n        `),this.dateSet("dynamic-duedate");var t=document.getElementById("dynamic-task-"+e);t.style.display="flex",this.close=document.getElementById("close-new-task-popup"),this.close.addEventListener("click",(function(){t.style.display="none"})),this.submit=document.getElementById("dynamic-submit"),this.submit.addEventListener("click",(function(){n.submitAndUpdate(),t.style.display="none"})),this.projectSelect=document.getElementById("dynamic-project"),this.title=document.getElementById("dynamic-title"),this.notes=document.getElementById("dynamic-notes"),this.dueDate=document.getElementById("dynamic-duedate"),this.priority=document.getElementById("dynamic-priority")},deleteWarning:function(e){document.querySelector("body").insertAdjacentHTML("afterbegin",'\n\n            <div class="popup-wrapper" id="delete-warning">\n                <div class="popup-inside confirm">\n                    <div class="popup-header">\n                        <h2>delete project?</h2>\n                        <h5>this will delete all tasks in project</h5>\n                    </div>\n\n                    <div class="popup-buttons">\n                        <button id="confirm-delete" class="blackbutton">confirm</button>\n                        <button id="close-new-task-popup" class="blackbutton">cancel</button>\n                    </div>\n                </div>\n            </div>    \n\n        ');var n=document.getElementById("delete-warning");n.style.display="flex",this.confirm=document.getElementById("confirm-delete"),this.confirm.addEventListener("click",(function(){n.style.display="none",t.matchProjects(e)})),this.close=document.getElementById("close-new-task-popup"),this.close.addEventListener("click",(function(){return n.style.display="none",!1}))},projectWarning:function(){document.querySelector("body").insertAdjacentHTML("afterbegin",'\n\n            <div class="popup-wrapper" id="project-warning">\n                <div class="popup-inside confirm">\n                    <div class="popup-header">\n                        <h2>oops!</h2>\n                        <h5>you already have a project with that name...</h5>\n                    </div>\n\n                    <div class="popup-buttons">\n                        <button id="confirm-delete" class="blackbutton">try again</button>\n                    </div>\n                </div>\n            </div>    \n\n        ');var e=document.getElementById("project-warning");e.style.display="flex",this.confirm=document.getElementById("confirm-delete"),this.confirm.addEventListener("click",(function(){e.style.display="none",a.newProjectWrapper.style.display="none",a.newProjectWrapper.style.display="block",a.newProject.value=""}))},taskWarning:function(){document.querySelector("body").insertAdjacentHTML("afterbegin",'\n\n            <div class="popup-wrapper" id="task-warning">\n                <div class="popup-inside confirm">\n                    <div class="popup-header">\n                        <h2>oops!</h2>\n                        <h5>you already have a task with that name...</h5>\n                    </div>\n\n                    <div class="popup-buttons">\n                        <button id="confirm-delete" class="blackbutton">try again</button>\n                    </div>\n                </div>\n            </div>    \n\n        ');var e=document.getElementById("task-warning");e.style.display="flex",this.confirm=document.getElementById("confirm-delete"),this.confirm.addEventListener("click",(function(){e.style.display="none",a.newTaskWrapper.style.display="none",a.newTaskWrapper.style.display="block",this.title.value="",a.title.value=""}))},hideCmpInProj:function(t){var n=e.taskArray.filter((e=>e.project==t&&1==e.completed));n.length>0&&(n.forEach((e=>{var t=document.getElementById(e.title+" "+e.project),n=document.getElementById(e.project+"-hide");document.contains(t)?(t.remove(),n.innerText="show completed",n.style.backgroundColor="rgb(20 117 255)",n.style.color="white"):document.contains(t)||(a.completedTemplate(e.project,e),n.innerText="hide completed",n.style.backgroundColor="white",n.style.color="black")})),this.priorityColor())},removeElementById:function(e){document.getElementById(e).parentElement.remove()},priorityColor:function(){var n=t.objArray.filter((e=>1==e.hide)),a=[];n.forEach((e=>{a.push(e.name)})),e.taskArray.forEach((e=>{if(!a.includes(e.project)){var t=document.getElementById(e.title+"-priority");"urgent"==e.priority?t.style.color="red":"high"==e.priority?t.style.color="rgb(215, 80, 24)":"medium"==e.priority?t.style.color="rgb(213, 210, 120)":"low"==e.priority?t.style.color="rgb(130, 184, 37)":"priority"==e.priority&&(t.style.color="black;")}}))}};const i=a;i.cacheDom(),n.init(),t.init(),t.loadProjects(),n.loadTasks(),i.addListeners(),i.updateProjectSelect(),i.cacheDom(),i.priorityColor()})();