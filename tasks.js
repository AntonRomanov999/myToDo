let tasks = JSON.parse(localStorage.getItem('TODO')) ? JSON.parse(localStorage.getItem('TODO')) : [];

class Task {
    constructor(name, startDate, group, deadline, state, fullinfo) {
      this.name = name;
      this.group = group || 'Default list';
      this.state = state || 'Planned...';
      this.startDate = startDate;
      this.deadline = deadline;
      this.fullinfo = fullinfo || 'close';
    }
    static addNewTask(name, group) {
      if (name) {
        const date = new Date().toISOString().slice(0, 10);
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

export { Task, saveTasks, tasks }
