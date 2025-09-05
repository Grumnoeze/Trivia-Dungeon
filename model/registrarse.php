<?php   
include '../controller/conexionBD.php';

if ($_Server["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);

    // Verificar si el usuario o correo ya existen
    $checkQuery = "SELECT * FROM users WHERE username = ? OR email = ?";
    $stmt = $conn->prepare($checkQuery);
    $stmt->bind_param("ss", $username, $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo "<script>alert('El nombre de usuario o correo ya están en uso.'); window.location.href='../view/registrarse.php';</script>";
    } else {
        // Insertar nuevo usuario
        $insertQuery = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($insertQuery);
        $stmt->bind_param("sss", $username, $email, $password);

        if ($stmt->execute()) {
            echo "<script>alert('Registro exitoso. Ahora puedes iniciar sesión.'); window.location.href='../view/login.php';</script>";
        } else {
            echo "<script>alert('Error al registrar el usuario. Inténtalo de nuevo.'); window.location.href='../view/registrarse.php';</script>";
        }
    }
}