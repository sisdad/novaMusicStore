-- phpMyAdmin SQL Dump
-- version 4.8.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 15, 2026 at 03:03 PM
-- Server version: 10.1.32-MariaDB
-- PHP Version: 7.2.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `music_demo`
--

-- --------------------------------------------------------

--
-- Table structure for table `barcodes`
--

CREATE TABLE `barcodes` (
  `id` int(11) NOT NULL,
  `barcode` varchar(100) DEFAULT NULL,
  `device_token` varchar(255) DEFAULT NULL,
  `activated_at` datetime DEFAULT NULL,
  `status` enum('AVAILABLE','ACTIVATED') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `barcodes`
--

INSERT INTO `barcodes` (`id`, `barcode`, `device_token`, `activated_at`, `status`) VALUES
(14, 'MC-E756EA53B9', 'device-1783991469972-i91hmivq35', '2026-07-14 04:23:49', 'ACTIVATED'),
(15, 'MC-37BF073838', 'device-1783991469534-v0s23ws8vd', '2026-07-14 04:23:50', 'ACTIVATED'),
(16, 'MC-9E8786BD99', 'a004aa19-fd2a-483f-9353-b1e32c6d6636', '2026-07-14 03:17:22', 'ACTIVATED'),
(17, 'MC-485BB6DC72', 'device-1783993542493-u9vht0815rc', '2026-07-14 04:46:07', 'ACTIVATED'),
(32, 'MC-C4D9B0AC2A', 'device-1783991469534-v0s23ws8vd', '2026-07-15 07:59:40', 'ACTIVATED'),
(37, 'MC-C025A54278', 'device-1783991469534-v0s23ws8vd', '2026-07-15 08:00:34', 'ACTIVATED'),
(38, 'MC-D01E82F040', 'device-1783991469534-v0s23ws8vd', '2026-07-15 08:03:16', 'ACTIVATED'),
(90, 'MC-F366FD98B0', 'device-1784092020918-jna3njyj717', '2026-07-15 08:08:11', 'ACTIVATED'),
(176, 'MC-9C59861F24', 'device-1784108191537-segpobbhbo', '2026-07-15 12:41:57', 'ACTIVATED'),
(177, 'MC-5D020C4D6B', 'device-1784108191537-segpobbhbo', '2026-07-15 12:40:56', 'ACTIVATED'),
(178, 'MC-811B6EAB00', NULL, NULL, 'AVAILABLE');

-- --------------------------------------------------------

--
-- Table structure for table `music`
--

CREATE TABLE `music` (
  `id` int(11) NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `artist` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `music_file` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cover_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `uploaded_by` int(11) DEFAULT NULL,
  `description` mediumtext COLLATE utf8mb4_unicode_ci,
  `duration` int(11) DEFAULT NULL,
  `status` enum('ACTIVE','HIDDEN') COLLATE utf8mb4_unicode_ci DEFAULT 'ACTIVE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `music`
--

INSERT INTO `music` (`id`, `title`, `artist`, `music_file`, `cover_image`, `created_at`, `uploaded_by`, `description`, `duration`, `status`) VALUES
(1, 'Amazing Grace', 'Choir One', 'uploads/music/music01.mp3', 'uploads/covers/music1.jpg', '2026-07-13 11:50:41', NULL, NULL, NULL, 'ACTIVE'),
(2, 'Holy Worship', 'Singer Two', 'uploads/music/music02.mp3', 'uploads/covers/music2.jpg', '2026-07-13 11:50:41', NULL, NULL, NULL, 'ACTIVE'),
(5, 'sdsa', 'sdsaf', 'uploads/music/1784060250173-781011.mp3', 'uploads/covers/1784060250272-290433.JPG', '2026-07-14 20:17:30', 4, NULL, NULL, 'ACTIVE'),
(7, 'qq', 'qq', 'uploads/music/1784082915716-617149.wma', 'uploads/covers/1784082916084-89419.jpg', '2026-07-15 02:35:16', 4, NULL, NULL, 'ACTIVE'),
(8, 'ss', 'ss', 'uploads/music/1784083801088-943178.mp3', 'uploads/covers/1784089253307-122474.jpg', '2026-07-15 02:50:01', 4, NULL, NULL, 'ACTIVE'),
(9, 'ww', 'ww', 'uploads/music/1784083988033-694570.mp3', 'uploads/covers/1784083988545-349720.jpg', '2026-07-15 02:53:08', 4, NULL, NULL, 'ACTIVE'),
(10, 'ደመናን ተጫምተህ', 'ቤተልሄም', 'uploads/music/1784084207847-540876.mp3', 'uploads/covers/1784084208298-91667.jpg', '2026-07-15 02:56:48', 4, NULL, NULL, 'ACTIVE'),
(12, 'yeteferah ቢርቱ', 'zemenay Gosaye', 'uploads/music/1784086853555-263538.mp3', 'uploads/covers/1784086853952-320780.jpg', '2026-07-15 03:40:54', 4, NULL, NULL, 'ACTIVE'),
(13, 'የተፈራህ', 'ዘመናይ', 'uploads/music/1784103661098-8400.mp3', 'uploads/covers/1784103661596-8480.jpg', '2026-07-15 08:21:01', 3, NULL, NULL, 'ACTIVE');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `role` enum('ADMIN','USER') DEFAULT 'USER',
  `membership` enum('INACTIVE','ACTIVE') DEFAULT 'INACTIVE'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `created_at`, `role`, `membership`) VALUES
(3, 'sisay Damtew', 'sisay@hossana.com', '$2b$10$U8/IcoHrqCkpzBpcJHk.H.XXejxiwvNSs3ktElikC7tPMraYwR846', '2026-07-13 21:04:11', 'ADMIN', 'INACTIVE'),
(4, 'Administrator', 'admin@gmail.com', '$2b$10$ywkc3BkWczr.LxEe8udV9.6d.3QllIFzJySLwvfhrsEaJR5WQhl.m', '2026-07-13 21:57:17', 'ADMIN', 'INACTIVE');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `barcodes`
--
ALTER TABLE `barcodes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `barcode` (`barcode`);

--
-- Indexes for table `music`
--
ALTER TABLE `music`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_music_user` (`uploaded_by`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `barcodes`
--
ALTER TABLE `barcodes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=179;

--
-- AUTO_INCREMENT for table `music`
--
ALTER TABLE `music`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `music`
--
ALTER TABLE `music`
  ADD CONSTRAINT `fk_music_user` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
