 exports.standardResponse = function() {
    var response = {};
    response.code = 200;
    response.header = "{ 'Content-Type': 'text/html' }";
    response.text = "OK";
    return (response);
};

exports.errorResponse = function(err) {
    var response = {};
    response.header = "{ 'Content-Type': 'text/html' }";
    response.text = "{ 'error': '" + err + "' }";
    response.code = 500;
    return (response);
};

exports.respond = function(res, response) {
    res.writeHead(response.code, response.header);
    res.write(response.text);
    res.end();
};
