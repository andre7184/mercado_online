var isMainPage = true;
let dadosUser = {};
let atributoshtml = {};
document.addEventListener("DOMContentLoaded", function () {
  // Cria uma nova instância da classe AjaxRequest
  var pagina_atual = localStorage.getItem("pagina_atual");
  verificarLogin(pagina_atual);
});
document.querySelectorAll("input[max]").forEach(function (input) {
  input.addEventListener("change", function (e) {
    verificarValorMax(e.target);
  });
});

function verificarValorMax(input) {
  var max = parseInt(input.max);
  var min = parseInt(input.min);
  if (input.value > max) {
    input.value = max;
  }
  if (input.value < min) {
    input.value = min;
  }
}
function abrirPagina(pagina) {
  var checkbox = document.getElementById("checkbox-menu");
  // Verifica se o checkbox está marcado
  if (checkbox.checked) {
    // Desmarca o checkbox
    checkbox.checked = false;
  }
  fecharMenuDropdown();
  pagina = salvaArgsHtml(pagina);
  localStorage.setItem("pagina_atual", pagina);
  var link = document.querySelector('a[href="' + pagina + '"]');
  if (link) {
    link.classList.add("active");
  }
  fetch(pagina)
    .then((response) => response.text())
    .then((data) => {
      let parser = new DOMParser();
      let doc = parser.parseFromString(data, "text/html");
      // Remove os scripts da string data
      let dataWithoutScripts = data.replace(
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        ""
      );
      // Adiciona o novo conteúdo
      document.querySelector("#conteudo").innerHTML = dataWithoutScripts;
      // Adiciona os novos scripts
      Array.from(doc.scripts).forEach((oldScript) => {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach((attr) =>
          newScript.setAttribute(attr.name, attr.value)
        );
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        document.querySelector("#conteudo").appendChild(newScript);
      });
    })
    .catch((error) => console.error("Erro:", error));
}

function logout() {
  var ajaxRequest = new AjaxRequest("pages/usuario.php");
  ajaxRequest
    .send({ acao: "logout" })
    .then(function (response) {
      if (response.status === "logged_out") {
        localStorage.setItem("pagina_atual", "home.html");
        window.location.href = "index.html";
      }
    })
    .catch(function (error) {
      alert("Erro ao fazer logout. Por favor, tente novamente.");
    });
}
function showPopup(type, message) {
  // Remove o elemento anterior, se existir
  var oldPopup = document.querySelector(".popup-message");
  if (oldPopup) oldPopup.remove();

  // Cria os elementos
  var popup = document.createElement("div");
  var popupIcon = document.createElement("div");
  var img = document.createElement("img");
  var msg = document.createElement("div");
  var closeIcon = document.createElement("div");
  var btn = document.createElement("button");

  // Define as classes e atributos
  popup.className = "popup-message";
  popupIcon.className = "popup-icon";
  img.src = "icons/" + type + ".svg";
  msg.className = "message";
  closeIcon.className = "close-icon";
  btn.setAttribute("onclick", "hidePopup()");
  btn.textContent = "X";

  // Adiciona os elementos ao DOM
  closeIcon.appendChild(btn);
  popupIcon.appendChild(img);
  popup.appendChild(popupIcon);
  popup.appendChild(msg);
  popup.appendChild(closeIcon);
  document.body.appendChild(popup);

  // Adiciona a classe correta ao popup
  if (type == "sucess") {
    popup.classList.add("agreen");
  } else if (type == "error") {
    popup.classList.add("ared");
  } else if (type == "alert") {
    popup.classList.add("aorange");
  } else if (type == "load") {
    popup.classList.add("aload");
  } else if (type == "form") {
    popup.classList.add("question");
  } else {
    popup.classList.add("ablue");
  }

  // Define a mensagem correta
  if (type == "load") {
    // var overlay = document.createElement("div");
    // document.body.appendChild(overlay);
    // overlay.classList.add("overlay");
    // overlay.style.display = "block";
    if (!message) {
      message = "Carregando...";
    }
    msg.innerHTML =
      '<div style="display: flex; align-items: center;"><span>' +
      message +
      '..</span><div class="loading"></div></div>';
    closeIcon.style.display = "none"; // Esconde o botão de fechar
  } else if (type == "form") {
    // inserir dentro da variavel message um input com o texto de quantidade e um botão de confirmar
    msg.innerHTML = message;
    closeIcon.style.display = "block";
  } else {
    msg.textContent = message;
    closeIcon.style.display = "block";
  }

  // Mostra o popup
  popup.style.display = "flex";
}

