// Llave de almacenamiento para el anchoalto del canvas. No tocar.
const STORAGE_KEY = 'myGameBaseCanvasSize_v1';

let cnv;
let baseW, baseH;

const COLS = 12;
const ROWS = 8;

let tileSize;
let playW, playH;
let offsetX, offsetY;

let playerSprites = {};
let currentPlayerImg;

let isTransitioning = false;
let fadeAlpha = 0;
let fadeDirection = 1; // 1 = oscurecer, -1 = aclarar
let pendingMove = null; // guardará hacia dónde moverse (dx, dy)

let player = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  // velocidad relativa al tileSize — se calcula dinámicamente en draw
  radiusFactor: 0.32 // radio del jugador en relación al tile
};

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

let cols, rows;
let room = [];

function preload() {
  // usa tus rutas reales aquí
  wallTop     = loadImage("../src/sprites/tiles/dungeon/dungeon_wall_top.png");
  wallBottom  = loadImage("../src/sprites/tiles/dungeon/dungeon_wall_bottom.png");
  wallLeft    = loadImage("../src/sprites/tiles/dungeon/dungeon_wall_left.png");
  wallRight   = loadImage("../src/sprites/tiles/dungeon/dungeon_wall_right.png");

  wallCorner1 = loadImage("../src/sprites/tiles/dungeon/dungeon_wall_corner1.png"); // arriba-izq
  wallCorner2 = loadImage("../src/sprites/tiles/dungeon/dungeon_wall_corner2.png"); // arriba-der
  wallCorner3 = loadImage("../src/sprites/tiles/dungeon/dungeon_wall_corner3.png"); // abajo-izq
  wallCorner4 = loadImage("../src/sprites/tiles/dungeon/dungeon_wall_corner4.png"); // abajo-der

  wallVerticalTop = loadImage("../src/sprites/tiles/dungeon/dungeon_wall_vertical_top.png");
  wallVerticalMid = loadImage("../src/sprites/tiles/dungeon/dungeon_wall_vertical_mid.png");
  wallVerticalBottom = loadImage("../src/sprites/tiles/dungeon/dungeon_wall_vertical_bottom.png");

  wallHorizontalLeft = loadImage("../src/sprites/tiles/dungeon/dungeon_wall_horizontal_left.png");
  wallHorizontalMid = loadImage("../src/sprites/tiles/dungeon/dungeon_wall_horizontal_mid.png");
  wallHorizontalRight = loadImage("../src/sprites/tiles/dungeon/dungeon_wall_horizontal_right.png");

  wallSingle = loadImage("../src/sprites/tiles/dungeon/dungeon_wall_single.png");

  dungeon_door = loadImage("../src/sprites/tiles/dungeon/dungeon_door.png");
  dungeon_door_half1 = loadImage("../src/sprites/tiles/dungeon/dungeon_door_half1.png");
  dungeon_door_half2 = loadImage("../src/sprites/tiles/dungeon/dungeon_door_half2.png");

  playerSprites.up = loadImage("../src/sprites/player/upwalk1.png");
  playerSprites.down = loadImage("../src/sprites/player/downwalk1.png");
  playerSprites.left = loadImage("../src/sprites/player/leftwalk1.png");
  playerSprites.right = loadImage("../src/sprites/player/rightwalk1.png");

  heartSprite = loadImage("../src/sprites/ui/heart_full.png");

  currentPlayerImg = playerSprites.down;

  pixelFont = loadFont("../src/fonts/ari-w9500.ttf");
}


// Al redimensionar la ventana:
function windowResized() {
  if (!isBrowserFullscreen() && !document.fullscreenElement) {
    baseH = windowHeight;
    baseW = Math.round(baseH * 4 / 3);
    saveBase();
    resizeCanvas(baseW, baseH);
  } else {
    resizeCanvas(baseW, baseH);
  }
  centerCanvas();

}

function centerCanvas() {
  const x = Math.round((windowWidth - baseW) / 2);
  const y = Math.round((windowHeight - baseH) / 2);
  cnv.position(x, y);
}

// Detecta "fullscreen de navegador" (F11) y diferencia del fullscreen por requestFullscreen() (p5)
function isBrowserFullscreen() {
  return (window.innerHeight === screen.height || window.innerWidth === screen.width) && !document.fullscreenElement;
}

function saveBase() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ w: baseW, h: baseH, t: Date.now() }));
  } catch (err) {
    console.warn('No se pudo guardar en localStorage:', err);
  }
}
function loadBase() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : null;
  } catch (err) {
    return null;
  }
}

// No tocar nada de arriba. 

