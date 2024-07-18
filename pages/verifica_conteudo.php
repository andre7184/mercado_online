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
    $pagina = $_POST['pagina'];
    
    // Verifica o tipo de conteúdo
    if ($pagina === 'dados_do_usuario') {
        if (!$autenticacao->estaLogado()){
            $dados=['naoautenticado' => true];
        } else {
            // Busca os dados do usuário
            $conditions = ['id' => $_SESSION['id']];
            $usuario = $crud->read('usuario', $conditions);
            
            // Pega o primeiro usuário do array de resultados
            $usuario = $usuario[0];

            // Remove a senha do array do usuário
            unset($usuario['senha']);
            
            // Verifica se o usuário é admin
            if ($usuario['admin'] == 1) {
                $usuario['admin'] = 'Admin';
                // Adiciona a quantidade de transações ao usuário admin
                $usuario['qtd_historico'] = $crud->count('transacoes');  
            } else {
                $usuario['admin'] = 'Normal';
                // Adiciona a quantidade de transações ao usuário normal
                $usuario['qtd_historico'] = $crud->count('transacoes', ['id_usuario' => $_SESSION['id']]);  
            }

            // Retorna os dados do usuário como JSON
            $dados=$usuario;
        }
    }
}
header('Content-Type: application/json');
echo json_encode($dados);
?>
