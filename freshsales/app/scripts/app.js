var client;

(async function init() {
  client = await app.initialized();
  client.events.on('app.activated', renderApp);
})();

async function renderApp() {
  let openModalBtn = document.querySelector('.modal-opener');

  openModalBtn.addEventListener('click', function openModal() {
    client.interface.trigger('showModal', { title: 'An Modal Example', template: 'views/modal.html' });
  });
}

function closePopup() {
  client.instance.close();
}
