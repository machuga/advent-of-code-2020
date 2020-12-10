const { readFileSync } = require('fs');
const inputLines = readFileSync(0).toString().split('\n').filter(Boolean);

const trimExtra = (info) => info.substring(0, info.indexOf(' bag'));

const LEAF_TEXT = 'no other bags.';
const parseLine = (line) => {
  const [front, back] = line.split('contain').map(piece => piece.trim());
  const parentColor = trimExtra(front);
  const childrenPieces = back === LEAF_TEXT ? [] : back.split(', ').map(parseBagInfo);

  return {
    color: parentColor,
    children: childrenPieces
  };
};

const parseBagInfo = (bagInfoRaw) => {
  // Trim off 'bag(s)'
  const bagInfo = trimExtra(bagInfoRaw);
  const firstSpaceIndex = bagInfo.indexOf(' ');
  const quantity = parseInt(bagInfo.substring(0, firstSpaceIndex), 10);
  const color = bagInfo.substring(firstSpaceIndex).trim();

  return { color, quantity };
};

const set = inputLines.map(parseLine);
const adjList = new Map(set.map(bag => [bag.color, bag]));

const bagContains = (toColor) => (fromColor) => {
  const fromBag = adjList.get(fromColor);
  return fromBag.children.some(c =>
    c.color === toColor ||
    bagContains(toColor)(c.color)
  );
};

const numberOfBagsContaining = (color) => {
  return Array.from(adjList.keys()).filter(bagContains(color)).length;
};

const numberOfBagsContainedIn = (color) => {
  const bag = adjList.get(color);

  return bag.children.reduce((acc, c) => {
    return acc + c.quantity * (1 + numberOfBagsContainedIn(c.color))
  }, 0);
};

console.log("Part 1: Number of bags containing shiny gold", numberOfBagsContaining('shiny gold'));
console.log("Part 2: Number of bags contained within shiny gold", numberOfBagsContainedIn('shiny gold'));
