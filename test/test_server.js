var port = 8080,
    baseUrl = 'http://localhost:' + port;

var app = require('./support/server');

var server = app.listen(8080, function() {
  console.log('app started on port', server.address().port);
});
