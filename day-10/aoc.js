const { readFileSync } = require('fs');

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)
const filter = (callback) => (arr) => arr.filter(callback);
const map = (callback) => (arr) => arr.map(callback);
const split = (char) => (str) => str.split(char);
const preambleLength = parseInt(process.argv[2] || 25, 10);
const sort = (arr) => {
  arr.sort((a,b) => a < b ? -1 : 1);
  return arr;
};

const input = pipe(
  split('\n'),
  map(line => parseInt(line.trim(), 10)),
  filter(Boolean),
  sort
)(readFileSync(0).toString());


const findJoltDifferences = (input) => {
  const diffs = {
    1: [],
    2: [],
    3: [],
  };

  let currentJoltage = 0;
  let currentMax = currentJoltage + 3;

  input.forEach((nextJoltage, i) => {
    const diff = nextJoltage - currentJoltage;

    if (diff > 3) {
      throw new Error("Something went wrong", nextJoltage, i, currentJoltage);
    }

    diffs[diff].push(nextJoltage);

    currentJoltage = nextJoltage
  });

  return diffs;
};

const buildAdjList = input => {
  const adjList = input.reduce((acc, joltage, i) => {
    if (acc[joltage] === undefined) {
      acc[joltage] = [];
    }

    let next = i+1;
    while (input[next] - joltage <= 3) {
      acc[joltage].push(input[next]);
      next += 1;
    }

    return acc;
  }, {});

  return Object.keys(adjList).reduce((acc, key) => {
    acc.set(key, adjList[key.toString()]);

    return acc;
  }, new Map());
}

// Depth first cannot finish in a reasonable amount of time, need to do breadth first
const findJoltagePaths = (input, current, target, pathways) => {
  let pathCount = 0;

  if (current === lastNode) {
    return 1;
  }

  if (pathways.has(current.toString())) {
    return pathways.get(current.toString());
  }

  for (let node of input.get(current.toString())) {
    if (!pathways.has(node)) {
      pathCount += findJoltagePaths(input, node, target, pathways);
    }
  }

  pathways.set(current.toString(), pathCount);

  return pathCount;
};

const { 1: ones, 3: threes } = findJoltDifferences(input);
console.log("Part 1: Ones by threes", ones.length * (threes.length + 1));

const fullInput = [0, ...input, input[input.length - 1]+3];
const lastNode = fullInput[fullInput.length - 1];

console.log("Part 2: Distinct adapter paths bfs", findJoltagePaths(buildAdjList(fullInput), 0, lastNode, new Map()));
