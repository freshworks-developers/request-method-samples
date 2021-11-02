try {
  let { subdomain } = await client.iparams.get('subdomain');
  const URL = `https://${subdomain}.freshdesk.com/api/v2/contacts`;
  var authOpts = {
    headers: {
      Authorization: `Basic <%= encode(iparam.api_key) %>`, // substitution happens by platform
      'Content-Type': 'application/json'
    }
  };

  let { response } = await client.request.get(URL, authOpts);
  console.info('Request succeeded');
  console.info(JSON.parse(response));
} catch (error) {
  console.log(error);
}
