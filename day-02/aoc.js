const { readFileSync } = require('fs');
const inputList = readFileSync(0).toString().split('\n').filter(Boolean).map(line => line.trim()); // STDIN_FILENO = 0

const REGEX = /(?<min>\d+)-(?<max>\d+)\s(?<letter>[a-z]):\s(?<password>[a-zA-Z0-9]+)/;

const isMatch = (line) => {
  const matches = line.match(REGEX) || { groups: {} };
  const { min, max, letter, password } = matches.groups;

  if (!min && !max && !letter && !password) {
    return false;
  }

  const count = (password.match(new RegExp(`${letter}`, 'g')) || []).length;

  return count >= min && count <= max;
}

const isInExactPosition = (line) => {
  const matches = line.match(REGEX) || { groups: {} };
  const { min, max, letter, password } = matches.groups;

  if (!min && !max && !letter && !password) {
    return false;
  }

  const firstIndex = parseInt(min, 10) - 1;
  const secondIndex = parseInt(max, 10) - 1;

  const inPosition = [password[firstIndex] === letter, password[secondIndex] === letter].filter(Boolean);

  return inPosition.length === 1;
}

console.log("Number of matches: ", inputList.filter(isMatch).length);
console.log("Number with exact positions: ", inputList.filter(isInExactPosition).length);
