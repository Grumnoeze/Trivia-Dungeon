<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include "../../controller/conexionBD.php";


// Consulta: traer todos los usuarios ordenados por score descendente
$sql = "SELECT nombre, score FROM usuarios ORDER BY score DESC";
$result = $conn->query($sql);

$ranking = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Formato: "Nombre ----- score"
        $ranking[] = $row['nombre'] . " ----- " . $row['score'];
    }
    echo json_encode($ranking);
} else {
    echo json_encode(["error" => "No hay usuarios registrados con puntaje"]);
}
?>
