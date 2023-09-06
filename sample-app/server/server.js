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
        } catch (error) {
            console.error(error)
        }
    },
    usingDynamicHost:async function (){
        //Request method invocation with $request.invokeTemplate that allows host substitution from context only in Serverless functions
        let result
        try{
            result =await $request.invokeTemplate("dynamicHost", {
                context:{
                    host:"swapi.dev"
                }
            })
            console.log("Dynamic Host :",result)
        }catch(error){
            console.error(error)
        }
        renderData(null,result)
    },
    usingQueryParams: async function (options){
        //Request method invocation with $request.invokeTemplate that allows dynamic query parameters
        let result
        try{
            result =await $request.invokeTemplate("dynamicQueryParams", {
                context:{},
                query:{
                    query:options.queryString
                }
            })
            console.log("Dynamic Query Params :",result)
        }catch(error){
            console.error(error)
        }
        renderData(null,result)
    }
}