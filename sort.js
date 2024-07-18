function sortTasks(value, num) {
    return value !== 'deadline'
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
  }
    
export { sortTasks }