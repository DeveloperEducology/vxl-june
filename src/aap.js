function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomOperator(strict = false) {
  const ops = strict ? [">", "<"] : [">", "<", "≥", "≤"];
  return ops[Math.floor(Math.random() * ops.length)];
}

// ✅ Dynamic generator for different inequality types
function generateInequalityQuestion(skillCode) {
  switch (skillCode) {
    case "B.1":
      const valueB1 = randomInt(-10, 10);
      const opB1 = randomOperator(true);
      return `Graph x ${opB1} ${valueB1} on a number line.`;

    case "B.4":
      const bB4 = randomInt(-10, 10);
      const cB4 = randomInt(-5, 15);
      return `Solve the inequality: x + ${bB4 > 0 ? bB4 : `(${bB4})`} > ${cB4}`;

    case "B.8":
      const mB8 = randomInt(1, 5);
      const bB8 = randomInt(-10, 10);
      const cB8 = randomInt(-5, 20);
      return `Solve the inequality: ${mB8}x + ${bB8} < ${cB8}`;

    case "B.14":
      const aB14 = randomInt(-5, 0);
      const mB14 = randomInt(1, 5);
      const bB14 = randomInt(-5, 5);
      const cB14 = randomInt(6, 15);
      return `Solve the compound inequality: ${aB14} < ${mB14}x + ${bB14} ≤ ${cB14}`;

    case "B.17":
      const aB17 = randomInt(1, 3);
      const bB17 = randomInt(-5, 5);
      const cB17 = randomInt(-10, 10);
      const opB17 = Math.random() > 0.5 ? ">" : "≤";
      return `Solve the inequality: ${aB17}x² ${bB17 >= 0 ? `+ ${bB17}` : `- ${Math.abs(bB17)}`} ${cB17 >= 0 ? `+ ${cB17}` : `- ${Math.abs(cB17)`} ${opB17} 0`;

    default:
      return "Unknown skill!";
  }
}

// ✅ Pick a random skill
function randomSkill() {
  const skills = ["B.1", "B.4", "B.8", "B.14", "B.17"];
  return skills[Math.floor(Math.random() * skills.length)];
}

// ✅ Generate a completely random question
function generateRandomQuestion() {
  const skill = randomSkill();
  const question = generateInequalityQuestion(skill);
  return { skill, question };
}

// Example usage:
console.log(generateRandomQuestion());
