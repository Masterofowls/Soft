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
    } else {
        showMainContent();

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
    }
};

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
        document.getElementById('registration-form').style.display = 'none';
        showMainContent();
    })
    .catch(error => {
        console.error('Error registering user:', error);
    });
});

// Функция для показа основного контента
function showMainContent() {
    document.querySelector('.header').style.display = 'block';
    document.querySelector('.main').style.display = 'block';
    document.querySelector('.footer').style.display = 'block';
}

// Функция для открытия всплывающего окна поиска вопросов
function openSearchPopup() {
    fetch('/get_all_questions')
        .then(response => response.json())
        .then(data => {
            const questionList = document.getElementById('questionList');
            questionList.innerHTML = '';

            data.questions.sort((a, b) => a.question.localeCompare(b.question)).forEach(question => {
                const li = document.createElement('li');
                li.innerText = question.question;
                li.onclick = () => {
                    window.location.href = `/question/${question.id}`;
                };
                questionList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
        });

    document.getElementById('search-popup').style.display = 'block';
}

// Функция для закрытия всплывающего окна поиска вопросов
function closeSearchPopup() {
    document.getElementById('search-popup').style.display = 'none';
}

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
