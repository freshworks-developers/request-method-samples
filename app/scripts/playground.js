let client;

(async function init() {
  client = await app.initialized();
  client.events.on('app.activated', onActivated);
})();

function onActivated() {
  bind('btn-list-tickets', () => invokeTemplate('listAllTickets', { query: { per_page: '5' } }));
  bind('btn-contacts', () => invokeTemplate('getContacts', {}));
  bind('btn-search', () =>
    invokeTemplate('dynamicQueryParams', {
      query: { query: '"status:2 OR status:3 OR status:6 OR status:7"' }
    })
  );
  bind('btn-swapi', () => invokeTemplate('swapiPlanets', {}));
  bind('btn-smi-host', () => invokeSmi('usingDynamicHost', {}));
  bind('btn-smi-query', () =>
    invokeSmi('usingQueryParams', { queryString: '"status:2 OR status:3"' })
  );
  bind('btn-smi-contacts', () => invokeSmi('getContactsSmi', {}));
  bind('btn-smi-chain', () => invokeSmi('invokeSmiChain', { queryString: '"priority:3"' }));
  bind('btn-smi-post', () => invokeSmiWithTicket('postNoteSmi', 'POST note'));
  bind('btn-smi-put', () => invokeSmiWithTicket('putTicketSmi', 'PUT ticket'));
  bind('btn-smi-delete', () => invokeSmi('deleteDemoSmi', {}));
  bind('btn-retry', () => invokeSmi('retryDemoSmi', {}));
  bind('btn-cache', () => invokeSmi('cachedListSmi', {}));
  bind('btn-cache-fe', demonstrateCacheFrontend);
  bind('btn-oauth', () => invokeSmi('oauthDemoSmi', {}));
  bind('btn-clear', () => setOutput('Run a demo to see JSON output here.'));
}

function bind(id, handler) {
  document.getElementById(id).addEventListener('fwClick', handler);
}

async function invokeTemplate(name, opts) {
  try {
    const res = await client.request.invokeTemplate(name, {
      context: opts.context || {},
      query: opts.query,
      body: opts.body,
      cache: opts.cache,
      ttl: opts.ttl
    });
    setOutput(`invokeTemplate → ${name}`, res);
  } catch (error) {
    setOutput(`invokeTemplate ${name} error`, error);
  }
}

async function invokeSmi(name, args) {
  try {
    const res = await client.request.invoke(name, args);
    setOutput(`invoke → ${name}`, res);
  } catch (error) {
    setOutput(`invoke ${name} error`, error);
  }
}

async function invokeSmiWithTicket(smiName, label) {
  try {
    const { ticket } = await client.data.get('ticket');
    if (!ticket?.id) {
      setOutput(`${label} error`, 'Open a ticket sidebar to supply ticket_id.');
      return;
    }
    const args =
      smiName === 'postNoteSmi'
        ? { ticket_id: ticket.id, note_body: 'Northwind POST demo via SMI' }
        : { ticket_id: ticket.id, tags: ['northwind-request-lab'] };
    await invokeSmi(smiName, args);
  } catch (error) {
    setOutput(`${label} error`, error);
  }
}

async function demonstrateCacheFrontend() {
  try {
    const first = await client.request.invokeTemplate('cachedTicketList', {
      cache: true,
      ttl: 300
    });
    const second = await client.request.invokeTemplate('cachedTicketList', {
      cache: true,
      ttl: 300
    });
    setOutput('cache + ttl (frontend)', {
      cache: true,
      ttl: 300,
      cacheHit: first.response === second.response,
      first,
      second
    });
  } catch (error) {
    setOutput('cache demo error', error);
  }
}

function setOutput(label, data) {
  const output = document.getElementById('output');
  const payload = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  output.textContent = label ? `// ${label}\n${payload}` : payload;
}
