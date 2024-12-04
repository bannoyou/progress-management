-- MySQL dump 10.13  Distrib 5.7.43, for Win64 (x86_64)
--
-- Host: localhost    Database: progress
-- ------------------------------------------------------
-- Server version	5.7.43-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `main_tasks`
--

DROP TABLE IF EXISTS `main_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `main_tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` mediumtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `main_tasks`
--

LOCK TABLES `main_tasks` WRITE;
/*!40000 ALTER TABLE `main_tasks` DISABLE KEYS */;
INSERT INTO `main_tasks` VALUES (1,'C','Learn the basics of swimming'),(2,'HTML','Learn the basics of HTML');
/*!40000 ALTER TABLE `main_tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('4mByIsbiV2u12KkZg7xtuwyHjGLNsePy',1733268486,'{\"cookie\":{\"originalMaxAge\":60000,\"expires\":\"2024-12-03T23:27:27.671Z\",\"httpOnly\":true,\"path\":\"/\"},\"views\":1,\"userid\":7,\"name\":\"Pken2024_test2\"}'),('VwmA24f0n-MBwQyCaYt9QqYo9UUvc6hm',1733269445,'{\"cookie\":{\"originalMaxAge\":60000,\"expires\":\"2024-12-03T23:43:35.263Z\",\"httpOnly\":true,\"path\":\"/\"},\"views\":1,\"userid\":7,\"name\":\"Pken2024_test2\",\"flag\":1}'),('g3-wML-d-r6qkxlSuzky_ckdsROatYmv',1733268520,'{\"cookie\":{\"originalMaxAge\":60000,\"expires\":\"2024-12-03T23:28:28.945Z\",\"httpOnly\":true,\"path\":\"/\"},\"userid\":7,\"name\":\"Pken2024_test2\"}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sub_tasks`
--

DROP TABLE IF EXISTS `sub_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sub_tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `main_task_id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` mediumtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `main_task_id` (`main_task_id`),
  KEY `id` (`id`,`main_task_id`),
  CONSTRAINT `sub_tasks_ibfk_1` FOREIGN KEY (`main_task_id`) REFERENCES `main_tasks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_tasks`
--

LOCK TABLES `sub_tasks` WRITE;
/*!40000 ALTER TABLE `sub_tasks` DISABLE KEYS */;
INSERT INTO `sub_tasks` VALUES (1,1,'変数を使おう','task'),(2,1,'条件分岐を使おう','task'),(5,1,'ループを使おう','task'),(6,1,'配列を使おう','task'),(7,1,'ポインタを使おう','task'),(8,1,'関数を作ろう','task'),(9,1,'構造体を使おう','task'),(10,1,'ファイル操作をしよう','task'),(11,1,'メモリを管理しよう','task'),(12,1,'エラー処理をしよう','task'),(13,2,'見出しを作ろう','task'),(14,2,'段落を作ろう','task'),(15,2,'画像を入れよう','task'),(16,2,'リンクを作ろう','task'),(17,2,'リストを作ろう','task'),(18,2,'表を作ろう','task'),(19,2,'フォームを作ろう','task'),(20,2,'色を変えよう','task'),(21,2,'文字を飾ろう','task'),(22,2,'ボックスを作ろう','task');
/*!40000 ALTER TABLE `sub_tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_tasks`
--

DROP TABLE IF EXISTS `user_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_tasks` (
  `user_id` int(11) NOT NULL,
  `main_task_id` int(11) NOT NULL,
  `sub_task_id` int(11) NOT NULL,
  `completed` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`user_id`,`main_task_id`,`sub_task_id`),
  KEY `main_task_id` (`main_task_id`),
  KEY `sub_task_id` (`sub_task_id`),
  CONSTRAINT `user_tasks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_tasks`
--

LOCK TABLES `user_tasks` WRITE;
/*!40000 ALTER TABLE `user_tasks` DISABLE KEYS */;
INSERT INTO `user_tasks` VALUES (3,1,1,1),(6,1,1,1),(6,1,2,1),(6,1,5,1),(6,1,6,1),(6,1,7,1),(6,1,8,1),(6,1,9,1),(6,1,10,1),(6,1,11,1),(6,1,12,1),(6,2,13,1),(6,2,14,1),(6,2,15,1),(6,2,16,1),(6,2,17,1),(6,2,18,1),(6,2,19,1),(6,2,20,1),(6,2,21,1),(6,2,22,1),(7,1,1,1),(7,1,2,1),(7,1,5,1),(7,1,6,1),(7,1,7,1),(7,1,8,1),(7,1,9,1),(7,1,10,1),(7,1,11,1),(7,1,12,1),(7,2,13,1),(7,2,14,0),(7,2,15,1),(7,2,16,1),(7,2,17,0),(7,2,18,0),(7,2,19,1),(7,2,20,1),(7,2,21,0),(7,2,22,1),(8,1,1,0),(8,1,2,0),(8,1,5,0),(8,1,6,0),(8,1,7,0),(8,1,8,0),(8,1,9,0),(8,1,10,0),(8,1,11,0),(8,1,12,0),(8,2,13,0),(8,2,14,0),(8,2,15,0),(8,2,16,0),(8,2,17,0),(8,2,18,0),(8,2,19,0),(8,2,20,0),(8,2,21,0),(8,2,22,0);
/*!40000 ALTER TABLE `user_tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pass` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `points` int(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`pass`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'a','$2b$10$tDmfYBbmRlwGAbg07RZtLOwRrmwiSxlukWwV5vpITq65GNFnshJR.',20),(4,'Pken2024','$2b$10$kayHMEYiJ2Vqp2b2SqMlHuK9LeD9o3RZZDdwsnRWZ35uxcpFbqqSe',0),(5,'Pk','$2b$10$qOeyOa5TXDMabBRfHoRVQebSEox4sfqVUDcXBuEfzXfobDPMXVVsu',0),(6,'Pken2024_test','$2b$10$uGOSIwM3VSF5WM.aDEzzpOgQrmHFEteNOSWp85jyTSv1a2T8Z4JNu',200),(7,'Pken2024_test2','$2b$10$Nsa.xRbIM818Nvzu.L7vIeI1ytoS.eBCP8s7MAMmz4E6crS8uFG5u',160),(8,'Pken2024_test3','$2b$10$vWl/qfC5kRz/ZKBpTn1ZDuiGjwgUoHxcWWZ48u5sd6m0Dd7pWrtyS',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-04  9:07:06
