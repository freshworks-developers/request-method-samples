let client;
let subdomainField;
let apiKeyField;
let validateField;

// Invoked by platform on Edit Settings
/* eslint-disable no-unused-vars */
function getConfigs(configs) {
  subdomainField.value = configs.subdomain || '';
}

// Invoked by platform on Install / Save
function postConfigs() {
  return {
    __meta: {
      secure: ['api_key']
    },
    subdomain: subdomainField.value.trim(),
    api_key: apiKeyField.value
  };
}

// Invoked by platform before save
async function validate() {
  let isValid = true;

  if (!subdomainField.value.trim()) {
    subdomainField.setAttribute('state', 'error');
    subdomainField.setAttribute('error-text', 'Subdomain is required');
    isValid = false;
  }

  if (!apiKeyField.value.trim()) {
    apiKeyField.setAttribute('state', 'error');
    apiKeyField.setAttribute('error-text', 'API key is required');
    isValid = false;
  }

  if (!isValid) {
    return false;
  }

  if (validateField?.checked) {
    try {
      await client.request.invokeTemplate('validateCredentials', {
        context: {
          domain: subdomainField.value.trim() + '.freshdesk.com',
          api_key: apiKeyField.value.trim()
        }
      });
    } catch (error) {
      apiKeyField.setAttribute('state', 'error');
      apiKeyField.setAttribute(
        'error-text',
        error.message || 'API validation failed — check subdomain and key'
      );
      return false;
    }
  }

  return true;
}
/* eslint-enable no-unused-vars */

init();

async function init() {
  client = await app.initialized();
  subdomainField = document.querySelector('.subdomain-field');
  apiKeyField = document.querySelector('.api-key-field');
  validateField = document.querySelector('.validate-field');
}
