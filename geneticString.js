const math = Math;
const goalString = 'Politecnico Colombiano Jaime Isaza Cadavid';
const wordsLenght = goalString.length;
const maxGenerations = 1000;

// population and population count
const lettersPopulation = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghjiklmnopqrstuvwxyz,!? 0123456789'.split('');
const populationCount = lettersPopulation.length;

// amount of childrens created by generation
const childrenPerGeneration = 20;

//count of created generations
let generations = 0;
let parents = [
  {
    value: undefined,
    score: Number.NEGATIVE_INFINITY
  },
  {
    value: undefined,
    score: Number.NEGATIVE_INFINITY
  }
]

// returns random position index within 0 and goalString length
const getRandomPosition = () => math.floor(math.random() * wordsLenght);

// increase generation count
const increaseGenerationCount = () => { generations += 1; };

// gets a random value from population
const getRandomLetter = () => lettersPopulation[math.floor(math.random() * populationCount)];

// Returns an array with the letters that are in goalString and
// that are missing from lettersPopulation
const filterGoalStringWithPopulation = () => (
  goalString.split('').reduce((notInPopulation, letter) => (
    lettersPopulation.includes(letter) ? notInPopulation : [...notInPopulation, letter]
  ), [])
);

// compares a word with goalString
// compares distances in ASCII code for each character
// search for similar groups whith the two words
// the higher the score the better the word
const getWordScore = (string) => {
  const diffWithGoal = string.split('').reduce((distanceWithGoal, letter, index) => (
    distanceWithGoal + math.abs(letter.charCodeAt() - goalString.charCodeAt(index))
  ), 0);

  const similarCharsWithGoal = string.split('').reduce((score, _, index) => {
    const areSimilar = (string.substring(index, index + 1) == goalString.substring(index, index + 1));
    return areSimilar ? score + 200 : score;
  }, 0);

  return similarCharsWithGoal - diffWithGoal;
};

// returns the initial array generation with randomly generated words w/ same lenght as goalString
const createInitialStringGeneration = () => {
  increaseGenerationCount();
  const initialGeneration = [];

  for (let i = 0; i < childrenPerGeneration; i += 1) {
    const randomString = goalString.split('').map(() => getRandomLetter()).join('');
    initialGeneration.push(randomString);
  }

  return initialGeneration;
};

// Find bests children
// receives a generation array
const findBestsChildren = (generation) => {
  const sortedChildren = [...generation]
    .map((child) => ({ value: child, score: getWordScore(child) }))
    .sort((word1, word2) => word2.score - word1.score);
  const [bestChild, secondBestChild] = sortedChildren;

  return [bestChild, secondBestChild];
};

// Receives a generatios, look for the best two children and
// compares the result with the current parrents, the best scores will
// become the new parents
const updateParents = (generation) => {
  const [bestChild, secondBestChild] = findBestsChildren(generation);

  const comparedParentsWithNewChildren = [...parents, bestChild, secondBestChild].sort((child1, child2) => child2.score - child1.score);

  console.table(comparedParentsWithNewChildren)
  parents = comparedParentsWithNewChildren.slice(0, 2);
};

// returns a mutated string with a probability of 80%
const mutate = (string) => {
  // the 20% of the times string is not mutated
  if (math.random() < 0.20) { return string; }

  // the 80% of the times mutate a random letter
  const stringArray = string.split('');
  const randomLetter = getRandomPosition();

  stringArray[randomLetter] = getRandomLetter();
  return stringArray.join('');
};

// returns new generation, params must be the current parents
const crossParents = () => {
  const [firstParent, secondParent] = parents
  console.log(firstParent, secondParent)
  increaseGenerationCount();
  const nextGeneration = [['crossValue1', 'crossValue2', 'child', 'childMutated']]

  for (let i = 0; i < childrenPerGeneration; i += 1) {
    const randomCrossValue = getRandomPosition();
    const isFirstHalf = i < (childrenPerGeneration / 2);
    const firstChild = isFirstHalf ? firstParent : secondParent;
    const secondChild = !isFirstHalf ? firstParent : secondParent;

    const crossedValue1 = firstChild.value.substring(0, randomCrossValue);
    const crossedValue2 = secondChild.value.substring(randomCrossValue, wordsLenght);

    const crossedChild = crossedValue1 + crossedValue2;
    const mutatedChild = mutate(crossedChild);
    nextGeneration.push([crossedValue1, crossedValue2, crossedChild, mutatedChild])
  }

  return nextGeneration.slice(1).map((item) => item[3])
  // return nextGeneration;
};

// Stop criteria, return true when goalString was reached or then max generations have been created
const shouldStop = () => ((generations === maxGenerations) || (parents[0].value === goalString));

const main = () => {
  const initialStringGeneration = createInitialStringGeneration();

  let currentGeneration = initialStringGeneration;

  do {
    updateParents(currentGeneration);
    currentGeneration = crossParents(parents);
  } while (!shouldStop());

  console.log('generations: ', generations);
};

main();