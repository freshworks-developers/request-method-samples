var client;

(async function init() {
  client = await app.initialized();
  client.events.on('app.activated', renderStarWarsInfo);
})();

//To demonstrate a simple GET request
async function getStarWarsChar() {
  const starwarsCharsElement = document.querySelector('#starWarsCharsCount');
  try {
    let starwarsChars = await client.request.invokeTemplate("getStarWarsPeople", {})
    let starwarsCharsJSON = JSON.parse(starwarsChars.response)
    starwarsCharsElement.innerHTML = starwarsCharsJSON.count;
  } catch (err) {
    starwarsCharsElement.innerHTML = `-` + err;
  }
}

//To demonstrate a GET request with url path parameters
async function getStarWarsCharDetails() {
  const charNameElement = document.querySelector('#charName');
  const vehicleElement = document.querySelector('#vehiclesCount');
  const starshipsElement = document.querySelector('#starshipsCount');
  try {
    let starwarsCharDetail = await client.request.invokeTemplate("getStarWarsPeopleDetails", { "context": { "id": "1" } })
    let starwarsCharsDetailJSON = JSON.parse(starwarsCharDetail.response)
    charNameElement.innerHTML = starwarsCharsDetailJSON.name
    vehicleElement.innerHTML += starwarsCharsDetailJSON.vehicles.length
    starshipsElement.innerHTML += starwarsCharsDetailJSON.starships.length
  } catch (err) {
    charNameElement.innerHTML += `-`;
    vehicleElement.innerHTML += `-`;
    starshipsElement.innerHTML += `-`;
  }
}

//To demonstrate a GET request with url query parameters
async function searchForStarship() {
  const starshipNameElement = document.querySelector('#starshipName');
  const starshipModelElement = document.querySelector('#starshipModel');
  const starshipManufracturerElement = document.querySelector('#starshipManufacturer');
  const starshipClassElement = document.querySelector('#starshipClass');
  try {
    let starshipDetail = await client.request.invokeTemplate("starwarsStarshipSearch", { "context": { "starshipname": "Death Star" } })
    let starshipDetailJSON = JSON.parse(starshipDetail.response)
    starshipNameElement.innerHTML = starshipDetailJSON.results[0].name
    starshipModelElement.innerHTML += starshipDetailJSON.results[0].model
    starshipManufracturerElement.innerHTML += starshipDetailJSON.results[0].manufacturer
    starshipClassElement.innerHTML += starshipDetailJSON.results[0].starship_class
  } catch (err) {
    starshipNameElement.innerHTML += `-`;
    starshipModelElement.innerHTML += `-`;
    starshipManufracturerElement.innerHTML += `-`;
    starshipClassElement.innerHTML += `-`;
  }
}

//Invoking SMI which has the host as parameter supported only in Serverless
async function invokeSMIWithDynamicHost() {
  try {
    let res = await client.request.invoke("usingDynamicHost", {})
    console.log(res)
  } catch (error) {
    console.error(error)
  }
}

//dynamicQueryParams request template supporting dynamic query params
async function invokeWithDynamicQueryParams() {
  try {
    //SMI uses a status filter 
    let statusFilterRes = await client.request.invoke("usingQueryParams", { queryString: "\"status:2 OR status:3 OR status:6 OR status:7\"" })
    console.log("Ticket filter with all unresolved", statusFilterRes)
    //Request method uses priority filter in the query params.
    let priorityFilterRes = await client.request.invokeTemplate("dynamicQueryParams", { "context": {}, "query": { "query": "\"priority:3\"" } })
    console.log("Ticket filter with high priority", priorityFilterRes)
    //Request method to list all tickets sorted with latest updated with query params defined in request.json
    let latestUpdateTicketList = await client.request.invokeTemplate("listAllTickets", { "context": {}, "query": { "include": "stats" } })
    console.log("Tickets sorted with latest updated", latestUpdateTicketList)
    //Request method to list all tickets sorted by due by 
    let dueByTicketList = await client.request.invokeTemplate("listAllTickets", { "context": {}, "query": { "order_by": "due_by", "include": "stats" } })
    console.log("Request method response to list tickets", dueByTicketList)
    if (latestUpdateTicketList.response === dueByTicketList.response)
      console.log("Request method responds with latest updated tickets with stats as query params defined in request.json have higher precedence")
    //Request method responds with latest updated tickets with stats as query params defined in request.json have higher precedence
  } catch (error) {
    console.error(error)
  }
}

async function invokeRequestMethodWith2WaySSL() {
  //Request method which uses client-side certificates, host, path and authorization for 2-way SSL configured with app_settings
  let merchantSearch = await client.request.invokeTemplate("visaMerchantSearch", {
    body: JSON.stringify({
      "searchOptions": {
        "matchScore": "true",
        "maxRecords": "10",
        "matchIndicators": "true",
        "proximity": [
          "merchantName"
        ],
        "wildCard": [
          "merchantName"
        ]
      },
      "header": {
        "startIndex": "0",
        "requestMessageId": "VCO_GMR_001",
        "messageDateTime": "2015-08-28T22:05:00.000"
      },
      "searchAttrList": {
        "merchantPhoneNumber": "4153440351",
        "merchantCity": "San Francisco",
        "merchantCountryCode": "840",
        "merchantPostalCode": "94107",
        "paymentAcceptanceMethod": "F2F",
        "visaStoreId": "161688518",
        "merchantStreetAddress": "280 King St",
        "merchantState": "CA",
        "merchantName": "starbucks ",
        "terminalType": "SWIPE"
      },
      "responseAttrList": [
        "GNSTANDARD"
      ]
    })
  })
  console.log("Response from request method using 2 way SSL", JSON.stringify(merchantSearch.response))
}

async function renderStarWarsInfo() {
  await getStarWarsChar()
  await getStarWarsCharDetails()
  await searchForStarship()
  await invokeSMIWithDynamicHost()
  await invokeWithDynamicQueryParams()
  await invokeRequestMethodWith2WaySSL()
}