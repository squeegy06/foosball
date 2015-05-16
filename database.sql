/* This file will drop and recreate the database foosball */
DROP DATABASE IF EXISTS foosball;
CREATE DATABASE IF NOT EXISTS foosball;

USE foosball;

CREATE TABLE IF NOT EXISTS players(
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8