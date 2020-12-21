const { readFileSync } = require('fs');

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)
const filter = (callback) => (arr) => arr.filter(callback);
const map = (callback) => (arr) => arr.map(callback);
const split = (char) => (str) => str.split(char);

const input = pipe(
  split('\n'),
  filter(x => x.length),
  map(line => [line.substring(0,1), parseInt(line.substring(1), 10)]),
)(readFileSync(0).toString());

const START_DIRECTION = 1; // direction * QUARTER
const QUARTER = 90;

const directionFromDegrees = (direction) => {
  switch (direction * QUARTER) {
    case 0: return 'N';
    case 90: return 'E';
    case 180: return 'S';
    case 270: return 'W';
  }
}

const directionFromQuarter = (direction) => {
  switch (direction) {
    case 0: return 'N';
    case 1: return 'E';
    case 2: return 'S';
    case 3: return 'W';
  }
}

const createNavigation = (x = 0, y = 0, direction = START_DIRECTION) => {
  const calculateDirection = (way, degrees) => {
    const value = (degrees / QUARTER);
    const signedValue = way === 'L' ? -value : value;

    return (direction + signedValue + 4) % 4;
  };

  const moveInDirection = {
    N: (steps) => { y -= steps },
    S: (steps) => { y += steps },
    W: (steps) => { x -= steps },
    E: (steps) => { x += steps },
    F: (steps) => { moveInDirection[directionFromDegrees(direction)](steps) },
    L: (degrees) => { direction = calculateDirection('L', degrees) },
    R: (degrees) => { direction = calculateDirection('R', degrees) },
  };

  const getState = () => ({ x, y, direction, directionReadable: directionFromDegrees(direction) });

  const move = (op, value) => {
    //console.log('----- START MOVE -----');
    //console.log("Starting state is", getState());
    //console.log("I am about to move", op, value);
    moveInDirection[op](value)
    //console.log("Current state is", getState());
    //console.log('----- END   MOVE -----\n\n');
  };

  return { move, getState };
}


const moveForPart1 = (orders) => {
  const navigation = createNavigation();

  orders.forEach(([op, value]) => {
    //console.log("I am going to do the following: ", op, value);
    navigation.move(op, value);
  })

  return navigation.getState();
};

const part1 = moveForPart1(input);

console.log(
"Part 1: ",
  part1.x,
  part1.x >= 0 ? 'east' : 'west',
  part1.y,
  part1.y >= 0 ? 'south' : 'north',
  'and facing',
  part1.directionReadable
);

console.log("Part 1: Manhattan distance: ", Math.abs(part1.x) + Math.abs(part1.y));
