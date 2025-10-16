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
let heartSprite;

let player = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  // velocidad relativa al tileSize — se calcula dinámicamente en draw
  radiusFactor: 0.32, // radio del jugador en relación al tile
  hearts: 3,
  maxHearts: 3,
};

let inited = false;

// Sprites de muros
let wallTop, wallBottom, wallLeft, wallRight;
let wallCorner1, wallCorner2, wallCorner3, wallCorner4;

// Tamaño de la sala (ventana de la cámara)
// ---------- Cámara / transición (globales) ----------
const TRANSITION_FRAMES = 20;   // duración de la transición en frames (ajustable)

// Estado de la transición
let isTransitioning = false;
let transitionCounter = 0;

// Offsets en PIXELES (se usan en translate(-camOffset.x, -camOffset.y))
let camOffset = { x: 0, y: 0 };         // offset actual de la cámara (px)
let transitionFrom = { x: 0, y: 0 };    // pixel (px) donde empieza la transición
let transitionTo   = { x: 0, y: 0 };    // pixel (px) donde termina la transición

// Sala destino pendiente (se actualiza al final de la transición)

// ---------- Tamaño de sala (ya lo tienes, solo confirma) ----------
let ROOM_WIDTH  = 12; // ancho de la "sala" en tiles
let ROOM_HEIGHT = 8;  // alto de la "sala" en tiles

// ---------- Índices del tile donde está el jugador (actualizados cada frame) ----------
let playerTileX = 0; // posición en tiles relativa al mapa global (no calcular aquí)
let playerTileY = 0;

// ---------- Dimensiones del mapa (se calculan en loadLevel/setup) ----------
let MAP_COLS = 0; // columnas del mapa global (tiles) -> setear después de cargar level
let MAP_ROWS = 0; // filas del mapa global (tiles)    -> setear después de cargar level

roomX = 0;
roomY = 0;

transitionFrames = TRANSITION_FRAMES;

let transitionProgress = 0;
let startOffsetX, startOffsetY;
let targetOffsetX, targetOffsetY;
let targetRoomX, targetRoomY;

// Sala destino pendiente
let pendingRoom = { x: null, y: null, fromX: null, fromY: null };

// Dirección de transición (necesario para recolocar al jugador al final)
let transitionDir = { x: 0, y: 0 };

// Cargar imágenes
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
  if (!inited || isTransitioning) return; // bloquear mientras transiciona

  let maxSpeed = tileSize * 0.07;

  let left  = keyIsDown(65) || keyIsDown(37);
  let right = keyIsDown(68) || keyIsDown(39);
  let up    = keyIsDown(87) || keyIsDown(38);
  let down  = keyIsDown(83) || keyIsDown(40);

  let dx = (right ? 1 : 0) - (left ? 1 : 0);
  let dy = (down  ? 1 : 0) - (up   ? 1 : 0);

  if (dx !== 0 && dy !== 0) {
    dx *= 0.7071;
    dy *= 0.7071;
  }

  const accel = 0.20;
  const desiredVx = dx * maxSpeed;
  const desiredVy = dy * maxSpeed;

  player.vx = dx === 0 ? 0 : lerp(player.vx, desiredVx, accel);
  player.vy = dy === 0 ? 0 : lerp(player.vy, desiredVy, accel);

  let nextX = player.x + player.vx;
  if (!collidesWithWallAtPixel(nextX, player.y)) player.x = nextX; else player.vx = 0;

  let nextY = player.y + player.vy;
  if (!collidesWithWallAtPixel(player.x, nextY)) player.y = nextY; else player.vy = 0;

  // --- actualizar tile actual ---
  playerTileX = Math.floor(player.x / tileSize);
  playerTileY = Math.floor(player.y / tileSize);
  let tileValue = currentLevel[playerTileY]?.[playerTileX] ?? 1; // fallback muro

  // --- debug ---
  console.log(
    `Tile player: (${playerTileX},${playerTileY}) | Tile value: ${tileValue} | Room: (${roomX},${roomY})`
  );

  // --- transición entre salas ---
  if (tileValue === 0) { 
    if (playerTileX >= ROOM_WIDTH - 1) {
      startTransition(1, 0); // derecha
    } else if (playerTileX <= 0) {
      startTransition(-1, 0); // izquierda
    } else if (playerTileY >= ROOM_HEIGHT - 1) {
      startTransition(0, 1); // abajo
    } else if (playerTileY <= 0) {
      startTransition(0, -1); // arriba
    }
  }
}



