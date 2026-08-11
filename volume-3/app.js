// script simples para registro do service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/volume-3/sw.js')
      .then(reg => console.log('ServiceWorker registrado:', reg.scope))
      .catch(err => console.error('Erro ao registrar SW:', err));
  });
}
