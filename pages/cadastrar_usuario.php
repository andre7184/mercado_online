<?php
require_once '../config/config.php';
require_once '../class/Database.php';
require_once '../class/Usuario.php';

$db = new Database();
$user = new Usuario($db->dbConnection());

$response = array();

// Verifique se a solicitação é uma solicitação POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $acao = $db->sanitize($_POST['acao']);
    if ($acao === 'recuperar_senha') {
        $email = $db->sanitize($_POST['email']);
        // Chama o método de recuperação de senha
        $novaSenha = $user->recuperarSenha($email);
        if ($novaSenha) {
            $nomeCliente = $user->getNome($email);
            $url_login = "http://localhost/mercado_online/index.html?pg=login.html"; 
            $assunto = "Recuperação de Senha";
            $corpoEmail = "Olá $nomeCliente,<br><br>Recebemos uma solicitação para redefinir sua senha.<br><br>Sua nova senha é: <b>$novaSenha</b><br><a href='$url_login'>$url_login</a><br>Acesse para entrar com sua nova senha.<br><br><br>Se você não solicitou uma redefinição de senha, por favor, ignore este e-mail.<br><br>Atenciosamente,<br><b>Equipe $empresa</b>";
            $emailOrigem = "tubarao84@gmail.com>"; 
            $enviado=enviarEmail($emailOrigem, $email, $assunto, $corpoEmail);
            if ($enviado=='sucesso') {
                $response['status'] = 'success';
                $response['message'] = 'Uma nova senha foi enviada para o seu e-mail.';
            } else {
                $response['status'] = 'error';
                $response['message'] = $enviado;
            }
        } else {
            // O e-mail não está registrado
            $response['status'] = 'error';
            $response['message'] = 'E-mail não cadastrado.';
        }
    } else if ($acao === 'cadastrar_usuario') {
        $name = $db->sanitize($_POST['nome']);
        $email = $db->sanitize($_POST['email']);
        $senha = $db->sanitize($_POST['senha']);
        $tipo_admin = false;
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
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'Método de solicitação inválido.';
}

header('Content-Type: application/json');
echo json_encode($response);
?>
