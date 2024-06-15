document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const questionId = urlParams.get('id');

    if (questionId) {
        fetch(`/get_question_by_id?id=${questionId}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('questionText').innerText = data.question;
                document.getElementById('questionAuthor').innerText = data.creator;
                window.correctAnswer = data.answer;
            })
            .catch(error => {
                console.error('Error fetching question details:', error);
            });
    }
});

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
