// Инициализация игровых переменных с загрузкой из LocalStorage
let balanceUAH = parseFloat(localStorage.getItem('casino_balance_uah')) || 100.00;
let balanceEUR = parseFloat(localStorage.getItem('casino_balance_eur')) || 0.00;

// Элементы интерфейса и тем
const bodyElem = document.body;
const balanceUahDisplay = document.getElementById('balance');
const balanceEurDisplay = document.getElementById('balance-eur');
const balanceUahBox = document.getElementById('balance-uah-box');
const balanceEurBox = document.getElementById('balance-eur-box');

// Блоки навигационных меню миров
const menuUkraine = document.getElementById('menu-ukraine');
const menuEurope = document.getElementById('menu-europe');

// Кнопки навигации
const navFarmBtn = document.getElementById('nav-farm-btn');
const navBetBtn = document.getElementById('nav-bet-btn');
const navExchangeBtn = document.getElementById('nav-exchange-btn');
const navEuroBtn = document.getElementById('nav-euro-btn');
const navBackBtn = document.getElementById('nav-back-btn');
const navBetEurBtn = document.getElementById('nav-bet-eur-btn');

// Игровые секции
const sectionFarm = document.getElementById('section-farm');
const sectionBet = document.getElementById('section-bet');
const sectionBetEur = document.getElementById('section-bet-eur');

// Пасхалки
const easterEggTrigger = document.getElementById('easter-egg-trigger');
const ukraineFlagOverlay = document.getElementById('ukraine-flag-overlay');
const tckText = document.getElementById('tck-text');
const anthemAudio = document.getElementById('anthem-audio');
const mellstroyOverlay = document.getElementById('mellstroy-overlay');
const mellstroyAudio = document.getElementById('mellstroy-audio');

// Элементы управления играми
const targetClickBtn = document.getElementById('target-click-btn');
const rollBtn = document.getElementById('roll-btn');
const betAmountInput = document.getElementById('bet-amount');
const animationZone = document.getElementById('animation-zone');
const resultDisplay = document.getElementById('result-display');

const rollEurBtn = document.getElementById('roll-eur-btn');
const betAmountEurInput = document.getElementById('bet-amount-eur');
const animationZoneEur = document.getElementById('animation-zone-eur');
const resultDisplayEur = document.getElementById('result-display-eur');

// Функция обновления и сохранения балансов
function updateBalances() {
    balanceUahDisplay.textContent = balanceUAH.toFixed(2);
    balanceEurDisplay.textContent = balanceEUR.toFixed(2);
    localStorage.setItem('casino_balance_uah', balanceUAH.toFixed(2));
    localStorage.setItem('casino_balance_eur', balanceEUR.toFixed(2));
}

// Первичный вывод балансов на экран
updateBalances();

// --- НАВИГАЦИЯ И ПЕРЕКЛЮЧЕНИЕ МИРОВ ---

// Вкладка: Копить (Украина)
navFarmBtn.addEventListener('click', () => {
    sectionFarm.classList.remove('hidden');
    sectionBet.classList.add('hidden');
    moveTargetButton(); 
});

// Вкладка: Депнуть (Украина)
navBetBtn.addEventListener('click', () => {
    sectionBet.classList.remove('hidden');
    sectionFarm.classList.add('hidden');
});

// Кнопка: Перевод (Гривны в Евро)
navExchangeBtn.addEventListener('click', () => {
    if (balanceUAH < 1500) {
        alert("Для перевода нужно минимум 1500 гривен!");
        return;
    }
    balanceUAH -= 1500;
    balanceEUR += 1.00;
    updateBalances();
    alert("Успешно переведено! Из 1500 ₴ получено 1.00 €");
});

// Кнопка: В Европку (Переход во 2-й мир)
navEuroBtn.addEventListener('click', () => {
    bodyElem.className = 'theme-europe'; // Меняем цвета на черно-синие
    menuUkraine.classList.add('hidden');
    menuEurope.classList.remove('hidden');
    balanceEurBox.classList.remove('hidden'); // Показываем баланс евро
    
    // Прячем старые секции Украины
    sectionFarm.classList.add('hidden');
    sectionBet.classList.add('hidden');
    
    // Автоматически открываем евро-депозиты
    sectionBetEur.classList.remove('hidden');
});

// Кнопка: Вернуться в Украину
navBackBtn.addEventListener('click', () => {
    bodyElem.className = 'theme-ukraine'; // Возвращаем черно-красные тона
    menuUkraine.classList.remove('hidden');
    menuEurope.classList.add('hidden');
    sectionBetEur.classList.add('hidden');
});

// Кнопка: Депнуть (Европка)
navBetEurBtn.addEventListener('click', () => {
    sectionBetEur.classList.remove('hidden');
});


