const { readFileSync } = require('fs');

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)
const filter = (callback) => (arr) => arr.filter(callback);
const map = (callback) => (arr) => arr.map(callback);
const split = (char) => (str) => str.split(char);
const tap = (str) => (value) => {
  console.log(str, value);
  return value;
}

const IGNORE_CHAR = 'x';
const [ timestamp, ids ] = pipe(
  split('\n'),
  ([timestampStr, idStr]) => [
    parseInt(timestampStr, 10),
    pipe(
      split(','),
      filter(value => value !== IGNORE_CHAR),
      map(value => parseInt(value, 10))
    )(idStr)
  ]
)(readFileSync(0).toString());


const maxValues = ids.map(id => {
  const divider = Math.ceil(timestamp / id);

  return ({ id, nearest: id * divider });
})


maxValues.sort((a,b) => (a.nearest < b.nearest) ? -1 : 1 )

const { id, nearest } = maxValues[0];

console.log("Part 1: ", nearest, id, (nearest - timestamp) * id);
