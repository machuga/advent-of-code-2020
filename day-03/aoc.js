const { readFileSync } = require('fs');
const inputList = readFileSync(0).toString().split('\n').filter(Boolean).map(line => line.trim().split('')); // STDIN_FILENO = 0

const mapWidth = inputList[0].length;
const tree = '#';

const traverseMapNaive = (areaMap) => {
  let trees = 0;
  let x = 0;
  let y = 0;

  areaMap.forEach((line, y) => {
    if (y !== 0 && line[x % mapWidth] === tree) {
      trees += 1;
    }
    x += 3;
  });

  return trees;
}


const traverseMap = (areaMap, right = 3, down = 1) => {
  const mapHeight = areaMap.length;

  let trees = 0;
  let x = 0;
  let y = 0;

  while (y + down < mapHeight) {
    x += right;
    y += down;

    if (areaMap[y][x % mapWidth] === tree) {
      trees += 1;
    }
  }

  return trees;
}

const patterns = [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2]
];

const trees = patterns.map(([x,y]) => traverseMap(inputList, x, y));

trees.forEach((treeCount, i)=> {
  console.log(`For pattern ${patterns[i]}, I found ${treeCount} trees`);
});

console.log("Their product is", trees.reduce((acc, e) => acc * e, 1));