function drawGrid() {
  stroke(120);
  strokeWeight(1);
  for (let x = 0; x <= COLS; x++) {
    let px = offsetX + x * tileSize;
    line(px, offsetY, px, offsetY + playH);
  }
  for (let y = 0; y <= ROWS; y++) {
    let py = offsetY + y * tileSize;
    line(offsetX, py, offsetX + playW, py);
  }
}

function handlePlayerMovement() {
  if (!inited) return;

  // velocidad máxima proporcional al tileSize
  let maxSpeed = tileSize * 0.08; // ajusta para hacer más/menos rápido

  // leer input
  let left  = keyIsDown(65) || keyIsDown(37); // A, ←
  let right = keyIsDown(68) || keyIsDown(39); // D, →
  let up    = keyIsDown(87) || keyIsDown(38); // W, ↑
  let down  = keyIsDown(83) || keyIsDown(40); // S, ↓

  let dx = (right ? 1 : 0) - (left ? 1 : 0);
  let dy = (down  ? 1 : 0) - (up   ? 1 : 0);

  // normalizar diagonal para mantener misma velocidad
  if (dx !== 0 && dy !== 0) {
    dx *= 0.7071;
    dy *= 0.7071;
  }

  // velocidad deseada
  let desiredVx = dx * maxSpeed;
  let desiredVy = dy * maxSpeed;

  const accel = 0.20; // 0..1

  // --- aquí está la diferencia ---
  if (dx === 0) {
    player.vx = 0; // frena seco en X
  } else {
    player.vx = lerp(player.vx, desiredVx, accel);
  }

  if (dy === 0) {
    player.vy = 0; // frena seco en Y
  } else {
    player.vy = lerp(player.vy, desiredVy, accel);
  }
  // -------------------------------

  // aplicar velocidad
  let nextX = player.x + player.vx;
  if (!collidesWithWallAtPixel(nextX, player.y)) {
    player.x = nextX;
  } else {
    player.vx = 0;
  }

  let nextY = player.y + player.vy;
  if (!collidesWithWallAtPixel(player.x, nextY)) {
    player.y = nextY;
  } else {
    player.vy = 0;
  }

  // mantener dentro del área jugable (con margen por radio)
  let r = tileSize * player.radiusFactor;
  player.x = constrain(player.x, offsetX + r, offsetX + playW - r);
  player.y = constrain(player.y, offsetY + r, offsetY + playH - r);
}

function updateEnemies() {
  for (let e of enemies) {
    // cambiar dirección cada cierto tiempo
    if (millis() > e.dirTimer) {
      e.vx = random([-1, 0, 1]);
      e.vy = random([-1, 0, 1]);
      // evitar quedarse quieto todo el tiempo
      if (e.vx === 0 && e.vy === 0) e.vx = 1;
      e.dirTimer = millis() + random(1000, 3000);
    }

    let nextX = e.x + e.vx * e.speed;
    let nextY = e.y + e.vy * e.speed;

    // si hay colisión, cambia dirección
    if (collidesWithWallAtPixel(nextX, e.y)) {
      e.vx *= -1;
      nextX = e.x + e.vx * e.speed;
    }
    if (collidesWithWallAtPixel(e.x, nextY)) {
      e.vy *= -1;
      nextY = e.y + e.vy * e.speed;
    }

    // aplicar movimiento si no colisiona
    if (!collidesWithWallAtPixel(nextX, nextY)) {
      e.x = nextX;
      e.y = nextY;
    }

    // mantener dentro del área jugable
    let r = tileSize * 0.3;
    e.x = constrain(e.x, offsetX + r, offsetX + playW - r);
    e.y = constrain(e.y, offsetY + r, offsetY + playH - r);
  }
}



function drawPlayer() {
  let r = tileSize * player.radiusFactor;

  // Determinar dirección (basado en velocidad)
  if (player.vx !== 0 || player.vy !== 0) {
    if (Math.abs(player.vx) > Math.abs(player.vy)) {
      // Movimiento horizontal domina
      if (player.vx > 0) currentPlayerImg = playerSprites.right;
      else currentPlayerImg = playerSprites.left;
    } else {
      // Movimiento vertical domina
      if (player.vy > 0) currentPlayerImg = playerSprites.down;
      else currentPlayerImg = playerSprites.up;
    }
  }

  // Dibujar sprite centrado en la posición del jugador
  imageMode(CENTER);
  image(currentPlayerImg, player.x, player.y, tileSize, tileSize);
}

