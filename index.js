"use strict";

//Подключаем вью для кнопки старт.
// new Vue({
//     el: '#fadeout',
//     data: {
//         show: true
//     }
// })

 
// Забираем из ID из канвас с html
const cvs = document.querySelector("#snake"),
    ctx = cvs.getContext("2d"),
    message = document.getElementById('message-text');

//Создаем блок постоянной единицы поля равный 32px.
const box = 32;

// Загружаем картинку поля
const ground = new Image();
ground.src = "./img/ground3.png";
// Загружаем картинку канабиса
const foodImg = new Image();
foodImg.src = "./img/food.png";
// const foodImg2 = new Image();
// foodImg.src = "./img/food2.png";
// const foodImg3 = new Image();
// foodImg.src = "./img/food3.png";
// const foodImg4 = new Image();
// foodImg.src = "./img/food4.png";
// const foodImg5 = new Image();
// foodImg.src = "./img/food5.png";
// Вызываем функцию отрисовки каждый 100 миллисекунд
let gameLoop = setInterval(draw, 100);
// Загружаем аудио
const dead = new Audio();
const eat = new Audio();
const up = new Audio();
const left = new Audio();
const right = new Audio();
const down = new Audio();
const won = new Audio();

dead.src = "./audio/dead.mp3"
eat.src = "./audio/eat.mp3"
up.src = "./audio/up.mp3"
left.src = "./audio/left.mp3"
right.src = "./audio/right.mp3"
down.src = "./audio/down.mp3"
won.src = "./audio/won.mp3"


function gameText() {
    message.style.color = "#42b077";
    message.textContent = "Use arrow buttons";
}

function gameOverText() {
    message.style.color = "#d24a43";
    message.textContent = "Game Over";

}

function gameWinText() {
    message.style.color = "#ffc45a";
    message.textContent = "Winner";

}




//Создаем змейку на оси ординат и абсцисс
let snake = [];
snake[0] = {
    x: 9 * box,
    y: 10 * box
};

//Создаем управление
let d;
document.addEventListener("keydown", direction);

function direction(event) {
    if (event.keyCode === 37 && d != "RIGHT") {
        left.play();
        d = "LEFT";
    } else if (event.keyCode === 38 && d != "DOWN") {
        up.play();
        d = "UP";
    } else if (event.keyCode === 39 && d != "LEFT") {
        right.play();
        d = "RIGHT";
    } else if (event.keyCode === 40 && d != "UP") {
        down.play();
        d = "DOWN";
    }
}
//Созадаем функцию столкновения collision
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }

    }

    return false;
}


//Создаем вкусняшку округляем до целых рандоммайзер и умножаем на количество клеток на поле умножаю на юнит(box)
let food = {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box
}


//Создвем очки игры
let score = 0;

// Рисуем всё в canvas 
function draw() {
    ctx.drawImage(ground, 0, 0);
    //перебор массива змеи циклом for пока i меньше числа элементов массива добавляем i++ 
    for (let i = 0; i < snake.length; i++) {
        //  ctx.fillStyle присваиваем условие что если i равно 0, если оно верно – возвращается зеленый 3DCF52, если неверно – жёлтый FFEB61:
        ctx.fillStyle = (i === 0) ? "#3DCF52" : "#FFEB61";
        //  Рисуем залитый прямоуголник змеи
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "#211903"; //Обводка
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        gameText();

    }
    // Вызываем картинку каннабиса в рандомном месте (сначала foodImg и потом переменную food с рандомом по икс и игрек )
    ctx.drawImage(foodImg, food.x, food.y);
    // Предыдущее положение головы змеи
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // В каком направлении двигаться
    if (d === "LEFT") snakeX -= box; // Если влево змея по х отнять юнита
    if (d === "UP") snakeY -= box; // Если вверх змея по у отнять юнита
    if (d === "RIGHT") snakeX += box; // Если вправо змея по х прибавить юнита
    if (d === "DOWN") snakeY += box; // Если вниз змея по у прибавить юнита

    //Если змея скушала траву
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        eat.play();
        food = {
            x: Math.floor(Math.random() * 17 + 1) * box,
            y: Math.floor(Math.random() * 15 + 3) * box
        }
        //Не удаляем хвост

    } else {
        // Убираем хвост с помощью добавления в массив змеи в конец элемента
        snake.pop();
    }

    // Добавляем новую голову
    let newHead = {
        x: snakeX,
        y: snakeY
    };
    //Game Win
    if (score > 9) {
        clearInterval(gameLoop);
        won.play();
        gameWinText();
    }


    //Game Over
    if (snakeX < box || snakeX > 17 * box || snakeY < 3 * box || snakeY > 17 * box || collision(newHead, snake)) {
        clearInterval(gameLoop);
        dead.play();
        gameOverText();
        // startTimer();

    }

    snake.unshift(newHead);
    ctx.fillStyle = "#f5cd79";
    ctx.font = '700 45px Proxima Nova';
    ctx.fillText(score, 2 * box, 1.6 * box);

    
}


// function startTimer(duration, display) {
//     let timer = duration,  seconds;
//     setInterval(function () {
//         seconds = parseInt(timer % 10, 10);
//         seconds = seconds < 10 ? "0" + seconds : seconds;
//         display.textContent = ":" + seconds;

//         if (--timer < 0) {
//             timer = duration;
   
//         }
//     }, 1000);
// }


//     let tenSeconds = 60 * 5,
//         display = document.querySelector('#time');
//     startTimer(tenSeconds, display);

// };