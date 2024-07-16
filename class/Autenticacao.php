<?php
class Autenticacao {
    private $usuario;

    public function __construct($usuario = null){
        $this->usuario = $usuario;
        session_start();
    }

    public function login($email, $senha){
        if ($this->usuario->verificaLogin($email, $senha)) {
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
        session_unset();
        session_destroy();
    }

    public function estaLogado(){
        return isset($_SESSION['email']);
    }
}
?>
