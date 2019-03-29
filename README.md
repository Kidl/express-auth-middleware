## Install
`yarn add @kidl.no/express-auth-middleware`

## Usage
Token passed through header `x-access-token`

### Express
```javascript
const express = require('express');
const router = express.Router();
const checkAccess = require('@kidl.no/express-auth-middleware')();
const checkAccessWithVerify = require('@kidl.no/express-auth-middleware')(getUserAsync);

router.get('/users', checkAccess, function(req, res, next) {
  // `req.user` is decoded json web token
  res.json(req.user);
});

router.get('/users/:username', checkAccessWithVerify, function(req, res, next) {
  // `req.user` is user object from function `getUserAsync`
  res.json(req.user.username);
});

async function getUserAsync(data) {
  // 'data' is decoded json web token
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data);
    }, 100);
  });
}
```

### Koa
```javascript
const Router = require('koa-router');
const router = new Router();
const checkAccess = require('@kidl.no/express-auth-middleware')();
const checkAccessWithVerify = require('@kidl.no/express-auth-middleware')(getUserAsync);

router.get('/users', checkAccess, async (ctx) => {
  // `ctx.req.user` is decoded json web token
  ctx.body = ctx.req.user;
});

router.get('/users/:username', checkAccessWithVerify, async (ctx) => {
  // `req.user` is user object from function `getUserAsync`
  ctx.body = ctx.req.user.username;
});

async function getUserAsync(data) {
  // 'data' is decoded json web token
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data);
    }, 100);
  });
}
```

### Fastify
```javascript
const fastify = require('fastify')();
const checkAccess = require('@kidl.no/express-auth-middleware')();
const checkAccessWithVerify = require('@kidl.no/express-auth-middleware')(getUserAsync);

async function routes (fastify, options) {
  fastify.get('/users', {
    preHandler: checkAccess,
  }, async (request, reply) => {
    return request.user;
  });

  fastify.get('/users/:username', {
    preHandler: checkAccessWithVerify,
  }, async (request, reply) => {
    return request.user.username;
  });
}

fastify.register(routes);

async function getUserAsync(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data);
    }, 100);
  });
}
```

### Scopes explanation
https://kidlno.atlassian.net/wiki/spaces/KIDL/pages/26181648/JWT-auth
