
// Llave de almacenamiento para el anchoalto del canvas. No tocar.
const STORAGE_KEY = 'myGameBaseCanvasSize_v1';

let clickedOptionIndex = -1;
let clickTime = 0;

let lastStepTime = 0;
let stepFrame = 1;

let answerState = null; // "correct", "incorrect" o null

let correctSound, correctSong, incorrectSound, incorrectSong;

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

let enemiesSprites = {};

let keySprite = {};

let juegoIniciado = false;

let dificultad = 0;

let isQuestionActive = false;
let currentQuestion = null;

let btnWidth = 200;
let btnHeight = 50;
let espacio=20;
let btnX;
let btnY1, btnY2, btnY3;

// let questions = [
//   {
//     text: "¿Cuál es la capital de Francia?",
//     options: ["Madrid", "Roma", "París", "Londres"],
//     correct: 2
//   },
//   {
//     text: "¿Cuánto es 5 × 6?",
//     options: ["11", "30", "25", "20"],
//     correct: 1
//   },
//   {
//     text: "¿Cuál de estos animales puede volar?",
//     options: ["Perro", "Gato", "Murciélago", "Pez"],
//     correct: 2
//   }
// ];

let preguntaActual;
let opciones = [];
let respuestaCorrecta;

let usedKeys = []; // IDs o posiciones de llaves ya usadas
let keyPickupSound;

let questionFont;

let isAttacking = false;
let attackStartTime = 0;
let attackDuration = 250;

let player = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  // velocidad relativa al tileSize — se calcula dinámicamente en draw
  radiusFactor: 0.32,  // radio del jugador en relación al tile
  dir: "down",
  hearts: 3,
  maxHearts: 3,
  score: 0,
  invulnerable: false,
  invulStart: 0,
  invulDuration: 1000,
  attackHitRegistered: false
};

let wallTop, wallBottom, wallLeft, wallRight;
let wallCorner1, wallCorner2, wallCorner3, wallCorner4;

let attackSounds = [];
let clickSound;
let hoverSound;
let transitionSound;
let lastHoverIndex = -1; // índice de la opción sobre la que estaba antes

let musicaJuego;
let musicaPregunta;
let musicaActual = null;
let gameOver = false;

function recibirDaño(enemigo) {
  if (player.invulnerable || gameOver) return;

  player.hearts = max(0, player.hearts - 1);

  // activar invulnerabilidad
  player.invulnerable = true;
  player.invulStart = millis();
}

function manejarInvulnerabilidad() {
  if (!player.invulnerable) return;
  if (millis() - player.invulStart > player.invulDuration) {
    player.invulnerable = false;
  }
}

function checkEnemyDamage() {
  if (player.invulnerable || gameOver) return;

  let distColision = tileSize * 0.5;

  for (let e of enemies) {
    let d = dist(player.x, player.y, e.x, e.y);

    if (d < distColision) {
      recibirDaño(e);
      return; // solo un golpe
    }
  }
}

function keyPressed() {
  if (gameOver && key === 'r' || key === 'R') {
    location.reload();
  }
}

function seleccionarDificultad(nivel) {
  dificultad = nivel;
  juegoIniciado = true;
}

function sumarPuntos() {
  if (dificultad === 1) {
    player.score += 10;
  } else if (dificultad === 2) {
    player.score += 50;
  } else if (dificultad === 3) {
    player.score += 100;
  }
}

function sumarPuntosEnemigos() {
  if (dificultad === 1) {
    player.score += 5;
  } else if (dificultad === 2) {
    player.score += 10;
  } else if (dificultad === 3) {
    player.score += 20;
  }
}

function actualizarScore(score) {
  fetch("http://localhost/Trivia-Dungeon/model/actualizarScore.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "score=" + encodeURIComponent(score)
  })
  .then(response => response.text())
  .then(data => {
    if (data.trim() === "updated") {
      console.log("✅ Score actualizado con éxito");
    } else if (data.trim() === "no_update") {
      console.log("ℹ️ El score no superó el actual, no se actualizó");
    } else if (data.trim() === "no_session") {
      console.warn("⚠️ No hay sesión iniciada");
    } else {
      console.error("❌ Error al actualizar:", data);
    }
  })
  .catch(err => console.error("Error de conexión:", err));
}



