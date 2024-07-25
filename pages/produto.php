<?php
require_once '../class/Produto.php';
require_once '../class/Autenticacao.php';

$produto = new Produto();
$autenticacao = new Autenticacao($produto);

$dados = array();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $acao = isset($_POST['acao']) ? $produto->sanitize($_POST['acao']) : '';
    if ($acao === 'produtos') {
        $nome = isset($_POST['nome']) ? $produto->sanitize($_POST['nome']) : '';
        $tipo = isset($_POST['tipo']) ? $produto->sanitize($_POST['tipo']) : '';
        $valor_maior = isset($_POST['valor_maior']) ? $produto->sanitize($_POST['valor_maior']) : '';
        $valor_menor = isset($_POST['valor_menor']) ? $produto->sanitize($_POST['valor_menor']) : '';
        $id = isset($_POST['valor_menor']) ? $produto->sanitize($_POST['id']) : '';

        $dados['status'] = 'success';
        $produtos = $produto->listarProdutos();
        $dados['produtos'] = $produtos;
    }else if ($acao === 'retorno_vazio') {
        $dados['alterar'] = false;
    } else { 
        if ($autenticacao->estaLogado()){
            if ($acao === 'listar_produtos') {
                // Busca os dados do usuário
                if (isset($_POST['id'])){
                    $linha_produto = $produto->listarProdutos(['id' => $produto->sanitize($_POST['id'])])[0];
                } else {
                    $linha_produto = $produto->listarProdutos();
                    foreach ($linha_produto as $i => $prod) {
                        $linha_produto[$i]['imagem'] = '<img width="25" height="20" src="'. $prod['imagem'] .'" alt="'. $prod['nome'] .'"/>';
                        $linha_produto[$i]['editar'] = '<a href="#" onclick="abrirPagina(\'editar_dados_produto.html?id_produto='.$prod['id'].'\'); return false;"><img src="icons/edit.svg" alt="icon" /></a>';         
                    }
                }
                $dados['produtos']=$linha_produto;
            }else if ($acao === 'dados_do_produto') {
                $linha_produto = $produto->listarProdutos(['id' => $produto->sanitize($_POST['id'])])[0];
                $dados=$linha_produto;
    
            } else if ($acao === 'cadastrar_produto') {
                $id = $produto->sanitize($_POST['id']);
                $name = $produto->sanitize($_POST['nome']);
                $qtd = $produto->sanitize($_POST['qtd']);
                $valor = str_replace(',', '.', $produto->sanitize($_POST['valor']));
                $dados['message'] ='';
                if (isset($_FILES['imagem'])) {
                    $nomeArquivo = $_FILES['imagem']['name'];
                    $diretorioDestino = '../imgs/produtos/';
                    $caminhoCompleto = $diretorioDestino . $nomeArquivo;
                    if (move_uploaded_file($_FILES['imagem']['tmp_name'], $caminhoCompleto)) {
                        $imagem = $caminhoCompleto;
                        $dados['message'] = '';
                    } else {
                        $dados['message'] = 'erro ao mover imagem, ';
                        $imagem ='';
                    }
                }else{
                    $dados['message'] = 'erro no upload da imagem, ';
                    $imagem ='';
                }
                // Registre o novo usuário
                if ($produto->cadastraProduto($name, $qtd, $valor, $imagem)) {
                    $dados['status'] = 'success';
                    $dados['message'] .= 'Cadastro efetuado no banco.';
                } else {
                    $dados['status'] = 'error';
                    $dados['message'] .= 'Falha ao cadastrar no banco.';
                }

            } else if ($acao === 'alterar_produto'){
                if (isset($_FILES['imagem'])) {
                    $nomeArquivo = $_FILES['imagem']['name'];
                    $diretorioDestino = '../imgs/produtos/';
                    $caminhoCompleto = $diretorioDestino . $nomeArquivo;
                    if (move_uploaded_file($_FILES['imagem']['tmp_name'], $caminhoCompleto)) {
                        $imagem = $caminhoCompleto;
                        $dados['message'] = '';
                    } else {
                        $dados['message'] = 'erro ao mover imagem, ';
                        $imagem ='';
                    }
                }else{
                    $dados['message'] = 'erro no upload da imagem, ';
                    $imagem ='';
                }
                $valor=$produto->sanitize($_POST['valor']);
                $data = array_filter([
                    'nome' => isset($_POST['nome']) ? $produto->sanitize($_POST['nome']) : '',
                    'qtd' => isset($_POST['qtd']) ? $produto->sanitize($_POST['qtd']) : '',
                    'valor' => isset($_POST['valor']) ? str_replace("R\$ ", "", str_replace(',', '.', $produto->sanitize($_POST['valor']))): '',
                    'imagem' => !empty($imagem) ? substr($imagem, 3) : ''
                ]);
                $conditions = ['id' => $produto->sanitize($_POST['id'])];
                $linha_produto = $produto->alteraProduto($data, $conditions);      
                if ($linha_produto){
                    $dados['status'] = 'success';
                    $dados['message'] .= 'Usuário alterado com sucesso.';
                }else{
                    $dados['status'] = 'error';
                    $dados['message'] .= 'Falha na alteração.';
                }

            }
        }else{
            $dados=['naoautenticado' => true];
        }
    }
} else {
    $dados['status'] = 'error';
    $dados['message'] = 'Método de solicitação inválido.';
}

header('Content-Type: application/json');
echo json_encode($dados);
?>