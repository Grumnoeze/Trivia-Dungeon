<?php
session_start();
include '../../controller/conexionBD.php';
if (!isset($conn)) {
    die("Error de conexión a la base de datos.");
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT * FROM usuarios WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $usuario = $result->fetch_assoc();
        if (password_verify($password, $usuario['password'])) {
            $_SESSION['user_id'] = $usuario['email'];
            $_SESSION['username'] = $usuario['username'];
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
    <title>Document</title>
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
        <h2>Iniciar Sesión</h2>
        <form method="POST" action="../../model/loguearse.php">
            <label for="username">Usuario:</label>
            <input type="text" id="username" name="username" required>
            <br>
            <label for="password">Contraseña:</label>
            <input type="password" id="password" name="password" required>
            <br>
            <button type="submit">Iniciar Sesión</button>
            <p>¿No tienes una cuenta? <a href="register.php">Regístrate aquí</a></p>
        </form>
    </main>
</body>
</html>