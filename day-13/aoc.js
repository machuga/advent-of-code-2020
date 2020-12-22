const { readFileSync } = require('fs');

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)
const filter = (callback) => (arr) => arr.filter(callback);
const map = (callback) => (arr) => arr.map(callback);
const split = (char) => (str) => str.split(char);
const tap = (str) => (value) => {
  console.log(str, value);
  return value;
}

const rawInput = readFileSync(0).toString();

const MIN_VAL = 1e14; // 100_000_000_000_000;
const BLANK_CHAR = 'x';

const part1 = () => {
  const [ timestamp, ids ] = pipe(
    split('\n'),
    ([timestampStr, idStr]) => [
      parseInt(timestampStr, 10),
      pipe(
        split(','),
        filter(value => value !== BLANK_CHAR),
        map(value => parseInt(value, 10))
      )(idStr)
    ]
  )(rawInput);

  const maxValues = ids.map(id => {
    const divider = Math.ceil(timestamp / id);

    return ({ id, nearest: id * divider });
  })


  maxValues.sort((a,b) => (a.nearest < b.nearest) ? -1 : 1 )

  const { id, nearest } = maxValues[0];

  console.log("Part 1: ", nearest, id, (nearest - timestamp) * id);
}


const part2 = () => {
  const ids = pipe(
    split('\n'),
    ([timestampStr, idStr]) =>
      pipe(
        split(','),
        map(value => value === BLANK_CHAR ? 1 : parseInt(value, 10))
      )(idStr)
  )(rawInput);

  const gcd = (a, b) => !b ? a : gcd(b, a % b);
  const lcm = (a, b) => a === 0 || b === 0 ? 0 : Math.abs((a * b) / gcd(a, b));

  const findEarliestConsecutiveTimestamp = (ids) => {
    let timestamp = 0;
    let step = ids[0];

    ids.forEach((busId, i) => {
      if (busId !== 1 && busId !== step) {
        while ((timestamp + i) % busId !== 0) {
          timestamp += step;
        }

        step = lcm(step, busId);
      }
    });

    return timestamp;
  };

  const earliestTimestamp = findEarliestConsecutiveTimestamp(ids);

  console.log("Part 2:", earliestTimestamp);
}

part1();
part2();
