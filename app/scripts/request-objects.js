(function () {
  function attr(path, type, description) {
    return { path: path, type: type, description: description };
  }

  const APP_THEME = {
    productName: 'Nexus Connect Hub',
    company: 'Nexus API Labs',
    tagline: 'Wire Freshdesk to partner CRMs, webhooks, and billing APIs — with live integration drills.',
    fullPageTitle: 'Integration Ops Center',
    sidebarTitle: 'Quick Connect',
    sidebarDesc: 'Run partner integrations in the context of this ticket. API keys stay server-side via SMI.'
  };

  const PLATFORM_LIMITS = [
    attr('Request timeout', '15000–30000 ms', 'Default 15s. App execution extends to 40s for 20–30s timeouts.'),
    attr('Rate limit', '50 req/min', 'Per app per account.'),
    attr('Request body max', '100 KB', 'Payload to serverless component.'),
    attr('Response max', '6 MB', 'Third-party response size.'),
    attr('Max templates', '100', 'In config/requests.json.')
  ];

  const SCHEMA_ATTRS = [
    attr('method', 'string (required)', 'GET, POST, PUT, DELETE, PATCH.'),
    attr('protocol', 'string', 'HTTPS in production. HTTP allowed for local testing only.'),
    attr('host', 'string (required)', 'FQDN only — no protocol, no trailing slash, no IP.'),
    attr('path', 'string', 'Resource path; must start with /. Default: /.'),
    attr('query', 'object', 'Query parameters as key-value pairs.'),
    attr('headers', 'object', 'HTTP headers (Authorization, Content-Type, etc.).'),
    attr('formData.fields', 'object', 'multipart/form-data text fields.'),
    attr('formData.files', 'object', 'multipart files via object store ref (not in Freshdesk).'),
    attr('file.ref', 'string', 'application/octet-stream upload via object store ref.')
  ];

  const OPTIONS_ATTRS = [
    attr('maxAttempts', 'number', 'Retry count on network or 429/5xx. Valid: 1–5. Default: 1.'),
    attr('retryDelay', 'number', 'Milliseconds before retry. Valid: 1–1500. Default: 1000.'),
    attr('oauth', 'string', 'OAuth config name from config/oauth_config.json.'),
    attr('security.ca', 'string', 'PEM CA certificate for TLS troubleshooting.'),
    attr('security.cert', 'string', 'PEM client certificate.'),
    attr('security.key', 'string', 'PEM private key.'),
    attr('security.pfx', 'string', 'Base64 cert+key bundle.'),
    attr('security.passphrase', 'string', 'Password for key or PFX.')
  ];

  const SUBSTITUTIONS = [
    attr('<%= iparam.name %>', 'template', 'Non-secure iparam in host, path, query, headers.'),
    attr('<%= encode(iparam.name) %>', 'template', 'Encode secure iparam (e.g. Authorization).'),
    attr('<%= context.name %>', 'template', 'Runtime context from invokeTemplate.'),
    attr('<%= current_host.endpoint_urls.product %>', 'template', 'Account URL for deployed product.'),
    attr('<%= access_token %>', 'template', 'OAuth token in headers when options.oauth is set.'),
    attr('<%= app_settings.key %>', 'template', 'App settings value at runtime.')
  ];

  const INVOKE_ATTRS = [
    attr('requestTemplateName', 'string (required)', 'Key in requests.json and manifest requests.'),
    attr('context', 'object', 'Variables for <%= context.* %> substitution.'),
    attr('body', 'string/object', 'HTTP request body (not in template schema).'),
    attr('cache', 'boolean', 'Front-end only: cache response in localStorage.'),
    attr('ttl', 'number', 'Cache TTL ms when cache is true. Default: 60000.'),
    attr('options.account', 'string', 'OAuth multi-account name (platform v3.1+).')
  ];

  const RESPONSE_ATTRS = [
    attr('status', 'number', 'HTTP status code from third-party.'),
    attr('headers', 'object', 'Response header key-value pairs.'),
    attr('response', 'string', 'Response body as string (parse JSON as needed).')
  ];

  const ERROR_CODES = [
    attr('400', 'Invalid URL / substitution / whitelist / circuit breaker', 'Malformed template or blocked URL.'),
    attr('403', 'URL not allowed', 'Domain blocklist or policy.'),
    attr('415', 'Unsupported content type', 'Response Content-Type not on allowlist.'),
    attr('429', 'Rate limit', 'Too many requests.'),
    attr('502', 'Connection error', 'DNS, TLS, or connection refused.'),
    attr('504', 'Timeout', 'Exceeded configured timeout.')
  ];

  const ALLOWLIST_IPS = [
    attr('United States', 'IPs', '18.233.117.211, 35.168.222.30'),
    attr('Germany/Europe-Central', 'IPs', '18.197.138.225, 52.57.69.21'),
    attr('Sweden/Europe-North', 'IPs', '13.63.205.168, 13.50.203.236'),
    attr('India', 'IPs', '13.232.159.149, 13.233.170.242'),
    attr('Australia', 'IPs', '13.211.182.225, 52.63.187.64'),
    attr('UAE', 'IPs', '3.29.180.34, 51.112.23.180')
  ];

  const TEMPLATES = [
    {
      key: 'publicGet',
      scenario: 'Partner API health check',
      scenarioDetail: 'Before a client go-live, Nexus verifies an external partner endpoint responds. Host and path are supplied at invoke time — the same pattern used for multi-tenant CRM lookups.',
      badge: 'Context substitution',
      accent: 'blue',
      title: 'publicGet',
      description: 'Context substitution in host and path (<%= context.host %>, <%= context.path %>).',
      sampleContext: { host: 'swapi.dev', path: '/api/people/1' },
      sampleCode: '$request.invokeTemplate("publicGet", { context: { host: "swapi.dev", path: "/api/people/1" } });',
      via: 'smi',
      sidebarLabel: 'Check partner API',
      sidebarOrder: 4
    },
    {
      key: 'iparamHostGet',
      scenario: 'Account ticket sync',
      scenarioDetail: 'Pull the latest ticket slice from the client Freshdesk account using install-time subdomain and a secure API key — never exposed in browser code.',
      badge: 'Iparam auth',
      accent: 'purple',
      title: 'iparamHostGet',
      description: 'iparam host + encode(iparam.api_key) header + context query per_page.',
      sampleContext: { per_page: '1' },
      sampleCode: '$request.invokeTemplate("iparamHostGet", { context: { per_page: "1" } });',
      via: 'smi',
      sidebarLabel: 'Sync account tickets',
      sidebarOrder: 3
    },
    {
      key: 'searchTickets',
      scenario: 'Priority escalation search',
      scenarioDetail: 'Find open tickets matching a Freshdesk search query — used when routing escalations or auditing queues before stand-up.',
      badge: 'Search API',
      accent: 'orange',
      title: 'searchTickets',
      description: 'Freshdesk search with <%= context.query %> in query string.',
      sampleContext: { query: '"priority:3"' },
      sampleCode: '$request.invokeTemplate("searchTickets", { context: { query: "\\"priority:3\\"" } });',
      via: 'smi',
      sidebarLabel: 'Search urgent queue',
      sidebarOrder: 2
    },
    {
      key: 'postWithBody',
      scenario: 'Partner webhook notify',
      scenarioDetail: 'POST a ticket event payload to a client webhook. The JSON body changes every invocation — it cannot be frozen in the template schema.',
      badge: 'Runtime body',
      accent: 'green',
      title: 'postWithBody',
      description: 'POST with JSON body passed at invoke time (not in template schema).',
      sampleBody: JSON.stringify({ demo: 'request-method showcase' }),
      sampleCode: '$request.invokeTemplate("postWithBody", { body: JSON.stringify({ demo: "value" }) });',
      via: 'smi',
      sidebarLabel: 'Notify partner webhook',
      sidebarOrder: 1
    },
    {
      key: 'withRetryOptions',
      scenario: 'Resilient partner lookup',
      scenarioDetail: 'Partner billing APIs spike during month-end close. Retry options absorb transient 429/5xx responses without custom retry loops in serverless code.',
      badge: 'Retry options',
      accent: 'teal',
      title: 'withRetryOptions',
      description: 'options.maxAttempts and options.retryDelay on transient failures.',
      sampleContext: { host: 'swapi.dev', path: '/api/people/2' },
      sampleCode: '$request.invokeTemplate("withRetryOptions", { context: { host: "swapi.dev", path: "/api/people/2" } });',
      via: 'smi',
      sidebarLabel: 'Resilient status lookup',
      sidebarOrder: 5
    }
  ];

  const REFERENCE_TEMPLATES = [
    {
      scenario: 'CRM attachment upload',
      title: 'multipart/form-data (formData)',
      description: 'Upload files via object store ref in formData.files. Not supported in Freshdesk (no object store).',
      badge: 'Reference',
      sampleCode: JSON.stringify({
        schema: {
          method: 'POST',
          path: '/upload',
          headers: { 'Content-Type': 'multipart/form-data' },
          formData: {
            fields: { userId: '<%= context.user_id %>' },
            files: { image1: { ref: '<%= context.ref1 %>' } }
          }
        }
      }, null, 2)
    },
    {
      scenario: 'Raw file stream upload',
      title: 'application/octet-stream (file.ref)',
      description: 'Single file upload via file.ref. Requires object store (not in Freshdesk).',
      badge: 'Reference',
      sampleCode: JSON.stringify({
        schema: {
          method: 'PUT',
          path: '/upload/raw',
          headers: { 'Content-Type': 'application/octet-stream' },
          file: { ref: '<%= context.file_ref %>' }
        }
      }, null, 2)
    },
    {
      scenario: 'SaaS OAuth connect',
      title: 'OAuth (access_token)',
      description: 'Set options.oauth and use Bearer <%= access_token %> in headers.',
      badge: 'Reference',
      sampleCode: JSON.stringify({
        schema: {
          method: 'GET',
          host: 'api.example.com',
          path: '/resource',
          headers: { Authorization: 'bearer <%= access_token %>' }
        },
        options: { oauth: 'my_oauth_config' }
      }, null, 2)
    },
    {
      scenario: 'On-prem TLS fix',
      title: 'TLS security options',
      description: 'options.security.ca from iparam for incomplete certificate chains.',
      badge: 'Reference',
      sampleCode: JSON.stringify({
        options: { security: { ca: '<%= iparam.tls_ca %>' } }
      }, null, 2)
    }
  ];

  function buildSidebarInvokeArgs(templateKey, ticket) {
    const t = ticket || {};
    const priority = t.priority != null ? t.priority : 3;
    const ticketId = t.id != null ? t.id : 'sample';

    switch (templateKey) {
      case 'postWithBody':
        return {
          body: JSON.stringify({
            source: 'nexus_connect_hub',
            event: 'ticket_update',
            ticket_id: ticketId,
            subject: t.subject || 'Sample ticket subject',
            priority: priority,
            status: t.status != null ? t.status : null
          })
        };
      case 'searchTickets':
        return {
          context: { query: '"priority:' + priority + '"' }
        };
      case 'iparamHostGet':
        return { context: { per_page: '1' } };
      case 'publicGet':
        return { context: { host: 'swapi.dev', path: '/api/people/1' } };
      case 'withRetryOptions':
        return { context: { host: 'swapi.dev', path: '/api/people/2' } };
      default:
        return {};
    }
  }

  function getSidebarActions() {
    return TEMPLATES.slice().sort(function (a, b) {
      return (a.sidebarOrder || 99) - (b.sidebarOrder || 99);
    });
  }

  window.RequestObjects = {
    theme: APP_THEME,
    platformLimits: PLATFORM_LIMITS,
    schemaAttrs: SCHEMA_ATTRS,
    optionsAttrs: OPTIONS_ATTRS,
    substitutions: SUBSTITUTIONS,
    invokeAttrs: INVOKE_ATTRS,
    responseAttrs: RESPONSE_ATTRS,
    errorCodes: ERROR_CODES,
    allowlistIps: ALLOWLIST_IPS,
    templates: TEMPLATES,
    referenceTemplates: REFERENCE_TEMPLATES,
    buildSidebarInvokeArgs: buildSidebarInvokeArgs,
    getSidebarActions: getSidebarActions
  };
})();
