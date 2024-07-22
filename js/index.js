var isMainPage = true;
let dadosUser = {};
document.addEventListener("DOMContentLoaded", function () {
  // Cria uma nova instância da classe AjaxRequest
  var pagina_atual = localStorage.getItem("pagina_atual");
  verificarLogin(pagina_atual);
});
function abrirPagina(pagina) {
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
  var ajaxRequest = new AjaxRequest("pages/verifica_login.php");
  ajaxRequest
    .send({ action: "logout" })
    .then(function (response) {
      if (response.status === "logged_out") {
        localStorage.setItem("pagina_atual", "home.html");
        window.location.href = "login.html";
      }
    })
    .catch(function (error) {
      alert("Erro ao fazer logout. Por favor, tente novamente.");
    });
}
function showPopup(type, message) {
  var popup = document.querySelector(".popup-message");
  popup.classList.remove("agreen", "ared", "aorange", "ablue", "aload");
  if (type == "sucess") {
    document.querySelector(".popup-icon img").src = "icons/sucess.svg";
    document.querySelector(".popup-message").classList.add("agreen");
  } else if (type == "error") {
    document.querySelector(".popup-icon img").src = "icons/error.svg";
    document.querySelector(".popup-message").classList.add("ared");
  } else if (type == "alert") {
    document.querySelector(".popup-icon img").src = "icons/alert.svg";
    document.querySelector(".popup-message").classList.add("aorange");
  } else if (type == "load") {
    document.querySelector(".popup-icon img").src = "icons/loading.svg";
    document.querySelector(".popup-message").classList.add("aload");
  } else {
    document.querySelector(".popup-icon img").src = "icons/infor.svg";
    document.querySelector(".popup-message").classList.add("ablue");
  }
  if (type == "load") {
    document.querySelector(".message").innerHTML =
      '<div style="display: flex; align-items: center;"><span>Processando..</span><div class="loading"></div></div>';
    document.querySelector(".close-icon").style.display = "none"; // Esconde o botão de fechar
  } else {
    document.querySelector(".message").textContent = message;
    document.querySelector(".close-icon").style.display = "block";
  }
  document.querySelector(".popup-message").style.display = "flex";
  document.querySelector(".overlay").style.display = "block";
}

function hidePopup() {
  document.querySelector(".popup-message").style.display = "none";
  document.querySelector(".overlay").style.display = "none";
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
      if (!response.logado) {
        pagina_atual = "login.html";
      }
      if (response.user) {
        dadosUser = response.user;
        var menu_usuario = "";
        if (dadosUser.email_user)
          menu_usuario += `<p id="email_usuario">${dadosUser.email_user}</p>`;
        if (dadosUser.admin_user)
          menu_usuario += `<p id="tipo_usuario">${dadosUser.admin_user}</p>`;
        menu_usuario += `<a href="#" onclick="abrirPagina('editar_dados_usuario.html'); return false;">Alterar Dados</a>
          <a href="#" onclick="abrirPagina('alterar_senha.html'); return false;">Alterar Senha</a>
          <a href="#" onclick="logout(); return false;">Sair</a>
        `;
        document.getElementById("userDropdown").innerHTML = menu_usuario;
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
  var dropdown = document.getElementById("userDropdown");
  var icon = document.querySelector(".img-account");

  // Obtenha a posição do ícone
  var iconRect = icon.getBoundingClientRect();
  // Posicione o menu suspenso abaixo do ícone
  dropdown.style.top = iconRect.bottom + window.scrollY + "px";
  dropdown.style.left = iconRect.left + window.scrollX - 100 + "px";

  // Mostre o menu suspenso
  dropdown.classList.toggle("show");
}
