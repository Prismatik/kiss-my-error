const logger   = require("./logger");
const renderer = require("./renderer");
const env      = process.env.NODE_ENV || "development";

module.exports = function(options) {
  return env === "production" ? productionMiddleware(options) :
         env === "test" ? basicMiddleware(options) : developmentMiddleware(options);
};

/**
 * Production middleware renders a minimal 500 page and tries to notify sentry
 *
 * @param {Object} options
 * @return {Function} middleware
 */
function productionMiddleware(options) {
  const render = renderer(__dirname + "/../public/500.html");
  const basic  = basicMiddleware(options, (err, req, res) => {
    res.status(500).send(render(err, req));
  });

  return function errorsHandler(err, req, res, next) {
    basic(err, req, res, next);
  };
}

/**
 * Development middleware, logs the error in STDOUT and renders an error page
 *
 * @param {Object} options
 * @return {Function} middleware
 */
function developmentMiddleware(options) {
  const render = renderer(__dirname + "/../public/500.dev.html");
  const basic  = basicMiddleware(options, (err, req, res) => {
    res.status(500).send(render(err, req));
  });

  return function errorsHandler(err, req, res, next) {
    basic(err, req, res, next);
  };
}

/**
 * Default middleware handler, just logs it into STDOUT
 *
 * @param {Object} options
 * @param {Function} callback
 * @return {Function} middleware
 */
function basicMiddleware(options, callback) {
  const log = logger(options);

  return function errorsHandler(err, req, res, next) {
    const status = err.status || err.statusCode || err.status_code || 500;

    if (status === 500) {
      log(err, req, () => {
        callback && callback(err, req, res);
        next(err, req, res);
      });
    } else {
      next(err);
    }
  };
}
