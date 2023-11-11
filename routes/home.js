const express = require('express');
const router = express.Router();

const { handleRedirectShortUrl } = require('../controllers/home')

router.get('/:shortId', handleRedirectShortUrl)

module.exports = router;