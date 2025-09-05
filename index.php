<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Trivia Dungeon</title>
    <link rel="stylesheet" href="../assets/css/styles.css">
</head>

<body>
    <header>
        <div class="logo">
            <a href="../index.php"><img src="" alt=""></a>
        </div>
        <div class="nav">
            <nav class="links">
                <a href="">prueba 1</a>
                <a href="">prueba 2</a>
                <a href="">prueba 3</a>
                <a href="">prueba 4</a>
            </nav>
            <nav class="login-contact">
                <?php if (!isset($_SESSION['username'])): ?>
                <a href="view/pages/login.php">Acceder</a>
                <?php else: ?>
                <a href="controller/logout.php">Cerrar sesión</a>
                <?php endif; ?>

            </nav>
            <?php if (isset($_SESSION['username'])): ?>
            <p>Bienvenido, <?= htmlspecialchars($_SESSION['username']) ?>!</p>
            <?php endif; ?>

        </div>
    </header>
    <main>
        
    </main>
    <footer>
        <p>&copy; 2024 Trivia Dungeon. Todos los derechos reservados.</p>
    </footer>
</body>