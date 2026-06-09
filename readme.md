# Northwind Request Lab

Explore **request templates** on Freshdesk — `invokeTemplate`, `invoke`, OAuth, retry, cache, and HTTP verbs beyond GET. **Northwind Traders** uses this sample to teach every server-side and client-side request pattern in one tabbed playground.

**Platform:** 3.0 · **FDK:** 10.1.2 · **Node:** 24.11.0 · **UI:** Crayons v4

---

## Tabs

| Tab | Demonstrates |
|-----|--------------|
| **Frontend requests** | `client.request.invokeTemplate` + `client.request.invoke` |
| **Serverless SMI** | `$request.invokeTemplate`, `$request.invoke` chain, POST/PUT/DELETE |
| **Request features** | `maxAttempts`/`retryDelay`, `cache`/`ttl`, `options.oauth` |

---

## Templates (`config/requests.json`)

- **GET** — `listAllTickets`, `dynamicQueryParams`, `getContacts`, `swapiPlanets`
- **POST/PUT/DELETE** — `replyTicket`, `updateTicket`, `deleteResource`
- **Auth** — `encode(iparam.api_key)`; install validation via `validateCredentials`
- **Retry** — `retryableRequest` (`maxAttempts: 3`, `retryDelay: 1000`)
- **OAuth** — `oauthGithubUser` (`options.oauth: github`)

Install page: `config/iparams.html` tests credentials with `invokeTemplate` before save.

---

## Setup

```sh
git clone https://github.com/freshworks-developers/request-method-samples.git
cd request-method-samples
fdk run
```

Append `?dev=true` to your Freshdesk URL. Connect GitHub OAuth in app settings for the OAuth demo. POST/PUT Freshdesk demos require a valid `ticket_id`.

```sh
fdk validate
fdk pack
```

---

## Project structure

```
.
├── manifest.json
├── config/
│   ├── requests.json       # All template variants
│   ├── oauth_config.json     # Demo GitHub OAuth
│   ├── iparams.html          # Install-time credential validation
│   └── assets/iparams.js
├── server/server.js          # $request.invokeTemplate + $request.invoke
├── app/
│   ├── views/playground.html
│   ├── scripts/playground.js
│   └── styles/
├── README.md
└── USECASE.md
```

---

## Tech stack

- **Platform:** Freshworks Platform 3.0
- **Runtime:** Node.js 24.11.0 · FDK 10.1.2
- **UI:** Crayons v4

---

## Resources

- [Request method](https://developers.freshworks.com/docs/app-sdk/v3.0/common/client/request-method/)
- [Request templates](https://developers.freshworks.com/docs/app-sdk/v3.0/common/serverless-apps/request-templates/)
- [USECASE.md](./USECASE.md)
