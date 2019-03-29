const jwt = require('jsonwebtoken');

async function checkAccess(options) {
  const token = options.token;
  const secret = options.secret;

  const service = options.service;

  const method = options.method;
  const path = options.path;

  const verify = options.verify;

  let user;

  try {
    user = jwt.verify(token, secret);
  } catch (err) {
    return false;
  }

  if (verify) {
    user = await verify(user);
  }

  user = user || {};
  user.scope = user.scope || {};

  const methods = user.scope[service] || user.scope['default'] || {};
  const routes = methods[method] || methods['default'] || [];

  for (let i = 0; i < routes.length; i++) {
    const route = new RegExp(routes[i]);

    if (path.match(route)) {
      return user;
    }
  }

  return false;
}

module.exports = checkAccess;
