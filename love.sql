SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE IF NOT EXISTS `love` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `love`;

CREATE TABLE `clock` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `creat_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `clock` (`id`, `user_id`, `creat_date`) VALUES
(1, 1, '2018-07-07 10:38:17');

CREATE TABLE `day` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `content` longtext NOT NULL,
  `remind` int(11) NOT NULL,
  `bg_id` int(11) DEFAULT NULL,
  `top` int(11) DEFAULT '0',
  `top_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `day` (`id`, `date`, `content`, `remind`, `bg_id`, `top`, `top_time`) VALUES
(59, '1997-06-15', '生日', 1, 4, 0, '2018-06-24 07:11:58');

CREATE TABLE `day_bg` (
  `id` int(11) NOT NULL,
  `bg_url` varchar(300) NOT NULL,
  `bg_small` varchar(300) NOT NULL,
  `bg_name` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `day_bg` (`id`, `bg_url`, `bg_small`, `bg_name`) VALUES
(1, '/static/imgs/bg1.png', '/static/imgs/bg1_small.png', '绚烂星空'),
(2, '/static/imgs/bg2.png', '/static/imgs/bg2_small.png', '紫色激情'),
(3, '/static/imgs/bg3.png', '/static/imgs/bg3_small.png', '经典复古'),
(4, '/static/imgs/bg4.png', '/static/imgs/bg4_small.png', '粉色回忆');
CREATE TABLE `day_view` (
`id` int(11)
,`date` date
,`content` longtext
,`remind` int(11)
,`bg_id` int(11)
,`bg_url` varchar(300)
,`bg_small` varchar(300)
,`bg_name` varchar(45)
,`top` int(11)
,`top_time` timestamp
,`day` int(7)
);

CREATE TABLE `memo` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 NOT NULL,
  `creat_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `star` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `memo` (`id`, `user_id`, `content`, `creat_time`, `update_time`, `star`) VALUES
(6, 2, '今天天气真好，哈哈哈哈哈哈哈哈哈哈耶耶耶耶aaaaaaaaaaaaaaaaaaaaaaaa啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊aaaaaaaaaaaaaaaaaaaaaaaaa<div>a</div><div>a</div><div>aaa</div>', '2018-06-25 06:09:29', '2018-07-05 09:22:25', 0),
(8, 2, '蝉鸣的夏季<div>我想遇见你~</div>', '2018-06-25 12:47:33', '2018-06-25 12:47:33', 0),
(10, 2, '啊啊啊', '2018-06-25 12:48:53', '2018-06-25 12:48:53', 0),
(12, 2, '你是猪吗......', '2018-06-25 12:50:02', '2018-06-25 12:51:08', 1),
(23, 2, '🧡💚', '2018-06-26 12:39:53', '2018-07-05 09:22:12', 0),
(24, 2, '😄😔😠😝😜🐎🍃❤❤🍜🍊🍢🍆🍆', '2018-06-30 06:39:01', '2018-06-30 06:39:01', 0),
(25, 1, '要听话哦宝宝崽', '2018-07-02 04:43:47', '2018-07-02 04:43:47', 0),
(26, 1, '记账专用！！<div>7.5号 10.5+12+11+10+10+7.7+60=121.2</div><div>7.6号 4+1+12.5+4.8+3.4+8+26.7+15+3=88.4</div><div>7.7号 1.4+2+3+10+40=57.4</div><div>7.8号 6+24+10.4+22=62.4</div><div>7.9号 6</div><div>7.10号 2+22=24</div><div>7.11号 24+7+9+8+4.5+14=66.5</div><div>7.12号 26+14+14+12+6=72</div>', '2018-07-05 09:20:29', '2018-07-12 13:32:57', 1);
CREATE TABLE `memo_view` (
`id` int(11)
,`user_id` int(11)
,`content` longtext
,`creat_time` timestamp
,`update_time` timestamp
,`star` int(11)
,`user` varchar(45)
,`nickname` varchar(45)
,`head_image` varchar(300)
,`update_day` int(7)
,`creat_day` int(7)
);

CREATE TABLE `message` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` longtext NOT NULL,
  `creat_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `color` varchar(10) DEFAULT '#333333'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `message` (`id`, `user_id`, `content`, `creat_time`, `color`) VALUES
(1, 1, '哈哈', '2018-06-15 12:36:41', '#333333'),
(2, 2, '我们一起学猫叫~', '2018-06-27 08:35:00', 'red'),
(3, 2, '惊啦', '2018-06-27 08:36:32', 'green'),
(4, 2, '啊啊', '2018-06-27 08:36:38', 'purple'),
(5, 2, '测试一下~哈哈\n嘿嘿...\n🐴', '2018-06-27 08:43:54', '#333333'),
(6, 2, '蝉鸣的夏季，我想遇见你~~~~猪婆', '2018-06-27 08:44:32', '#333333'),
(7, 2, '这是一条超长的留言，超长，超长，超长，超长的留言', '2018-06-27 08:44:51', '#333333'),
(8, 2, '粉粉的', '2018-06-27 08:45:07', 'pink'),
(9, 2, '这是橘黄色', '2018-06-27 08:45:15', 'orange'),
(10, 2, '黄色！！！', '2018-06-27 08:45:21', 'yellow'),
(11, 2, '灰灰哒', '2018-06-27 08:45:27', '#666666'),
(12, 2, 'BLUE', '2018-06-27 08:45:36', 'blue'),
(13, 2, '紫色激情', '2018-06-27 08:45:46', 'purple'),
(14, 2, '大红色~~~', '2018-06-27 08:46:27', 'red'),
(15, 2, '家吗迪拜', '2018-06-28 10:19:57', 'green'),
(16, 1, '', '2018-06-29 13:25:57', '#333333'),
(17, 1, '22', '2018-06-30 02:34:56', '#333333'),
(18, 1, '  2  2  2  ', '2018-06-30 02:35:28', '#333333'),
(19, 2, '明天就要走了呢。', '2018-06-30 12:31:33', 'purple'),
(20, 1, '想你呢😭', '2018-07-02 04:41:46', 'red');
CREATE TABLE `message_view` (
`id` int(11)
,`user_id` int(11)
,`content` longtext
,`creat_time` timestamp
,`color` varchar(10)
,`day` int(7)
,`user` varchar(45)
);

CREATE TABLE `photo` (
  `id` int(11) NOT NULL,
  `image` varchar(300) DEFAULT NULL,
  `creat_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `photo` (`id`, `image`, `creat_time`) VALUES
(8, 'http://pb0rh6b0r.bkt.clouddn.com/FvR5HspKx_A2_R-1ZaSbWZfQY4Yw', '2018-07-05 12:53:10'),
(9, 'http://pb0rh6b0r.bkt.clouddn.com/FkAeXVAEa4VeyampJqvGTOBfcaXx', '2018-07-05 12:53:11'),
(10, 'http://pb0rh6b0r.bkt.clouddn.com/FtMeKmVFGSmH-RCnA8jl-UMZIeEC', '2018-07-05 12:53:11'),
(11, 'http://pb0rh6b0r.bkt.clouddn.com/Fst04g5fwup30F7jIuqBFFGSdmwh', '2018-07-05 12:53:11'),
(12, 'http://pb0rh6b0r.bkt.clouddn.com/FlRNmk5OvZ8Qo4oEIwDP_MmQUQxe', '2018-07-05 12:53:39'),
(14, 'http://pb0rh6b0r.bkt.clouddn.com/FmVDFdmlss76WjNItXSZPB-wG0_e', '2018-07-06 13:08:08'),
(15, 'http://pb0rh6b0r.bkt.clouddn.com/FlItAyc-yR-ttMldBp_GaS6ZHD4-', '2018-07-06 13:08:08');

CREATE TABLE `slider_bg` (
  `id` int(11) NOT NULL,
  `image` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `slider_bg` (`id`, `image`) VALUES
(46, 'http://pb0rh6b0r.bkt.clouddn.com/FtzXGGNQdPv2QJ4wJk2MY4NKEcLd'),
(48, 'http://pb0rh6b0r.bkt.clouddn.com/Fk4cDe--DZG2wQRs52dh4Ssjor3C'),
(50, 'http://pb0rh6b0r.bkt.clouddn.com/FhLRCO9eXjcHgeOszywGJU1x8hSa'),
(51, 'http://pb0rh6b0r.bkt.clouddn.com/FlWHSqkagThdVnAUs7FTW9nk8z-S'),
(52, 'http://pb0rh6b0r.bkt.clouddn.com/FkdL_ayMOCWyLBNQm6Il8n76wRLP');

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `nickname` varchar(45) DEFAULT NULL,
  `user` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `head_image` varchar(300) DEFAULT NULL,
  `session_key` varchar(100) DEFAULT NULL,
  `exp` int(11) DEFAULT NULL,
  `level` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `user` (`id`, `nickname`, `user`, `password`, `head_image`, `session_key`, `exp`, `level`) VALUES
(1, '徐大屌', 'xyxl1997', 'xyxl1997', NULL, '1531583334396xyxl199715315833343961', 100, 2),
(2, '西梅小可爱', 'miracles', 'xm147258369', NULL, '1531571519599miracles15315715195992', 50, 1),
(25, NULL, '111', '111', NULL, NULL, NULL, NULL),
(26, NULL, '1111', '1111', NULL, NULL, NULL, NULL),
(27, NULL, '12', '12', NULL, NULL, NULL, NULL),
(28, NULL, '2', '2', NULL, NULL, NULL, NULL),
(29, NULL, '13361652325', 'xyn996', NULL, NULL, NULL, NULL),
(30, NULL, '15797768867', 'xyxl1997', NULL, NULL, NULL, NULL),
(31, NULL, '110', '110', NULL, NULL, NULL, NULL),
(32, NULL, '13361715525', '123456', NULL, NULL, NULL, NULL);
DROP TABLE IF EXISTS `day_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `day_view`  AS  select `day`.`id` AS `id`,`day`.`date` AS `date`,`day`.`content` AS `content`,`day`.`remind` AS `remind`,`day`.`bg_id` AS `bg_id`,`day_bg`.`bg_url` AS `bg_url`,`day_bg`.`bg_small` AS `bg_small`,`day_bg`.`bg_name` AS `bg_name`,`day`.`top` AS `top`,`day`.`top_time` AS `top_time`,(to_days(now()) - to_days(`day`.`date`)) AS `day` from (`day` left join `day_bg` on((`day`.`bg_id` = `day_bg`.`id`))) ;
DROP TABLE IF EXISTS `memo_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `memo_view`  AS  select `memo`.`id` AS `id`,`memo`.`user_id` AS `user_id`,`memo`.`content` AS `content`,`memo`.`creat_time` AS `creat_time`,`memo`.`update_time` AS `update_time`,`memo`.`star` AS `star`,`user`.`user` AS `user`,`user`.`nickname` AS `nickname`,`user`.`head_image` AS `head_image`,(to_days(now()) - to_days(`memo`.`update_time`)) AS `update_day`,(to_days(now()) - to_days(`memo`.`creat_time`)) AS `creat_day` from (`user` join `memo`) where (`memo`.`user_id` = `user`.`id`) ;
DROP TABLE IF EXISTS `message_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `message_view`  AS  select `message`.`id` AS `id`,`message`.`user_id` AS `user_id`,`message`.`content` AS `content`,`message`.`creat_time` AS `creat_time`,`message`.`color` AS `color`,(to_days(now()) - to_days(`message`.`creat_time`)) AS `day`,`user`.`user` AS `user` from (`user` join `message`) where (`user`.`id` = `message`.`user_id`) ;


ALTER TABLE `clock`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `day`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `day_bg`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `memo`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `message`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `photo`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `slider_bg`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `user`
  ADD PRIMARY KEY (`id`,`user`);


ALTER TABLE `clock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
ALTER TABLE `day`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;
ALTER TABLE `day_bg`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
ALTER TABLE `memo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
ALTER TABLE `photo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
ALTER TABLE `slider_bg`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
