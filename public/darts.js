let totalScore = 0;
let throwsLeft = 3;
const winningScore = 100; // Set the required score to win

document.getElementById('playButton').addEventListener('click', playGame);
document.getElementById('restartButton').addEventListener('click', restartGame);

function playGame() {
    if (throwsLeft > 0) {
        const target = document.getElementById('target');
        const animation = document.getElementById('animation');
        const result = document.getElementById('result');
        const playButton = document.getElementById('playButton');
        const restartButton = document.getElementById('restartButton');

        // Hide the target, play button, and result
        target.style.display = 'none';
        playButton.style.display = 'none';
        result.style.display = 'none';
        restartButton.style.display = 'none';

        // Show the video animation
        animation.style.display = 'block';
        animation.play();

        // Handle video end event
        animation.onended = () => {
            animation.style.display = 'none';
            
            // Generate a random score between 0 and 50
            const score = Math.floor(Math.random() * 51);
            totalScore += score;
            throwsLeft -= 1;

            // Show the target and result
            target.style.display = 'block';
            result.style.display = 'block';

            if (throwsLeft > 0) {
                playButton.style.display = 'block';
                result.textContent = `You scored: ${score}. Total score: ${totalScore}. Throws left: ${throwsLeft}`;
            } else {
                // Determine win or lose
                if (totalScore >= winningScore) {
                    result.textContent = `You scored: ${score}. Total score: ${totalScore}. You Win!`;
                } else {
                    result.textContent = `You scored: ${score}. Total score: ${totalScore}. You Lose.`;
                }
                playButton.style.display = 'none';
                restartButton.style.display = 'block';
            }
        };
    }
}

function restartGame() {
    totalScore = 0;
    throwsLeft = 3;
    document.getElementById('result').textContent = `Total score: 0`;
    document.getElementById('playButton').style.display = 'block';
    document.getElementById('playButton').disabled = false;
    document.getElementById('restartButton').style.display = 'none';
}
