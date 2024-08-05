<?php
require_once '../class/Carrinho.php';
require_once '../class/Autenticacao.php';
$carrinho = new Carrinho();
$autenticacao = new Autenticacao();
$dados = array();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $acao = isset($_POST['acao']) ? $carrinho->sanitize($_POST['acao']) : '';
    if ($autenticacao->estaLogado()){
        if ($acao === 'carrinho') {
            // Busca os dados do carrinho
            if (isset($_SESSION['id'])){
                $linha_carrinho = $carrinho->listarCarrinho(['id_usuario' => $_SESSION['id'], 'finalizado' => 0]);
                $dados['carrinho']=[];
                if(!empty($linha_carrinho)){
                    $linha_itens_carrinho = $carrinho->listarItensCarrinho(['id_carrinho' => $linha_carrinho[0]['id']]);
                    if(!empty($linha_itens_carrinho)){
                        require_once '../class/Produto.php';
                        $produtos = new Produto();
                        $itens_carrinho=array();
                        foreach ($linha_itens_carrinho as $i => $itens) {
                            $produto=$produtos->listarProdutos(['id' => $itens['id_produto']])[0];
                            $itens_carrinho[$i]['id'] = $itens['id_produto'];
                            $itens_carrinho[$i]['nome'] = $produto['nome'];
                            $itens_carrinho[$i]['qtd'] = $itens['qtd'];
                            $itens_carrinho[$i]['qtd_estoque'] = $produto['qtd'];
                            $itens_carrinho[$i]['valor'] = $itens['valor_unitario'];
                        }
                        $dados['carrinho']=$itens_carrinho;
                    }
                }
            }
        } else if ($acao === 'sincronizar_carrinho'){
            $carrinho_items = json_decode($_POST['carrinho'], true);
            $forma_pagamento = isset($_POST['forma_pagamento']) ? $carrinho->sanitize($_POST['forma_pagamento']) : '';
            $finalizado = isset($_POST['finalizado']) ? $carrinho->sanitize($_POST['finalizado']) : '';
            // Atualiza ou cria a tabela carrinho
            $dados['carrinho']=[];
            if (isset($_SESSION['id'])){
                if (!empty($carrinho_items)){
                    $id_carrinho=$carrinho->sincronizaCarrinho($_SESSION['id'],$forma_pagamento,$finalizado);
                    if (!empty($id_carrinho)){
                        // $dados['carrinho'] = $carrinho->sincronizaItensCarrinho($id_carrinho,$carrinho_items);
                        // $success = $carrinho->alteraCarrinho(['atualizando' => false], ['id' => $id_carrinho]);
                        // if (!empty($finalizado)) {
                        //     $dados['finalizado'] = "sucess";
                        //     $dados['message'] = "Compra Finalizada com Sucesso!";
                        // } else {
                        //     $dados['message'] = "Carrinho Atualizado com Sucesso!";
                        // }
                    }
                } else {
                    $linha_carrinho = $carrinho->listarCarrinho(['id_usuario' => $_SESSION['id'], 'finalizado' => 0])[0];
                    $success = $carrinho->removeItemCarrinho(['id_carrinho' => $linha_carrinho['id']]);
                }
            }
        } else if ($acao == 'adicionar_carrinho') {
            require_once '../class/Produto.php';
            $produto = new Produto();
            $id_produto = isset($_POST['id']) ? $carrinho->sanitize($_POST['id']) : '';
            $qtd_produto = isset($_POST['qtd']) ? $carrinho->sanitize($_POST['qtd']) : '';
            if (isset($_SESSION['id'])){
                // Verifica se o produto existe
                $produto_existente = $produto->listarProdutos(['id' => $id_produto]);
                if (!empty($produto_existente)) {
                    // Verifica se a quantidade é válida
                    if ($qtd_produto > 0 && $qtd_produto <= $produto_existente[0]['qtd']) {
                        // Adiciona o produto ao carrinho
                        $valor_total=$produto_existente[0]['valor']*$qtd_produto;
                        $id_produto = $produto_existente[0]['id'];
                        $qtd = $qtd_produto;
                        $valor_unitario = $produto_existente[0]['valor'];
                        $id_carrinho=$carrinho->sincronizaCarrinho($_SESSION['id'],'','');
                        if (!empty($id_carrinho)){
                            $item_carrinho = $carrinho->listarItensCarrinho(['id_carrinho' => $id_carrinho, 'id_produto' => $id_produto]);
                            if (!empty($item_carrinho)) {
                                $qtd_atual = $item_carrinho[0]['qtd'];
                                $nova_qtd = $qtd_atual + $qtd;
                                $valor_total = $nova_qtd * $valor_unitario;
                                $update_itens_carrinho = $carrinho->alteraItemCarrinho(['qtd' => $nova_qtd, 'valor_unitario' => $valor_unitario, 'valor_total' => $valor_total],['id' => $item_carrinho[0]['id']]);
                            } else {
                                $create_itens_carrinho = $carrinho->cadastraItemCarrinho($id_carrinho, $id_produto, $qtd, $valor_unitario, $valor_total);
                            }
                            $dados['status'] = 'success';
                            $dados['message'] = 'Produto Adicionado com Sucesso.';
                        } else {
                            $dados['status'] = 'error';
                            $dados['message'] = 'Não foi possivel adicionar produto.';
                        }
                        // ...
                    } else {
                        $dados['status'] = 'error';
                        $dados['message'] = 'Quantidade inválida.';
                    }
                } else {
                    $dados['status'] = 'error';
                    $dados['message'] = 'Produto não encontrado.';
                }
            }
        }else{
            $dados['status'] = 'sucess';
        }
    }else{
        $dados=['naoautenticado' => true, 'acao' => $acao];
    }
} else {
    $dados['status'] = 'error';
    $dados['message'] = 'Método de solicitação inválido.';
}
//fazer uma pausa de 5 segundos
header('Content-Type: application/json');
echo json_encode($dados);
?>
