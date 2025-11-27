<?php
include '../controller/conexionBD.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = trim($_POST['username']);
    $email = trim($_POST['email']);
    $passwordPlain = $_POST['password'];

    // Validar contraseña: mínimo 8 caracteres, al menos un número y un carácter especial
    if (!preg_match('/^(?=.*[0-9])(?=.*[!@#$%^&*()_+=\-{}

    \[\]

    :;,.<>?]).{8,}$/', $passwordPlain)) {
        echo "<script>alert('La contraseña debe tener mínimo 8 caracteres, incluir al menos un número y un carácter especial.'); window.location.href='../view/pages/register.php';</script>";
        exit();
    }

    $contraseña = password_hash($passwordPlain, PASSWORD_DEFAULT);
    // Validar dominios de correo
    $dominiosPermitidos = ["gmail.com", "outlook.com", "hotmail.com", "yahoo.com"];
    $dominioEmail = substr(strrchr($email, "@"), 1);

    if (!in_array($dominioEmail, $dominiosPermitidos)) {
        echo "<script>alert('Solo se permiten correos oficiales: gmail, outlook, hotmail, yahoo.'); window.location.href='../view/pages/register.php';</script>";
        exit();
    }

    // Función para normalizar texto (acentos, minúsculas, leet speak)
    function normalizar($texto) {
    $texto = strtolower($texto);

    // Quitar acentos y ñ
    $texto = str_replace(
        ['á','é','í','ó','ú','ñ'],
        ['a','e','i','o','u','n'],
        $texto
    );

    // Reemplazos de leet speak
    $leetMap = [
        '1' => 'i',
        '!' => 'i',
        '|' => 'i',
        '3' => 'e',
        '4' => 'a',
        '@' => 'a',
        '5' => 's',
        '$' => 's',
        '7' => 't',
        '0' => 'o',
        '9' => 'g',
        '+' => 't',
        '8' => 'b'
    ];

    $texto = strtr($texto, $leetMap);

    // Quitar espacios, guiones y puntos para detectar frases disfrazadas
    $texto = str_replace([' ', '-', '_', '.'], '', $texto);

        return $texto;
    }

    $nombreNormalizado = normalizar($nombre);

    // Lista de insultos en español + inglés
    $palabrasProhibidas = [
        // Español
        "puta","puto","mierda","idiota","imbecil","tonto","tarado","caca","pene","culo",
        "concha","pija","forro","boludo","pelotudo","gil","mogolico","estupido","baboso",
        "maricon","travesti","prostituta","perra","zorra","cabron","chingar","cojer","coger",
        "pendejo","estupida","hdp","hijodeputa","malparido","sorete","cornudo","lamebotas",
        "lameculo","putarraca","putarraco","poronga","choto","chota","chupapijas","chupapollas",
        "follar","joder","culero","culera","mamerto","mamabolas","mamon","mamonas","naco","naca",
        "pajero","pajera","pajazo","pajote","sexo","pito","vagina","verga","polla","tetona","tetudo",
        "ano","anal","porn","porno","chupar","chupon","pajear","pornografia","pornografico",

        // Inglés
        "fuck","fucking","motherfucker","mf","bitch","slut","whore","asshole","dick","cock","pussy",
        "jerk","jerking","jerkoff","wanker","bollocks","crap","shit","shitty","bastard","dumbass",
        "retard","loser","suck","sucker","suckmydick","suckmycock","suckmypussy","suckmyass",
        "cum","cumming","cumshot","blowjob","handjob","sex","sexy","porn","porno","pornstar",
        "fag","faggot","prick","twat","tosser","dipshit","shithead","fuckhead","fuckface","shitface",
        "douchebag","douche","cockhead","cockface","nigga","nigger","rape","raping","rapist"
    ];

    // Validar nombre de usuario
    foreach ($palabrasProhibidas as $prohibida) {
        if (strpos($nombreNormalizado, $prohibida) !== false) {
            echo "<script>alert('El nombre de usuario contiene palabras no permitidas.'); window.location.href='../view/pages/register.php';</script>";
            exit();
        }
    }
    }

    // Verificar si ya existe usuario o email
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
?>

