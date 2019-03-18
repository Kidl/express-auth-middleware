const Koa = require('koa');
const app = new Koa();

const routes = require('./routes');

app.use(routes);

app.on('error', (err, ctx) => {
  ctx.status = err.status || 500;

  ctx.body = err;
});

module.exports = app;
