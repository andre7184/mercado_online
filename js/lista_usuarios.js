// Cria uma nova instância da classe AjaxRequest
var ajaxRequest = new AjaxRequest("pages/usuario.php");
showPopup("load", "");
// Envia a solicitação AJAX
ajaxRequest
  .send({ acao: "listar_usuarios" })
  .then(function (data) {
    hidePopup();
    if (data.naoautenticado) {
      abrirPagina("login.html");
    } else if (data.usuarios && Array.isArray(data.usuarios)) {
      if (data.usuarios.length == 0) {
        document.getElementById("qtd_itens").innerHTML =
          "<br>Nenhum usuário encontrado!";
      } else {
        document.getElementById("qtd_itens").innerHTML =
          "<br>" + data.usuarios.length + " Itens";
      }
      preencherTabela(data.usuarios);
    }
  })
  .catch(function (error) {
    console.error(error);
    showPopup("error", "Ocorreu um erro ao buscar os dados do usuário:");
  });
