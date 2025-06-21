document.addEventListener('DOMContentLoaded', () => {
    const textToTypeElement = document.getElementById('text-to-type');
    const userInputElement = document.getElementById('user-input');
    const timerElement = document.getElementById('timer');
    const errorsElement = document.getElementById('errors');
    const bestTimeElement = document.getElementById('best-time');
    const resetBtn = document.getElementById('reset-btn');
    const langEnBtn = document.getElementById('lang-en');
    const langUaBtn = document.getElementById('lang-ua');

    const translations = {
        en: {
            title: "Typing Speed Test",
            placeholder: "Start typing here...",
            timeLabel: "Time",
            errorsLabel: "Errors",
            bestTimeLabel: "Best Time",
            resetBtn: "Try Again"
        },
        ua: {
            title: "Тест на швидкість друку",
            placeholder: "Почніть друкувати тут...",
            timeLabel: "Час",
            errorsLabel: "Помилки",
            bestTimeLabel: "Найкращий час",
            resetBtn: "Спробувати ще раз"
        }
    };

    const phrases = {
        en: [
            "The speed of thought is great, but the speed of light is even greater.",
            "Programming is the art of organizing complexity.",
            "The best way to predict the future is to create it.",
            "The more I learn, the more I realize how little I know.",
            "Success is not a final point, but the ability to move from failure to failure without loss of enthusiasm."
        ],
        ua: [
            "Швидкість думки велика, але швидкість світла ще більша.",
            "Програмування - це мистецтво організації складності.",
            "Найкращий спосіб передбачити майбутнє - це створити його.",
            "Чим більше я вчуся, тим більше розумію, як мало я знаю.",
            "Успіх - це не фінальна точка, а здатність рухатися від невдачі до невдачі без втрати ентузіазму."
        ]
    };

    let timer;
    let startTime;
    let currentPhrase = '';
    let errors = 0;
    let currentLang = 'en';

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('typingTestLang', lang);
        document.documentElement.lang = lang;

        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            if (translations[lang][key]) {
                if (element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });

        if (lang === 'en') {
            langEnBtn.classList.add('active');
            langUaBtn.classList.remove('active');
        } else {
            langUaBtn.classList.add('active');
            langEnBtn.classList.remove('active');
        }

        resetGame();
    }

    function getRandomPhrase() {
        const langPhrases = phrases[currentLang];
        return langPhrases[Math.floor(Math.random() * langPhrases.length)];
    }

    function updateBestTime() {
        const bestTime = localStorage.getItem(`bestTypingTime_${currentLang}`);
        if (bestTime) {
            bestTimeElement.textContent = `${bestTime}s`;
        } else {
            bestTimeElement.textContent = '--';
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

        if (inputChars.length === phraseChars.length && errors === 0) {
            clearInterval(timer);
            userInputElement.disabled = true;
            const finalTime = Math.floor((new Date() - startTime) / 1000);
            const bestTime = localStorage.getItem(`bestTypingTime_${currentLang}`);

            if (!bestTime || finalTime < parseInt(bestTime)) {
                localStorage.setItem(`bestTypingTime_${currentLang}`, finalTime);
                updateBestTime();
            }
        }
    });

    langEnBtn.addEventListener('click', () => setLanguage('en'));
    langUaBtn.addEventListener('click', () => setLanguage('ua'));
    resetBtn.addEventListener('click', resetGame);

    const savedLang = localStorage.getItem('typingTestLang') || 'en';
    setLanguage(savedLang);
}); 