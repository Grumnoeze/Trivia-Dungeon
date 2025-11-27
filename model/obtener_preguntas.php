<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
include "../controller/conexionBD.php";

$dificultad = isset($_GET['dificultad']) ? intval($_GET['dificultad']) : null;
$usadas = isset($_GET['usadas']) ? $_GET['usadas'] : '';

if ($dificultad) {
    $sql = "SELECT * FROM preguntas WHERE dificultad = ?";

    if (!empty($usadas)) {
        $sql .= " AND id NOT IN ($usadas)";
    }

    $sql .= " ORDER BY RAND() LIMIT 1";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $dificultad);
    $stmt->execute();
    $result = $stmt->get_result();

} else {
    $sql = "SELECT * FROM preguntas";

    if (!empty($usadas)) {
        $sql .= " WHERE id NOT IN ($usadas)";
    }

    $sql .= " ORDER BY RAND() LIMIT 1";
    $result = $conn->query($sql);
}

if ($result && $result->num_rows > 0) {
    $pregunta = $result->fetch_assoc();
    echo json_encode($pregunta);
} else {
    echo json_encode(["error" => "No hay más preguntas disponibles"]);
}
?>
