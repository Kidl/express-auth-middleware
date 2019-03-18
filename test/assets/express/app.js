const express = require('express');
const app = express();
const routes = require('./routes');

app.use(routes);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;

  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  res.json(err);
});

module.exports = app;
