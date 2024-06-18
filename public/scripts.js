// Function to open game page
function openGamePage(gameId) {
    localStorage.setItem('selectedGame', gameId);
    if (gameId === 'game1') {
        window.location.href = 'game.html';
    } else if (gameId === 'game2') {
        window.location.href = 'cardgame.html';
    } else if (gameId === 'game3') {
        window.location.href = '/src/mini-games/snake/snake.html';
    } else if (gameId === 'game4') {
        window.location.href = '/src/mini-games/nfs/nfc.html';
    } else if (gameId === 'game5') {
        window.location.href = 'darts.html';
    }
}

// Function to load game data when page loads
window.onload = function () {
    const gameId = localStorage.getItem('selectedGame');
    if (gameId) {
        const gameData = {
            game1: {
                title: 'Game 1',
                image: 'game1.png',
                description: 'This is the description for Game 1.',
            },
            game2: {
                title: 'Game 2',
                image: 'game2.png',
                description: 'This is the description for Game 2.',
            },
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
        .then((response) => response.json())
        .then((data) => {
            document.getElementById('question-title').innerText = 'Question of the Day';
            document.getElementById('question-text').innerText = data.question;
        })
        .catch((error) => {
            document.getElementById('question-title').innerText = 'Error';
            document.getElementById('question-text').innerText = 'Failed to fetch the question of the day.';
            console.error('Error fetching question of the day:', error);
        });

    // Fetch and display all questions
    fetch('/get_all_questions')
        .then((response) => response.json())
        .then((data) => {
            const questionList = document.getElementById('questionList');
            questionList.innerHTML = '';

            data.questions.sort((a, b) => a.question.localeCompare(b.question)).forEach((question) => {
                const li = document.createElement('li');
                li.innerText = question.question;
                li.onclick = () => {
                    window.location.href = `find.html?id=${question.id}`;
                };
                questionList.appendChild(li);
            });
        })
        .catch((error) => {
            console.error('Error fetching questions:', error);
        });

    // Add event listeners for search form
    document.getElementById('searchForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const searchParams = {
            query: document.getElementById('searchInput').value,
            category: document.getElementById('searchCategory').value,
        };
        try {
            const response = await fetch('/search_questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(searchParams),
            });

            if (response.ok) {
                const questions = await response.json();
                displaySearchResults(questions);
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

    // Fetch and display the search results
    function displaySearchResults(questions) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';

        questions.forEach((question) => {
            const questionDiv = document.createElement('div');
            questionDiv.innerHTML = `
                <p>Question: ${question.question}</p>
                <p>Type: ${question.type}</p>
                <p>Category: ${question.category}</p>
                <button onclick="showQuestionDetails('${question.id}', '${question.question}', '${question.creator}', '${question.answer}')">Select</button>
            `;
            resultsDiv.appendChild(questionDiv);
        });
    }

    // Display the question details
    window.showQuestionDetails = function (questionId, questionText, creator, answer) {
        document.getElementById('questionText').innerText = questionText;
        document.getElementById('questionAuthor').innerText = creator;
        document.getElementById('question-details').style.display = 'block';
        document.getElementById('result').innerText = '';

        window.correctAnswer = answer;
        window.questionId = questionId;
    };
};

// Function to check the answer and increment answer count if correct
function checkAnswer() {
    const userAnswer = document.getElementById('userAnswer').value;
    const resultDiv = document.getElementById('result');

    if (userAnswer === window.correctAnswer) {
        resultDiv.innerText = 'Correct!';
        resultDiv.style.color = 'green';
        incrementAnswerCount(window.questionId); // Increment answer count when the correct answer is given
    } else {
        resultDiv.innerText = 'Incorrect!';
        resultDiv.style.color = 'red';
    }
}

// Increment answer count
function incrementAnswerCount(questionId) {
    fetch('/increment_answer_count', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_id: questionId }),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log('Answer count incremented:', data);
        document.getElementById('answerCount').innerText = data.answer_count;
    })
    .catch((error) => {
        console.error('Error incrementing answer count:', error);
    });
}

