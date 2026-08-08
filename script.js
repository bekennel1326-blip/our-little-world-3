/* ==========================================================
   💌 LOVE CARD — ГЛАВНЫЙ JAVASCRIPT
   ========================================================== */

/*
  ВАЖНО:
  Прогресс НЕ сохраняется.
  Мы специально НЕ используем localStorage/sessionStorage.

  Закрыли вкладку → ключи исчезли.
  Открыли сайт заново → начинаем с нуля.
*/

/* ==========================================================
   ⚙️ НАСТРОЙКИ
   ========================================================== */

const CONFIG = {
  puzzleImage: "images/puzzle.jpg",

  /* 🌿 Можно поменять сложность лабиринта здесь.
     0 = стена, 1 = проход.
     Старт: S
     Финиш: G
  */
  maze: [
    "111111111111111",
    "S00000100000001",
    "111011101111101",
    "100010001000001",
    "101110111011101",
    "100000100010001",
    "111110101110111",
    "100010100000001",
    "101010111111101",
    "101000000000001",
    "101111111011101",
    "100000001010001",
    "111111101011101",
    "1000000010000G1",
    "111111111111111"
  ]
};

/* ==========================================================
   🔑 ИНВЕНТАРЬ КЛЮЧЕЙ
   ========================================================== */

let keys = [false, false, false];

const keySlots = [...document.querySelectorAll(".key-slot")];

/* Скрываем визуальные скважины,
   но сами элементы оставляем,
   чтобы система ключей продолжала работать. */

function updateInventory() {
  keySlots.forEach((slot, index) => {
    slot.classList.toggle("filled", keys[index]);
  });
}

function giveKey(index) {
  if (keys[index]) return;

  keys[index] = true;
  updateInventory();
}

function hasAllKeys() {
  return keys.every(Boolean);
}

/* ==========================================================
   🧭 ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ
   ========================================================== */

const screens = {
  home: document.getElementById("homeScreen"),
  letter: document.getElementById("letterScreen"),
  music: document.getElementById("musicScreen"),
  puzzle: document.getElementById("puzzleScreen"),
  maze: document.getElementById("mazeScreen"),
  runner: document.getElementById("runnerScreen"),
  shame: document.getElementById("shameScreen"),
  gift: document.getElementById("giftScreen")
};

let currentScreen = "home";

function showScreen(name) {
  Object.values(screens).forEach(screen => screen.classList.remove("active"));

  if (screens[name]) {
    screens[name].classList.add("active");
    currentScreen = name;
  }

  if (name === "puzzle") startPuzzle();
  if (name === "maze") startMaze();
  if (name === "runner") startRunner();
  if (name === "gift") resetGiftScreen();
}

/* ==========================================================
   💿 ВИНИЛ + МУЗЫКА
   ========================================================== */

const vinylButton = document.getElementById("vinylButton");
const homeButtons = document.getElementById("homeButtons");
const music = document.getElementById("backgroundMusic");

function playSoundWithDucking(sound) {
    // Запоминаем обычную громкость музыки
    const normalVolume = music.volume;

    // Приглушаем музыку
    music.volume = normalVolume * 0.15;

    // Запускаем звук
    sound.currentTime = 0;
    sound.play().catch(error => {
        console.log("Не удалось запустить звук:", error);
    });

    // Когда звук закончится — возвращаем музыку
    sound.onended = () => {
        music.volume = normalVolume;
    };
}

let postcardOpened = false;

vinylButton.addEventListener("click", async () => {
  postcardOpened = true;

  vinylButton.classList.add("spinning");
  homeButtons.classList.add("visible");
  homeButtons.setAttribute("aria-hidden", "false");

  /*
    Браузеры разрешают autoplay после действия пользователя,
    поэтому музыка запускается именно после клика по винилу.
  */
 /* =========================================================
   🎵 ЗАПУСК ФОНОВОЙ МУЗЫКИ
   ========================================================= */

try {
    music.volume = 0.7;
    music.muted = false;

    music.load();

    await music.play();

} catch (error) {
    console.error("❌ Не удалось запустить музыку:", error);
}

});

/* ==========================================================
   🎀 КНОПКИ ГЛАВНОЙ СТРАНИЦЫ
   ========================================================== */

document.querySelectorAll(".menu-button").forEach(button => {
  button.addEventListener("click", () => {
    showScreen(button.dataset.page);
  });
});

/* ==========================================================
   ← НАЗАД
   ========================================================== */

document.querySelectorAll("[data-back]").forEach(button => {
  button.addEventListener("click", () => {
    showScreen("home");
  });
});

