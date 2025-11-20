<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trivia Dungeon</title>
    <link rel="stylesheet" href="view/css/style.css">
    <link rel="shortcut icon" href="view/src/images/favicon.png" type="image/x-icon">
</head>
<body>
    <header>
        <nav>
            <ul>
                <li class="logo"><a href=""><img src="view/src/logo_small.png" alt="" class="header-logo"></a></li>
                <li><a href="view/pages/game.php">
                    <p>Juego</p>
                    <div class="underline"></div>
                </a></li>
                <li><a href="https://github.com/Grumnoeze/Trivia-Dungeon.git">
                    <p>Repositorio</p>
                    <div class="underline"></div>
                </a></li> 
            </ul>
            <ul class="account">
                <?php if (!isset($_SESSION['username'])): ?>
                    <li><a href="view/pages/login.php"><span>Iniciar sesión</span></a></li>
                <?php else: ?>
                    <li><a href="controller/logout.php"><span>Cerrar sesión</span></a></li>
                <?php endif; ?>
            </ul>
        </nav>
    </header>

    <div id="lightbox-overlay" class="lightbox-overlay">
        <div class="lightbox">
            <button class="close-btn" id="close-lightbox">&times;</button>
            <h1>PREPÁRATE PARA JUGAR</h1>
            <div class="options">
                <div class="option">
                    <p>No tengo cuenta</p>
                    <a href="view/pages/register.php" class="btn create-btn">CREAR UNA</a>
                </div>
                <div class="option">
                    <p>Tengo una cuenta</p>
                    <a href="view/pages/login.php" class="btn login-btn">INICIAR SESIÓN</a>
                </div>
            </div>
        </div>
    </div>

    <main>
        <section class="hero">
            <div>
                <img src="view/src/images/heropage-logo.png" alt="">
                <p>Trivia Dungeon es un RPG Roguelike en el que juegas como Caine, un caballero que en búsqueda de fama ingresó a una mazmorra. Sin embargo, esta mazmorra no era como las demás; ahora, deberá demostrar no sólo su fuerza, sino su intelecto si es que quiere salir vivo.</p>
                <a href="view/pages/game.php" class="btn-play">
                    <div class="background"></div>
                    <span>jugar ahora</span>
                </a>
            </div>
        </section>
        <?php if (isset($_SESSION['username'])): ?>
            <p class="welcome-msg">Bienvenido, <?= htmlspecialchars($_SESSION['username']) ?>!</p>
        <?php endif; ?>
    </main>

    <script src="view/javascript/site.js"></script>
</body>
</html>
