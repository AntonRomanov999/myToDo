const frame = document.querySelector(".main__frame");
const template = document.getElementById("note");

//test
// let notes = ["first", "second", "third", "forth"];

// function renderNotes() {
//   for (let i = 0; i < notes.length; i++) {
//     const clone = template.content.cloneNode(true);
//     let par = clone.querySelector(".name");
//     par.textContent = `${notes[i]}`;
//     let btn = clone.querySelector(".delete");
//     btn.addEventListener("click", () => {
//       notes = notes.filter((element) => element !== notes[i]);
//       frame.innerHTML = "";
//       renderNotes();
//     });
//     frame.appendChild(clone);
//   }
// }

// renderNotes();