// Rate question
function rateQuestion(questionId, userId, rate) {
    fetch('/rate_question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_id: questionId, user_id: userId, rate }),
    })
    .then((response) => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then((data) => {
        console.log('Question rated successfully:', data);
        document.getElementById('currentRating').innerText = parseFloat(data.total_rating).toFixed(2);
        document.getElementById('ratingCount').innerText = data.rating_count;
    })
    .catch((error) => {
        console.error('Error rating question:', error);
        alert('Error rating question: ' + error.message);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const rateButtons = document.querySelectorAll('.rate-button');
    rateButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const rate = button.getAttribute('data-rate');
            const userId = localStorage.getItem('user_id');
            rateQuestion(window.questionId, userId, rate);
        });
    });

    const urlParams = new URLSearchParams(window.location.search);
    const questionId = urlParams.get('id');

    if (questionId) {
        fetch(`/get_question_by_id?id=${questionId}`)
            .then((response) => response.json())
            .then((data) => {
                document.getElementById('questionText').innerText = data.question;
                document.getElementById('questionAuthor').innerText = data.creator;
                document.getElementById('answerCount').innerText = data.answer_count;
                document.getElementById('currentRating').innerText = data.total_rating;
                document.getElementById('ratingCount').innerText = data.rating_count;
                window.correctAnswer = data.answer;
            })
            .catch((error) => {
                console.error('Error fetching question details:', error);
                alert('Error fetching question details');
            });
    }
});

// Fetch user data and display on user.html
function loadUserProfile() {
    const username = localStorage.getItem('username');
    document.getElementById('username').innerText = username;

    fetch(`/get_user_questions?username=${username}`)
        .then(response => response.json())
        .then(data => {
            const userQuestionsList = document.getElementById('userQuestions');
            userQuestionsList.innerHTML = '';

            data.questions.forEach(question => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="find.html?id=${question.id}">${question.question}</a>`;
                userQuestionsList.appendChild(li);
            });

            // Display the user's password (for demonstration purposes only, not recommended for production)
            document.getElementById('password').innerText = data.password;
        })
        .catch(error => {
            console.error('Error fetching user questions:', error);
        });
}

// Call the function when the user.html page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadUserProfile);
} else {
    loadUserProfile();
}

// Function to handle registration without page refresh
document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form submission from refreshing the page

    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem('registered', true);
        localStorage.setItem('username', username);
        document.getElementById('blackout').style.display = 'none';
        document.getElementById('registration-form').style.display = 'none';
        alert('Registration successful!');
    })
    .catch(error => {
        console.error('Error registering user:', error);
        alert('Error registering user: ' + error.message);
    });
});

// Function to handle login without page refresh
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form submission from refreshing the page

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem('registered', true);
        localStorage.setItem('username', username);
        localStorage.setItem('user_id', data.id); // Store the user ID
        document.getElementById('blackout').style.display = 'none';
        document.getElementById('registration-form').style.display = 'none';
        alert('Login successful!');
    })
    .catch(error => {
        console.error('Error logging in user:', error);
        alert('Error logging in user: ' + error.message);
    });
});

function logout() {
    localStorage.removeItem('registered');
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    document.getElementById('registration-form').style.display = 'block';
    document.getElementById('logout-button').style.display = 'none';
    alert('You have been logged out.');
}

function toggleForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const formTitle = document.getElementById('form-title');
    const formToggle = document.querySelector('.form-toggle');

    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        formTitle.textContent = 'Login';
        formToggle.textContent = "Don't have an account? Register here.";
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        formTitle.textContent = 'Register';
        formToggle.textContent = "Already have an account? Login here.";
    }
}

// Show logout button if user is already logged in
if (localStorage.getItem('registered')) {
    document.getElementById('registration-form').style.display = 'none';
    document.getElementById('logout-button').style.display = 'block';
}
