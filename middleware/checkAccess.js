const checkAccess = require('../lib/checkAccess');

module.exports = function(req, res, next) {
  try {
    const method = Object.keys(req.route.methods)[0];
    const params = req.params;
    const route = req.route.path.replace(/\//g, '').split(':')[0];

    let token = req.headers['x-access-token'];

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
        params
      };

      user = checkAccess(options);

      if (user) {
        req.user = user;

        next();
      } else {
        const err = new Error('Forbidden');
        err.status = 403;

        return next(err);
      }
    } catch (err) {
      err = new Error('Forbidden');
      err.status = 403;

      return next(err);
    }
  } catch (err) {
    next(err);
  }
};
