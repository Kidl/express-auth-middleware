const checkAccess = require('../../../../middleware/checkAccess')();
const checkAccessWithVerify = require('../../../../middleware/checkAccess')(getUserAsync);

async function routes (fastify, options) {
  fastify.get('/users', {
    preHandler: checkAccess,
  }, async (request, reply) => {
    return request.user;
  });

  fastify.get('/users/:username', {
    preHandler: checkAccessWithVerify,
  }, async (request, reply) => {
    return request.user.username;
  });
}

module.exports = routes;

async function getUserAsync(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data);
    }, 100);
  });
}