/* ==========================================================
   🎵 YOUTUBE MUSIC
   ========================================================== */

/*
  Замените href в index.html у #playlistLink.

  Например:
  https://music.youtube.com/playlist?list=XXXXXXXX

  Ссылка открывается в новой вкладке.
  Сама открытка при этом не ломается.
*/

/* ==========================================================
   🧩 ПАЗЛ — 5 × 5
   ========================================================== */

const puzzleBoard = document.getElementById("puzzleBoard");
const puzzlePiecesContainer = document.getElementById("puzzlePieces");
const puzzleStatus = document.getElementById("puzzleStatus");
const puzzleReset = document.getElementById("puzzleReset");

let puzzleSolved = 0;
let puzzlePieces = [];

function createPuzzleSlots() {
  puzzleBoard.innerHTML = "";

  for (let i = 0; i < 25; i++) {
    const slot = document.createElement("div");
    slot.className = "puzzle-slot";
    slot.dataset.index = i;

    slot.addEventListener("dragover", event => {
      event.preventDefault();
    });

    slot.addEventListener("drop", event => {
      event.preventDefault();

      const pieceId = event.dataTransfer.getData("piece");
      const piece = document.querySelector(`[data-piece-id="${pieceId}"]`);

      if (!piece) return;

      placePuzzlePiece(piece, slot);
    });

    puzzleBoard.appendChild(slot);
  }
}

function createPuzzlePieces(){
  puzzlePiecesContainer.innerHTML=""; puzzlePieces=[];
  const indexes=Array.from({length:25},(_,i)=>i);
  for(let i=indexes.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[indexes[i],indexes[j]]=[indexes[j],indexes[i]]}
  indexes.forEach(correctIndex=>{
    const piece=document.createElement("div");piece.className="puzzle-piece";piece.dataset.correctIndex=correctIndex;piece.dataset.pieceId=crypto.randomUUID?crypto.randomUUID():String(Math.random());
    const row=Math.floor(correctIndex/5),col=correctIndex%5;piece.style.backgroundPosition=`${col*25}% ${row*25}%`;piece.draggable=true;
    piece.addEventListener("dragstart",event=>{event.dataTransfer.setData("piece",piece.dataset.pieceId);piece.classList.add("dragging")});
    piece.addEventListener("dragend",()=>piece.classList.remove("dragging"));
    piece.addEventListener("pointerdown",event=>{if(piece.classList.contains("correct"))return;piece.setPointerCapture?.(event.pointerId);piece.classList.add("dragging")});
    piece.addEventListener("pointerup",event=>{if(piece.classList.contains("correct"))return;piece.classList.remove("dragging");const target=document.elementFromPoint(event.clientX,event.clientY);const slot=target?.closest(".puzzle-slot");if(slot&&slot.children.length===0)placePuzzlePiece(piece,slot)});
    piece.addEventListener("click",()=>{if(piece.classList.contains("correct"))return;const slot=document.querySelector(`.puzzle-slot[data-index="${correctIndex}"]`);if(slot&&slot.children.length===0)placePuzzlePiece(piece,slot)});
    puzzlePiecesContainer.appendChild(piece);puzzlePieces.push(piece);
  });
}
function placePuzzlePiece(piece,slot){
  const correctIndex=Number(piece.dataset.correctIndex),slotIndex=Number(slot.dataset.index);
  if(correctIndex!==slotIndex){puzzleStatus.textContent="Не туда ♡ Попробуйте ещё раз.";setTimeout(()=>puzzleStatus.textContent="Соберите изображение 5 × 5",700);return}
  slot.appendChild(piece);piece.classList.add("correct");piece.draggable=false;puzzleSolved++;
  if(puzzleSolved===25){puzzleStatus.textContent="Пазл собран! 🔑";giveKey(0)}
}

function startPuzzle() {
  puzzleSolved = 0;
  puzzleStatus.textContent = "Соберите изображение 5 × 5";
  createPuzzleSlots();
  createPuzzlePieces();
}

puzzleReset.addEventListener("click", startPuzzle);

/* ==========================================================
   🌿 ЛАБИРИНТ
   ========================================================== */

const mazeBoard = document.getElementById("mazeBoard");
const mazeStatus = document.getElementById("mazeStatus");

let mazePosition = { row: 1, col: 0 };
let mazeFinished = false;

function startMaze() {
  mazePosition = { row: 1, col: 0 };
  mazeFinished = false;
  mazeStatus.textContent = "Проведи рыбку к тюленю.";
  renderMaze();
}

