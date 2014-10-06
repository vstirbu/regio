module.exports = function (response) {

  response.status = function (status) {
    response.statusCode = status;
    return response;
  };

  response.send = function (message) {
    // console.log('message type', typeof message);
    switch (typeof message) {
      case 'object':
        response.set('Content-Type', 'application/json');
        response.write(JSON.stringify(message));
        break;
      default:
        response.set('Content-Type', 'text/plain');
        response.write(message);
    }
    return response;
  };

  response.set = function (header, value) {
    response.setHeader(header, value);
  };

  response.get = function (header) {
    return response.getHeader(header);
  };

};
