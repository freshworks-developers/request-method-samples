var client;

(async function init() {
  client = await app.initialized();
  client.events.on('app.activated', renderImageInSidebar);
})();

async function renderImageInSidebar() {
  const displayElement = document.querySelector('.apptext');
  let err, response;
  let options = { client: true };

  [err, response] = await to(client.request.invokeTemplate("getComicData", {}));
  if (err) {
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

// utility fn to avoid exessive ussage of try..catch blocks
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
