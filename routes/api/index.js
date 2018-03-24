const express = require('express');
const router = express.Router();

const test = require('./test.js');
const scrape = require('../../scripts/scrape.js');
const headlines = require('./headlines.js');
const putheadlines = require('./putheadlines.js');
const notes = require('./notes');

router.get('/test', test);

router.get('/scrape', scrape);

router.get('/api/headlines', headlines);
// router.use(scrape);
router.put('/api/headlines', putheadlines);

router.get('/api/notes/:id', notes.get);

router.delete('/api/notes', notes.deletepost);

router.post('/api/notes/', notes.post);

module.exports = router;