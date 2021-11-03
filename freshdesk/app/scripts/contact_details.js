var client;

(async function init() {
  client = await app.initialized();
  console.log('app is invoked');
  client.events.on('app.activated', async () => {
    let contacts = await getContacts();
    renderPayload(contacts);
  });
})();

async function getContacts() {
  let err, reply;
  let { subdomain } = await client.iparams.get('subdomain');
  const URL = `https://${subdomain}.freshdesk.com/api/v2/contacts`;
  var authOpts = {
    headers: {
      Authorization: `Basic <%= encode(iparam.api_key) %>`, // substitution happens by platform
      'Content-Type': 'application/json'
    }
  };

  [err, reply] = await to(client.request.get(URL, authOpts));
  console.log(reply);
  if (err) console.error('Request failed \nReason', err);
  let { response } = reply;
  return JSON.parse(response);
}

async function renderPayload(jsonData) {
  let display = document.querySelector('.auth-call');
  let { name, id } = jsonData[0];
  display.innerHTML = `
  Data received from Freshdesk: <br>
  ${id} and ${name}`;
}

function to(promise, improved) {
  return promise
    .then((data) => [null, data])
    .catch((err) => {
      if (improved) {
        Object.assign(err, improved);
      }
      return [err];
    });
}
