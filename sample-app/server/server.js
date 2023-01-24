exports = {
    events: [
        { event: 'onTicketCreate', callback: 'onTicketCreateCallback' }
    ],
    onTicketCreateCallback: async function (payload) {
        let ticket = payload.data.ticket
        await $request.invokeTemplate("replyTicket", {
            context: {
                id: ticket.id
            },
            body: JSON.stringify({ 
                "body": "Thanks for reporting, while this is an automated reply we are working on resolving it." 
            })
        })
    }
}