var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    url = require("url"),
    error404 = fs.readFileSync('404.html'),
    html = fs.readFileSync('index.html');

var log = function (entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

var server = http.createServer(function (req, res) {
    console.log("req.url = ", req.url);
    
    if (req.method === 'POST') {
        var body = '';

        req.on('data', function (chunk) {
            body += chunk;
        });

        req.on('end', function () {
            if (req.url === '/') {
                log('Received message: ' + body);
            } else if (req.url = '/scheduled') {
                log('Received task ' + req.headers['x-aws-sqsd-taskname'] + ' scheduled at ' + req.headers['x-aws-sqsd-scheduled-at']);
            }

            res.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });
            res.end();
        });
    } else {
        res.writeHead(200);
        if (req.url === '/') {
            res.write(html);
        } else {
            var pathname = url.parse(req.url).pathname;
            console.log("pathname = ", pathname);
            
            try {
                var file = fs.readFileSync("." + pathname);
                console.log("正常获取路由文件");
                
                res.write(file);
            } catch (error) {
                //没有此路由，那就是404页面了
                console.log("获取404 = ", error, error404);
                res.write(error404);
            }
        }
        res.end();
    }
});

// Listen on port 3000, IP defaults to 127.0.0.1
server.listen(port);

// Put a friendly message on the terminal
console.log('Server running at http://127.0.0.1:' + port + '/');
