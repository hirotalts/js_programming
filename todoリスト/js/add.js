var taskList = new Array();
var taskId = 0;

function Task(id, task, date, important, done) {
  this.id = "task_" + id;
  this.task = task;
  this.date = date;
  this.important = important;
  this.done = done;
  this.save();
}

Task.prototype.update = function (done) {
  this.done = done;
  this.save();
}

Task.prototype.save = function () {
  var taskJSON = {
    "task": this.task,
    "date": this.date,
    "important": this.important,
    "done": this.done
  };
  var taskString = JSON.stringify(taskJSON);
  localStorage.setItem(this.id, taskString); // 　setItemは第二引数がいる。(this.id.taskString);だと動かないよ。
}

function init() {
  var today = new Date();
  var yyyy = today.getFullYear();
  var mm = ("00" + (today.getMonth() + 1)).slice(-2);
  var dd = ("00" + today.getDate()).slice(-2);
  document.getElementById("date").value = yyyy + "-" + mm + "-" + dd;
  taskId = localStorage.getItem("taskId");
  if (taskId == null) taskId = 0;
  loadTasks();
  showList();
}

function loadTasks() {
  taskList = [];
  for (var i = 0; i <= taskId; i++) {
    var taskString = localStorage.getItem("task_" + i);
    if (taskString != null) {
      var taskJSON = JSON.parse(taskString);
      taskList.push(new Task(i, taskJSON.task, taskJSON.date, taskJSON.important, taskJSON.done));
    }
  }
}

function showList() {
  document.getElementById("list").innerHTML = "";
  for (var i = 0; i < taskList.length; i++) {
    var tr = document.createElement("tr");
    var done = document.createElement("td");
    done.className = "td20";
    var checkbox = document.createElement("input");
    checkbox.id = "check_" + i;
    checkbox.type = "checkbox";
    checkbox.checked = taskList[i].done;
    checkbox.onchange = changeTask;
    done.appendChild(checkbox);
    tr.appendChild(done);
    var task = document.createElement("td");
    task.innerHTML = taskList[i].task;
    if (taskList[i].done) task.className = "done";
    tr.appendChild(task);
    var date = document.createElement("td");
    date.className = "td100 center";
    date.innerHTML = taskList[i].date;
    tr.appendChild(date);
    var important = document.createElement("td");
    important.className = "td40 center red";
    if (taskList[i].important) important.innerHTML = "重要";
    tr.appendChild(important);
    document.getElementById("list").appendChild(tr);
  }
}

function addTask() {
  var task = document.getElementById("task").value;
  var date = document.getElementById("date").value;
  var important = document.getElementById("important").checked;
  if (task != "") {
    taskId++;
    taskList.push(new Task(taskId, task, date, important, false));
    localStorage.setItem("taskId", taskId);
    showList();
  }
}

function changeTask(event) {
  var index = event.target.id.split("_")[1];
  taskList[index].update(event.target.checked);
  showList();
}

function deleteTasks() {
  if (confirm("完了したタスクを削除してもよろしいですか？")) {
    for (var i = 0; i < taskList.length; i++) {
      if (taskList[i].done) {
        localStorage.removeItem(taskList[i].id);
      }
    }
    loadTasks();
    showList();
  }
}