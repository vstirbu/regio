# regio

Minimalist web framework with express-like aspirations, targeted at embedded devices like [Tessel](https://tessel.io) and [Espruino](http://www.espruino.com). Therefore, instead being a mighty express it is just a regional train...

[![Build Status](https://travis-ci.org/vstirbu/regio.svg?branch=master)](https://travis-ci.org/vstirbu/regio) [![Code Climate](https://codeclimate.com/github/vstirbu/regio/badges/gpa.svg)](https://codeclimate.com/github/vstirbu/regio) [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vstirbu/regio?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

## Motivation

So why another framework?

This framework started as a test suite while investigating how to get [express](http://expressjs.com) running on Tessel.

Because there were simply too many moving parts in slimming down express, I've decided to start with a clean slate and incorporate express middlewares one at a time.

In the process I found out that there is quite a lot of stuff to handle pre 4.x API, disambiguation of function parameters and also too many convenience methods for such a constrained environment as on the devices I was targeting.

So, I've decided to keep the test framework around and use express middleware and components where it does feel appropriate, especially as Espruino is also a target environment.

## Installation

```sh
npm install regio
```

## Usage

```javascript
var regio = require('regio');

var app = regio();

app.get('/', function(req, res) {
  res.status(200).send({
    message: 'Hello World'
  }).end();
});

app.use(function (req, res, next) {
  req.message = 'added by middleware';
  next();
});

var subapp = regio.router();

subapp.get('/', function(req, res) {
  res.status(200).send({
    message: 'I\'m a mounted application'
  }).end();
});

subapp.on('active', function() {
  // server is up, I can receive requests
});

app.use('/mounted', subapp);

var server = app.listen(8080, function() {
  console.log('app started on port', server.address().port);
});
```

## Express compatibility

* Application
  * regio() similar to [express()](http://expressjs.com/4x/api.html#express)
  * [use](http://expressjs.com/4x/api.html#app.use)
  * [all](http://expressjs.com/4x/api.html#app.all)
  * [listen](http://expressjs.com/4x/api.html#app.listen)
  * mountpath

* Request
  * req.params

* Response
  * res.status
  * res.set
  * res.get
  * res.send

* Router
  * [router()](http://expressjs.com/4x/api.html#router)
  * [router.use](http://expressjs.com/4x/api.html#router.use)
  * [router.VERB](http://expressjs.com/4x/api.html#router.VERB)
  * [router.all](http://expressjs.com/4x/api.html#router.all)
  * events
    * _mounted_ is triggered when router is mounted
    * _active_ is triggered when server is listening

Middleware
  * can be used application and router level, using ```.use``` or ```.verb```.

## Tests

Currently the test run in node but the plan is to move them to colony.

```sh
npm test
```
