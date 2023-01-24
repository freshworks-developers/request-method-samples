var client;

(async function init() {
  client = await app.initialized();
  client.events.on('app.activated', async function () {
    console.log(await client.iparams.get())
    let assets = await getAssests();
    renderPayload(assets);
  });
})();

async function getAssests() {
  let assetsData
  try{
  let response = await client.request.invokeTemplate("getAssests", {});
  console.log(response)
  assetsData = JSON.parse(response.response)
  }catch(err) {
    console.error('API request to get asset details failed.', err);
  }
  return assetsData;
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
