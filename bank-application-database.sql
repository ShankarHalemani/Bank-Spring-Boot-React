CREATE DATABASE  IF NOT EXISTS `bank_application_spring` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `bank_application_spring`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: bank_application_spring
-- ------------------------------------------------------
-- Server version	8.0.38

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `accountNumber` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL,
  `balance` double NOT NULL,
  `bank_id` bigint DEFAULT NULL,
  `customer_id` bigint DEFAULT NULL,
  PRIMARY KEY (`accountNumber`),
  KEY `FKb78evw9x9jyy66ld572kl8rgx` (`bank_id`),
  KEY `FKn6x8pdp50os8bq5rbb792upse` (`customer_id`),
  CONSTRAINT `FKb78evw9x9jyy66ld572kl8rgx` FOREIGN KEY (`bank_id`) REFERENCES `banks` (`bankId`),
  CONSTRAINT `FKn6x8pdp50os8bq5rbb792upse` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customerId`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,_binary '',1002,6,7),(2,_binary '',602,3,2),(3,_binary '\0',1000,1,7),(4,_binary '',1404,1,2),(5,_binary '',1000,2,3),(6,_binary '',1006,4,3),(7,_binary '',1007,5,4),(8,_binary '',1000,3,4),(9,_binary '',999.5555,3,5),(10,_binary '',999.4445,6,5),(11,_binary '',1011,1,6),(12,_binary '',1012,4,6),(13,_binary '',1013,4,8),(14,_binary '',1014,4,13),(19,_binary '',900,3,10),(20,_binary '\0',1000,3,16),(21,_binary '',1020,5,14),(22,_binary '',1000,5,17),(23,_binary '',1000,7,18),(24,_binary '',1000,4,21),(25,_binary '',1000,5,25),(26,_binary '',1000,3,24),(27,_binary '',1000,7,11),(28,_binary '',1000,5,12),(29,_binary '',1000,6,19),(30,_binary '',1010,4,22),(31,_binary '',1000,1,23),(32,_binary '',1000,4,31),(33,_binary '',1000,7,26);
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `adminId` bigint NOT NULL,
  `active` bit(1) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  PRIMARY KEY (`adminId`),
  CONSTRAINT `FKblo0g3dgcnnlqhm0hu72wm0ge` FOREIGN KEY (`adminId`) REFERENCES `users` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,_binary '','Shankar','Halemani');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banks`
--

