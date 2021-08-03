/*
 Navicat MySQL Data Transfer

 Source Server         : test
 Source Server Type    : MySQL
 Source Server Version : 80020
 Source Host           : localhost:3306
 Source Schema         : fruitshop

 Target Server Type    : MySQL
 Target Server Version : 80020
 File Encoding         : 65001

 Date: 16/06/2020 13:30:15
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for product
-- ----------------------------
DROP TABLE IF EXISTS `product`;
CREATE TABLE `product`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '商品id',
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '商品标题',
  `price` decimal(20, 2) NOT NULL COMMENT '商品价格',
  `num` int(0) NOT NULL COMMENT '商品库存',
  `pic` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '商品图片',
  `details` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '商品详情',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 205 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of product
-- ----------------------------
INSERT INTO `product` VALUES (1, '越南进口红心火龙果1kg', 29.00, 55, '[{ \"title\": \"small\", \"src\": \"../img/012.png\" }]', '<h1>\r\n商品详情描述\r\n</h1>');
INSERT INTO `product` VALUES (11, '新疆阿克苏冰糖心苹果2斤', 59.00, 40, '[{ \"title\": \"small\", \"src\": \"../img/g7.png\" }]', '');
INSERT INTO `product` VALUES (2, '广禧草莓果酱2kg含果肉果粒酱', 178.00, 17, '[{\r\n    \"title\": \"small\",\r\n    \"src\": \"../img/013.png\"\r\n}]', '<h1>商品详细信息<h1>\n<div style=\"color:red;\">\n假装有商品描述\n</div>');
INSERT INTO `product` VALUES (9, '优选新疆库尔勒香梨2kg', 58.00, 40, '\r\n\r\n[{ \"title\": \"small\", \"src\": \"../img/g5.png\" }]', '');
INSERT INTO `product` VALUES (10, '海南小青柠2斤', 49.00, 40, '[{ \"title\": \"small\", \"src\": \"../img/g6.png\" }]', '');
INSERT INTO `product` VALUES (3, '\r\n山东早春红玉小西瓜4-5斤', 29.80, 187, '[{\r\n    \"title\": \"small\",\r\n    \"src\": \"../img/047.png\"\r\n}]', '<h1>\r\n假装有商品详情\r\n</h1>');
INSERT INTO `product` VALUES (4, '新疆阿克苏冰糖心苹果2kg果径80-85mm ', 39.00, 50, ' [{\"title\": \"small\", \"src\": \"../img/017.png\"}]', '');
INSERT INTO `product` VALUES (5, '进口越南青芒5斤', 59.00, 30, '[{ \"title\": \"small\", \"src\": \"../img/016.png\" }]', '');
INSERT INTO `product` VALUES (6, '泰国特产冷冻金枕头榴莲果肉300g', 46.00, 45, '[{ \"title\": \"small\", \"src\": \"../img/019.png\" }]', '');
INSERT INTO `product` VALUES (7, '正宗浙江奉化陈大娘水蜜桃5斤', 56.00, 50, '[{ \"title\": \"small\", \"src\": \"../img/035.png\" }]', '');
INSERT INTO `product` VALUES (8, '浙江温州香甜西瓜麒麟瓜3kg', 26.00, 50, '[{ \"title\": \"small\", \"src\": \"../img/034.png\" }]', '');
INSERT INTO `product` VALUES (21, '冰糖雪梨汁包邮冰糖炖梨果汁', 72.00, 40, '[{ \"title\": \"small\", \"src\": \"../img/e7.png\" }]', '');
INSERT INTO `product` VALUES (20, '汇源果汁100%橙汁 1Lx5 盒 ', 79.00, 50, '[{ \"title\": \"small\", \"src\": \"../img/045.png\" }]', '');
INSERT INTO `product` VALUES (19, '椰树牌椰子汁无糖245ml*24罐', 105.90, 50, '[{ \"title\": \"small\", \"src\": \"../img/044.png\" }]', '');
INSERT INTO `product` VALUES (18, '天喔果园 苹果汁250ml*16盒整箱', 59.00, 50, '[{ \"title\": \"small\", \"src\": \"../img/e4.png\" }]', '');
INSERT INTO `product` VALUES (17, '百香果酱广西新鲜百香果果酱', 31.00, 50, '[{ \"title\": \"small\", \"src\": \"../img/e3.png\" }]', '');
INSERT INTO `product` VALUES (16, '佳沛新西兰鸭嘴金奇异果8粒', 96.00, 50, '[{ \"title\": \"small\", \"src\": \"../img/d7.png\" }]', '');
INSERT INTO `product` VALUES (15, '美国进口水果车厘子2磅908克', 138.00, 50, '[{ \"title\": \"small\", \"src\": \"../img/d6.png\" }]', '');
INSERT INTO `product` VALUES (14, '小台农芒果 2.5kg装 单果50g以上', 54.90, 50, '[{ \"title\": \"small\", \"src\": \"../img/046.png\" }]', '');
INSERT INTO `product` VALUES (13, '泰国特产冷冻金枕头榴莲果肉', 79.00, 50, '[{ \"title\": \"small\", \"src\": \"../img/d4.png\" }]', '');
INSERT INTO `product` VALUES (12, '新西兰佳沛绿奇异果16粒', 139.00, 50, '[{ \"title\": \"small\", \"src\": \"../img/d3.png\" }]', '');
INSERT INTO `product` VALUES (22, '广东潮州老字号正阳牌杨桃3kg', 25.00, 47, '[{ \"title\": \"small\", \"src\": \"../img/040.png\" }]', '');
INSERT INTO `product` VALUES (23, '湖南炎陵高山黄肉桃5kg', 68.00, 61, '[{ \"title\": \"small\", \"src\": \"../img/038.png\" }]', '');
INSERT INTO `product` VALUES (24, '海南陵水特产圣女果4kg', 88.00, 32, '[{ \"title\": \"small\", \"src\": \"../img/039.png\" }]', '');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `user_id` int(0) NOT NULL AUTO_INCREMENT COMMENT '用户号',
  `user_name` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户名',
  `user_password` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户密码',
  `user_phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '手机号',
  `user_email` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '邮箱',
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 57 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (2, '关羽', '222', '11111133333', '123@qq.com');
INSERT INTO `user` VALUES (3, '张飞', '333', '', '');
INSERT INTO `user` VALUES (6, '马超', '666', '', '');
INSERT INTO `user` VALUES (7, '孙尚香', '777', '', '');
INSERT INTO `user` VALUES (8, '吕布', '888', '', '');
INSERT INTO `user` VALUES (56, '水果篮子', '123456', '', '');
INSERT INTO `user` VALUES (55, '拌饭小队', '123456', '', '');
INSERT INTO `user` VALUES (49, '李白', '25002500', '15570133862', '1228029@qq.com');
INSERT INTO `user` VALUES (54, '烤肉拌饭', '123456', '', '');

SET FOREIGN_KEY_CHECKS = 1;
