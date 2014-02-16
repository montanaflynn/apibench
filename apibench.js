apibench('httpbin.org', '/stream/50', 80, 'GET');

function apibench(baseurl, endpoint, port, method) {
  var http = require('http');
  var options = {
    hostname: baseurl,
    path: endpoint,
    port: (port) ? port : 80,
    method: (method) ? method : 'GET',
  };

  var callback = function(response) {

    var body = '';
    var initialResponseTime = 0;
    var TTFB = 0;

    response.on('error', function(err) {
      console.log(err);
    });

    response.on('data', function(chunk) {
      if (initialResponseTime === 0) {
        initialResponseTime = Date.now();
        TTFB = initialResponseTime - beginTime;
      }
      body += chunk;
    });

    response.on('end', function() {
      var endTime = Date.now();
      var RTL = endTime - beginTime;

      console.info(method, "API: " + baseurl + endpoint + " PORT: " + port);
      console.log("Bytes Sent: ", response.socket._bytesDispatched);
      console.log("Bytes Recieved: ", response.socket.bytesRead);
      console.log("Resonse Status Code: ", response.statusCode);
      console.log("Round Trip Latency: " + RTL + "ms");
      console.log("Time To First Byte: " + TTFB + "ms");
    });
  }

  var beginTime = Date.now();
  var req = http.request(options, callback).end();

}