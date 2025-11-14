<?php
session_start();
include '../../controller/conexionBD.php';
if (!isset($conn)) {
    die("Error de conexión a la base de datos.");
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST['username'];
    $contraseña = $_POST['password'];

    $stmt = $conn->prepare("SELECT * FROM usuarios WHERE nombre = ?");
    $stmt->bind_param("s", $nombre);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $usuario = $result->fetch_assoc();
        if (password_verify($contraseña, $usuario['contraseña'])) {
            $_SESSION['user_id'] = $usuario['email'];
            $_SESSION['username'] = $usuario['nombre'];
            header("Location: ../../index.php");
            exit();
        } else {
            echo "<script>alert('Contraseña incorrecta.'); window.location.href='login.php';</script>";
        }
    } else {
        echo "<script>alert('El usuario no existe.'); window.location.href='login.php';</script>";
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
    <title>Iniciar Sesión</title>
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
                <?php if (!isset($_SESSION['username'])): ?>
                    <li><a href="login.php"><span>Acceder</span></a></li>
                <?php else: ?>
                    <li><a href="../../controller/logout.php"><span>Cerrar sesión</span></a></li>
                <?php endif; ?>
            </ul>
        </nav>
    </header>
    <main>
        <section class="login-section">
            <h2>Iniciar Sesión</h2>
            <form method="POST" action="login.php">
                <label for="username">Usuario:</label>
                <input type="text" id="username" name="username" required>
                <br>
                <label for="password">Contraseña:</label>
                <input type="password" id="password" name="password" required>
                <br>
                <button type="submit">Iniciar Sesión</button>
                <p>¿No tienes una cuenta? <a href="register.php">Regístrate aquí</a></p>
            </form>
        </section>
    </main>
    <footer></footer>
</body>
</html>
