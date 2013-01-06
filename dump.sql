-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Erstellungszeit: 06. Jan 2013 um 12:35
-- Server Version: 5.5.25
-- PHP-Version: 5.4.4

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Datenbank: `contao-rpc-test`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `tl_rpc`
--

CREATE TABLE `tl_rpc` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tstamp` int(10) unsigned NOT NULL DEFAULT '0',
  `method` varchar(255) NOT NULL DEFAULT '',
  `active` char(1) NOT NULL DEFAULT '',
  `configuration` blob,
  PRIMARY KEY (`id`),
  UNIQUE KEY `method` (`method`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Daten für Tabelle `tl_rpc`
--

INSERT INTO `tl_rpc` (`id`, `tstamp`, `method`, `active`, `configuration`) VALUES
(1, 1357402527, 'Todo.create', '1', 0x613a313a7b693a303b733a313a2232223b7d),
(2, 1357470669, 'Todo.retrieve', '1', 0x613a313a7b693a303b733a313a2233223b7d),
(3, 1357312857, 'Todo.update', '1', 0x613a313a7b693a303b733a313a2232223b7d),
(4, 1357312857, 'Todo.delete', '1', 0x613a313a7b693a303b733a313a2232223b7d),
(5, 1357472055, 'generateHash', '1', 0x613a313a7b693a303b733a313a2234223b7d);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `tl_rpc_configuration`
--

CREATE TABLE `tl_rpc_configuration` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tstamp` int(10) unsigned NOT NULL DEFAULT '0',
  `name` varchar(32) NOT NULL DEFAULT '',
  `provider` varchar(32) NOT NULL DEFAULT '',
  `ipList` varchar(5) NOT NULL DEFAULT '',
  `ipListWhite` blob,
  `ipListBlack` blob,
  `secure` char(1) NOT NULL DEFAULT '',
  `encryption` char(1) NOT NULL DEFAULT '',
  `notPublic` char(1) NOT NULL DEFAULT '1',
  `fe_groups` blob,
  `be_groups` blob,
  `admins` char(1) NOT NULL DEFAULT '',
  `credentialsAuth` char(1) NOT NULL DEFAULT '1',
  `hashAuth` char(1) NOT NULL DEFAULT '1',
  `apikeyAuth` char(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Daten für Tabelle `tl_rpc_configuration`
--

INSERT INTO `tl_rpc_configuration` (`id`, `tstamp`, `name`, `provider`, `ipList`, `ipListWhite`, `ipListBlack`, `secure`, `encryption`, `notPublic`, `fe_groups`, `be_groups`, `admins`, `credentialsAuth`, `hashAuth`, `apikeyAuth`) VALUES
(3, 1357472077, 'keine Authentifizierung', 'json', '', NULL, NULL, '', '', '', NULL, NULL, '', '1', '1', '1'),
(2, 1357472029, 'Authentifizierung Hash', 'json', '', NULL, NULL, '', '', '1', 0x613a313a7b693a303b733a313a2232223b7d, NULL, '', '', '1', ''),
(4, 1357472044, 'Authentifizierung User/Password', 'json', '', NULL, NULL, '', '', '1', 0x613a313a7b693a303b733a313a2232223b7d, NULL, '', '1', '', '');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
