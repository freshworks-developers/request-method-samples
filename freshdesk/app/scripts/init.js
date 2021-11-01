document.readyState != 'loading'
  ? console.log('page is rendering')
  : document.addEventListener('DOMContentLoaded', attachToWindow);

async function attachToWindow() {
  var _client = await app.initialized();
  window.client = _client;
  console.log('attached to window', window.client);
}
