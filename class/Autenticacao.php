<?php
class Autenticacao {
    private $usuario;

    public function __construct($usuario = null){
        $this->usuario = $usuario;
        session_name('mercado_online'); // Defina um nome único para a sessão
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
    }

    public function login($email, $senha){
        $userId = $this->usuario->verificaLogin($email, $senha);
        if ($userId) {
            $_SESSION['id'] = $userId;
            $_SESSION['email'] = $email;
            $_SESSION['admin'] = $this->usuario->Admin($email);
            return true;
        } else {
            return false;
        }
    }
    
    public function eAdmin(){
        return isset($_SESSION['admin']) && $_SESSION['admin'];
    }

    public function logout(){
        // Limpar todas as variáveis de sessão
        session_unset();
            
        // Destruir a sessão
        session_destroy();

        // Opcional: Limpar cookies de sessão
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
    }

    public function estaLogado(){
        return isset($_SESSION['email']);
    }

    public function getSession() {
        if ($this->estaLogado()) {
            return array(
                'id' => $_SESSION['id'],
                'email' => $_SESSION['email'],
                'admin' => $_SESSION['admin'],
            );
        } else {
            return null;
        }
    }
}
?>
