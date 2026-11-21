/* Palavra, Mesa e Missão — assistente de tradução por página
 * Não altera o texto original e não utiliza a antiga widget descontinuada.
 * A tradução automática é aberta pelo serviço externo do Google Tradutor.
 * Traduções editoriais existentes têm prioridade.
 */
(function () {
  "use strict";
  if (window.__PMM_TRADUTOR_ATIVO__) return;
  window.__PMM_TRADUTOR_ATIVO__ = true;

  var ID = "pmm-tradutor";
  var STORAGE = "pmm-idioma-preferido";
  var idiomaDocumento = (document.documentElement.lang || "pt-BR").toLowerCase();
  var ingles = idiomaDocumento.indexOf("en") === 0;
  var idiomaOriginal = ingles ? "en" : "pt";
  var idiomas = [
    ["pt", "Português"], ["en", "English"], ["es", "Español"],
    ["fr", "Français"], ["de", "Deutsch"], ["it", "Italiano"],
    ["ar", "العربية"], ["ja", "日本語"]
  ];
  var texto = ingles
    ? {button:"Translate", title:"Translate this page", choose:"Choose a language", notice:"Automatic translation is provided by an external service and may contain errors, especially in biblical and theological terminology.", action:"Open translation", origin:"Original page", advice:"On Chrome for Android, you can also use Menu (⋮) → Translate.", checked:"Editorial translation (when available)"}
    : {button:"Traduzir", title:"Traduzir esta página", choose:"Escolha o idioma", notice:"A tradução automática é oferecida por um serviço externo e pode conter erros, especialmente na terminologia bíblica e teológica.", action:"Abrir tradução", origin:"Página original", advice:"No Chrome para Android, você também pode usar o menu (⋮) → Traduzir.", checked:"Tradução editorial (quando disponível)"};

  function alternativo(idioma) {
    var links = document.querySelectorAll('link[rel="alternate"][hreflang]');
    for (var i = 0; i < links.length; i++) {
      if ((links[i].getAttribute("hreflang") || "").toLowerCase().indexOf(idioma) === 0)
        return links[i].href;
    }
    return null;
  }

  function originalURL() {
    return alternativo("pt") || window.location.href;
  }

  function urlTraduzida(idioma) {
    // O serviço externo é responsável pela tradução e pelos links internos.
    return "https://translate.google.com/translate?sl=auto&tl="
      + encodeURIComponent(idioma) + "&u=" + encodeURIComponent(originalURL());
  }

  function salvar(idioma) {
    try { localStorage.setItem(STORAGE, idioma); } catch (_) {}
  }

  function guardado() {
    try { return localStorage.getItem(STORAGE) || idiomaOriginal; }
    catch (_) { return idiomaOriginal; }
  }

  function navegar(idioma) {
    salvar(idioma);
    var destino;
    if (idioma === "pt") destino = alternativo("pt") || (idiomaOriginal === "pt" ? location.href : originalURL());
    else if (idioma === "en" && alternativo("en")) destino = alternativo("en");
    else if (idioma === idiomaOriginal) destino = location.href;
    else destino = urlTraduzida(idioma);
    if (destino !== location.href) window.location.assign(destino);
  }

  function iniciar() {
    if (!document.body || document.getElementById(ID)) return;

    var estilo = document.createElement("style");
    estilo.id = ID + "-css";
    estilo.textContent =
      "#"+ID+"{position:fixed;right:max(12px,env(safe-area-inset-right));bottom:max(16px,env(safe-area-inset-bottom));z-index:2147483000;font:15px/1.45 system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1c3528}" +
      "#"+ID+" *{box-sizing:border-box}" +
      "#"+ID+" button,#"+ID+" select{font:inherit}" +
      "#"+ID+" .pmm-abrir{display:flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:10px 17px;border-radius:999px;border:2px solid #c99b38;background:#073b2b;color:white;font-weight:700;box-shadow:0 5px 16px #0004;cursor:pointer}" +
      "#"+ID+" .pmm-abrir:focus-visible,#"+ID+" select:focus-visible,#"+ID+" .pmm-ir:focus-visible{outline:3px solid #c99b38;outline-offset:3px}" +
      "#"+ID+" .pmm-painel{position:absolute;right:0;bottom:58px;width:min(330px,calc(100vw - 24px));max-height:calc(100dvh - 100px);overflow:auto;background:#fffdf8;border:2px solid #c99b38;border-radius:13px;padding:18px;box-shadow:0 12px 35px #0004}" +
      "#"+ID+" .pmm-painel[hidden]{display:none!important}" +
      "#"+ID+" h2{font:bold 18px/1.3 system-ui,sans-serif;color:#073b2b;margin:0 0 12px}" +
      "#"+ID+" label{display:block;font-weight:700;margin-bottom:6px;color:#073b2b}" +
      "#"+ID+" select{background:white;width:100%;min-height:44px;border:1px solid #9a9a91;border-radius:7px;padding:8px;color:#153427}" +
      "#"+ID+" .pmm-ir{display:block;width:100%;min-height:44px;background:#073b2b;color:white;border:1px solid #c99b38;border-radius:7px;font-weight:bold;margin-top:10px;cursor:pointer}" +
      "#"+ID+" .pmm-nota{font:13px/1.5 system-ui,sans-serif;color:#4f5b51;margin:12px 0 0}" +
      "#"+ID+" .pmm-original{display:block;margin-top:10px;color:#0d4f3b;text-decoration:underline}" +
      "@media print{#"+ID+"{display:none!important}}";
    document.head.appendChild(estilo);

    var caixa = document.createElement("aside");
    caixa.id = ID;
    caixa.setAttribute("aria-label", texto.title);
    var painelId = ID + "-painel";

    var abrir = document.createElement("button");
    abrir.className = "pmm-abrir";
    abrir.type = "button";
    abrir.setAttribute("aria-controls", painelId);
    abrir.setAttribute("aria-expanded", "false");
    abrir.setAttribute("aria-label", texto.title);
    abrir.textContent = "🌐 " + texto.button;

    var painel = document.createElement("div");
    painel.className = "pmm-painel";
    painel.id = painelId;
    painel.hidden = true;
    var titulo = document.createElement("h2");
    titulo.textContent = texto.title;
    var rotulo = document.createElement("label");
    rotulo.setAttribute("for", ID + "-idioma");
    rotulo.textContent = texto.choose;
    var selecionar = document.createElement("select");
    selecionar.id = ID + "-idioma";
    idiomas.forEach(function (par) {
      var op = document.createElement("option");
      op.value = par[0];
      op.textContent = par[1];
      selecionar.appendChild(op);
    });
    var pref = guardado();
    selecionar.value = idiomas.some(function (par) { return par[0] === pref; }) ? pref : idiomaOriginal;

    var acao = document.createElement("button");
    acao.type = "button";
    acao.className = "pmm-ir";
    acao.textContent = texto.action;
    acao.addEventListener("click", function () { navegar(selecionar.value); });

    var observacao = document.createElement("p");
    observacao.className = "pmm-nota";
    observacao.textContent = texto.notice;
    var adicional = document.createElement("p");
    adicional.className = "pmm-nota";
    adicional.textContent = texto.advice;

    var linkOriginal = document.createElement("a");
    linkOriginal.className = "pmm-original";
    linkOriginal.href = originalURL();
    linkOriginal.textContent = texto.origin;

    painel.appendChild(titulo);
    painel.appendChild(rotulo);
    painel.appendChild(selecionar);
    painel.appendChild(acao);
    painel.appendChild(observacao);
    painel.appendChild(adicional);
    painel.appendChild(linkOriginal);
    caixa.appendChild(painel);
    caixa.appendChild(abrir);
    document.body.appendChild(caixa);

    abrir.addEventListener("click", function () {
      painel.hidden = !painel.hidden;
      abrir.setAttribute("aria-expanded", String(!painel.hidden));
      if (!painel.hidden) selecionar.focus();
    });
    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape" && !painel.hidden) {
        painel.hidden = true; abrir.setAttribute("aria-expanded", "false"); abrir.focus();
      }
    });
    document.addEventListener("click", function (evento) {
      if (!painel.hidden && !caixa.contains(evento.target)) {
        painel.hidden = true; abrir.setAttribute("aria-expanded", "false");
      }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();