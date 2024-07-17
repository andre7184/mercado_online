pagina_atual = "home.html";
$(document).ready(function () {
  // Cria uma nova instância da classe AjaxRequest
  var ajaxRequest = new AjaxRequest("pages/verifica_login.php");
  // Envia a requisição
  ajaxRequest
    .send()
    .then(function (response) {
      if (response.login !== "logado") {
        window.location.href = "login.html";
      } else {
        // Se o usuário for um administrador, mostra o menu de administrador
        if (response.admin === "sim") {
          document.getElementById("menu").innerHTML = `
                <a class="menu-link" href="lista_produtos.html">Produtos</a>
                <a class="menu-link" href="historico_vendas.html">Histórico de Vendas</a>
                <a class="menu-link" href="usuarios.html">Usuários</a>
                <a class="menu-link" href="dados.html">Meus Dados</a>
                <a href="#" onclick="logout(); return false;">Sair</a>
            `;
        } else {
          // Se o usuário não for um administrador, mostra o menu comum
          document.getElementById("menu").innerHTML = `
                <a class="menu-link" href="produtos.html">Produtos Disponíveis</a>
                <a class="menu-link" href="historico_compras.html">Histórico de Compras</a>
                <a class="menu-link" href="carrinho.html">Carrinho</a>
                <a class="menu-link" href="dados.html">Meus Dados</a>
                <a href="#" onclick="logout(); return false;">Sair</a>
            `;
        }
        $(".menu-link").click(function (e) {
          e.preventDefault();
          pagina_atual = $(this).attr("href");
          $("#conteudo").load(pagina_atual);
        });
        $("#conteudo").load(pagina_atual);
      }
    })
    .catch(function (error) {
      console.error("Erro na requisição AJAX:", error);
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