function drawPlayer() {
  let r = tileSize * player.radiusFactor;

  // Dirección del sprite (ya lo tienes)
  if (player.vx !== 0 || player.vy !== 0) {
    if (Math.abs(player.vx) > Math.abs(player.vy)) {
      if (player.vx > 0) currentPlayerImg = playerSprites.right;
      else currentPlayerImg = playerSprites.left;
    } else {
      if (player.vy > 0) currentPlayerImg = playerSprites.down;
      else currentPlayerImg = playerSprites.up;
    }
  }

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

function loadLevel(levelArray) {
  // limpiar entidades
  walls = [];
  enemies = [];
  keys = [];
  doors = [];

  currentLevel = levelArray;

  // Dimensiones globales del mapa
  MAP_ROWS = currentLevel.length;
  MAP_COLS = currentLevel[0].length;

  // matriz para marcar puertas ya procesadas
  let seen = Array.from({ length: MAP_ROWS }, () => Array(MAP_COLS).fill(false));

  for (let gy = 0; gy < MAP_ROWS; gy++) {
    for (let gx = 0; gx < MAP_COLS; gx++) {
      const val = currentLevel[gy][gx];
      // POSICIONES EN COORDENADAS DEL MUNDO (sin offsetX/offsetY)
      const px = gx * tileSize;
      const py = gy * tileSize;

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
        // POSICIÓN DEL JUGADOR EN COORDENADAS DEL MUNDO (centro del tile)
        player.x = gx * tileSize + tileSize / 2;
        player.y = gy * tileSize + tileSize / 2;
      } else if (val === 3) {
        enemies.push({ x: gx * tileSize + tileSize / 2, y: gy * tileSize + tileSize / 2 });
      } else if (val === 4) {
        keys.push({ x: gx * tileSize + tileSize / 2, y: gy * tileSize + tileSize / 2 });
      } else if (val === 5) {
        if (seen[gy][gx]) continue;
        // Buscar pareja a la derecha
        if (gx + 1 < MAP_COLS && currentLevel[gy][gx + 1] === 5 && !seen[gy][gx + 1]) {
          doors.push({ gx: gx,     gy: gy, x: px,                    y: py,                    half: 1, size: 2, orient: 'h' });
          doors.push({ gx: gx + 1, gy: gy, x: (gx + 1) * tileSize,  y: py,                    half: 2, size: 2, orient: 'h' });
          seen[gy][gx] = true;
          seen[gy][gx + 1] = true;
        } else if (gy + 1 < MAP_ROWS && currentLevel[gy + 1][gx] === 5 && !seen[gy + 1][gx]) {
          doors.push({ gx: gx, gy: gy,     x: px, y: py,                 half: 1, size: 2, orient: 'v' });
          doors.push({ gx: gx, gy: gy + 1, x: px, y: (gy + 1) * tileSize, half: 2, size: 2, orient: 'v' });
          seen[gy][gx] = true;
          seen[gy + 1][gx] = true;
        } else {
          doors.push({ gx: gx, gy: gy, x: px, y: py, half: 1, size: 1, orient: 'single' });
          seen[gy][gx] = true;
        }
      }
    }
  }

  // asegurarnos que la cámara apunte a la sala actual (coordenadas de mundo)
  camOffset.x = roomX * ROOM_WIDTH * tileSize;
  camOffset.y = roomY * ROOM_HEIGHT * tileSize;
}

// --------------------
// WORLD MAP
// --------------------

// Cada posición [fila][columna] representa una sala distinta.
// Puedes usar null si una sala no existe (pared exterior)
const exampleLevel = [
  [
    level_0_0, level_0_1, level_0_2
  ],
  [
    level_1_0, level_1_1, level_1_2
  ],
  [
    level_2_0, level_2_1, level_2_2
  ]
];

