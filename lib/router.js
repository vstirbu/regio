module.exports = router;

var events = require('events'),
    methods = require('methods'),
    pathRegexp = require('path-to-regexp');

function router() {
  var app = handler,
      stack = [],
      emitter = new events.EventEmitter();

  for (var prop in emitter) {
    propProxy(handler, emitter, prop);
  }

  //NOTE: pending https://github.com/tessel/runtime/issues/487
  if (process.platform === 'tessel') {
    ['emit', 'on', 'once'].forEach(function (prop) {
      propProxy(handler, emitter, prop);
    });
  }

  function propProxy(target, source, prop) {
    target[prop] = function () {
      return source[prop].apply(source, arguments);
    };
  }

  app.on('mount', function (parent, path) {
    app.mountpath = path;
    console.log('mounted at', path);
  });
  });
  
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
        if (route.callback.mountpath === req.url && req.url[req.url.length - 1] !== '/') {
          req.url = req.url + '/';
        }
        match = route.path.exec(done === undefined ? req.url : req.path);
        // console.log('*** next route is router', !!route.callback.use);
        // console.log('in app', done === undefined, match);
        // console.log('match use', route.path, req.url, req.path);
        // console.log('mounted router', route.callback.mountpath);

        if (match) {
          if (route.callback.mountpath) {
            req.path = match[1] ? match[1] : '/';
          }
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
    // console.log('>>> path', path);
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
    case 1: // middleware
      if (typeof arguments[0] === 'function') {
        // path = '/';
        fn = arguments[0];

        stack.push({
          path: new RegExp('.*'),
          callback: fn,
          method: null
        });
      }
      break;
    case 2: // router
      if (typeof arguments[0] === 'string' && typeof arguments[1] === 'function') {
        path = arguments[0];
        fn = arguments[1];
      }

      stack.push({
        // path: new RegExp('^\\' + path + '(\\/.*)(?=\\/|$)'),
        path: new RegExp('^\\' + path + '(\\/.*)'),
        callback: fn,
        method: null
      });

      // fn.mountpath = path;
      fn.emit('mount', app, path);
      break;
    default:

    }

    return this;
  };

  return app;
}
