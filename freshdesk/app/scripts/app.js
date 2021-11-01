document.addEventListener('DOMContentLoaded', () => renderApp());

async function renderApp() {
  try {
    client.events.on('app.activated', async function () {
      const displayElement = document.getElementById('apptext');
      let options = { client: true };
      let comicPayload = await client.request.get('https://xkcd.com/info.0.json', options);
      const { img, safe_title } = JSON.parse(comicPayload.response);
      const imagePlaceholder = `<center>
  <a href="${img}" target="_blank">
      <img src="${img}" width="100%"></img><br/>
    </a>
    <b>${safe_title}</b><br/>
    <small>(Click the image to see the cartoon)</small>
  </center>`;

      displayElement.innerHTML = imagePlaceholder;
    });

    let { subdomain } = await client.iparams.get('subdomain');
    const URL = `https://${subdomain}.freshdesk.com/api/v2/contacts`;
    var authOpts = {
      headers: {
        Authorization: `Basic <%= encode(iparam.api_key) %>`, // substitution happens by platform
        'Content-Type': 'application/json'
      }
    };

    let { response } = await client.request.get(URL, authOpts);
    console.info('Request succeeded');
    console.info(JSON.parse(response));
  } catch (error) {
    console.error(`Request failed: ${error}`);
  }
}
