const env = process.env.NODE_ENV || "development";

module.exports = function(options) {
  return env === "production" ? productionMiddleware(options) :
         env === "test" ? defaultMiddleware(options) : developmentMiddleware(options);
};


/**
 * Production middleware renders a minimal 500 page and tries to notify sentry
 *
 * @param {Object} options
 * @return {Function} middleware
 */
function productionMiddleware(options) {
  return function errorsHandler(err, req, res, next) {
    defaultMiddleware()(err, req, res, next);
  };
}

/**
 * Development middleware, logs the error in STDOUT and renders an error page
 *
 * @param {Object} options
 * @return {Function} middleware
 */
function developmentMiddleware(options) {
  return function errorsHandler(err, req, res, next) {
    defaultMiddleware()(err, req, res, next);
  };
}

/**
 * Default middleware handler, just logs it into STDOUT
 *
 * @param {Object} options
 * @return {Function} middleware
 */
function defaultMiddleware(options) {
  return function errorsHandler(err, req, res, next) {
    err ? next(err) : next();
  };
}
