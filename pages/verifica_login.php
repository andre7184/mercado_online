<?php
require_once '../class/Autenticacao.php';

// Cria uma nova instância da classe Autenticacao
$autenticacao = new Autenticacao();

// Prepara os dados para enviar como JSON
$data = array();
sleep(5);
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dados_user = array();
    $islogado=$autenticacao->getSession();
    if ($islogado) {
        $data['logado'] = true;
        $dados_user['email_user'] = $islogado['email'];
        $dados_user['id_user'] = $islogado['id'];
        if ($islogado['admin']) {
            $admin_user='Administrador';
            $data['menu'] = '<a class="menu-link" href="lista_produtos.html">Produtos</a>
            <a class="menu-link" href="lista_historico.html">Históricos</a>
            <a class="menu-link" href="lista_usuarios.html">Usuários</a>
            <p class="menu-text dropdown-text"><b>MINHA CONTA</b></p>
            <p class="menu-text dropdown-text">'.$dados_user['email_user'].'</p>
            <p class="menu-text dropdown-text">Administrador</p>
            <a class="menu-link dropdown-text" href="dados_usuario.html" >Meus Dados</a>
            <a class="menu-link dropdown-text" href="editar_dados_usuario.html" >Alterar Dados</a>
            <a class="menu-link dropdown-text" href="alterar_senha.html" >Alterar Senha</a>
            <a class="menu-link dropdown-text" href="#" onclick="logout(); return false;">Sair</a>
            ';

            $data['menu_dropdown'] = '<p class="menu-text"><center><b>MINHA CONTA</b></center></p>
            <p class="menu-text">'.$dados_user['email_user'].'</p>
            <p class="menu-text">Administrador</p>
            <a class="menu-link" href="dados_usuario.html" >Meus Dados</a>
            <a class="menu-link" href="editar_dados_usuario.html" >Alterar Dados</a>
            <a class="menu-link" href="alterar_senha.html" >Alterar Senha</a>
            <a class="menu-link" href="#" onclick="logout(); return false;">Sair</a>
            ';
            
        } else {
            $admin_user='';
            $data['menu'] = '<a class="menu-link" href="produtos.html">Produtos Disponíveis</a>
            <a class="menu-link" href="lista_historico.html">Histórico</a>
            <a class="menu-link" href="carrinho.html">Carrinho</a>
            <p class="menu-text dropdown-text">Minha Conta</p>
            <p class="menu-text dropdown-text">'.$dados_user['email_user'].'</p>
            <a class="menu-link dropdown-text" href="dados_usuario.html" >Meus Dados</a>
            <a class="menu-link dropdown-text" href="editar_dados_usuario.html" >Alterar Dados</a>
            <a class="menu-link dropdown-text" href="alterar_senha.html" >Alterar Senha</a>
            <a class="menu-link dropdown-text" href="#" onclick="logout(); return false;">Sair</a>
            ';
            $data['menu_dropdown'] = '<p class="menu-text"><center>Minha Conta</center></p>
            <p class="menu-text">'.$dados_user['email_user'].'</p>
            <a class="menu-link" href="dados_usuario.html" >Meus Dados</a>
            <a class="menu-link" href="editar_dados_usuario.html" >Alterar Dados</a>
            <a class="menu-link" href="alterar_senha.html" >Alterar Senha</a>
            <a class="menu-link" href="#" onclick="logout(); return false;">Sair</a>
            ';
        }
        $dados_user['admin_user'] = $admin_user;
    } else {
        $data['logado'] = false;
        $dados_user['email_user'] = '';
        $dados_user['id_user'] = '';
        $dados_user['admin_user'] = '';
        $data['menu'] = '<a class="menu-link" href="produtos.html">Produtos</a>
        <a class="menu-link" href="carrinho.html">Carrinho</a>
        <a class="menu-link" href="login.html">Login</a>
        <a class="menu-link" href="editar_dados_usuario.html">Cadastrar</a>';
        $data['menu_dropdown'] =' ';
    }
    $data['user']=$dados_user;
}
// Envia os dados como JSON
header('Content-Type: application/json');
echo json_encode($data);
?>