DROP TABLE IF EXISTS `banks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banks` (
  `bankId` bigint NOT NULL AUTO_INCREMENT,
  `abbreviation` varchar(255) NOT NULL,
  `active` bit(1) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  PRIMARY KEY (`bankId`),
  UNIQUE KEY `UKj6tdc7jguv7bwjcqx0lqunayj` (`abbreviation`),
  UNIQUE KEY `UK4i4xm81jvpgcr58hj92lo46fd` (`fullName`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banks`
--

LOCK TABLES `banks` WRITE;
/*!40000 ALTER TABLE `banks` DISABLE KEYS */;
INSERT INTO `banks` VALUES (1,'CNRB',_binary '','Canara Bank'),(2,'AXIS',_binary '\0','Axis Bank'),(3,'ICICI',_binary '','ICICI Bank'),(4,'BOI',_binary '','Bank Of India'),(5,'BOR',_binary '','Bank Of Baroda'),(6,'SBI',_binary '','State Bank of India'),(7,'PNB',_binary '','Punjab National Bank'),(8,'KMB',_binary '\0','Kotak Mahindra Bank');
/*!40000 ALTER TABLE `banks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `customerId` bigint NOT NULL,
  `active` bit(1) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `totalBalance` double NOT NULL,
  PRIMARY KEY (`customerId`),
  CONSTRAINT `FKgpd916td5bdvd7a7v06chgfer` FOREIGN KEY (`customerId`) REFERENCES `users` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (2,_binary '','Sharat','Hosamani',2006),(3,_binary '','Deepak','Bhati',1006),(4,_binary '','Neelanjana','Singh',2007),(5,_binary '','Soumya','Kotagi',1999),(6,_binary '','Lavanya','Shahapur',2023),(7,_binary '','Madhura K','Patil',2002),(8,_binary '','Shankaraling','Halemani',1013),(9,_binary '\0','Shivam','Shakti',0),(10,_binary '','Shubham ','Shakti',900),(11,_binary '','Surya','Mohan',1000),(12,_binary '','Demon','Slayer',1000),(13,_binary '','Sahil','Sharma',1014),(14,_binary '','Pooja','K',1020),(15,_binary '\0','Priya','Santan',0),(16,_binary '','Atheeth','Jain',0),(17,_binary '','Niranjan','S',1000),(18,_binary '','Poojitha','Makkena',1000),(19,_binary '','Sharada','Vannur',1000),(20,_binary '\0','Druv','Desai',0),(21,_binary '','Pavan','Belagi',1000),(22,_binary '','Samay','Rehana',1010),(23,_binary '','Rehan','Kittur',1000),(24,_binary '','Akhilesh','Gadagkar',1000),(25,_binary '','Sasuke','Uchiha',1000),(26,_binary '','Suresh','Badiger',1000),(27,_binary '','Mahesh','Laxmipuram',0),(28,_binary '','Shrinath','Ganiger',0),(29,_binary '','Zoro','Roronova',0),(30,_binary '','Robin','Nico',0),(31,_binary '','Kavana','Tallur',1000);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `file_items`
--

DROP TABLE IF EXISTS `file_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `location` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `customer_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKdq4e65pvc5ra35mxbo3wjgih5` (`customer_id`),
  CONSTRAINT `FKdq4e65pvc5ra35mxbo3wjgih5` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customerId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file_items`
--

LOCK TABLES `file_items` WRITE;
/*!40000 ALTER TABLE `file_items` DISABLE KEYS */;
INSERT INTO `file_items` VALUES (1,'C:/Users/ACER/Documents/MonoJava/Spring/Customers/26/01FE20BCS170_Provisional_Grade_Card.pdf','01FE20BCS170_Provisional_Grade_Card.pdf','application/pdf',26),(2,'C:/Users/ACER/Documents/MonoJava/Spring/Customers/27/01FE20BCS170_Provisional_Grade_Card.pdf','01FE20BCS170_Provisional_Grade_Card.pdf','application/pdf',27),(3,'C:/Users/ACER/Documents/MonoJava/Spring/Customers/28/01FE20BCS170_Provisional_Grade_Card.pdf','01FE20BCS170_Provisional_Grade_Card.pdf','application/pdf',28),(4,'C:/Users/ACER/Documents/MonoJava/Spring/Customers/29/wallpaperflare.com_wallpaper (13).jpg','wallpaperflare.com_wallpaper (13).jpg','image/jpeg',29),(5,'C:/Users/ACER/Documents/MonoJava/Spring/Customers/30/aireplane.docx','aireplane.docx','application/vnd.openxmlformats-officedocument.wordprocessingml.document',30);
/*!40000 ALTER TABLE `file_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `roleId` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`roleId`),
  UNIQUE KEY `UKofx66keruapi6vyqpv6f2or37` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ROLE_ADMIN'),(2,'ROLE_CUSTOMER');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `transactionId` bigint NOT NULL AUTO_INCREMENT,
  `amount` double NOT NULL,
  `transactionTimestamp` datetime(6) DEFAULT NULL,
  `receiver_account` bigint DEFAULT NULL,
  `sender_account` bigint DEFAULT NULL,
  PRIMARY KEY (`transactionId`),
  KEY `FKcw91bkbxco2w21fqoejmpjufy` (`receiver_account`),
  KEY `FKha05w97k8dx76awdns0x8qy06` (`sender_account`),
  CONSTRAINT `FKcw91bkbxco2w21fqoejmpjufy` FOREIGN KEY (`receiver_account`) REFERENCES `accounts` (`accountNumber`),
  CONSTRAINT `FKha05w97k8dx76awdns0x8qy06` FOREIGN KEY (`sender_account`) REFERENCES `accounts` (`accountNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,300,'2024-08-10 00:49:58.689923',2,1),(2,100,'2024-08-10 02:48:36.280660',6,4),(3,300,'2024-08-10 03:03:59.487030',7,4),(4,200,'2024-08-12 11:24:09.179343',4,2),(5,200,'2024-08-12 22:15:50.331893',4,2),(7,200,'2024-08-25 20:32:23.118951',10,9),(8,200,'2024-08-25 20:33:49.992546',9,10),(9,300,'2024-08-25 21:10:10.628405',10,9),(10,500,'2024-08-26 00:05:52.959408',9,10),(11,100,'2024-08-26 01:10:47.277626',19,10),(12,1,'2024-08-26 04:01:25.055428',1,9),(13,2,'2024-08-26 04:01:32.034402',2,9),(14,4,'2024-08-26 04:02:28.786427',4,9),(15,6,'2024-08-26 04:02:58.341573',6,9),(16,7,'2024-08-26 04:03:05.644243',7,9),(17,11,'2024-08-26 04:04:55.120542',11,9),(18,12,'2024-08-26 04:05:36.120482',12,9),(19,13,'2024-08-26 04:06:26.183149',13,9),(20,14,'2024-08-26 04:10:24.797840',14,9),(21,10,'2024-08-26 04:10:48.305301',9,9),(22,1,'2024-08-26 04:11:09.939667',1,9),(23,20,'2024-08-26 18:30:42.811801',21,9),(24,10,'2024-08-27 19:33:49.199473',30,9),(25,99.5,'2024-08-27 19:34:23.473131',10,9),(26,0.5,'2024-08-27 20:12:20.017976',10,9),(27,0.5555,'2024-08-27 20:13:03.080461',9,10);
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userId` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,_binary '','Shankar','Halemani','$2a$10$aI311QnoCjFJps.Ev60PKuI9sNxqnaOaJ/VY66WJSkSHdc0bUqggK','shankar@29'),(2,_binary '','Sharat','Hosamani','$2a$10$RzHfecXzw80lAmVLQ4O3nuIs6jGw1ZrwAsdbBmKUm95msGja0EXwS','sharat@29'),(3,_binary '','Deepak','Bhati','$2a$10$fJFsdsxxZVN3c9s6X5zlu.7HsWzJnOFUiYOZ8RyDcOGjlwBjwVa7i','deepak@29'),(4,_binary '','Neelanjana','Singh','$2a$10$yPonpPMixGOmhJ8qi3g4aORIZ9FL9OTZ/gL4tTz/L2NKUxTutSoUq','neel@29'),(5,_binary '','Soumya','Kotagi','$2a$10$VC9yA4iwSgOX8R.gmRRVYeaOG/wLuttFXOharo/ncbKvtw32y6K0y','soumya@29'),(6,_binary '','Lavanya','Shahapur','$2a$10$GgiDLkIJQElPk7NToQ0Qnu9NWIo3t6bKtWh5f09cLHaSIXHL1dlUa','lavanya@29'),(7,_binary '','Madhura K','Patil','$2a$10$H9dYWtQA.0tST0UdMDN8ouU1mDq.HhaIDag8lPArp/wXGUxovAQhi','xxx@29'),(8,_binary '','Shankaraling','Halemani','$2a$10$syKbKCtuCu9MOEXVoSVLXeT.BHBSke0v7EZNjOYWNVKECCK/fvQ2e','shankarlinghalemani@gmail.com'),(9,_binary '\0','Shivam','Shakti','$2a$10$RG3ncQdU5J5m3dDCywf8z.EnQhR8qbVPciqh54oFRmT9iClfuMHw2','shivam@29'),(10,_binary '','Shubham ','Shakti','$2a$10$XtKrwW4AhJGhmxngW9piSeG18hlkHuNRqQUbRPZq.HlBmomQyb1X6','shubham@29'),(11,_binary '','Surya','Mohan','$2a$10$pl46qMZVuriVxKkNrf7U4unKc3y8z3TbVqvdb4vAueq.kdbD7y8bK','surya@29'),(12,_binary '','Demon','Slayer','$2a$10$cucGnZ086WDsHQzRn90el.Fkg4dg7oS7mIPHAzSmsYD7hKErIr55W','demon@29'),(13,_binary '','Sahil','Sharma','$2a$10$vKHssR2ioPHZ935Z590Nae8DsIPoRmjaqMopYnVdRg.Ssye56JkMa','sahil@29'),(14,_binary '','Pooja','K','$2a$10$prZlxZye4h7u5Rer0PLkfen16qb4OJ1U9qm4bbGeBkJBOkH8Oh2Va','pooja@29'),(15,_binary '\0','Priya','Santan','$2a$10$6OCpKU6sGSxIcp/iNyJkNOj2rOMhx.H.Q7supK72tHkDEJLDliSrS','priya@29'),(16,_binary '','Atheeth','Jain','$2a$10$xNLWAOXMCJgREqGP5Yrfi.J1tJ1RfvIlxhmx1Ox2wp7Kby8RSehS6','atheeth@29'),(17,_binary '','Niranjan','S','$2a$10$HOy71wpOG9g8/CXZ.3bnl.FcFw9a.WRnZYRNTtGCcIIam4cscTcZ6','niranjan@29'),(18,_binary '','Poojitha','Makkena','$2a$10$cFoYsQIb9YpRswyMH4RZw.0c.ScIAKlfdt3QifYnOKupYdnPfUOQe','poojitha@29'),(19,_binary '','Sharada','Vannur','$2a$10$ch.65p4ofd4wv5myRFQwPe8iJUI8PbN3Q09vPZxIV37b7ibomVjFu','sharada@29'),(20,_binary '\0','Druv','Desai','$2a$10$TU5wZkGCKuheBsQJTw94pePCtmNH9s2HIH3IGtgTvJjBzgqQm8TAu','druv@29'),(21,_binary '','Pavan','Belagi','$2a$10$fok/BueB/BN9Fwx80Y6QCOXuFcqOu.oGwPumMGJufY8.UuSQz9fvC','pavan@29'),(22,_binary '','Samay','Rehana','$2a$10$/4DZDJJGeqX9WVbdHZrsbuAFK1Xfc52AipU3OS9kZw56ywVhtI/SC','samay@29'),(23,_binary '','Rehan','Kittur','$2a$10$UzvNEFtW9uRJVfZw4rgAjOlTbDKiISFfy4qHy8TU36ntl5FfFKDju','rehankittur14581@gmail.com'),(24,_binary '','Akhilesh','Gadagkar','$2a$10$k/itoyxZtebi6JLO5GB3QOgl4CImp2ur76.2ME3/9MbHJmhKHzYty','akhilesh@29'),(25,_binary '','Sasuke','Uchiha','$2a$10$/wD98ztuuyIXbXcvKxZDIuiZ03zjuwicEKBlIxqPgzb1TBSg/d6ea','sasuke@29'),(26,_binary '','Suresh','Badiger','$2a$10$IpGHV8qoomd3Qhjf9ndKYehPtpeCVdVQD7FPYPXc3HhqZxbSGQvne','suresh@29'),(27,_binary '','Mahesh','Laxmipuram','$2a$10$w.UBgT46JzSuz5hP.JMlIuiTJJRBbm5KduBlPiA666Fwr7jQkPceK','mahesh@29'),(28,_binary '','Shrinath','Ganiger','$2a$10$w8lIu8aBPXjDROL6/KCxkepX83rv8xlxv8NKTWCuO2Z.m9OAqu/iG','shrinath@29'),(29,_binary '','Zoro','Roronova','$2a$10$qY5rE/qcmopbF5WQK1hMUeQ1dWvteH6YsigCA1wrphltGt/bZvFBS','zoro@29'),(30,_binary '','Robin','Nico','$2a$10$qozHcE8seBlVHmu2NmiAiuTwy1ZKdsdNdfFJMUlrqmpXDwUToVzCK','robin@29'),(31,_binary '','Kavana','Tallur','$2a$10$gcY6vmHcuu66j71rXjB7Ueg0wYFg5Dq.98W9JwRXc/cp2NEZq2kBm','kavana@29');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_roles`
--

DROP TABLE IF EXISTS `users_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_roles` (
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FKj6m8fwv7oqv74fcehir1a9ffy` (`role_id`),
  CONSTRAINT `FK2o0jvgh89lemvvo17cbqvdxaa` FOREIGN KEY (`user_id`) REFERENCES `users` (`userId`),
  CONSTRAINT `FKj6m8fwv7oqv74fcehir1a9ffy` FOREIGN KEY (`role_id`) REFERENCES `roles` (`roleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_roles`
--

LOCK TABLES `users_roles` WRITE;
/*!40000 ALTER TABLE `users_roles` DISABLE KEYS */;
INSERT INTO `users_roles` VALUES (1,1),(2,2),(3,2),(4,2),(5,2),(6,2),(7,2),(8,2),(9,2),(10,2),(11,2),(12,2),(13,2),(14,2),(15,2),(16,2),(17,2),(18,2),(19,2),(20,2),(21,2),(22,2),(23,2),(24,2),(25,2),(26,2),(27,2),(28,2),(29,2),(30,2),(31,2);
/*!40000 ALTER TABLE `users_roles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-27 21:44:07
