<?php
require_once '../class/Usuario.php';
require_once '../class/Autenticacao.php';


// Instanciando a classe do usuário
$usuario = new Usuario();
// Instanciando a classe de autenticação
$autenticacao = new Autenticacao($usuario);

// Verificando se os dados do formulário foram enviados
if (isset($_POST['email']) && isset($_POST['senha'])) {
    // Recebendo e sanitizando os dados do formulário
    $email = $usuario->sanitize($_POST['email']);
    $senha = $usuario->sanitize($_POST['senha']);

    // Tentando fazer login
    $login = $autenticacao->login($email, $senha);
} else {
    $login = false;
}
sleep(5);
// Retornando o resultado como JSON
header('Content-Type: application/json');
if ($login) {
    echo json_encode(['success' => true, 'message' => 'Login bem-sucedido!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Falha no login. Verifique seu email e senha.']);
}
?>
