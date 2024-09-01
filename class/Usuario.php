<?php
require_once 'Crud.php';

class Usuario {
    private $crud;

    public function __construct(){
        $this->crud = new Crud();
    }

    public function emailCadastrado($email){
        $usuarios = $this->crud->read('usuario', ['email' => $email]);
        return count($usuarios) > 0;
    }

    public function verificaLogin($email, $senha){
        $usuarios = $this->crud->read('usuario', ['email' => $email]);
        if (count($usuarios) > 0) {
            $userRow = $usuarios[0];
            if(password_verify($senha, $userRow['senha'])){
                return $userRow['id'];
            }
        }
        return false;
    }

    public function Admin($email){
        $usuarios = $this->crud->read('usuario', ['email' => $email]);
        if (count($usuarios) > 0) {
            return $usuarios[0]['admin'] == 1;
        }
        return false;
    }

    public function cadastraUsuario($nome, $email, $senha, $admin){
        $senha = password_hash($senha, PASSWORD_DEFAULT);
        return $this->crud->create('usuario', [
            'nome' => $nome,
            'email' => $email,
            'senha' => $senha,
            'admin' => $admin
        ]);
    }

    public function AlterarUsuario($data,$filtros) {
        return $this->crud->update('usuario', $data, $filtros);
    }

    public function listarUsuario($filtros = [], $operadores = []) {
        return $this->crud->read('usuario', $filtros, $operadores);
    }

    public function listarHistorico($filtros = []) {
        return $this->crud->read('transacoes', $filtros);
    }

    public function qtdTransacoes($filtros = []) {
        return $this->crud->count('transacoes', $filtros);
    }

    public function recuperarSenha($email){
        $usuarios = $this->crud->read('usuario', ['email' => $email]);
        if (count($usuarios) > 0) {
            $novaSenha = $this->gerarNovaSenha();
            $senhaHash = password_hash($novaSenha, PASSWORD_DEFAULT);
            $this->crud->update('usuario', ['senha' => $senhaHash], ['email' => $email]);
            return $novaSenha;
        }
        return false;
    }

    public function getNome($email){
        $usuarios = $this->crud->read('usuario', ['email' => $email]);
        if (count($usuarios) > 0) {
            return $usuarios[0]['nome'];
        }
        return '';
    }

    private function gerarNovaSenha(){
        return substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);
    }

    public function sanitize($data) {
        return $this->crud->sanitize($data);
    }
}
?>
