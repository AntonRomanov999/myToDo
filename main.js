import { Task, saveTasks, tasks } from "./tasks.js";

//settings for display tasks
let filterKey = 'group';
let filterValue = 'All tasks';

//get tasks for render
function getTasks(key, value) {
  if (value === 'All tasks') {
    return tasks
  } else return tasks.filter((i) => i[key] === value);
}

//refresh tasks and lists display
function regenTasks() {
  frameTasks.innerHTML = "";
  frameLists.innerHTML = "";
  renderTasks();
  renderLists();
  renderInfo()
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
function groupList() {
  const groups = getGroups();
  dlgLists.innerHTML = "";
  groups.forEach((i) => {
    const item = document.createElement("option");
    item.value = i;
    dlgLists.prepend(item);
  })
}
addBtn.addEventListener("click", () => {
  dlgNewTask.showModal();
  groupList();
});
//variables for new task values
const dlgLists = document.getElementById("lists");
const newName = document.getElementById("input_name");
const newGroup = document.getElementById("input_group");
//button for creating new task
dlgAddClose.addEventListener("click", () => {
  Task.addNewTask(newName.value, newGroup.value);
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
    const nameText = clone.querySelector(".task__name");
    const startDate = tasksToRender[i].startDate.split('-').reverse().join('.');
    nameText.textContent = `${tasksToRender[i].name}`;
    nameText.addEventListener("focusout", () => {
      Task.renameTask(tasksToRender[i], nameText.textContent);
      regenTasks()
    })
    nameText.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        nameText.blur();
      }  
    })
    const btnDel = clone.querySelector(".btn__del");
    btnDel.addEventListener("click", () => {
      Task.delTask(tasksToRender[i]);
      regenTasks()
    });
    const btnChangeState = clone.querySelector(".btn__change-state");
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
      };
      saveTasks();
      regenTasks();
    });
    const startDateField = clone.querySelector(".task__start-date");
    startDateField.textContent = `${startDate}`;
    const finishDateField = clone.querySelector(".btn__fin-date");
    finishDateField.addEventListener("change", () => {
      tasksToRender[i].deadline = finishDateField.value;
      saveTasks();
    });
    finishDateField.value = `${tasksToRender[i].deadline}`;
    const btnShowInfo = clone.querySelector(".btn__show-info");
    const taskInfo = clone.querySelector(".task__info");
    btnShowInfo.addEventListener("click", () => {
      taskInfo.classList.toggle("show");
      btnShowInfo.classList.toggle("show");
    })
    frameTasks.appendChild(clone);
  }
}

renderTasks();

//sort tasks
function sortTasks(value, num) {
  const compareFn =
    value !== 'deadline'
      ? (a, b) => {
          if (a[value] < b[value]) {
            return -num;
          } else if (a[value] > b[value]) {
            return num;
          }
          return 0;
        }
      : (a, b) => {
          return ( Date.parse(a[value]) - Date.parse(b[value]) ) * num;
        };
  tasks.sort(compareFn);
}

let order = 1;

function showSorted(value, btn) {   
  if (order === 1) {
    btn.textContent = `Sort by ${value} ↑`;
    sortTasks(value, order);
    regenTasks();
    order = -1;
  } else {
    btn.textContent = `Sort by ${value} ↓`;
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

const btnSortbyDLine = document.querySelector('.btn__sort-dline');
btnSortbyDLine.addEventListener("click", () => {   
  showSorted("deadline", btnSortbyDLine);
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
  filterValue = 'All tasks';
  regenTasks();
})

//calculate days for task
function renderInfo() {
  const info = document.querySelector(".info");
  const tasksInfo = tasks.length !== 1 ? `${tasks.length} tasks` : `${tasks.length} task`;
  const unfinQ = tasks.length - getTasks('state', 'Done!').length;
  const groupsQ = getGroups().length;
  const groupsInfo = groupsQ !== 1 ? `${groupsQ} lists` : `${groupsQ} list`;
  info.children[0].textContent = `MyToDo: ${tasksInfo} in ${groupsInfo}, ${unfinQ} not done`;
  info.children[1].textContent = `${filterValue}`
}

renderInfo();
