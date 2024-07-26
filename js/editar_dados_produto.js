// Cria uma nova instância da classe AjaxRequest
var ajaxRequest = new AjaxRequest("pages/produto.php");
showPopup("load", "");
// Envia a solicitação AJAX
valor_argumento = retornaArgsHtml("editar_dados_produto", "id_produto");
if (valor_argumento) {
  var dados = { acao: "dados_do_produto", id: valor_argumento };
} else {
  var dados = { acao: "retorno_vazio" };
}
ajaxRequest
  .send(dados)
  .then(function (data) {
    hidePopup();
    if (data.naoautenticado) {
      abrirPagina("login.html");
    } else {
      if (data.alterar == undefined) {
        document.querySelectorAll(".tipo_dados").forEach(function (elemento) {
          elemento.innerHTML = "Alterar";
        });
        alert(data.nome);
        document.getElementById("nome_atual").required = false;
        document.getElementById("qtd_atual").required = false;
        document.getElementById("valor_atual").required = false;
        document.getElementById("imagem_atual").required = false;
        document.getElementById("nome_atual").textContent = data.nome;
        document.getElementById("qtd_atual").textContent = data.qtd;
        document.getElementById("valor_atual").textContent = data.valor;
        document.getElementById("imagem_atual").innerHTML =
          '<img width="30" height="20" src="' +
          data.imagem +
          '" alt="' +
          data.nome +
          '"/>';

        document.getElementById("novo_nome").value = data.nome;
        document.getElementById("nova_qtd").value = data.qtd;
        document.getElementById("novo_valor").value = data.valor;
        document.getElementById("id_produto").value = data.id;
      } else {
        document.getElementById("nome_atual").required = true;
        document.getElementById("qtd_atual").required = true;
        document.getElementById("valor_atual").required = true;
        document.getElementById("imagem_atual").required = true;
        document.querySelectorAll(".tipo_dados").forEach(function (elemento) {
          elemento.innerHTML = "Cadastrar";
        });
      }
    }
  })
  .catch(function (error) {
    console.log(error);
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
    var imagemElement = document.getElementById("nova_imagem");
    var imagem = imagemElement.files[0];
    if (!id) {
      var acao = "cadastrar_produto";
    } else {
      var acao = "alterar_produto";
    }

    var cadastrar = new AjaxRequest("pages/produto.php");
    showPopup("load", "");
    cadastrar
      .send({
        acao: acao,
        nome: nome,
        qtd: qtd,
        valor: valor,
        imagem: imagem,
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
document.getElementById("novo_valor").addEventListener("input", function (e) {
  var valor = e.target.value;
  valor = valor.replace(/\D/g, ""); // Remove tudo o que não é dígito
  valor = Number(valor) / 100; // Divide por 100 para obter as casas decimais
  e.target.value = valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
});
