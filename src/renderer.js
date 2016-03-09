const fs = require("fs");

module.exports = function render(filename) {
  const template = fs.readFileSync(filename).toString();
  const styles   = fs.readFileSync(__dirname +"/../public/style.css");

  return function render(error, req) {
    var html     = template;
    const params = {
      style: styles,
      error: error.message,
      trace: error.stacktrace
    };


    for (var key in params) {
      const RE = new RegExp(`\\{\\{${key}\\}\\}`, "g");
      html = html.replace(RE, params[key]);
    }

    return html;
  };
};
