const { readFileSync } = require('fs');
const input = readFileSync(0).toString();

const intersection = (setA, setB) => {
  console.log(setA, setB);
  const newSet = new Set()

  setB.forEach((el) => {
    if (setA.has(el)) {
      newSet.add(el)
    }
  });

  return newSet;
};

const inputListAny = input.split('\n\n').map(group =>
  Array.from(new Set(
    group.split('\n').reduce((acc, person) =>
      acc.concat(person.split('').filter(Boolean))
      , []).filter(Boolean)
  ))
).filter(Boolean);

const inputListAll = input.split('\n\n').filter(Boolean).map(group =>
  Array.from(
    group.split('\n').reduce((acc, person, i) => {
      const personSet = new Set(person.split('').filter(Boolean));

      if (i === 0) {
        return personSet;
      }

      return intersection(acc, personSet);
    } , new Set())
  )
);

console.log("For groups where anyone answered: ", inputListAny.reduce((acc, group) => acc + group.length, 0));
console.log("For groups where everyone answered: ", inputListAll.reduce((acc, group) => acc + group.length, 0));
