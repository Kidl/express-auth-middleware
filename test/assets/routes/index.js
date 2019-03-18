const express = require('express');
const router = express.Router();

const checkAccess = require('../../../middleware/checkAccess');

router.get('/users', checkAccess, function(req, res, next) {
  res.json(req.user);
});

router.get('/users/:username', checkAccess, function(req, res, next) {
  res.json(req.user.username);
});

module.exports = router;
