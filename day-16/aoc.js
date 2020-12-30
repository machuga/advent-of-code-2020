const { readFileSync } = require('fs');

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)
const map = (callback) => (arr) => arr.map(callback);
const reduce = (callback, init) => (arr) => arr.reduce(callback, init);
const filter = (callback) => (arr) => arr.filter(callback);
const split = (char) => (str) => str.split(char);
const startsWith = (char) => (str) => str.startsWith(char);
const tap = (str) => (value) => {
  console.log(str, value);
  return value;
}

const parseValue = (value) => parseInt(value, 10);

const inRange = (value) => ([min, max]) => value >= min && value <= max;

const isInvalid = (rules) => (value) => !rules.some((rule) => rule.ranges.some(inRange(value)));

const findInvalidTicketValues = (rules) => (ticketValues) => ticketValues.filter(isInvalid(rules))

const transpose = (tickets) => tickets[0].map((_, col) => tickets.map(row => row[col]) );

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
  const filterOnlyValidTickets = ({ rules, nearbyTickets }) =>
    nearbyTickets.filter((ticket) => findInvalidTicketValues(rules)(ticket).length === 0);

  const isInvalid = (rules) => (value) => !rules.some((rule) => rule.ranges.some(inRange(value)));

  pipe(
    ({ rules, ownTicket, nearbyTickets }) => {
      const findInvalidValues = findInvalidTicketValues(rules);
      const valueInOneOfTheRanges = (ranges) => (value) => ranges.some(inRange(value));
      const everyTicketValueInARange = (fieldRow, ranges) => fieldRow.every(valueInOneOfTheRanges(ranges));

      return pipe(
        map((fieldRow, rowIndex) =>
          rules.reduce((acc, { field, ranges }) => {
            if (everyTicketValueInARange(fieldRow, ranges)) {
              acc.push({ field, rowIndex, fieldRow: JSON.stringify(fieldRow) });
            }

            return acc;
          }, [])
        ),
        (arr) => arr.sort((a, b) => a < b ? -1 : 1),
        reduce((grouped, fieldRows)=> {
          const potentialFieldRows = fieldRows.filter(fieldRow => !grouped.has(fieldRow.field));

          if (potentialFieldRows.length === 1) {
            grouped.set(potentialFieldRows[0].field, potentialFieldRows[0].rowIndex);
          }

          return grouped;
        }, new Map()),
        (grouped) => pipe(
          Array.from,
          filter(startsWith('departure')),
          reduce((acc, key) => acc * ownTicket[grouped.get(key)], 1),
        )(grouped.keys())
      )(transpose(filterOnlyValidTickets({ nearbyTickets, rules })));
    },
    tap("Part 2: "),
  )(input);
}

part1();
part2();
