var regio = require('../../lib/');

app = regio();

app.get('/get', function (req, res, next) {
  res.status(200).end();
});

app.post('/post', function (req, res, next) {
  res.status(202).end();
});

app.get('/getJson', function (req, res, next) {
  res.status(200).send({
    test: 'test'
  }).end();
});

app.get('/noMethod', function (req, res, next) {
  res.status(200).end();
});

app.all('/allRoute', function (req, res, next) {
  res.status(202).end();
});

app.get('/middleware', function (req, res, next) {
  req.passed = 'middleware';
  next();
});

app.get('/middleware', function (req, res, next) {
  res.status(200).send({
    result: req.passed
  }).end();
});

app.get('/async', function (req, res, next) {
  setTimeout(function () {
    res.status(202).end();
  }, 100);
});

app.get('/err', function (req, res, next) {
  next(new Error('some error'));
});

var mw = regio.router();

mw.get('/test', function (req, res) {
  res.status(202).end();
});

var inner = regio.router();

inner.get('/test', function (req, res) {
  res.status(202).end();
});

inner.get('/err', function (req, res, next) {
  next(new Error('some error'));
});

mw.use('/inner-mw', inner);

app.use('/mw', mw);

app.get('/a/:param', function (req, res) {
  res.status(200).send(req.params).end();
});

app.get('/a/:param/abc', function (req, res) {
  res.status(200).send(req.params).end();
});

app.get('/a/:param/abc/:foo', function (req, res) {
  res.status(200).send(req.params).end();
});

module.exports = app;