function hidePopup() {
  document.querySelector(".popup-message").style.display = "none";
  // document.querySelector(".overlay").style.display = "none";
}

function verificarLogin(pagina_atual) {
  var ajaxRequest = new AjaxRequest("pages/verifica_login.php");
  // Envia a requisição
  ajaxRequest
    .send()
    .then(function (response) {
      if (response.menu) {
        document.getElementById("menu").innerHTML = response.menu;
      }
      if (response.menu_dropdown) {
        document.getElementById("dropdown-content").innerHTML =
          response.menu_dropdown;
      }
      if (response.logado) {
        document.getElementById("user-icon").style.display = "block";
      } else {
        document.getElementById("user-icon").style.display = "none";
      }
      var carrinho_local = JSON.parse(localStorage.getItem("cart")) || [];
      var quantidade_carrinho = carrinho_local.length;
      console.log(quantidade_carrinho);
      if (
        quantidade_carrinho > 0 &&
        document.querySelector('.menu-link[href="carrinho.html"]') != null
      ) {
        document.querySelector('.menu-link[href="carrinho.html"]').innerHTML +=
          '<span class="carrinho-quantidade">(0' +
          quantidade_carrinho +
          ")</span>";
      }
      var menuLinks = document.querySelectorAll(".menu-link");
      menuLinks.forEach(function (link) {
        link.addEventListener("click", function (e) {
          e.preventDefault();
          menuLinks.forEach(function (lnk) {
            lnk.classList.remove("active");
          });
          var pagina = this.getAttribute("href");
          abrirPagina(pagina);
        });
      });
      if (!pagina_atual) {
        var url = new URL(window.location.href);
        var pg = url.searchParams.get("pg");
        if (pg) {
          pagina_atual = pg;
        } else {
          pagina_atual = "home.html";
        }
      }
      abrirPagina(pagina_atual);
    })
    .catch(function (error) {
      console.error("Erro na requisição AJAX:", error);
    });
}

function menuDropdown() {
  var dropdownContent = document.querySelector(".dropdown-content");
  if (dropdownContent.style.display == "none") {
    dropdownContent.style.display = "block";
    document.querySelector(".img-overlap").classList.add("dropdown_ativo");
  } else {
    dropdownContent.style.display = "none";
    document.querySelector(".img-overlap").classList.remove("dropdown_ativo");
  }
}

function fecharMenuDropdown() {
  document.querySelector(".dropdown-content").style.display = "none";
  document.querySelector(".img-overlap").classList.remove("dropdown_ativo");
}

function preencherTabela(dados) {
  var tabela = document.querySelector("table");
  var corpoTabela = tabela.querySelector("tbody");
  var cabecalhoTabela = tabela.querySelector("thead tr");
  cabecalhoTabela.innerHTML = "";
  corpoTabela.innerHTML = "";
  dados.forEach(function (itens, index) {
    var linha = document.createElement("tr");
    for (var prop in itens) {
      if (index === 0) {
        var celulaCabecalho = document.createElement("th");
        celulaCabecalho.innerText = prop;
        cabecalhoTabela.appendChild(celulaCabecalho);
      }
      var celula = document.createElement("td");
      celula.innerHTML = itens[prop];
      celula.setAttribute("data-label", prop);
      linha.appendChild(celula);
    }
    corpoTabela.appendChild(linha);
  });
}

function salvaArgsHtml(pagina) {
  if (pagina.indexOf("?") > 0) {
    var pgs = pagina.split("?");
    pagina = pgs[0];
    var argumentos = {};
    var args = pgs[1].split("&");
    for (var i = 0; i < args.length; i++) {
      var arg = args[i].split("=");
      argumentos[arg[0]] = arg[1];
    }
    atributoshtml[pagina.split(".")[0]] = argumentos;
  } else {
    atributoshtml[pagina.split(".")[0]] = {};
  }
  console.log(atributoshtml);
  return pagina;
}
//em relacao a function acima, preciso agora criar uma função que retorna esses argumentos que foram salvos na variavel atributoshtml
function retornaArgsHtml(nome_pagina, argumento) {
  if (nome_pagina.indexOf(".") > 0) {
    nome_pagina = pagina.split(".")[0];
  }
  if (
    argumento &&
    nome_pagina &&
    atributoshtml &&
    atributoshtml[nome_pagina] &&
    argumento in atributoshtml[nome_pagina]
  ) {
    console.log("id:" + atributoshtml[nome_pagina][argumento]);
    return atributoshtml[nome_pagina][argumento];
  }
  return false;
}

function formatarValor(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
