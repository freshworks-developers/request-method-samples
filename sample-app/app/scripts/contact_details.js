var client;

(async function init() {
  client = await app.initialized();
  console.log("app is invoked");
  client.events.on("app.activated", async () => {
    let contacts = await getContacts();
    renderPayload(contacts);
    await getTicketDetails();
  });
})();

async function getContacts() {
  let err, reply;
  [err, reply] = await to(client.request.invokeTemplate("getContacts", {}));
  console.log(reply);
  if (err) console.error("Request failed \nReason", err);
  let { response } = reply;
  return JSON.parse(response);
}

async function getTicketDetails() {
  [err, reply] = await to(
    client.request.invoke("getTicketDetails", { id: "136" })
  );
  console.log(reply);
  if (err) console.error("Request failed \nReason", err);
}

async function renderPayload(jsonData) {
  let display = document.querySelector(".auth-call");
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
