exports = {
  events: [
    { event: 'onTicketCreate', callback: 'onTicketCreateCallback' }
  ],
  onTicketCreateCallback: async function (payload) {
    //Request method invocation from Serverless with $request.invokeTemplate
    let ticket = payload.data.ticket
    try {
      await $request.invokeTemplate("replyTicket", {
        context: {
          id: ticket.id
        },
        body: JSON.stringify({
          "body": "Thanks for reporting, while this is an automated reply we are working on resolving it."
        })
      })
      //Request method invocation uses client-side certificates, host, path and authorization for 2 way SSL with dynamic hosts from app_settings
      let forexRate = await $request.invokeTemplate("visaGetForexRate", {
        context: {
          host: payload.app_settings.visaForex.host,
          path: payload.app_settings.visaForex.path,
        },
        body: JSON.stringify({
          destinationCurrencyCode: "826",
          rateProductCode: "A",
          sourceAmount: "100",
          sourceCurrencyCode: "840"
        })
      })
      console.log("Response from request method which uses 2-way SSL and dynamic hosts with values configured from app_settings", JSON.stringify(forexRate.response))
    } catch (error) {
      console.error(error)
    }
  },
  usingDynamicHost: async function () {
    //Request method invocation with $request.invokeTemplate that allows host substitution from context only in Serverless functions
    let result
    try {
      result = await $request.invokeTemplate("dynamicHost", {
        context: {
          host: "swapi.dev"
        }
      })
      console.log("Dynamic Host :", result)
    } catch (error) {
      console.error(error)
    }
    renderData(null, result)
  },
  usingQueryParams: async function (options) {
    //Request method invocation with $request.invokeTemplate that allows dynamic query parameters
    let result
    try {
      result = await $request.invokeTemplate("dynamicQueryParams", {
        context: {},
        query: {
          query: options.queryString
        }
      })
      console.log("Dynamic Query Params :", result)
    } catch (error) {
      console.error(error)
    }
    renderData(null, result)
  }
}