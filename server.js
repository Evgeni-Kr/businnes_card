const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const url = require('node:url');

const host = '127.0.0.1';
const port = 7000;

function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml'
    };
    return mimeTypes[ext] || 'text/plain';
}

function sendFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.statusCode = 404;
            res.end('File not found');
            return;
        }
        res.setHeader('Content-Type', contentType);
        res.end(data);
    });
}

function sendJson(res, data, statusCode = 200) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = statusCode;
    res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    if (pathname.startsWith('/css/')) {
        const cssPath = path.join(__dirname, pathname);
        const contentType = getContentType(cssPath);
        sendFile(res, cssPath, contentType);
        return;
    }

    if (pathname === '/api/users') {
        if (method === 'GET') {
            sendJson(res, { message: 'Get users' });
        } else if (method === 'POST') {
            sendJson(res, { message: 'Create user' });
        } else {
            res.statusCode = 405;
            res.end('Method not allowed');
        }
        return;
    }

    if (pathname === '/' && method === 'GET') {
        const indexPath = path.join(__dirname, 'html', 'index.html');
        sendFile(res, indexPath, 'text/html');
        return;
    }

    res.statusCode = 404;
    res.end('Not found');
});

server.listen(port, host, () => {
    console.log(`Server listens http://${host}:${port}`);
});

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server stopped');
        process.exit(0);
    });
});