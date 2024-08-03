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
        localStorage.setItem("cart", JSON.stringify(data.carrinho));
        document.querySelector(".tex-qtd-itens").innerHTML =
          "<br>" + data.carrinho.length + " Itens";
      }
    } else {
      // Se não estiver autenticado, chama o carrinho local para preencher o carrinho com dados
      syncronizeCarrinhoLocal();
    }
  })
  .catch(function (error) {
    console.error(error);
    showPopup("error", "Ocorreu um erro ao buscar os dados do carrinho:");
  });

function syncronizeCarrinhoLocal() {
  console.log("sincronizando carrinho local");
  let localCart = JSON.parse(localStorage.getItem("cart")) || [];
  if (localCart.length > 0) {
    document.querySelector(".tex-qtd-itens").innerHTML =
      "<br>" + localCart.length + " Itens";
    console.log(localCart);
    preencherCarrinho(localCart);
  } else {
    document.querySelector(".tex-qtd-itens").innerHTML = "<br>Carrinho vazio!";
  }
}
function verificaLogin() {
  var syncRequest = new AjaxRequest("pages/carrinho.php");
  syncRequest.send({ acao: "verificar_logado" }).then(function (data) {
    hidePopup();
    if (data.naoautenticado) {
      showPopup("error", "Você precisa estar logado para Finalizar a Compra:");
      abrirPagina("login.html");
    } else {
      return true;
    }
  });
}
// Função para sincronizar o carrinho local com o servidor
function syncLocalCartToServer(localCart) {
  if (!localCart) {
    localCart = JSON.parse(localStorage.getItem("cart")) || [];
    localStorage.removeItem("cart");
    var forma_pagamento = document.getElementById("forma_pagamento").value;
    var dataform = {
      acao: "sincronizar_carrinho",
      carrinho: localCart,
      forma_pagamento: forma_pagamento,
      finalizado: true,
    };
  } else {
    var dataform = {
      acao: "sincronizar_carrinho",
      carrinho: localCart,
    };
  }
  console.log("sincronizando carrinho remoto");
  showPopup("load", "Sincronizando Carrinho");
  var syncRequest = new AjaxRequest("pages/carrinho.php");
  syncRequest
    .send(dataform)
    .then(function (data) {
      hidePopup();
      if (!data.naoautenticado && data.carrinho) {
        if (data.carrinho.length > 0) {
          //localStorage.removeItem("cart"); // Limpa o localStorage após a sincronização
          preencherCarrinho(data.carrinho);
        } else {
          syncronizeCarrinhoLocal();
        }
      } else {
        syncronizeCarrinhoLocal();
      }
    })
    .catch(function (error) {
      console.error(error);
      showPopup("error", "Ocorreu um erro ao sincronizar o carrinho.");
    });
}
var car = {};
function preencherCarrinho(carrinho) {
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
    const qtd_estoque = parseInt(item.qtd_estoque);
    const totalProduto = qtd * valor;
    totalCarrinho += totalProduto;
    totalItens += qtd;

    const itemRow = document.createElement("tr");
    itemRow.innerHTML = `
        <td data-label="Nome">${item.nome}</td>
        <td data-label="Qtd">
          <input type="number" value="${qtd}" min="1" max="${qtd_estoque}" data-index="${index}" onchange="verificarValor(this)" class="quantidade-input">
        </td>
        <td data-label="Valor">${formatarValor(valor)}</td>
        <td data-label="Total">${formatarValor(totalProduto)}</td>
        <td data-label="Opções">
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
  car[index].qtd = novaQuantidade;
  // Atualiza o localStorage
  localStorage.setItem("cart", JSON.stringify(car));
  // Recalcula e atualiza o carrinho
  preencherCarrinho(car);
  syncLocalCartToServer(car);
}

function removerItem(index) {
  // Remove o item do carrinho
  car.splice(index, 1);
  // Atualiza o localStorage
  localStorage.setItem("cart", JSON.stringify(car));
  // Recalcula e atualiza o carrinho
  preencherCarrinho(car);
  syncLocalCartToServer(car);
}

function finalizarCompra() {
  var syncRequest = new AjaxRequest("pages/carrinho.php");
  syncRequest.send({ acao: "verificar_logado" }).then(function (data) {
    hidePopup();
    if (data.naoautenticado) {
      showPopup("error", "Você precisa estar logado para Finalizar a Compra:");
      dadosUser['acao_login_pg'] = 'carrinho.html';
      abrirPagina("login.html");
    } else {
      var valor_total = document.getElementById("cart-total").innerHTML;
      message = `
      <form id="cadastroVendas" class="form">
      <p class="form-title"><b>Finalizar Compra</b><br><br>${valor_total}<br><br></p>
      <div class="input-container">
        <label for="pagamento">Escolha a forma de pagamento:</label>
        <select id="forma_pagamento" name="forma_pagamento">
            <option value="cartao_credito">Cartão de Crédito</option>
            <option value="cartao_debito">Cartão de Débito</option>
            <option value="boleto">Boleto</option>
            <option value="pix">PIX</option>
            <option selected value="dinheiro">Dinheiro</option>
        </select>
      </div>
      <input type="hidden" id="finalizado" value=true />
      <button type="button" onclick="syncLocalCartToServer(false)" class="submit">Confirmar</button>
      </form>
      `;
      showPopup("form", message);
    }
  });
}