// --- ЛОГИКА ИГРЫ В УКРАИНЕ (КЛИКЕР + СТАВКИ 12.5%) ---

function moveTargetButton() {
    const clickArea = document.querySelector('.click-area');
    const maxX = clickArea.clientWidth - targetClickBtn.clientWidth;
    const maxY = clickArea.clientHeight - targetClickBtn.clientHeight;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    targetClickBtn.style.left = `${randomX}px`;
    targetClickBtn.style.top = `${randomY}px`;
}

targetClickBtn.addEventListener('click', () => {
    balanceUAH += 0.1; 
    updateBalances(); 
    moveTargetButton(); 
});

rollBtn.addEventListener('click', () => {
    const betAmount = parseFloat(betAmountInput.value);
    if (isNaN(betAmount) || betAmount <= 0) { alert("Введите корректную сумму ставки!"); return; }
    if (betAmount > balanceUAH) { alert("Недостаточно гривен!"); return; }

    const userChoice = parseInt(document.querySelector('input[name="user-number"]:checked').value);
    balanceUAH -= betAmount;
    updateBalances();
    
    rollBtn.disabled = true;
    resultDisplay.textContent = "";
    animationZone.classList.remove('hidden');

    setTimeout(() => {
        const casinoChoice = Math.floor(Math.random() * 8) + 1; // Шанс 12.5%
        animationZone.classList.add('hidden');
        rollBtn.disabled = false;

        if (userChoice === casinoChoice) {
            const winAmount = betAmount * 5; 
            balanceUAH += winAmount;
            resultDisplay.style.color = "#00ff00";
            resultDisplay.textContent = `🎉 ВЫИГРАЛ! +${winAmount.toFixed(2)} ₴`;
        } else {
            resultDisplay.style.color = "#ff0000";
            resultDisplay.textContent = `❌ ПРОКАКАЛ! -${betAmount.toFixed(2)} ₴`;
        }
        updateBalances();
    }, 2000);
});


// --- ЛОГИКА ИГРЫ В ЕВРОПКЕ (СТАВКИ С ШАНСОМ ЗАРЕЗАННЫМ ДО 5%) ---

rollEurBtn.addEventListener('click', () => {
    const betAmountEur = parseFloat(betAmountEurInput.value);
    if (isNaN(betAmountEur) || betAmountEur <= 0) { alert("Введите корректную ставку в евро!"); return; }
    if (betAmountEur > balanceEUR) { alert("Недостаточно евро на балансе!"); return; }

    const userChoiceEur = parseInt(document.querySelector('input[name="user-number-eur"]:checked').value);
    balanceEUR -= betAmountEur;
    updateBalances();

    rollEurBtn.disabled = true;
    resultDisplayEur.textContent = "";
    animationZoneEur.classList.remove('hidden');

    setTimeout(() => {
        const casinoChoiceEur = Math.floor(Math.random() * 20) + 1; // Шанс 5%
        animationZoneEur.classList.add('hidden');
        rollEurBtn.disabled = false;

        if (userChoiceEur === casinoChoiceEur) {
            const winAmountEur = betAmountEur * 15; 
            balanceEUR += winAmountEur;
            resultDisplayEur.style.color = "#00ff00";
            resultDisplayEur.textContent = `🇪🇺 ВЫИГРАЛ ЕВРО! +${winAmountEur.toFixed(2)} €`;
        } else {
            resultDisplayEur.style.color = "#ff0000";
            resultDisplayEur.textContent = `❌ ПРОКАКАЛ ЕВРО! -${betAmountEur.toFixed(2)} €`;
        }
        updateBalances();
    }, 2000);
});


// --- ПАСХАЛКИ ---

// КЛИК НА ТЕКСТ КАЗИНО (ФЛАГ + ДИНАМИЧЕСКИЙ ТЕКСТ ТЦК)
easterEggTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    ukraineFlagOverlay.classList.remove('hidden-flag');
    
    // ПРОВЕРКА: Если игрок активировал пасхалку, находясь в Европке
    if (bodyElem.classList.contains('theme-europe')) {
        tckText.classList.remove('hidden-tck'); // Показываем грозный текст
    } else {
        tckText.classList.add('hidden-tck'); // В обычной Украине текст скрыт
    }
    
    anthemAudio.play().catch(o => {});
});

// КЛИК ПО ПУСТОМУ МЕСТУ ЭКРАНА (МЕЛСТРОЙ)
document.body.addEventListener('click', (e) => {
    if (e.target === document.body) {
        mellstroyOverlay.classList.remove('hidden-mell');
        mellstroyAudio.currentTime = 0;
        mellstroyAudio.play().catch(o => {});
    }
});

mellstroyOverlay.addEventListener('click', () => {
    mellstroyOverlay.classList.add('hidden-mell');
    mellstroyAudio.pause();
});
