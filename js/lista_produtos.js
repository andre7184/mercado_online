// Cria uma nova instância da classe AjaxRequest
var ajaxRequest = new AjaxRequest("pages/produto.php");
showPopup("load", "");
// Envia a solicitação AJAX
ajaxRequest
  .send({ acao: "listar_produtos" })
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
      preencherTabela(data.produtos);
    }
  })
  .catch(function (error) {
    console.error(error);
    showPopup("error", "Ocorreu um erro ao buscar os dados do usuário:");
  });
