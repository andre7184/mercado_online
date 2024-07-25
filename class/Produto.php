<?php
require_once 'Crud.php';

class Produto {
    private $crud;

    public function __construct(){
        $this->crud = new Crud();
    }

    public function cadastraProduto($nome, $qtd, $valor, $imagem){
        $data = array_filter([
            'nome' => !empty($nome) ? $nome : '',
            'qtd' => !empty($qtd) ? $qtd : '',
            'valor' => !empty($valor) ? floatval(str_replace("R$ ", "", str_replace(',', '.', $valor))): '',
            'imagem' => !empty($imagem) ? substr($imagem, 3) : ''
        ]);
        if($data){
            return $this->crud->create('produtos', $data);
        }else{
            return false;
        }
    }

    public function alteraProduto($data, $filtros) {
        return $this->crud->update('produtos', $data, $filtros);
    }

    public function listarProdutos($filtros = []) {
        return $this->crud->read('produtos', $filtros);
    }

    public function sanitize($data) {
        return $this->crud->sanitize($data);
    }
}
?>
