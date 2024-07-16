<?php
require_once '../class/Autenticacao.php';

// Cria uma nova instância da classe Autenticacao
$autenticacao = new Autenticacao();

// Prepara os dados para enviar como JSON
$data = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action']) && $_POST['action'] === 'logout') {
        $autenticacao->logout();
        $data['status'] = 'logged_out';
    }else {
        // Verifica se o usuário está logado
        if ($autenticacao->estaLogado()) {
            $data['login'] = 'logado';

            // Verifica se o usuário é um administrador
            if ($autenticacao->eAdmin()) {
                $data['admin'] = 'sim';
            } else {
                $data['admin'] = 'nao';
            }
        } else {
            $data['login'] = 'nao_logado';
        }
    }
}

// Envia os dados como JSON
header('Content-Type: application/json');
echo json_encode($data);
?>
