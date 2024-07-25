// Cria uma nova instância da classe AjaxRequest
var ajaxRequest = new AjaxRequest("pages/usuario.php");
showPopup("load", "");
// Envia a solicitação AJAX
valor_argumento=retornaArgsHtml('editar_dados_usuario','id_usuario');
if (valor_argumento) {
  var dados = { acao: "dados_do_usuario", id: valor_argumento };
}else{
  var dados = { acao: "dados_do_usuario" };
}
ajaxRequest
  .send(dados)
  .then(function (data) {
    hidePopup();
    if (!data.naoautenticado) {
      document.querySelector(".signup-link").style.display = "none";
      document.getElementById("nova_senha").required = false;
      document.getElementById("nova_senha2").required = false;
      document.getElementById("input_nova_senha").style.display = "none";
      document.getElementById("input_nova_senha2").style.display = "none";
      document.querySelectorAll(".tipo_dados").forEach(function (elemento) {
        elemento.innerHTML = "Alterar";
      });
      document.getElementById("nome_atual").textContent = data.nome;
      document.getElementById("email_atual").textContent = data.email;

      document.getElementById("id_usuario").value = data.id; // tem que fazer a verificacao no php se é 1 e trazer Admin e 0 trazer Normal
      document.getElementById("novo_nome").value = data.nome;
      document.getElementById("novo_email").value = data.email;
    } else {
      document.querySelectorAll(".tipo_dados").forEach(function (elemento) {
        elemento.innerHTML = "Cadastrar";
      });
      document.querySelector(".signup-link").style.display = "block";
      document.getElementById("input_nova_senha").style.display = "block";
      document.getElementById("input_nova_senha2").style.display = "block";
      document.getElementById("nova_senha").required = true;
      document.getElementById("nova_senha2").required = true;
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
    var id = document.getElementById("id_usuario").value;
    var email = document.getElementById("novo_email").value;
    if (!id) {
      var senha = document.getElementById("nova_senha").value;
      var senha2 = document.getElementById("nova_senha2").value;
      if (senha !== senha2) {
        document
          .getElementById("nova_senha2")
          .setCustomValidity("As senhas não conferem!");
        return false;
      }
      var dados = {
        acao: "cadastrar_usuario",
        nome: nome,
        email: email,
        senha: senha,
        id: id
      };
    } else {
      var dados = { acao: "alterar_usuario", nome: nome, email: email, id: id };
    }

    var cadastrar = new AjaxRequest("pages/usuario.php");
    showPopup("load", "");
    cadastrar
      .send(dados)
      .then(function (response) {
        hidePopup();
        if (response.status == "success") {
          showPopup("sucess", response.message);
          if (id) {
            abrirPagina("home.html");
          } else {
            abrirPagina("login.html");
          }
        } else {
          showPopup("error", response.message);
        }
      })
      .catch(function (error) {
        showPopup("error", "Ocorreu um erro. Por favor, tente novamente.");
      });
  });

Array.from(document.querySelectorAll('input[type="email"]')).forEach(function (
  element
) {
  element.addEventListener("input", function () {
    this.value = this.value.toLowerCase();
  });
});

document.getElementById("novo_nome").addEventListener("input", function () {
  this.value = this.value.toUpperCase();
});
