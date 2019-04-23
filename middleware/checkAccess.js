const checkAccess = require('../lib/checkAccess');

module.exports = function (verify) {
  return async function (req, res, next) {
    try {
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

      try {
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

        req.user = await checkAccess(options);

        next();
      } catch (err) {
        err.message = err.message.replace('jwt', 'token');
        err.message = err.message.charAt(0).toUpperCase() + err.message.slice(1) + '.';

        err.status = 403;

        return next(err);
      }
    } catch (err) {
      next(err);
    }
  };
};

function getPath(uri, params) {
  uri = uri.replace(/\?.*$/, '');

  const entries = uri.split('/').filter((item) => !!item);
  let path = uri;

  const paramNames = Object.keys(params);

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    for (let j = 0; j < paramNames.length; j++) {
      const paramName = paramNames[j];

      if (entry === params[paramName]) {
        path = path.replace(entry, ':' + paramName);
      }
    }
  }

  return path;
}

function extractFrameworkVariables(req, res, next) {
  let method, params, path;

  if (arguments.length === 2) {
    // koa

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
  }
}