function calculatePlayArea() {
  // escoger mayor 4:3 posible dentro del canvas base
  if (baseW / baseH > 4 / 3) {
    // más ancho -> limitar por altura
    playH = baseH;
    playW = playH * (4 / 3);
  } else {
    // más alto -> limitar por ancho
    playW = baseW;
    playH = playW * (3 / 4);
  }

  // conseguir tileSize entero y recalcular playW/playH para que encajen tiles exactos
  tileSize = Math.max(1, Math.floor(Math.min(playW / COLS, playH / ROWS)));
  playW = tileSize * COLS;
  playH = tileSize * ROWS;

  // centrar en el canvas, no en la ventana
  offsetX = Math.round((baseW - playW) / 2);
  offsetY = Math.round((baseH - playH) / 2);
}

// Establecimiento de entidades

// ----- Tipos de tiles -----
// 0 = vacío, 1 = muro, 2 = jugador, 3 = enemigo, 4 = llave, 5 = puerta

let currentLevel;
let walls = [];
let enemies = [];
let keys = [];
let doors = [];


function isSolidAt(levelArray, cx, cy) {
  if (cy < 0 || cy >= ROWS || cx < 0 || cx >= COLS) return false;
  const val = levelArray[cy][cx];
  return val === 1 || val === 5; // 1 = muro, 5 = puerta
}

let doorMap = new Map(); // clave: "gx,gy" -> objeto door (cada mitad)  

function loadLevel(levelArray) {
  // limpiar entidades
  walls = [];
  enemies = [];
  keys = [];
  doors = [];
  
  let seen = Array.from({length: ROWS}, () => Array(COLS).fill(false));

  currentLevel = levelArray;

  for (let gy = 0; gy < ROWS; gy++) {
    for (let gx = 0; gx < COLS; gx++) {
      const val = levelArray[gy][gx];
      const px = offsetX + gx * tileSize;
      const py = offsetY + gy * tileSize;

      if (val === 1) {
        // vecinos
        const n = isSolidAt(levelArray, gx, gy - 1);
        const s = isSolidAt(levelArray, gx, gy + 1);
        const w = isSolidAt(levelArray, gx - 1, gy);
        const e = isSolidAt(levelArray, gx + 1, gy);

        // prioridad: esquinas, luego bordes
        let kind;

        if (gx === 0 && gy === 0) {
          kind = "corner_tl";
        } else if (gx === COLS - 1 && gy === 0) {
          kind = "corner_tr";
        } else if (gx === 0 && gy === ROWS - 1) {
          kind = "corner_bl";
        } else if (gx === COLS - 1 && gy === ROWS - 1) {
          kind = "corner_br";

        } else if (gy === 0) {
            kind = "top";
          } else if (gy === ROWS - 1) {
            kind = "bottom";
          } else if (gx === 0) {
            kind = "left";
          } else if (gx === COLS - 1) {
            kind = "right";

        } else if (!n && !s && !w && !e) {
          kind = "single";

        } else if (!w && !e && (n || s)) {
          if (!n) kind = "vertical_top";
          else if (!s) kind = "vertical_bottom";
          else kind = "vertical_mid";

        // 🔹 Línea horizontal
        } else if (!n && !s && (w || e)) {
          if (!w) kind = "horizontal_left";
          else if (!e) kind = "horizontal_right";
          else kind = "horizontal_mid";
        } else {

        if (!n && !w) kind = 'corner_tl';
        else if (!n && !e) kind = 'corner_tr';
        else if (!s && !w) kind = 'corner_bl';
        else if (!s && !e) kind = 'corner_br';
        else kind = 'top'; // fallback (completamente rodeado)
        }

        walls.push({ gx, gy, x: px, y: py, kind });
      } else if (val === 2) {
        // posición inicial del jugador (en el centro de la celda)
        player.x = px + tileSize / 2;
        player.y = py + tileSize / 2;
      } else if (val === 3) {
        enemies.push({ x: px + tileSize / 2, y: py + tileSize / 2 });
      } else if (val === 4) {
        keys.push({ x: px + tileSize / 2, y: py + tileSize / 2 });
      }  else if (val === 5) {
        // puertas: agrupar en pares horizontal/vertical o single
        if (seen[gy][gx]) continue; // ya procesado por su pareja
        // Preferimos pares horizontales si existe vecino a la derecha
        if (gx + 1 < COLS && levelArray[gy][gx + 1] === 5 && !seen[gy][gx + 1]) {
          // par horizontal: left = half1, right = half2
          const pxR = offsetX + (gx + 1) * tileSize;
          doors.push({ gx: gx,     gy: gy, x: px,   y: py, half: 1, size: 2, orient: 'h' });
          doors.push({ gx: gx + 1, gy: gy, x: pxR,  y: py, half: 2, size: 2, orient: 'h' });
          seen[gy][gx] = true;
          seen[gy][gx + 1] = true;
        } else if (gy + 1 < ROWS && levelArray[gy + 1][gx] === 5 && !seen[gy + 1][gx]) {
          // par vertical: top = half1, bottom = half2
          const pyB = offsetY + (gy + 1) * tileSize;
          doors.push({ gx: gx, gy: gy,     x: px, y: py,  half: 1, size: 2, orient: 'v' });
          doors.push({ gx: gx, gy: gy + 1, x: px, y: pyB, half: 2, size: 2, orient: 'v' });
          seen[gy][gx] = true;
          seen[gy + 1][gx] = true;
        } else {
          // single tile door
          doors.push({ gx: gx, gy: gy, x: px, y: py, half: 1, size: 1, orient: 'single' });
          seen[gy][gx] = true;
        }
      }
    }
  }
  // Inicializa enemigos con velocidad y dirección aleatoria
for (let e of enemies) {
  e.vx = random([-1, 0, 1]);
  e.vy = random([-1, 0, 1]);
  e.speed = tileSize * 0.019; // velocidad base
  e.dirTimer = millis() + random(1000, 3000); // cambiar dirección cada cierto tiempo
}
}

