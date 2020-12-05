const { readFileSync } = require('fs');
const inputList = readFileSync(0).toString().split('\n').filter(Boolean).map(num => parseInt(num, 10)); // STDIN_FILENO = 0

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

const findTripleWithSumNaive = (list, sum) => {
  const [head, ...rest] = list;

  if (head === undefined) {
    return [];
  }

  const [second = undefined, third = undefined] = findPairWithSumNaive(rest, sum - head);

  if (second === undefined) {
    return findTripleWithSumNaive(rest, sum);
  } else {
    return [head, second, third];
  }
};

const matchingPair = findPairWithSumNaive(inputList, 2020);
const matchingTriple = findTripleWithSumNaive(inputList, 2020);

console.log(`Matching Pair: ${matchingPair}`);
console.log(`Matching Triple: ${matchingTriple}`);
console.log(`Pair Value Multiplied ${matchingPair.reduce((acc, e) => acc * e, 1)}`);
console.log(`Triple Value Multiplied ${matchingTriple.reduce((acc, e) => acc * e, 1)}`);