function mousePressed() {
  if (!juegoIniciado) {
    // elegir dificultad
    if (clickEnBoton(btnX, btnY1, btnWidth, btnHeight)) {
      clickSound.play();
      seleccionarDificultad(1);

    } else if (clickEnBoton(btnX, btnY2, btnWidth, btnHeight)) {
      clickSound.play();
      seleccionarDificultad(2);

    } else if (clickEnBoton(btnX, btnY3, btnWidth, btnHeight)) {
      clickSound.play();
      seleccionarDificultad(3);
    }

    
    return;
  }
  if (isQuestionActive && preguntaActual && opciones.length) {
    for (let i = 0; i < opciones.length; i++) {
      let y = height / 2 - 20 + i * 50;
      if (
        mouseX > width / 2 - 150 &&
        mouseX < width / 2 + 150 &&
        mouseY > y &&
        mouseY < y + 40 &&
        clickedOptionIndex === -1
      ) {
        clickedOptionIndex = i;
        clickTime = millis();
        
        clickSound.play();

        setTimeout(() => {
          let respuestaSeleccionada = opciones[i];
          verificarRespuesta(respuestaSeleccionada);

          if (respuestaSeleccionada === respuestaCorrecta){
            answerState = "correct";
            correctSound.play();
          } else {
            answerState = "incorrect";
            incorrectSound.play();
          }

          setTimeout(() => {
            detenerTodas();

            if (answerState === "correct"){
              correctSong.play();
              correctSong.setLoop(false);
            } else {
              incorrectSong.play();
              incorrectSong.setLoop(false);
            }

            setTimeout(() =>{
              if (answerState === "correct"){
                correctSong.stop();
              } else {
                incorrectSong.stop();
              }

              cerrarCuestionario();
              clickedOptionIndex = -1;
              answerState = null;
            }, 5000);
          }, 1000);
        }, 1000);
      }
    }
  }
}

function manejarMusica(modo){
  if (modo === "pregunta"){
    if (musicaActual !== musicaPregunta){
      detenerTodas();
      musicaPregunta.loop();
      musicaActual = musicaPregunta;
    }
  } else if (modo === "juego"){
    if (musicaActual !== musicaJuego){
      detenerTodas();
      musicaJuego.loop();
      musicaActual = musicaJuego;
    }
  }
}

