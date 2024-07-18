$(document).ready(function () {
  // Cria uma nova instância da classe AjaxRequest
  var ajaxRequest = new AjaxRequest("pages/verifica_conteudo.php");

  // Envia a solicitação AJAX
  ajaxRequest
    .send({ pagina: 'dados_do_usuario' })
    .then(function (data) {
      if (data.naoautenticado) {
        window.location.href = "index.html";
      }
      // Preenche os dados do usuário na página
      document.getElementById("nome").textContent = data.nome;
      document.getElementById("email").textContent = data.email;
      document.getElementById("tipo_admin").textContent = data.admin; // tem que fazer a verificacao no php se é 1 e trazer Admin e 0 trazer Normal
      document.getElementById("quantidade").textContent = data.qtd_historico; // tem que acessar a tabela transacoes e retornar a quantidade, sendo que se for admin, retorna de todos, se nao, busca pelo usuario atual

      // Configura o texto e o link do botão "Abrir" com base no tipo de usuário
      if (data.admin === "Admin") {
        document.getElementById("tipo_transacao").textContent = "Vendas";
        document.getElementById("historico_link").href =
          "historico_vendas.html";
      } else {
        document.getElementById("tipo_transacao").textContent = "Compras";
        document.getElementById("historico_link").href =
          "historico_compras.html";
      }
      $("#historico_link").click(function (e) {
        e.preventDefault();
        pagina_atual = $(this).attr("href");
        localStorage.setItem('pagina_atual', pagina_atual); // Armazena a página atual no localStorage
        $("#conteudo").load(pagina_atual);
      });
    })
    .catch(function (error) {
      console.error("Ocorreu um erro ao buscar os dados do usuário:", error);
    });
});
function logout() {
  var ajaxRequest = new AjaxRequest("pages/verifica_login.php");
  ajaxRequest
    .send({ action: "logout" })
    .then(function (response) {
      if (response.status === "logged_out") {
        window.location.href = "login.html"; // Redireciona o usuário para a página de login após o logout
      }
    })
    .catch(function (error) {
      alert("Erro ao fazer logout. Por favor, tente novamente.");
    });
}
