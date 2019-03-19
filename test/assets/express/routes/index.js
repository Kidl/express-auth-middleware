const express = require('express');
const router = express.Router();

const checkAccess = require('../../../../middleware/checkAccess')();
const checkAccessWithVerify = require('../../../../middleware/checkAccess')(getUserAsync);

router.get('/users', checkAccess, (req, res, next) => {
  res.json(req.user);
});

router.get('/users/:username', checkAccessWithVerify, (req, res, next) => {
  res.json(req.user.username);
});

module.exports = router;

async function getUserAsync(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data);
    }, 100);
  });
}
