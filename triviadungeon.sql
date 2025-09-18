-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-09-2025 a las 18:42:23
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `triviadungeon`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas`
--

CREATE TABLE `preguntas` (
  `id` int(11) NOT NULL,
  `pregunta` varchar(255) NOT NULL,
  `correcta` varchar(255) NOT NULL,
  `falsa1` varchar(255) NOT NULL,
  `falsa2` varchar(255) NOT NULL,
  `falsa3` varchar(255) NOT NULL,
  `dificultad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `preguntas`
--

INSERT INTO `preguntas` (`id`, `pregunta`, `correcta`, `falsa1`, `falsa2`, `falsa3`, `dificultad`) VALUES
(4, '¿Cuántos días tiene una semana?', '7', '5', '6', '8', 1),
(5, '¿De qué color es el cielo en un día despejado?', 'Azul', 'Rojo', 'Verde', 'Amarillo', 1),
(6, '¿Cuánto es 5 + 3?', '8', '7', '9', '6', 1),
(7, '¿Cuál es el animal que dice “miau”?', 'Gato', 'Perro', 'Vaca', 'Pato', 1),
(8, '¿Cuál es el planeta donde vivimos?', 'Tierra', 'Marte', 'Júpiter', 'Venus', 1),
(9, '¿Qué animal es conocido como el rey de la selva?', 'León', 'Tigre', 'Elefante', 'Jirafa', 1),
(10, '¿Cuántos dedos tenemos en total en las manos?', '10', '8', '12', '5', 1),
(11, '¿Qué fruta es amarilla y curva?', 'Banana', 'Manzana', 'Pera', 'Sandía', 1),
(12, '¿Qué número viene después del 9?', '10', '11', '8', '7', 1),
(13, '¿Qué gas necesitamos para respirar?', 'Oxígeno', 'Hidrógeno', 'Dióxido de carbono', 'Nitrógeno', 1),
(14, '¿Cómo se llama el satélite natural de la Tierra?', 'Luna', 'Sol', 'Marte', 'Venus', 1),
(15, '¿Qué figura tiene 3 lados?', 'Triángulo', 'Cuadrado', 'Círculo', 'Pentágono', 1),
(16, '¿Cuántas estaciones del año hay?', '4', '3', '5', '2', 1),
(17, '¿Qué animal pone huevos?', 'Gallina', 'Perro', 'Gato', 'Vaca', 1),
(18, '¿Cuál es el océano más grande?', 'Pacífico', 'Atlántico', 'Índico', 'Ártico', 1),
(19, '¿Quién escribió “Don Quijote de la Mancha”?', 'Miguel de Cervantes', 'Gabriel García Márquez', 'Lope de Vega', 'Pablo Neruda', 2),
(20, '¿Cuál es la capital de Francia?', 'París', 'Roma', 'Berlín', 'Madrid', 2),
(21, '¿En qué año descubrió Colón América?', '1492', '1500', '1485', '1512', 2),
(22, '¿Cuál es el resultado de 12 x 8?', '96', '88', '108', '100', 2),
(23, '¿Qué elemento químico tiene el símbolo H?', 'Hidrógeno', 'Helio', 'Oxígeno', 'Hierro', 2),
(24, '¿Quién pintó “La noche estrellada”?', 'Van Gogh', 'Picasso', 'Leonardo da Vinci', 'Dalí', 2),
(25, '¿Cuál es el río más largo del mundo?', 'Amazonas', 'Nilo', 'Yangtsé', 'Misisipi', 2),
(26, '¿Quién fue el primer presidente de Estados Unidos?', 'George Washington', 'Abraham Lincoln', 'Thomas Jefferson', 'John Adams', 2),
(27, '¿Cuál es el idioma más hablado en el mundo?', 'Chino mandarín', 'Inglés', 'Español', 'Hindú', 2),
(28, '¿Qué órgano del cuerpo humano bombea sangre?', 'Corazón', 'Pulmones', 'Cerebro', 'Hígado', 2),
(29, '¿En qué continente está Brasil?', 'América', 'África', 'Europa', 'Asia', 2),
(30, '¿Qué fórmula representa el agua?', 'H2O', 'CO2', 'NaCl', 'O2', 2),
(31, '¿Qué tipo de sangre es el donante universal?', 'O negativo', 'A positivo', 'B positivo', 'AB positivo', 2),
(32, '¿Quién escribió “Romeo y Julieta”?', 'William Shakespeare', 'Charles Dickens', 'Jane Austen', 'Victor Hugo', 2),
(33, '¿Cuál es la capital de Japón?', 'Tokio', 'Seúl', 'Pekín', 'Bangkok', 2),
(34, '¿Quién desarrolló la teoría de la relatividad?', 'Albert Einstein', 'Isaac Newton', 'Galileo Galilei', 'Stephen Hawking', 3),
(35, '¿Cuál es el proceso celular que convierte glucosa en energía?', 'Respiración celular', 'Fotosíntesis', 'Fermentación', 'Glucólisis anaeróbica', 3),
(36, '¿Qué filósofo escribió “La República”?', 'Platón', 'Aristóteles', 'Sócrates', 'Descartes', 3),
(37, '¿Qué molécula almacena la información genética?', 'ADN', 'ARN', 'Proteína', 'Lípido', 3),
(38, '¿Cuál es la constante de Planck?', '6.626 x 10^-34 J·s', '9.81 m/s²', '3.00 x 10^8 m/s', '1.602 x 10^-19 C', 3),
(39, '¿Qué economista escribió “La riqueza de las naciones”?', 'Adam Smith', 'Karl Marx', 'David Ricardo', 'Keynes', 3),
(40, '¿Cuál es el órgano encargado de filtrar la sangre en el cuerpo humano?', 'Riñón', 'Hígado', 'Bazo', 'Corazón', 3),
(41, '¿Qué rama de la matemática estudia las derivadas?', 'Cálculo', 'Álgebra', 'Geometría', 'Trigonometría', 3),
(42, '¿Cuál es el mayor planeta del sistema solar?', 'Júpiter', 'Saturno', 'Neptuno', 'Urano', 3),
(43, '¿Qué autor formuló la teoría de la evolución por selección natural?', 'Charles Darwin', 'Gregor Mendel', 'Lamarck', 'Pasteur', 3),
(44, '¿En qué año cayó el Imperio Romano de Occidente?', '476 d.C.', '410 d.C.', '500 d.C.', '395 d.C.', 3),
(45, '¿Cuál es la fórmula del ácido sulfúrico?', 'H2SO4', 'HCl', 'NaOH', 'HNO3', 3),
(46, '¿Qué rama de la filosofía estudia el conocimiento?', 'Epistemología', 'Ontología', 'Ética', 'Metafísica', 3),
(47, '¿Quién escribió “Crítica de la razón pura”?', 'Immanuel Kant', 'Hegel', 'Nietzsche', 'Locke', 3),
(48, '¿Cuál es el valor de π (pi) con dos decimales?', '3.14', '3.15', '3.13', '3.12', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `puntajes`
--

CREATE TABLE `puntajes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `score` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `email` varchar(50) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `contraseña` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`email`, `nombre`, `contraseña`) VALUES
('sanchezbruno115@gmail.com', 'grumno_eze', '$2y$10$PJZyj41nCjtex.8fVf5N4OFx/z/h6bb/.2XjBYC41UpCh4S80na5G');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `puntajes`
--
ALTER TABLE `puntajes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT de la tabla `puntajes`
--
ALTER TABLE `puntajes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
