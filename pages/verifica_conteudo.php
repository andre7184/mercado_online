<?php
require_once '../class/Database.php';
require_once '../class/Crud.php';
require_once '../class/Autenticacao.php';

// Cria uma nova conexão com o banco de dados
$db = new Database();
$conn = $db->dbConnection();

// Cria uma nova instância da classe Crud
$crud = new Crud($conn);

// Cria uma nova instância da classe Autenticacao
$autenticacao = new Autenticacao();

$dados = array();
// Verifica se a solicitação é uma solicitação POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtém o tipo de conteúdo da solicitação POST
    if (!$autenticacao->estaLogado()){
        $dados=['naoautenticado' => true];
    } else {
        
        if ($acao === 'listar_produtos'){
            if ($autenticacao->eAdmin()){
                $dados['status'] = 'success';
                $produtos = $crud->read('produtos');
                foreach ($produtos as $i => $produto) {
                    $produtos[$i]['editar'] = '<a href="#" onclick="abrirPagina(\'editar_dados_produto.html?id_produto='.$produto['id'].'\'); return false;"><img src="icons/edit.svg" alt="icon" /></a>';
                                       
                }
                $dados['produtos'] = $produtos;
            }else {
                $dados['status'] = 'error';
                $dados['message'] = 'Não permitido.';
            }
        } else if ($acao === 'dados_do_produto') {
            // Busca os dados do produto
            if (isset($_POST['id'])){
                $conditions = ['id' => $db->sanitize($_POST['id'])];
                $produtos = $crud->read('produtos', $conditions);
                $produtos = $produtos[0];
                $dados=$produtos;
            }
        } else if ($acao === 'listar_historico'){
            if ($autenticacao->eAdmin()){
                $dados['tipo_historico']='Vendas';
                $conditions = ['id_usuario' => $_SESSION['id']];
            }else{
                $conditions = '';
                $dados['tipo_historico']='Compras';
            }
            $dados['status'] = 'success';
            $historicos = $crud->read('transacoes',$conditions);
            foreach ($historicos as $i => $historico) {
                $historicos[$i]['editar'] = '<a href="#" onclick="abrirPagina(\'editar_dados_produto.html?id_produto='.$historico['id'].'\'); return false;"><img src="icons/edit.svg" alt="icon" /></a>';
                                    
            }
            $dados['historico'] = $historicos;
        }
    }
}
header('Content-Type: application/json');
echo json_encode($dados);
?>