function drawLevel() {
  // muros
  for (let w of walls) {
    const cx = w.x + tileSize / 2;
    const cy = w.y + tileSize / 2;
    switch (w.kind) {
      case 'corner_tl':
        image(wallCorner1, cx, cy, tileSize, tileSize); break;
      case 'corner_tr':
        image(wallCorner2, cx, cy, tileSize, tileSize); break;
      case 'corner_bl':
        image(wallCorner3, cx, cy, tileSize, tileSize); break;
      case 'corner_br':
        image(wallCorner4, cx, cy, tileSize, tileSize); break;
      case 'top':
        image(wallTop, cx, cy, tileSize, tileSize); break;
      case 'bottom':
        image(wallBottom, cx, cy, tileSize, tileSize); break;
      case 'left':
        image(wallLeft, cx, cy, tileSize, tileSize); break;
      case 'right':
        image(wallRight, cx, cy, tileSize, tileSize); break;

      case 'vertical_top':
        image(wallVerticalTop, cx, cy, tileSize, tileSize); break;
      case 'vertical_mid':
        image(wallVerticalMid, cx, cy, tileSize, tileSize); break;
      case 'vertical_bottom':
        image(wallVerticalBottom, cx, cy, tileSize, tileSize); break;

      case 'horizontal_left':
        image(wallHorizontalLeft, cx, cy, tileSize, tileSize); break;
      case 'horizontal_mid':
        image(wallHorizontalMid, cx, cy, tileSize, tileSize); break;
      case 'horizontal_right':
        image(wallHorizontalRight, cx, cy, tileSize, tileSize); break;

      case 'single':
        image(wallSingle, cx, cy, tileSize, tileSize); break;

      default:
        // fallback: cuadrado
        fill(100); rect(w.x, w.y, tileSize, tileSize);
    }
  }

  // enemigos
  fill(200, 0, 0);
  for (let e of enemies) {
    rect(e.x - tileSize*0.3, e.y - tileSize*0.3, tileSize*0.6, tileSize*0.6);
  }

  // llaves
  fill(255, 255, 0);
  for (let k of keys) {
    ellipse(k.x, k.y, tileSize*0.4);
  }
  // asegúrate de tener imageMode(CENTER) antes de esto
imageMode(CENTER);

for (let d of doors) {
  const cx = d.x + tileSize / 2;
  const cy = d.y + tileSize / 2;

  push();
  translate(cx, cy);

  let angle = 0;
  let img = dungeon_door; // fallback

  if (d.size === 2) {
    if (d.orient === 'h') {
      // Puerta horizontal (Norte / Sur) - dos tiles lado a lado
      const leftG = (d.half === 1) ? d.gx : d.gx - 1;
      const gy = d.gy;

      const aboveBoth = isWallOrEdge(currentLevel, leftG, gy - 1) && isWallOrEdge(currentLevel, leftG + 1, gy - 1);
      const belowBoth = isWallOrEdge(currentLevel, leftG, gy + 1) && isWallOrEdge(currentLevel, leftG + 1, gy + 1);

      if (aboveBoth && !belowBoth) angle = 0;        // Norte
      else if (belowBoth && !aboveBoth) angle = PI;  // Sur
      else angle = 0; // fallback

      // swap para la mitad izquierda/derecha si la puerta está rotada 180°
      let leftAsset = dungeon_door_half1;
      let rightAsset = dungeon_door_half2;
      if (Math.abs(angle - PI) < 0.001) {
        [leftAsset, rightAsset] = [rightAsset, leftAsset];
      }
      img = (d.half === 1) ? leftAsset : rightAsset;

    } else if (d.orient === 'v') {
      // Puerta vertical (Este / Oeste) - dos tiles uno encima del otro
      const topG = d.gy - (d.half === 2 ? 1 : 0);
      const gx = d.gx;

      const leftBlocked  = isWallOrEdge(currentLevel, gx - 1, topG) && isWallOrEdge(currentLevel, gx - 1, topG + 1);
      const rightBlocked = isWallOrEdge(currentLevel, gx + 1, topG) && isWallOrEdge(currentLevel, gx + 1, topG + 1);

      if (rightBlocked && !leftBlocked) {
        angle = HALF_PI;   // Este
      } else if (leftBlocked && !rightBlocked) {
        angle = -HALF_PI;  // Oeste
      } else {
        // desempate: contamos muros en un rango y elegimos la mayoría
        let leftCount = 0, rightCount = 0;
        for (let yy = topG - 1; yy <= topG + 2; yy++) {
          if (isWallOrEdge(currentLevel, gx - 1, yy)) leftCount++;
          if (isWallOrEdge(currentLevel, gx + 1, yy)) rightCount++;
        }
        angle = (rightCount >= leftCount) ? HALF_PI : -HALF_PI;
      }

      // FIX clave: para vertical, cuando la puerta apunta al Oeste (-HALF_PI)
      // hay que *swap* las mitades para que la mitad superior/inferior
      // encajen correctamente tras la rotación.
      if (Math.abs(angle - (-HALF_PI)) < 0.001) {
        // si es Oeste, invertimos las mitades al dibujar
        img = (d.half === 1) ? dungeon_door_half2 : dungeon_door_half1;
      } else {
        // Este (o fallback): mitades normales
        img = (d.half === 1) ? dungeon_door_half1 : dungeon_door_half2;
      }
    }

    rotate(angle);
    image(img, 0, 0, tileSize, tileSize);

  } else {
    // Puerta single (1 tile)
    const gx = d.gx;
    const gy = d.gy;

    if (isWallOrEdge(currentLevel, gx, gy - 1)) angle = 0;
    else if (isWallOrEdge(currentLevel, gx, gy + 1)) angle = PI;
    else if (isWallOrEdge(currentLevel, gx + 1, gy)) angle = HALF_PI;
    else if (isWallOrEdge(currentLevel, gx - 1, gy)) angle = -HALF_PI;
    else angle = 0;

    rotate(angle);
    image(dungeon_door, 0, 0, tileSize, tileSize);
  }

  pop();
}
}

