asPageLoads();

function asPageLoads() {
  document.readyState != 'loading'
    ? console.log('page is rendering')
    : document.addEventListener('DOMContentLoaded', initApp);
}

async function initApp() {
  var client = await app.initialized();
  let options = { client: true };
  const displayElement = document.getElementById('apptext');
  try {
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

    let { subdomain } = await client.iparams.get('subdomain');
    const URL = `https://${subdomain}.freshdesk.com/api/v2/contacts`;
    var authOpts = {
      headers: {
        Authorization: `Basic <%= encode(iparam.api_key) %>`, // substitution happens by platform
        'Content-Type': 'application/json'
      }
    };

    let { response } = await client.request.get(URL, authOpts);
    console.info(response);
  } catch (error) {
    console.error(`Request failed: ${error}`);
  }
}
