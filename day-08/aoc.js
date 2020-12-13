const { readFileSync } = require('fs');

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)
const filter = (callback) => (arr) => arr.filter(callback);
const map = (callback) => (arr) => arr.map(callback);
const split = (char) => (str) => str.split(char);

const instructions = pipe(
  split('\n'),
  filter(Boolean),
  map(
    pipe(
      split(' '),
      ([instruction, num]) => ({ op: instruction.trim(), num: parseInt(num,  10) }),
    )
  ),
  map((instruction, index) => ({ ...instruction, index }))
)(readFileSync(0).toString());


const executeProgram = (instructions) => {
  const executed = new Map();

  let accumulator = 0;
  let iPtr = 0;

  while (iPtr < instructions.length - 1) {
    const instr = instructions[iPtr];

    if (executed.has(instr.index)) {
      throw new Error(`Execution loop detected on line ${instr}, accumulator was ${accumulator}`);
    }

    executed.set(instr.index, instr)

    switch (instr.op) {
      case 'nop': {
        iPtr++;
        break;
      }
      case 'jmp': {
        iPtr += instr.num;
        break;
      }
      case 'acc': {
        accumulator += instr.num;
        iPtr++;
        break;
      }
      default: {
        throw new Error(`Invalid op found: "${instr.op}"`);
      }
    }
  }

  return accumulator;
};

// Better solution would be to use a callstack and rewind, but meh
const alterProgramToRun = (instructions) => {
  let result;

  const swapInstruction = opIndex => {
    instructions[opIndex].op = instructions[opIndex].op === 'jmp' ? 'nop' : 'jmp';
  };

  const potentialOps = instructions.reduce((acc, e) => {
    if (e.op !== 'acc') {
      acc.push(e.index);
    }

    return acc;
  }, []);

  let successful = false;

  potentialOps.forEach((opIndex) => {
    const backupInstruction = instructions[opIndex];
    try {
      instructions[opIndex] = { ...instructions[opIndex], op: backupInstruction.op === 'jmp' ? 'nop' : 'jmp' };
      result = executeProgram(instructions);
      successful = true;
    } catch (e) {
      instructions[opIndex] = backupInstruction;
      successful = false;
    }

    if (successful) {
      console.log("Part 2: Successfully executed with", result);
      process.exit(0);
    }
  });
};

// Part 1

try {
  executeProgram(instructions);
} catch (e) {
  console.log("Part 1: ", e.message);
}

// Part 2
alterProgramToRun(instructions);

