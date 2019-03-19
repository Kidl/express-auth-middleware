const checkAccess = require('../lib/checkAccess');

module.exports = function (verify) {
  return async function (req, res, next) {
    try {
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
      } else {
        // express

        method = Object.keys(req.route.methods)[0];
        params = req.params;
        route = req.route.path.replace(/\//g, '').split(':')[0];
      }

      const token = req.headers['x-access-token'];

      let user;

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

        user = await checkAccess(options);

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
