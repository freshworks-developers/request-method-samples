var client;

(async function init() {
  client = await app.initialized();
  try {
    client.events.on('app.activated', displayImageInSidebar);
  } catch (error) {
    console.error(`Request failed: ${error}`);
  }
})();

async function displayImageInSidebar() {
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
}

function to(promise) {
  return promise
    .then((data) => {
      return [null, data];
    })
    .catch((err) => [err]);
}
