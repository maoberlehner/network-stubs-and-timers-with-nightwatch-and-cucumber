#!/usr/bin/env node

const express = require(`express`);
const compression = require(`compression`);
const cookieParser = require(`cookie-parser`);
const fs = require(`fs`);
const path = require(`path`);

const { IDENTIFIERS, PORT } = require(`../conf`);

const rootPath = path.resolve(__dirname, `..`, `..`);
const publicPath = path.join(rootPath, `public`);

const app = express();

app.use(compression());
app.use(cookieParser());
app.use(`/`, express.static(publicPath, { index: false }));

app.get(`/*`, (request, response) => {
  fs.readFile(path.join(publicPath, `index.html`), { encoding: `utf-8` }, (error, indexSource) => {
    const networkStubs = request.cookies[IDENTIFIERS.network] === `1`;
    const timers = request.cookies[IDENTIFIERS.timers] === `1`;
    let html = indexSource;

    if (networkStubs) {
      html = html.replace(`<head>`, `<head><script src="/dist/network-stubs.js"></script>`);
    }

    if (timers) {
      html = html.replace(`<head>`, `<head><script src="/dist/timers.js"></script>`);
    }

    response.send(html);
  });
});

app.listen(PORT);
