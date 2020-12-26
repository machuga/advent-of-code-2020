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
const binary = ['0', '1'];
const memlineRegex = /mem\[(?<address>\d+)\] = (?<value>\d+)/;

const convertToBinaryString = (decimal, bits = BITS) => decimal.toString(2).padStart(bits, '0')

const convertToNumber = (binaryString) => parseInt(binaryString, 2);

const applyMask = (mask, num) => num.split('').map((bit, index) => mask[index] === 'X' ? bit : mask[index]).join('');

const applyMaskToAll = (mask, address) => {
  const initialMasking = address.split('').map((bit, index) => mask[index] !== '0' ? mask[index] : bit).join('');

  const floaters = initialMasking.split('').reduce((acc, bit, index) => {
    if (bit === 'X') {
      acc.push(index);
    }

    return acc;
  }, []);

  if (floaters.length === 0) {
    return [initialMasking];
  }

  const floaterCount = Math.pow(2, floaters.length);

  const addresses = [];

  for (let i = 0; i < floaterCount; i++) {
    const binaryString = convertToBinaryString(i, floaters.length);
    const concreteAddress = initialMasking.split('');

    binaryString.split('').forEach((bit, index) => {
      concreteAddress[floaters[index]] = bit;
    });

    addresses.push(concreteAddress.join(''));
  }

  return addresses;
}

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
  pipe(
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

const part2 = () => {
  pipe(
    reduce((addresses, { mask, assignments }) => {
      assignments.forEach(({ address, value }) => {
        const maskedAddresses = applyMaskToAll(mask, convertToBinaryString(address));

        maskedAddresses.forEach((maskedAddress) => {
          addresses[maskedAddress] = value;
        });
      });

      return addresses;
    }, { }),
    Object.values,
    reduce((sum, value) => sum + value, 0),
    tap("Part 2: Sum of all memory addresses")
  )(partitionInput);
}

part1();
part2();

