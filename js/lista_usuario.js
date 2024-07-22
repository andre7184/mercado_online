// Cria uma nova instância da classe AjaxRequest
var ajaxRequest = new AjaxRequest("pages/verifica_conteudo.php");
showPopup("load", "");
// Envia a solicitação AJAX
ajaxRequest
  .send({ acao: "lista_usuarios" })
  .then(function (data) {
    hidePopup();
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
    } else {
      document.getElementById("tipo_transacao").textContent = "Compras";
    }
  })
  .catch(function (error) {
    showPopup("error", "Ocorreu um erro ao buscar os dados do usuário:");
  });
