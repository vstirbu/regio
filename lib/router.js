module.exports = router;

var methods = require('methods'),
    pathRegexp = require('path-to-regexp'),

    request = require('./request');

function router() {
  var app = handler,
      stack = [];

  function handler(req, res, done) {
    // console.log('incoming request', req.url);

    //FIXME: done === undefined ? req.url : req.path is a bit hackish...
    var routes = stack.filter(function (route) {
      var match;

      if (req.method.toLowerCase() === route.method) {
        match = route.path.exec(done === undefined ? req.url : req.path);

        if (match) {
          if (route.path.keys.length) {
            req.params = {};

            route.path.keys.forEach(function (key, index) {
              req.params[key.name] = match[index + 1];
            });
          }
          return true;
        }
      }

      if (route.method === null) {
        match = route.path.exec(done === undefined ? req.url : req.path);

        if (match) {
          req.path = match[1];
          return true;
        }
      }
    });

    if (routes.length === 0) {
      notFound(req, res);
    } else {
      var index = 0;

      routes[0].callback(req, res, next);
    }

    function next(err) {
      if (err) {
        if (done === undefined) {
          return res.status(500).send(err).end();
        } else {
          return done(err);
        }
      }

      if (index === routes.length) {
        return done && done();
      } else {
        index++;
        if (routes[index] === undefined) {
          notFound(req, res);
        } else {
          routes[index].callback(req, res, next);
        }
      }
    }
  }

  function notFound(req, res) {
    res.status(404).end('Not Found');
  }

  function addRoute(method, path, callback) {
    // console.log('added route', arguments);
    stack.push({
      path: pathRegexp(path),
      callback: callback,
      method: method
    });
  }

  methods.forEach(function (method) {
    app[method] = function(path, callback) {
      addRoute(method, path, callback);
    };
  });

  app.all = function all(path, callback) {
    methods.forEach(function (method) {
      addRoute(method, path, callback);
    });
  };

  app.use = function use() {
    var path, fn;

    switch (arguments.length) {
    case 1:
      if (typeof arguments[0] === 'function') {
        path = '/';
        fn = arguments[0];
      }
      break;
    case 2:
      if (typeof arguments[0] === 'string' && typeof arguments[1] === 'function') {
        path = arguments[0];
        fn = arguments[1];
      }
      break;
    default:

    }

    stack.push({
      path: new RegExp('^\\' + path + '(.*)$'),
      callback: fn,
      method: null
    });

    return this;
  };

  return app;

}
