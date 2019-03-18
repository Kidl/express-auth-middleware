const jwt = require('jsonwebtoken');
const parseScope = require('./parseScope');

async function checkAccess(options) {
  const token = options.token;
  const secret = options.secret;

  const service = options.service;

  const method = options.method;
  const route = options.route;
  const params = options.params;

  const verify = options.verify;

  let user, userScope;

  try {
    user = jwt.verify(token, secret);
  } catch (err) {
    return false;
  }

  if (verify) {
    user = await verify(user);
  }

  userScope = parseScope(user.scope);

  if (
    (!userScope.service || userScope.service === service)
    && (!userScope.method || userScope.method === method)
    && (userScope.route === 'all' || userScope.route === route)
    && (!userScope.paramname || userScope.paramname === Object.keys(params)[0])
  ) {
    return user;
  } else {
    return false;
  }
}

module.exports = checkAccess;
