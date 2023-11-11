const express = require('express');
// const { createClient } = require('redis');

const urlRoute = require('./routes/url')
const homeRoute = require('./routes/home')
const { connectToMongoDB } = require('./connect');
const { connect } = require('mongoose');
const URL = require('./models/url')

const app = express();
const PORT = 1212;

// NOTE: This part of the code is to make nginx work, however, it needs to be setup in the environment.
// const PORT = process.env.PORT;
//Define the PORT variables 1212,1313,1414 for different consoles.


connectToMongoDB('mongodb://127.0.0.1:27017/short-url')
    .then(() => console.log("mongodb connected")
    );


// const client = createClient();
// client.on('error', err => console.log('Redis Client Error', err));
// client.connect();


app.use(express.json())

app.use('/url', urlRoute);
app.use('/', homeRoute)


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

