// Cria uma nova instância da classe AjaxRequest
var ajaxRequest = new AjaxRequest("pages/verifica_conteudo.php");
showPopup("load", "");
// Envia a solicitação AJAX
ajaxRequest
  .send({ acao: "listar_historico" })
  .then(function (data) {
    hidePopup();
    if (data.naoautenticado) {
      window.location.href = "index.html";
    } else if (data.historico && Array.isArray(data.historico)) {
      //adiciona o valor da variavel data.historico dentro do elemento com id tipo_historico
      var text_tipo=tipo_historico;
      if(data.historico.length==0){
        text_tipo+="<br>Nenhum histórico encontrado!";
      }
      document.getElementById("tipo_historico").innerHTML = text_tipo;
      preencherTabela(data.historico);
    }
  })
  .catch(function (error) {
    console.error(error);
    showPopup("error", "Ocorreu um erro ao buscar os dados do usuário:");
  });
