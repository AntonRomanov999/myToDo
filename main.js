let tasks = JSON.parse(localStorage.getItem('TODO')) ? JSON.parse(localStorage.getItem('TODO')) : [];
const allTags = [];
let filterKey = 'group';
let filterValue = 0;

class Task {
  constructor(name, startDate, group, tags, endDate, state) {
    this.name = name;
    this.group = group || 'Default list';
    this.tags = [];
    this.state = state || 'Planned...';
    this.startDate = startDate;
    this.endDate = endDate;
  }
  static addNewTask(name, group) {
    if (name) {
      const date = new Date().toString();
      tasks.push(new Task(name, date, group));
      saveTasks()     
    } else throw 'Error: name for task needed!'
  }
  static delTask(task) {
    tasks = tasks.filter((i) => i !== task);
    saveTasks()
  }
  static renameTask(task, newname) {
    if (newname) {
      task.name = newname;
      saveTasks()
    } else throw 'Error: name for task needed!'
  }  
}

function saveTasks() {
  const tasksToSave = JSON.stringify(tasks);
  localStorage.setItem('TODO', tasksToSave);
}

//get tasks for render
function getTasks(key, value) {
  if (value === 0) {
    return tasks
  } else return tasks.filter((i) => i[key] === value);
}

//refresh tasks and lists display
function regenTasks() {
  frameTasks.innerHTML = "";
  frameLists.innerHTML = "";
  renderTasks();
  renderLists()
}

//sort tasks
function sortTasks(value, order) {
  const compareFn = (a, b) => {
    if (a[value] < b[value]) {
      return -1 * order;
    } else if (a[value] > b[value]) {
      return 1 * order;
    }
    return 0;
  };
  tasks.sort(compareFn);
}

function getGroups() {
  const allGroups = [];
  tasks.forEach((i) => {
    if (!allGroups.includes(i.group)) allGroups.push(i.group);
  });
  return allGroups.sort()
}

//modal dialog for creation new task
const addBtn = document.querySelector('.btn__add');
const dlgNewTask = document.querySelector('.add_new_task__dialog');
const dlgAddClose = document.getElementById("add");
addBtn.addEventListener("click", () => {
  dlgNewTask.showModal();
});
//variables for new task values
const newName = document.getElementById("input_name");
const newGroup = document.getElementById("input_group");
const newTag = document.getElementById("input_tag");
//button for creating new task
dlgAddClose.addEventListener("click", () => {
  Task.addNewTask(newName.value, newGroup.value, newTag.value);
  dlgNewTask.close();
  regenTasks();
});

//render tasks
const frameTasks = document.querySelector(".frame__tasks");
const taskTemplate = document.getElementById("task");

function renderTasks() {
  let tasksToRender = getTasks(filterKey, filterValue);
  for (let i = 0; i < tasksToRender.length; i++) {
    const clone = taskTemplate.content.cloneNode(true);
    let nameText = clone.querySelector(".task__name");
    nameText.textContent = `${tasksToRender[i].name}`;
    nameText.addEventListener("click", () => {
      Task.renameTask(tasksToRender[i], prompt());
      regenTasks()
    })
    let btnDel = clone.querySelector(".btn__del");
    btnDel.addEventListener("click", () => {
      Task.delTask(tasksToRender[i]);
      regenTasks()
    });
    let btnChangeState = clone.querySelector(".btn__change-state");
    if (tasksToRender[i].state === 'Done!') { 
      nameText.classList.add("task__name--done");
      btnChangeState.classList.add("btn--done"); 
    } else if (tasksToRender[i].state === 'In progress...') {
      btnChangeState.classList.add("btn--inprogress")       
    };
    btnChangeState.value = `${tasksToRender[i].state}`;
    btnChangeState.addEventListener("click", () => {
      if (tasksToRender[i].state === 'Planned...') {
        tasksToRender[i].state = 'In progress...';
      } else if (tasksToRender[i].state === 'In progress...') {
        tasksToRender[i].state = 'Done!';
        btnChangeState.classList.remove("btn--inprogress"); 
      } else if (tasksToRender[i].state === 'Done!') {
        nameText.classList.remove("task__name--done");
        btnChangeState.classList.remove("btn--done"); 
        tasksToRender[i].state = 'Planned...';
      }
      saveTasks();
      regenTasks();
    });
    frameTasks.appendChild(clone);
  }
}
//modal for rename task

//
renderTasks()

//sort
let order = 1;
function showSorted(value, btn) {   
  if (order === 1) {
    btn.textContent = `Sort by ${value} ↓`;
    sortTasks(value, order);
    regenTasks();
    order = -1;
  } else {
    btn.textContent = `Sort by ${value} ↑`;
    sortTasks(value, order);
    regenTasks();
    order = 1;
  }
}

const btnSortbyName = document.querySelector(".btn__sort-name");
btnSortbyName.addEventListener("click", () => {
  showSorted("name", btnSortbyName);
});

const btnSortbyState = document.querySelector('.btn__sort-state');
btnSortbyState.addEventListener("click", () => {   
  showSorted("state", btnSortbyState);
})

//render lists (groups)
const frameLists = document.querySelector(".frame__lists");
const listTemplate = document.getElementById("list");

function renderLists() {
  let listsToRender = getGroups();
  for (let i = 0; i < listsToRender.length; i++) {
    const clone = listTemplate.content.cloneNode(true);
    let btnList = clone.querySelector(".btn--filter");
    btnList.textContent = `${listsToRender[i]}`;
    if ((listsToRender[i] === filterValue)) {
      btnList.classList.add("active");
    } else {
      btnList.classList.remove("active");
    }
    btnList.addEventListener("click", () => {
      filterValue = `${listsToRender[i]}`;
      regenTasks();
    });
    frameLists.appendChild(clone);
  }
}

renderLists()

//show all tasks
const btnShowAll = document.querySelector(".btn__show-all");
btnShowAll.addEventListener("click", () => {
  filterValue = 0;
  regenTasks();
})
