var client;

(async function init() {
  client = await app.initialized();
  client.events.on('app.activated', async function () {
    let contacts = await getContacts();
    renderPayload(contacts);
  });
})();

async function getContacts() {
  
  let [err, response] = await to(client.request.invokeTemplate("getContacts", {}));
  if (err) {
    console.error('API request to get asset details failed.', err);
  }
  return response;
}

function renderPayload(payload) {
  let displaySpace = document.querySelector('.res-placeholder');
  let { name, id } = payload.assets[0];
  displaySpace.innerHTML = `
  Data received from Freshservice:
  ${id} and ${name}
  `;
}

function to(promise, improved) {
  return promise
    .then((data) => {
      data = JSON.parse(data.response);
      return [null, data];
    })
    .catch((err) => {
      if (improved) {
        Object.assign(err, improved);
      }
      return [err];
    });
}
