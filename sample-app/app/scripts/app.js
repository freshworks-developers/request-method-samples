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

async function renderStarWarsInfo() {
  await getStarWarsChar()
  await getStarWarsCharDetails()
  await searchForStarship()
}