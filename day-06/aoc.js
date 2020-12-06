const { readFileSync } = require('fs');
const input = readFileSync(0).toString();

const inputList = input.split('\n\n').map(group =>
  Array.from(new Set(
    group.split('\n').reduce((acc, person) =>
      acc.concat(person.split('').filter(Boolean))
      , []).filter(Boolean)
  ))
).filter(Boolean); // STDIN_FILENO = 0

console.log(inputList.reduce((acc, group) => acc + group.length, 0));
