import rds from 'readline-sync';
import writeJSON from './writeJSON.js';
import readJSON from './readJSON.js';

export default function writeQuestion(user) {
    const questions = readJSON('src/main_game/fixtures/questions.json');
    const questionObject = {
        reports: 0,
        stars: 0,
        question: rds.question('Your question: '),
        type: ['string', 'boolean', 'number'][rds.keyInSelect(['string', 'boolean', 'number'], 'Type of the question: ')] || 'string',
        author: user.name,
    };
    console.log(questionObject.type);
    questionObject.correctAnswer = questionObject.type === 'string' ? rds.question('Correct answer: ') : questionObject.type === 'number' ? +rds.question('Correct answer: ') : [true, false][rds.keyInSelect([true, false], 'Correct answer: ')];
    questionObject.answers = rds.question('Answers for the question (please separate answers with comma): ').split(',') || [];
    const duplicateQuestions = questions.filter((question) => question.question === questionObject.question);
    console.log(questionObject);
    if (duplicateQuestions.length > 0) {
        console.log(`Duplicate question(s) found: ${duplicateQuestions}`);
        console.log('Please input a different question.');
    } else {
    questions.push(questionObject);
    writeJSON('src/main_game/fixtures/questions.json', questions);
    console.log(readJSON('src/main_game/fixtures/questions.json'));
    }
}

writeQuestion({name: 'Dima'});