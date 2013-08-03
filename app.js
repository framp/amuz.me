var http = require('http'),
        fs = require('fs');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<html><head><script src="http://code.jquery.com/jquery-1.10.0.js"></script></head><body><script>' + fs.readFileSync('./player.js') + '</script></body></html>');
}).listen(3001);
