const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Account verification with JWT, Redis, NodeJS' });
});

module.exports = router;
