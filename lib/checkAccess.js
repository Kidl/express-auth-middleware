const jwt = require('jsonwebtoken');
const cryptographer = require('./cryptographer');

function checkAccess(options) {
  return new Promise((resolve, reject) => {
    const token = options.token;
    const secret = options.secret;

    const service = options.service;

    const method = options.method;
    const path = options.path;

    const verify = options.verify || function(user) {
      return user;
    };

    let user;

    try {
      user = jwt.verify(token, secret);
    } catch (err) {
      return reject(err);
    }

    if (process.env.CRYPTO_SECRET) {
      user = cryptographer.decrypt(user.body);
      user = JSON.parse(user);
    }

    Promise.resolve(verify(user)).then((verifiedUser) => {
      user = verifiedUser || {};
      user.scope = user.scope || {};

      const methods = user.scope[service] || user.scope.default || {};
      const routes = methods[method] || methods.default || [];

      for (let i = 0; i < routes.length; i++) {
        const route = new RegExp(routes[i]);

        if (path.match(route)) {
          delete user.scope;
          delete user._id;

          resolve(user);
        }
      }

      throw new Error(`You cannot perform ${method} to ${path}`);
    }).catch((err) => {
      reject(err);
    });
  });
}

module.exports = checkAccess;
