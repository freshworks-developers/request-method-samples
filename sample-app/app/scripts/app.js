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
async function searchForStarship(){
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
async function invokeSMIWithDynamicHost(){
  try{
    let res = await client.request.invoke("usingDynamicHost",{})
    console.log(res)
  }catch(error){
    console.error(error)
  }
}
//dynamicQueryParams request template supporting dynamic query params
async function invokeSMIWithDynamicQueryParams(){
  try{
    //SMI uses a status filter and 
    let statusFilterRes = await client.request.invoke("usingQueryParams",{queryString:"\"status:2 OR status:3 OR status:6 OR status:7\""})
    console.log("Ticket filter with all unresolved",statusFilterRes)
    //Request method uses priority filter in the query params.
    let priorityFilterRes = await client.request.invokeTemplate("dynamicQueryParams", { "context": {}, "query":{"query":"\"priority:3\""} })
    console.log("Ticket filter with high priority",priorityFilterRes)
  }catch(error){
    console.error(error)
  }
}

async function renderStarWarsInfo() {
  await getStarWarsChar()
  await getStarWarsCharDetails()
  await searchForStarship()
  await invokeSMIWithDynamicHost()
  await invokeSMIWithDynamicQueryParams()
}