const checkAccess = require('../lib/checkAccess');

module.exports = function (verify) {
  return async function (req, res, next) {
    try {
      const variables = extractFrameworkVariables.apply(this, arguments);

      const { method, params, route } = variables;

      req = variables.req;
      res = variables.res;
      next = variables.next;

      const token = req.headers['x-access-token'];

      if (typeof token === 'undefined') {
        const err = new Error('Unauthorized');
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
          route,
          params,

          verify,
        };

        const user = await checkAccess(options);

        if (user) {
          req.user = user;

          next();
        } else {
          const err = new Error('Forbidden');
          err.status = 403;

          return next(err);
        }
      } catch (err) {
        const error = new Error('Forbidden');
        error.status = 403;

        return next(error);
      }
    } catch (err) {
      next(err);
    }
  };
};

function getPath(uri, params) {
  const entries = uri.split('/');
  let path = uri;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    for (let j = 0; j < params.length; j++) {
      const key = params[i];

      if (entry === params[key]) {
        path = path.replace(entry, ':' + key);
      }
    }
  }

  return path;
}

function extractFrameworkVariables(req, res, next) {
  let method, params, route;

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
    route = getPath(req.url, params).replace(/\//g, '').split(':')[0];
  } else {
    if (req.raw) {
      // fastify conversions for express

      req.route = {};
      req.route.methods = [req.raw.method.toLowerCase()];
      req.route.path = getPath(req.raw.originalUrl, req.params);
    }

    // express

    method = Object.keys(req.route.methods)[0];
    params = req.params;
    route = req.route.path.replace(/\//g, '').split(':')[0];
  }

  return {
    req,
    res,
    next,
    method,
    params,
    route,
  }
}
