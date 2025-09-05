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
                <?php if (isset($_SESSION['username'])): ?>
                    <a href="view/pages/login.php">
                        <img src="" alt="">Acceder
                    </a>
                <?php else: ?>
                    <a href="controller/logout.php">
                        <img src="" alt="">Cerrar sesión
                    </a>
                <?php endif; ?>
            </nav>
        </div>
    </header>
    