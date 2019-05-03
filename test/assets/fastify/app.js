const fastify = require('fastify')();

const routes = require('./routes');

fastify.register(routes);

fastify.listen();

module.exports = fastify.server;
