# Request Method for Freshservice

Request Method enables apps to make API requests to third-party applications using [Request templates](../UserGuide.md)

![App preview](./screenshots/ticket_sidebar.png)
![Requester Info placeholder](./screenshots/requester_info_page.png)

## Features Demonstrated

App location: ticket details page

| Feature | Notes |
| :---: | --- |
| [`Request methods`](../UserGuide.md) | Request API is used to facilitate third-party API requests |

For details about requests, check out [requests.json](./config/requests.json) and how they are invoked with `client.request.invokeTemplate()` method in [app.js](./app/scripts/app.js) and [requester_info.js](./app/scripts/requester_info.js)

## Prerequisites

1. Make sure you have a trial Freshservice account created. You can always [sign up](https://freshservice.com/signup)
2. Ensure that you have the [Freshworks CLI](https://community.developers.freshworks.com/t/what-are-the-prerequisites-to-install-the-freshworks-cli/234) installed properly.

### Procedure to run the app

```sh
# Run the app
> fdk run
# You will need to append ?dev=true in the URL on every page.
# see browser console for a log from relavant app placeholder
```