function renderMaze() {
  mazeBoard.innerHTML = "";
  const rows=CONFIG.maze.length, cols=CONFIG.maze[0].length;
  mazeBoard.style.gridTemplateRows=`repeat(${rows},1fr)`;
  mazeBoard.style.gridTemplateColumns=`repeat(${cols},1fr)`;
  CONFIG.maze.forEach((row,r)=>{[...row].forEach((cell,c)=>{
    const element=document.createElement("div"); element.className="maze-cell";
    /* 1 = стена, 0/S/G = путь */
    if(cell==="1") element.classList.add("maze-wall");
    if(cell==="G"){const goal=document.createElement("div");goal.className="maze-goal";const image=document.createElement("img");image.src="images/seal.png";image.alt="Тюлень";goal.appendChild(image);element.appendChild(goal)}
    /* Рыбка существует только в текущей позиции — дубликата на старте больше нет. */
    if(r===mazePosition.row&&c===mazePosition.col){const player=document.createElement("div");player.className="maze-player";const image=document.createElement("img");image.src="images/fish.png";image.alt="Рыбка";player.appendChild(image);element.appendChild(player)}
    mazeBoard.appendChild(element);
  })});
}

function moveMaze(dr, dc) {
  if (mazeFinished) return;

  const nextRow = mazePosition.row + dr;
  const nextCol = mazePosition.col + dc;

  if (
    nextRow < 0 ||
    nextRow >= CONFIG.maze.length ||
    nextCol < 0 ||
    nextCol >= CONFIG.maze[0].length
  ) {
    return;
  }

  if (CONFIG.maze[nextRow][nextCol] === "1") {
    return;
  }

  mazePosition = {
    row: nextRow,
    col: nextCol
  };

  renderMaze();

  const cell = CONFIG.maze[nextRow][nextCol];

  if (cell === "G") {
    finishMaze();
  }
}

function finishMaze() {
  mazeFinished = true;
  mazeStatus.textContent = "Они встретились! ♡ 🔑";

  document.querySelectorAll(".maze-player, .maze-goal")
    .forEach(element => element.classList.add("happy"));

  giveKey(1);
}

document.querySelectorAll("[data-move]").forEach(button => {
  button.addEventListener("click", () => {
    const direction = button.dataset.move;

    const movements = {
      up: [-1, 0],
      down: [1, 0],
      left: [0, -1],
      right: [0, 1]
    };

    moveMaze(...movements[direction]);
  });
});

document.addEventListener("keydown", event => {
  if (currentScreen !== "maze") return;

  const movements = {
    ArrowUp: [-1, 0],
    ArrowDown: [1, 0],
    ArrowLeft: [0, -1],
    ArrowRight: [0, 1]
  };

  if (movements[event.key]) {
    event.preventDefault();
    moveMaze(...movements[event.key]);
  }
});

/* ==========================================================
   🏃 РАННЕР
   ========================================================== */

const runnerGame = document.getElementById("runnerGame");
const runnerFish = document.getElementById("runnerFish");
const runnerSeal = document.getElementById("runnerSeal");
const runnerStatus = document.getElementById("runnerStatus");
const jumpButton = document.getElementById("jumpButton");

let runnerScoreValue = 0;
let runnerActive = false;
let runnerInterval = null;

function startRunner() {
  clearInterval(runnerInterval);

  runnerScoreValue = 0;
  runnerStatus.textContent = "Преодолено: 0 / 20";

  runnerSeal.classList.add("hidden");
  runnerActive = true;

  runnerInterval = setInterval(createObstacle, 1500);
}

function createObstacle() {
  if (!runnerActive) return;

  const obstacle = document.createElement("div");
  obstacle.className = "runner-obstacle";

  runnerGame.appendChild(obstacle);

  let jumped = false;

  const checkCollision = setInterval(() => {
    if (!runnerActive) {
      clearInterval(checkCollision);
      return;
    }

    const fishRect = runnerFish.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    const collision =
      fishRect.left < obstacleRect.right &&
      fishRect.right > obstacleRect.left &&
      fishRect.top < obstacleRect.bottom &&
      fishRect.bottom > obstacleRect.top;

    if (collision && !runnerFish.classList.contains("jumping")) {
      runnerLose();
      clearInterval(checkCollision);
    }
  }, 40);

  obstacle.addEventListener("animationend", () => {
    clearInterval(checkCollision);
    obstacle.remove();

    if (!runnerActive) return;

    runnerScoreValue++;
    runnerStatus.textContent = `Преодолено: ${runnerScoreValue} / 20`;

    if (runnerScoreValue >= 20) {
      finishRunner();
    }
  });
}

