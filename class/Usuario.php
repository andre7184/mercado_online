<?php
class Usuario {
    private $conn;

    public function __construct($db){
        $this->conn = $db;
    }

    public function emailCadastrado($email){
        $stmt = $this->conn->prepare("SELECT * FROM usuario WHERE email=:email");
        $stmt->execute(array(":email"=>$email));
        $userRow=$stmt->fetch(PDO::FETCH_ASSOC);
        if($stmt->rowCount() > 0){
            return true;
        } else {
            return false;
        }
    }

    public function verificaLogin($email, $senha){
        $stmt = $this->conn->prepare("SELECT * FROM usuario WHERE email=:email");
        $stmt->execute(array(":email"=>$email));
        $userRow=$stmt->fetch(PDO::FETCH_ASSOC);
        if($stmt->rowCount() > 0){
            // O e-mail está registrado, agora vamos verificar a senha
            if(password_verify($senha, $userRow['senha'])){
                // A senha está correta, retorna o ID do usuário
                return $userRow['id'];
            } else {
                // A senha está incorreta
                return false;
            }
        } else {
            // O e-mail não está registrado
            return false;
        }
    }

    public function Admin($email){
        $stmt = $this->conn->prepare("SELECT admin FROM usuario WHERE email=:email");
        $stmt->execute(array(":email"=>$email));
        $userRow=$stmt->fetch(PDO::FETCH_ASSOC);
        if($stmt->rowCount() > 0){
            return $userRow['admin'] == 1;
        } else {
            return false;
        }
    }

    public function cadastraUsuario($nome, $email, $senha, $admin){
        $senha = password_hash($senha, PASSWORD_DEFAULT);
        $stmt = $this->conn->prepare("INSERT INTO usuario(nome, email, senha, admin) VALUES(:nome, :email, :senha, :admin)");
        if($stmt->execute(array(":nome"=>$nome, ":email"=>$email, ":senha"=>$senha, ":admin"=>$admin))){
            return true;
        } else {
            return false;
        }
    }

    public function recuperarSenha($email){
        // Busca o usuário com o e-mail fornecido
        $stmt = $this->conn->prepare("SELECT * FROM usuario WHERE email=:email");
        $stmt->execute(array(":email"=>$email));
        $userRow=$stmt->fetch(PDO::FETCH_ASSOC);
        
        if($stmt->rowCount() > 0){
            // O usuário existe, então podemos gerar uma nova senha
            $novaSenha = $this->gerarNovaSenha(); // Função que você precisa criar para gerar uma nova senha
            
            // Atualiza a senha do usuário no banco de dados
            $senhaHash = password_hash($novaSenha, PASSWORD_DEFAULT);
            $stmt = $this->conn->prepare("UPDATE usuario SET senha=:senha WHERE email=:email");
            $stmt->execute(array(":senha"=>$senhaHash, ":email"=>$email));
            
            // Retorna a nova senha
            return $novaSenha;
        } else {
            // O usuário não existe
            return false;
        }
    }  

    public function getNome($email){
        $stmt = $this->conn->prepare("SELECT nome FROM usuario WHERE email=:email");
        $stmt->execute(array(":email"=>$email));
        $userRow=$stmt->fetch(PDO::FETCH_ASSOC);
        if($stmt->rowCount() > 0){
            return $userRow['nome'];
        } else {
            return '';
        }
    }

    private function gerarNovaSenha(){
        // Gera uma nova senha aleatória
        // Você pode modificar esta função para atender aos seus requisitos de segurança
        return substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);
    }
}
?>
