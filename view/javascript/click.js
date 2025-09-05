// =======================
// FUNCIONALIDADES DEL JUGADOR
// =======================

// Variables del jugador
let playerX, playerY;
let speed = 4;

// Sprites
let playerIdle, playerWalk;
let currentSprite;

// Animación de caminata
let animTimer = 0;
let animInterval = 300; // ms entre cambio de sprite
let isMoving = false;

let wallTop, wallBottom, wallLeft, wallRight;
let wallCorner1, wallCorner2, wallCorner3, wallCorner4;


// Cargar imágenes
function preload() {
  // Jugador
  playerIdle = loadImage("../src/idle.png");
  playerWalk = loadImage("../src/walk.png");
  currentSprite = playerIdle;

  // Texturas de muros
  wallTop    = loadImage("../src/sprites/walls/dungeon_wall_top.png");
  wallBottom = loadImage("../src/sprites/walls/dungeon_wall_bottom.png");
  wallLeft   = loadImage("../src/sprites/walls/dungeon_wall_left.png");
  wallRight  = loadImage("../src/sprites/walls/dungeon_wall_right.png");

  wallCorner1 = loadImage("../src/sprites/walls/dungeon_wall_corner1.png"); // arriba izq
  wallCorner2 = loadImage("../src/sprites/walls/dungeon_wall_corner2.png"); // arriba der
  wallCorner3 = loadImage("../src/sprites/walls/dungeon_wall_corner3.png"); // abajo izq
  wallCorner4 = loadImage("../src/sprites/walls/dungeon_wall_corner4.png"); // abajo der

  dungeonFloor = loadImage("../src/sprites/walls/dungeon_floor.png");
}

// Inicializar jugador en el centro 
function initPlayer() {
  playerX = width / 2;
  playerY = height / 2;
}

// Dibujar jugador
function drawPlayer() {
  // Detectar movimiento
  isMoving = false;
  let nextX = playerX;
  let nextY = playerY;

  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    nextX -= speed;
    isMoving = true;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    nextX += speed;
    isMoving = true;
  }
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
    nextY -= speed;
    isMoving = true;
  }
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
    nextY += speed;
    isMoving = true;
  }

  // Chequear colisión
  if (!collidesWithWall(nextX, nextY)) {
    playerX = nextX;
    playerY = nextY;
  }

  // Animación: alternar entre idle y walk
  if (isMoving) {
    if (millis() - animTimer > animInterval) {
      animTimer = millis();
      currentSprite = (currentSprite === playerIdle) ? playerWalk : playerIdle;
    }
  } else {
    currentSprite = playerIdle;
  }

  // Dibujar sprite
  image(currentSprite, playerX, playerY, tileSize * 0.9, tileSize * 0.9);
}

// =======================
// NO TOCAR
// =======================
// Todo lo que está arriba es del jugador.
// =======================
// AQUÍ EN ADELANTE PUEDES TOCAR
// =======================


// -----------------
// CONFIGURACIÓN DEL JUEGO
// -----------------

let tileSize = 64;
let cols, rows;
let offsetX, offsetY;
let room = [];

function setup() {
  // Canvas con aspecto 4:3
  let canvasH = windowHeight;
  let canvasW = (4 / 3) * canvasH;
  createCanvas(canvasW, canvasH);
  imageMode(CENTER);
  noSmooth();

  // Calcular cuántos tiles entran
  cols = floor(canvasW / tileSize);
  rows = floor(canvasH / tileSize);

  // 🔧 Forzar que cols y rows sean impares (para centrar puertas)
  if (cols % 2 === 0) cols--;
  if (rows % 2 === 0) rows--;

  // Centrar grilla
  offsetX = (width - cols * tileSize) / 2;
  offsetY = (height - rows * tileSize) / 2;

  // Crear sala vacía con muros alrededor
  for (let y = 0; y < rows; y++) {
    let row = [];
    for (let x = 0; x < cols; x++) {
      if (y === 0 || y === rows - 1 || x === 0 || x === cols - 1) {
        row.push(1); // muro
      } else {
        row.push(0); // piso
      }
    }
    room.push(row);
  }

  // Añadir puertas (ahora siempre estarán centradas)
  room[0][floor(cols / 2)] = 2;        // norte
  room[rows - 1][floor(cols / 2)] = 2; // sur
  room[floor(rows / 2)][0] = 2;        // oeste
  room[floor(rows / 2)][cols - 1] = 2; // este

  // Iniciar jugador
  initPlayer();
}


function draw() {
// Dibujar sala
background(50);

for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    let tile = room[y][x];
    let px = offsetX + x * tileSize;
    let py = offsetY + y * tileSize;

    if (tile === 1) {
      // ----------------------
      // MUROS CON TEXTURAS
      // ----------------------
      if (y === 0 && x === 0) {
        image(wallCorner1, px + tileSize / 2, py + tileSize / 2, tileSize, tileSize);
      } else if (y === 0 && x === cols - 1) {
        image(wallCorner2, px + tileSize / 2, py + tileSize / 2, tileSize, tileSize);
      } else if (y === rows - 1 && x === 0) {
        image(wallCorner3, px + tileSize / 2, py + tileSize / 2, tileSize, tileSize);
      } else if (y === rows - 1 && x === cols - 1) {
        image(wallCorner4, px + tileSize / 2, py + tileSize / 2, tileSize, tileSize);
      } else if (y === 0) {
        image(wallTop, px + tileSize / 2, py + tileSize / 2, tileSize, tileSize);
      } else if (y === rows - 1) {
        image(wallBottom, px + tileSize / 2, py + tileSize / 2, tileSize, tileSize);
      } else if (x === 0) {
        image(wallLeft, px + tileSize / 2, py + tileSize / 2, tileSize, tileSize);
      } else if (x === cols - 1) {
        image(wallRight, px + tileSize / 2, py + tileSize / 2, tileSize, tileSize);
      } else {
        fill(100, 50, 50); // fallback por si falta alguna textura
        rect(px, py, tileSize, tileSize);
      }
    } else if (tile === 2) {
      fill(200, 200, 50); // puerta (todavía con color plano)
      rect(px, py, tileSize, tileSize);
    } else {
      // Piso con textura
      image(dungeonFloor, px + tileSize / 2, py + tileSize / 2, tileSize, tileSize);
    }
  }
}


  // Dibujar jugador con sprites
  drawPlayer();
}

function collidesWithWall(x, y) {
  let col = floor((x - offsetX) / tileSize);
  let row = floor((y - offsetY) / tileSize);

  col = constrain(col, 0, cols - 1);
  row = constrain(row, 0, rows - 1);

  return room[row][col] === 1;
}
