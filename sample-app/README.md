### Request templates sample app
Sample app to demonstrate the usage of request templates in both front-end (`client.request.invokeTemplate()`) and serverless (`$request.invokeTemplate()`) components of the app.

## Development Platform Features used in this app
|Feature|Request template key|
|GET Method|`getStarWarsPeople`|
|GET Method with query params|`starwarsStarshipSearch`|
|GET Method with path params|`getStarWarsPeopleDetails`|
|GET Method with Freshdesk API and authorization|`getContacts`|
|PUT Method with body|`replyTicket`|
|Customs iparams page|`iparamValidate`|
|GET Method with host dynamic substitution from Serverless|`dynamicHost`|
|GET Method with dynamic query params during runtime|`dynamicQueryParams`|
|GET Method with query params defined in requests.json|`listAllTickets`|

### Files and Folders
    .
    ├── README.md                 A file for your future self and developer friends to learn about app
    ├── app                       A folder to place all assets required for frontend components
    │   ├── index.html            A landing page for the user to use the app
    │   ├── scripts               JavaScript to place files frontend components business logic
    │   │   └── app.js
    │   └── styles                A folder to place all the styles for app
    │       ├── images
    │       │   └── icon.svg
    │       └── style.css
    ├── config                    A folder to place all the configuration files
    │   ├── assets               
    │   │   └── iparams.css
    │   │   └── iparams.js
    │   └── iparams.html
    │   └── requests.json         A JSON file holding all the request templates
    └── manifest.json             A JSON file holding meta data for app to run on platform
