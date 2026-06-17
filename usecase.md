Use Cases - Nexus API Labs / Nexus Connect Hub
===============================================

Company Overview
----------------

**Nexus API Labs** is an integration consultancy that wires **Freshdesk** to client CRMs, billing systems, and partner webhooks. Their delivery teams repeat the same Request Method patterns on every project — secure API keys, runtime payloads, search queries, and retry policies — but onboarding engineers still learn from scattered documentation instead of a living drill board.

**Nexus Connect Hub** is their internal integration ops app: scenario cards map real client workflows to `requests.json` templates, and the ticket sidebar runs those integrations in context of the ticket an agent has open.

* * * * *

Use Case Scenarios
------------------

### 1\. Partner Webhook Notify on Ticket Updates

**Scenario**: A retail client wants Freshdesk ticket changes pushed to their order-management webhook. The JSON body includes ticket id, subject, and priority — and changes on every event.

**Use Case**: From **Quick Connect** on the ticket sidebar, an agent clicks **Notify partner webhook**. The app reads `client.data.get('ticket')`, builds a JSON payload with the current ticket fields, and invokes the `postWithBody` template through SMI. The template only defines host, path, and headers; the body is passed at invoke time — matching how Nexus ships production webhook integrations.

On the **Integration Ops Center** full-page board, the same workflow appears as the **Partner webhook notify** scenario card with a **Run integration** button and expandable server code.

**Platform tie-in:** `invokeTemplate` `body` argument + [Request method](https://developers.freshworks.com/docs/app-sdk/v3.0/support_ticket/advanced-interfaces/request-method/) + [SMI](https://developers.freshworks.com/docs/app-sdk/v3.0/support_ticket/serverless-apps/server-method-invocation/).

* * * * *

### 2\. Priority Escalation Search Before Stand-Up

**Scenario**: Before daily stand-up, a Nexus engineer audits how many urgent tickets are open for a client account. They need a Freshdesk search API call with a dynamic query — not a hard-coded template body.

**Use Case**: **Quick Connect** offers **Search urgent queue**, building a search query from the current ticket's priority (for example `"priority:3"`). The `searchTickets` template substitutes `<%= context.query %>` and authenticates with `encode(iparam.api_key)`.

The full-page **Priority escalation search** card documents the same pattern for engineers copying `requests.json` into a client repo.

**Platform tie-in:** Template substitutions (`<%= context.query %>`, `encode(iparam.api_key)`) + [Installation parameters](https://developers.freshworks.com/docs/app-sdk/v3.0/support_ticket/configuration/installation-parameters/).

* * * * *

### 3\. Account Ticket Sync with Secure Iparam Auth

**Scenario**: A fintech client requires all Freshdesk API calls to use install-time subdomain and API key values. Security review rejects any code that reads secrets in the browser.

**Use Case**: **Sync account tickets** invokes `iparamHostGet`, which substitutes `<%= iparam.subdomain %>.freshdesk.com` in the host and `encode(iparam.api_key)` in Authorization headers. Engineers validate iparam configuration during app install before go-live.

The **Account ticket sync** scenario card on the ops board shows the live response and serverless sample code.

**Platform tie-in:** `<%= iparam.* %>` and `encode(iparam.*)` in `config/requests.json` + serverless `$request.invokeTemplate`.

* * * * *

### 4\. Partner API Health Check Before Go-Live

**Scenario**: Nexus runs a pre-launch checklist for every integration: confirm the partner endpoint responds before agents rely on the connector in production.

**Use Case**: The **Partner API health check** card demonstrates `publicGet` with runtime `context.host` and `context.path` substitution (demo target: swapi.dev). Multi-tenant client apps use the same pattern when each account points at a different partner FQDN.

**Quick Connect** exposes **Check partner API** for a one-click drill from any ticket without opening the full ops board.

**Platform tie-in:** `<%= context.* %>` substitution in template schema attributes.

* * * * *

### 5\. Resilient Partner Lookup During Month-End Spikes

**Scenario**: A billing partner's API returns intermittent 429 responses when clients close their books. Nexus documents retry defaults in client runbooks and needs a sandbox to prove retries work.

**Use Case**: The **Resilient partner lookup** scenario card invokes `withRetryOptions` — `maxAttempts: 3` and `retryDelay: 1000` configured in `requests.json`. Engineers expand **Technical details** to see the template definition and copy server code for client projects.

**Platform tie-in:** `options.maxAttempts` and `options.retryDelay` + [Rate limits and constraints](https://developers.freshworks.com/docs/app-sdk/v3.0/support_ticket/rate-limits-and-constraints/).

* * * * *

### 6\. Developer Playbook for Onboarding Engineers

**Scenario**: New hires must learn schema attributes, substitution rules, allow-list IPs, and error codes — but only after they understand *why* each integration pattern exists in client projects.

**Use Case**: The full-page **Developer playbook** (collapsed by default) holds platform limits, schema tables, substitution reference, manifest snippet, error codes, and allow-list IPs. Scenario cards teach the *what*; the playbook teaches the *how*.

Future client patterns (CRM attachment upload, SaaS OAuth, on-prem TLS) appear as reference cards labeled **Future client patterns** — JSON samples Nexus uses on Freshservice or custom products.

**Platform tie-in:** Full [Request method](https://developers.freshworks.com/docs/app-sdk/v3.0/support_ticket/advanced-interfaces/request-method/) reference surfaced inside the app.