function detenerTodas() {
  if (musicaJuego.isPlaying()) musicaJuego.stop();
  if (musicaPregunta.isPlaying()) musicaPregunta.stop();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = floor(random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function obtenerPregunta() {
  fetch("http://localhost/Trivia-Dungeon/model/obtener_preguntas.php?dificultad=" + dificultad)
    .then(res => res.json())
    .then(data => {
      console.log("Respuesta del servidor:", data); // <-- debug
      if (data.error) {
        preguntaActual = data.error;
        opciones = [];
        return;
      }
      preguntaActual = data.pregunta;
      respuestaCorrecta = data.correcta;
      opciones = [data.correcta, data.falsa1, data.falsa2, data.falsa3];
      opciones = shuffle(opciones);
      mensaje = "";
    });
}

function drawUI() {
  noStroke(); fill(0);
  rect(0, 0, width, height * 0.13); // 🔹 Ajustamos tamaño de corazones al alto de la barra
  let barHeight = height * 0.1;
  let heartSize = barHeight * 0.4;
  let margin = 5; // 🔹 Texto estilo Zelda (arriba de los corazones)
  textFont(pixelFont);
  textAlign(LEFT, TOP);
  textSize(barHeight * 0.35);
  fill(255, 80, 0);
  let textX = 20; // margen izquierdo
  let textY = barHeight * 0.15; // un poco desde arriba
  text("-HEALTH-", textX, textY); // 🔹 Dibujar corazones (debajo del texto)
  for (let i = 0; i < player.maxHearts; i++) {
    let x = 41 + i * (heartSize + margin); // en fila, alineados con el texto
    let y = textY + barHeight * 0.7; // debajo del texto
    if (i < player.hearts) {
      image(heartSprite, x, y, heartSize, heartSize);
    } else {
      tint(255, 100);
      image(heartSprite, x, y, heartSize, heartSize);
      noTint();
    }
  }
  textAlign(RIGHT, TOP);
  textSize(barHeight * 0.4);
  fill(255, 255, 0); // Amarillo dorado para destacar el puntaje
  let scoreText = "SCORE: " + player.score;
  let scoreX = width - 20; // margen derecho
  let scoreY = barHeight * 0.15;
  text(scoreText, scoreX, scoreY);
}

function verificarRespuesta(respuesta) {
  if (respuesta === respuestaCorrecta) {
    sumarPuntos();
    mensaje = "✅ Correcto";
  
  } else {
    player.hearts -= 1;
    mensaje = "❌ Incorrecto";
  }
}

function cerrarCuestionario() {
  detenerTodas();
  isQuestionActive = false;
  preguntaActual = null;
  opciones = [];
  clickedOptionIndex = -1;
  answerState = null;
  mensaje = "";
}


function verificarRespuestaSinCerrar(respuesta) {
  if (respuesta === respuestaCorrecta) {
    sumarPuntos();
    mensaje = "✅ Correcto";
  } else {
    player.hearts -= 1;
    mensaje = "❌ Incorrecto";
  }
}

function mostrarBoton(texto, x, y, w, h) {
  fill(180);
  rect(x, y, w, h, 10);
  fill(0);
  textAlign(CENTER, CENTER);
  text(texto, x + w / 2, y + h / 2);
  textAlign(LEFT, BASELINE);
}
function clickEnBoton(x, y, w, h) {
  return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
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
  wallTop = loadImage("../src/sprites/tiles/dungeon/dungeon_wall_top.png");
  wallBottom = loadImage("../src/sprites/tiles/dungeon/dungeon_wall_bottom.png");
  wallLeft = loadImage("../src/sprites/tiles/dungeon/dungeon_wall_left.png");
  wallRight = loadImage("../src/sprites/tiles/dungeon/dungeon_wall_right.png");

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


  playerSprites = {
    up1: loadImage("../src/sprites/player/player_walk_up_1.png"),
    up2: loadImage("../src/sprites/player/player_walk_up_2.png"),
    down1: loadImage("../src/sprites/player/player_walk_down_1.png"),
    down2: loadImage("../src/sprites/player/player_walk_down_2.png"),
    left1: loadImage("../src/sprites/player/player_walk_left_1.png"),
    left2: loadImage("../src/sprites/player/player_walk_left_2.png"),
    right1: loadImage("../src/sprites/player/player_walk_right_1.png"),
    right2: loadImage("../src/sprites/player/player_walk_right_2.png"),

    atku1: loadImage("../src/sprites/player/player_atk_up_1.png"),
    atku2: loadImage("../src/sprites/player/player_atk_up_2.png"),
    atku3: loadImage("../src/sprites/player/player_atk_up_3.png"),
    atkd1: loadImage("../src/sprites/player/player_atk_down_1.png"),
    atkd2: loadImage("../src/sprites/player/player_atk_down_2.png"),
    atkd3: loadImage("../src/sprites/player/player_atk_down_3.png"),
    atkl1: loadImage("../src/sprites/player/player_atk_left_1.png"),
    atkl2: loadImage("../src/sprites/player/player_atk_left_2.png"),
    atkl3: loadImage("../src/sprites/player/player_atk_left_3.png"),
    atkr1: loadImage("../src/sprites/player/player_atk_right_1.png"),
    atkr2: loadImage("../src/sprites/player/player_atk_right_2.png"),
    atkr3: loadImage("../src/sprites/player/player_atk_right_3.png")
  }

  enemiesSprites = loadImage("../src/sprites/enemies/crab/enemy_crab_2.png");
  keySprite = loadImage("../src/sprites/items/key.png");

  heartSprite = loadImage("../src/sprites/ui/heart_full.png");

  currentPlayerImg = playerSprites.down1;

  pixelFont = loadFont("../src/fonts/ari-w9500.ttf");
  questionFont = loadFont("../src/fonts/PressStart2P.ttf");
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

  // Si está atacando, no se mueve
  if (isAttacking) return;

  // velocidad máxima proporcional al tileSize
  let maxSpeed = tileSize * 0.08; // ajusta para hacer más/menos rápido

  // leer input
  let left = keyIsDown(65) || keyIsDown(37); // A, ←
  let right = keyIsDown(68) || keyIsDown(39); // D, →
  let up = keyIsDown(87) || keyIsDown(38); // W, ↑
  let down = keyIsDown(83) || keyIsDown(40); // S, ↓

  let dx = (right ? 1 : 0) - (left ? 1 : 0);
  let dy = (down ? 1 : 0) - (up ? 1 : 0);

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

  // 🔸 Verificar interacción con llaves
  for (let i = 0; i < keys.length; i++) {
    let k = keys[i];
    let d = dist(player.x, player.y, k.x, k.y);

    if (d < tileSize * 0.5 && !isQuestionActive) {
      if (!keyPickupSound.isPlaying()) keyPickupSound.play();
      keys.splice(i, 1);// eliminar la llave del mapa
      setTimeout(() => {
        showQuestion();       // mostrar pregunta
      }, 1000);
      break;
    }
  }
}


function showQuestion() {
  isQuestionActive = true;
  obtenerPregunta();
}

function reproducirSonidoAtaque() {
  // Elegir un índice aleatorio entre 0 y 2
  let randomIndex = floor(random(attackSounds.length));

  // Detener todos los sonidos anteriores para evitar superposición
  for (let s of attackSounds) {
    if (s.isPlaying()) s.stop();
  }

  // Reproducir el sonido elegido
  attackSounds[randomIndex].play();
}

function handleAttack() {
  // Iniciar ataque si se presiona J o Z y no está atacando
  if ((keyIsDown(74) || keyIsDown(90)) && !isAttacking) { // 74 = J, 90 = Z
    isAttacking = true;
    attackStartTime = millis();
    reproducirSonidoAtaque();

    // Guardamos la dirección actual del jugador
    if (currentPlayerImg === playerSprites.up1 || currentPlayerImg === playerSprites.up2) player.dir = "up";
    else if (currentPlayerImg === playerSprites.down1 || currentPlayerImg === playerSprites.down2) player.dir = "down";
    else if (currentPlayerImg === playerSprites.left1 || currentPlayerImg === playerSprites.left2) player.dir = "left";
    else if (currentPlayerImg === playerSprites.right1 || currentPlayerImg === playerSprites.right2) player.dir = "right";
  }

  // Si está atacando, manejar animación de ataque
  if (isAttacking) {
    const elapsed = millis() - attackStartTime;
    const frameTime = attackDuration / 5; // Divide la duración del ataque en 5 partes

    let attackX = player.x;
    let attackY = player.y;

    if (player.dir === "up")    attackY -= tileSize;
    if (player.dir === "down")  attackY += tileSize;
    if (player.dir === "left")  attackX -= tileSize;
    if (player.dir === "right") attackX += tileSize;

    // Tamaño del área de impacto
    let hitRadius = tileSize * 0.6;  // ajustable

    for (let i = enemies.length - 1; i >= 0; i--) {
      let e = enemies[i];

      // Distancia entre el punto del ataque y el enemigo
      let d = dist(attackX, attackY, e.x, e.y);

      // Si está dentro del tile atacado → eliminar
      if (d < hitRadius) {
        enemies.splice(i, 1); // ❌ enemigo eliminado
        sumarPuntosEnemigos();
      }
    }
    
    // Secuencia: 1 → 3 → 2 → 3 → 1
    let frame;
    if (elapsed < frameTime) frame = 1;
    else if (elapsed < frameTime * 2) frame = 3;
    else if (elapsed < frameTime * 3) frame = 2;
    else if (elapsed < frameTime * 4) frame = 3;
    else frame = 1;

    // Mostrar sprite según dirección y frame
    if (player.dir === "up") currentPlayerImg = playerSprites[`atku${frame}`];
    else if (player.dir === "down") currentPlayerImg = playerSprites[`atkd${frame}`];
    else if (player.dir === "left") currentPlayerImg = playerSprites[`atkl${frame}`];
    else if (player.dir === "right") currentPlayerImg = playerSprites[`atkr${frame}`];

    // Terminar ataque
    if (elapsed > attackDuration) {
      isAttacking = false;
      if (player.dir === "up") currentPlayerImg = playerSprites.up1;
      else if (player.dir === "down") currentPlayerImg = playerSprites.down1;
      else if (player.dir === "left") currentPlayerImg = playerSprites.left1;
      else if (player.dir === "right") currentPlayerImg = playerSprites.right1;
    }
    
  }
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
  if (!isAttacking && (player.vx !== 0 || player.vy !== 0)) {
    if (millis() - lastStepTime > 200){
      stepFrame = stepFrame === 1 ? 2 : 1;
      lastStepTime = millis();
    }

    if (Math.abs(player.vx) > Math.abs(player.vy)) {
      // Movimiento horizontal domina
      if (player.vx > 0) {
        currentPlayerImg = playerSprites[`right${stepFrame}`];
        player.dir = "right";
      } else {
        currentPlayerImg = playerSprites[`left${stepFrame}`];
        player.dir = "left";
      }
    } else {
      // Movimiento vertical domina
      if (player.vy > 0) {
        currentPlayerImg = playerSprites[`down${stepFrame}`];
        player.dir = "down";
      } else {
        currentPlayerImg = playerSprites[`up${stepFrame}`];
        player.dir = "up";
      }
    }
  }

  // Dibujar sprite centrado en la posición del jugador


  imageMode(CENTER);

  if (player.invulnerable) {
    if (Math.floor(millis() / 80) % 2 === 0) {
      tint(255, 100);
    } else {
      noTint();
    }
  } else {
    noTint();
  }

  // Si está atacando, dibujar el sprite extendido según dirección
  if (isAttacking) {
    switch (player.dir) {
      case "up":
        // Sprite 16x32 extendido hacia arriba
        image(currentPlayerImg, player.x, player.y - tileSize / 2, tileSize, tileSize * 2);
        break;

      case "down":
        // Sprite 16x32 extendido hacia abajo
        image(currentPlayerImg, player.x, player.y + tileSize / 2, tileSize, tileSize * 2);
        break;

      case "left":
        // Sprite 32x16 extendido hacia la izquierda
        image(currentPlayerImg, player.x - tileSize / 2, player.y, tileSize * 2, tileSize);
        break;

      case "right":
        // Sprite 32x16 extendido hacia la derecha
        image(currentPlayerImg, player.x + tileSize / 2, player.y, tileSize * 2, tileSize);
        break;
    }
  }
  
  else {
    // Si no está atacando, sprite normal 16x16
    image(currentPlayerImg, player.x, player.y, tileSize, tileSize);
  }
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

  let seen = Array.from({ length: ROWS }, () => Array(COLS).fill(false));

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
        enemies.push({
          x: px + tileSize / 2,
          y: py + tileSize / 2,
          vx: random([-1, 0, 1]),
          vy: random([-1, 0, 1]),
          speed: tileSize * 0.019,
          dirTimer: millis() + random(1000, 3000),
          sprite: enemiesSprites
        });
      } else if (val === 4) {
        keys.push({ x: px + tileSize / 2, y: py + tileSize / 2, sprite: keySprite });
      } else if (val === 5) {
        // puertas: agrupar en pares horizontal/vertical o single
        if (seen[gy][gx]) continue; // ya procesado por su pareja
        // Preferimos pares horizontales si existe vecino a la derecha
        if (gx + 1 < COLS && levelArray[gy][gx + 1] === 5 && !seen[gy][gx + 1]) {
          // par horizontal: left = half1, right = half2
          const pxR = offsetX + (gx + 1) * tileSize;
          doors.push({ gx: gx, gy: gy, x: px, y: py, half: 1, size: 2, orient: 'h' });
          doors.push({ gx: gx + 1, gy: gy, x: pxR, y: py, half: 2, size: 2, orient: 'h' });
          seen[gy][gx] = true;
          seen[gy][gx + 1] = true;
        } else if (gy + 1 < ROWS && levelArray[gy + 1][gx] === 5 && !seen[gy + 1][gx]) {
          // par vertical: top = half1, bottom = half2
          const pyB = offsetY + (gy + 1) * tileSize;
          doors.push({ gx: gx, gy: gy, x: px, y: py, half: 1, size: 2, orient: 'v' });
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
  for (let e of enemies) {
    imageMode(CENTER);
    image(e.sprite, e.x, e.y, tileSize * 0.8, tileSize * 0.8);
  }

  // llaves

  for (let k of keys) {
    imageMode(CENTER);
    image(k.sprite, k.x, k.y, tileSize * 0.8, tileSize * 0.8);
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

        const leftBlocked = isWallOrEdge(currentLevel, gx - 1, topG) && isWallOrEdge(currentLevel, gx - 1, topG + 1);
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
        const tileTop = offsetY + ry * tileSize;
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
  userStartAudio();

  attackSounds[0] = loadSound("../src/sounds/snd_board_sword1.wav");
  attackSounds[1] = loadSound("../src/sounds/snd_board_sword2.wav");
  attackSounds[2] = loadSound("../src/sounds/snd_board_sword3.wav");
  transitionSound = loadSound("../src/sounds/snd_trans.wav");
  keyPickupSound = loadSound("../src/sounds/snd_cuest_inicio.wav");
  clickSound = loadSound("../src/sounds/snd_resp_selec.wav");
  hoverSound = loadSound("../src/sounds/snd_resp_mov.wav");
  correctSound = loadSound("../src/sounds/snd_resp_correcta.wav")
  incorrectSound = loadSound("../src/sounds/snd_resp_incorrecta.wav")

  musicaJuego = loadSound("../src/music/board_sword_music.ogg");
  musicaPregunta = loadSound("../src/music/TV_GAME.ogg");
  correctSong = loadSound("../src/music/baci_perugina.ogg");
  incorrectSong = loadSound("../src/music/tv_results_screen.ogg")

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
  let maxRadius = dist(0, 0, width / 2, height / 2);

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
  if (gameOver) {
    background(0, 0, 0, 200);
    textAlign(CENTER, CENTER);
    textSize(40);
    fill(255, 0, 0);
    text("GAME OVER", width / 2, height / 2 - 40);
    textSize(20);
    fill(255);
    text("Presiona R para reiniciar", width / 2, height / 2 + 20);
    manejarMusica("gameover");
    noLoop(); // 🔹 Detiene draw() para congelar el juego
    return;
  }
  if (player.hearts <= 0) {
    player.hearts = 0;
    gameOver = true;
    // 🔹 Subir score a la base de datos si es mayor
    actualizarScore(player.score);
  }


  // si todavía no elegiste dificultad
  if (!juegoIniciado) {
    background(220);
    textSize(24);
    fill(0);
    textAlign(CENTER, CENTER);
    text("Selecciona la dificultad:",  width / 2, height / 3 - 80);

    btnX = width / 2 - btnWidth / 2;
    btnY1 = height/3;
    btnY2 = height/3 + btnHeight + espacio;
    btnY3 = height / 3 + (btnHeight + espacio)*2;
    espacio= 20;

    // botones de dificultad
    mostrarBoton("Fácil (1)", btnX, btnY1, btnWidth, btnHeight);
    mostrarBoton("Medio (2)", btnX, btnY2, btnWidth, btnHeight);
    mostrarBoton("Difícil (3)", btnX, btnY3, btnWidth, btnHeight);
    return;
  }

  background('#2e1708');

  noSmooth();
  push();
  translate(offsetX, offsetY);
  noStroke();
  fill(255);
  rect(0, 0, playW, playH);
  pop();

  drawGrid();

  handleAttack();
  handlePlayerMovement();
  
  manejarInvulnerabilidad();

  drawPlayer();

  drawLevel();
  drawUI();

  if (isQuestionActive && preguntaActual) {
    drawQuestionUI();
    manejarMusica("pregunta");
  } else {
    manejarMusica("juego");
  }
  drawVignette();
}

function drawQuestionUI() {
  if (!preguntaActual || opciones.length === 0) return;

  fill('#00bbff');
  rect(0, 0, width, height); // fondo semitransparente

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(20);
  textFont(questionFont)
  
  const question = preguntaActual;
  const maxTextWidth = width * 0.7; // ancho máximo antes de hacer salto de línea
  const lineHeight = 28;
  
  // Romper texto largo en varias líneas
  let words = question.split(' ');
  let lines = [];
  let currentLine = '';
  for (let w of words) {
    let testLine = currentLine + w + ' ';
    if (textWidth(testLine) > maxTextWidth) {
      lines.push(currentLine.trim());
      currentLine = w + ' ';
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine.trim());

  // Calcular dimensiones de la caja
  let boxW = maxTextWidth + 60;
  let boxH = lines.length * lineHeight + 40;
  let boxX = width / 2 - boxW / 2;
  let boxY = height / 2 - boxH / 2 - 150;

  // --- Dibujar bordes (doble borde tipo retro) ---

  fill('#00bbff'); // fondo interno
  rect(boxX, boxY, boxW, boxH, 5);

  // --- Mostrar texto centrado en líneas ---
  fill(255);
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], width / 2, boxY + 30 + i * lineHeight);
  }

  // Dibujar las 4 opciones
  textSize(18);
  textAlign(LEFT, CENTER);
  let hoverNow = -1;
  for (let i = 0; i < opciones.length; i++) {
    let y = height / 2 - 20 + i * 50;
    let x = width / 2 - 150;
    let w = 300;
    let h = 40;

    // detectar si el mouse está sobre esta opción
    let isHover =
      mouseX > x && mouseX < x + w &&
      mouseY > y && mouseY < y + h;

    if (isHover) hoverNow = i;

    // dibujar texto
    fill(255);
    text(opciones[i], x + 10, y + h / 2);

    // ❤️ si el mouse está encima
    if (clickedOptionIndex === i) {

      let elapsed = millis() - clickTime;
      let blink = floor(elapsed / 500) % 2 === 0; // 👈 alterna cada 0.5s

        if (answerState === "correct"){
          if (elapsed < 1000){
          fill(255, 0, 0);
          text("♥", x - 25, y + h / 2 + 1);
        } else {
          if (blink) {
            fill(0, 255, 0);
            text("O", x - 25, y + h / 2 + 1);
          }
        }
      } else if (answerState === "incorrect") {
        if (elapsed < 1000){
          fill (255, 0, 0);
          text("♥", x - 25, y + h / 2 + 1);
        } else {
          if (blink) {
            fill (255, 0, 0);
            text("X", x - 25, y + h / 2 + 1);
          }
        }
      } else {
        fill(255, 0, 0);
        text("♥", x - 25, y + h / 2 + 1);
      }
    }
    else if (isHover && clickedOptionIndex === -1){
    fill(255, 128, 128);
    text("♥", x - 25, y + h / 2 + 1);
    }
  }

  if (hoverNow !== -1 && hoverNow !== lastHoverIndex){
    hoverSound.play();
  }

  lastHoverIndex = hoverNow;
}

let exampleLevel = [
  [1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1],
  [1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [5, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 5],
  [5, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 5],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // puerta entre tiles en sur
  [1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1]
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
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 4, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1],
      [1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 5],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1],
      [1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1],
    ],
    [ // (0,1)
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 3, 0, 0, 0, 0, 0, 0, 4, 1],
      [1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      [5, 0, 1, 0, 0, 4, 0, 1, 1, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1],
    ],
    [ // (0,2)
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 0, 0, 3, 0, 0, 0, 1],
      [5, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1],
      [5, 0, 0, 0, 0, 3, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1],
    ]
  ],
  [ // FILA 1
    [ // (1,0)
      [1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1],
      [1, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 0, 3, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 5],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 5],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1],
      [1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1],
    ],
    [ // (1,1) → sala inicial
      [1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1],
      [1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1],
      [5, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1],
    ],
    [ // (1,2)
      [1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1],
      [1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 4, 0, 0, 0, 0, 0, 1],
      [5, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1],
      [5, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 1],
      [1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1],
    ]
  ],
  [ // FILA 2
    [ // (2,0)
      [1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1],
      [1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 0, 0, 0, 4, 0, 0, 1],
      [1, 0, 1, 0, 0, 3, 0, 1, 1, 1, 0, 5],
      [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 5],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1],
      [1, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    [ // (2,1)
      [1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 0, 0, 0, 4, 0, 0, 1],
      [5, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 5],
      [5, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 5],
      [1, 0, 0, 4, 0, 0, 0, 0, 0, 3, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    [ // (2,2)
      [1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1],
      [1, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 3, 0, 0, 0, 0, 0, 1],
      [5, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1],
      [5, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
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
    if (!transitionSound.isPlaying()) {
      transitionSound.play();
    }
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
draw = function () {
  __orig_draw_for_levels.apply(this, arguments);
  updateEnemies();
  checkEnemyDamage();

  checkDoorTransition();
  handleTransition();
};
