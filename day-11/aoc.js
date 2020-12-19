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

const OCCUPIED_MAX = 4;
const EMPTY_MAX = 8;
// Game of life simulator...but with seats!

const isOccupied = (row, col, matrix) => {
  const maxRows = matrix.length - 1;
  const maxCols = matrix[0].length - 1;

  if (row < 0 || col < 0 || row > maxRows || col > maxCols) {
    return false;
  }

  return matrix[row][col] === OCCUPIED;
};

const updateSeat = (state, occupiedNeighbors) => {
  switch (state) {
    case OCCUPIED: return occupiedNeighbors >= OCCUPIED_MAX ? EMPTY : OCCUPIED;
    case EMPTY: return occupiedNeighbors === 0 ? OCCUPIED : EMPTY;
    case FLOOR:
    default: return state;
  }
}

const findOccupiedNeighbors = (oldMap, currentRow, currentCol) =>
  [
    isOccupied(currentRow-1, currentCol-1, oldMap),
    isOccupied(currentRow-1, currentCol+0, oldMap),
    isOccupied(currentRow-1, currentCol+1, oldMap),
    isOccupied(currentRow+0, currentCol-1, oldMap),
    isOccupied(currentRow+0, currentCol+1, oldMap),
    isOccupied(currentRow+1, currentCol-1, oldMap),
    isOccupied(currentRow+1, currentCol+0, oldMap),
    isOccupied(currentRow+1, currentCol+1, oldMap),
  ].filter(Boolean).length;

const tick = (oldMap) => {
  let changes = 0;

  const newMap =  oldMap.map((row, rowIndex) => {
    return row.map((value, colIndex) => {
      const occupiedNeighbors = findOccupiedNeighbors(oldMap, rowIndex, colIndex);

      const newValue = updateSeat(value, occupiedNeighbors);

      if (newValue !== value) {
        changes += 1;
      }

      return newValue;
    });
  });

  return {
    newMap,
    changes
  }
};

const worldToString = (matrix) => matrix.map(row => row.join('')).join('\n');
const countOccupiedStates = (matrix) => matrix.flat().filter(c => c === OCCUPIED);

let latestState = { newMap: input, changes: 1 };
let count = 0;
while(latestState.changes !== 0) {
  latestState = tick(latestState.newMap);
  count += 1;
}

console.log("Part 1: Occupied seats: ", countOccupiedStates(latestState.newMap).length, count);

