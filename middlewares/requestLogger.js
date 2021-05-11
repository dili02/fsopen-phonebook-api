const requestLogger = (tokens, request, response) => {
  let formatLooger = [
    tokens.method(request, response),
    tokens.url(request, response),
    tokens.status(request, response),
    tokens.res(request, response, "content-length"),
    "-",
    tokens["response-time"](request, response),
    "ms",
  ];

  if (request.method === "POST") {
    formatLooger = formatLooger.concat(JSON.stringify(request.body));
  }

  return formatLooger.join(" ");
};

module.exports = requestLogger;
