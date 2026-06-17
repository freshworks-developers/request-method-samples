(function () {
  let clientRef = null;

  function getClient() {
    if (!clientRef) {
      throw new Error('App client is not initialized yet.');
    }
    return clientRef;
  }

  function setClient(c) {
    clientRef = c;
    window.client = c;
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatResponse(result) {
    if (!result) {
      return 'No response';
    }
    const payload = result.response !== undefined ? result.response : result;
    if (typeof payload === 'string') {
      try {
        return JSON.stringify(JSON.parse(payload), null, 2);
      } catch {
        return payload;
      }
    }
    try {
      return JSON.stringify(payload, null, 2);
    } catch (stringifyError) {
      console.info('Could not stringify response', stringifyError);
      return String(payload);
    }
  }

  async function invokeViaSmi(templateName, context, body, query) {
    const args = { templateName: templateName, context: context || {} };
    if (body !== undefined) {
      args.body = body;
    }
    if (query !== undefined) {
      args.query = query;
    }
    return await getClient().request.invoke('invokeRequestTemplate', args);
  }

  async function invokeDirect(templateName, options) {
    return await getClient().request.invokeTemplate(templateName, options || {});
  }

  async function invokeWithCache(templateName, context, ttl) {
    return await getClient().request.invokeTemplate(templateName, {
      context: context || {},
      cache: true,
      ttl: ttl || 60000
    });
  }

  window.RequestKit = {
    setClient: setClient,
    getClient: getClient,
    escapeHtml: escapeHtml,
    formatResponse: formatResponse,
    invokeViaSmi: invokeViaSmi,
    invokeDirect: invokeDirect,
    invokeWithCache: invokeWithCache
  };
})();
