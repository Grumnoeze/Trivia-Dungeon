<?php
session_start();
include '../controller/conexionBD.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST['username'];
    $contraseña = $_POST['password'];

    $query = "SELECT * FROM usuarios WHERE nombre = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $nombre);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $usuario = $result->fetch_assoc();
        if (password_verify($contraseña, $usuario['contraseña'])) { 
            $_SESSION['user_id'] = $usuario['email'];
            $_SESSION['username'] = $usuario['nombre'];
            header("Location: ../view/pages/game.php");
            exit();
        } else {
            echo "<script>alert('Contraseña incorrecta.'); window.location.href='../view/pages/login.php';</script>";
        }
    } else {
        echo "<script>alert('El usuario no existe.'); window.location.href='../view/pages/login.php';</script>";
    }
}
?>
