<?php
require_once 'Crud.php';

class Carrinho {
    private $crud;

    public function __construct(){
        $this->crud = new Crud();
    }

    public function cadastraCarrinho($data){
        if(!empty($data)){
            return $this->crud->create('carrinho', $data);
        }else{
            return false;
        }
    }

    public function alteraCarrinho($data, $filtros) {
        return $this->crud->update('carrinho', $data, $filtros);
    }

    public function listarCarrinho($filtros = []) {
        return $this->crud->read('carrinho', $filtros);
    }

    public function cadastraItemCarrinho($id_carrinho, $id_produto, $qtd, $valor_unitario, $valor_total){
        $data = array_filter([
            'id_carrinho' => !empty($id_carrinho) ? $id_carrinho : '',
            'id_produto' => !empty($id_produto) ? $id_produto : '',
            'qtd' => !empty($qtd) ? $qtd : '',
            'valor_unitario' => !empty($valor_unitario) ? floatval(str_replace("R$ ", "", str_replace(',', '.', $valor_unitario))) : '',
            'valor_total' => !empty($valor_total) ? floatval(str_replace("R$ ", "", str_replace(',', '.', $valor_total))) : ''
        ]);
        if($data){
            return $this->crud->create('itens_carrinho', $data);
        }else{
            return false;
        }
    }

    public function sincronizaCarrinho($id_usuario,$forma_pagamento,$finalizado,$carrinho_items){
        $conditions_carrinho = ['id_usuario' => $id_usuario, 'finalizado' => false];
        $existing_carrinho = $this->listarCarrinho($conditions_carrinho);
        if (!empty($existing_carrinho)) {
            echo "existe carrinho<br>";
            // Se o carrinho existir, atualiza
            if (!empty($finalizado)) {
                $data_carrinho = array(
                    'data_update' => date('Y-m-d H:i:s'),
                    'finalizado' => true,
                    'forma_pagamento' => $forma_pagamento,
                    'atualizar' => true,
                );
            } else {
                echo "nao finalizar<br>";
                $data_carrinho = array(
                    'data_update' => date('Y-m-d H:i:s'),
                    'atualizar' => true,
                );    
            }
            $success = $this->alteraCarrinho($data_carrinho, $conditions_carrinho);
            if ($success) {
                echo "Carrinho atualizado<br>";
                $id_carrinho=$existing_carrinho[0]['id'];
            } else {
                echo "Carrinho não atualizado<br>";
                $id_carrinho='';
            }            
        } else {
            echo "não existe carrrinho<br>";
            // Se for para finalizar a compra
            if (!empty($finalizado)) {
                echo "finalizar compra<br>";
                $data_carrinho = array_filter([
                    'id_usuario' => $id_usuario,
                    'data' => date('Y-m-d H:i:s'),
                    'data_update' => date('Y-m-d H:i:s'),
                    'finalizado' => true,
                    'forma_pagamento' => $forma_pagamento
                ]);
            } else {
                echo "atualizar carrinho<br>";
                $data_carrinho = array_filter([
                    'id_usuario' => $id_usuario,
                    'data' => date('Y-m-d H:i:s'),
                    'data_update' => date('Y-m-d H:i:s'),
                    'forma_pagamento' => ''
                ]); 
            }
            $id_carrinho = $this->cadastraCarrinho($data_carrinho);
            echo "carrrinho cadastrado<br>";
        }
        // Cria a tabela itens_carrinho
        $sucess_itens_carrinho=array();
        if (!empty($id_carrinho)) {
            $remove_itensCarrinhho = $this->removeItemCarrinho(['id_carrinho' => $id_carrinho]);
            echo "itens carrrinho removidos<br>";
            foreach ($carrinho_items as $item) {
                $id_produto = $this->sanitize($item['id']);
                $qtd = isset($item['qtd']) ? $this->sanitize($item['qtd']) : '';
                $valor_unitario = isset($item['valor']) ? str_replace("R\$ ", "", str_replace(',', '.', $this->sanitize($item['valor']))): '';
                $valor_total = isset($item['valor']) && isset($item['qtd']) ? str_replace("R\$ ", "", str_replace(',', '.', $this->sanitize($item['valor']))) * $this->sanitize($item['qtd']) : '';
                $cadastra_itensCarrinhho = $this->cadastraItemCarrinho($id_carrinho, $id_produto, $qtd, $valor_unitario, $valor_total);
                if ($cadastra_itensCarrinhho) {
                    echo "item carrrinho cadastrado<br>";
                    array_push($sucess_itens_carrinho, $item);
                }
            }
        }
        return $sucess_itens_carrinho;
    }

    public function removeItemCarrinho($filtros) {
        return $this->crud->delete('itens_carrinho', $filtros);
    }

    public function listarItensCarrinho($filtros = []) {
        return $this->crud->read('itens_carrinho', $filtros);
    }

    public function sanitize($data) {
        return $this->crud->sanitize($data);
    }
}
?>
