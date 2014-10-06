var test = require('tape'),
    request = require('superagent'),
    port = 8080,
    baseUrl = 'http://localhost:' + port;

var app = require('./support/server');

var server = app.listen(8080, function() {
  console.log('app started on port', server.address().port);
});

test('get', function (t) {
  request.get(baseUrl + '/get').end(function (res) {
    t.equal(res.status, 200, 'response status is 200');
    t.end();
  });
});

test('no method', function (t) {
  request.post(baseUrl + '/noMethod').end(function (res) {
    t.equal(res.status, 404, 'route with no method');
    t.end();
  });
});

test('post', function (t) {
  request.post(baseUrl + '/post').end(function (res) {
    t.equal(res.status, 202);
    t.end();
  });
});

test('JSON response', function (t) {
  request.get(baseUrl + '/getJson').end(function (res) {
    t.deepEqual(res.body, { test: 'test' }, 'response body is JSON');
    t.end();
  });
});

test('404', function (t) {
  request.get(baseUrl + '/nonExistentRoute').end(function (res) {
    t.equal(res.status, 404, 'response status is 404');
    t.end();
  });
});

test('all', function (t) {
  request.get(baseUrl + '/allRoute').end(function (res) {
    t.equal(res.status, 202, 'get request on all route');
    request.post(baseUrl + '/allRoute').end(function (res) {
      t.equal(res.status, 202, 'post request on all route');
      t.end();
    });
  });
});

test('middleware', function (t) {
  request.get(baseUrl + '/middleware').end(function (res) {
    t.deepEqual(res.body, { result: 'middleware'}, 'middleware result');
    t.end();
  });
});

test('params', function (t) {
  request.get(baseUrl + '/pathWith/123').end(function (res) {
    t.deepEqual(res.body, { param: '123' }, 'get parameters values');
    t.end();
  });
});

test('mw-success', function (t) {
  request.get(baseUrl + '/mw/test').end(function (res) {
    t.equal(res.status, 202, 'use middleware');
    t.end();
  });
});

test('mw-fail', function (t) {
  request.get(baseUrl + '/mw/test-notfound').end(function (res) {
    t.equal(res.status, 404, 'use middleware');
    t.end();
  });
});

test('inner-mw-success', function (t) {
  request.get(baseUrl + '/mw/inner-mw/test').end(function (res) {
    t.equal(res.status, 202, 'use inner middleware');
    t.end();
  });
});

test('close', function (t) {
  server.close(function () {
    t.end();
  });
});
