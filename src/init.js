import * as Utils from "./util.js";

function init() {

const submitTask = document.getElementById('submit');

//populate with example tasks
const task1 = Utils.createTask({title: 'test 1', description: 'testing testing', dueDate: 'October 25th'})
const task2 = Utils.createTask({title: 'test 2', description: 'hey hey hey hey', dueDate: '12/15/2020'})
Utils.taskArray.push(task1);
Utils.taskArray.push(task2);


Utils.showTasks();
//put tasks in div
// publishTasks();

function submitAndUpdate() {
    Utils.clear(Utils.taskDisplay);
    Utils.pushTask(Utils.createTask(Utils.getObject()));
    Utils.updateStorage();
    Utils.showTasks();
    console.log(Utils.storage);
    console.log(Utils.taskArray);

}
submitTask.addEventListener('click', submitAndUpdate, false);

submitAndUpdate();
console.log('storage');
console.log(Utils.storage);
console.log('array');
console.log(Utils.taskArray);


}
export default init;
