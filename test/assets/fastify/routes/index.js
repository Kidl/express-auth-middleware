const checkAccess = require('../../../../middleware/checkAccess')();
const checkAccessWithVerify = require('../../../../middleware/checkAccess')(getUserAsync);

async function routes(fastify, options) {
  fastify.route({
    method: 'GET',
    url: '/users',
    preHandler: checkAccess,
    handler: async (request, reply) => {
      async function test() {
        return new Promise((resolve, reject) => {
          setTimeout(() => resolve(request.user), 100);
        });
      }

      const response = await test();

      return response;
    },
  });

  fastify.route({
    method: 'GET',
    url: '/users/:username',
    preHandler: checkAccessWithVerify,
    handler: async (request, reply) => {
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => resolve(request.user.username), 100);
      });

      return response;
    }
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