// Posición inicial del jugador en el worldmap
roomX = 1; // columna central
roomY = 1; // fila central

// --------------------
// Ejemplo de sala
// --------------------
const level_0_0 = [
  [1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,2,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1],
];



function drawLevel() {
  // límites de la cámara en coordenadas de tiles globales
  const startGX = roomX * ROOM_WIDTH;
  const startGY = roomY * ROOM_HEIGHT;
  const endGX = startGX + ROOM_WIDTH;
  const endGY = startGY + ROOM_HEIGHT;

  // --- MUROS ---
  for (let w of walls) {
    const gx = w.gx;
    const gy = w.gy;

    if (gx >= startGX && gx < endGX && gy >= startGY && gy < endGY) {
      // coordenadas locales dentro de la cámara, luego a coordenadas de pantalla
      const localX = gx - startGX;
      const localY = gy - startGY;
      const cx = offsetX + localX * tileSize + tileSize / 2;
      const cy = offsetY + localY * tileSize + tileSize / 2;

      switch (w.kind) {
        case 'corner_tl': image(wallCorner1, cx, cy, tileSize, tileSize); break;
        case 'corner_tr': image(wallCorner2, cx, cy, tileSize, tileSize); break;
        case 'corner_bl': image(wallCorner3, cx, cy, tileSize, tileSize); break;
        case 'corner_br': image(wallCorner4, cx, cy, tileSize, tileSize); break;
        case 'top': image(wallTop, cx, cy, tileSize, tileSize); break;
        case 'bottom': image(wallBottom, cx, cy, tileSize, tileSize); break;
        case 'left': image(wallLeft, cx, cy, tileSize, tileSize); break;
        case 'right': image(wallRight, cx, cy, tileSize, tileSize); break;

        case 'vertical_top': image(wallVerticalTop, cx, cy, tileSize, tileSize); break;
        case 'vertical_mid': image(wallVerticalMid, cx, cy, tileSize, tileSize); break;
        case 'vertical_bottom': image(wallVerticalBottom, cx, cy, tileSize, tileSize); break;

        case 'horizontal_left': image(wallHorizontalLeft, cx, cy, tileSize, tileSize); break;
        case 'horizontal_mid': image(wallHorizontalMid, cx, cy, tileSize, tileSize); break;
        case 'horizontal_right': image(wallHorizontalRight, cx, cy, tileSize, tileSize); break;

        case 'single': image(wallSingle, cx, cy, tileSize, tileSize); break;

        default:
          fill(100);
          rect(offsetX + localX * tileSize, offsetY + localY * tileSize, tileSize, tileSize);
      }
    }
  }

  // --- ENEMIGOS ---
  fill(200, 0, 0);
  for (let e of enemies) {
    // e.x / e.y son coordenadas absolutas (offsetX + gx*tileSize + tileSize/2)
    const gx = Math.floor((e.x - offsetX) / tileSize);
    const gy = Math.floor((e.y - offsetY) / tileSize);

    if (gx >= startGX && gx < endGX && gy >= startGY && gy < endGY) {
      const cx = offsetX + (gx - startGX) * tileSize + tileSize / 2;
      const cy = offsetY + (gy - startGY) * tileSize + tileSize / 2;
      rect(cx - tileSize * 0.3, cy - tileSize * 0.3, tileSize * 0.6, tileSize * 0.6);
    }
  }

  // --- LLAVES ---
  fill(255, 255, 0);
  for (let k of keys) {
    const gx = Math.floor((k.x - offsetX) / tileSize);
    const gy = Math.floor((k.y - offsetY) / tileSize);

    if (gx >= startGX && gx < endGX && gy >= startGY && gy < endGY) {
      const cx = offsetX + (gx - startGX) * tileSize + tileSize / 2;
      const cy = offsetY + (gy - startGY) * tileSize + tileSize / 2;
      ellipse(cx, cy, tileSize * 0.4);
    }
  }

  // --- PUERTAS ---
  imageMode(CENTER);
  for (let d of doors) {
    const gx = d.gx;
    const gy = d.gy;

    if (gx >= startGX && gx < endGX && gy >= startGY && gy < endGY) {
      const cx = offsetX + (gx - startGX) * tileSize + tileSize / 2;
      const cy = offsetY + (gy - startGY) * tileSize + tileSize / 2;

      push();
      translate(cx, cy);

      let angle = 0;
      let img = dungeon_door; // fallback

      if (d.size === 2) {
        if (d.orient === 'h') {
          const leftG = (d.half === 1) ? d.gx : d.gx - 1;
          const gyLocal = d.gy;

          const aboveBoth = isWallOrEdge(currentLevel, leftG, gyLocal - 1) && isWallOrEdge(currentLevel, leftG + 1, gyLocal - 1);
          const belowBoth = isWallOrEdge(currentLevel, leftG, gyLocal + 1) && isWallOrEdge(currentLevel, leftG + 1, gyLocal + 1);

          if (aboveBoth && !belowBoth) angle = 0;
          else if (belowBoth && !aboveBoth) angle = PI;
          else angle = 0;

          let leftAsset = dungeon_door_half1;
          let rightAsset = dungeon_door_half2;
          if (Math.abs(angle - PI) < 0.001) [leftAsset, rightAsset] = [rightAsset, leftAsset];
          img = (d.half === 1) ? leftAsset : rightAsset;

        } else if (d.orient === 'v') {
          const topG = d.gy - (d.half === 2 ? 1 : 0);
          const gxLocal = d.gx;

          const leftBlocked  = isWallOrEdge(currentLevel, gxLocal - 1, topG) && isWallOrEdge(currentLevel, gxLocal - 1, topG + 1);
          const rightBlocked = isWallOrEdge(currentLevel, gxLocal + 1, topG) && isWallOrEdge(currentLevel, gxLocal + 1, topG + 1);

          if (rightBlocked && !leftBlocked) angle = HALF_PI;
          else if (leftBlocked && !rightBlocked) angle = -HALF_PI;
          else {
            let leftCount = 0, rightCount = 0;
            for (let yy = topG - 1; yy <= topG + 2; yy++) {
              if (isWallOrEdge(currentLevel, gxLocal - 1, yy)) leftCount++;
              if (isWallOrEdge(currentLevel, gxLocal + 1, yy)) rightCount++;
            }
            angle = (rightCount >= leftCount) ? HALF_PI : -HALF_PI;
          }

          if (Math.abs(angle - (-HALF_PI)) < 0.001) img = (d.half === 1) ? dungeon_door_half2 : dungeon_door_half1;
          else img = (d.half === 1) ? dungeon_door_half1 : dungeon_door_half2;
        }

        rotate(angle);
        image(img, 0, 0, tileSize, tileSize);

      } else {
        // Puerta single
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
}

// --------------------
// Transición: start / update / finish
// --------------------

function startTransition(dxChunk, dyChunk) {
  if (isTransitioning) return;

  
  // ⚠️ Verificar si la sala destino existe en el worldmap
  const targetY = roomY + dyChunk;
  const targetX = roomX + dxChunk;

  if (!exampleLevel[targetY] || !exampleLevel[targetY][targetX]) {
    console.log("No hay sala en esa dirección");
    return;
  }

  isTransitioning = true;
  transitionProgress = 0;

  transitionFrom = { x: camOffset.x, y: camOffset.y };
  transitionTo = { 
    x: camOffset.x + dxChunk * ROOM_WIDTH * tileSize,
    y: camOffset.y + dyChunk * ROOM_HEIGHT * tileSize
  };

  // Guardar dirección de movimiento
  transitionDir.x = dxChunk;
  transitionDir.y = dyChunk;

  // ⚠️ NO cargues la sala todavía
  // Sólo marca a dónde iremos
  pendingRoom.x = roomX + dxChunk;
  pendingRoom.y = roomY + dyChunk;
}


// easing simple (smoothstep)
function _ease(t) {
  return t * t * (3 - 2 * t);
}

function updateTransition() {
  if (!isTransitioning) return;

  transitionProgress += 0.05; // velocidad
  if (transitionProgress >= 1) {
    transitionProgress = 1;
    isTransitioning = false;

    // 💡 Aquí SÍ cargamos la sala
    roomX = pendingRoom.x;
    roomY = pendingRoom.y;
    loadLevel(exampleLevel[roomY][roomX]);

    // Recolocar jugador en borde contrario
    if (transitionDir.x === 1) player.x = 0;
    if (transitionDir.x === -1) player.x = (ROOM_WIDTH - 1) * tileSize;
    if (transitionDir.y === 1) player.y = 0;
    if (transitionDir.y === -1) player.y = (ROOM_HEIGHT - 1) * tileSize;

    // Resetear cámara
    camOffset.x = roomX * ROOM_WIDTH * tileSize;
    camOffset.y = roomY * ROOM_HEIGHT * tileSize;
  } else {
    // Interpolar la cámara mientras dura la transición
    camOffset.x = lerp(transitionFrom.x, transitionTo.x, transitionProgress);
    camOffset.y = lerp(transitionFrom.y, transitionTo.y, transitionProgress);
  }
} 


function finishTransition() {
  // asegurar valores exactos
  camOffset.x = transitionTo.x;
  camOffset.y = transitionTo.y;

  // datos útiles
  const dx = transitionDir.x;
  const dy = transitionDir.y;
  const prevRoomX = pendingRoom.fromX;
  const prevRoomY = pendingRoom.fromY;
  const newRoomX = pendingRoom.x;
  const newRoomY = pendingRoom.y;

  // marcamos la nueva sala
  roomX = newRoomX;
  roomY = newRoomY;

  // --- Reposicionar jugador en la sala nueva ---
  // calculamos la tile global actual del jugador (antes de mover)
  let oldGX = Math.floor(player.x / tileSize);
  let oldGY = Math.floor(player.y / tileSize);

  // posición relativa dentro de la sala anterior
  let relCol = oldGX - prevRoomX * ROOM_WIDTH;
  let relRow = oldGY - prevRoomY * ROOM_HEIGHT;
  relCol = Math.max(0, Math.min(ROOM_WIDTH - 1, relCol));
  relRow = Math.max(0, Math.min(ROOM_HEIGHT - 1, relRow));

  // objetivo inicial (global tiles) en la sala nueva
  let targetGX = newRoomX * ROOM_WIDTH + relCol;
  let targetGY = newRoomY * ROOM_HEIGHT + relRow;

  if (dx === 1) {
    // vinimos por la derecha -> aparecer en la columna 0 de la nueva sala
    targetGX = newRoomX * ROOM_WIDTH + 0;
    targetGY = newRoomY * ROOM_HEIGHT + relRow;
  } else if (dx === -1) {
    // vinimos por la izquierda -> columna final
    targetGX = newRoomX * ROOM_WIDTH + (ROOM_WIDTH - 1);
    targetGY = newRoomY * ROOM_HEIGHT + relRow;
  } else if (dy === 1) {
    // vinimos por abajo -> fila 0
    targetGY = newRoomY * ROOM_HEIGHT + 0;
    targetGX = newRoomX * ROOM_WIDTH + relCol;
  } else if (dy === -1) {
    // vinimos por arriba -> fila final
    targetGY = newRoomY * ROOM_HEIGHT + (ROOM_HEIGHT - 1);
    targetGX = newRoomX * ROOM_WIDTH + relCol;
  }

  // clamp dentro del mapa
  targetGX = Math.max(0, Math.min(MAP_COLS - 1, targetGX));
  targetGY = Math.max(0, Math.min(MAP_ROWS - 1, targetGY));

  // buscar la tile más cercana no-muro dentro de la sala (preferencia a permanecer cerca del target)
  function isPassable(gx, gy) {
    if (gy < 0 || gy >= MAP_ROWS || gx < 0 || gx >= MAP_COLS) return false;
    const v = currentLevel[gy][gx];
    // considerar pasable todo lo que NO sea muro (1). 5 (puerta) también se acepta.
    return v !== 1;
  }

  // si la tile objetivo no es pasable, buscamos alrededor (en la misma columna o fila según movimiento)
  if (!isPassable(targetGX, targetGY)) {
    let found = false;
    if (dx !== 0) {
      // buscamos verticalmente en la misma columna
      const col = targetGX;
      const startRow = targetGY;
      for (let d = 0; d < ROOM_HEIGHT && !found; d++) {
        // alternar búsqueda hacia arriba y abajo
        const up = startRow - d;
        const down = startRow + d;
        if (up >= newRoomY * ROOM_HEIGHT && up < (newRoomY + 1) * ROOM_HEIGHT && isPassable(col, up)) {
          targetGY = up; found = true; break;
        }
        if (down >= newRoomY * ROOM_HEIGHT && down < (newRoomY + 1) * ROOM_HEIGHT && isPassable(col, down)) {
          targetGY = down; found = true; break;
        }
      }
    } else if (dy !== 0) {
      // buscamos horizontalmente en la misma fila
      const row = targetGY;
      const startCol = targetGX;
      for (let d = 0; d < ROOM_WIDTH && !found; d++) {
        const left = startCol - d;
        const right = startCol + d;
        if (left >= newRoomX * ROOM_WIDTH && left < (newRoomX + 1) * ROOM_WIDTH && isPassable(left, row)) {
          targetGX = left; found = true; break;
        }
        if (right >= newRoomX * ROOM_WIDTH && right < (newRoomX + 1) * ROOM_WIDTH && isPassable(right, row)) {
          targetGX = right; found = true; break;
        }
      }
    }

    // si todavía no encontramos, hacemos búsqueda general en la sala (espiral simple)
    if (!found) {
      const roomStartCol = newRoomX * ROOM_WIDTH;
      const roomStartRow = newRoomY * ROOM_HEIGHT;
      outer: for (let r = 0; r < ROOM_HEIGHT; r++) {
        for (let c = 0; c < ROOM_WIDTH; c++) {
          const gx = roomStartCol + c;
          const gy = roomStartRow + r;
          if (isPassable(gx, gy)) { targetGX = gx; targetGY = gy; found = true; break outer; }
        }
      }
    }
  }

  // finalmente colocamos al jugador en el centro de la tile encontrada
  player.x = targetGX * tileSize + tileSize / 2;
  player.y = targetGY * tileSize + tileSize / 2;
  player.vx = 0;
  player.vy = 0;

  // limpiar estado de transición
  isTransitioning = false;
  transitionCounter = 0;
  pendingRoom.x = null;
  pendingRoom.y = null;
  pendingRoom.fromX = null;
  pendingRoom.fromY = null;
  transitionDir.x = 0;
  transitionDir.y = 0;

  console.log(`finishTransition -> now in room (${roomX},${roomY}) player tile (${targetGX},${targetGY})`);
}


function isWallOrEdge(levelArray, cx, cy) {
  // usar dimensiones del mapa global
  if (cx < 0 || cx >= MAP_COLS || cy < 0 || cy >= MAP_ROWS) return true;
  return levelArray[cy][cx] === 1;
}



function collidesWithWallAtPixel(px, py) {
  if (!currentLevel) return true;

  // tamaño del sprite en píxeles
  let spriteFullSize;
  if (typeof player.scale === 'number' && player.scale > 0) {
    spriteFullSize = tileSize * player.scale;
  } else {
    spriteFullSize = tileSize * player.radiusFactor * 2;
  }

  // halfSize = mitad del sprite * margen pequeño para evitar quedarse pegado
  let halfSize = spriteFullSize * 0.5 * 1.55; // 0.95 = 5% de tolerancia (ajusta si quieres)

  let left = px - halfSize;
  let right = px + halfSize;
  let top = py - halfSize;
  let bottom = py + halfSize;

  // convertir caja del jugador a indices de tiles (WORLD)
  let c1 = Math.floor(left / tileSize);
  let c2 = Math.floor(right / tileSize);
  let r1 = Math.floor(top / tileSize);
  let r2 = Math.floor(bottom / tileSize);

  const rectsIntersect = (aL, aT, aR, aB, bL, bT, bR, bB) => {
    return aL < bR && aR > bL && aT < bB && aB > bT;
  };

  for (let ry = r1; ry <= r2; ry++) {
    for (let cx = c1; cx <= c2; cx++) {
      // fuera del mapa -> colisión
      if (ry < 0 || ry >= MAP_ROWS || cx < 0 || cx >= MAP_COLS) return true;

      const tileVal = currentLevel[ry][cx];
      if (tileVal === 1) return true;

      if (tileVal === 5) {
        const tileLeft = cx * tileSize;
        const tileTop = ry * tileSize;
        const tileRight = tileLeft + tileSize;
        const tileBottom = tileTop + tileSize;

        const pL = left, pR = right, pT = top, pB = bottom;

        // detectar orientación y mitad
        let orient = null;
        let half = 1;

        if (cx + 1 < MAP_COLS && currentLevel[ry][cx + 1] === 5) { orient = 'h'; half = 1; }
        else if (cx - 1 >= 0 && currentLevel[ry][cx - 1] === 5) { orient = 'h'; half = 2; }
        else if (ry + 1 < MAP_ROWS && currentLevel[ry + 1][cx] === 5) { orient = 'v'; half = 1; }
        else if (ry - 1 >= 0 && currentLevel[ry - 1][cx] === 5) { orient = 'v'; half = 2; }
        else {
          if (rectsIntersect(pL, pT, pR, pB, tileLeft, tileTop, tileRight, tileBottom)) return true;
          else continue;
        }

        const margin = tileSize * 0.1;

        if (orient === 'h') {
          if (half === 1) {
            const colL = tileLeft;
            const colR = tileLeft + tileSize / 2 - margin;
            if (rectsIntersect(pL, pT, pR, pB, colL, tileTop, colR, tileBottom)) return true;
          } else {
            const colL = tileLeft + tileSize / 2 + margin;
            const colR = tileRight;
            if (rectsIntersect(pL, pT, pR, pB, colL, tileTop, colR, tileBottom)) return true;
          }
        } else if (orient === 'v') {
          if (half === 1) {
            const colT = tileTop;
            const colB = tileTop + tileSize / 2 - margin;
            if (rectsIntersect(pL, pT, pR, pB, tileLeft, colT, tileRight, colB)) return true;
          } else {
            const colT = tileTop + tileSize / 2 + margin;
            const colB = tileBottom;
            if (rectsIntersect(pL, pT, pR, pB, tileLeft, colT, tileRight, colB)) return true;
          }
        }

        continue;
      }
    }
  }

  return false;
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

  loadLevel(exampleLevel[roomY][roomX]);

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
  gradient.addColorStop(1, "rgba(25,0,0,0.7)");    // oscuro en los bordes

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

function drawUI() {
  noStroke();
  fill(0);
  rect(0, 0, width, height * 0.13);

  // 🔹 Ajustamos tamaño de corazones al alto de la barra
  let barHeight = height * 0.1;   
  let heartSize = barHeight * 0.4; 
  let margin = 5;

  // 🔹 Texto estilo Zelda (arriba de los corazones)
  textFont(pixelFont);
  textAlign(LEFT, TOP);
  textSize(barHeight * 0.35);
  fill(255, 80, 0);

  let textX = 20;   // margen izquierdo
  let textY = barHeight * 0.15; // un poco desde arriba
  text("-HEALTH-", textX, textY);

  // 🔹 Dibujar corazones (debajo del texto)
  for (let i = 0; i < player.maxHearts; i++) {
    let x = 41 + i * (heartSize + margin);  // en fila, alineados con el texto
    let y = textY + barHeight * 0.7;           // debajo del texto

    if (i < player.hearts) {
      image(heartSprite, x, y, heartSize, heartSize);
    } else {
      tint(255, 100);
      image(heartSprite, x, y, heartSize, heartSize);
      noTint();
    }
  }
}



function draw() {
  background('#2e1708');
  noSmooth();

  updateTransition();

  push();
  translate(-camOffset.x, -camOffset.y);
  
  noStroke();
  fill(255);
  rect(0, 0, playW, playH);
  pop();

  drawGrid();

  handlePlayerMovement();

  push();

  drawLevel();
  drawPlayer();
  pop();

  drawUI();
  drawVignette();
}