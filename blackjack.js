
class Blackjack {
    constructor() {
        this.deck = [];
        this.hidden;
        this.yourSum = 0;
        this.yourAceCount = 0;
        this.dealerSum = 0;
        this.dealerAceCount = 0;
        this.canHit = true;
    }

    createGame() {
        this.buildDeck();
        this.shuffleDeck();
        this.startGame();
    }

    buildDeck() {
        // Build Deck of Cards
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const types = ['C', 'H', 'S', 'D'];

        for (let i = 0; i < types.length; i++) {
            for (let j = 0; j < values.length; j++) {
                this.deck.push(values[j] + '-' + types[i]);
            }
        }
    }

    shuffleDeck() {
        // Shuffle Deck for Every Turn
        for (let i = 0; i < this.deck.length; i++) {
            let j = Math.floor(Math.random() * this.deck.length);
            let temp = this.deck[i];
            this.deck[i] = this.deck[j];
            this.deck[j] = temp;
        }
    }

    startGame() {
        // Create hidden dealer's card
        this.hidden = this.deck.pop();
        this.dealerSum += this.getValue(this.hidden);
        this.dealerAceCount += this.checkAce(this.hidden);
        
        // if the sum of dealer cards is less than 17 add another card
        while (this.dealerSum < 17) {
            let cardImg = document.createElement('img');
            let card = this.deck.pop();
            cardImg.src = './cards/' + card + '.png';
            this.dealerSum += this.getValue(card);
            this.dealerAceCount += this.checkAce(card);
            document.getElementById('dealer-cards').append(cardImg);
        }

        // Create 2 starter cards for Player
        for (let i = 0; i < 2; i++) {
            let cardImg = document.createElement('img');
            let card = this.deck.pop();
            cardImg.src = './cards/' + card + '.png';
            this.yourSum += this.getValue(card);
            this.yourAceCount += this.checkAce(card);
            document.getElementById('your-cards').append(cardImg);
        }

        // Add Event Listeners for Buttons --- hit for another card and stay for finish game
        document.getElementById('hit').addEventListener('click', () => this.hit());
        document.getElementById('stay').addEventListener('click', () => this.stay());
        document.getElementById('restart').addEventListener('click', () => this.resetGame());
    }

    getValue(card) {
        let data = card.split('-');
        let value = data[0];

        if (isNaN(value)) {
            if (value == 'A') {
                // if any player have A card and sum of cards under or equal to 21, A value is 11
                return 11;
            }
            // Other cards greater than 9 have value of 10
            return 10;
        }
        return parseInt(value);
    }

    checkAce(card) {
        if (card[0] === 'A') {
            // On every ace 1+
            return 1;
        }
        return 0;
    }

    hit() {
        if (!this.canHit) {
            return;
        }

        // Adding another card on clicked Hit button
        let cardImg = document.createElement('img');
        let card = this.deck.pop();
        cardImg.src = './cards/' + card + '.png';
        this.yourSum += this.getValue(card);
        this.yourAceCount += this.checkAce(card);
        document.getElementById('your-cards').append(cardImg);
        
        // If our sum is greater than 21 disable hit Button
        if (this.reduceAce(this.yourSum, this.yourAceCount) > 21) {
            this.canHit = false;
        }
    }

    stay() {
        this.dealerSum = this.reduceAce(this.dealerSum, this.dealerAceCount);
        this.yourSum = this.reduceAce(this.yourSum, this.yourAceCount);

        this.canHit = false;
        document.getElementById('hidden').src = './cards/' + this.hidden + '.png';

        // Check for Winner
        let message = '';
        if (this.dealerSum === this.yourSum) {
            message = 'Tie!';
        } else if (this.yourSum > 21) {
            message = 'You Lose!';
        } else if (this.dealerSum > 21) {
            message = 'You Win!';
        } else if (this.yourSum > this.dealerSum) {
            message = 'You Win!';
        } else if (this.yourSum < this.dealerSum) {
            message = 'You Lose!';
        }

        // Add Scores
        document.getElementById('dealer-sum').textContent = this.dealerSum;
        document.getElementById('your-sum').textContent = this.yourSum;
        document.getElementById('results').textContent = message;
    }

    reduceAce(playerSum, playerAceCount) {
        // if sum is greater than 21 and we have ace reduce player sum by 10 points
        if (playerSum > 21 && playerAceCount > 0) {
            playerSum -= 10;
            playerAceCount -= 1;
        }
        return playerSum;
    }

    resetGame() {
        this.deck = [];
        this.hidden;
        this.yourSum = 0;
        this.yourAceCount = 0;
        this.dealerSum = 0;
        this.dealerAceCount = 0;
        this.canHit = true;
        document.getElementById('dealer-cards').innerHTML = `<img id="hidden" src="./cards/BACK.png">`;
        document.getElementById('your-cards').innerHTML = "";
        document.getElementById('dealer-sum').textContent = '';
        document.getElementById('your-sum').textContent = '';
        let message = '';
        document.getElementById('results').textContent = message;
        this.createGame();
      }
}

// On load
let game = new Blackjack();
game.createGame();

