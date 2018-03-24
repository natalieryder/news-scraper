// require express router
const express = require('express');
const router = express.Router();

// require each of the modules
const home = require('./home.js');
const saved = require('./saved.js');

// map the routes to the modules
router.get('/', home);

router.get('/saved', saved);

module.exports = router;