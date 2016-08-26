-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Aug 26, 2016 at 03:47 AM
-- Server version: 10.1.13-MariaDB
-- PHP Version: 5.6.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;

--
-- Database: `idiom`
--

-- --------------------------------------------------------

--
-- Table structure for table `equivalents`
--

CREATE TABLE `equivalents` (
  `id` int(11) NOT NULL,
  `equiv_idiom` varchar(512) NOT NULL DEFAULT '',
  `language` varchar(2) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `idiomId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `idioms`
--

CREATE TABLE `idioms` (
  `id` int(11) NOT NULL,
  `idiom` varchar(512) NOT NULL DEFAULT '',
  `language` varchar(2) DEFAULT NULL,
  `meaning` varchar(2048) DEFAULT NULL,
  `derivation` varchar(2048) DEFAULT NULL,
  `imageURL` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'admin', '2016-08-24 04:32:10', '2016-08-24 04:32:10'),
(2, 'guest', '2016-08-24 04:32:10', '2016-08-24 04:32:10'),
(3, 'user', '2016-08-24 04:32:10', '2016-08-24 04:32:10');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `sid` varchar(255) NOT NULL,
  `expires` datetime DEFAULT NULL,
  `data` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `translations`
--

CREATE TABLE `translations` (
  `id` int(11) NOT NULL,
  `translation` varchar(512) NOT NULL DEFAULT '',
  `language` varchar(2) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `idiomId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `userrole`
--

CREATE TABLE `userrole` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `RoleId` int(11) NOT NULL,
  `UserId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `userrole`
--

INSERT INTO `userrole` (`createdAt`, `updatedAt`, `RoleId`, `UserId`) VALUES
('2016-08-13 15:25:11', '2016-08-13 15:25:11', 1, 1),
('2016-08-13 15:25:11', '2016-08-13 15:25:11', 1, 2),
('2016-08-13 00:00:00', '2016-08-13 00:00:00', 1, 3);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `displayName` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `salt` varchar(255) DEFAULT NULL,
  `profileImageURL` varchar(255) DEFAULT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `resetPasswordToken` varchar(255) DEFAULT NULL,
  `resetPasswordExpires` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstName`, `lastName`, `displayName`, `email`, `username`, `password`, `salt`, `profileImageURL`, `provider`, `resetPasswordToken`, `resetPasswordExpires`, `createdAt`, `updatedAt`) VALUES
(1, 'User', 'Local', 'User Local', 'user@localhost.com', 'user', 'CrW7wJO4H3wPR2l1Gwqa9jNbOESHDjKcl3ASIregPgm/POCVaPglgJrfXfiblAJQl/TfBNO8/8ZVPYlC6q5aXQ==', 'pXU5TbsjKKB3YH4St4xuHQ==', 'modules/users/client/img/profile/default.png', 'local', NULL, NULL, '2016-08-13 15:25:11', '2016-08-13 15:25:11'),
(2, 'Admin', 'Local', 'Admin Local', 'admin@localhost.com', 'admin', '5/+AQ4r2TwR98+SNOYo0n/VP+K/ROELQ89JZHJ5+d16g4EmwRnnjBC8PjnoltdyW00cMFjO//WPdWm+VyypVGQ==', 'hvEvhkv7ULyGbKO0BqSRcg==', 'modules/users/client/img/profile/default.png', 'local', NULL, NULL, '2016-08-13 15:25:11', '2016-08-13 15:25:11'),
(3, 'idiom', 'idiom', 'idiom idiom', 'idiom@idiom.com', 'idiom', '3f6nwvahtaoxgK6KogtMYDxH3hbrs+02tzeTonZYgTLwfd1RtLURVA3zy84qe2akDgbCbSHG9ECJ+Q3QQA4Maw==', '19t8uhRxk6IyCgL6nieFPA==', './modules/users/client/img/profile/uploads/f71d5c8dc77fe7ea50d00dc92870b442', 'local', NULL, NULL, '2016-08-13 15:26:28', '2016-08-15 03:47:20');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `equivalents`
--
ALTER TABLE `equivalents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `equiv_idiom` (`equiv_idiom`),
  ADD UNIQUE KEY `Equivalents_equiv_idiom_unique` (`equiv_idiom`),
  ADD KEY `userId` (`userId`),
  ADD KEY `idiomId` (`idiomId`);

--
-- Indexes for table `idioms`
--
ALTER TABLE `idioms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idiom` (`idiom`),
  ADD UNIQUE KEY `Idioms_idiom_unique` (`idiom`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `Roles_name_unique` (`name`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`sid`);

--
-- Indexes for table `translations`
--
ALTER TABLE `translations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `idiomId` (`idiomId`);

--
-- Indexes for table `userrole`
--
ALTER TABLE `userrole`
  ADD PRIMARY KEY (`RoleId`,`UserId`),
  ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `Users_email_unique` (`email`),
  ADD UNIQUE KEY `Users_username_unique` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `equivalents`
--
ALTER TABLE `equivalents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `idioms`
--
ALTER TABLE `idioms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `translations`
--
ALTER TABLE `translations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `equivalents`
--
ALTER TABLE `equivalents`
  ADD CONSTRAINT `equivalents_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `equivalents_ibfk_2` FOREIGN KEY (`idiomId`) REFERENCES `idioms` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `idioms`
--
ALTER TABLE `idioms`
  ADD CONSTRAINT `idioms_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `translations`
--
ALTER TABLE `translations`
  ADD CONSTRAINT `translations_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `translations_ibfk_2` FOREIGN KEY (`idiomId`) REFERENCES `idioms` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `userrole`
--
ALTER TABLE `userrole`
  ADD CONSTRAINT `userrole_ibfk_1` FOREIGN KEY (`RoleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `userrole_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
