(function () {
  const SIDEBAR_HEIGHT = '560px';

  function resizeSidebar(client) {
    try {
      client.instance.resize({ height: SIDEBAR_HEIGHT });
    } catch (resizeError) {
      console.info('Could not resize sidebar', resizeError);
    }
  }

  async function loadTicket(client) {
    try {
      const data = await client.data.get('ticket');
      return data && data.ticket ? data.ticket : null;
    } catch (error) {
      console.info('Could not load ticket context', error);
      return null;
    }
  }

  async function mountSidebar(client) {
    const ticket = await loadTicket(client);
    CatalogUI.mount('catalog', { layout: 'sidebar', ticket: ticket });
    resizeSidebar(client);
  }

  document.addEventListener('request-kit:ready', function (event) {
    const client = event.detail && event.detail.client;
    if (!client) {
      return;
    }
    mountSidebar(client);
    client.events.on('app.activated', function () {
      mountSidebar(client);
    });
  });
})();
