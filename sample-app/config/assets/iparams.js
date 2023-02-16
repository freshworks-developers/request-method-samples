let domain = document.querySelector(".domain");
let apiKey = document.querySelector(".secure-field");

function postConfigs() {
  return {
    __meta: {
      secure: ["apiKey"],
    },
    api_key: apiKey.value,
    subdomain: domain.value,
  };
}

function getConfigs(configs) {
  let { api_key, subdomain } = configs;
  apiKey.value = api_key;
  domain.value = subdomain;
  return;
}

async function validate() {
  try {
    var res = await client.request.invokeTemplate("iparamValidate", {
      context: {
        subdomain: domain.value,
        api_key: apiKey.value,
      },
    });
    var { status } = res;
    if (status == 200) return true;
    else return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

document.onreadystatechange = function () {
  if (document.readyState === "interactive") renderApp();
  async function renderApp() {
    try {
      let client = await app.initialized();
      window.client = client;
    } catch (error) {
      return console.error(error);
    }
  }
};
