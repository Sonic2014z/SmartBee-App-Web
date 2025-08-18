-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-08-2025 a las 23:01:32
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `smartbee`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alerta`
--

CREATE TABLE `alerta` (
  `id` varchar(12) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `indicador` varchar(64) NOT NULL,
  `descripcion` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `alerta`
--

INSERT INTO `alerta` (`id`, `nombre`, `indicador`, `descripcion`) VALUES
('ALERT001', 'Temperatura Alta Critica', 'Temperatura Interna', 'Temperatura  mayor a 38° en 8 eventos durante las últimas 24 horas'),
('ALERT002', 'Temperatura Alta Preventiva', 'Temperatura Interna', 'Temperatura  entre 36° y 37° en 8 eventos durante las últimas 24 horas'),
('ALERT003', 'Temperatura Baja Crítica Período de Invernada', 'Temperatura Interna', 'Temperatura  menor que 12° en 8 eventos durante las últimas 24 horas'),
('ALERT004', 'Temperatura Baja Preventiva Período de Invernada', 'Temperatura Interna', 'Temperatura  entre 13° y 15° en 8 eventos durante las últimas 24 horas'),
('ALERT005', 'Temperatura Alta', 'Temperatura Externa', 'Temperatura  mayor a 34° en 8 eventos durante las últimas 24 horas'),
('ALERT006', 'Temperatura Baja', 'Temperatura Externa', 'Temperatura  menor a 12° en 8 eventos durante las últimas 24 horas'),
('ALERT007', 'Humedad Alta Crítica Período Invernada', 'Humedad Interna', 'Humedad mayor a 70% en período marzo a julio'),
('ALERT008', 'Humedad Alta Preventiva Período Invernada', 'Humedad Interna', 'Humedad mayor a 60% en período marzo a julio'),
('ALERT009', 'Humedad Baja Crítica Promavera Verano', 'Humedad Interna', 'Humedad menor a 40% en agosto a abril'),
('ALERT010', 'Humedad Baja Preventiva Promavera Verano', 'Humedad Interna', 'Humedad menor a 50% en período agosto a abril'),
('ALERT011', 'Alerta de Enjambre', 'Peso', 'Disminución de 500gr en dos mediciones consecutivas períodod agosto a diciembre'),
('ALERT012', 'Incremento de Peso Cosecha', 'Peso', 'Aumento de más de 20Kg en 20 días de medición continua'),
('ALERT013', 'Disminución de Peso Período Invernada', 'Peso', 'Disminución de 3Kg durante un mes de medición período marzo a agosto'),
('ALERT014', 'Disminución Abrupta de Peso', 'Peso', 'Revisar'),
('ALERT015', 'Temperatura Anormal en Colmena', 'Temperatura Interna y Externa', 'Diferencia de temperatura externa e Interna está entre 0° y 2° por 6 horas seguidas'),
('ALERT016', 'Humedad Anormal en Colmena', 'Temperatura Interna y Externa', 'Diferencia de humedd externa e Interna está entre 0 y 2 puntos por 6 horas seguidas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `colmena`
--

CREATE TABLE `colmena` (
  `id` varchar(64) NOT NULL,
  `descripcion` varchar(1024) NOT NULL,
  `latitud` decimal(10,7) NOT NULL,
  `longitud` decimal(10,7) NOT NULL,
  `dueno` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `colmena`
--

INSERT INTO `colmena` (`id`, `descripcion`, `latitud`, `longitud`, `dueno`) VALUES
('COL-AMOR', 'Colmena', -34.1717621, -70.7363303, 'amorales'),
('COL-CRAM', 'Colmena', -30.6045538, -71.2047749, 'cramirez'),
('COL-CVEG', 'Colmena', -35.4286304, -71.6728922, 'cvega'),
('COL-DFUE', 'Colmena', -35.4286304, -71.6728922, 'dfuentes'),
('COL-FMEL', 'Colmena', -38.7314870, -72.6040025, 'fmella'),
('COL-GLAG', 'Colmena', -38.7314870, -72.6040025, 'glagos'),
('COL-JPER', 'Colmena', -30.6045538, -71.2047749, 'jperez'),
('COL-JRIV', 'Colmena', -34.1717621, -70.7363303, 'jrivas'),
('COL-LMUN', 'Colmena', -30.6045538, -71.2047749, 'lmunoz'),
('COL-MGON', 'Colmena', -36.6009157, -72.1064020, 'mgonzalez'),
('COL-MHEN', 'Colmena', -36.6009157, -72.1064020, 'mhenriquez'),
('COL-PDON', 'Colmena', -36.6009157, -72.1064020, 'pdonald'),
('COL-STOR', 'Colmena', -34.1717621, -70.7363303, 'storres'),
('COL-TSAL', 'Colmena', -38.7314870, -72.6040025, 'tsalazar'),
('COL-VROJ', 'Colmena', -35.4286304, -71.6728922, 'vrojas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estacion`
--

