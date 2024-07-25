// Cria uma nova instância da classe AjaxRequest
var ajaxRequest = new AjaxRequest("pages/produto.php");
showPopup("load", "");
// Envia a solicitação AJAX
ajaxRequest
  .send({ acao: "produtos" })
  .then(function (data) {
    hidePopup();
    if (data.naoautenticado) {
      window.location.href = "index.html";
    } else if (data.produtos && Array.isArray(data.produtos)) {
      if(data.produtos.length==0){
        document.getElementById("qtd_itens").innerHTML="<br>Nenhum produto encontrado!";
      }else{
        document.getElementById("qtd_itens").innerHTML="<br>"+data.produtos.length+" Itens";
      }
      preencherCards(data.produtos);
    }
  })
  .catch(function (error) {
    console.error(error);
    showPopup("error", "Ocorreu um erro ao buscar os dados do usuário:");
  });
  function adicionarCarrinho(id,nome){
    message = `
    <form id="cadastroQtdProduto" class="form">
    <p class="form-title"><b>Qtd do Produto</b><br>${nome}</p>
    <div class="input-container">
        <input type="number" min="1" max="" placeholder="Quantidade" name="qtd_produto" id="qtd_produto" value="1"/>
    </div>
    <input type="hidden" id="id_produto" value="${id}" />
    <button type="button" onclick="salvarProdutos(this)" class="submit">Confirmar</button>
    </form>
    `;
    showPopup("form", message);

  }
  function salvarProdutos(){
    hidePopup();
    var id = document.getElementById("id_produto").value;
    var qtd = document.getElementById("qtd_produto").value;
    var cadastrar = new AjaxRequest("pages/carrinho.php");
    showPopup("load", "");
    cadastrar
      .send({
        acao: "adicionar_carrinho",
        qtd: qtd,
        id: id,
      })
      .then(function (response) {
        hidePopup();
        if (response.status == "success") {
          showPopup("sucess", response.message);
          abrirPagina("carrinho.html");
        } else {
          showPopup("error", response.message);
        }
      })
      .catch(function (error) {
        showPopup("error", "Ocorreu um erro. Por favor, tente novamente.");
      });
  };
