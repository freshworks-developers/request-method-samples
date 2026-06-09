# Use Cases - Northwind Traders

**App:** Northwind Request Lab  
**Repo:** [freshworks-developers/request-method-samples](https://github.com/freshworks-developers/request-method-samples)

## Company Overview

**Northwind Traders** integrates Freshdesk with external APIs. Developers need one sample covering every request-method capability — templates, SMI, `$request.invoke`, retries, caching, OAuth, and install-time credential validation.

## Use Case Scenarios

### 1. Frontend Template Calls (GET + Dynamic Query)

**Scenario**: Support engineers search tickets from the browser without embedding API keys in frontend code.

**Use Case**: The **Frontend requests** tab calls `client.request.invokeTemplate("dynamicQueryParams")` with runtime `query` overrides. Auth uses `encode(iparam.api_key)` in `config/requests.json`.

---

### 2. Serverless SMI for POST / PUT / DELETE

**Scenario**: Notes and tag updates must run server-side.

**Use Case**: **Serverless SMI** invokes `postNoteSmi`, `putTicketSmi`, and `deleteDemoSmi`. Each handler uses `$request.invokeTemplate` with POST, PUT, or DELETE schemas.

---

### 3. `$request.invoke` SMI Chain

**Scenario**: A serverless function orchestrates multiple SMI calls without round-tripping through the browser.

**Use Case**: `invokeSmiChain` calls `$request.invoke("usingDynamicHost")` then `$request.invoke("usingQueryParams")` from `server/server.js`.

---

### 4. Retry on Transient Failures

**Scenario**: Third-party APIs return 429 or 5xx during peak hours.

**Use Case**: `retryableRequest` sets `options.maxAttempts: 3` and `options.retryDelay: 1000`.

---

### 5. Response Caching

**Scenario**: Demo sessions should not hammer Freshdesk on every click.

**Use Case**: `cachedTicketList` invoked with `{ cache: true, ttl: 300 }` from frontend and serverless.

---

### 6. OAuth Account Templates

**Scenario**: Northwind enriches tickets with GitHub profile data.

**Use Case**: `oauthGithubUser` uses `"options": { "oauth": "github" }` with `config/oauth_config.json`.

---

### 7. Live Credential Validation on Install

**Scenario**: Admins paste wrong API keys during setup.

**Use Case**: `config/iparams.html` checkbox triggers `client.request.invokeTemplate("validateCredentials")` with `encode(context.api_key)` in `validate()`.

---

## Surfaces

| Surface | File |
|---------|------|
| Full page app | `app/views/playground.html` |
| Ticket sidebar | `app/views/playground.html` |
| Installation page | `config/iparams.html` |

```sh
fdk run
```
