// Cria uma nova instância da classe AjaxRequest
var ajaxRequest = new AjaxRequest("pages/verifica_conteudo.php");
showPopup("load", "");
// Envia a solicitação AJAX
ajaxRequest
  .send({ acao: "listar_usuarios" })
  .then(function (data) {
    hidePopup();
    if (data.naoautenticado) {
      window.location.href = "index.html";
    } else if (data.usuarios && Array.isArray(data.usuarios)) {
      preencherTabela(data.usuarios);
    }
  })
  .catch(function (error) {
    console.error(error);
    showPopup("error", "Ocorreu um erro ao buscar os dados do usuário:");
  });
