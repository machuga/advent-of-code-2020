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
    moveInDirection[op](value);
  };

  return { move, getState };
};


const moveForPart1 = (orders) => {
  const navigation = createNavigation();

  orders.forEach(([op, value]) => {
    navigation.move(op, value);
  })

  return navigation.getState();
};

const createWaypointNavigation = (x = 0, y = 0) => {
  let waypointX = 10;
  let waypointY = -1

  const calculateDirection = (way) => (degrees) => {
    const signedDegrees = way === 'L' ? -degrees : degrees;
    // Found off internet - thanks!
    let angle = signedDegrees * Math.PI / 180;
    const dx = Math.round(waypointX * Math.cos(angle) - waypointY * Math.sin(angle));
    const dy = Math.round(waypointX * Math.sin(angle) + waypointY * Math.cos(angle));

    waypointX = dx;
    waypointY = dy;
  };

  const operations = {
    N: (steps) => { waypointY -= steps },
    S: (steps) => { waypointY += steps },
    W: (steps) => { waypointX -= steps },
    E: (steps) => { waypointX += steps },
    F: (steps) => {
      x = x + (waypointX * steps);
      y = y + (waypointY * steps);
    },
    L: calculateDirection('L'),
    R: calculateDirection('R'),
  };

  const getState = () => ({ x, y, waypointX, waypointY });

  const move = (op, value) => {
    operations[op](value);
  };

  return { move, getState };
};
const moveForPart2 = (orders) => {
  const navigation = createWaypointNavigation();

  orders.forEach(([op, value]) => {
    navigation.move(op, value);
  })

  return navigation.getState();
};

const part1 = moveForPart1(input);
const part2 = moveForPart2(input);

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

console.log(
"Part 2: ",
  part2.x,
  part2.x >= 0 ? 'east' : 'west',
  part2.y,
  part2.y >= 0 ? 'south' : 'north',
  'Waypoint:',
  part2.waypointX,
  part2.waypointX >= 0 ? 'east' : 'west',
  part2.waypointY,
  part2.waypointY >= 0 ? 'south' : 'north',
);

console.log("Part 2: Manhattan distance: ", Math.abs(part2.x) + Math.abs(part2.y));

