-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 27-11-2025 a las 20:15:17
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
(48, '¿Cuál es el valor de π (pi) con dos decimales?', '3.14', '3.15', '3.13', '3.12', 3),
(49, '¿Cuántas patas tiene un perro?', '4', '2', '6', '8', 1),
(50, '¿Qué día viene después del lunes?', 'Martes', 'Miércoles', 'Domingo', 'Jueves', 1),
(51, '¿Qué forma tiene una pelota?', 'Redonda', 'Cuadrada', 'Triangular', 'Rectangular', 1),
(52, '¿Cuál es el número más pequeño?', '1', '0', '2', '3', 1),
(53, '¿Qué animal dice “guau”?', 'Perro', 'Gato', 'Vaca', 'Gallina', 1),
(54, '¿Qué usamos para ver?', 'Ojos', 'Nariz', 'Orejas', 'Manos', 1),
(55, '¿Qué fruta es roja y tiene semillas por dentro?', 'Manzana', 'Banana', 'Naranja', 'Pera', 1),
(56, '¿Qué usamos para escuchar?', 'Oídos', 'Boca', 'Piernas', 'OjOs', 1),
(57, '¿Cuál es el color de un limón?', 'Amarillo', 'Azul', 'Negro', 'Gris', 1),
(58, '¿Qué número es mayor?', '9', '3', '5', '7', 1),
(59, '¿Quién es el papá de Simba en El Rey León?', 'Mufasa', 'Scar', 'Timon', 'Rafiki', 1),
(60, '¿Cuál es el vehículo que vuela?', 'Avión', 'Auto', 'Bicicleta', 'Moto', 1),
(61, '¿Cuántas orejas tiene una persona?', '2', '1', '3', '4', 1),
(62, '¿Cuál animal vive en el agua?', 'Pez', 'Caballo', 'Perro', 'Gato', 1),
(63, '¿Qué estrella ilumina durante el día?', 'Sol', 'Luna', 'Venus', 'Júpiter', 1),
(64, '¿Qué herramienta se usa para cortar papel?', 'Tijera', 'Martillo', 'Llave inglesa', 'Cuchara', 1),
(65, '¿Cuál es el opuesto de día?', 'Noche', 'Tarde', 'Mañana', 'Luz', 1),
(66, '¿Cuántos meses tiene un año?', '12', '10', '11', '9', 1),
(67, '¿Qué color tiene un tomate maduro?', 'Rojo', 'Azul', 'Blanco', 'Negro', 1),
(68, '¿Qué deporte se juega con una pelota naranja?', 'Básquet', 'Tenis', 'Fútbol', 'Hockey', 1),
(69, '¿Qué insecto hace miel?', 'Abeja', 'Mosca', 'Hormiga', 'Mariposa', 1),
(70, '¿Qué animal tiene trompa?', 'Elefante', 'León', 'Cabra', 'Perro', 1),
(71, '¿Con qué escribimos?', 'Lápiz', 'Zapato', 'Vaso', 'Llave', 1),
(72, '¿Qué planeta es rojo?', 'Marte', 'Júpiter', 'Saturno', 'Mercurio', 1),
(73, '¿Qué estación del año es la más fría?', 'Invierno', 'Verano', 'Primavera', 'Otoño', 1),
(74, '¿Qué instrumento mide la temperatura?', 'Termómetro', 'Barómetro', 'Regla', 'Brújula', 2),
(75, '¿Cuál es la capital de Italia?', 'Roma', 'Venecia', 'París', 'Milan', 2),
(76, '¿Qué tipo de energía proviene del Sol?', 'Solar', 'Eólica', 'Hidráulica', 'Nuclear', 2),
(77, '¿Qué guerra terminó en 1945?', 'Segunda Guerra Mundial', 'Primera Guerra Mundial', 'Guerra Fría', 'Guerra de Corea', 2),
(78, '¿Cuál es el símbolo químico del oxígeno?', 'O', 'Ox', 'H', 'Og', 2),
(79, '¿Qué país tiene forma alargada en Sudamérica?', 'Chile', 'Brasil', 'Perú', 'Argentina', 2),
(80, '¿Cuántos continentes hay?', '5', '4', '6', '7', 2),
(81, '¿Qué hueso protege el cerebro?', 'Cráneo', 'Fémur', 'Columna', 'Costillas', 2),
(82, '¿Quién escribió “Cien años de soledad”?', 'Gabriel García Márquez', 'Mario Vargas Llosa', 'Cortázar', 'Isabel Allende', 2),
(83, '¿Qué ciencia estudia los seres vivos?', 'Biología', 'Física', 'Geología', 'Astronomía', 2),
(84, '¿Cuál es el metal más liviano?', 'Litio', 'Oro', 'Plomo', 'Cobre', 2),
(85, '¿Qué sistema transporta la sangre?', 'Circulatorio', 'Digestivo', 'Respiratorio', 'Nervioso', 2),
(86, '¿Qué país es el más poblado del mundo?', 'China', 'India', 'EE.UU.', 'Rusia', 2),
(87, '¿Cuál es el resultado de 9²?', '81', '72', '92', '90', 2),
(88, '¿En qué continente está Egipto?', 'África', 'Asia', 'Europa', 'Oceanía', 2),
(89, '¿Qué filósofo dijo “Pienso, luego existo”?', 'Descartes', 'Sócrates', 'Aristóteles', 'Epicuro', 2),
(90, '¿Qué cuerpo celeste gira alrededor de un planeta?', 'Luna', 'Cometa', 'Sol', 'Asteroide', 2),
(91, '¿Qué proceso convierte agua en vapor?', 'Evaporación', 'Fusión', 'Sublimación', 'Condensación', 2),
(92, '¿Cuál es el símbolo químico del sodio?', 'Na', 'So', 'Sd', 'Ni', 2),
(93, '¿Qué país ganó la Copa Mundial 2010?', 'España', 'Brasil', 'Alemania', 'Argentina', 2),
(94, '¿Qué unidad mide la corriente eléctrica?', 'Amperio', 'Voltio', 'Watt', 'Ohmio', 2),
(95, '¿Qué movimiento artístico pertenece Picasso?', 'Cubismo', 'Renacimiento', 'Barroco', 'Surrealismo', 2),
(96, '¿Qué órgano del cuerpo controla las funciones?', 'Cerebro', 'Pulmones', 'Corazón', 'Estómago', 2),
(97, '¿Cómo se llama el ciclo del agua del mar a nubes?', 'Evaporación', 'Precipitación', 'Condensación', 'Escorrentía', 2),
(98, '¿Qué ecuación representa velocidad?', 'v = d/t', 'F = m·a', 'E = m·c²', 'P = V·I', 2),
(99, '¿Qué país inventó el ajedrez?', 'India', 'China', 'Rusia', 'Irán', 2),
(100, '¿Cuál es la partícula responsable de la carga negativa?', 'Electrón', 'Protón', 'Neutrón', 'Bosón', 3),
(101, '¿Qué rama matemática estudia series y límites?', 'Análisis Matemático', 'Álgebra Lineal', 'Geometría', 'Aritmética', 3),
(102, '¿Qué economista planteó el materialismo histórico?', 'Karl Marx', 'Adam Smith', 'Keynes', 'Hayek', 3),
(103, '¿Cuál es la función principal del ribosoma?', 'Sintetizar proteínas', 'Almacenar ADN', 'Producir energía', 'Filtrar sangre', 3),
(104, '¿Qué ley expresa F = m•a?', 'Segunda ley de Newton', 'Primera ley de Newton', 'Ley de Coulomb', 'Ley de Hooke', 3),
(105, '¿Qué filósofo escribió “Ser y tiempo”?', 'Martin Heidegger', 'Nietzsche', 'Kant', 'Sartre', 3),
(106, '¿Qué ciencia estudia los fósiles?', 'Paleontología', 'Arqueología', 'Antropología', 'Geografía', 3),
(107, '¿Cuál es el órgano que produce insulina?', 'Páncreas', 'Hígado', 'Bazo', 'Riñón', 3),
(108, '¿Qué proceso del ADN genera ARN mensajero?', 'Transcripción', 'Traducción', 'Replicación', 'Mutación', 3),
(109, '¿Qué teorema afirma que la energía no se crea ni destruye?', 'Conservación de la energía', 'Entropía', 'Relatividad', 'Termodinámica cero', 3),
(110, '¿Quién formuló las leyes del movimiento planetario?', 'Kepler', 'Einstein', 'Copérnico', 'Galileo', 3),
(111, '¿Qué nombre recibe la unidad SI de fuerza?', 'Newton', 'Joule', 'Watt', 'Pascal', 3),
(112, '¿Qué estructura cerebral regula las emociones?', 'Amígdala', 'Hipocampo', 'Tálamo', 'Cerebelo', 3),
(113, '¿Qué molécula es la principal fuente de energía en células?', 'ATP', 'ADN', 'ARN', 'Glucosa', 3),
(114, '¿Qué rama filosófica estudia la moral?', 'Ética', 'Lógica', 'Ontología', 'Estética', 3),
(115, '¿Qué modelo económico propone libre mercado?', 'Capitalismo', 'Socialismo', 'Feudalismo', 'Mercantilismo', 3),
(116, '¿Cuál es la fórmula del metano?', 'CH4', 'C2H6', 'CO2', 'H2CO3', 3),
(117, '¿Qué función trigonométrica es hipotenusa/opuesto?', 'Cosecante', 'Seno', 'Coseno', 'Tangente', 3),
(118, '¿Qué planeta tiene el día más largo?', 'Venus', 'Tierra', 'Marte', 'Mercurio', 3),
(119, '¿Qué proceso físico genera luz en los átomos excitados?', 'Emisión', 'Absorción', 'Difusión', 'Reflexión', 3),
(120, '¿Qué científico propuso la tabla periódica?', 'Mendeleiev', 'Lavoisier', 'Curie', 'Pauling', 3),
(121, '¿Qué rama de la estadística estudia la inferencia?', 'Estadística inferencial', 'Probabilidad', 'Descriptiva', 'Álgebra', 3),
(122, '¿Qué órgano regula el equilibrio?', 'Oído interno', 'Cerebro', 'Pulmones', 'Riñón', 3),
(123, '¿Quién escribió “El contrato social”?', 'Rousseau', 'Locke', 'Hobbes', 'Voltaire', 3),
(124, '¿Qué variable se mantiene constante en una isoterma?', 'Temperatura', 'Volumen', 'Presión', 'Entalpía', 3),
(125, '¿Cuál es la fórmula de la velocidad angular?', 'ω = Δθ/Δt', 'v = d/t', 'p = m·v', 'a = Δv/Δt', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `email` varchar(50) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `score` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`email`, `nombre`, `contraseña`, `score`) VALUES
('antunahuel@gmail.com', 'antu123', '$2y$10$zWOpIgeAHmmuwvLUGOOrkOJigZT1KVcxe3gwTc8Kn6hPqFZyCLLT.', 0),
('antutorres@gmail.com', 'antu2', '$2y$10$wOjhoLxqCfmWkIzpAaIBO.wb7AgDjd5YEw2/SZ5Md/fPVfHg6u8hC', 0),
('diegoc@gm.com', 'diegodac', '$2y$10$BA.pDm1DHWL7fwhFyxp5vOONysDsToelEFxXChwbffpsilpzuWPF6', 200),
('hola@gmail.com', 'antu', '$2y$10$ey6xzEYsc9mE24yvCPsaQOsaa5fcTgcJDBXwZm.VtUy3LQe1C41z6', 10),
('matiasezequielmolina2006@gmail.com', 'mtsmlna', '$2y$10$IgO7hFGlXizcoYe53x5/7ukAvq/PEAY6lNGJQ6dT0urwIR95CNTmC', 10),
('sanchezbruno115@gmail.com', 'grumno_eze', '$2y$10$PJZyj41nCjtex.8fVf5N4OFx/z/h6bb/.2XjBYC41UpCh4S80na5G', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `preguntas`
--
ALTER TABLE `preguntas`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=126;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
