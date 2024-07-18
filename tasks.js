import { saveTasks } from "./main.js";

let tasks = JSON.parse(localStorage.getItem('TODO')) ? JSON.parse(localStorage.getItem('TODO')) : [];

const filter = {
  key: "group",
  value: JSON.parse(localStorage.getItem("TODO_filter"))
    ? JSON.parse(localStorage.getItem("TODO_filter"))
    : "All tasks",
};

class Task {
    constructor(name, startDate, group, deadline, state, fullinfo) {
      this.name = name;
      this.group = group || 'Default list';
      this.state = state || 'Planned...';
      this.startDate = startDate;
      this.deadline = deadline;
      this.fullinfo = fullinfo || 'close';
    }
    static addNewTask(name, group, deadline) {
      if (name) {
        const date = new Date().toISOString().slice(0, 10);
        const enddate = deadline ? deadline : date;
        tasks.push(new Task(name, date, group, enddate));
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

function daysLeft(task) {
  const DAY_LENGTH_MSEC = 86400000;
  const currentDate = new Date().toISOString().slice(0, 10);
  const days = (Date.parse(task.deadline) - Date.parse(currentDate)) / DAY_LENGTH_MSEC;
  return days >= 0 ? `${days} day(s) left` : `${-days} day(s) overdue`;
}

export { Task, tasks, daysLeft }
