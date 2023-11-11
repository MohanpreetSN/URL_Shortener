const express = require('express');

const urlRoute = require('./routes/url')
const homeRoute = require('./routes/home')
const { connectToMongoDB } = require('./connect');
const { connect } = require('mongoose');
const URL = require('./models/url')

const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://127.0.0.1:27017/short-url')
    .then(() => console.log("mongodb connected")
    );

app.use(express.json())

app.use('/url', urlRoute);
app.use('/', homeRoute)

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
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
})


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
