function start_html_server() {
    const http = require('http');
    const fs = require('fs');

    const hostname = '0.0.0.0';
    const port = 9090;

    const server = http.createServer(function(request, response) {
        response.writeHeader(200, {"Content-Type": "text/html"});
        html = fs.readFileSync('./index.html', 'utf8');
        response.write(html);
        response.end();
    }).listen(port, hostname, () => {
        console.log("Server running at https://localhost:9090");
        console.log("Custom server");
        console.log("(This server port is listening on 9090 in Localhost as I programmed it @techsiz!)");
    });
}

start_html_server();