/* eslint-disable no-console */
const express = require('express');
const next = require('next');
const compression = require('compression');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    if (process.argv[2] === '--gzip') {
      server.use(compression());
      console.log('> Gzip enabled!');
    }

    server.get('/blog/:id', (req, res) => {
      const actualPage = '/blog/post';
      const queryParams = { title: '-- no title (rendered by server) --' };
      app.render(req, res, actualPage, queryParams);
    });

    server.get('/tv-shows/:id', (req, res) => {
      const actualPage = '/tv-shows/post';
      const queryParams = { id: req.params.id };
      app.render(req, res, actualPage, queryParams);
    });

    server.get('/abc/:slug', (req, res) => {
      const actualPage = '/abc';
      const queryParams = { slug: req.params.slug };
      app.render(req, res, actualPage, queryParams);
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, err => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000');
      console.log(`> NODE_ENV: ${process.env.NODE_ENV}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
