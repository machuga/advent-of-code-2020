const { readFileSync } = require('fs');

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)
const filter = (callback) => (arr) => arr.filter(callback);
const map = (callback) => (arr) => arr.map(callback);
const split = (char) => (str) => str.split(char);

const input = pipe(
  split('\n'),
  map(line => split('')(line.trim())),
  filter(x => x.length),
)(readFileSync(0).toString());

const OCCUPIED = '#';
const EMPTY = 'L';
const FLOOR = '.';

const direction = {
  NW: [-1, -1],
  N:  [ 0, -1],
  NE: [ 1, -1],
  W:  [-1,  0],
  E:  [ 1,  0],
  SW: [-1,  1],
  S:  [ 0,  1],
  SE: [ 1,  1],
};

const directions = Object.keys(direction);

const worldToString = (matrix) => matrix.map(row => row.join('')).join('\n');
const countOccupiedStates = (matrix) => matrix.flat().filter(c => c === OCCUPIED);

const maxRows = input.length - 1;
const maxCols = input[0].length - 1;

const searchForOccupiedInDirection = (matrix, currentRow, currentCol, direction, recurse = false) => {
  const [rowOffset, colOffset] = direction;
  const nextRow = currentRow + rowOffset;
  const nextCol = currentCol + colOffset;
  if (nextRow < 0 || nextCol < 0 || nextRow > maxRows || nextCol > maxCols) {
    return false;
  }

  if (matrix[nextRow][nextCol] === OCCUPIED) {
    return true;
  }

  if (matrix[nextRow][nextCol] === EMPTY) {
    return false;
  }

  if (recurse) {
    return searchForOccupiedInDirection(matrix, nextRow, nextCol, direction, recurse);
  }

  return false;
};

const findOccupiedNeighbors = (oldMap, currentRow, currentCol, recurse = false) =>
  directions
    .map(d =>
      searchForOccupiedInDirection(oldMap, currentRow, currentCol, direction[d], recurse)
    )
    .filter(Boolean)
    .length

const updateSeat = (state, occupiedNeighbors, comfort) => {
  switch (state) {
    case OCCUPIED: return occupiedNeighbors >= comfort ? EMPTY : OCCUPIED;
    case EMPTY: return occupiedNeighbors === 0 ? OCCUPIED : EMPTY;
    case FLOOR:
    default: return state;
  }
};

const updateMap = (oldMap, occupiedMax = 4, searchDirectionUntilMatch = false) => {
  let changes = 0;

  const newMap =  oldMap.map((row, rowIndex) => {
    return row.map((value, colIndex) => {
      const occupiedNeighbors = findOccupiedNeighbors(oldMap, rowIndex, colIndex, searchDirectionUntilMatch);

      const newValue = updateSeat(value, occupiedNeighbors, occupiedMax);

      if (newValue !== value) {
        changes += 1;
      }

      return newValue;
    });
  });

  return {
    newMap,
    changes
  };
}

const findSeatEqualibrium = (oldMap, occupiedMax, searchDirectionUntilMatch = false, evolutionCount = 0) => {
  let latestState = updateMap(oldMap, occupiedMax, searchDirectionUntilMatch);
  evolutionCount += 1;

  if (latestState.changes === 0) {
    return { ...latestState, evolutionCount };
  }

  return findSeatEqualibrium(latestState.newMap, occupiedMax, searchDirectionUntilMatch, evolutionCount);
}

const partOne = () => {
  const { newMap, changes, evolutionCount } = findSeatEqualibrium(input, 4);

  console.log("Part 1: Occupied seats: ", countOccupiedStates(newMap).length, evolutionCount);
}

const partTwo = () => {
  const { newMap, changes, evolutionCount } = findSeatEqualibrium(input, 5, true);

  console.log("Part 2: Occupied seats: ", countOccupiedStates(newMap).length, evolutionCount);
}

partOne();
partTwo();
