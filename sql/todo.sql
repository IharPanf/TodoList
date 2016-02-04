-- phpMyAdmin SQL Dump
-- version 4.0.10.10
-- http://www.phpmyadmin.net
--
-- Хост: 127.0.0.1:3306
-- Время создания: Фев 04 2016 г., 11:04
-- Версия сервера: 5.5.45
-- Версия PHP: 5.3.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `todo`
--

-- --------------------------------------------------------

--
-- Структура таблицы `todos`
--

CREATE TABLE IF NOT EXISTS `todos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task` varchar(255) NOT NULL,
  `date_task` date NOT NULL,
  `status` varchar(20) NOT NULL,
  `priority` int(5) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=61 ;

--
-- Дамп данных таблицы `todos`
--

INSERT INTO `todos` (`id`, `task`, `date_task`, `status`, `priority`) VALUES
(1, 'почитать о Backbone.js', '2016-01-29', 'done', 3),
(2, 'подключить Underscore для использования шаблонов в BackBone', '2016-02-01', 'done', 2),
(3, 'написать фронтенд для проекта', '2016-02-01', 'archive', 2),
(4, 'прочитать о Yii', '2016-02-02', 'done', 2),
(49, 'tttt', '2016-02-04', 'new', 1),
(51, 'tttt3', '2016-02-04', 'new', 1),
(53, 'ret', '2016-02-04', 'archive', 1),
(54, 'uuu', '2016-02-04', 'new', 1),
(55, 'test', '2016-02-04', 'done', 1),
(56, 'test2', '2016-02-04', 'archive', 1),
(57, 'test3', '2016-02-04', 'archive', 2);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
