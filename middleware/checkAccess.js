const checkAccess = require('../lib/checkAccess');

module.exports = function (verify) {
  return function (req, res, next) {
    const variables = extractFrameworkVariables.apply(this, arguments);

    const { method, params, path } = variables;

    req = variables.req;
    res = variables.res;
    next = variables.next;

    const token = req.headers['x-access-token'];

    if (typeof token === 'undefined') {
      const err = new Error('Token is missing.');
      err.status = 401;

      return next(err);
    }

    const secret = process.env.JWT_SECRET;
    const service = process.env.SERVICE_NAME;

    const options = {
      token,
      secret,

      service,
      method,
      path,
      params,

      verify,
    };

    if (variables.framework === 'koa') {
      return resolve();
    } else {
      resolve();
    }

    function resolve() {
      return Promise.resolve(checkAccess(options)).then((user) => {
        req.user = user;

        next();
      }).catch((err) => {
        err.message = err.message.replace('jwt', 'token');
        err.message = `${err.message.charAt(0).toUpperCase() + err.message.slice(1)}.`;

        err.status = 403;

        next(err);
      });
    }
  };
};

function getPath(uri, params) {
  uri = uri.replace(/\?.*$/, '');

  const entries = uri.split('/').filter(item => !!item);
  let path = uri;

  const paramNames = Object.keys(params);

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    for (let j = 0; j < paramNames.length; j++) {
      const paramName = paramNames[j];

      if (entry === params[paramName]) {
        path = path.replace(entry, `:${paramName}`);
      }
    }
  }

  return path;
}

function extractFrameworkVariables(req, res, next) {
  let method, params, path, framework;

  framework = 'express';

  if (arguments.length === 2) {
    // koa

    framework = 'koa';

    const context = req;

    req = req.req;

    next = (err) => {
      if (err) {
        throw err;
      } else {
        res();
      }
    };

    method = req.method.toLowerCase();
    params = context.params;
    path = getPath(req.url, params);
  } else {
    if (req.raw) {
      // fastify conversions for express

      req.route = {};
      req.route.methods = {};
      req.route.methods[req.raw.method.toLowerCase()] = true;
      req.route.path = getPath(req.raw.originalUrl, req.params);

      framework = 'fastify';
    }

    method = Object.keys(req.route.methods)[0];
    params = req.params;
    path = req.route.path;
  }

  return {
    req,
    res,
    next,
    method,
    params,
    path,
    framework,
  };
}
