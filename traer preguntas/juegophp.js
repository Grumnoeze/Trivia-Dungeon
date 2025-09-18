let preguntaActual;
let opciones = [];
let respuestaCorrecta;
let mensaje = "";
let puntaje = 0;

let dificultad = 0; // 0 = no seleccionada
let juegoIniciado = false;

function setup() {
  createCanvas(700, 400);
  textSize(20);
}

function draw() {
  background(220);

  // si todavía no elegiste dificultad
  if (!juegoIniciado) {
    textSize(24);
    fill(0);
    text("Selecciona la dificultad:", 200, 100);

    // botones de dificultad
    mostrarBoton("Fácil (1)", 250, 150, 200, 40);
    mostrarBoton("Medio (2)", 250, 210, 200, 40);
    mostrarBoton("Difícil (3)", 250, 270, 200, 40);
    return;
  }

  // mostrar puntaje
  textSize(22);
  fill(0);
  text("Puntaje: " + puntaje, 500, 40);

  if (preguntaActual) {
    textSize(20);
    text(preguntaActual, 50, 50);

    // mostrar opciones
    for (let i = 0; i < opciones.length; i++) {
      fill(200);
      rect(50, 100 + i * 60, 600, 40, 10);
      fill(0);
      text(opciones[i], 60, 125 + i * 60);
    }
  }

  // feedback
  if (mensaje !== "") {
    textSize(24);
    fill(mensaje === "✅ Correcto" ? "green" : "red");
    text(mensaje, 50, 350);
  }
}

function mousePressed() {
  if (!juegoIniciado) {
    // elegir dificultad
    if (clickEnBoton(250, 150, 200, 40)) {
      dificultad = 1;
    } else if (clickEnBoton(250, 210, 200, 40)) {
      dificultad = 2;
    } else if (clickEnBoton(250, 270, 200, 40)) {
      dificultad = 3;
    }

    if (dificultad > 0) {
      juegoIniciado = true;
      obtenerPregunta();
    }
    return;
  }

  // clic en opciones de respuesta
  if (preguntaActual) {
    for (let i = 0; i < opciones.length; i++) {
      let x = 50, y = 100 + i * 60, w = 600, h = 40;
      if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
        verificarRespuesta(opciones[i]);
      }
    }
  }
}

function obtenerPregunta() {
  fetch("http://localhost/juegophp/obtener_preguntas.php?dificultad=" + dificultad)
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


function verificarRespuesta(respuesta) {
  if (respuesta === respuestaCorrecta) {
    puntaje += 50;
    mensaje = "✅ Correcto";
  } else {
    mensaje = "❌ Incorrecto";
  }

  setTimeout(obtenerPregunta, 1500);
}

// utilidades para botones
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
