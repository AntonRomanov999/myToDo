//pig latin
function pigIt(str) {
  const words = str.split(" ");
  const pigWords = words.map(
    (i) =>
      (i = i.match(/[.,:;!?]/g)
        ? i
        : i.replace(i.substring(0, 1), "") + i.substring(0, 1) + "ay")
  );
  return pigWords.join(" ");
}
//advanced pig latin
function translate(str) {
  const words = str.split(" ");
  const pigWords = words.map((i) => {
    const punct = /[.,:;!?]+/.test(i) ? i.substring(i.search(/[.,:;!?]+/)) : "";
    const firstcons = i.substring(i.search(/^[^aeiou]+/), i.search(/[aeiou]+/));
    const newWord = (i.replace(firstcons, "").replace(punct, "") + firstcons.toLowerCase() + "ay" + punct);
    if (!i[0].match(/[aeiou]+/i))
    return !i[0].match(/[A-Z]/) ? newWord
     : newWord.replace(newWord.substring(0, 1), newWord.substring(0, 1).toUpperCase())
    else return (i.replace(punct, "") + "way" + punct )
  });
  return pigWords.join(" ");
}
// console.log(translate("How! are you?"));
// Owhay areway ouyay?

//average age
function getAverageAge(list) {
  return Math.round( list.reduce((sum, i) => sum + i.age, 0) / list.length )
}
var list1 = [
  { firstName: 'Maria', lastName: 'Y.', country: 'Cyprus', continent: 'Europe', age: 33, language: 'Ruby' },
  { firstName: 'Victoria', lastName: 'T.', country: 'Puerto Rico', continent: 'Americas', age: 70, language: 'Python' },
];
//console.log(getAverageAge(list1))
//is ruby
function isRubyComing(list) {
  isRuby = (i) => i.language === 'Ruby';
  return list.some(isRuby)
}
//console.log(isRubyComing(list1))

//Counting Change Combinations
function countChange(money, coins) {
 const sCoins = coins.sort((a, b) => b - a)
 let n = 0;
 function takeMoney(m, c){
  for (let i = 0; i < c.length; i++) {
    if (m - c[i] === 0) n++;
    else if (c[i] <= m) {
      takeMoney(m - c[i], c.slice(i))
    }
   }
 }
 takeMoney(money, sCoins)
 return n
}
//console.log(countChange(10, [5,3,2])) //10-5-5 10-5-3-2 10-3-3-2-2 10-2-2-2-2-2
//
//add username
function addUsername(list) {
  const currentYear = new Date().getFullYear()
  list.forEach((i) => {
    i.username = i.firstName.toLowerCase() + i.lastName.toLowerCase().substring(0, 1) + (currentYear - i.age);
  })

}
addUsername(list1)
//loop array
function loopArr(arr, direction, steps) {
  const seam = direction === "left" ? steps : arr.length - steps;
  return arr.slice(seam, arr.length).concat(arr.slice(0, seam));
}

// loopArr([1, 5, 87, 45, 8, 8], 'left', 2);
// should produce result: [87, 45, 8, 8, 1, 5]
console.log(loopArr([1, 5, 87, 45, 8, 8], 'left', 2));
console.log(loopArr([1, 5, 87, 45, 8, 8], 'right', 2)) //[8, 8, 1, 5, 87, 45]