var client;

(async function init() {
  client = await app.initialized();
  client.events.on('app.activated', renderApp);
})();

async function renderApp() {
  let openModalBtn = document.querySelector('.modal-opener');
  openModalBtn.addEventListener('click', renderImageInSidebar);
}

async function renderImageInSidebar() {
  const displayElement = document.querySelector('.api-get-comic');
  let err, response;
  let options = { client: true };

  [err, response] = await to(client.request.get('https://xkcd.com/info.0.json', options));
  if (err) {
    console.error(err);
    displayElement.innerHTML = `
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

  displayElement.innerHTML = imagePlaceholder;
}

function closePopup() {
  client.instance.close();
}

// utility fn to avoid excessive try..catchs
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
