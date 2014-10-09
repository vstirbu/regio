module.exports = function (request, response, next) {

  request.get = function (header) {
    return request.headers[header.toLowerCase()];
  };

  request.originalUrl = request.originalUrl ? request.originalUrl : request.url;

  next();
};
