import readJSON from './readJSON.js';

export default function getRandomQuestion() {
    const questions = readJSON('src/main_game/fixtures/questions.json');
    const randomQuestionIndex = Math.floor(Math.random() * questions.length);
    console.log(randomQuestionIndex);
    console.log(questions[randomQuestionIndex]);
    return questions[randomQuestionIndex];
}

getRandomQuestion();