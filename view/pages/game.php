<?php
session_start();

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css">
    <title>Document</title>

<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/addons/p5.sound.min.js"></script>
<script src="../javascript/click.js"></script>
<script src="../javascript/game-keys.js"></script>




</head>

<style>
    body{
        height: 100% !important;
        overflow-y: hidden;
        background: #000;
    }
</style>

<body>
    <button class="exit-button" id="btn-exit" onclick="window.location.href='../../index.php'"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E6E6E6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> o <span>Esc</span></button>
    <div class="instructions">
        <h1>Instrucciones:</h1>
        <div class="movement">
            <p>Teclas de movimiento</p>
            <div class="wasd">
                <span class="w">W</span>
                <div class="asd">
                    <span>A</span><span>S</span><span>D</span>
                </div>
            </div>
            <p>o</p>
            <div class="uldr">
                <span class="up"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E6E6E6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg></span>
                <div class="ldr">
                    <span class="left"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E6E6E6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></span><span class="down"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E6E6E6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span><span class="right"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E6E6E6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></span>
                </div>
            </div>
        </div>
        <div class="attack">
            <p>Ataque</p>
            <div class="attack-div">
                <span>Z</span><p>o</p><span>J</span>
            </div>
        </div>
    </div>
</body>
</html>