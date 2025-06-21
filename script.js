document.addEventListener('DOMContentLoaded', () => {
    const textToTypeElement = document.getElementById('text-to-type');
    const userInputElement = document.getElementById('user-input');
    const timerElement = document.getElementById('timer');
    const errorsElement = document.getElementById('errors');
    const bestTimeElement = document.getElementById('best-time');
    const resetBtn = document.getElementById('reset-btn');

    const phrases = [
        "The speed of thought is great, but the speed of light is even greater.",
        "Programming is the art of organizing complexity.",
        "The best way to predict the future is to create it.",
        "The more I learn, the more I realize how little I know.",
        "Success is not a final point, but the ability to move from failure to failure without loss of enthusiasm."
    ];

    let timer;
    let startTime;
    let currentPhrase = '';
    let errors = 0;

    function getRandomPhrase() {
        return phrases[Math.floor(Math.random() * phrases.length)];
    }

    function updateBestTime() {
        const bestTime = localStorage.getItem('bestTypingTime');
        if (bestTime) {
            bestTimeElement.textContent = `${bestTime}s`;
        }
    }

    function resetGame() {
        clearInterval(timer);
        timer = null;
        startTime = null;
        errors = 0;
        
        currentPhrase = getRandomPhrase();
        textToTypeElement.innerHTML = '';
        currentPhrase.split('').forEach(char => {
            const charSpan = document.createElement('span');
            charSpan.innerText = char;
            textToTypeElement.appendChild(charSpan);
        });

        userInputElement.value = '';
        userInputElement.disabled = false;
        timerElement.textContent = '0s';
        errorsElement.textContent = '0';
        updateBestTime();
    }

    function startTimer() {
        startTime = new Date();
        timer = setInterval(() => {
            const elapsedTime = Math.floor((new Date() - startTime) / 1000);
            timerElement.textContent = `${elapsedTime}s`;
        }, 1000);
    }

    userInputElement.addEventListener('input', () => {
        if (!timer && userInputElement.value.length > 0) {
            startTimer();
        }

        const phraseChars = textToTypeElement.querySelectorAll('span');
        const inputChars = userInputElement.value.split('');
        
        errors = 0;
        phraseChars.forEach((charSpan, index) => {
            const character = inputChars[index];
            if (character == null) {
                charSpan.classList.remove('correct', 'incorrect');
            } else if (character === charSpan.innerText) {
                charSpan.classList.add('correct');
                charSpan.classList.remove('incorrect');
            } else {
                charSpan.classList.add('incorrect');
                charSpan.classList.remove('correct');
                errors++;
            }
        });
        errorsElement.textContent = errors;

        if (inputChars.length === phraseChars.length) {
            clearInterval(timer);
            userInputElement.disabled = true;
            const finalTime = Math.floor((new Date() - startTime) / 1000);
            const bestTime = localStorage.getItem('bestTypingTime');

            if (!bestTime || finalTime < parseInt(bestTime)) {
                localStorage.setItem('bestTypingTime', finalTime);
                updateBestTime();
            }
        }
    });

    resetBtn.addEventListener('click', resetGame);

    resetGame();
}); 