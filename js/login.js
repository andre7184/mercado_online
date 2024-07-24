document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    var email = document.getElementById("email").value;
    var senha = document.getElementById("senha").value;
    var logar = new AjaxRequest("pages/autenticacao.php");

    showPopup('load','');
    logar
      .send({ email: email, senha: senha })
      .then(function (response) {
        hidePopup();
        if (response.success) {
          showPopup('sucess',response.message)
          if (typeof dadosUser !== 'undefined' && dadosUser.hasOwnProperty('acao_login_pg'))
            verificarLogin(dadosUser.acao_login_pg)
          else
            verificarLogin("home.html")
        } else {
          showPopup('error',response.message)
        }
      })
      .catch(function (error) {
          showPopup('error','Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.')
      });
  });

document
  .getElementById("resenhaForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    var email = document.getElementById("email_recuperacao").value;
    var resenha = new AjaxRequest("pages/usuario.php");

    showPopup('load','');
    resenha
      .send({ acao: "recuperar_senha", email: email })
      .then(function (response) {
        hidePopup();
        if (response.status=='success') {
          showPopup('success',response.message)
          dadosUser.acao_login_pg = 'alterar_senha.html';
          abrirPagina("login.html");
        } else {
          showPopup('error',response.message)
        }

      })
      .catch(function (error) {
        showPopup('error','Ocorreu um erro. Por favor, tente novamente.')
      });
  });

document
  .getElementById("recuperar_senha")
  .addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("local_login").style.display = "none";
    document.getElementById("local_resenha").style.display = "block";
  });

Array.from(document.querySelectorAll('input[type="email"]')).forEach(function (
  element
) {
  element.addEventListener("input", function () {
    this.value = this.value.toLowerCase();
  });
});
