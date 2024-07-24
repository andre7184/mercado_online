// Cria uma nova instância da classe AjaxRequest
var ajaxRequest = new AjaxRequest("pages/verifica_conteudo.php");
showPopup("load", "");
// Envia a solicitação AJAX
valor_argumento = retornaArgsHtml("editar_dados_produto", "id_produto");
if (valor_argumento) {
  var dados = { acao: "dados_do_produto", id: valor_argumento };
} else {
  var dados = { acao: "dados_do_produto" };
}
ajaxRequest
  .send(dados)
  .then(function (data) {
    hidePopup();
    if (data.naoautenticado) {
      window.location.href = "index.html";
    }
    if (data.length > 0) {
      document.querySelectorAll(".tipo_dados").forEach(function (elemento) {
        elemento.innerHTML = "Alterar";
      });
      document.getElementById("nome_atual").textContent = data.nome;
      document.getElementById("qtd_atual").textContent = data.qtd;
      document.getElementById("valor_atual").textContent = data.valor;
      
      document.getElementById("novo_nome").textContent = data.nome;
      document.getElementById("nova_qtd").textContent = data.qtd;
      document.getElementById("novo_valor").textContent = data.valor;
      document.getElementById("id_produto").textContent = data.id;
    } else {
      document.querySelectorAll(".tipo_dados").forEach(function (elemento) {
        elemento.innerHTML = "Cadastrar";
      });
    }
  })
  .catch(function (error) {
    showPopup("error", "Ocorreu um erro ao buscar os dados do usuário:");
  });

document
  .getElementById("cadastroForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    var nome = document.getElementById("novo_nome").value;
    var qtd = document.getElementById("nova_qtd").value;
    var valor = document.getElementById("novo_valor").value;
    var id = document.getElementById("id_produto").value;

    var cadastrar = new AjaxRequest("pages/cadastrar.php");
    showPopup("load", "");
    cadastrar
      .send({
        acao: "cadastrar_produto",
        nome: nome,
        qtd: qtd,
        valor: valor,
        id: id,
      })
      .then(function (response) {
        hidePopup();
        if (response.status == "success") {
          showPopup("sucess", response.message);
          abrirPagina("lista_produtos.html");
        } else {
          showPopup("error", response.message);
        }
      })
      .catch(function (error) {
        showPopup("error", "Ocorreu um erro. Por favor, tente novamente.");
      });
  });

document.getElementById("novo_nome").addEventListener("input", function () {
  this.value = this.value.toUpperCase();
});
document.getElementById('novo_valor').addEventListener('input', function(e) {
  var valor = e.target.value;
  valor = valor.replace(/\D/g, ""); // Remove tudo o que não é dígito
  valor = Number(valor) / 100; // Divide por 100 para obter as casas decimais
  e.target.value = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
});
