<?php
require_once '../config/config.php';
require_once '../class/Database.php';
require_once '../class/Usuario.php';

$db = new Database();
$user = new Usuario($db->dbConnection());

$response = array();

// Verifique se a solicitação é uma solicitação POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize e obtenha os dados do formulário
    $name = $db->sanitize($_POST['nome']);
    $email = $db->sanitize($_POST['email']);
    $senha = $db->sanitize($_POST['senha']);
    $password_admin = $db->sanitize($_POST['password_admin']);
    $tipo_admin = $db->sanitize($_POST['tipo_admin']);
    $nova_senha_admin = $db->sanitize($senha_admin);
    $tipo_admin = ($tipo_admin === 'true');
    if (!$tipo_admin || $password_admin == $nova_senha_admin) {
        // Verifique se o e-mail já está registrado
        if ($user->emailCadastrado($email)) {
            $response['status'] = 'error';
            $response['message'] = 'Email já está registrado.';
        } else {
            // Registre o novo usuário
            if ($user->cadastraUsuario($name, $email, $senha, $tipo_admin)) {
                $response['status'] = 'success';
                $response['message'] = 'Registro bem-sucedido.';
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Falha no registro.';
            }
        }
    }else{
        $response['status'] = 'error';
        $response['message'] = 'Senha Admin inválida.';
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'Método de solicitação inválido.';
}

header('Content-Type: application/json');
echo json_encode($response);
?>
