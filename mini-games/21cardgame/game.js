const cards = [
    { value: '2', suit: 'Hearts', image: 'images/2.png' },
    { value: '3', suit: 'Hearts', image: 'images/3.png' },
    { value: '4', suit: 'Hearts', image: 'images/4.png' },
    { value: '5', suit: 'Hearts', image: 'images/5.png' },
    { value: '6', suit: 'Hearts', image: 'images/6.png' },
    { value: '7', suit: 'Hearts', image: 'images/7.png' },
    { value: '8', suit: 'Hearts', image: 'images/8.png' },
    { value: '9', suit: 'Hearts', image: 'images/9.png' },
    { value: '10', suit: 'Hearts', image: 'images/10.png' },
    { value: 'J', suit: 'Hearts', image: 'images/j.png' },
    { value: 'Q', suit: 'Hearts', image: 'images/q.png' },
    { value: 'K', suit: 'Hearts', image: 'images/k.png' },
    { value: 'A', suit: 'Hearts', image: 'images/A.png' },
    // Другие карты для мастей Diamonds, Clubs и Spades
];

const game = {
    deck: [],
    players: {
        player: [],
        dealer: []
    },
    message: document.getElementById('message'),
    playerHand: document.getElementById('player-hand'),
    dealerHand: document.getElementById('dealer-hand'),
    hitButton: document.getElementById('hit-button'),
    standButton: document.getElementById('stand-button'),
    dealButton: document.getElementById('deal-button'),
    cards: cards,

    initializeDeck() {
        for (let card of this.cards) {
            this.deck.push(card);
        }
    },

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    },

    dealCard() {
        return this.deck.pop();
    },

    calculateHandValue(hand) {
        let sum = 0;
        let hasAce = false;
        for (let card of hand) {
            if (card.value === 'A') {
                hasAce = true;
            }
            if (card.value === 'J' || card.value === 'Q' || card.value === 'K') {
                sum += 10;
            } else if (card.value !== 'A') {
                sum += parseInt(card.value);
            }
        }
        if (hasAce) {
            if (sum + 11 <= 21) {
                sum += 11;
            } else {
                sum += 1;
            }
        }
        return sum;
    },

    displayCard(hand, element) {
        const card = document.createElement('img');
        card.classList.add('card');
        card.src = hand.image;
        element.appendChild(card);
    },

    displayMessage(message) {
        this.message.textContent = message;
    },

    clearHands() {
        this.playerHand.innerHTML = '';
        this.dealerHand.innerHTML = '';
    },

    dealInitialCards() {
        this.clearHands();
        for (let i = 0; i < 2; i++) {
            this.players.player.push(this.dealCard());
            this.players.dealer.push(this.dealCard());
        }
        this.displayCard(this.players.player[0], this.playerHand);
        this.displayCard(this.players.player[1], this.playerHand);
        this.displayCard(this.players.dealer[0], this.dealerHand);
        this.displayMessage('Ваш ход. Выберите "Взять" или "Хватит".');
    },

    init() {
        this.initializeDeck();
        this.shuffleDeck();
        this.dealButton.addEventListener('click', () => this.dealInitialCards());
        this.hitButton.addEventListener('click', () => this.hit());
        this.standButton.addEventListener('click', () => this.stand());
    },

    hit() {
        this.players.player.push(this.dealCard());
        this.displayCard(this.players.player[this.players.player.length - 1], this.playerHand);
        const playerValue = this.calculateHandValue(this.players.player);
        if (playerValue > 21) {
            this.displayMessage('Вы проиграли!');
        } else if (playerValue === 21) {
            this.displayMessage('Поздравляем! Вы выиграли!');
        }
    },

    stand() {
        while (this.calculateHandValue(this.players.dealer) < 17) {
            this.players.dealer.push(this.dealCard());
            this.displayCard(this.players.dealer[this.players.dealer.length - 1], this.dealerHand);
        }
        const playerValue = this.calculateHandValue(this.players.player);
        const dealerValue = this.calculateHandValue(this.players.dealer);
        if (dealerValue > 21 || playerValue > dealerValue) {
            this.displayMessage('Поздравляем! Вы выиграли!');
        } else if (playerValue === dealerValue) {
            this.displayMessage('Ничья!');
        } else {
            this.displayMessage('Вы проиграли!');
        }
    }
};

game.init();
