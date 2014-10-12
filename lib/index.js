module.exports = regio;

var http = require('http'),
    router = require('./router'),

    request = require('./request'),
    response = require('./response');

regio.router = router;

function regio() {
  var app = router();

  // install default middlewares
  app.use(request(app));
  app.use(response);

  app.listen = function listen() {
    var server = http.createServer(this);

    app._server = server;

    return server.listen.apply(server, arguments);
  };

  return app;
}
