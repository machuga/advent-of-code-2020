const { readFileSync } = require('fs');

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)
const map = (callback) => (arr) => arr.map(callback);
const reduce = (callback, init) => (arr) => arr.reduce(callback, init);
const split = (char) => (str) => str.split(char);
const tap = (str) => (value) => {
  console.log(str, value);
  return value;
}

const until = (maxNumber) => (startingNumbers = []) => {
  const upperLimit = maxNumber - 1;
  const storage = new Map();
  let turn = 1;
  let lastNumber;
  let currentNumber;

  // Initialize data structure
  startingNumbers.forEach((number, index) => {
    storage.set(number, turn);
    lastNumber = number;
    turn += 1;
  });


  while (turn <= maxNumber) {
    if (storage.has(lastNumber)) {
      currentNumber = turn - 1 - storage.get(lastNumber);
    } else {
      currentNumber = 0;
    }

    storage.set(lastNumber, turn - 1);
    lastNumber = currentNumber;
    turn += 1;
  }

  return lastNumber;
}

const turns = pipe(
  split(','),
  map(num => parseInt(num, 10)),
)(readFileSync(0).toString());

const part1 = () => {
  pipe(
    tap("Part 1: "),
    until(2020),
    (lastNumber) => { console.log("The final turn was", lastNumber) }
  )(turns);
}

const part2 = () => {
  pipe(
    tap("Part 2: "),
    until(30_000_000),
    (lastNumber) => { console.log("The final turn was", lastNumber) }
  )(turns);
}

part1();
part2();
