$("#loginForm").submit(function (event) {
  event.preventDefault();
  var email = $("#email").val();
  var senha = $("#senha").val();
  var logar = new AjaxRequest("pages/logar.php");

  // Envia a solicitação AJAX
  logar
    .send({ email: email, senha: senha })
    .then(function (response) {
      // Manipula a resposta em caso de sucesso
      if (response.success) {
        window.location.href = "index.html";
      } else {
        $(".popup").show().find(".message").text(response.message);
        $(".popup").removeClass("sucess-popup").addClass("error-popup");
        $(".popup-icon img").attr("src", "icons/sucess.svg");
      }
    })
    .catch(function (error) {
      // Manipula o erro
      $(".popup")
        .show()
        .find(".message")
        .text(
          "Ocorreu um erro ao tentar fazer login. Por favor, tente novamente."
        );
      $(".popup").removeClass("sucess-popup").addClass("error-popup");
      $(".popup-icon img").attr("src", "icons/error.svg");
    });
});

$("#cadastroForm").submit(function (event) {
  event.preventDefault();
  var nome = $("#nome").val();
  var email = $("#novo-email").val();
  var senha = $("#nova_senha").val();
  if ($("#tipo_admin").is(":checked")) {
    var password_admin = $("#password_admin").val();
    tipo_admin = true;
  } else {
    password_admin = "";
    tipo_admin = false;
  }
  var cadastrar = new AjaxRequest("pages/cadastrar.php");

  cadastrar
    .send({
      nome: nome,
      email: email,
      senha: senha,
      tipo_admin: tipo_admin,
      password_admin: password_admin,
    })
    .then(function (response) {
      // Manipula a resposta em caso de sucesso
      if (response.status == "success") {
        $(".popup").show().find(".message").text(response.message);
        $(".popup").removeClass("error-popup").addClass("sucess-popup");
        $(".popup-icon img").attr("src", "icons/sucess.svg");
        $("#login, #cadastro").toggle();
      } else {
        $(".popup").show().find(".message").text(response.message);
        $(".popup").removeClass("sucess-popup").addClass("error-popup");
        $(".popup-icon img").attr("src", "icons/error.svg");
      }
    })
    .catch(function (error) {
      // Manipula o erro
      $(".popup")
        .show()
        .find(".message")
        .text("Ocorreu um erro. Por favor, tente novamente.");
      $(".popup").removeClass("sucess-popup").addClass("error-popup");
      $(".popup-icon img").attr("src", "icons/error.svg");
    });
});

$("#mostrarCadastro, #mostrarLogin").click(function (event) {
  event.preventDefault();
  $("#login, #cadastro").toggle();
});
$(".close-svg").click(function () {
  $(".popup").hide();
});
$("#tipo_admin").click(function () {
  $("#input_admin").toggle();
});
$('input[type="email"]').on("input", function () {
  this.value = this.value.toLowerCase();
});
$("#nome").on("input", function () {
  this.value = this.value.toUpperCase();
});
