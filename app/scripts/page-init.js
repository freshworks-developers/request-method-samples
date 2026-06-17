(function () {
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    app.initialized().then(function (client) {
      RequestKit.setClient(client);
      document.dispatchEvent(new CustomEvent('request-kit:ready', { detail: { client: client } }));
    }).catch(function (error) {
      const banner = document.getElementById('init-error');
      if (banner) {
        banner.textContent = 'App failed to initialize. Reload the page or check the browser console.';
      }
      console.error('Failed to initialize app client', error);
    });
  });
})();
