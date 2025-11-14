<?php
session_start();
include_once("../controller/conexionBD.php");

// Verificar si el usuario está logueado
if (!isset($_SESSION['user_id'])) {
    echo "no_session";
    exit;
}

$email = $_SESSION['user_id'];
$nuevo_score = intval($_POST['score']);

// Obtener el score actual del usuario
$query = "SELECT score FROM usuario WHERE email = ?";
$stmt = $Ruta->prepare($query);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

$score_actual = intval($row['score']);

// Solo actualizar si el nuevo puntaje es mayor
if ($nuevo_score > $score_actual) {
    $update = $Ruta->prepare("UPDATE usuario SET score = ? WHERE email = ?");
    $update->bind_param("is", $nuevo_score, $email);
    if ($update->execute()) {
        echo "updated";
    } else {
        echo "error";
    }
    $update->close();
} else {
    echo "no_update";
}

$stmt->close();
$Ruta->close();
?>
