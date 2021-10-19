asPageLoads();
console.log('page rendering')
function asPageLoads() {
  document.readyState != 'loading'
    ? console.log('page is rendering')
    : document.addEventListener('DOMContentLoaded', getTicketsInfo);
}

async function getTicketsInfo() {
  var client = await app.initialized();

}
