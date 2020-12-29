const { readFileSync } = require('fs');

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)
const map = (callback) => (arr) => arr.map(callback);
const reduce = (callback, init) => (arr) => arr.reduce(callback, init);
const filter = (callback) => (arr) => arr.filter(callback);
const split = (char) => (str) => str.split(char);
const tap = (str) => (value) => {
  console.log(str, value);
  return value;
}

const parseValue = (value) => parseInt(value, 10);

const inRange = (value) => ([min, max]) => value >= min && value <= max;

const isInvalid = (rules) => (value) => !rules.some((rule) => rule.ranges.some(inRange(value)));

const findInvalidTicketValues = (rules) => (ticketValues) => ticketValues.filter(isInvalid(rules))

// These are not compacted, which at small scale should be fine.
// Large scale may be an issue
const parseRule = pipe(
  split(': '),
  ([field, valueInput]) => pipe(
    split(' or '),
    map(pipe(
      split('-'),
      map(parseValue),
    )),
    (ranges) => ({ field, ranges })
  )(valueInput)
);

const parseRules = pipe(
  split('\n'),
  map(parseRule),
);

const parseTickets = pipe(
  split('\n'),
  ([field, ...values]) => values.filter((val) => val !== ''),
  map(pipe(
    split(','),
    map(parseValue),
  )),
);

const parseInput = ([rules, ownTicket, nearbyTickets]) => ({
  rules: parseRules(rules),
  ownTicket: parseTickets(ownTicket)[0],
  nearbyTickets: parseTickets(nearbyTickets),
});

const input = pipe(
  split('\n\n'),
  parseInput,
)(readFileSync(0).toString());

const part1 = () => {
  pipe(
    ({ rules, nearbyTickets }) => nearbyTickets.map(findInvalidTicketValues(rules)).flat(),
    reduce((acc, e) => acc + e, 0),
    tap("Part 1: "),
  )(input);
}

const part2 = () => {
  pipe(
    tap("Part 2: "),
  )(input);
}

part1();
//part2();
