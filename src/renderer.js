const fs   = require("fs");
const util = require("util");

module.exports = function render(filename) {
  const template = fs.readFileSync(filename).toString();
  const styles   = fs.readFileSync(__dirname +"/../public/style.css");

  return function render(error, req) {
    var html     = template;
    const params = {
      style:  styles,
      error:  `${error.name}: ${error.message}`,
      trace:  cleanTrace(error.stack),
      method: req.method,
      path:   req.path,
      contentType: req.get("Content-type") || "text/html",
      body:   util.inspect(req.body),
      params: util.inspect(req.params),
      query:  util.inspect(req.query)
    };

    for (var key in params) {
      var RE = new RegExp(`\\{\\{${key}\\}\\}`, "g");
      html = html.replace(RE, params[key]);
    }

    return html;
  };
};

function cleanTrace(stack) {
  const lines = stack.trim().split("\n").slice(1);
  const clean = [];

  for (var i=0; i < lines.length; i++) {
    var line = lines[i].trim();

    if (line.indexOf(" (/") !== -1) { break; }

    clean.push(line.replace(/^at\s+/, ''));
  }

  return clean.join("\n");
}
