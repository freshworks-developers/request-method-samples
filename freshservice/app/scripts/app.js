var client;

(async function init() {
  client = await app.initialized();
  client.events.on('app.activated', renderImageInSidebar);
})();

async function renderImageInSidebar() {
  const displayElement = document.querySelector('.apptext');
  let response;
  try {
    let comicResponse = await client.request.invokeTemplate("getComicData", {})
    response = JSON.parse(comicResponse.response)
    const { img, safe_title } = response;
    const imagePlaceholder = `<center>
    <a href="${img}" target="_blank">
        <img src="${img}" width="100%"></img><br/>
      </a>
      <b>${safe_title}</b><br/>
      <small>(Click the image to see the cartoon)</small>
    </center>`;
    displayElement.innerHTML = imagePlaceholder;
  } catch (err) {
    displayElement.innerHTML = `
    <center> There is a problem with xkcd. App is not able to fetch the image for the user. </center>
    `;
  } 
}