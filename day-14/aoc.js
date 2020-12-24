const { readFileSync } = require('fs');

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)
const filter = (callback) => (arr) => arr.filter(callback);
const map = (callback) => (arr) => arr.map(callback);
const reduce = (callback, init) => (arr) => arr.reduce(callback, init);
const split = (char) => (str) => str.split(char);
const tap = (str) => (value) => {
  console.log(str, value);
  return value;
}

const BITS = 36;
const memlineRegex = /mem\[(?<address>\d+)\] = (?<value>\d+)/;

const convertToBinaryString = (decimal) => decimal.toString(2).padStart(BITS, '0')
const convertToNumber = (binaryString) => parseInt(binaryString, 2);
const applyMask = (mask, num) => num.split('').map((bit, index) => mask[index] === 'X' ? bit : mask[index]).join('');

const extractAssignment = line => {
  const { address, value } = line && line.match(memlineRegex).groups || {};

  return { address: parseInt(address, 10), value: parseInt(value, 10) };
};

const readStep = (lines, index) => {
  const [maskLine, ...rest] = lines;
  const mask = maskLine.replace('mask = ','');
  let memLines = []

  return {
    mask,
    assignments: rest.map(extractAssignment)
  }
};

const partitionInstructionsByMask = (lines) => {
  const maskLines = lines.reduce((acc, e, i) => {
    if (e.startsWith('mask')) {
      acc.push(i);
    }

    return acc;
  }, []);

  return maskLines.map((index, i) => readStep(lines.slice(index, maskLines[i + 1])));
};

const partitionInput = pipe(
  split('\n'),
  filter(Boolean),
  partitionInstructionsByMask,
)(readFileSync(0).toString());

const part1 = () => {
  const input = pipe(
    reduce((addresses, { mask, assignments }) => {
      assignments.forEach(({ address, value }) => {
        addresses[address] = applyMask(mask, convertToBinaryString(value));
      });

      return addresses;
    }, { }),
    Object.values,
    reduce((sum, value) => sum + convertToNumber(value), 0),
    tap("Part 1: Sum of all memory addresses")
  )(partitionInput);
}

part1();
