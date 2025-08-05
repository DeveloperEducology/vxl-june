export const generateNumberLineQuestion = () => {
  const start = Math.floor(Math.random() * 10) - 5; // -5 to 5
  const end = start + 6; // Always show 7 numbers
  const numbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  // Randomly choose between even or odd question
  const questionType = Math.random() > 0.5 ? "even" : "odd";

  const targetNumbers = numbers.filter((n) =>
    questionType === "even" ? n % 2 === 0 : Math.abs(n % 2) === 1
  );

  return {
    type: "number-line",
    question: `Select the ${questionType} numbers on the number line.`,
    answer: targetNumbers,
    questionType, // 'even' or 'odd'
    range: { start, end },
    numbers,
    correctDots: targetNumbers,
    userDots: [],
  };
};

// Helper function for ordinal suffixes
export const getOrdinalSuffix = (num) => {
  if (num >= 11 && num <= 13) return "th";
  switch (num % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

// Helper for circle segment math
function polarToCartesian(cx, cy, r, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
}

// Helper function to shuffle array
export const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

export const questionsGenerator = {
  "🔢 Number Line": generateNumberLineQuestion,
  "A.0 Skip-Counting-pictures": () => {
    const candies = [
      {
        imageUrl: "https://placehold.co/40x40/ff69b4/fff?text=L",
        name: "lollipops",
      },
      {
        imageUrl: "https://placehold.co/40x40/ffa500/fff?text=C",
        name: "candies",
      },
      {
        imageUrl: "https://placehold.co/40x40/8b4513/fff?text=Ch",
        name: "chocolates",
      },
      {
        imageUrl: "https://placehold.co/40x40/ff69b4/fff?text=Cu",
        name: "cupcakes",
      },
      {
        imageUrl: "https://placehold.co/40x40/fdd835/000?text=D",
        name: "donuts",
      },
      {
        imageUrl: "https://placehold.co/40x40/e1bee7/000?text=U",
        name: "unicorns",
      },
    ];

    const steps = [2, 3, 5, 10];
    const step = steps[Math.floor(Math.random() * steps.length)];
    const numGroups = Math.floor(Math.random() * 5) + 2; // 2 to 6 groups
    const { imageUrl, name } =
      candies[Math.floor(Math.random() * candies.length)];
    const total = step * numGroups;

    // Each group is an array of images
    const visualGroups = Array.from({ length: numGroups }, () =>
      Array.from({ length: step }, () => imageUrl)
    );

    return {
      type: "input",
      question: `Count by ${step}s: How many ${name} are there in total?`,
      answer: total.toString(),
      visuals: visualGroups, // 2D array of image URLs
      options: [],
    };
  },

  "A.1 Skip-Counting-by-pictures": () => {
    const candies = [
      { emoji: "🍭", name: "lollipops" },
      { emoji: "🍬", name: "candies" },
      { emoji: "🍫", name: "chocolates" },
      { emoji: "🧁", name: "cupcakes" },
      { emoji: "🍩", name: "donuts" },
      { emoji: "🦄", name: "unicorns" },
    ];
    const steps = [2, 3, 5, 10];
    const step = steps[Math.floor(Math.random() * steps.length)];
    const numGroups = Math.floor(Math.random() * 5) + 2; // 2 to 6 groups
    const { emoji, name } = candies[Math.floor(Math.random() * candies.length)];
    const total = step * numGroups;

    // Create visual groups for rendering in React
    const visualGroups = Array.from({ length: numGroups }, () =>
      emoji.repeat(step)
    );

    return {
      type: "input",
      question: `Count by ${step}s: How many ${name} are there in total?`,
      answer: total.toString(),
      visuals: visualGroups,
      options: [],
    };
  },

  "A.1 Skip-counting-numbers": () => {
    const skip = [2, 5, 10][Math.floor(Math.random() * 3)];
    const start = Math.floor(Math.random() * 5);
    const series = Array.from({ length: 5 }, (_, i) => (start + i) * skip);
    return {
      question: `What number comes next in this skip counting sequence by ${skip}?`,
      type: "input",
      visuals: series.slice(0, 4),
      answer: series[4],
    };
  },
  "A.2 Skip-counting sequences": () => {
    const steps = [2, 3, 4, 5, 10, 25];
    const step = steps[Math.floor(Math.random() * steps.length)];
    const start = Math.floor(Math.random() * 10) * step;

    const sequence = Array.from({ length: 5 }, (_, i) => start + i * step);
    const nextNumber = start + 5 * step;

    return {
      type: "input",
      question: `What's the next number in this sequence?\n${sequence.join(
        ", "
      )}, ___`,
      answer: nextNumber.toString(),
      visuals: [],
      options: [],
    };
  },
  "A.2.1 missing number in sequence": () => {
    const stepOptions = [1, 2, 3, 5, 10];
    const step = stepOptions[Math.floor(Math.random() * stepOptions.length)];

    const start = Math.floor(Math.random() * 10) + 1; // 1 to 10
    const length = 7; // total items in sequence

    const fullSequence = Array.from({ length }, (_, i) => start + i * step);

    // Number of blanks: 1 to 3
    const numBlanks = Math.floor(Math.random() * 3) + 1;

    // Random unique blank indices
    const blankIndices = new Set();
    while (blankIndices.size < numBlanks) {
      const index = Math.floor(Math.random() * length);
      blankIndices.add(index);
    }

    // Build question with 'null' as placeholders
    const questionArray = fullSequence.map((num, idx) =>
      blankIndices.has(idx) ? "null" : num
    );

    // Extract correct answers based on blank indices
    const correctAnswers = Array.from(blankIndices)
      .sort((a, b) => a - b)
      .map((i) => fullSequence[i].toString());

    return {
      type: "sequence",
      question: `Fill the ${
        numBlanks > 1 ? "blanks" : "blank"
      } with the correct number${numBlanks > 1 ? "s" : ""}.`,
      sequences: [questionArray.join(" ")],
      correctAnswers,
      stepHint: `Count by ${step}s`,
    };
  },

  "A.2.2 Counting patterns-up to 100": () => {
    const stepOptions = [2, 3, 4, 5, 10];
    const step = stepOptions[Math.floor(Math.random() * stepOptions.length)];

    const start = Math.floor(Math.random() * 50) + 1; // random start from 1–50
    const blanks = 3; // always show 3 missing numbers

    const fullSequence = [start];
    for (let i = 1; i <= blanks; i++) {
      fullSequence.push(start + i * step);
    }

    const questionArray = [fullSequence[0], ...Array(blanks).fill("null")];

    const correctAnswers = fullSequence.slice(1).map((n) => n.toString());

    return {
      type: "sequence",
      question: `Count forward by ${step}s from ${start}.`,
      sequences: [questionArray.join(" ")],
      correctAnswers,
      stepHint: `Add ${step} each time.`,
    };
  },

  "A.6 Even or odd": () => {
    const emojis = ["🍎", "🍊", "🍇", "🍓", "🐶", "🐱", "⚽", "🏀", "🚗", "🚀"];
    const count = Math.floor(Math.random() * 10) + 3; // 3 to 12 emojis
    const answer = count % 2 === 0 ? "Even" : "Odd";

    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const visualEmojis = Array.from({ length: count }, () => randomEmoji);

    return {
      type: "mcq",
      question: "Is the number of items Even or Odd?",
      answer: answer,
      visuals: visualEmojis,
      options: ["Even", "Odd"],
    };
  },
  "A.7 Identify numbers as even or odd": () => {
    const count = Math.floor(Math.random() * 20) + 2; // Generates a number from 2 to 99
    const answer = count % 2 === 0 ? "Even" : "Odd";

    return {
      type: "mcq",
      // The question now directly asks about the generated number.
      question: `Is the number **${count}** Even or Odd?`,
      answer: answer,
      visuals: [], // Visuals are not needed for this question type.
      options: ["Even", "Odd"],
    };
  },
  "A.11 Skip-counting stories": () => {
    const rubiesPerBracelet = Math.floor(Math.random() * 8) + 2; // 1 to 4 rubies
    const totalBracelets = Math.floor(Math.random() * 9) + 2;

    const correctAnswer = totalBracelets * rubiesPerBracelet;

    // Table markdown generation
    let tableMarkdown = `| Number of bracelets | Number of rubies |\n|---------------------|------------------|\n`;
    for (let i = 1; i <= totalBracelets; i++) {
      const rubies = i < totalBracelets ? i * rubiesPerBracelet : "?";
      tableMarkdown += `| ${i} | ${rubies} |\n`;
    }

    // Generate wrong options
    const wrongAnswers = new Set();
    while (wrongAnswers.size < 3) {
      const offset = Math.floor(Math.random() * 5) + 1;
      const candidate =
        Math.random() < 0.5 ? correctAnswer + offset : correctAnswer - offset;
      if (candidate > 0 && candidate !== correctAnswer) {
        wrongAnswers.add(candidate);
      }
    }

    const options = [...wrongAnswers, correctAnswer].sort(
      () => Math.random() - 0.5
    );

    // Story + question markdown
    const character = ["Riya", "Amit", "Zoya", "Kabir"][
      Math.floor(Math.random() * 4)
    ];
    const contextLine = `**${character} is making bracelets to gift to friends.**`;
    const detailLine = `**Each bracelet has ${rubiesPerBracelet} rub${
      rubiesPerBracelet === 1 ? "y" : "ies"
    }.**`;
    const questionLine = `**How many rubies will ${character} need for ${totalBracelets} bracelets?**`;

    return {
      question: [contextLine, detailLine, questionLine].join("\n\n"),
      table: tableMarkdown.trim(),
      type: "mcq",
      answer: correctAnswer,
      options,
    };
  },
  "A.12 Skip-counting puzzles": () => {
    const start = Math.floor(Math.random() * 20) * 5 + 10; // 10, 15, ..., 105
    const stepOptions = [2, 5, 10];
    const step = stepOptions[Math.floor(Math.random() * stepOptions.length)];

    const maxSteps = 10 + Math.floor(Math.random() * 6); // 10 to 15 steps
    const path = Array.from({ length: maxSteps }, (_, i) => start + i * step);

    const includeTarget = Math.random() < 0.7; // 70% chance of reachable
    const target = includeTarget
      ? path[Math.floor(Math.random() * path.length)]
      : start + step * maxSteps + step * (Math.floor(Math.random() * 3) + 1);

    const answer = path.includes(target) ? "yes" : "no";

    return {
      type: "mcq",
      question: `**Karen began at ${start}. She skip-counted by ${step}s. Could she have said the number ${target}?**`,
      answer,
      options: ["yes", "no"],
    };
  },

  "A.8 Select even or odd numbers": () => {
    const numbers = [];
    const evenNumbers = [];
    const oddNumbers = [];

    // Randomly decide whether to ask for even or odd
    const askFor = Math.random() < 0.5 ? "even" : "odd";

    // Generate 2 unique even numbers
    while (evenNumbers.length < 2) {
      const num = Math.floor(Math.random() * 20); // 0–19
      if (num % 2 === 0 && !evenNumbers.includes(num)) {
        evenNumbers.push(num);
      }
    }

    // Generate 2 unique odd numbers
    while (oddNumbers.length < 2) {
      const num = Math.floor(Math.random() * 20) + 1; // 1–20
      if (num % 2 !== 0 && !oddNumbers.includes(num)) {
        oddNumbers.push(num);
      }
    }

    const allNumbers = [...evenNumbers, ...oddNumbers].sort(
      () => Math.random() - 0.5
    );

    return {
      type: "mcq-multiple",
      question: `Which of the following numbers are ${askFor}?`,
      answer: (askFor === "even" ? evenNumbers : oddNumbers).map((n) =>
        n.toString()
      ),
      options: allNumbers.map((n) => n.toString()),
      // visuals: allNumbers.map((n) => ({ type: "text", content: n.toString() })),
      questionType: askFor,
    };
  },

  "📊 Counting Patterns": () => {
    const steps = [
      { step: 2, word: "twos" },
      { step: 5, word: "fives" },
      { step: 10, word: "tens" },
    ];
    const { step, word } = steps[Math.floor(Math.random() * steps.length)];
    const isForward = Math.random() > 0.5;
    const start = Math.floor(Math.random() * 10 + 1) * step; // e.g., 2, 4..20 or 5, 10..50

    const sequence = [start];
    for (let i = 0; i < 4; i++) {
      const lastNum = sequence[sequence.length - 1];
      sequence.push(isForward ? lastNum + step : lastNum - step);
    }
    const nextNumber = isForward ? sequence[4] + step : sequence[4] - step;

    return {
      type: "input",
      question: `Count ${
        isForward ? "forward" : "backward"
      } by ${word}. What comes next?\n${sequence.join(", ")}, ___`,
      answer: nextNumber.toString(),
      visuals: [],
      options: [],
    };
  },

  "➕ Add 2 Numbers": () => {
    const a = Math.floor(Math.random() * 50);
    const b = Math.floor(Math.random() * 50);
    return {
      question: `What is ${a} + ${b}?`,
      type: "input",
      answer: a + b,
    };
  },
  "🟰 True or False?": () => {
    const a = Math.floor(Math.random() * 20);
    const b = Math.floor(Math.random() * 20);
    const c = Math.random() > 0.5 ? a + b : a + b + 1;
    const correct = a + b === c ? "True" : "False";
    return {
      question: `Is this true? ${a} + ${b} = ${c}`,
      type: "mcq",
      options: ["True", "False"],
      answer: correct,
    };
  },
  "💡 Guess the Number": () => {
    const numberPool = [2, 4, 6, 8, 10];
    const number = numberPool[Math.floor(Math.random() * numberPool.length)];

    const characters = [
      { emoji: "🤖", name: "Robo" },
      { emoji: "🕵️‍♂️", name: "Detective Dan" },
      { emoji: "🧙‍♂️", name: "Wizard Wally" },
      { emoji: "👩‍🏫", name: "Teacher Tia" },
      { emoji: "🦊", name: "Foxy" },
    ];

    const character = characters[Math.floor(Math.random() * characters.length)];

    const clues = [
      `It's an even number.`,
      `It's exactly ${number - 1} + 1.`,
      `It is divisible by ${number / 2}.`,
    ];

    // Options must include the correct answer and similar distractors
    const distractors = numberPool.filter((n) => n !== number);
    const shuffledOptions = [
      number,
      ...distractors.sort(() => 0.5 - Math.random()).slice(0, 3),
    ].sort(() => 0.5 - Math.random());

    return {
      question: `${character.emoji} ${
        character.name
      } says:\n"Can you guess my secret number?"\n\nHere are your clues:\n${clues.join(
        "\n"
      )}`,
      type: "mcq",
      options: shuffledOptions,
      answer: number,
      hint: "Only one number fits all clues exactly.",
    };
  },

  "🎭 Tricky Guess the Number": () => {
    const numberPool = [2, 4, 6, 8, 10];
    const number = numberPool[Math.floor(Math.random() * numberPool.length)];

    const characters = [
      { emoji: "🧛", name: "Count Clueless" },
      { emoji: "🤹", name: "Jester Jinx" },
      { emoji: "👻", name: "Ghostly Gwen" },
      { emoji: "🧠", name: "Brainy Ben" },
      { emoji: "🐒", name: "Monkey Max" },
    ];

    const character = characters[Math.floor(Math.random() * characters.length)];

    const clues = [
      `I'm not odd — but I act strange!`,
      `I’m more than ${number - 2} but less than ${number + 2}.`,
      `Divide me by 2, and you’ll get a whole number.`,
    ];

    const fakeClue = `One of the options is a trap! Don’t fall for the obvious one! 🙈`;

    // Distractors with similar properties
    const distractors = numberPool.filter((n) => n !== number);
    const shuffledOptions = [
      number,
      ...distractors.sort(() => 0.5 - Math.random()).slice(0, 3),
    ].sort(() => 0.5 - Math.random());

    return {
      question: `${character.emoji} ${
        character.name
      } whispers:\n"I've got a riddle for you..."\n\n${clues.join(
        "\n"
      )}\n\n${fakeClue}`,
      type: "mcq",
      options: shuffledOptions,
      answer: number,
      hint: "Even numbers only. Stay sharp — one choice breaks one clue!",
    };
  },

  "💡 Dynamic Guess the Number with Feedback": () => {
    const numberPool = Array.from({ length: 30 }, (_, i) => i + 1);
    const number = numberPool[Math.floor(Math.random() * numberPool.length)];

    // Dynamic clue logic
    const clues = [];

    // Clue 1: Even or Odd
    const isEven = number % 2 === 0;
    clues.push(isEven ? "I'm even." : "I'm odd.");

    // Clue 2: Range
    const min = number - 2;
    const max = number + 2;
    clues.push(`I'm between ${min} and ${max}.`);

    // Clue 3: Divisibility
    const divisibleBy = [2, 3, 5, 6].find((d) => number % d === 0) || 1;
    clues.push(`I'm divisible by ${divisibleBy}.`);

    // Prepare distractors
    const distractors = numberPool
      .filter((n) => n !== number)
      .filter((n) => Math.abs(n - number) <= 5)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [number, ...distractors].sort(() => 0.5 - Math.random());

    // Feedback per option
    const feedback = {};

    for (let opt of options) {
      if (opt === number) {
        feedback[opt] = "✅ Correct! This number matches all the clues.";
      } else {
        let reasons = [];

        if ((opt % 2 === 0) !== isEven) {
          reasons.push(
            `❌ It's ${
              opt % 2 === 0 ? "even" : "odd"
            }, but the clue says it should be ${isEven ? "even" : "odd"}.`
          );
        }

        if (opt <= min || opt >= max) {
          reasons.push(`❌ It's not between ${min} and ${max}.`);
        }

        if (opt % divisibleBy !== 0) {
          reasons.push(`❌ It's not divisible by ${divisibleBy}.`);
        }

        feedback[opt] = reasons.length
          ? reasons.join(" ")
          : "❌ Doesn't satisfy one or more clues.";
      }
    }

    const characters = [
      { emoji: "🤖", name: "Robo" },
      { emoji: "🧙‍♂️", name: "Wizard Wally" },
      { emoji: "🕵️‍♀️", name: "Detective Dot" },
      { emoji: "👻", name: "Spooky Sue" },
    ];
    const character = characters[Math.floor(Math.random() * characters.length)];

    return {
      question: `${character.emoji} ${
        character.name
      } says:\n"Can you guess my secret number?"\n\nClues:\n${clues.join(
        "\n"
      )}`,
      type: "mcq",
      options,
      answer: number,
      feedbackPerOption: feedback,
      hint: "Only one number fits all the clues.",
    };
  },
  "🎯 Multiple of 3 or 5?": () => {
    const options = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 30)
    );
    const multiples = options.filter((n) => n % 3 === 0 || n % 5 === 0);
    return {
      question: "Select all multiples of 3 or 5",
      type: "mcq-multiple",
      options,
      answer: multiples,
    };
  },
  "📏 What’s the Length?": () => {
    const length = [10, 15, 20, 25][Math.floor(Math.random() * 4)];
    return {
      question: `If this line is ${length} cm long, how many 5 cm segments fit inside?`,
      type: "input",
      answer: length / 5,
    };
  },

  "C1.1 Ordinal Recognition": () => {
    const numbers = [1, 2, 3, 4, 5, 10, 11, 12, 20, 21, 22, 100, 101];
    const num = numbers[Math.floor(Math.random() * numbers.length)];
    let suffix;
    if (num % 100 >= 11 && num % 100 <= 13) suffix = "th";
    else
      switch (num % 10) {
        case 1:
          suffix = "st";
          break;
        case 2:
          suffix = "nd";
          break;
        case 3:
          suffix = "rd";
          break;
        default:
          suffix = "th";
      }
    return {
      question: `What is the correct ordinal form of ${num}?`,
      type: "mcq",
      options: [`${num}st`, `${num}nd`, `${num}rd`, `${num}th`],
      answer: `${num}${suffix}`,
      feedback: `Ordinal numbers ending in 1 use 'st' (except 11), 2 use 'nd' (except 12), 3 use 'rd' (except 13), others use 'th'.`,
    };
  },

  // C2: Writing Numbers up to 1000
  "C2.1 Number to Words (MCQ)": () => {
    // Helper function to convert number to words
    const numberToWords = (num) => {
      if (num === 0) return "zero";

      const ones = [
        "",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
        "eighteen",
        "nineteen",
      ];
      const tens = [
        "",
        "",
        "twenty",
        "thirty",
        "forty",
        "fifty",
        "sixty",
        "seventy",
        "eighty",
        "ninety",
      ];

      let result = "";

      if (num >= 100) {
        result += ones[Math.floor(num / 100)] + " hundred";
        num %= 100;
        if (num > 0) result += " ";
      }

      if (num > 0) {
        if (num < 20) {
          result += ones[num];
        } else {
          result += tens[Math.floor(num / 10)];
          if (num % 10 > 0) {
            result += "-" + ones[num % 10];
          }
        }
      }

      return result;
    };

    // Generate a random number between 1 and 999
    const num = Math.floor(Math.random() * 999) + 1;
    const correctWord = numberToWords(num);

    // Generate distractors (plausible incorrect answers)
    const distractors = [];

    // Slight variations: remove hyphen, wrong tens, wrong ones, extra 'and', etc.
    const variations = [
      correctWord.replace("-", ""), // no hyphen
      correctWord.replace(
        /(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)/,
        "ten"
      ),
      correctWord.replace(
        /(one|two|three|four|five|six|seven|eight|nine)$/,
        "zero"
      ),
      correctWord.replace(/hundred/, "thousand"), // replace hundred with thousand
      correctWord.replace(/-/, " "), // space instead of hyphen
      correctWord + " and", // add 'and' (incorrect)
      correctWord.replace(
        /(ninety|eighty|seventy|sixty|fifty|forty|thirty|twenty)/,
        "ten"
      ), // wrong tens
    ];

    // Pick 3 unique distractors
    while (distractors.length < 3) {
      const candidate =
        variations[Math.floor(Math.random() * variations.length)];
      if (candidate !== correctWord && !distractors.includes(candidate)) {
        distractors.push(candidate);
      }
    }

    // Combine and shuffle options
    const options = [correctWord, ...distractors].sort(
      () => Math.random() - 0.5
    );

    return {
      question: `Which is the correct way to write ${num} in words?`,
      type: "mcq",
      options: options,
      answer: correctWord,
      feedback: `Remember: use hyphens from twenty-one to ninety-nine. In American English, 'and' is not typically used (e.g., "one hundred twenty-seven", not "one hundred and twenty-seven").`,
    };
  },

  // C3: Numbers up to 100 in Words
  "C3.1 Word to Number": () => {
    const numbers = {
      twelve: 12,
      "forty-five": 45,
      "eighty-eight": 88,
      "one hundred": 100,
    };
    const entries = Object.entries(numbers);
    const [word, num] = entries[Math.floor(Math.random() * entries.length)];

    return {
      question: `Convert "${word}" to digits:`,
      type: "input",
      answer: num.toString(),
      feedback: `Numbers from 21-99 use hyphens (e.g., forty-five).`,
    };
  },

  "C.3 Writing numbers up to 100 in words": () => {
    const numberToWords = (num) => {
      const ones = [
        "",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
        "eighteen",
        "nineteen",
      ];
      const tens = [
        "",
        "",
        "twenty",
        "thirty",
        "forty",
        "fifty",
        "sixty",
        "seventy",
        "eighty",
        "ninety",
      ];

      if (num < 20) return ones[num];
      if (num < 100) {
        const ten = Math.floor(num / 10);
        const one = num % 10;
        return one === 0 ? tens[ten] : `${tens[ten]}-${ones[one]}`;
      }
      return "one hundred";
    };

    const num = Math.floor(Math.random() * 81) + 20; // 20 to 100
    const correctWord = numberToWords(num);

    const distractors = [];
    while (distractors.length < 3) {
      const rand = Math.floor(Math.random() * 81) + 20;
      const word = numberToWords(rand);
      if (rand !== num && !distractors.includes(word)) {
        distractors.push(word);
      }
    }

    const options = [correctWord, ...distractors].sort(
      () => 0.5 - Math.random()
    );

    return {
      question: `Which is the correct way to write **${num}** in words?`,
      type: "mcq",
      options,
      answer: correctWord,
      feedback: `Use hyphens for compound numbers like "forty-two", and no 'and'.`,
    };
  },
  // C4: Ordinal vs. Cardinal
  "C.4 Distinguishing ordinal and cardinal numbers": () => {
    const examples = [
      // Easy
      { text: "There are 7 days in a week", type: "cardinal" },
      { text: "She finished in 3rd place", type: "ordinal" },
      { text: "I have 2 siblings", type: "cardinal" },
      { text: "Our anniversary is on the 25th", type: "ordinal" },
      { text: "He has 10 marbles", type: "cardinal" },
      { text: "This is my 1st trip abroad", type: "ordinal" },

      // Medium
      { text: "We ate 4 pizzas at the party", type: "cardinal" },
      { text: "My birthday is on the 9th of September", type: "ordinal" },
      { text: "He bought 8 books and read the 3rd one first", type: "mixed" },
      {
        text: "The elephant was the 5th animal we saw at the zoo",
        type: "ordinal",
      },
      { text: "She won 6 medals in her first tournament", type: "mixed" },

      // Tricky / Mixed
      {
        text: "They reached the 2nd checkpoint after running 3 miles",
        type: "mixed",
      },
      { text: "There were 20 players and he came 1st", type: "mixed" },
      {
        text: "The bus stops at the 6th street and picks up 10 passengers",
        type: "mixed",
      },
      { text: "I scored 95 in the 2nd round", type: "mixed" },
      { text: "The 10th question had only 2 correct answers", type: "mixed" },

      // Extra
      { text: "She drank 3 cups of tea today", type: "cardinal" },
      { text: "He lives on the 11th floor of the building", type: "ordinal" },
      { text: "The 4th chapter has 7 sections", type: "mixed" },
    ];

    const example = examples[Math.floor(Math.random() * examples.length)];

    return {
      question: `Is the number in this sentence cardinal or ordinal? \n **${example.text}**`,
      type: "mcq",
      options: ["cardinal", "ordinal", "mixed"],
      answer: example.type,
      feedback:
        example.type === "cardinal"
          ? "Cardinal numbers tell 'how many'."
          : "Ordinal numbers tell position or order.",
    };
  },

  // Bonus: Crossword Puzzle Generator
  "Crossword Generator": () => {
    const words = {
      ten: "10",
      twenty: "20",
      fifty: "50",
      hundred: "100",
    };
    const wordList = Object.keys(words);
    const selectedWord = wordList[Math.floor(Math.random() * wordList.length)];

    return {
      question: `Crossword clue: The number after ${words[selectedWord] - 1} (${
        selectedWord.length
      } letters)`,
      type: "input",
      textType: "text",
      answer: selectedWord,
      visuals: [`_ `.repeat(selectedWord.length).trim()],
      feedback: `Hint: It's how we write ${words[selectedWord]} in words.`,
    };
  },

  "🐻 Ordinal Emoji Challenge": () => {
    const emojiThemes = [
      ["🚂", "🐻", "✈️", "🚗", "🚲", "🚢", "🚀", "🛵"], // Transportation
      ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"], // Animals
      ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓"], // Fruits
      ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🎱", "🏓"], // Sports
    ];

    const theme = emojiThemes[Math.floor(Math.random() * emojiThemes.length)];
    const length = Math.floor(Math.random() * 4) + 5; // 5-8 emojis
    const emojis = theme.slice(0, length);
    const targetPos = Math.floor(Math.random() * (length - 2)) + 3; // 3rd to last-1 position

    // Create visual display with first item labeled
    const visualDisplay = emojis
      .map((emoji, i) => (i === 0 ? `${emoji} (first)` : emoji))
      .join(" → ");

    // Generate plausible wrong answers
    const wrongOptions = [
      emojis[targetPos % emojis.length], // Next in sequence
      emojis[targetPos - 2], // Previous item
      emojis[emojis.length - 1], // Last item
    ].filter((opt) => opt !== emojis[targetPos - 1]);

    return {
      type: "mcq",
      question: `The first item is ${
        emojis[0]
      }. Which is ${targetPos}${getOrdinalSuffix(targetPos)}?`,
      visuals: [visualDisplay],
      options: shuffleArray([emojis[targetPos - 1], ...wrongOptions, "None"]),
      answer: emojis[targetPos - 1],
      feedback: `Counting positions:\n${emojis
        .map((e, i) => `${i + 1}${getOrdinalSuffix(i + 1)}: ${e}`)
        .join("\n")}`,
    };
  },

  "A.1 Tense Fill-in-the-Blank": () => {
    const subjects = ["He", "She", "They", "I", "We"];
    const verbs = {
      eat: {
        past: "ate",
        present: { He: "eats", She: "eats", default: "eat" },
        future: "will eat",
      },
      go: {
        past: "went",
        present: { He: "goes", She: "goes", default: "go" },
        future: "will go",
      },
      play: {
        past: "played",
        present: { default: "play", He: "plays", She: "plays" },
        future: "will play",
      },
      run: {
        past: "ran",
        present: { He: "runs", She: "runs", default: "run" },
        future: "will run",
      },
      read: {
        past: "read",
        present: { default: "read", He: "reads", She: "reads" },
        future: "will read",
      },
    };

    const tenses = ["past", "present", "future"];

    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const verbKey =
      Object.keys(verbs)[Math.floor(Math.random() * Object.keys(verbs).length)];
    const verb = verbs[verbKey];
    const tense = tenses[Math.floor(Math.random() * tenses.length)];

    // Get correct answer form based on subject and tense
    const correct =
      tense === "present"
        ? verb.present[subject] || verb.present.default
        : verb[tense];

    // Generate plausible wrong options
    const wrongOptions = new Set([
      verb.present.default,
      verb.past,
      "will " + verbKey,
      verbKey + "ed",
      verbKey,
      verbKey + "s",
      verbKey + "ing",
    ]);

    wrongOptions.delete(correct); // ensure correct isn't duplicated

    const options = [...Array.from(wrongOptions).slice(0, 3), correct].sort(
      () => Math.random() - 0.5
    );

    return {
      type: "mcq",
      question: `**${subject} ___ every day.** _(Choose the correct form of "${verbKey}" in ${tense} tense)_`,
      options,
      answer: correct,
    };
  },
  "A.2 Synonym Match": () => {
    const synonymPairs = [
      {
        word: "happy",
        synonym: "joyful",
        distractors: ["sad", "angry", "fast"],
      },
      {
        word: "big",
        synonym: "large",
        distractors: ["tiny", "short", "small"],
      },
      {
        word: "smart",
        synonym: "intelligent",
        distractors: ["lazy", "slow", "dumb"],
      },
      {
        word: "cold",
        synonym: "chilly",
        distractors: ["hot", "warm", "burning"],
      },
      {
        word: "fast",
        synonym: "quick",
        distractors: ["slow", "late", "tired"],
      },
      {
        word: "pretty",
        synonym: "beautiful",
        distractors: ["ugly", "bad", "dirty"],
      },
      { word: "angry", synonym: "mad", distractors: ["calm", "kind", "quiet"] },
      {
        word: "start",
        synonym: "begin",
        distractors: ["end", "stop", "finish"],
      },
      {
        word: "strong",
        synonym: "powerful",
        distractors: ["weak", "soft", "tiny"],
      },
      {
        word: "clean",
        synonym: "tidy",
        distractors: ["dirty", "messy", "smelly"],
      },
    ];

    const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

    const selected =
      synonymPairs[Math.floor(Math.random() * synonymPairs.length)];
    const options = shuffleArray([selected.synonym, ...selected.distractors]);

    return {
      type: "mcq",
      question: `**Which word is a synonym of _${selected.word}_?**`,
      options,
      answer: selected.synonym,
    };
  },
  "A.3 Reading Comprehension (True/False)": () => {
    const passages = [
      {
        passage: "Tom loves painting. He paints every weekend.",
        trueStatement: "Tom paints every weekend.",
        falseStatement: "Tom hates painting.",
      },
      {
        passage: "Lily has a cat named Snowy. Snowy is white and fluffy.",
        trueStatement: "Snowy is white and fluffy.",
        falseStatement: "Lily has a dog named Snowy.",
      },
      {
        passage: "John reads a new book every month. He likes mystery novels.",
        trueStatement: "John reads a new book every month.",
        falseStatement: "John dislikes mystery novels.",
      },
      {
        passage:
          "Emma goes to the park every evening. She jogs for 30 minutes.",
        trueStatement: "Emma jogs every evening.",
        falseStatement: "Emma goes to the library every evening.",
      },
      {
        passage: "Raj is a doctor. He works in a hospital near his house.",
        trueStatement: "Raj works in a hospital.",
        falseStatement: "Raj is a teacher.",
      },
    ];

    // Pick a random passage
    const selected = passages[Math.floor(Math.random() * passages.length)];

    // Randomly decide whether to ask a true or false question
    const isTrue = Math.random() < 0.5;

    const questionText = isTrue
      ? selected.trueStatement
      : selected.falseStatement;
    const correctAnswer = isTrue ? "True" : "False";

    return {
      type: "mcq",
      passage: selected.passage,
      question: `**True or False?** _${questionText}_`,
      options: ["True", "False"],
      answer: correctAnswer,
    };
  },

  "N.1 numberSystem": () => {
    const numberToWords = (num) => {
      const ones = [
        "",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
      ];
      const teens = [
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
        "eighteen",
        "nineteen",
      ];
      const tens = [
        "",
        "",
        "twenty",
        "thirty",
        "forty",
        "fifty",
        "sixty",
        "seventy",
        "eighty",
        "ninety",
      ];

      const hundred = Math.floor(num / 100);
      const remainder = num % 100;
      const ten = Math.floor(remainder / 10);
      const one = remainder % 10;

      let words = ones[hundred] + " hundred";

      if (remainder > 0) {
        words += " and ";
        if (remainder < 10) {
          words += ones[one];
        } else if (remainder < 20) {
          words += teens[remainder - 10];
        } else {
          words += tens[ten];
          if (one > 0) words += "-" + ones[one];
        }
      }

      return words;
    };

    const num = Math.floor(Math.random() * 900 + 100); // 3-digit number
    const correct = numberToWords(num);

    // Distractors: slightly wrong versions
    const distractors = [
      numberToWords(num + 1),
      numberToWords(num - 1),
      numberToWords(num + 10),
    ];

    // Shuffle options
    const options = [correct, ...distractors].sort(() => Math.random() - 0.5);

    return {
      type: "mcq",
      question: `Write the number **${num}** in words.`,
      options,
      answer: correct,
      explanation: `Break ${num} into hundreds, tens, and ones. Then convert each to words. Example: ${num} → ${correct}`,
    };
  },
  "N.4 fractionAscendingOrder": () => {
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const reduceFraction = (num, den) => {
      const g = gcd(num, den);
      return [num / g, den / g];
    };

    const getLCM = (a, b) => (a * b) / gcd(a, b);

    const generateBar = (num, den) => {
      const filledCount = Math.round((num / den) * 10);
      const filled = "█".repeat(filledCount);
      const empty = "░".repeat(10 - filledCount);
      return `[${filled}${empty}]`;
    };

    // Generate 4 unique reduced proper fractions
    const fractionSet = new Set();
    while (fractionSet.size < 4) {
      const num = Math.floor(Math.random() * 5) + 1;
      const den = Math.floor(Math.random() * 4) + num + 2;
      const [n, d] = reduceFraction(num, den);
      fractionSet.add(`${n}/${d}`);
    }

    const fractions = Array.from(fractionSet).map((f) => {
      const [n, d] = f.split("/").map(Number);
      return {
        n,
        d,
        value: n / d,
        text: `\\frac{${n}}{${d}}`,
        bar: generateBar(n, d),
      };
    });

    // Correct ascending order
    const sorted = [...fractions].sort((a, b) => a.value - b.value);
    const correctOption = sorted.map((f) => f.text).join(" < ");

    // Generate 3 distractors
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
    const generateWrongOptions = () => {
      const opts = new Set();
      while (opts.size < 3) {
        const option = shuffle(fractions)
          .map((f) => f.text)
          .join(" < ");
        if (option !== correctOption) opts.add(option);
      }
      return Array.from(opts);
    };

    const wrongOptions = generateWrongOptions();
    const allOptions = shuffle([correctOption, ...wrongOptions]);

    // Hint with visual bar
    const hint = fractions.map((f) => `${f.text}: ${f.bar}`).join("\n");

    // Step-by-step explanation using common denominators
    const denominators = fractions.map((f) => f.d);
    const commonDenominator = denominators.reduce((acc, d) => getLCM(acc, d));

    const equivalentFractions = fractions.map((f) => {
      const multiplier = commonDenominator / f.d;
      return {
        original: `\\frac{${f.n}}{${f.d}}`,
        equivalent: `\\frac{${f.n * multiplier}}{${commonDenominator}}`,
        numerator: f.n * multiplier,
      };
    });

    const sortedEquivalents = [...equivalentFractions].sort(
      (a, b) => a.numerator - b.numerator
    );

    const explanation = [
      `Find LCM of denominators (${denominators.join(
        ", "
      )}): ${commonDenominator}`,
      ...equivalentFractions.map((f) => `${f.original} = ${f.equivalent}`),
      `Now compare the numerators:`,
      sortedEquivalents.map((f) => f.equivalent).join(" < "),
      `So the correct ascending order is:`,
      sortedEquivalents.map((f) => f.original).join(" < "),
    ];

    return {
      type: "mcq",
      question: `Which option shows the fractions arranged in **ascending order**?`,
      options: allOptions,
      answer: correctOption,
      latex: true,
      hint: `Use the bar visuals to estimate each fraction's value:\n\n${hint}`,
      explanation: explanation,
    };
  },
  "N.4a compareTwoFractions": () => {
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const reduceFraction = (num, den) => {
      const g = gcd(num, den);
      return [num / g, den / g];
    };
    const getLCM = (a, b) => (a * b) / gcd(a, b);
    const generateBar = (num, den) => {
      const filledCount = Math.round((num / den) * 10);
      const filled = "█".repeat(filledCount);
      const empty = "░".repeat(10 - filledCount);
      return `[${filled}${empty}]`;
    };

    // Generate 2 distinct proper reduced fractions
    const fractionSet = new Set();
    while (fractionSet.size < 2) {
      const num = Math.floor(Math.random() * 5) + 1;
      const den = Math.floor(Math.random() * 4) + num + 2;
      const [n, d] = reduceFraction(num, den);
      fractionSet.add(`${n}/${d}`);
    }

    const [f1, f2] = Array.from(fractionSet).map((f) => {
      const [n, d] = f.split("/").map(Number);
      return {
        n,
        d,
        value: n / d,
        text: `\\frac{${n}}{${d}}`,
        bar: generateBar(n, d),
      };
    });

    // Determine correct comparison
    const symbols = ["<", ">", "="];
    let answerSymbol =
      f1.value < f2.value ? "<" : f1.value > f2.value ? ">" : "=";
    const correctAnswer = `${f1.text} ${answerSymbol} ${f2.text}`;

    // Generate distractors
    const distractors = symbols
      .filter((sym) => sym !== answerSymbol)
      .map((sym) => `${f1.text} ${sym} ${f2.text}`);
    const options = [correctAnswer, ...distractors].sort(
      () => Math.random() - 0.5
    );

    // Hint bar
    const hint = `${f1.text}: ${f1.bar}\n${f2.text}: ${f2.bar}`;

    // Explanation using common denominator
    const lcm = getLCM(f1.d, f2.d);
    const f1EqNum = (lcm / f1.d) * f1.n;
    const f2EqNum = (lcm / f2.d) * f2.n;

    const explanation = [
      `Find LCM of denominators (${f1.d}, ${f2.d}): ${lcm}`,
      `${f1.text} = \\frac{${f1EqNum}}{${lcm}}`,
      `${f2.text} = \\frac{${f2EqNum}}{${lcm}}`,
      `Now compare the numerators: ${f1EqNum} ${answerSymbol} ${f2EqNum}`,
      `So, ${f1.text} ${answerSymbol} ${f2.text} is the correct answer.`,
    ];

    return {
      type: "mcq",
      question: `Which of the following is correct?`,
      options,
      answer: correctAnswer,
      latex: true,
      hint: `Use the bar visuals to estimate each fraction's value:\n\n${hint}`,
      explanation,
    };
  },
  "N.4b TwoFractionsDescending": () => {
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const reduceFraction = (num, den) => {
      const g = gcd(num, den);
      return [num / g, den / g];
    };
    const getLCM = (a, b) => (a * b) / gcd(a, b);
    const generateBar = (num, den) => {
      const filledCount = Math.round((num / den) * 10);
      const filled = "█".repeat(filledCount);
      const empty = "░".repeat(10 - filledCount);
      return `[${filled}${empty}]`;
    };

    // Generate 2 distinct proper reduced fractions
    const fractionSet = new Set();
    while (fractionSet.size < 2) {
      const num = Math.floor(Math.random() * 5) + 1;
      const den = Math.floor(Math.random() * 4) + num + 2;
      const [n, d] = reduceFraction(num, den);
      fractionSet.add(`${n}/${d}`);
    }

    const [f1, f2] = Array.from(fractionSet).map((f) => {
      const [n, d] = f.split("/").map(Number);
      return {
        n,
        d,
        value: n / d,
        text: `\\frac{${n}}{${d}}`,
        bar: generateBar(n, d),
      };
    });

    // Determine correct descending order
    const correctAnswer =
      f1.value > f2.value
        ? `${f1.text} > ${f2.text}`
        : `${f2.text} > ${f1.text}`;

    const distractors = [
      `${f1.text} < ${f2.text}`,
      `${f2.text} < ${f1.text}`,
      `${f1.text} = ${f2.text}`,
    ].filter((option) => option !== correctAnswer);

    const options = [correctAnswer, ...distractors.slice(0, 2)].sort(
      () => Math.random() - 0.5
    );

    // Hint bar
    const hint = `${f1.text}: ${f1.bar}\n${f2.text}: ${f2.bar}`;

    // Explanation using common denominator
    const lcm = getLCM(f1.d, f2.d);
    const f1EqNum = (lcm / f1.d) * f1.n;
    const f2EqNum = (lcm / f2.d) * f2.n;
    const symbol = f1EqNum > f2EqNum ? ">" : f1EqNum < f2EqNum ? "<" : "=";

    const explanation = [
      `Find LCM of denominators (${f1.d}, ${f2.d}): ${lcm}`,
      `${f1.text} = \\frac{${f1EqNum}}{${lcm}}`,
      `${f2.text} = \\frac{${f2EqNum}}{${lcm}}`,
      `Now compare the numerators: ${f1EqNum} ${symbol} ${f2EqNum}`,
      `So the correct descending order is: ${correctAnswer}`,
    ];

    return {
      type: "mcq",
      question: `Which of the following shows the **descending order** between the two fractions?`,
      options,
      answer: correctAnswer,
      latex: true,
      hint: `Use the bar visuals to estimate each fraction's value:\n\n${hint}`,
      explanation,
    };
  },

  "A.1 fractionBasicsUnderstanding": () => {
    const shapes = ["circle", "rectangle", "square", "pizza"];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];

    const denominators = [2, 3, 4, 5, 6];
    const d = denominators[Math.floor(Math.random() * denominators.length)];
    const n = Math.floor(Math.random() * d) + 1;

    const correctAnswer = `${n}/${d}`;

    // Generate 3 unique incorrect options
    const distractors = new Set();
    while (distractors.size < 3) {
      const dn = denominators[Math.floor(Math.random() * denominators.length)];
      const nn = Math.floor(Math.random() * dn) + 1;
      const frac = `${nn}/${dn}`;
      if (frac !== correctAnswer) distractors.add(frac);
    }

    const allOptions = [...distractors, correctAnswer].sort(
      () => Math.random() - 0.5
    );

    const question = `A **${shape}** is divided into **${d} equal parts**. **${n} part(s)** are shaded.\n\n👉 What fraction of the ${shape} is shaded?`;

    // SVG render function
    const svg = (() => {
      const size = 100;

      if (shape === "circle" || shape === "pizza") {
        const slices = Array.from({ length: d }, (_, i) => {
          const angle = (360 / d) * i;
          const largeArc = 360 / d > 180 ? 1 : 0;
          const start = polarToCartesian(size, size, size, angle);
          const end = polarToCartesian(size, size, size, angle + 360 / d);
          const path = `
          M ${size} ${size}
          L ${start.x} ${start.y}
          A ${size} ${size} 0 ${largeArc} 1 ${end.x} ${end.y}
          Z
        `;
          return `<path d="${path}" fill="${
            i < n ? "#7b61ff" : "#e0e0e0"
          }" stroke="#444"/>`;
        }).join("\n");

        return `<svg width="200" height="200" viewBox="0 0 ${size * 2} ${
          size * 2
        }">${slices}</svg>`;
      }

      if (shape === "rectangle") {
        const partWidth = 120 / d;
        const bars = Array.from({ length: d }, (_, i) => {
          return `<rect x="${
            i * partWidth
          }" y="0" width="${partWidth}" height="60" fill="${
            i < n ? "#7b61ff" : "#e0e0e0"
          }" stroke="#444"/>`;
        }).join("\n");
        return `<svg width="120" height="60">${bars}</svg>`;
      }

      if (shape === "square") {
        const cols = Math.ceil(Math.sqrt(d));
        const rows = Math.ceil(d / cols);
        const cellSize = 30;
        const grid = Array.from({ length: d }, (_, i) => {
          const x = (i % cols) * cellSize;
          const y = Math.floor(i / cols) * cellSize;
          return `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${
            i < n ? "#7b61ff" : "#e0e0e0"
          }" stroke="#444"/>`;
        }).join("\n");
        return `<svg width="${cols * cellSize}" height="${
          rows * cellSize
        }">${grid}</svg>`;
      }

      return null;
    })();

    return {
      type: "mcq",
      question,
      options: allOptions,
      answer: correctAnswer,
      hint: `Numerator (top): parts shaded = ${n}\nDenominator (bottom): total parts = ${d}`,
      explanation: [
        `A fraction shows how many parts of a whole are selected.`,
        `Numerator = shaded parts (${n}), Denominator = total parts (${d}).`,
        `So the fraction is **${n}/${d}**.`,
      ],
      svg, // raw SVG string (can be rendered with dangerouslySetInnerHTML)
    };
  },
  "A.2 ProperFractionQuestion": () => {
    const denominators = [2, 3, 4, 5, 6, 8];
    const correctAnswers = new Set();

    // Step 1: Generate multiple proper fractions (numerator < denominator)
    while (correctAnswers.size < 2) {
      const d = denominators[Math.floor(Math.random() * denominators.length)];
      const n = Math.floor(Math.random() * (d - 1)) + 1;
      correctAnswers.add(`${n}/${d}`);
    }

    // Step 2: Generate distractors (improper fractions: numerator >= denominator)
    const distractors = new Set();
    while (distractors.size < 2) {
      const d = denominators[Math.floor(Math.random() * denominators.length)];
      const n = Math.floor(Math.random() * (d + 3)) + d; // ensures n >= d
      const frac = `${n}/${d}`;
      if (!correctAnswers.has(frac)) {
        distractors.add(frac);
      }
    }

    const allOptions = [...correctAnswers, ...distractors];
    const [sampleCorrect] = [...correctAnswers]; // use one of them to build SVG

    const [nSvg, dSvg] = sampleCorrect.split("/").map(Number);

    // Step 3: SVG
    const boxWidth = 25;
    const shadedColor = "#4caf50";
    const unshadedColor = "#e0e0e0";

    const svgParts = [];
    for (let i = 0; i < dSvg; i++) {
      const fill = i < nSvg ? shadedColor : unshadedColor;
      svgParts.push(
        `<rect x="${
          i * boxWidth
        }" y="0" width="${boxWidth}" height="20" fill="${fill}" />`
      );
    }

    const svg = `<svg width="${
      dSvg * boxWidth
    }" height="20" xmlns="http://www.w3.org/2000/svg">
    ${svgParts.join("\n")}
    <rect x="0" y="0" width="${
      dSvg * boxWidth
    }" height="20" fill="none" stroke="#000"/>
  </svg>`;

    // Step 4: Return question object
    return {
      type: "mcq-multiple",
      question: "Which of the following are proper fractions? (multi-select)",
      options: allOptions.sort(() => Math.random() - 0.5), // shuffle
      answer: [...correctAnswers],
      hint: "A proper fraction has a numerator smaller than the denominator.",
      explanation: [
        `A **proper fraction** is where the numerator is less than the denominator.`,
        `For example, **${sampleCorrect}** means ${nSvg} parts out of ${dSvg} total.`,
        `Fractions like 5/4 or 8/6 are **improper** because the numerator is not smaller.`,
      ],
      svg,
    };
  },

  ImproperToMixedQuestion: () => {
    const denominators = [2, 3, 4, 5, 6];
    const d = denominators[Math.floor(Math.random() * denominators.length)];

    const n =
      Math.floor(Math.random() * 4 + 1) * d + Math.floor(Math.random() * d); // n ≥ d
    const whole = Math.floor(n / d);
    const remainder = n % d;

    const correctAnswer =
      remainder === 0 ? `${whole}` : `${whole} \\frac{${remainder}}{${d}}`;

    const distractors = new Set();

    while (distractors.size < 3) {
      let fakeWhole = whole + (Math.floor(Math.random() * 3) - 1);
      let fakeRem = (remainder + Math.floor(Math.random() * 3)) % d;
      if (fakeRem === 0 && fakeWhole === whole) continue;
      if (fakeWhole < 0 || (fakeWhole === whole && fakeRem === remainder))
        continue;
      const distractor =
        fakeRem === 0
          ? `${fakeWhole}`
          : `${fakeWhole} \\frac{${fakeRem}}{${d}}`;
      distractors.add(distractor);
    }

    const allOptions = [...distractors];
    allOptions.splice(Math.floor(Math.random() * 4), 0, correctAnswer);

    // SVG Generation 🍰
    const boxWidth = 25;
    const cakeHeight = 25;
    const wholeCakes = Math.floor(n / d);
    const remainderShaded = n % d;

    const svgParts = [];
    for (let i = 0; i < wholeCakes; i++) {
      svgParts.push(
        `<rect x="${i * (d * boxWidth + 5)}" y="0" width="${
          d * boxWidth
        }" height="${cakeHeight}" fill="#4caf50" stroke="#000"/>`
      );
    }

    if (remainderShaded > 0) {
      for (let j = 0; j < d; j++) {
        const fill = j < remainderShaded ? "#4caf50" : "#e0e0e0";
        svgParts.push(
          `<rect x="${
            wholeCakes * (d * boxWidth + 5) + j * boxWidth
          }" y="0" width="${boxWidth}" height="${cakeHeight}" fill="${fill}" stroke="#000" />`
        );
      }
      svgParts.push(
        `<rect x="${wholeCakes * (d * boxWidth + 5)}" y="0" width="${
          d * boxWidth
        }" height="${cakeHeight}" fill="none" stroke="#000"/>`
      );
    }

    const svg = `<svg width="${
      (wholeCakes + 1) * (d * boxWidth + 5)
    }" height="${cakeHeight}" xmlns="http://www.w3.org/2000/svg">
    ${svgParts.join("\n")}
  </svg>`;

    return {
      type: "mcq",
      latex: true,
      question: `What is $\\frac{${n}}{${d}}$ as a mixed number?`,
      options: allOptions.map((o) => `${o}`),
      answer: correctAnswer,
      hint: `Divide numerator by denominator: ${n} ÷ ${d} = ${whole} remainder ${remainder}`,
      explanation: [
        `Improper fraction means numerator ≥ denominator.`,
        `\\( ${n} \\div ${d} = ${whole} \\) remainder \\( ${remainder} \\)`,
        `So, \\( \\frac{${n}}{${d}} = ${whole} \\frac{${remainder}}{${d}} \\)`,
      ],
      svg,
    };
  },

  MixedToImproperQuestion: () => {
    const denominators = [2, 3, 4, 5, 6];
    const d = denominators[Math.floor(Math.random() * denominators.length)];
    const whole = Math.floor(Math.random() * 3 + 1); // 1–3
    const remainder = Math.floor(Math.random() * (d - 1)) + 1; // 1 to d-1

    const n = whole * d + remainder; // Improper numerator

    const correctAnswer = `\\frac{${n}}{${d}}`;

    // 🎯 Distractors
    const distractors = new Set();
    while (distractors.size < 3) {
      const fakeWhole = whole + (Math.floor(Math.random() * 3) - 1);
      const fakeRem = (remainder + Math.floor(Math.random() * 3)) % d;
      const fakeN = fakeWhole * d + fakeRem;
      const option = `\\frac{${fakeN}}{${d}}`;
      if (fakeN !== n && fakeN > 0) distractors.add(option);
    }

    const allOptions = [...distractors];
    allOptions.splice(Math.floor(Math.random() * 4), 0, correctAnswer);

    // 🎨 SVG
    const boxWidth = 25;
    const cakeHeight = 25;

    const svgParts = [];
    for (let i = 0; i < whole; i++) {
      svgParts.push(
        `<rect x="${i * (d * boxWidth + 5)}" y="0" width="${
          d * boxWidth
        }" height="${cakeHeight}" fill="#4caf50" stroke="#000"/>`
      );
    }

    for (let j = 0; j < d; j++) {
      const fill = j < remainder ? "#4caf50" : "#e0e0e0";
      svgParts.push(
        `<rect x="${
          whole * (d * boxWidth + 5) + j * boxWidth
        }" y="0" width="${boxWidth}" height="${cakeHeight}" fill="${fill}" stroke="#000" />`
      );
    }

    svgParts.push(
      `<rect x="${whole * (d * boxWidth + 5)}" y="0" width="${
        d * boxWidth
      }" height="${cakeHeight}" fill="none" stroke="#000"/>`
    );

    const svg = `<svg width="${
      (whole + 1) * (d * boxWidth + 5)
    }" height="${cakeHeight}" xmlns="http://www.w3.org/2000/svg">
    ${svgParts.join("\n")}
  </svg>`;

    return {
      type: "mcq",
      latex: true,

      question: `What is $${whole}\\frac{${remainder}}{${d}}$ as an improper fraction?`,

      options: allOptions,
      answer: correctAnswer,
      hint: `Use formula: (whole × denominator) + numerator = improper numerator → (${whole} × ${d}) + ${remainder} = ${n}`,
      explanation: [
        `To convert a mixed number to improper fraction:`,
        `\\( ${whole} \\frac{${remainder}}{${d}} = \\frac{${whole} \\times ${d} + ${remainder}}{${d}} = \\frac{${n}}{${d}} \\)`,
      ],
      svg,
    };
  },

  // Example usage:
  // const question = ordinalEmojiGenerator();
  // console.log(question);
};
