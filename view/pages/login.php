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