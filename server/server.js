function buildInvokePayload(args) {
  const payload = { context: (args && args.context) || {} };
  if (args && args.body !== undefined) {
    payload.body = args.body;
  }
  if (args && args.query !== undefined) {
    payload.query = args.query;
  }
  return payload;
}

exports = {
  invokeRequestTemplate: async function (args) {
    const templateName = args && args.templateName;
    if (!templateName) {
      renderData({ message: 'templateName is required' });
      return;
    }

    try {
      const result = await $request.invokeTemplate(
        templateName,
        buildInvokePayload(args)
      );
      renderData(null, result);
    } catch (error) {
      console.error('invokeRequestTemplate failed', error);
      renderData(error);
    }
  }
};
