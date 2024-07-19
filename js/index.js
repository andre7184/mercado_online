var isMainPage = true;
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
                <a class="menu-link" href="dados_usuario.html">Meus Dados</a>
                <a href="#" onclick="logout(); return false;">Sair</a>
            `;
        } else {
          // Se o usuário não for um administrador, mostra o menu comum
          document.getElementById("menu").innerHTML = `
                <a class="menu-link" href="produtos.html">Produtos Disponíveis</a>
                <a class="menu-link" href="historico_compras.html">Histórico de Compras</a>
                <a class="menu-link" href="carrinho.html">Carrinho</a>
                <a class="menu-link" href="dados_usuario.html">Meus Dados</a>
                <a href="#" onclick="logout(); return false;">Sair</a>
            `;
        }
        $(".menu-link").click(function (e) {
          e.preventDefault();
          $(".menu-link").removeClass("active"); // Remove a classe 'active' de todos os links
          $(this).addClass("active"); // Adiciona a classe 'active' ao link clicado
          pagina_atual = $(this).attr("href");
          localStorage.setItem("pagina_atual", pagina_atual); // Armazena a página atual no localStorage
          $("#conteudo").load(pagina_atual);
        });
        var pagina_atual = localStorage.getItem("pagina_atual"); // Obtém a página atual do localStorage
        if (pagina_atual) {
          $('a[href="' + pagina_atual + '"]').addClass("active");
          $("#conteudo").load(pagina_atual);
        } else {
          $("#conteudo").load("home.html");
        }
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
        localStorage.setItem("pagina_atual", "home.html");
        window.location.href = "login.html"; // Redireciona o usuário para a página de login após o logout
      }
    })
    .catch(function (error) {
      alert("Erro ao fazer logout. Por favor, tente novamente.");
    });
}
