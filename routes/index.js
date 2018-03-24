const db = require("../models");
const express = require('express');
const router = express.Router();
const api = require('./api');
const views = require('./views');

router.use(api);
router.use(views);

module.exports = router;
