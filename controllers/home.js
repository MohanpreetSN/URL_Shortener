const crypto = require('crypto');
const { createClient, redis } = require('redis');

const URL = require('../models/url')

const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));

//NOTE: The official docs show the usage of this function to create keys for storing data in Redis
// This is useful for complex search criteria composed of multiple individual criterion
//However in our use case, we already have a single id for the short Url which is used for searching the DB.
//So I've chosen to not use this because this would unnecessarily  add to the latency
function getHashKey(searchCriteria) {
    return crypto
        .createHash('sha1')
        .update(JSON.stringify(searchCriteria))
        .digest('hex');
}

async function handleRedirectShortUrl(req, res) {
    const shortId = req.params.shortId;

    await client.connect();
    const cachedValue = await client.get(shortId)

    if (!!cachedValue) {
        console.log('Cache HIT');
        res.redirect(cachedValue);
        return
    }

    console.log('Cache MISS');

    const entry = await URL.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now()
                },
            }
        }
    );
    res.redirect(entry.redirectURL);
}

module.exports = {
    handleRedirectShortUrl
}