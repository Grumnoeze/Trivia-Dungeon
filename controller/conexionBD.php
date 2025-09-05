<?php
    $conn = new mysqli("localhost", "root", "", "triviadungeon");
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }   
?>