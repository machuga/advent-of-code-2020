const { readFileSync } = require('fs');
const inputList = readFileSync(0).toString().split('\n').map(line => line.trim()).filter(Boolean); // STDIN_FILENO = 0

const partition = (lower, upper, firstChar, lastChar, chars) => {
  const [head, ...rest] = chars;

  if (head === undefined || lower === upper) {
    return lower;
  }

  const half = (upper + lower + 1) / 2;

  if (head === firstChar) {
    return partition(lower, half-1, firstChar, lastChar, rest);
  } else {
    return partition(half, upper, firstChar, lastChar, rest);
  }
};

const findRow = (rowChars) => {
  return partition(0, 127, 'F', 'B', rowChars);
};

const findCol = (colChars) => {
  return partition(0, 7, 'L', 'R', colChars);
};


const findSeat = (seatInfo) => {
  const [rowChars, colChars] = [seatInfo.substring(0, 7), seatInfo.substring(7)];
  const [row, col] = [findRow(rowChars), findCol(colChars)];
  const seatId = row * 8 + col;

  return [seatId, row, col];
}


const seatAssignments = inputList.map(findSeat);

seatAssignments.sort(([first], [second]) => {
  return first < second ? -1 : 1;
});

const seatIds = new Set(seatAssignments.map(([seatId]) => seatId));
const lowest = seatAssignments[0][0];
const highest = seatAssignments[seatAssignments.length - 1][0];
let missingSeats = [];

for (let i = lowest; i < highest; i++) {
  if (!seatIds.has(i)) {
    missingSeats.push(i);
  }
}

console.log("Highest seatID:", highest);
console.log("Missing ids", missingSeats);
