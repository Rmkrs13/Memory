document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.querySelector('.memory-game');
    const movesCounter = document.getElementById('moves');
    const failsCounter = document.getElementById('fails');
    const gamesPlayedCounter = document.getElementById('gamesPlayed');
    const timerDisplay = document.getElementById('timer');
    const restartButton = document.getElementById('restart');
    let moves = 0;
    let gamesPlayed = parseInt(localStorage.getItem('gamesPlayed'), 10) || 0;
    let lockBoard = false;
    let firstCard, secondCard;
    let gameTimer;
    let seconds = 0;

    function updateGamesPlayed() {
        gamesPlayed++;
        localStorage.setItem('gamesPlayed', gamesPlayed.toString());
        gamesPlayedCounter.innerText = gamesPlayed;
    }

    function createCards() {
        gameContainer.innerHTML = '';
        let images = [];
        for (let i = 1; i <= 9; i++) {
            images.push(i, i);
        }
        
        images = images.sort(() => 0.5 - Math.random());

        images.forEach((image) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.image = image;
            cardElement.innerHTML = `
                <img class="front-face" src="images/${image}.png" />
                <img class="back-face" src="images/back.png" />`;
            cardElement.addEventListener('click', flipCard);
            gameContainer.appendChild(cardElement);
        });
    }

    function revealCardsTemporarily() {
        document.querySelectorAll('.card').forEach(card => card.classList.add('flipped'));
        setTimeout(() => {
            document.querySelectorAll('.card').forEach(card => card.classList.remove('flipped'));
        }, 10000);
    }

    function flipCard() {
        if (lockBoard || this.classList.contains('flipped')) return;

        if (!firstCard) {
            firstCard = this;
            firstCard.classList.add('flipped');
        } else {
            secondCard = this;
            prepareSecondCard();
        }
    }

    function prepareSecondCard() {
        if (firstCard.dataset.image === secondCard.dataset.image) {
            // Vervang de tweede kaart voordat deze wordt omgedraaid
            let newImages = Array.from({length: 9}, (_, i) => i + 1).filter(i => i.toString() !== firstCard.dataset.image);
            let newImage = newImages[Math.floor(Math.random() * newImages.length)];
            secondCard.dataset.image = newImage;
            secondCard.querySelector('.front-face').src = `images/${newImage}.png`;
        }
        secondCard.classList.add('flipped');
        updateMoveAndFailCounters();
        setTimeout(resetBoard, 1500);
    }

    function updateMoveAndFailCounters() {
        moves++;
        movesCounter.innerText = moves;
        failsCounter.innerText = moves; // Elke move resulteert in een 'fail'
    }

    function resetBoard() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
        document.querySelectorAll('.card').forEach(card => card.classList.remove('flipped'));
    }

    function startTimer() {
        clearInterval(gameTimer);
        seconds = 0;
        gameTimer = setInterval(() => {
            seconds++;
            let mins = Math.floor(seconds / 60);
            let secs = seconds % 60;
            timerDisplay.innerText = `${mins}:${secs.toString().padStart(2, '0')}`;
        }, 1000);
    }

    function startGame() {
        moves = 0;
        movesCounter.innerText = moves;
        failsCounter.innerText = moves;
        updateGamesPlayed();
        createCards();
        revealCardsTemporarily();
        startTimer();
    }

    restartButton.addEventListener('click', startGame);

    gamesPlayedCounter.innerText = gamesPlayed;
    startGame(); // Start het spel wanneer de pagina wordt geladen
});
