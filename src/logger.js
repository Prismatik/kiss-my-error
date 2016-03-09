const raven      = require("raven");
const parsers    = raven.parsers;
const SENTRY_DSN = process.env.SENTRY_DSN;

module.exports = SENTRY_DSN ? sentryLogger : dummyLogger;

function sentryLogger(options) {
  const client = new raven.Client(SENTRY_DSN);

  return function logger(error, request, callback) {
    client.captureError(err, parsers.parseRequest(request), callback);
  };
}

function dummyLogger(options) {
  return function logger(error, request, callback) {
    callback();
  };
}
