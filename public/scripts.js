// Функция для открытия страницы игры
function openGamePage(gameId) {
    localStorage.setItem('selectedGame', gameId);
    if (gameId === 'game1') {
        window.location.href = 'game.html';
    } else if (gameId === 'game2') {
        window.location.href = 'cardgame.html';
    } else if (gameId === 'game3') {
        window.location.href =  '/src/mini-games/snake/snake.html';
    }  else if (gameId === 'game4') {
        window.location.href = '/src/mini-games/nfs/nfc.html';
    }  else if (gameId === 'game5') {
        window.location.href = 'darts.html';
    }
}

// Функция для загрузки данных игры при загрузке страницы
window.onload = function() {
    // Проверка регистрации пользователя
    if (!localStorage.getItem('registered')) {
        document.getElementById('registration-form').style.display = 'block';
    }

    const gameId = localStorage.getItem('selectedGame');
    if (gameId) {
        const gameData = {
            'game1': {
                title: 'Game 1',
                image: 'game1.png',
                description: 'This is the description for Game 1.'
            },
            'game2': {
                title: 'Game 2',
                image: 'game2.png',
                description: 'This is the description for Game 2.'
            }
            // Add more game data here
        };

        const game = gameData[gameId];
        if (game) {
            document.getElementById('game-title').innerText = game.title;
            document.getElementById('game-image').src = game.image;
            document.getElementById('game-description').innerText = game.description;
        }
    }

    // Fetch and display the question of the day
    fetch('/get_question_of_the_day')
        .then(response => response.json())
        .then(data => {
            document.getElementById('question-title').innerText = "Question of the Day";
            document.getElementById('question-text').innerText = data.question;
        })
        .catch(error => {
            document.getElementById('question-title').innerText = "Error";
            document.getElementById('question-text').innerText = "Failed to fetch the question of the day.";
            console.error('Error fetching question of the day:', error);
        });

    // Fetch and display all questions
    fetch('/get_all_questions')
        .then(response => response.json())
        .then(data => {
            const questionList = document.getElementById('questionList');
            questionList.innerHTML = '';

            data.questions.sort((a, b) => a.question.localeCompare(b.question)).forEach(question => {
                const li = document.createElement('li');
                li.innerText = question.question;
                li.onclick = () => {
                    window.location.href = `find.html?id=${question.id}`;
                };
                questionList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
        });
};

// Функция для фильтрации вопросов в списке
function filterQuestions() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const ul = document.getElementById('questionList');
    const li = ul.getElementsByTagName('li');

    for (let i = 0; i < li.length; i++) {
        const txtValue = li[i].textContent || li[i].innerText;
        if (txtValue.toLowerCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

// Обработка формы регистрации
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log('Registering user:', username);  // Отладочная информация

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        console.log('Registration response status:', response.status);  // Отладочная информация
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        console.log('Registration successful:', data);  // Отладочная информация
        localStorage.setItem('registered', true);
        localStorage.setItem('username', username);
        document.getElementById('blackout').style.display = 'none';
        document.getElementById('registration-form').style.display = 'none';
    })
    .catch(error => {
        console.error('Error registering user:', error);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const searchParams = {
            category: document.getElementById('searchCategory').value,
            type: document.getElementById('searchType').value
        };

        try {
            const response = await fetch('/search_questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(searchParams)
            });

            if (response.ok) {
                const questions = await response.json();
                displayResults(questions);
            } else {
                const errorText = await response.text();
                console.error('Failed to fetch questions:', errorText);
                alert(`Failed to fetch questions: ${errorText}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`An error occurred: ${error.message}`);
        }
    });

    function displayResults(questions) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';

        questions.forEach(question => {
            const questionDiv = document.createElement('div');
            questionDiv.innerHTML = `
                <p>Question: ${question.question}</p>
                <p>Type: ${question.type}</p>
                <p>Category: ${question.category}</p>
                <button onclick="showQuestionDetails('${question.question}', '${question.creator}', '${question.answer}')">Select</button>
            `;
            resultsDiv.appendChild(questionDiv);
        });
    }

    function showQuestionDetails(questionText, creator, answer) {
        document.getElementById('questionText').innerText = questionText;
        document.getElementById('questionAuthor').innerText = creator;
        document.getElementById('question-details').style.display = 'block';
        document.getElementById('result').innerText = '';

        window.correctAnswer = answer;
    }

    function checkAnswer() {
        const userAnswer = document.getElementById('userAnswer').value;
        const resultDiv = document.getElementById('result');

        if (userAnswer === window.correctAnswer) {
            resultDiv.innerText = 'Correct!';
            resultDiv.style.color = 'green';
        } else {
            resultDiv.innerText = 'Incorrect!';
            resultDiv.style.color = 'red';
        }
    }

    window.showQuestionDetails = showQuestionDetails;
    window.checkAnswer = checkAnswer;
});

function incrementAnswerCount(questionId) {
    fetch('/increment_answer_count', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_id: questionId })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Answer count incremented:', data);
        // Optionally update the UI to reflect the new answer count
    })
    .catch(error => {
        console.error('Error incrementing answer count:', error);
    });
}

function rateQuestion(questionId, userId, rate) {
    fetch('/rate_question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_id: questionId, user_id: userId, rate })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Question rated successfully:', data);
        // Optionally update the UI to reflect the new rating
    })
    .catch(error => {
        console.error('Error rating question:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const rateButtons = document.querySelectorAll('.rate-button');
    rateButtons.forEach(button => {
        button.addEventListener('click', () => {
            const questionId = button.getAttribute('data-question-id');
            const userId = localStorage.getItem('user_id'); // Assuming user ID is stored in localStorage
            const rate = button.getAttribute('data-rate');
            rateQuestion(questionId, userId, rate);
        });
    });
});
