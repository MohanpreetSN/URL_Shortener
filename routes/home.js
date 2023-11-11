const express = require('express');
const { createClient } = require('redis');

const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
client.connect();

const router = express.Router();

const { handleRedirectShortUrl } = require('../controllers/home')

router.get('/:shortId', (req, res) => {
    handleRedirectShortUrl(req, res, client)
})

module.exports = router;