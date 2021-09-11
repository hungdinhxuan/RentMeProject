const express = require('express');
const socket = require('./utils/socket');
require('dotenv').config();
require('./services/mongo')();

const app = express();

app.get('/api', (req, res) => {
  return res.send(`<h1>server is running with bucket ${process.env.AWS_S3_BUCKET_NAME}</h1>`);
});

app.listen(4000);
socket(app)