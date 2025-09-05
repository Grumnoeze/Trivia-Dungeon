<?php
session_start();
include '../controller/conexionBD.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Verificar si el usuario existe
    $query = "SELECT * FROM users WHERE username = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $usuario = $result->fetch_assoc();
        // Verificar la contraseña
        if (password_verify($password, $usuario['password'])) {
            // Iniciar sesión
            $_SESSION['user_id'] = $usuario['id'];
            $_SESSION['username'] = $usuario['username'];
        
            header("Location: ../index.php");
        } else {
            echo "<script>alert('Contraseña incorrecta.'); window.location.href='../view/login.php';</script>";
        }
    } else {
        echo "<script>alert('El usuario no existe.'); window.location.href='../view/login.php';</script>";
    }
}
?>