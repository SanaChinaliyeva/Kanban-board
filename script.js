var saveToStorage = function (data, key) {
  var dataString = JSON.stringify(data);
  localStorage.setItem(key, dataString);
};

var getFromStorage = function (key) {
  var dataString = localStorage.getItem(key);
  return JSON.parse(dataString);
};

var deleteFromList = function (task, list) {
  for (var i in list) {
    var currentTask = list[i];
    if (tasksAreEqual(currentTask, task)){
      list.splice(i, 1);
    }
  }
};

var tasksAreEqual = function (task1, task2) {
  var task1Str = JSON.stringify(task1);
  var task2Str = JSON.stringify(task2);
  return task1Str === task2Str;
};

var createCard = function (task, list) {
  var card = $("<div class = \"card\">"),
  cardBody = $("<div class=\"card-body\">"),
  cardHeader = $("<div class=\"d-flex justify-content-between align-items-start\">"),
  cardText = $("<p class=\"card-text\">").text(task.message),
  btnRemove = $("<button type='button' id='remove' class='btn btn-outline-danger'>").text("x"),
  btnNext = $("<button type='button' id='next' class='btn btn-outline-success'>").text("Progress =>");

  cardHeader.append(cardText, btnRemove);
  cardBody.append(cardHeader, btnNext);
  card.append(cardBody)

  list.append(card);

  btnRemove.on("click", function(e) {
    e.preventDefault();
    card.remove();
    if (task.status === "todo") {
      deleteFromList(task, todoList);
      saveToStorage(todoList, "todo");
    } else if (task.status === "progress") {
      deleteFromList(task, progressList);
      saveToStorage(progressList, "progress");
    } else  {
      deleteFromList(task, doneList);
      saveToStorage(doneList, "done");
    }
  });

  btnNext.on("click", function (e) {
    e.preventDefault();
    if (task.status === "todo") {
      card.detach();
      deleteFromList(task, todoList);
      saveToStorage(todoList, "todo");
      progressContainer.append(card);
      task.status = "progress";
      btnNext.text("Done =>");
      progressList.push(task);
      saveToStorage(progressList, "progress");
    } else if (task.status === "progress") {
      card.detach();
      deleteFromList(task, progressList);
      saveToStorage(progressList, "progress");
      doneContainer.append(card);
      task.status = "done";
      btnNext.text("Delete =>");
      doneList.push(task);
      saveToStorage(doneList, "done");
    } else {
      card.remove();
      deleteFromList(task, doneList);      
      saveToStorage(doneList, "done");
    }
  });
};

var btnAdd = $("#add-btn"),
todoContainer = $("#todo"),
progressContainer = $("#progress"),
doneContainer = $("#done");

var todoList = getFromStorage("todo") || [],
progressList = getFromStorage("progress") || [],
doneList = getFromStorage("done") || [];  
saveToStorage(todoList, "todo");
saveToStorage(progressList, "progress");
saveToStorage(doneList, "done");

btnAdd.on("click", function () {
  var taskMsg = $("#task-msg").val();
  $("#task-msg").val("");
  var task = {
    message: taskMsg,
    status: "todo"
  };
  createCard(task, todoContainer);
  todoList.push(task);
  saveToStorage(todoList, "todo");
});

$(function() {
  var todoArr = getFromStorage("todo");
  for (var i of todoArr) {
    var task = i;
    createCard(task, todoContainer);
  }
  var progressArr = getFromStorage("progress");
  for (var i of progressArr) {
    var task = i;
    createCard(task, progressContainer);
  }
  var doneArr = getFromStorage("done");
  for (var i of doneArr) {
    var task = i;
    createCard(task, doneContainer);
  }
});  