function isWallOrEdge(levelArray, cx, cy) {
  if (cx < 0 || cx >= COLS || cy < 0 || cy >= ROWS) return true; // <- aquí está el fix
  return levelArray[cy][cx] === 1;
}


function collidesWithWallAtPixel(px, py) {
  // seguridad: si no hay level cargado, consideramos colisión (prevención)
  if (!currentLevel) return true;

  // --- calcular tamaño de colisión del jugador ---
  // si definiste player.scale (ej: scale = 1 => 1 tile), lo usamos.
  // si no, hacemos fallback al radiusFactor legacy (r = tileSize * radiusFactor)
  let spriteFullSize;
  if (typeof player.scale === 'number' && player.scale > 0) {
    spriteFullSize = tileSize * player.scale;
  } else {
    // radiusFactor es el radio en relación al tile (legacy). Lo convertimos a diámetro.
    spriteFullSize = tileSize * player.radiusFactor * 2;
  }

  // halfSize = mitad del sprite * margen pequeño para evitar quedarse pegado
  let halfSize = spriteFullSize * 0.5 * 1.5; // 0.95 = 5% de tolerancia (ajusta si quieres)

  let left = px - halfSize;
  let right = px + halfSize;
  let top = py - halfSize;
  let bottom = py + halfSize;

  // convertir caja del jugador a índices de tiles (enteros)
  let c1 = Math.floor((left - offsetX) / tileSize);
  let c2 = Math.floor((right - offsetX) / tileSize);
  let r1 = Math.floor((top - offsetY) / tileSize);
  let r2 = Math.floor((bottom - offsetY) / tileSize);

  // helper: AABB intersection
  const rectsIntersect = (aL, aT, aR, aB, bL, bT, bR, bB) => {
    return aL < bR && aR > bL && aT < bB && aB > bT;
  };

  // iterar tiles ocupados por la caja del jugador
  for (let ry = r1; ry <= r2; ry++) {
    for (let cx = c1; cx <= c2; cx++) {

      // fuera del mapa -> consideramos colisión (comportamiento previo)
      if (ry < 0 || ry >= ROWS || cx < 0 || cx >= COLS) {
        return true;
      }

      const tileVal = currentLevel[ry][cx];

      // muro sólido tradicional
      if (tileVal === 1) return true;

      // puerta (5): comprobar mitad colisionable
      if (tileVal === 5) {
        const tileLeft = offsetX + cx * tileSize;
        const tileTop  = offsetY + ry * tileSize;
        const tileRight = tileLeft + tileSize;
        const tileBottom = tileTop + tileSize;

        const pL = left, pR = right, pT = top, pB = bottom;

        // detectar orientación y mitad (en tiempo real, sin depender de doorMap)
        let orient = null; // 'h'|'v'|null
        let half = 1;      // 1 = left/top, 2 = right/bottom

        if (cx + 1 < COLS && currentLevel[ry][cx + 1] === 5) { // pareja a la derecha
          orient = 'h'; half = 1;
        } else if (cx - 1 >= 0 && currentLevel[ry][cx - 1] === 5) { // pareja a la izquierda
          orient = 'h'; half = 2;
        } else if (ry + 1 < ROWS && currentLevel[ry + 1][cx] === 5) { // pareja abajo
          orient = 'v'; half = 1;
        } else if (ry - 1 >= 0 && currentLevel[ry - 1][cx] === 5) { // pareja arriba
          orient = 'v'; half = 2;
        } else {
          // puerta single -> tratamos como sólido completo (puedes cambiar esto)
          if (rectsIntersect(pL, pT, pR, pB, tileLeft, tileTop, tileRight, tileBottom)) return true;
          else continue;
        }

        // comprobar la mitad exterior bloqueada según orient/half
        if (orient === 'h') {
          if (half === 1) {
            const colL = tileLeft;
            const colR = tileLeft + tileSize / 2;
            if (rectsIntersect(pL, pT, pR, pB, colL, tileTop, colR, tileBottom)) return true;
          } else {
            const colL = tileLeft + tileSize / 2;
            const colR = tileRight;
            if (rectsIntersect(pL, pT, pR, pB, colL, tileTop, colR, tileBottom)) return true;
          }
        } else { // 'v'
          if (half === 1) {
            const colT = tileTop;
            const colB = tileTop + tileSize / 2;
            if (rectsIntersect(pL, pT, pR, pB, tileLeft, colT, tileRight, colB)) return true;
          } else {
            const colT = tileTop + tileSize / 2;
            const colB = tileBottom;
            if (rectsIntersect(pL, pT, pR, pB, tileLeft, colT, tileRight, colB)) return true;
          }
        }

        // si no colisionó la mitad bloqueada, se puede pasar por esta celda
        continue;
      }

      // otros tiles (0,2,3,4, etc.) no bloquean
    }
  }

  return false; // ninguna colisión detectada
}





