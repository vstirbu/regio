module.exports = function (app) {
  return function (request, response, next) {

    request.get = function (header) {
      return request.headers[header.toLowerCase()];
    };

    request.port = request.port ? request.port : app._server.address().port;

    request.originalUrl = request.originalUrl ? request.originalUrl : request.url;

    next();
  };
};