CREATE TABLE `estacion` (
  `id` varchar(64) NOT NULL,
  `descripcion` varchar(1024) NOT NULL,
  `latitud` decimal(10,7) NOT NULL,
  `longitud` decimal(10,7) NOT NULL,
  `dueno` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `estacion`
--

INSERT INTO `estacion` (`id`, `descripcion`, `latitud`, `longitud`, `dueno`) VALUES
('EST-AMOR', 'Estación Meteorológica', -34.1717621, -70.7363303, 'amorales'),
('EST-CRAM', 'Estación Meteorológica', -30.6045538, -71.2047749, 'cramirez'),
('EST-CVEG', 'Estación Meteorológica', -35.4286304, -71.6728922, 'cvega'),
('EST-DFUE', 'Estación Meteorológica', -35.4286304, -71.6728922, 'dfuentes'),
('EST-FMEL', 'Estación Meteorológica', -38.7314870, -72.6040025, 'fmella'),
('EST-GLAG', 'Estación Meteorológica', -38.7314870, -72.6040025, 'glagos'),
('EST-JPER', 'Estación Meteorológica', -30.6045538, -71.2047749, 'jperez'),
('EST-JRIV', 'Estación Meteorológica', -34.1717621, -70.7363303, 'jrivas'),
('EST-LMUN', 'Estación Meteorológica', -30.6045538, -71.2047749, 'lmunoz'),
('EST-MGON', 'Estación Meteorológica', -36.6009157, -72.1064020, 'mgonzalez'),
('EST-MHEN', 'Estación Meteorológica', -36.6009157, -72.1064020, 'mhenriquez'),
('EST-PDON', 'Estación Meteorológica', -36.6009157, -72.1064020, 'pdonald'),
('EST-STOR', 'Estación Meteorológica', -34.1717621, -70.7363303, 'storres'),
('EST-TSAL', 'Estación Meteorológica', -38.7314870, -72.6040025, 'tsalazar'),
('EST-VROJ', 'Estación Meteorológica', -35.4286304, -71.6728922, 'vrojas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nodo`
--

CREATE TABLE `nodo` (
  `id` varchar(64) NOT NULL,
  `descripcion` varchar(1024) NOT NULL,
  `tipo` varchar(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `nodo`
--

INSERT INTO `nodo` (`id`, `descripcion`, `tipo`) VALUES
('NODO-10B8AA62-6F39-4C50-AADD-2414A0BCFD62', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22', 'AMBIENTAL'),
('NODO-12155B9B-0672-4E68-8133-33893090A96A', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22', 'AMBIENTAL'),
('NODO-1A5CDC8C-1B9C-4ABF-9695-F84A210A7471', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22', 'AMBIENTAL'),
('NODO-38999D61-E214-4870-8352-2E0C2BD603DC', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22', 'AMBIENTAL'),
('NODO-3E3ABA4B-AF98-46F9-A4EA-EF136E073172', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22 y 1 sensor de carga', 'COLMENA'),
('NODO-66B56F7E-243C-4B96-85C7-EFB00F6F76C9', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22', 'AMBIENTAL'),
('NODO-69947EA3-C824-41E1-AB7E-7E966CED2492', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22', 'AMBIENTAL'),
('NODO-6AAB0838-6C77-43CD-9E1B-CCCAD5A8EEF9', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22 y 1 sensor de carga', 'COLMENA'),
('NODO-6FD1F27E-E80D-4723-B3FB-3D42204A0DD2', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22 y 1 sensor de carga', 'COLMENA'),
('NODO-7881883A-97A5-47E0-869C-753E99E1B168', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22 y 1 sensor de carga', 'COLMENA'),
('NODO-7BB729C8-85A2-47CA-B28F-1B617E48E74C', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22', 'AMBIENTAL'),
('NODO-7D3B61D6-8B71-48EC-96F5-CDDFCD19A0A6', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22', 'AMBIENTAL'),
('NODO-8CF65C52-FACE-42A3-B6D8-87DD82AEDA56', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22', 'AMBIENTAL'),
('NODO-915A7374-0240-4AF5-A47A-5A93EED049D7', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22 y 1 sensor de carga', 'COLMENA'),
('NODO-98D19A53-A372-4516-8E4D-D44CAC46A7D3', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22 y 1 sensor de carga', 'COLMENA'),
('NODO-B51D175B-9B00-4CBD-B4C1-2597C0258F26', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22 - DNA', 'COLMENA'),
('NODO-B5B3ABC4-E0CE-4662-ACB3-7A631C12394A', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22', 'AMBIENTAL'),
('NODO-BEF8C985-0FF3-4874-935B-40AA8A235FF7', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22 y 1 sensor de carga', 'COLMENA'),
('NODO-C3BB9768-A6C5-40A2-B0FF-A1F6C78355C4', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22 y 1 sensor de carga', 'COLMENA'),
('NODO-C5926599-51D6-4D72-8AA7-3209013191D0', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22 y 1 sensor de carga', 'COLMENA'),
('NODO-C8C80453-1D45-4CE8-9B5A-EB59E5349F16', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22 y 1 sensor de carga', 'COLMENA'),
('NODO-CF2B7AF0-91A1-4109-BB95-2EDA5573EE85', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22 y 1 sensor de carga', 'COLMENA'),
('NODO-D0DAF85F-4F13-4FE9-9406-A3B3ECF5AAF8', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22', 'AMBIENTAL'),
('NODO-D0FC275B-C00B-41CA-89A0-B74670B8D1A4', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22 y 1 sensor de carga', 'COLMENA'),
('NODO-DA383110-9558-4521-9518-C5C89C6FD98F', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22 y 1 sensor de carga', 'COLMENA'),
('NODO-DF38B47D-402B-4EBB-95D7-E0B38335607D', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22', 'AMBIENTAL'),
('NODO-E6B60F8B-22CB-4B77-976F-B0C8403521CC', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22 y 1 sensor de carga', 'COLMENA'),
('NODO-E909058D-9C70-4B9D-96B4-51F0ADE87B73', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22', 'AMBIENTAL'),
('NODO-F05C0FB6-1973-48E7-8AD8-06786D434402', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22', 'AMBIENTAL'),
('NODO-F3DA8F38-855F-41D3-81EC-DD4F7ADC63A0', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22', 'AMBIENTAL'),
('NODO-F8BC905E-58FD-45BD-9A17-19FEF3150FF7', 'ESP32 DEVKIT 38 pines (ESP-WROOM-32). Con 1 DHT22 y 1 sensor de carga', 'COLMENA');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nodo_alerta`
--

CREATE TABLE `nodo_alerta` (
  `id` int(10) UNSIGNED NOT NULL,
  `nodo_id` varchar(64) NOT NULL,
  `alerta_id` varchar(12) NOT NULL,
  `fecha` timestamp(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nodo_colmena`
--

CREATE TABLE `nodo_colmena` (
  `id` int(10) UNSIGNED NOT NULL,
  `colmena_id` varchar(64) NOT NULL,
  `nodo_id` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `nodo_colmena`
--

INSERT INTO `nodo_colmena` (`id`, `colmena_id`, `nodo_id`) VALUES
(1, 'COL-MGON', 'NODO-BEF8C985-0FF3-4874-935B-40AA8A235FF7'),
(2, 'COL-MHEN', 'NODO-7881883A-97A5-47E0-869C-753E99E1B168'),
(3, 'COL-PDON', 'NODO-D0FC275B-C00B-41CA-89A0-B74670B8D1A4'),
(4, 'COL-CRAM', 'NODO-CF2B7AF0-91A1-4109-BB95-2EDA5573EE85'),
(5, 'COL-JPER', 'NODO-6AAB0838-6C77-43CD-9E1B-CCCAD5A8EEF9'),
(6, 'COL-LMUN', 'NODO-E6B60F8B-22CB-4B77-976F-B0C8403521CC'),
(7, 'COL-AMOR', 'NODO-6FD1F27E-E80D-4723-B3FB-3D42204A0DD2'),
(8, 'COL-JRIV', 'NODO-C5926599-51D6-4D72-8AA7-3209013191D0'),
(9, 'COL-STOR', 'NODO-F8BC905E-58FD-45BD-9A17-19FEF3150FF7'),
(10, 'COL-CVEG', 'NODO-915A7374-0240-4AF5-A47A-5A93EED049D7'),
(11, 'COL-DFUE', 'NODO-DA383110-9558-4521-9518-C5C89C6FD98F'),
(12, 'COL-VROJ', 'NODO-98D19A53-A372-4516-8E4D-D44CAC46A7D3'),
(13, 'COL-FMEL', 'NODO-C8C80453-1D45-4CE8-9B5A-EB59E5349F16'),
(14, 'COL-GLAG', 'NODO-3E3ABA4B-AF98-46F9-A4EA-EF136E073172'),
(15, 'COL-TSAL', 'NODO-C3BB9768-A6C5-40A2-B0FF-A1F6C78355C4');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nodo_estacion`
--

CREATE TABLE `nodo_estacion` (
  `id` int(10) UNSIGNED NOT NULL,
  `estacion_id` varchar(64) NOT NULL,
  `nodo_id` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `nodo_estacion`
--

INSERT INTO `nodo_estacion` (`id`, `estacion_id`, `nodo_id`) VALUES
(1, 'EST-MGON', 'NODO-B5B3ABC4-E0CE-4662-ACB3-7A631C12394A'),
(2, 'EST-MHEN', 'NODO-38999D61-E214-4870-8352-2E0C2BD603DC'),
(3, 'EST-PDON', 'NODO-D0DAF85F-4F13-4FE9-9406-A3B3ECF5AAF8'),
(4, 'EST-CRAM', 'NODO-F3DA8F38-855F-41D3-81EC-DD4F7ADC63A0'),
(5, 'EST-JPER', 'NODO-7BB729C8-85A2-47CA-B28F-1B617E48E74C'),
(6, 'EST-LMUN', 'NODO-66B56F7E-243C-4B96-85C7-EFB00F6F76C9'),
(7, 'EST-AMOR', 'NODO-E909058D-9C70-4B9D-96B4-51F0ADE87B73'),
(8, 'EST-JRIV', 'NODO-7D3B61D6-8B71-48EC-96F5-CDDFCD19A0A6'),
(9, 'EST-STOR', 'NODO-1A5CDC8C-1B9C-4ABF-9695-F84A210A7471'),
(10, 'EST-CVEG', 'NODO-69947EA3-C824-41E1-AB7E-7E966CED2492'),
(11, 'EST-DFUE', 'NODO-F05C0FB6-1973-48E7-8AD8-06786D434402'),
(12, 'EST-VROJ', 'NODO-12155B9B-0672-4E68-8133-33893090A96A'),
(13, 'EST-FMEL', 'NODO-8CF65C52-FACE-42A3-B6D8-87DD82AEDA56'),
(14, 'EST-GLAG', 'NODO-DF38B47D-402B-4EBB-95D7-E0B38335607D'),
(15, 'EST-TSAL', 'NODO-10B8AA62-6F39-4C50-AADD-2414A0BCFD62');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nodo_mensaje`
--

CREATE TABLE `nodo_mensaje` (
  `id` int(10) UNSIGNED NOT NULL,
  `nodo_id` varchar(64) NOT NULL,
  `topico` varchar(255) NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `fecha` timestamp(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nodo_tipo`
--

CREATE TABLE `nodo_tipo` (
  `tipo` varchar(12) NOT NULL,
  `descripcion` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `nodo_tipo`
--

INSERT INTO `nodo_tipo` (`tipo`, `descripcion`) VALUES
('AMBIENTAL', 'Nodo que mide humedad y temperatura ambiental'),
('COLMENA', 'Nodo que mide humedad, temperatura y peso de colmena');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `rol` varchar(12) NOT NULL,
  `descripcion` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`rol`, `descripcion`) VALUES
('ADM', 'Administrador'),
('API', 'Apicultor');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` varchar(16) NOT NULL,
  `clave` varchar(64) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `comuna` varchar(100) NOT NULL,
  `rol` varchar(12) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `clave`, `nombre`, `apellido`, `comuna`, `rol`, `activo`) VALUES
('amorales', '$2a$12$wcQeVTFNP5RsqU5UdP8id.hIPIfD0sy3XFGmJswW7q2yhpJ12Kgzi', 'Andrés', 'Morales', 'Rancagua', 'API', 1),
('cramirez', '$2a$12$2GujqbbfnnK6xACcj1NYI.ncrZpaexq4v1z7NzCt8xA2riH7V4BHK', 'Carlos', 'Ramírez', 'Ovalle', 'API', 1),
('cvega', '$2a$12$c6UYOJHMPho5zVNCyiNCZueW0RrEPUZPM3.z2OrHxKJfTCz35j3Bi', 'Camila', 'Vega', 'Talca', 'API', 1),
('dfuentes', '$2a$12$CUDxc8GxeEj3rdljEYNex.mu6r.7v7inAgZxFNU/ZRDSUCue21tCa', 'Diego', 'Fuentes', 'Talca', 'API', 1),
('fmella', '$2a$12$rrNXupMh8TDDpEGa9rVWO.XhxUoQMRbhBmAp5ddRwDJL7q1glf0fe', 'Fernanda', 'Mella', 'Temuco', 'API', 1),
('glagos', '$2a$12$Kq0xQvrzKn0cl3EMMsuvbey9JW5P5ry5Rchp3u5nHQJfyIban.Itm', 'Gabriel', 'Lagos', 'Temuco', 'API', 1),
('jperez', '$2a$12$Elr90iUGQCfydss0oP4x1uEoJ/dc/KnOMxHCu8D3OmzYCpMIpIbyy', 'Juan', 'Pérez', 'Ovalle', 'API', 1),
('jrivas', '$2a$12$ZW5DmihmqoX0dWs/32JcI.fY8FgEQDMaHeTaDbBBB96zEE6/.9bNm', 'Josefa', 'Rivas', 'Rancagua', 'API', 1),
('lmunoz', '$2a$12$0gR6fsTk90Iqv7rZsOnVkOZyVdRKCWpQp0S9Ldow.asgmQRybvB5m', 'Laura', 'Muñoz', 'Ovalle', 'API', 1),
('mgonzalez', '$2a$12$OlIZ4bsnKsbQSxL6/N/5n.YIuV3g.rBt2OGoSSoTUWpchpnlQVq3S', 'María', 'González', 'Chillán', 'API', 1),
('mhenriquez', '$2a$12$8pj/weZfzSka/aDYj0xYDuZWoJ86nQB7tQ2azI/OWJ5QRQiRuipAi', 'Matías', 'Henríquez', 'Chillán', 'API', 1),
('pdonald', '$2a$12$lVnpyJq0KI.zWyh1Y7PpyO408L71BMIJfaxi1DO/TOqfrWKIt/cgK', 'Patricio', 'Donald', 'Chillán', 'API', 1),
('prueba', '$2a$12$xBuo6/I05Dn4QcAcdr2BA.meDRrkvBc8.hBaUXcC7BLhWtRts2W/i', 'prueba', 'prueba', 'prueba', 'API', 1),
('prueba2', '$2a$12$NPuniNlQwmhP/xlhF1qtpOSUDdtHOteoQFrPs0sy5wB0RPyvjqRGi', 'prueba2', 'prueba2', 'prueba2', 'ADM', 1),
('root', '$2a$12$jPfhj3cxKAPMqp3m1y18/e3led91OdH/F1kpSh3rk.WxSHDae2q.6', 'Roberto', 'Carrasco', 'Vitacura', 'ADM', 1),
('storres', '$2a$12$5xJEuwVNljduNTG.QbJe5uBayxGjc2.wrpvOVrtl3xfSU/RdgyvC.', 'Sofía', 'Torres', 'Rancagua', 'API', 1),
('tsalazar', '$2a$12$f3uPCxtvqrNDrciahzVxquzVFCRpFcazzG4yl4/5XMnUQJ3F9dGIm', 'Tomás', 'Salazar', 'Temuco', 'API', 1),
('vrojas', '$2a$12$alH8LBgRuMzKX54H.B7Uo.hX5QyarbYGuarulN50iwFMXhMcAsJnG', 'Valentina', 'Rojas', 'Talca', 'API', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alerta`
--
ALTER TABLE `alerta`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `colmena`
--
ALTER TABLE `colmena`
  ADD PRIMARY KEY (`id`),
  ADD KEY `colmena_FK` (`dueno`);

--
-- Indices de la tabla `estacion`
--
ALTER TABLE `estacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `estacion_FK` (`dueno`);

--
-- Indices de la tabla `nodo`
--
ALTER TABLE `nodo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nodo_FK` (`tipo`);

--
-- Indices de la tabla `nodo_alerta`
--
ALTER TABLE `nodo_alerta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nodo_alerta_FK` (`nodo_id`),
  ADD KEY `nodo_alerta_alerta_id_IDX` (`alerta_id`) USING BTREE,
  ADD KEY `nodo_alerta_fecha_IDX` (`fecha`) USING BTREE;

--
-- Indices de la tabla `nodo_colmena`
--
ALTER TABLE `nodo_colmena`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nodo_colmena_FK` (`nodo_id`),
  ADD KEY `nodo_colmena_FK_1` (`colmena_id`);

--
-- Indices de la tabla `nodo_estacion`
--
ALTER TABLE `nodo_estacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nodo_estacion_FK` (`nodo_id`),
  ADD KEY `nodo_estacion_FK_1` (`estacion_id`);

--
-- Indices de la tabla `nodo_mensaje`
--
ALTER TABLE `nodo_mensaje`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mensaje_FK` (`nodo_id`),
  ADD KEY `mensaje_fecha_IDX` (`fecha`) USING BTREE;

--
-- Indices de la tabla `nodo_tipo`
--
ALTER TABLE `nodo_tipo`
  ADD PRIMARY KEY (`tipo`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`rol`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_FK` (`rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `nodo_alerta`
--
ALTER TABLE `nodo_alerta`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `nodo_colmena`
--
ALTER TABLE `nodo_colmena`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `nodo_estacion`
--
ALTER TABLE `nodo_estacion`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `nodo_mensaje`
--
ALTER TABLE `nodo_mensaje`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `colmena`
--
ALTER TABLE `colmena`
  ADD CONSTRAINT `colmena_FK` FOREIGN KEY (`dueno`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `estacion`
--
ALTER TABLE `estacion`
  ADD CONSTRAINT `estacion_FK` FOREIGN KEY (`dueno`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `nodo`
--
ALTER TABLE `nodo`
  ADD CONSTRAINT `nodo_FK` FOREIGN KEY (`tipo`) REFERENCES `nodo_tipo` (`tipo`);

--
-- Filtros para la tabla `nodo_alerta`
--
ALTER TABLE `nodo_alerta`
  ADD CONSTRAINT `nodo_alerta_FK` FOREIGN KEY (`nodo_id`) REFERENCES `nodo` (`id`),
  ADD CONSTRAINT `nodo_alerta_alerta_FK` FOREIGN KEY (`alerta_id`) REFERENCES `alerta` (`id`);

--
-- Filtros para la tabla `nodo_colmena`
--
ALTER TABLE `nodo_colmena`
  ADD CONSTRAINT `nodo_colmena_FK` FOREIGN KEY (`nodo_id`) REFERENCES `nodo` (`id`),
  ADD CONSTRAINT `nodo_colmena_FK_1` FOREIGN KEY (`colmena_id`) REFERENCES `colmena` (`id`);

--
-- Filtros para la tabla `nodo_estacion`
--
ALTER TABLE `nodo_estacion`
  ADD CONSTRAINT `nodo_estacion_FK` FOREIGN KEY (`nodo_id`) REFERENCES `nodo` (`id`),
  ADD CONSTRAINT `nodo_estacion_FK_1` FOREIGN KEY (`estacion_id`) REFERENCES `estacion` (`id`);

--
-- Filtros para la tabla `nodo_mensaje`
--
ALTER TABLE `nodo_mensaje`
  ADD CONSTRAINT `mensaje_FK` FOREIGN KEY (`nodo_id`) REFERENCES `nodo` (`id`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_FK` FOREIGN KEY (`rol`) REFERENCES `rol` (`rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