function jump() {
  if (!runnerActive) return;

  if (runnerFish.classList.contains("jumping")) return;

  runnerFish.classList.add("jumping");

  setTimeout(() => {
    runnerFish.classList.remove("jumping");
  }, 650);
}

function runnerLose() {
  runnerActive = false;
  clearInterval(runnerInterval);
  runnerStatus.textContent = "Ой! Попробуйте ещё раз.";
}

function finishRunner() {
  runnerActive = false;
  clearInterval(runnerInterval);

  document.querySelectorAll(".runner-obstacle").forEach(o => o.remove());

  runnerStatus.textContent = "20 препятствий! Они встретились! ♡ 🔑";
  runnerSeal.classList.remove("hidden");

  giveKey(2);
}

jumpButton.addEventListener("click", jump);
runnerGame.addEventListener("click", jump);

/* ==========================================================
   🖼️ ДОСКА ПОЗОРА — ЗВУК
   ========================================================== */

const disapprovalSound = document.getElementById("disapprovalSound");

document.querySelectorAll(".shame-item[data-sound]").forEach(item => {
  item.addEventListener("click", () => {
  playSoundWithDucking(disapprovalSound);
  });
});

/* ==========================================================
   🎁 МИСТИЧЕСКИЙ ПОДАРОК
   ========================================================== */

const chestButton = document.getElementById("chestButton");
const giftMessage = document.getElementById("giftMessage");
const giftReward = document.getElementById("giftReward");
const confetti = document.getElementById("confetti");
const applauseSound = document.getElementById("applauseSound");

let giftOpened = false;

function resetGiftScreen() {
  giftOpened = false;
  chestButton.classList.remove("shaking");
  giftReward.classList.add("hidden");
  giftMessage.textContent = "";
  confetti.innerHTML = "";

  /* 🎁 Возвращаем закрытый сундук */
  const chestImage = chestButton.querySelector("img");

  if (chestImage) {
    chestImage.src = "images/chest.png";
  }
}

chestButton.addEventListener("click", () => {
  if (giftOpened) return;

  if (!hasAllKeys()) {
    chestButton.classList.remove("shaking");

    /* force reflow, чтобы повторное нажатие снова запускало animation */
    void chestButton.offsetWidth;

    chestButton.classList.add("shaking");
    giftMessage.textContent = "ищи ключи.";

    setTimeout(() => {
      giftMessage.textContent = "";
    }, 1300);

    return;
  }

  openChest();
});

function openChest() {
  giftOpened = true;

  giftMessage.textContent = "ключи подходят...";

  /*
    Небольшая задержка создаёт ощущение,
    будто ключи действительно вставляются один за другим.
  */
  setTimeout(() => {
    keySlots.forEach((slot, index) => {
      if (keys[index]) {
        slot.classList.remove("filled");
      }
    });
  }, 700);

  setTimeout(() => {
    chestButton.classList.add("shaking");
  }, 1300);

 setTimeout(() => {

  /* ======================================================
     🎁 СУНДУК ОТКРЫВАЕТСЯ
     Меняем закрытый chest.png на chest-open.png
     ====================================================== */

  const chestImage = chestButton.querySelector("img");

  if (chestImage) {
    chestImage.src = "images/chest-open.png";
  }

  /* ======================================================
     🎉 ЗВУК АПЛОДИСМЕНТОВ
     ====================================================== */

playSoundWithDucking(applauseSound);

  /* ======================================================
     🎊 КОНФЕТТИ
     ====================================================== */

  createConfetti();

  giftReward.classList.remove("hidden");
  giftMessage.textContent = "";

}, 1900);

}

function createConfetti() {
  confetti.innerHTML = "";

  for (let i = 0; i < 70; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";

    const x = `${(Math.random() - .5) * 80}vw`;
    const y = `${30 + Math.random() * 60}vh`;

    piece.style.setProperty("--x", x);
    piece.style.setProperty("--y", y);

    piece.style.animationDelay = `${Math.random() * .4}s`;

    confetti.appendChild(piece);
  }
}

/* ==========================================================
   🚀 ПЕРВИЧНАЯ ИНИЦИАЛИЗАЦИЯ
   ========================================================== */

updateInventory();
showScreen("home");

/*
  Никакого сохранения прогресса здесь нет намеренно.
  Каждый новый запуск страницы начинается с:
  keys = [false, false, false]
*/

/* Музыка: если файл не загрузился, причина видна в DevTools Console. */
music.addEventListener("error",()=>console.warn("Не удалось загрузить sounds/music.mp3 — проверьте имя файла, формат MP3 и папку sounds."));
