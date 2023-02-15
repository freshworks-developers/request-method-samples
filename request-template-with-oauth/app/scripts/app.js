var client;

(async function init() {
  client = await app.initialized();
  client.events.on('app.activated', renderAsanaInfo);
})();

//To demonstrate a simple GET request
async function getWorkspace() {
  const workspaceElement = document.querySelector('#workspacesCount');
  try {
    let workspace = await client.request.invokeTemplate("asanaGetWorkspace", {})
    let workspaceJSON = JSON.parse(workspace.response)
    workspaceElement.innerHTML = workspaceJSON.data.length;
  } catch (err) {
    workspaceElement.innerHTML = `-` + err;
  }
}

async function renderAsanaInfo() {
  await getWorkspace()
}