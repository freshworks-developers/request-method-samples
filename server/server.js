exports = {
  usingDynamicHost: async function () {
    let result;
    try {
      result = await $request.invokeTemplate('dynamicHost', {
        context: { host: 'swapi.dev' }
      });
    } catch (error) {
      console.error('usingDynamicHost', error);
      renderData({ message: 'Dynamic host request failed', error });
      return;
    }
    renderData(null, result);
  },

  usingQueryParams: async function (options) {
    let result;
    try {
      result = await $request.invokeTemplate('dynamicQueryParams', {
        context: {},
        query: { query: options.queryString || '"status:2 OR status:3"' }
      });
    } catch (error) {
      console.error('usingQueryParams', error);
      renderData({ message: 'Query param request failed', error });
      return;
    }
    renderData(null, result);
  },

  getContactsSmi: async function () {
    try {
      const result = await $request.invokeTemplate('getContacts', { context: {} });
      renderData(null, result);
    } catch (error) {
      console.error('getContactsSmi', error);
      renderData({ message: 'getContacts failed', error });
    }
  },

  postNoteSmi: async function (options) {
    if (!options.ticket_id) {
      renderData({ message: 'ticket_id is required for POST demo' });
      return;
    }
    try {
      const result = await $request.invokeTemplate('replyTicket', {
        context: { ticket_id: options.ticket_id },
        body: JSON.stringify({
          body: options.note_body || 'Nexus API Labs — POST note via $request.invokeTemplate',
          private: true
        })
      });
      renderData(null, result);
    } catch (error) {
      console.error('postNoteSmi', error);
      renderData({ message: 'POST note failed', error });
    }
  },

  putTicketSmi: async function (options) {
    if (!options.ticket_id) {
      renderData({ message: 'ticket_id is required for PUT demo' });
      return;
    }
    try {
      const result = await $request.invokeTemplate('updateTicket', {
        context: { ticket_id: options.ticket_id },
        body: JSON.stringify({
          tags: options.tags || ['nexus-request-sample']
        })
      });
      renderData(null, result);
    } catch (error) {
      console.error('putTicketSmi', error);
      renderData({ message: 'PUT ticket failed', error });
    }
  },

  deleteDemoSmi: async function () {
    try {
      const result = await $request.invokeTemplate('deleteResource', { context: {} });
      renderData(null, result);
    } catch (error) {
      console.error('deleteDemoSmi', error);
      renderData({ message: 'DELETE demo failed', error });
    }
  },

  cachedListSmi: async function () {
    try {
      const result = await $request.invokeTemplate('cachedTicketList', {
        context: {},
        cache: true,
        ttl: 300
      });
      renderData(null, result);
    } catch (error) {
      console.error('cachedListSmi', error);
      renderData({ message: 'Cached request failed', error });
    }
  },

  retryDemoSmi: async function () {
    try {
      const result = await $request.invokeTemplate('retryableRequest', { context: {} });
      renderData(null, result);
    } catch (error) {
      console.error('retryDemoSmi', error);
      renderData({ message: 'Retryable request failed', error });
    }
  },

  oauthDemoSmi: async function () {
    try {
      const result = await $request.invokeTemplate('oauthGithubUser', { context: {} });
      renderData(null, result);
    } catch (error) {
      console.error('oauthDemoSmi', error);
      renderData({ message: 'OAuth template failed — connect GitHub in app settings', error });
    }
  },

  invokeSmiChain: async function (options) {
    try {
      const hostResult = await $request.invoke('usingDynamicHost', {});
      const queryResult = await $request.invoke('usingQueryParams', {
        queryString: options.queryString || '"priority:3"'
      });
      renderData(null, { source: '$request.invoke', hostResult, queryResult });
    } catch (error) {
      console.error('invokeSmiChain', error);
      renderData({ message: 'SMI chain failed', error });
    }
  },

  invokeTemplateSmi: async function (options) {
    const templateName = options.template || 'swapiPlanets';
    try {
      const result = await $request.invokeTemplate(templateName, {
        context: options.context || {},
        query: options.query,
        body: options.body,
        cache: options.cache,
        ttl: options.ttl
      });
      renderData(null, result);
    } catch (error) {
      console.error('invokeTemplateSmi', error);
      renderData({ message: 'invokeTemplate SMI failed', error });
    }
  }
};
