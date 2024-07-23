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
        $acao = $_POST['acao'];
        // Verifica o tipo de conteúdo
        if ($acao === 'dados_do_usuario') {
            // Busca os dados do usuário
            if (isset($_POST['id'])){
                $conditions = ['id' => $_POST['id']];
            } else {
                $conditions = ['id' => $_SESSION['id']];
            }
            $usuario = $crud->read('usuario', $conditions);
            $usuario = $usuario[0];
            unset($usuario['senha']);
            if ($usuario['admin'] == 1) {
                $usuario['admin'] = 'Admin';
                $usuario['qtd_historico'] = $crud->count('transacoes');  
            } else {
                $usuario['admin'] = 'Normal';
                $usuario['qtd_historico'] = $crud->count('transacoes', ['id_usuario' => $_SESSION['id']]);  
            }
            $dados=$usuario;
        } else if ($acao === 'alterar_usuario'){
            $nome = $db->sanitize($_POST['nome']);
            $email = $db->sanitize($_POST['email']);
            $id = $db->sanitize($_POST['id']);
            $data= ['nome'=>$nome,'email'=>$email];
            $conditions = ['id' => $id];
            $usuario = $crud->update('usuario',$data,$conditions);      
            if ($usuario){
                $dados['status'] = 'success';
                $dados['message'] = 'Usuário alterado com sucesso.';
            }else{
                $dados['status'] = 'error';
                $dados['message'] = 'Falha na alteração.';
            }

        } else if ($acao === 'alterar_senha'){
            $senha = $db->sanitize($_POST['senha']);
            $id = $db->sanitize($_POST['id']); 
            $senha = password_hash($senha, PASSWORD_DEFAULT); 
            $data = ['senha'=>$senha];
            $conditions = ['id' => $id];
            $usuario = $crud->update('usuario', $data, $conditions);      
            if ($usuario){
                $dados['status'] = 'success';
                $dados['message'] = 'Senha alterada com sucesso.';
            }else{
                $dados['status'] = 'error';
                $dados['message'] = 'Falha na alteração.';
            }

        } else if ($acao === 'listar_usuarios'){
            if ($autenticacao->eAdmin()){
                $dados['status'] = 'success';
                $usuarios = $crud->read('usuario');
                foreach ($usuarios as $i => $usuario) {
                    unset($usuarios[$i]['senha']);
                    $usuarios[$i]['admin'] = ($usuario['admin'] == 1) ? 'Sim' : 'Não';
                    $usuarios[$i]['editar'] = '<a href="#" onclick="abrirPagina(\'editar_dados_usuario.html?id_usuario='.$usuario['id'].'\'); return false;"><img src="icons/edit.svg" alt="icon" /></a>';
                                       
                }
                $dados['usuarios'] = $usuarios;
            }else {
                $dados['status'] = 'error';
                $dados['message'] = 'Não permitido.';
            }
        } else if ($acao === 'listar_produtos'){
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
