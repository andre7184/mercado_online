// Cria uma nova instância da classe AjaxRequest
var ajaxRequest = new AjaxRequest("pages/carrinho.php");
showPopup("load", "");
// Envia a solicitação AJAX
ajaxRequest
  .send({ acao: "carrinho" })
  .then(function (data) {
    hidePopup();
    if (!data.naoautenticado && data.carrinho) {
      if (data.carrinho.length == 0) {
        let localCart = JSON.parse(localStorage.getItem("cart")) || [];
        if (localCart.length > 0) {
          syncLocalCartToServer(localCart);
        } else {
          document.querySelector(".tex-qtd-itens").innerHTML =
            "<br>Carrinho vazio!";
        }
      } else {
        preencherCarrinho(data.carrinho);
        document.querySelector(".tex-qtd-itens").innerHTML =
          "<br>" + data.carrinho.length + " Itens";
      }
    } else {
      // Se não estiver autenticado, chama o carrinho local para preencher o carrinho com dados
      let localCart = JSON.parse(localStorage.getItem("cart")) || [];
      if (localCart.length > 0) {
        document.querySelector(".tex-qtd-itens").innerHTML =
          "<br>" + localCart.length + " Itens";
        preencherCarrinho(localCart);
      } else {
        document.querySelector(".tex-qtd-itens").innerHTML =
          "<br>Carrinho vazio!";
      }
    }
  })
  .catch(function (error) {
    console.error(error);
    showPopup("error", "Ocorreu um erro ao buscar os dados do usuário:");
  });

// Função para sincronizar o carrinho local com o servidor
function syncLocalCartToServer(localCart) {
  var syncRequest = new AjaxRequest("pages/carrinho.php");
  syncRequest
    .send({
      acao: "sincronizar_carrinho",
      carrinho: localCart,
    })
    .then(function (response) {
      if (response.status) {
        if (response.status === "success") {
          localStorage.removeItem("cart"); // Limpa o localStorage após a sincronização
          showPopup("sucess", "Carrinho sincronizado com sucesso.");
        } else {
          showPopup("error", "Erro ao sincronizar o carrinho.");
        }
      } else {
        showPopup("error", "não foi possivel buscar produtos:");
      }
    })
    .catch(function (error) {
      console.error(error);
      showPopup("error", "Ocorreu um erro ao sincronizar o carrinho.");
    });
}
var car = {};
function preencherCarrinho(carrinho) {
   console.log(carrinho)
  car = carrinho;
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  const cartQuantityElement = document.querySelector(".tex-qtd-itens");

  cartItemsContainer.innerHTML = ""; // Limpa os itens existentes

  let totalCarrinho = 0;
  let totalItens = 0;

  car.forEach((item, index) => {
    const valor = parseFloat(item.valor);
    const qtd = parseInt(item.qtd);
    const totalProduto = qtd * valor;
    totalCarrinho += totalProduto;
    totalItens += qtd;

    const itemRow = document.createElement("tr");
    itemRow.innerHTML = `
        <td>${item.nome}</td>
        <td>
          <input type="number" value="${qtd}" min="1" data-index="${index}" class="quantidade-input">
        </td>
        <td>${formatarValor(valor)}</td>
        <td>${formatarValor(totalProduto)}</td>
        <td>
          <button class="remove-button" data-index="${index}">Remover</button>
        </td>
      `;
    cartItemsContainer.appendChild(itemRow);
  });

  cartTotalElement.textContent = formatarValor(totalCarrinho);
  cartQuantityElement.textContent = `(${totalItens} itens)`;

  // Adiciona eventos para alterar a quantidade e remover itens
  document.querySelectorAll(".quantidade-input").forEach((input) => {
    input.addEventListener("change", (event) => {
      const index = event.target.getAttribute("data-index");
      const novaQuantidade = parseInt(event.target.value);
      atualizarQuantidade(index, novaQuantidade);
    });
  });

  document.querySelectorAll(".remove-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = event.target.getAttribute("data-index");
      removerItem(index);
    });
  });
}

function atualizarQuantidade(index, novaQuantidade) {
  // Atualiza a quantidade do item no carrinho
  car[index].quantidade = novaQuantidade;
  // Atualiza o localStorage
  localStorage.setItem("cart", JSON.stringify(car));
  // Recalcula e atualiza o carrinho
  preencherCarrinho(car);
}

function removerItem(index) {
  // Remove o item do carrinho
  car.splice(index, 1);
  // Atualiza o localStorage
  localStorage.setItem("cart", JSON.stringify(car));
  // Recalcula e atualiza o carrinho
  preencherCarrinho(car);
}