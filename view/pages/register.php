<?php
session_start();
include '../../controller/conexionBD.php';
if (!isset($conn)) {
    die("Error de conexión a la base de datos.");
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $username = $_POST['username'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    
    $stmt = $conn->prepare("INSERT INTO usuarios (email, username, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $email, $username, $password);

    if ($stmt->execute()) {
        header("Location: login.php");
        exit();
    } else {
        echo "<script>alert('Error al registrar: " . $conn->error . "');</script>";
    }
    $stmt->close();
    $conn->close();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="shortcut icon" href="../src/images/favicon.png" type="image/x-icon">
    <title>Document</title>
</head>
<body>
    <header>
        <nav>
            <ul>
                <li class="logo"><a href=""><img src="../src/logo_small.png" alt="" class="header-logo"></a></li>
                <li><a href="../pages/game.html">
                    <p>Juego</p>
                    <div class="underline"></div>
                </a></li>
                <li><a href="https://github.com/Grumnoeze/Trivia-Dungeon.git">
                    <p>Repositorio</p>
                    <div class="underline"></div>
                </a></li> 
            </ul>
            <ul class="account">
                <li><a href="../pages/game.html">
                    <span>jugar ahora</span>
                </a></li>
            </ul>
        </nav>
    </header>
    <main class="register-main">
        <div class="form-container">
            <h2>Registro</h2>
            <form method="POST" action="../../model/registrarse.php">
                <label for="email">Correo Electrónico:</label>
                <input type="email" id="email" name="email" required>

                <label for="username">Nombre de Usuario:</label>
                <input type="text" id="username" name="username" required>

                <label for="password">Contraseña:</label>
                <input type="password" id="password" name="password" required>

                <button type="submit">Registrarse</button>
            </form>
            <p>¿Ya tienes una cuenta? <a href="login.php">Inicia sesión</a></p>
        </div>
    </main>
    <footer>
        <p>&copy; 2024 Trivia Dungeon. Todos los derechos reservados.</p>
    </footer>
