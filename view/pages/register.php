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
    <title>Registro - Trivia Dungeon</title>
    <link rel="stylesheet" href="">
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
    <main>
        <div class="form-container">
            <h2>Registro</h2>
            <form method="POST" action="">
                <label for="email">Correo Electrónico:</label>
                <input type="email" id="email" name="email" required>

                <label for="username">Nombre de Usuario:</label>
                <input type="text" id="username" name="username" required>

                <label for="password">Contraseña:</label>
                <input type="password" id="password" name="password" required>

                <button type="submit">Registrarse</button>
            </form>
            <p>¿Ya tienes una cuenta? <a href="login.php">Inicia sesión aquí</a></p>
        </div>
    </main>
    <footer>
        <p>&copy; 2024 Trivia Dungeon. Todos los derechos reservados.</p>
    </footer>
