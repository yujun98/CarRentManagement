-- MySQL dump 10.13  Distrib 8.0.12, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: car
-- ------------------------------------------------------
-- Server version	8.0.12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accident`
--

DROP TABLE IF EXISTS `accident`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `accident` (
  `order_number` varchar(16) NOT NULL,
  `time` datetime NOT NULL,
  `place` varchar(50) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`order_number`,`time`),
  CONSTRAINT `FK_Reference_11` FOREIGN KEY (`order_number`) REFERENCES `order_info` (`order_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bac`
--

DROP TABLE IF EXISTS `bac`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `bac` (
  `order_number` varchar(16) NOT NULL,
  `amount` float(11,2) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`order_number`),
  CONSTRAINT `FK_Reference_10` FOREIGN KEY (`order_number`) REFERENCES `order_info` (`order_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `car`
--

DROP TABLE IF EXISTS `car`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `car` (
  `car_number` varchar(10) NOT NULL,
  `plate_number` varchar(9) NOT NULL,
  `car_name` varchar(10) NOT NULL,
  `car_state` enum('已租','未租','报修') NOT NULL,
  `shop_number` varchar(5) NOT NULL,
  PRIMARY KEY (`car_number`),
  KEY `FK_Reference_4` (`car_name`),
  KEY `FK_Reference_8` (`shop_number`),
  CONSTRAINT `FK_Reference_4` FOREIGN KEY (`car_name`) REFERENCES `car_type` (`car_name`),
  CONSTRAINT `FK_Reference_8` FOREIGN KEY (`shop_number`) REFERENCES `shop` (`shop_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `car_type`
--

DROP TABLE IF EXISTS `car_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `car_type` (
  `car_name` varchar(16) NOT NULL,
  `car_picture` longtext,
  `car_brand` varchar(4) NOT NULL,
  `car_type` enum('经济型','商务型','豪华型') NOT NULL,
  `daily_rent` float(11,2) NOT NULL,
  `car_deposit` float(11,2) NOT NULL,
  PRIMARY KEY (`car_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `manager`
--

DROP TABLE IF EXISTS `manager`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `manager` (
  `manager_id` varchar(11) NOT NULL,
  `manager_pwd` varchar(11) DEFAULT NULL,
  PRIMARY KEY (`manager_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order_info`
--

DROP TABLE IF EXISTS `order_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `order_info` (
  `order_number` varchar(16) NOT NULL,
  `user_phone` varchar(11) NOT NULL,
  `car_number` varchar(10) NOT NULL,
  `take_shop` varchar(5) DEFAULT NULL,
  `return_shop` varchar(5) DEFAULT NULL,
  `take_time` datetime NOT NULL,
  `return_time` datetime DEFAULT NULL,
  `order_amount` float(11,2) DEFAULT NULL,
  `order_time` datetime NOT NULL,
  `order_state` enum('未取车','未还车','已还车','已完成','已取消','已延长') NOT NULL,
  `take_oil` float(11,2) DEFAULT NULL,
  `return_oil` float(11,2) DEFAULT NULL,
  `oil_amount` float(11,2) DEFAULT '0.00',
  PRIMARY KEY (`order_number`),
  KEY `FK_Reference_14` (`return_shop`),
  KEY `FK_Reference_5` (`user_phone`),
  KEY `FK_Reference_6` (`car_number`),
  KEY `take_shop` (`take_shop`),
  CONSTRAINT `FK_Reference_14` FOREIGN KEY (`return_shop`) REFERENCES `shop` (`shop_number`),
  CONSTRAINT `FK_Reference_5` FOREIGN KEY (`user_phone`) REFERENCES `user` (`user_phone`),
  CONSTRAINT `FK_Reference_6` FOREIGN KEY (`car_number`) REFERENCES `car` (`car_number`),
  CONSTRAINT `take_shop` FOREIGN KEY (`take_shop`) REFERENCES `shop` (`shop_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `peccancy`
--

DROP TABLE IF EXISTS `peccancy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `peccancy` (
  `order_number` varchar(16) NOT NULL,
  `amount` float(11,2) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`order_number`),
  CONSTRAINT `FK_Reference_12` FOREIGN KEY (`order_number`) REFERENCES `order_info` (`order_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop`
--

DROP TABLE IF EXISTS `shop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `shop` (
  `shop_number` varchar(5) NOT NULL,
  `shop_city` varchar(20) NOT NULL,
  `shop_area` varchar(10) NOT NULL,
  `shop_name` varchar(10) NOT NULL,
  `shop_address` varchar(20) NOT NULL,
  `shop_phone` varchar(11) NOT NULL,
  `shop_hours` varchar(15) NOT NULL,
  PRIMARY KEY (`shop_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `user` (
  `user_phone` varchar(11) NOT NULL,
  `user_name` varchar(20) NOT NULL,
  `id` varchar(18) DEFAULT '',
  `user_pwd` varchar(20) NOT NULL,
  `deposit` float(11,2) DEFAULT '0.00',
  `balance` float(11,2) DEFAULT '0.00',
  `score` float(11,2) DEFAULT '60.00',
  PRIMARY KEY (`user_phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wallet_detail`
--

DROP TABLE IF EXISTS `wallet_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `wallet_detail` (
  `user_phone` varchar(11) NOT NULL,
  `time` datetime NOT NULL,
  `operation` enum('提现余额','提现押金','充值余额','充值押金','退款','租车') NOT NULL,
  `amount` float(11,2) NOT NULL,
  PRIMARY KEY (`user_phone`,`time`),
  CONSTRAINT `user_phone` FOREIGN KEY (`user_phone`) REFERENCES `user` (`user_phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-01-17 15:37:24
