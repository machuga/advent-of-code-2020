const { readFileSync } = require('fs');
const inputFile = readFileSync(0).toString().split('\n\n').filter(Boolean);

const passports = inputFile.map(passport => passport.split(/\s+/).filter(Boolean).map(kv => kv.split(':'))).filter(passport => Boolean(passport) && passport.length > 0);

const requiredFields = [
  'byr', // (Birth Year)
  'iyr', // (Issue Year)
  'eyr', // (Expiration Year)
  'hgt', // (Height)
  'hcl', // (Hair Color)
  'ecl', // (Eye Color)
  'pid', // (Passport ID)
];

const numConstraint = (min, max) => (value) => {
  const num = parseInt(value, 10);

  return !isNaN(num) && num >= min && num <= max;
}

const PID_REGEX = /^\d{9}$/;
const COLOR_REGEX = /^\#[a-f0-9]{6}$/;
const eyeColors = new Set(['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']);

const UNIT_REGEX = /(\d+)(cm|in)/;
const validations = {
  byr: numConstraint(1920, 2002),
  iyr: numConstraint(2010, 2020),
  eyr: numConstraint(2020, 2030),
  hgt: (value) => {
    const [full, num, unit] = (value.match(UNIT_REGEX) || []);

    switch (unit) {
      case 'cm': return numConstraint(150, 193)(num);
      case 'in': return numConstraint(59, 76)(num);
      default: return false;
    }
  },
  hcl: (value) => COLOR_REGEX.test(value),
  ecl: (value) => eyeColors.has(value),
  pid: (value) => PID_REGEX.test(value)
};

const requiredFieldsCount = requiredFields.length;

const requiredFieldIncluded = ([key]) => requiredFields.includes(key);
const isValidPassport = (passport, part = 2) => {
  if (passport.length < requiredFields) {
    return false;
  }

  const invalidFields = requiredFields.filter(field => {
    const [key, value] = passport.find(([key, value]) => field === key) || []

    if (key === undefined) {
      return true;
    }

    return part === 2 ? !validations[key](value) : false;
  });

  return invalidFields.length === 0;;
};

const validPassportsPt1 = passports.filter(passport => isValidPassport(passport, 1)).length;
const validPassportsPt2 = passports.filter(passport => isValidPassport(passport, 2)).length;

console.log("There are", validPassportsPt1, "of", passports.length, "valid passports for Pt1");
console.log("There are", validPassportsPt2, "of", passports.length, "valid passports for Pt2");
