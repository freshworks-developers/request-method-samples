var client;

(async function init() {
  client = await app.initialized();
  client.events.on('app.activated', renderStarWarsInfo);
})();


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
  const usingQueryParams = document.querySelector('#usingQueryParams');
  const dynamicQueryParams = document.querySelector('#dynamicQueryParams');
  const listAllTickets = document.querySelector('#listAllTickets');
  try {
    //SMI uses a status filter 
    let statusFilterRes = await client.request.invoke("usingQueryParams", { queryString: "\"status:2 OR status:3 OR status:6 OR status:7\"" })
    console.log("Ticket filter with all unresolved", statusFilterRes)
    let statusFilter = JSON.parse(statusFilterRes.response.response)
    usingQueryParams.innerHTML += statusFilter.total;
    //Request method uses priority filter in the query params.
    let priorityFilterRes = await client.request.invokeTemplate("dynamicQueryParams", { "context": {}, "query": { "query": "\"priority:3\"" } })
    console.log("Ticket filter with high priority", priorityFilterRes)
    let piorityFilter = JSON.parse(priorityFilterRes.response)
    console.log(piorityFilter)
    dynamicQueryParams.innerHTML += piorityFilter.total;
    //Request method to list all tickets sorted with latest updated with query params defined in request.json
    let latestUpdateTicketList = await client.request.invokeTemplate("listAllTickets", { "context": {}, "query": { "include": "stats" } })
    console.log("Tickets sorted with latest updated", latestUpdateTicketList)
    let alltickets = JSON.parse(latestUpdateTicketList.response)
    listAllTickets.innerHTML += alltickets.length;
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

async function renderStarWarsInfo() {
  await invokeSMIWithDynamicHost()
  await invokeWithDynamicQueryParams()
}