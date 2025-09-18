<?php
header("Content-Type: application/json");
include "../controller/conexionBD.php";

$dificultad = isset($_GET['dificultad']) ? intval($_GET['dificultad']) : null;

if ($dificultad) {
    $sql = "SELECT * FROM preguntas WHERE dificultad = ? ORDER BY RAND() LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $dificultad);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    $sql = "SELECT * FROM preguntas ORDER BY RAND() LIMIT 1";
    $result = $conn->query($sql);
}

if ($result && $result->num_rows > 0) {
    $pregunta = $result->fetch_assoc();
    echo json_encode($pregunta);
} else {
    echo json_encode(["error" => "No hay preguntas para esta dificultad: ".$dificultad]);
}
?>

