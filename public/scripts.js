function openGamePage(gameId) {
    localStorage.setItem('selectedGame', gameId);
    window.location.href = 'game.html';
}

window.onload = function() {
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
};
