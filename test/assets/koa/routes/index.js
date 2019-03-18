const Router = require('koa-router');
const router = new Router();

const checkAccess = require('../../../../middleware/checkAccess')();
const checkAccessWithVerify = require('../../../../middleware/checkAccess')(getUserAsync);

router.get('/users', checkAccess, async (ctx) => {
  ctx.body = ctx.req.user;
});

router.get('/users/:username', checkAccessWithVerify, async (ctx) => {
  ctx.body = ctx.req.user.username;
});

module.exports = router.routes();

async function getUserAsync(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data);
    }, 100);
  });
}
