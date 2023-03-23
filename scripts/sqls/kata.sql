-- 插入选项数据
INSERT INTO kata_options (value, label) VALUES('free', '自由'),
('tiger', '虎码'),
('word', '单字'),
('articleSet0', '入门必打'),
('articleSet1', '必背名篇4-1'),
('articleSet2', '必背名篇4-2'),
('articleSet3', '必背名篇4-3'),
('articleSet4', '必背名篇4-4')

-- 插入子选项数据
INSERT INTO kata_options_child (option_id, value, label, isRemote) VALUES
(1, 'freeText', '手动输入', 0),
(2, 'tigerSimp2F500', '虎码二简 前500[完结版]', 0),
(2, 'tigerSimp2Other', '虎码二简 其他[完结版]', 0),
(2, 'tigerCertainly632', '虎码必拆字632[完结版]', 1),
(2, 'tigerCode3', '虎码三码字根字', 0),
(2, 'tigerYNM4500', '虎码要你命4500', 1),
(2, 'singleMo500', '魔500', 1),
(3, 'singleFront500', '前500 1-500', 1),
(3, 'singleMiddle500', '中500 501-1000', 1),
(3, 'singleEnd500', '后500 1001-1500', 1),
(3, 'singleFront1500', '前1500 1-1500', 1),
(3, 'singleHuang500', '黄500 1501-2000', 1),
(3, 'singleXuan500', '玄500 2001-2500', 1),
(3, 'singleDi500', '地500 2501-3000', 1),
(3, 'singleTian500', '天500 3001-3500', 1),
(3, 'singleEnd2000', '后2000 1501-3500', 1),
(3, 'singleAll3500', '全3500 1-3500', 1),
(3, 'singleWang500', '王500 3501-4000', 1),
(3, 'singleGrand500', '皇500 4001-4500', 1),
(3, 'singleEmpire500', '帝500 4501-5000', 1)

-- 弃用
CREATE TABLE kata_content (
  `id` INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `child_id` INT NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  FOREIGN KEY (child_id) REFERENCES kata_options_child(option_id)
);