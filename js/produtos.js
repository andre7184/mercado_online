// Cria uma nova instância da classe AjaxRequest
var ajaxRequest = new AjaxRequest("pages/produto.php");
showPopup("load", "");
// Envia a solicitação AJAX
ajaxRequest
  .send({ acao: "produtos" })
  .then(function (data) {
    hidePopup();
    if (data.produtos) {
      if (data.produtos && Array.isArray(data.produtos)) {
        if (data.produtos.length == 0) {
          document.getElementById("qtd_itens").innerHTML =
            "<br>Nenhum produto encontrado!";
        } else {
          document.getElementById("qtd_itens").innerHTML =
            "<br>" + data.produtos.length + " Itens";
        }
        preencherCardsProdutos(data.produtos);
      }
    } else {
      showPopup("error", "não foi possivel buscar produtos:");
    }
  })
  .catch(function (error) {
    console.error(error);
    showPopup("error", "Ocorreu um erro ao buscar os dados do usuário:");
  });
function adicionarAoCarrinho(id, nome, valor, qtd) {
  message = `
    <form id="cadastroQtdProduto" class="form">
    <p class="form-title"><b>Qtd do Produto</b><br><br>${nome}</p>
    <div class="input-container">
        <input type="number" min="1" max="${qtd}" placeholder="Quantidade" name="qtd_produto" id="qtd_produto" onchange="verificarValorMax(this)" value="1"/>
    </div>
    <input type="hidden" id="qtd_produto_estoque" value="${qtd}" />
    <input type="hidden" id="id_produto" value="${id}" />
    <input type="hidden" id="nome_produto" value="${nome}" />
    <input type="hidden" id="valor_produto" value="${valor}" />
    <button type="button" onclick="salvarProdutos()" class="submit">Confirmar</button>
    </form>
    `;
  showPopup("form", message);
}
function salvarProdutos() {
  hidePopup();
  var id = parseInt(document.getElementById("id_produto").value);
  var qtd_estoque = parseInt(
    document.getElementById("qtd_produto_estoque").value
  );
  var qtd = parseInt(document.getElementById("qtd_produto").value);
  var nome = document.getElementById("nome_produto").value;
  var valor = parseFloat(document.getElementById("valor_produto").value);
  // Verificar se o cliente está logado
  var cadastrar = new AjaxRequest("pages/carrinho.php");
  showPopup("load", "");
  cadastrar
    .send({
      acao: "adicionar_carrinho",
      qtd: qtd,
      id: id,
    })
    .then(function (response) {
      hidePopup();
      if (
        !response.naoautenticado &&
        response.status &&
        response.status == "success"
      ) {
        showPopup("sucess", response.message);
        abrirPagina("carrinho.html");
      } else {
        // Usuário não logado ou resposta invalida: salvar no localStorage
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let productIndex = cart.findIndex((item) => parseInt(item.id) === id);
        if (productIndex !== -1) {
          if (cart[productIndex].qtd + parseInt(qtd) <= parseInt(qtd_estoque)) {
            cart[productIndex].qtd += parseInt(qtd);
          }
        } else {
          cart.push({
            id: id,
            nome: nome,
            qtd_estoque: qtd_estoque,
            qtd: parseInt(qtd),
            valor: valor,
          });
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        showPopup("sucess", "Produto adicionado ao carrinho.");
        abrirPagina("carrinho.html");
      }
    })
    .catch(function (error) {
      showPopup("error", "Ocorreu um erro. Por favor, tente novamente.");
    });
}
function preencherCardsProdutos(dados) {
  var cardsContainer = document.getElementById("cards-container");
  for (var i = 0; i < dados.length; i++) {
    //var card = criarCard(dados[i]);
    var valor = parseFloat(dados[i].valor); // Certifique-se de que o valor é um número
    var qtd_estoque = parseInt(dados[i].qtd);
    var qtdNoCarrinho = getQuantidadeNoCarrinho(dados[i].id, qtd_estoque);
    var qtd = qtd_estoque - qtdNoCarrinho;
    var text_qtd_estoque = qtd == 1 ? "Último Disponível" : "";
    var desativado = qtd < 1 ? "desativado" : "";
    var card = `
      <div class="card ${desativado}">
      <div class="card-imagem">
        <div class="image">
          <img src="${dados[i].imagem}" alt="${dados[i].nome}" />
        </div>
      </div>
      <div class="productTitle">${dados[i].nome}</div>
      <div class="cost">${formatarValor(valor)}</div>
      <div class="qtd-estoque">${text_qtd_estoque}</div>
      <button class="addtocart" onclick="adicionarAoCarrinho('${
        dados[i].id
      }','${dados[i].nome}','${
      dados[i].valor
    }','${qtd}')">Adicionar ao Carrinho</button>
    </div>
  `;
    cardsContainer.insertAdjacentHTML("beforeend", card);
  }
}

function getQuantidadeNoCarrinho(id, qtd_estoque) {
  var carrinho = JSON.parse(localStorage.getItem("cart"));
  if (carrinho === null) {
    return 0; // Retorna 0 se o carrinho estiver vazio
  }
  for (var i = 0; i < carrinho.length; i++) {
    if (carrinho[i].id === id) {
      if (carrinho[i].qtd > qtd_estoque) {
        carrinho[i].qtd = qtd_estoque;
        if (qtd_estoque <= 0) {
          carrinho.splice(i, 1); // Remove o produto do carrinho
        }
        localStorage.setItem("cart", JSON.stringify(carrinho)); // Atualiza o carrinho no localStorage
      }
      return carrinho[i].qtd;
    }
  }
  return 0; // Retorna 0 se o produto não estiver no carrinho
}


function formatarValor(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
