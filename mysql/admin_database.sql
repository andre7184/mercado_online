
-- Copiando estrutura do banco de dados para admin_database
CREATE DATABASE IF NOT EXISTS `admin_database` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `admin_database`;

-- Copiando estrutura para tabela admin_database.carrinho
CREATE TABLE IF NOT EXISTS `carrinho` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `preco` float NOT NULL,
  `qtd` int(11) NOT NULL,
  `data` timestamp NULL DEFAULT current_timestamp(),
  `data_update` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `finalizado` tinyint(1) DEFAULT NULL,
  `forma_pagamento` text DEFAULT NULL,
  `atualizando` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para evento admin_database.EVENTO
DELIMITER //
CREATE EVENT `EVENTO` ON SCHEDULE EVERY 15 MINUTE STARTS '2024-08-04 15:02:43' ON COMPLETION NOT PRESERVE ENABLE DO CALL LIMPAR_CARRINHO()//
DELIMITER ;

-- Copiando estrutura para tabela admin_database.itens_carrinho
CREATE TABLE IF NOT EXISTS `itens_carrinho` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_carrinho` int(11) NOT NULL,
  `id_produto` varchar(255) NOT NULL,
  `qtd` int(11) NOT NULL,
  `valor_unitario` decimal(10,2) NOT NULL,
  `valor_total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=210 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para procedure admin_database.LIMPAR_CARRINHO
DELIMITER //
CREATE PROCEDURE `LIMPAR_CARRINHO`()
BEGIN
  CREATE TEMPORARY TABLE temp_ids SELECT `id` FROM `carrinho` WHERE `data_update` < DATE_SUB(NOW(), INTERVAL 30 MINUTE) AND `finalizado` = 0;
  
  DELETE `itens_carrinho` FROM `itens_carrinho`
    INNER JOIN temp_ids ON `itens_carrinho`.`id_carrinho` = temp_ids.`id`;
  
  DROP TEMPORARY TABLE temp_ids;
END//
DELIMITER ;

-- Copiando estrutura para evento admin_database.limpar_carrinhos_inativos
DELIMITER //
CREATE EVENT `limpar_carrinhos_inativos` ON SCHEDULE EVERY 15 MINUTE STARTS '2024-08-03 04:12:13' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
  DECLARE tempo_max_inatividade INT DEFAULT 1800;
  
  DECLARE tempo_atual INT DEFAULT UNIX_TIMESTAMP();

  -- Deleta os itens do carrinho
  DELETE FROM itens_carrinho
  WHERE id_carrinho IN (
    SELECT id FROM carrinho WHERE finalizado = false AND UNIX_TIMESTAMP(data_update) < tempo_atual - tempo_max_inatividade
  );
END//
DELIMITER ;

-- Copiando estrutura para tabela admin_database.produtos
CREATE TABLE IF NOT EXISTS `produtos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `qtd` int(11) NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `imagem` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nome` (`nome`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para view admin_database.transacoes
-- Criando tabela temporária para evitar erros de dependência de VIEW
CREATE TABLE `transacoes` (
	`id_transacao` INT(11) NOT NULL,
	`id_usuario` INT(11) NOT NULL,
	`nome_usuario` VARCHAR(1) NOT NULL COLLATE 'utf8mb3_general_ci',
	`valor_total_carrinho` FLOAT NOT NULL,
	`quantidade_total_carrinho` INT(11) NOT NULL,
	`forma_pagamento_carrinho` TEXT NULL COLLATE 'utf8mb3_general_ci',
	`data_transacao` VARCHAR(1) NULL COLLATE 'utf8mb4_general_ci',
	`id_produtos` MEDIUMTEXT NULL COLLATE 'utf8mb3_general_ci',
	`produtos` MEDIUMTEXT NULL COLLATE 'utf8mb3_general_ci',
	`qtd_produtos` MEDIUMTEXT NULL COLLATE 'utf8mb4_general_ci',
	`valor_unitario_produtos` MEDIUMTEXT NULL COLLATE 'utf8mb4_general_ci',
	`valor_total_produtos` MEDIUMTEXT NULL COLLATE 'utf8mb4_general_ci'
) ENGINE=MyISAM;

-- Copiando estrutura para tabela admin_database.usuario
CREATE TABLE IF NOT EXISTS `usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `admin` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para trigger admin_database.delete_produtos_carrinho
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `delete_produtos_carrinho` AFTER DELETE ON `itens_carrinho` FOR EACH ROW BEGIN 
    UPDATE carrinho
    SET preco = preco - OLD.valor_total,
    qtd = qtd - 1
    WHERE id = OLD.id_carrinho;
    UPDATE produtos
    SET qtd = qtd + OLD.qtd
    WHERE id = OLD.id_produto;
    DELETE FROM carrinho WHERE qtd = 0 AND atualizando = false;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Copiando estrutura para trigger admin_database.insert_produtos_carrinho
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `insert_produtos_carrinho` AFTER INSERT ON `itens_carrinho` FOR EACH ROW BEGIN 
    UPDATE carrinho
    SET preco = preco + NEW.valor_total,
    qtd = qtd + 1,
    data_update = NOW()
    WHERE id = NEW.id_carrinho;
    UPDATE produtos
    SET qtd = qtd - NEW.qtd
    WHERE id = NEW.id_produto; 
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Copiando estrutura para trigger admin_database.update_produtos_carrinho
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `update_produtos_carrinho` AFTER UPDATE ON `itens_carrinho` FOR EACH ROW BEGIN 
    UPDATE carrinho
    SET preco = preco - OLD.valor_total + NEW.valor_total,
    qtd = qtd - OLD.qtd + NEW.qtd,
    data_update = NOW()
    WHERE id = NEW.id_carrinho;
    UPDATE produtos
    SET qtd = qtd + OLD.qtd - NEW.qtd
    WHERE id = NEW.id_produto; 
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Removendo tabela temporária e criando a estrutura VIEW final
DROP TABLE IF EXISTS `transacoes`;
CREATE VIEW `transacoes` AS select `c`.`id` AS `id_transacao`,`u`.`id` AS `id_usuario`,`u`.`nome` AS `nome_usuario`,`c`.`preco` AS `valor_total_carrinho`,`c`.`qtd` AS `quantidade_total_carrinho`,`c`.`forma_pagamento` AS `forma_pagamento_carrinho`,date_format(`c`.`data`,'%d/%m/%Y %H:%i:%s') AS `data_transacao`,group_concat(`ic`.`id_produto` order by `ic`.`id_produto` ASC separator ',') AS `id_produtos`,group_concat(`p`.`nome` order by `ic`.`id_produto` ASC separator ',') AS `produtos`,group_concat(`ic`.`qtd` order by `ic`.`id_produto` ASC separator ',') AS `qtd_produtos`,group_concat(`ic`.`valor_unitario` order by `ic`.`id_produto` ASC separator ',') AS `valor_unitario_produtos`,group_concat(`ic`.`valor_total` order by `ic`.`id_produto` ASC separator ',') AS `valor_total_produtos` from (((`carrinho` `c` join `usuario` `u` on(`c`.`id_usuario` = `u`.`id`)) join `itens_carrinho` `ic` on(`c`.`id` = `ic`.`id_carrinho`)) join `produtos` `p` on(`ic`.`id_produto` = `p`.`id`)) where `c`.`finalizado` = 1 group by `c`.`id`;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
