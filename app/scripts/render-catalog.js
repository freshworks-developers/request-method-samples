(function () {
  const H = window.CatalogHelpers;

  function attributeTable(attrs) {
    const rows = attrs.map(function (a) {
      return (
        '<tr>' +
        '<td class="attr-path"><code>' + RequestKit.escapeHtml(a.path) + '</code></td>' +
        '<td class="attr-type">' + RequestKit.escapeHtml(a.type) + '</td>' +
        '<td class="attr-desc">' + RequestKit.escapeHtml(a.description) + '</td>' +
        '</tr>'
      );
    });
    return (
      '<div class="attr-table-wrap"><table class="attr-table">' +
      '<thead><tr><th>Item</th><th>Type</th><th>Description</th></tr></thead>' +
      '<tbody>' + rows.join('') + '</tbody></table></div>'
    );
  }

  function referencePanel(title, subtitle, attrs) {
    return H.accordion(title, subtitle, attributeTable(attrs), false);
  }

  function buildPlaybook() {
    let html = '';

    html += referencePanel(
      'Platform limits',
      'Rate limits, timeouts, and payload constraints.',
      RequestObjects.platformLimits
    );

    html += referencePanel(
      'requests.json schema attributes',
      'HTTP request properties in each template schema object.',
      RequestObjects.schemaAttrs
    );

    html += referencePanel(
      'options attributes',
      'Retry, OAuth, and TLS security settings.',
      RequestObjects.optionsAttrs
    );

    html += referencePanel(
      'Template substitutions',
      'Variables populated at runtime in schema attributes.',
      RequestObjects.substitutions
    );

    html += H.accordion(
      'manifest.json declaration',
      'Declare templates under modules.common.requests.',
      '<pre class="sample-code">"requests": {\n  "publicGet": {},\n  "iparamHostGet": {}\n}</pre>',
      false
    );

    html += referencePanel(
      'invokeTemplate() arguments',
      'client.request.invokeTemplate (front-end) or $request.invokeTemplate (serverless).',
      RequestObjects.invokeAttrs
    );

    html += referencePanel(
      'Response object',
      'Successful invokeTemplate payload shape.',
      RequestObjects.responseAttrs
    );

    html += referencePanel(
      'Error codes',
      'Common request method failures.',
      RequestObjects.errorCodes
    );

    html += referencePanel(
      'Allow-list IPs',
      'Provide to third-party APIs when IP whitelisting is required.',
      RequestObjects.allowlistIps
    );

    html += H.accordion(
      'Local testing timeout',
      'fdk config set request.timeout <ms> — valid: 15000, 20000, 25000, 30000.',
      '<pre class="sample-code">fdk config set request.timeout 20000</pre>',
      false
    );

    html += H.accordion(
      'Front-end response caching',
      'cache and ttl on client.request.invokeTemplate only — demo for partner status lookups.',
      '<div class="object-actions">' +
      H.btn('Run cached lookup', 'CatalogUI.invokeCached()', 'primary') +
      '</div>' +
      '<pre class="sample-code">client.request.invokeTemplate("publicGet", {\n  context: { host: "swapi.dev", path: "/api/people/1" },\n  cache: true,\n  ttl: 60000\n});</pre>' +
      '<div id="response-cache" class="payload-preview hint">Run twice to compare cached partner response.</div>',
      false
    );

    return '<div class="accordion-stack playbook-stack">' + html + '</div>';
  }

  function buildHubCatalog() {
    let html = '';

    html += '<section class="hub-section">';
    html += '<h2 class="hub-section__title">Live integration drills</h2>';
    html += '<p class="hub-section__desc">Each card maps a real Nexus client workflow to a <code>requests.json</code> template. Integrations run server-side through SMI so API keys never reach the browser.</p>';
    html += '<div class="scenario-grid">';
    RequestObjects.templates.forEach(function (t, i) {
      html += H.scenarioCard(t, { expanded: i === 0 });
    });
    html += '</div>';
    html += '</section>';

    html += '<section class="hub-section">';
    html += '<h2 class="hub-section__title">Future client patterns</h2>';
    html += '<p class="hub-section__desc">Reference JSON for uploads, OAuth, and TLS — not runnable in Freshdesk without object store or OAuth config.</p>';
    html += '<div class="scenario-grid scenario-grid--reference">';
    RequestObjects.referenceTemplates.forEach(function (ref) {
      html += H.referenceScenarioCard(ref);
    });
    html += '</div>';
    html += '</section>';

    html += '<details class="playbook-wrap">';
    html += '<summary class="playbook-wrap__title">Developer playbook</summary>';
    html += '<p class="playbook-wrap__desc">Schema tables, substitutions, error codes, and platform limits for engineers onboarding to Request Methods.</p>';
    html += buildPlaybook();
    html += '</details>';

    return html;
  }

  function buildSidebarCatalog(ticket) {
    const t = ticket || {};
    const ticketId = t.id != null ? t.id : '—';
    const subject = t.subject ? RequestKit.escapeHtml(t.subject) : 'Open a ticket to load context';

    let html = '';
    html += '<div class="ticket-context">';
    html += '<span class="ticket-context__label">Current ticket</span>';
    html += '<strong class="ticket-context__id">#' + RequestKit.escapeHtml(String(ticketId)) + '</strong>';
    html += '<p class="ticket-context__subject">' + subject + '</p>';
    html += '</div>';

    html += '<p class="sidebar-actions-heading">Run from this ticket</p>';
    html += '<div class="sidebar-actions">';

    RequestObjects.getSidebarActions().forEach(function (templateDef) {
      const safeKey = templateDef.key.replace(/'/g, "\\'");
      const invokeHandler = "CatalogUI.invokeSidebar('" + safeKey + "')";
      html += (
        '<div class="sidebar-action">' +
        H.badge(templateDef.badge, templateDef.accent) +
        '<div class="sidebar-action__body">' +
        '<strong class="sidebar-action__title">' + templateDef.sidebarLabel + '</strong>' +
        '<p class="sidebar-action__desc">' + templateDef.scenarioDetail + '</p>' +
        '<div class="object-actions">' +
        H.btn('Run', invokeHandler, 'primary') +
        '</div>' +
        '<div id="response-' + templateDef.key + '" class="payload-preview hint">Waiting…</div>' +
        '</div>' +
        '</div>'
      );
    });

    html += '</div>';

    html += '<p class="sidebar-hub-link hint">Open <strong>Integration Ops Center</strong> from the left navigation for the full drill board and developer playbook.</p>';

    return html;
  }

  window.CatalogUI = {
    _sidebarTicket: null,

    mount: function (containerId, options) {
      const root = document.getElementById(containerId);
      if (!root) {
        return;
      }
      const opts = options || {};
      if (opts.layout === 'sidebar') {
        this._sidebarTicket = opts.ticket || null;
        root.innerHTML = buildSidebarCatalog(this._sidebarTicket);
      } else {
        root.innerHTML = buildHubCatalog();
      }
    },

    invokeSmi: async function (templateKey, overrides) {
      const templateDef = RequestObjects.templates.find(function (t) {
        return t.key === templateKey;
      });
      const responseEl = document.getElementById('response-' + templateKey);
      if (!templateDef) {
        return;
      }
      const context = (overrides && overrides.context !== undefined)
        ? overrides.context
        : templateDef.sampleContext;
      const body = (overrides && overrides.body !== undefined)
        ? overrides.body
        : templateDef.sampleBody;
      try {
        if (responseEl) {
          responseEl.textContent = 'Calling partner API…';
        }
        const result = await RequestKit.invokeViaSmi(templateKey, context, body);
        if (responseEl) {
          responseEl.textContent = RequestKit.formatResponse(result);
        }
      } catch (error) {
        const msg = (error && error.message) ? error.message : String(error);
        if (responseEl) {
          responseEl.textContent = 'Error: ' + msg;
        }
      }
    },

    invokeSidebar: async function (templateKey) {
      const args = RequestObjects.buildSidebarInvokeArgs(templateKey, this._sidebarTicket);
      await this.invokeSmi(templateKey, args);
    },

    invokeCached: async function () {
      const responseEl = document.getElementById('response-cache');
      try {
        if (responseEl) {
          responseEl.textContent = 'Loading…';
        }
        const result = await RequestKit.invokeWithCache('publicGet', {
          host: 'swapi.dev',
          path: '/api/people/1'
        }, 60000);
        if (responseEl) {
          responseEl.textContent = RequestKit.formatResponse(result);
        }
      } catch (error) {
        const msg = (error && error.message) ? error.message : String(error);
        if (responseEl) {
          responseEl.textContent = 'Error: ' + msg;
        }
      }
    },

    copySample: function (templateKey) {
      const el = document.getElementById('sample-' + templateKey);
      if (el && navigator.clipboard) {
        navigator.clipboard.writeText(el.textContent).catch(function (err) {
          console.info('Clipboard copy failed', err);
        });
      }
    }
  };
})();