// setup

function setup() {

  const saved = loadBase();

  if (!isBrowserFullscreen() && !document.fullscreenElement) {
    baseH = windowHeight;
    baseW = Math.round(baseH * 4 / 3);
    saveBase();
  } else {
    if (saved) {
      baseW = saved.w;
      baseH = saved.h;
    } else {
      baseH = Math.round(screen.height * 0.8);
      baseW = Math.round(baseH * 4 / 3);
      console.warn('No hay base guardada. Sal del fullscreen y presiona R para capturar la medida de ventana normal.');
    }
  }
  cnv = createCanvas(baseW, baseH);
  cnv.style('display', 'block');
  centerCanvas();

  // No tocar lo de arriba. Maneja el ancho y alto base del área de juego.

  textFont('monospace');
  calculatePlayArea();
  player.x = offsetX + playW / 2;
  player.y = offsetY + playH / 2;
  inited = true;
  imageMode(CENTER);

  loadLevel(exampleLevel);
}

function drawVignette() {
  push();

  // Usamos directamente el canvas 2D de p5.js
  let ctx = drawingContext;
  let centerX = width / 2;
  let centerY = height / 2;
  let maxRadius = dist(0, 0, width/2, height/2);

  // Crear gradiente radial
  let gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
  gradient.addColorStop(0, "rgba(0,0,0,0)");      // transparente en el centro
  gradient.addColorStop(1, "rgba(25,0,0,0.4)");    // oscuro en los bordes

  // Dibujar un rectángulo qrgba(27, 14, 14, 0.4), 0.4)on ese gradiente
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  pop();

  // Scanlines CRT
  for (let y = 0; y < height; y += 4) {
    stroke(0, 40);
    line(0, y, width, y);
  }
}



