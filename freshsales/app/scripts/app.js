var client;

(async function init() {
  client = await app.initialized();
  client.events.on('app.activated', renderApp);
})();

async function renderApp() {
  let comicElement = document.querySelector('.api-get-comic');
  let displayJsonElement = document.querySelector('.api-get-json');
  comicElement.addEventListener('fwClick', renderImageInSidebar);
  displayJsonElement.addEventListener('fwClick', openModal);
}

async function renderImageInSidebar() {
  const displayComic = document.querySelector('.apptext');

  let err, response;
  let options = { client: true };

  [err, response] = await to(client.request.get('https://xkcd.com/info.0.json', options));
  if (err) {
    console.error(err);
    displayComic.innerHTML = `
    <center> There is a problem with xkcd. App is not able to fetch the image for the user. </center>
    `;
  }

  const { img, safe_title } = response;
  const imagePlaceholder = `<center>
    <a href="${img}" target="_blank">
        <img src="${img}" width="100%"></img><br/>
      </a>
      <b>${safe_title}</b><br/>
      <small>(Click the image to see the cartoon)</small>
    </center>`;

  displayComic.innerHTML = imagePlaceholder;
}

async function openModal() {
  let err, response;
  let options = {
    headers: {
      Authorization: `Token token= <%= encode(iparam.api_key) %>`,
      'Content-Type': 'application/json'
    }
  };

  let {
    productContext: { url }
  } = await client.data.get('domainName');

  [err, response] = await to(client.request.get(`${url}/api/sales_activites`, options));
  console.log(response);
  if (err) {
    console.error('We had unknown problems gettting sales activities');
  }
  await client.interface.trigger('showModal', {
    title: 'Sales Activites',
    template: 'views/modal.html',
    data: response
  });
}

function closePopup() {
  client.instance.close();
}

// utility fn to avoid excessive try..catchs
function to(promise, improved) {
  return promise
    .then((data) => {
      return [null, data];
    })
    .catch((err) => {
      if (improved) {
        Object.assign(err, improved);
      }
      return [err];
    });
}
