module.exports = function (app) {
  return function (req, res, next) {

    // console.log('req has socket', req.socket !== undefined, req.socket);

    req._socket = req._socket || {};
    req._socket.address = function () {
      return app.address;
    };

    next();
  };
};
