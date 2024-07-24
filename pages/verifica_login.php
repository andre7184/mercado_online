<?php
require_once '../class/Autenticacao.php';

// Cria uma nova instância da classe Autenticacao
$autenticacao = new Autenticacao();

// Prepara os dados para enviar como JSON
$data = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dados_user = array();
    $islogado=$autenticacao->getSession();
    if ($islogado) {
        $data['logado'] = true;
        $dados_user['email_user'] = $islogado['email'];
        $dados_user['id_user'] = $islogado['id'];
        // Verifica se o usuário é um administrador
        if ($islogado['admin']) {
            $admin_user='Administrador';
            $data['menu'] = '<a class="menu-link" href="lista_produtos.html">Produtos</a>
            <a class="menu-link" href="editar_dados_produto.html">Cadastrar Produto</a>
            <a class="menu-link" href="lista_historico.html">Histórico de Vendas</a>
            <a class="menu-link" href="lista_usuarios.html">Usuários</a>
            <a class="menu-link" href="dados_usuario.html">Meus Dados</a>
            <a href="#" onclick="menuDropdown(); return false;">
            <img class="img-account" src="icons/user.svg" alt="Logo"/></a>';
        } else {
            $admin_user='';
            $data['menu'] = '<a class="menu-link" href="produtos.html">Produtos Disponíveis</a>
            <a class="menu-link" href="lista_historico.html">Histórico de Compras</a>
            <a class="menu-link" href="carrinho.html">Carrinho</a>
            <a class="menu-link" href="dados_usuario.html">Meus Dados</a>
            <a href="#" onclick="menuDropdown(); return false;">
            <img class="img-account" src="icons/user.svg" alt="Logo"/></a>';
        }
        $dados_user['admin_user'] = $admin_user;
    } else {
        $data['logado'] = false;
        $dados_user['email_user'] = '';
        $dados_user['id_user'] = '';
        $dados_user['admin_user'] = '';
        $data['menu'] = '<a class="menu-link" href="lista_produtos.html">Produtos</a>
        <a class="menu-link" href="login.html">Login</a>
        <a class="menu-link" href="editar_dados_usuario.html">Cadastrar</a>';
    }
    $data['user']=$dados_user;
}
// Envia os dados como JSON
header('Content-Type: application/json');
echo json_encode($data);
?>