function draw() {
  background('#2e1708');

  noSmooth();
  push();
  translate(offsetX, offsetY);
  noStroke();
  fill(255);
  rect(0, 0, playW, playH);
  pop();

  drawGrid();

  handlePlayerMovement();

  drawPlayer();

  drawLevel();

  drawVignette();
}

let exampleLevel = [
  [1,1,1,1,1,5,5,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,4,1],
  [1,0,1,1,0,0,0,0,0,0,0,1],
  [5,0,1,0,0,0,0,1,1,1,0,5],
  [5,0,0,0,2,0,0,0,0,0,0,5],
  [1,0,0,0,0,0,0,0,0,3,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1], // puerta entre tiles en sur
  [1,1,1,1,1,5,5,1,1,1,1,1]
];

// -----------------------------
// SISTEMA DE SALAS 
// -----------------------------

// Definimos varias salas (ejemplo). Asegurate que cada sala tenga un '2' si querés que loadLevel coloque ahí al jugador.
// Pueden tener distinto tamaño lógico; usamos COLS/ROWS constantes del juego.
// -----------------------------
// MAPA DE 3x3 SALAS
// -----------------------------
const SALA_ANCHO = 12;
const SALA_ALTO = 8;

// 0 = vacío, 1 = muro, 2 = jugador, 3 = enemigo, 4 = llave, 5 = puerta
const mapGrid = [
  [ // FILA 0
    [ // (0,0)
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [1,4,0,0,0,0,0,0,0,3,0,1],
      [1,0,1,1,0,0,0,0,1,0,0,1],
      [1,0,1,0,0,0,0,1,1,0,0,5],
      [1,0,0,0,0,0,0,0,0,0,0,5],
      [1,0,0,0,0,0,0,0,0,3,0,1],
      [1,0,0,0,0,0,0,0,0,0,4,1],
      [1,1,1,1,1,5,5,1,1,1,1,1],
    ],
    [ // (0,1)
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,3,0,0,0,0,0,0,4,1],
      [1,0,1,1,0,0,0,0,0,0,0,1],
      [5,0,1,0,0,4,0,1,1,0,0,5],
      [5,0,0,0,0,0,0,0,0,0,0,5],
      [1,0,0,0,3,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,5,5,1,1,1,1,1],
    ],
    [ // (0,2)
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,4,0,0,0,0,0,1],
      [1,0,1,1,0,0,0,3,0,0,0,1],
      [5,0,1,0,0,0,0,1,1,1,0,1],
      [5,0,0,0,0,3,0,1,0,0,0,1],
      [1,0,0,0,0,0,0,0,4,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,5,5,1,1,1,1,1],
    ]
  ],
  [ // FILA 1
    [ // (1,0)
      [1,1,1,1,1,5,5,1,1,1,1,1],
      [1,0,4,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,0,0,3,0,0,0,0,1],
      [1,0,1,0,0,0,1,1,1,0,0,5],
      [1,0,0,0,0,0,0,1,0,0,0,5],
      [1,0,0,0,0,0,0,0,0,4,0,1],
      [1,0,0,0,0,0,0,0,0,0,3,1],
      [1,1,1,1,1,5,5,1,1,1,1,1],
    ],
    [ // (1,1) → sala inicial
      [1,1,1,1,1,5,5,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,4,1],
      [1,0,1,1,0,0,0,0,1,0,0,1],
      [5,0,1,0,0,0,0,1,1,0,0,5],
      [5,0,0,0,0,0,0,0,0,0,0,5],
      [1,0,0,0,0,0,0,0,0,3,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,5,5,1,1,1,1,1],
    ],
    [ // (1,2)
      [1,1,1,1,1,5,5,1,1,1,1,1],
      [1,0,3,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,0,4,0,0,0,0,0,1],
      [5,0,1,0,0,0,0,1,1,1,0,1],
      [5,0,0,0,0,0,0,1,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,3,0,1],
      [1,0,0,0,0,0,0,0,4,0,0,1],
      [1,1,1,1,1,5,5,1,1,1,1,1],
    ]
  ],
  [ // FILA 2
    [ // (2,0)
      [1,1,1,1,1,5,5,1,1,1,1,1],
      [1,3,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,0,0,0,0,4,0,0,1],
      [1,0,1,0,0,3,0,1,1,1,0,5],
      [1,0,0,0,0,0,1,1,0,0,0,5],
      [1,0,0,0,0,0,0,0,0,3,0,1],
      [1,0,4,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    [ // (2,1)
      [1,1,1,1,1,5,5,1,1,1,1,1],
      [1,0,0,0,0,0,0,3,0,0,0,1],
      [1,0,1,1,0,0,0,0,4,0,0,1],
      [5,0,1,0,0,0,1,1,1,0,0,5],
      [5,0,0,0,0,0,0,1,0,0,0,5],
      [1,0,0,4,0,0,0,0,0,3,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    [ // (2,2)
      [1,1,1,1,1,5,5,1,1,1,1,1],
      [1,0,0,4,0,0,0,0,0,0,0,1],
      [1,0,1,1,0,3,0,0,0,0,0,1],
      [5,0,1,0,0,0,0,1,1,1,0,1],
      [5,0,0,0,0,0,0,1,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,3,0,1],
      [1,0,0,0,0,0,0,0,0,0,4,1],
      [1,1,1,1,1,1,1,1,1,1,1,1],
    ]
  ]
];

// -----------------------------
// VARIABLES DE ESTADO
// -----------------------------
let currentRoomX = 1; // columna actual (empieza en el centro)
let currentRoomY = 1; // fila actual
exampleLevel = mapGrid[currentRoomY][currentRoomX];

function loadCurrentRoom() {
  exampleLevel = mapGrid[currentRoomY][currentRoomX];
  loadLevel(exampleLevel);
}

// -----------------------------
// CAMBIO DE SALAS
// -----------------------------
function moveToRoom(dx, dy) {
  const newX = currentRoomX + dx;
  const newY = currentRoomY + dy;
  if (newX >= 0 && newX < 3 && newY >= 0 && newY < 3) {
    currentRoomX = newX;
    currentRoomY = newY;
    loadCurrentRoom();
  }
}

// -----------------------------
// DETECTAR PUERTAS Y CAMBIAR SALA
// -----------------------------



function checkDoorTransition() {
  if (isTransitioning) return; // evitar movimiento mientras se hace el fade

  const cx = Math.floor((player.x - offsetX) / tileSize);
  const cy = Math.floor((player.y - offsetY) / tileSize);
  
  if (cx < 0 || cx >= SALA_ANCHO || cy < 0 || cy >= SALA_ALTO) return;

  // arriba
  if (cy === 0 && exampleLevel[cy][cx] === 5) {
    pendingMove = { dx: 0, dy: -1, posY: offsetY + (SALA_ALTO - 1.1) * tileSize };
    isTransitioning = true;
    fadeDirection = 1; // oscurecer
  }
  // abajo
  else if (cy === SALA_ALTO - 1 && exampleLevel[cy][cx] === 5) {
    pendingMove = { dx: 0, dy: +1, posY: offsetY + tileSize };
    isTransitioning = true;
    fadeDirection = 1;
  }
  // izquierda
  else if (cx === 0 && exampleLevel[cy][cx] === 5) {
    pendingMove = { dx: -1, dy: 0, posX: offsetX + (SALA_ANCHO - 1.1) * tileSize };
    isTransitioning = true;
    fadeDirection = 1;
  }
  // derecha
  else if (cx === SALA_ANCHO - 1 && exampleLevel[cy][cx] === 5) {
    pendingMove = { dx: +1, dy: 0, posX: offsetX + tileSize };
    isTransitioning = true;
    fadeDirection = 1;
  }
}

function handleTransition() {
  if (!isTransitioning) return;

  // Dibuja un rectángulo negro encima de todo
  fill(0, fadeAlpha);
  noStroke();
  rect(0, 0, width, height);

  fadeAlpha += 15 * fadeDirection; // velocidad del fade

  // Si ya está completamente negro...
  if (fadeDirection === 1 && fadeAlpha >= 255) {
    fadeAlpha = 255;
    fadeDirection = -1;

    // Hacemos el cambio de sala durante el "negro total"
    if (pendingMove) {
      moveToRoom(pendingMove.dx, pendingMove.dy);

      if (pendingMove.posX !== undefined) player.x = pendingMove.posX;
      if (pendingMove.posY !== undefined) player.y = pendingMove.posY;

      pendingMove = null;
    }
  }

  // Cuando termina de aclarar, fin de la transición
  if (fadeDirection === -1 && fadeAlpha <= 0) {
    fadeAlpha = 0;
    isTransitioning = false;
  }
}


// -----------------------------
// Integración con draw()
// -----------------------------
const __orig_draw_for_levels = draw;
draw = function() {
  __orig_draw_for_levels.apply(this, arguments);
  updateEnemies();

  checkDoorTransition();
  handleTransition();
};
