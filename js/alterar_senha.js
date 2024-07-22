// Cria uma nova instância da classe AjaxRequest
var ajaxRequest = new AjaxRequest("pages/verifica_conteudo.php");
showPopup("load", "");
// Envia a solicitação AJAX
ajaxRequest
  .send({ acao: "dados_do_usuario" })
  .then(function (data) {
    hidePopup();
    if (!data.naoautenticado) {
      document.getElementById("id_usuario").value = data.id;
    } else {
      abrirPagina("login.html");
    }
  })
  .catch(function (error) {
    showPopup("error", "Ocorreu um erro ao buscar os dados do usuário:");
  });

document
  .getElementById("cadastroForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    var id = document.getElementById("id_usuario").value;
    var senha = document.getElementById("nova_senha").value;
    var senha2 = document.getElementById("nova_senha2").value;
    if (senha !== senha2) {
      document
        .getElementById("nova_senha2")
        .setCustomValidity("As senhas não conferem!");
      return false;
    }
    var cadastrar = new AjaxRequest("pages/verifica_conteudo.php");
    showPopup("load", "");
    cadastrar
      .send({
        acao: "alterar_senha",
        senha: senha,
        id: id,
      })
      .then(function (response) {
        hidePopup();
        if (response.status == "success") {
          showPopup("sucess", response.message);
          abrirPagina("home.html");
        } else {
          showPopup("error", response.message);
        }
      })
      .catch(function (error) {
        showPopup("error", "Ocorreu um erro. Por favor, tente novamente.");
      });
  });
