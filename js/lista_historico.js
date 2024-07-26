// Cria uma nova instância da classe AjaxRequest
var ajaxRequest = new AjaxRequest("pages/usuario.php");
showPopup("load", "");
// Envia a solicitação AJAX
ajaxRequest
  .send({ acao: "listar_historico" })
  .then(function (data) {
    hidePopup();
    if (data.naoautenticado) {
      abrirPagina("login.html");
    } else if (data.historico && Array.isArray(data.historico)) {
      //adiciona o valor da variavel data.historico dentro do elemento com id tipo_historico
      document.getElementById("text_tipo_historico").innerHTML =
        data.tipo_historico;
      if (data.historico.length == 0) {
        document.getElementById("qtd_itens").innerHTML =
          "<br>Nenhum histórico encontrado!";
      } else {
        document.getElementById("qtd_itens").innerHTML =
          "<br>" + data.historico.length + " Itens";
      }
      preencherTabela(data.historico);
    }
  })
  .catch(function (error) {
    console.error(error);
    showPopup("error", "Ocorreu um erro ao buscar os dados do usuário:");
  });
