const fs       = require("fs");
const logger   = require("./logger");
const renderer = require("./renderer");
const env      = process.env.NODE_ENV || "development";

module.exports = function(options) {
  return env === "production" ? productionMiddleware(options) :
         env === "test" ? testMiddleware(options) : developmentMiddleware(options);
};

/**
 * Production middleware renders a minimal 500 page and tries to notify sentry
 *
 * @param {Object} options
 * @return {Function} middleware
 */
function productionMiddleware(options) {
  const render = renderer(getProductionErrorTemplate());
  return basicMiddleware(options, (err, req, res) => {
    res.status(500).send(render(err, req));
  });
}

/**
 * Development middleware, logs the error in STDOUT and renders an error page
 *
 * @param {Object} options
 * @return {Function} middleware
 */
function developmentMiddleware(options) {
  const render = renderer(__dirname + "/../public/500.dev.html");
  return basicMiddleware(options, (err, req, res) => {
    res.status(500).send(render(err, req));
  });
}

/**
 * The test environemnt middleware, doesn't do anything
 *
 * @params {Object} options
 * @return {Function} middleware
 */
function testMiddleware(options) {
  return basicMiddleware(options, () => {});
}

/**
 * Default middleware handler
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
        callback(err, req, res);
        next(err, req, res);
      });
    } else {
      next(err);
    }
  };
}

/**
 * Tries to use the project local `public/500.html` error page
 * if that is not found then it uses the default one that came
 * with the package
 *
 * @return {string} template filename
 */
function getProductionErrorTemplate() {
  var template = process.cwd() + "/public/500.html";

  try {
    fs.statSync(template);
    return template;
  } catch (e) {
    return __dirname + "/../public/500.html";
  }
}
