<?php
require_once 'Crud.php';

class Carrinho {
    private $crud;

    public function __construct(){
        $this->crud = new Crud();
    }

    public function cadastraCarrinho($id_usuario,$preco,$qtd,$forma_pagamento,$finalizado,$atualizando){
        $data = array(
            'id_usuario' => $id_usuario,
            'preco' => !empty($preco) ? floatval(str_replace("R$ ", "", str_replace(',', '.', $preco))) : 0,
            'qtd' => !empty($qtd) ? $qtd : 0,
            'finalizado' => !empty($finalizado) ? $finalizado : 0,
            'forma_pagamento' => !empty($forma_pagamento) ? $forma_pagamento : '',
            'atualizando' => !empty($atualizando) ? $atualizando : 0
        );
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
        $data = array(
            'id_carrinho' => !empty($id_carrinho) ? $id_carrinho : '',
            'id_produto' => !empty($id_produto) ? $id_produto : '',
            'qtd' => !empty($qtd) ? $qtd : '',
            'valor_unitario' => !empty($valor_unitario) ? floatval(str_replace("R$ ", "", str_replace(',', '.', $valor_unitario))) : '',
            'valor_total' => !empty($valor_total) ? floatval(str_replace("R$ ", "", str_replace(',', '.', $valor_total))) : ''
        );
        if($data){
            return $this->crud->create('itens_carrinho', $data);
        }else{
            return false;
        }
    }

    public function sincronizaCarrinho($id_usuario,$forma_pagamento,$finalizado){
        $existing_carrinho = $this->listarCarrinho(['id_usuario' => $id_usuario, 'finalizado' => false]);
        if (!empty($existing_carrinho)) {
             // Se o carrinho existir, atualiza
            if (!empty($finalizado)) {
                $data_carrinho = array(
                    'finalizado' => 1,
                    'forma_pagamento' => $forma_pagamento,
                    'atualizando' => 1,
                );
            } else {
                $data_carrinho = array(
                    'atualizando' => 1,
                );    
            }
            $success = $this->alteraCarrinho($data_carrinho, ['id' => $existing_carrinho[0]['id']]);
            if ($success) {
                $id_carrinho=$existing_carrinho[0]['id'];
            } else {
                $id_carrinho='';
            }            
        } else {
            $id_carrinho = $this->cadastraCarrinho($id_usuario,0,0,$forma_pagamento,$finalizado,false);
        }
        return $id_carrinho;
    }

    public function sincronizaItensCarrinho($id_carrinho,$carrinho_items){
        // Cria a tabela itens_carrinho
        $sucess_itens_carrinho=array();
        if (!empty($id_carrinho)) {
            $remove_itensCarrinhho = $this->removeItemCarrinho(['id_carrinho' => $id_carrinho]);
            foreach ($carrinho_items as $item) {
                $id_produto = $item['id'];
                $qtd = isset($item['qtd']) ? $this->sanitize($item['qtd']) : '';
                $valor_unitario = isset($item['valor']) ? str_replace("R\$ ", "", str_replace(',', '.', $this->sanitize($item['valor']))): '';
                $valor_total = isset($item['valor']) && isset($item['qtd']) ? str_replace("R\$ ", "", str_replace(',', '.', $this->sanitize($item['valor']))) * $this->sanitize($item['qtd']) : '';
                $cadastra_itensCarrinhho = $this->cadastraItemCarrinho($id_carrinho, $id_produto, $qtd, $valor_unitario, $valor_total);
                if ($cadastra_itensCarrinhho) {
                    array_push($sucess_itens_carrinho, $item);
                }
            }
        }
        return $sucess_itens_carrinho;
    }

    public function removeItemCarrinho($filtros) {
        return $this->crud->delete('itens_carrinho', $filtros);
    }

    public function alteraItemCarrinho($data, $filtros) {
        return $this->crud->update('itens_carrinho', $data, $filtros);
    }

    public function listarItensCarrinho($filtros = []) {
        return $this->crud->read('itens_carrinho', $filtros);
    }

    public function sanitize($data) {
        return $this->crud->sanitize($data);
    }
}
?>
