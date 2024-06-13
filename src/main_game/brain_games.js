import rds from 'readline-sync';

export default function gameProccess() {
  console.log('Welcome to the Brain Games!');
  if (questions.length !== 0) {
    const randomQuestion = getRandomQuestion();
    console.log(`Random Question: ${randomQuestion.question}`);
    const userAnswer = rds.question('Your answer: ');
    if (userAnswer === String(randomQuestion.correctAnswer)) {
      console.log('Correct!');
    } else {
      console.log(`'${userAnswer}' is wrooooong! Correct answer was '${randomQuestion.correctAnswer}'.`);
    }
  }
  return randomQuestion || {
    question: 'Question not found',};
}