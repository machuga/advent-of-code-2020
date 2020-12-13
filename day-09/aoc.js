const { readFileSync } = require('fs');

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)
const filter = (callback) => (arr) => arr.filter(callback);
const map = (callback) => (arr) => arr.map(callback);
const split = (char) => (str) => str.split(char);
const preambleLength = parseInt(process.argv[2] || 25, 10);

const input = pipe(
  split('\n'),
  map(line => parseInt(line.trim(), 10)),
  filter((num) => !isNaN(num)),
)(readFileSync(0).toString());

let pointer = preambleLength;
let min = pointer - preambleLength;

const selectValidNumbers = (min, max, arr) => arr.slice(min, max);

const findPairWithSumNaive = (list, sum) => {
  const [head, ...rest] = list;

  if (head === undefined) {
    return [];
  }

  const match = rest.find(el => head + el === sum)

  if (match === undefined) {
    return findPairWithSumNaive(rest, sum);
  } else {
    return [head, match];
  }
};

const findEntryMissingPair = (list) => {
  while (pointer < input.length - 1) {
    const preamble = selectValidNumbers(min, pointer, input);
    const pair = findPairWithSumNaive(preamble, input[pointer]);

    if (pair.length === 0) {
      return { entry: input[pointer], index: pointer };
    }

    pointer += 1;
    min += 1;
  }

  return false;
}

const sum = list => list.reduce((acc, e) => acc += e, 0);
const findContiguousSubarrayFor = (list, { index, entry }) => {
  let currentPointer = 0;
  let total = 0;
  let currentBuffer = [];

  while (total <= entry) {
    currentBuffer.push(list[currentPointer]);
    total = sum(currentBuffer);

    while (total > entry) {
      total = total - currentBuffer.shift();
    }

    if (total === entry) {
      return currentBuffer;
    }

    currentPointer += 1;
  }
}

const entry = findEntryMissingPair(input);
const subarray = findContiguousSubarrayFor(input, entry);
const weakness = Math.min(...subarray) + Math.max(...subarray);
console.log("Part 1: Could not find a pair for input", entry);
console.log("Part 2: Contiguous subarray for input:", subarray, weakness);
console.log("Done!");
