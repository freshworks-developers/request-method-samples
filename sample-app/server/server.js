exports = {
  events: [{ event: "onTicketCreate", callback: "onTicketCreateCallback" }],
  onTicketCreateCallback: async function (payload) {
    let ticket = payload.data.ticket;
    try {
      await $request.invokeTemplate("replyTicket", {
        context: {
          id: ticket.id,
        },
        body: JSON.stringify({
          body: "Thanks for reporting, while this is an automated reply we are working on resolving it.",
        }),
      });
    } catch (error) {
      console.error(error);
    }
  },

  getTicketDetails: async function (payload) {
    try {
      let result = await $request.invokeTemplate("getTicketWithId", {
        context: {
          id: payload.id,
        },
      });
      renderData(null, { response: JSON.parse(result.response) });
    } catch (error) {
      console.error(error);
    }
  },
};
