const { readFileSync } = require('fs');

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)
const filter = (callback) => (arr) => arr.filter(callback);
const map = (callback) => (arr) => arr.map(callback);
const reduce = (callback, init) => (arr) => arr.reduce(callback, init);
const split = (char) => (str) => str.split(char);
const slice = (start, end = undefined) => (arr) => arr.slice(start, end);
const tap = (str) => (value) => {
  console.log(str, value);
  return value;
}

/**
 *
 * If latest number has never occured before, next number is 0
 * If latest number
 *
 * { number, lastSaid }
 * turns: [0,3,6,0,4]
 *
 *
 */

const emptyTurns = [];
const calculateNextTurnFrom = (turnsNumberSaidOn) => pipe(
  ([secondMostRecent, mostRecent]) => mostRecent - secondMostRecent,
)(turnsNumberSaidOn)

const rotateMostRecentTurns = (turns, newTurn) => turns.length < 2 ? [...turns, newTurn] : [turns[turns.length - 1], newTurn];

const until = (maxNumber) => (startingTurns = []) => {
  const upperLimit = maxNumber - 1;
  const lookup = new Map();
  let lastTurn;
  let lastSaid = startingTurns[startingTurns.length - 1];
  let turn = startingTurns.length;

  // Initialize data structure
  startingTurns.forEach((number, index) => {
    lookup.set(number, [index + 1]);
  });

  while (turn <= upperLimit) {
    turn += 1;

    lastSaid = lookup.get(lastTurn) || emptyTurns;

    let nextTurn;

    if (lastSaid.length < 2) {
      nextTurn = 0;
    } else {
      nextTurn = calculateNextTurnFrom(lookup.get(lastTurn));
    }

    lookup.set(nextTurn, rotateMostRecentTurns(lookup.get(nextTurn) || emptyTurns, turn));
    lastTurn = nextTurn;
  }

  return lastTurn;
}

const turns = pipe(
  split(','),
  map(num => parseInt(num, 10)),
)(readFileSync(0).toString());

const part1 = () => {
  pipe(
    tap("Part 1: "),
    until(2020),
    (lastTurn) => { console.log("The final turn was", lastTurn) }
  )(turns);
}

const part2 = () => {
  pipe(
    tap("Part 2: "),
    until(30_000_000),
    (lastTurn) => { console.log("The final turn was", lastTurn) }
  )(turns);
}

part1();
part2();

