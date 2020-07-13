const next = require("next");
const http = require("http");
const url = require("url");
const path = require("path");

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    http.createServer((req, res) => {
        /* Parse request url to get its pathname */
        const parsedUrl = url.parse(req.url, true);
        const { pathname } = parsedUrl;

        /* If a service worker requested, serve it as a static file */
        if (pathname === "/service-worker.js") {
            const filePath = path.join(__dirname, ".next", pathname);
            app.serveStatic(req, res, filePath);

            /* Otherwise, let Next take care of it */
        } else {
            handle(req, res, parsedUrl);
        }
    }).listen(port, () => {
        console.log(`Listening on PORT ${port}`);
    });
});

// const { createServer } = require("http");
// const { parse } = require("url");
// const { createReadStream } = require("fs");
// const next = require("next");

// const dev = process.env.NODE_ENV !== "production";
// const app = next({ dev });
// const handle = app.getRequestHandler();
// const port = process.env.PORT || 3000;

// app.prepare().then(() => {
//     createServer((req, res) => {
//         const parsedUrl = parse(req.url, true);
//         const { pathname } = parsedUrl;

//         if (pathname === "/service-worker.js") {
//             res.setHeader("content-type", "text/javascript");
//             createReadStream("./offline/serviceWorker.js").pipe(res);
//         } else {
//             handle(req, res, parsedUrl);
//         }
//     }).listen(port, (err) => {
//         if (err) throw err;
//         console.log(`Ready on ${port}`);
//     });
// });
