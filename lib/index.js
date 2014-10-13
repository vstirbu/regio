module.exports = regio;

var http = require('http'),
    router = require('./router'),

    request = require('./request'),
    response = require('./response'),
    address = require('./middleware/address'),

    ipAddress = require('./utils/ip-address.js');

regio.router = router;

function regio() {
  var app = router();

  // install default middlewares
  app.use(request(app));
  app.use(response);
  app.use(address(app));

  app.listen = function listen() {
    var server = http.createServer(this);

    app._server = server;

    server.on('listening', function () {
      app.address = {
        port: server.address().port,
        address: ipAddress(),
        family: 'IPv4'
      };

      app.emit('active', app.address);
    });

    return server.listen.apply(server, arguments);
  };

  return app;
}
