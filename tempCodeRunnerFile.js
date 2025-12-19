const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const url = require("node:url");

const parseBody = require("./utils/bodyParser");
const orderController = require("./js/controllers/orderController");
const db = require("./js/database");

const host = "127.0.0.1";
const port = 7000;

// ---------- HELPERS ----------

async function getUserFromRequest(req) {
  const username = req.headers["x-user"];
  if (!username) return null;
  return db.findUserByUsername(username);
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css",
    ".js": "text/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
  };
  return mimeTypes[ext] || "application/octet-stream";
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("File not found");
    }

    res.writeHead(200, {
      "Content-Type": getContentType(filePath),
    });
    res.end(data);
  });
}

// ---------- SERVER ----------

const server = http.createServer(async (req, res) => {
  try {
    const { pathname } = url.parse(req.url, true);
    const method = req.method;

    // ---------- IMAGES ----------
    if (pathname.startsWith("/resources/static/image")) {
      const filePath = path.join(__dirname, pathname);

      return sendFile(res, filePath);
    }

    // ---------- STATIC ----------
    if (pathname.startsWith("/resources/static/")) {
      const filePath = path.join(__dirname, pathname);
      return sendFile(res, filePath);
    }
    // ---------- TEMPLATES ----------
    if (pathname.startsWith("/resources/")) {
      const filePath = path.join(__dirname, pathname);
      return sendFile(res, filePath);
    }

    // ---------- API ----------
    const authController = require("./js/controllers/authControllers");

    if (pathname.startsWith("/api")) {
      const user = await getUserFromRequest(req);

      switch (`${method} ${pathname}`) {
        case "POST /api/auth/register":
          req.body = await parseBody(req);
          return authController.register(req, res);

        case "POST /api/auth/login":
          req.body = await parseBody(req);
          return authController.login(req, res);

        case "POST /api/orders":
          req.body = await parseBody(req);
          return orderController.createOrder(req, res, user);

        case "GET /api/orders":
          return orderController.getAllOrders(req, res, user);

        case "POST /api/orders/answer":
          req.body = await parseBody(req);
          return orderController.answerOrder(req, res, user);

        default:
          res.writeHead(404);
          return res.end("API route not found");
      }
    }

    // ---------- HTML ----------
    if (method === "GET") {
      switch (pathname) {
        case "/":
        case "/index.html":
          return sendFile(
            res,
            path.join(__dirname, "/resources/templates/html/index.html")
          );

        case "/about.html":
          return sendFile(
            res,
            path.join(__dirname, "/resources/templates/html/about.html")
          );
        case "/services.html":
          return sendFile(
            res,
            path.join(__dirname, "/resources/templates/html/services.html")
          );

        case "/registration.html":
          return sendFile(
            res,
            path.join(__dirname, "/resources/templates/html/registration.html")
          );
        case "/team.html":
          return sendFile(
            res,
            path.join(__dirname, "/resources/templates/html/team.html")
          );

        case "/orders":
          return sendFile(
            res,
            path.join(
              __dirname,
              "resources",
              "templates",
              "html",
              "orders.html"
            )
          );
        case "/contacts.html":
          return sendFile(
            res,
            path.join(__dirname, "/resources/templates/html/contacts.html")
          );
        case "/approaches.html":
          return sendFile(
            res,
            path.join(__dirname, "/resources/templates/html/approaches.html")
          );

        case "/admin.html":
          return sendFile(
            res,
            path.join(__dirname, "/resources/templates/html/admin.html")
          );

        default:
          res.writeHead(404, { "Content-Type": "text/plain" });
          return res.end("Страница не найдена");
      }
    }

    res.writeHead(405);
    res.end("Method not allowed");
  } catch (err) {
    console.error(err);
    res.writeHead(500);
    res.end("Server error");
  }
});

server.listen(port, host, () => {
  console.log(`http://${host}:${port}/registration.html`);
});
