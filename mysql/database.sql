-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 19/07/2024 às 23:50
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `database`
--
CREATE DATABASE IF NOT EXISTS `database` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `database`;

-- --------------------------------------------------------

--
-- Estrutura para tabela `carrinho`
--

DROP TABLE IF EXISTS `carrinho`;
CREATE TABLE `carrinho` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  `qtd` int(11) DEFAULT NULL,
  `data` datetime DEFAULT NULL,
  `data_update` datetime DEFAULT NULL,
  `finalizado` tinyint(1) NOT NULL,
  `forma_pagamento` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Despejando dados para a tabela `carrinho`
--

INSERT INTO `carrinho` (`id`, `id_usuario`, `preco`, `qtd`, `data`, `data_update`, `finalizado`, `forma_pagamento`) VALUES
(2, 2, 105.30, 6, '2024-06-29 20:34:33', '2024-07-13 19:28:33', 1, 'debito'),
(14, 2, 143.10, 2, '2024-06-30 20:40:25', '2024-07-13 19:28:33', 1, 'credito'),
(15, 2, 133.60, 4, '2024-06-30 21:02:31', '2024-07-13 19:28:33', 1, 'pix'),
(16, 4, 141.20, 4, '2024-07-02 14:32:06', '2024-07-13 19:28:33', 1, 'dinheiro');

-- --------------------------------------------------------

--
-- Estrutura para tabela `itens_carrinho`
--

DROP TABLE IF EXISTS `itens_carrinho`;
CREATE TABLE `itens_carrinho` (
  `id` int(11) NOT NULL,
  `id_carrinho` int(11) NOT NULL,
  `id_produto` varchar(255) NOT NULL,
  `qtd` int(11) NOT NULL,
  `valor_unitario` decimal(10,2) NOT NULL,
  `valor_total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Despejando dados para a tabela `itens_carrinho`
--

INSERT INTO `itens_carrinho` (`id`, `id_carrinho`, `id_produto`, `qtd`, `valor_unitario`, `valor_total`) VALUES
(4, 2, '1', 1, 23.85, 23.85),
(6, 2, '2', 3, 5.00, 15.00),
(7, 2, '3', 2, 6.90, 13.80),
(29, 14, '1', 3, 23.85, 71.55),
(31, 15, '5', 10, 5.68, 56.80),
(32, 15, '2', 2, 5.00, 10.00),
(33, 16, '5', 10, 5.68, 56.80),
(34, 16, '3', 2, 6.90, 13.80);

--
-- Acionadores `itens_carrinho`
--
DROP TRIGGER IF EXISTS `delete_produtos_carrinho`;
DELIMITER $$
CREATE TRIGGER `delete_produtos_carrinho` AFTER DELETE ON `itens_carrinho` FOR EACH ROW BEGIN 
    UPDATE carrinho
    SET preco = preco - OLD.valor_total,
    qtd = qtd - 1
    WHERE id = OLD.id_carrinho;
    UPDATE produtos
    SET qtd = qtd + OLD.qtd
    WHERE id = OLD.id_produto;
    DELETE FROM carrinho WHERE qtd = 0; 
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `insert_produtos_carrinho`;
DELIMITER $$
CREATE TRIGGER `insert_produtos_carrinho` AFTER INSERT ON `itens_carrinho` FOR EACH ROW BEGIN 
    UPDATE carrinho
    SET preco = preco + NEW.valor_total,
    qtd = qtd + 1,
    data_update = NOW()
    WHERE id = NEW.id_carrinho;
    UPDATE produtos
    SET qtd = qtd - NEW.qtd
    WHERE id = NEW.id_produto; 
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `produtos`
--

DROP TABLE IF EXISTS `produtos`;
CREATE TABLE `produtos` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `qtd` int(11) NOT NULL,
  `valor` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Despejando dados para a tabela `produtos`
--

INSERT INTO `produtos` (`id`, `nome`, `qtd`, `valor`) VALUES
(1, 'ARROZ AGULHINHA', 6, 23.85),
(2, 'FEIJÃO CARIOCA', -2, 5.00),
(3, 'MACARRAO', 12, 6.90),
(5, 'AÇUCAR REFINADO', 10, 5.68);

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `transacoes`
-- (Veja abaixo para a visão atual)
--
DROP VIEW IF EXISTS `transacoes`;
CREATE TABLE `transacoes` (
`id_transacao` int(11)
,`id_usuario` int(11)
,`nome_usuario` varchar(255)
,`valor_total_carrinho` decimal(10,2)
,`quantidade_total_carrinho` int(11)
,`forma_pagamento_carrinho` text
,`data_transacao` varchar(24)
,`id_produtos` mediumtext
,`produtos` mediumtext
,`qtd_produtos` mediumtext
,`valor_unitario_produtos` mediumtext
,`valor_total_produtos` mediumtext
);

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `admin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Despejando dados para a tabela `usuario`
--

INSERT INTO `usuario` (`id`, `nome`, `email`, `senha`, `admin`) VALUES
(6, 'andre', 'amb7184@gmail.com', '$2y$10$RRtS87saMccw/0C/OHxopubJS6ZEONJ8ewpe/KFffGWmeMlp4IPzC', 1),
(7, 'André', 'tubarao84@gmail.com', '$2y$10$4lFGGlqvszx3dBefDV6Y5uJNyS3Wk4UhHN9sWpBIbzNZoC0l7dmcS', 0),
(11, 'JOAO', 'joao@gmail.com', '$2y$10$WeFIJENdlIpaqqQm9NyYo.kY17SOvb4.gSAEsu.eOU6XF1sMRDR.S', 0);

-- --------------------------------------------------------

--
-- Estrutura para view `transacoes`
--
DROP TABLE IF EXISTS `transacoes`;

DROP VIEW IF EXISTS `transacoes`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `transacoes`  AS SELECT `c`.`id` AS `id_transacao`, `u`.`id` AS `id_usuario`, `u`.`nome` AS `nome_usuario`, `c`.`preco` AS `valor_total_carrinho`, `c`.`qtd` AS `quantidade_total_carrinho`, `c`.`forma_pagamento` AS `forma_pagamento_carrinho`, date_format(`c`.`data`,'%d/%m/%Y %H:%i:%s') AS `data_transacao`, group_concat(`ic`.`id_produto`,',' separator ',') AS `id_produtos`, group_concat(`p`.`nome`,',' separator ',') AS `produtos`, group_concat(`ic`.`qtd`,',' separator ',') AS `qtd_produtos`, group_concat(`ic`.`valor_unitario`,',' separator ',') AS `valor_unitario_produtos`, group_concat(`ic`.`valor_total`,',' separator ',') AS `valor_total_produtos` FROM (((`carrinho` `c` join `usuario` `u` on(`c`.`id_usuario` = `u`.`id`)) join `itens_carrinho` `ic` on(`c`.`id` = `ic`.`id_carrinho`)) join `produtos` `p` on(`ic`.`id_produto` = `p`.`id`)) WHERE `c`.`finalizado` = 1 GROUP BY `c`.`id` ;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `carrinho`
--
ALTER TABLE `carrinho`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `itens_carrinho`
--
ALTER TABLE `itens_carrinho`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `produtos`
--
ALTER TABLE `produtos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nome` (`nome`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `carrinho`
--
ALTER TABLE `carrinho`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de tabela `itens_carrinho`
--
ALTER TABLE `itens_carrinho`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
