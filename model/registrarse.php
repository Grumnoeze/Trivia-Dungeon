<?php
include '../controller/conexionBD.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST['username'];
    $email = $_POST['email'];
    $contraseña = password_hash($_POST['password'], PASSWORD_DEFAULT);

    $checkQuery = "SELECT * FROM usuarios WHERE nombre = ? OR email = ?";
    $stmt = $conn->prepare($checkQuery);
    $stmt->bind_param("ss", $nombre, $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo "<script>alert('El nombre de usuario o correo ya están en uso.'); window.location.href='../view/pages/register.php';</script>";
    } else {
        $insertQuery = "INSERT INTO usuarios (email, nombre, contraseña) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($insertQuery);
        $stmt->bind_param("sss", $email, $nombre, $contraseña);

        if ($stmt->execute()) {
            echo "<script>alert('Registro exitoso. Ahora puedes iniciar sesión.'); window.location.href='../view/pages/login.php';</script>";
        } else {
            echo "<script>alert('Error al registrar el usuario.'); window.location.href='../view/pages/register.php';</script>";
        }
    }
}
?>
